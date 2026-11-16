/**
 * A script that runs while the HTML is parsed, before the first paint, to
 * correct server-rendered markup from what only the browser knows (used by
 * the Opening). From node_modules/next/dist/docs/01-app/02-guides/
 * preventing-flash-before-hydration.md: the server emits a runnable script,
 * the client renders an inert text/plain one (React warns about rendering
 * scripts on the client), and suppressHydrationWarning accepts the type
 * difference.
 *
 * The script runs on full page loads only. Elements it changes need
 * suppressHydrationWarning, and client-side navigations need their own path.
 * Only pass code written in this repository, never user input.
 */
export function InlineScript({ html, id }: { html: string; id?: string }) {
  return (
    <script
      id={id}
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default InlineScript;
