"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Mini node/edge workflow graph: signal → logic map → approval gate → sync →
 * outputs. A pulse travels the spine; the approval gate is the highlighted
 * decision point (the brand differentiator).
 */
export default function WorkflowDiagram({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const uid = useId();

  const nodes = [
    { x: 30, label: "Signal" },
    { x: 130, label: "Logic map" },
    { x: 230, label: "Approval" },
    { x: 330, label: "Sync" },
    { x: 430, label: "Outputs" },
  ];

  return (
    <svg
      aria-hidden
      viewBox="0 0 460 120"
      className={className}
      fill="none"
    >
      {/* spine */}
      <line
        x1={nodes[0].x}
        y1="52"
        x2={nodes[4].x}
        y2="52"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
      />
      {/* traveling pulse */}
      {!prefersReduced && (
        <circle r="3" fill="var(--mk-accent)" opacity="0.9">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path={`M ${nodes[0].x} 52 L ${nodes[4].x} 52`}
          />
        </circle>
      )}
      {nodes.map((node, i) => {
        const isGate = i === 2;
        return (
          <g key={node.label}>
            {isGate ? (
              <>
                <rect
                  x={node.x - 14}
                  y={38}
                  width="28"
                  height="28"
                  rx="7"
                  fill="var(--mk-accent-a10)"
                  stroke="var(--mk-accent)"
                  strokeWidth="1.5"
                  transform={`rotate(45 ${node.x} 52)`}
                />
                {/* check mark inside the gate */}
                <path
                  d={`M ${node.x - 5} 52 l 3.5 3.5 l 7 -7`}
                  stroke="var(--mk-accent)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              <>
                <circle
                  cx={node.x}
                  cy="52"
                  r="9"
                  fill="var(--mk-surface-3)"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1.5"
                />
                <circle cx={node.x} cy="52" r="3" fill="var(--mk-text-2)" />
              </>
            )}
            <text
              x={node.x}
              y={isGate ? 92 : 84}
              textAnchor="middle"
              fill={isGate ? "var(--mk-accent)" : "var(--mk-text-3)"}
              style={{
                font: "500 9px var(--font-plex-mono), monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {node.label}
            </text>
            {isGate && (
              <text
                x={node.x}
                y={104}
                textAnchor="middle"
                fill="var(--mk-text-3)"
                style={{
                  font: "400 8px var(--font-plex-mono), monospace",
                  letterSpacing: "0.08em",
                }}
              >
                partner sign-off
              </text>
            )}
          </g>
        );
      })}
      {/* soft glow behind the gate */}
      <circle cx="230" cy="52" r="26" fill={`url(#${uid}-glow)`} />
      <defs>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0%" stopColor="var(--mk-accent)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--mk-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
