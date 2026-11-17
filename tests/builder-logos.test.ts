import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { BUILDERS } from "../src/lib/builders-data";

/**
 * A builder logo that is see-through and drawn in white vanishes on a white
 * tile. The homepage carousel can read the file and notice; the builders
 * page logo wall also renders in the browser (the portal wizard), where it
 * cannot, so the builder list carries `darkTile: true` for such a logo. This
 * keeps the list honest when a logo is added or replaced.
 */
test("builder logos: darkTile matches the logo file (white and see-through)", () => {
  const meta = JSON.parse(readFileSync(new URL("../src/generated/images-meta.json", import.meta.url), "utf8")) as {
    images: Record<string, { color?: string; alpha?: boolean }>;
  };
  for (const builder of BUILDERS) {
    const file = meta.images[builder.logo];
    assert.ok(file, `${builder.name}: ${builder.logo} is not in public/images (check the path in src/lib/builders-data.ts)`);
    const white = Boolean(file.alpha && file.color?.toLowerCase() === "#ffffff");
    assert.equal(
      Boolean(builder.darkTile),
      white,
      white
        ? `${builder.name}: the logo is white on a see-through background. Add "darkTile: true" to its line in src/lib/builders-data.ts so it shows on a navy tile.`
        : `${builder.name}: the logo is not a white see-through file. Remove "darkTile: true" from its line in src/lib/builders-data.ts.`,
    );
  }
});
