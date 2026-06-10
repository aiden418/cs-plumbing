import { type ReactNode } from "react";
import PipelineFlow from "./PipelineFlow";

/**
 * Server wrapper that gives the gold pipeline overlay a shared positioning
 * context across the Hero → StatsBar → ServiceHighlights run. Children stay
 * server-rendered; only the decorative overlay is a client component.
 */
export default function PipelineSection({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <PipelineFlow />
    </div>
  );
}
