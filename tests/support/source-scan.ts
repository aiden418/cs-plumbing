/**
 * Shared by the source-guard tests. Reads the TypeScript sources with the
 * compiler's own parser, so an import is never matched by a loose regex and
 * text that only appears in a comment is not mistaken for code.
 *
 * Not a test itself: `npm test` only runs files named *.test.ts.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SRC = path.join(ROOT, "src");

/** Repo-relative path with forward slashes, for messages and baselines. */
export const rel = (file: string): string => path.relative(ROOT, file).split(path.sep).join("/");

export function parseSource(file: string): ts.SourceFile {
  return ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

export interface ModuleImport {
  specifier: string;
  /** `import type …`, `export type … from`, or only `type` specifiers: erased at build time. */
  typeOnly: boolean;
  /** `import("…")` or `require("…")` somewhere in the module body, not a declaration. */
  dynamic: boolean;
  line: number;
}

/**
 * Every module a file loads, in source order: import and re-export
 * declarations, plus `import("…")` and `require("…")` calls whose argument is
 * a plain string.
 */
export function importsOf(source: ts.SourceFile): ModuleImport[] {
  const out: ModuleImport[] = [];
  const add = (specifier: ts.Node, typeOnly: boolean, dynamic: boolean) => {
    if (!ts.isStringLiteralLike(specifier)) return;
    out.push({
      specifier: specifier.text,
      typeOnly,
      dynamic,
      line: source.getLineAndCharacterOfPosition(specifier.getStart(source)).line + 1,
    });
  };
  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node)) {
      const clause = node.importClause;
      const named = clause?.namedBindings;
      const onlyTypeSpecifiers =
        clause !== undefined &&
        clause.name === undefined &&
        named !== undefined &&
        ts.isNamedImports(named) &&
        named.elements.length > 0 &&
        named.elements.every((e) => e.isTypeOnly);
      add(node.moduleSpecifier, clause?.isTypeOnly === true || onlyTypeSpecifiers, false);
      return;
    }
    if (ts.isExportDeclaration(node)) {
      if (node.moduleSpecifier) add(node.moduleSpecifier, node.isTypeOnly, false);
      return;
    }
    if (ts.isImportEqualsDeclaration(node)) {
      if (ts.isExternalModuleReference(node.moduleReference)) {
        add(node.moduleReference.expression, node.isTypeOnly, false);
      }
      return;
    }
    if (ts.isCallExpression(node) && node.arguments.length === 1) {
      const callee = node.expression;
      const isImportCall = callee.kind === ts.SyntaxKind.ImportKeyword;
      const isRequireCall = ts.isIdentifier(callee) && callee.text === "require";
      if (isImportCall || isRequireCall) add(node.arguments[0], false, true);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return out;
}

const RESOLVE_SUFFIXES = ["", ".ts", ".tsx", ".mts", ".js", ".mjs", ".json", "/index.ts", "/index.tsx"];

/**
 * Resolves a project import ("./x", "../x" or the "@/x" alias for src/x) to a
 * file. Returns null for packages and Node built-ins, and "unresolved" for a
 * project specifier that points at nothing.
 */
export function resolveImport(fromFile: string, specifier: string): string | null | "unresolved" {
  let base: string;
  if (specifier.startsWith("@/")) base = path.join(SRC, specifier.slice(2));
  else if (specifier.startsWith(".")) base = path.resolve(path.dirname(fromFile), specifier);
  else return null;
  for (const suffix of RESOLVE_SUFFIXES) {
    const candidate = base + suffix;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return "unresolved";
}
