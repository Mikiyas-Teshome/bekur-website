"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

/**
 * Workflow-network scene: an input cluster on the left feeds a central
 * approval-gate node which fans out to outputs on the right. Bright pulses
 * travel along the edges; the whole group drifts gently and parallaxes with
 * the pointer. Glow is faked with an additive sprite texture — no
 * postprocessing, to keep the chunk small and the GPU cost low.
 */

const ACCENT = new THREE.Color("#4a9eff");
const DEEP = new THREE.Color("#214a9c");
const WHITE = new THREE.Color("#f2f2f5");

type Graph = {
  positions: Float32Array;
  colors: Float32Array;
  sizesPhase: Float32Array;
  edgePositions: Float32Array;
  pulsePaths: { from: THREE.Vector3; to: THREE.Vector3 }[];
};

function buildGraph(): Graph {
  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  const inputs: THREE.Vector3[] = [];
  for (let i = 0; i < 70; i++) {
    inputs.push(
      new THREE.Vector3(rand(-6.5, -2.2), rand(-2.4, 2.4), rand(-2.5, 1.5)),
    );
  }

  const gate = new THREE.Vector3(0, 0.1, 0);

  const outputs: THREE.Vector3[] = [];
  for (let i = 0; i < 70; i++) {
    const spread = rand(0, 1);
    outputs.push(
      new THREE.Vector3(
        rand(2.2, 6.5),
        rand(-2.6, 2.6) * (0.5 + spread),
        rand(-2.5, 1.5),
      ),
    );
  }

  const all = [...inputs, gate, ...outputs];
  const positions = new Float32Array(all.length * 3);
  const colors = new Float32Array(all.length * 3);
  const sizesPhase = new Float32Array(all.length);

  all.forEach((p, i) => {
    positions.set([p.x, p.y, p.z], i * 3);
    const isGate = i === inputs.length;
    const color = isGate
      ? ACCENT
      : Math.random() < 0.25
        ? ACCENT
        : Math.random() < 0.4
          ? DEEP
          : WHITE;
    const dim = isGate ? 1 : rand(0.25, 0.7);
    colors.set([color.r * dim, color.g * dim, color.b * dim], i * 3);
    sizesPhase[i] = rand(0, Math.PI * 2);
  });

  // Sparse edges: a subset of inputs → gate → a subset of outputs
  const edges: THREE.Vector3[] = [];
  const pulsePaths: Graph["pulsePaths"] = [];
  inputs.forEach((p, i) => {
    if (i % 3 === 0) {
      edges.push(p, gate);
      if (i % 9 === 0) pulsePaths.push({ from: p, to: gate });
    }
  });
  outputs.forEach((p, i) => {
    if (i % 3 === 0) {
      edges.push(gate, p);
      if (i % 9 === 0) pulsePaths.push({ from: gate, to: p });
    }
  });
  const edgePositions = new Float32Array(edges.length * 3);
  edges.forEach((p, i) => edgePositions.set([p.x, p.y, p.z], i * 3));

  return { positions, colors, sizesPhase, edgePositions, pulsePaths };
}

function makeGlowTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function Network() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pulsesRef = useRef<THREE.Points>(null);

  const graph = useMemo(buildGraph, []);
  const glowTexture = useMemo(makeGlowTexture, []);
  const basePositions = useMemo(() => graph.positions.slice(), [graph]);
  const pulseState = useMemo(
    () =>
      graph.pulsePaths.slice(0, 3).map((path, i) => ({
        path,
        t: i * 0.33,
        speed: 0.16 + Math.random() * 0.1,
      })),
    [graph],
  );
  const pulsePositions = useMemo(
    () => new Float32Array(pulseState.length * 3),
    [pulseState],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // gentle per-node drift
    const points = pointsRef.current;
    if (points) {
      const arr = points.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < arr.length / 3; i++) {
        const phase = graph.sizesPhase[i];
        arr[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(t * 0.4 + phase) * 0.12;
      }
      points.geometry.attributes.position.needsUpdate = true;
    }

    // traveling pulses
    const pulses = pulsesRef.current;
    if (pulses) {
      pulseState.forEach((pulse, i) => {
        pulse.t += delta * pulse.speed;
        if (pulse.t > 1) {
          pulse.t = 0;
          pulse.path =
            graph.pulsePaths[Math.floor(Math.random() * graph.pulsePaths.length)];
        }
        const { from, to } = pulse.path;
        pulsePositions[i * 3] = THREE.MathUtils.lerp(from.x, to.x, pulse.t);
        pulsePositions[i * 3 + 1] = THREE.MathUtils.lerp(from.y, to.y, pulse.t);
        pulsePositions[i * 3 + 2] = THREE.MathUtils.lerp(from.z, to.z, pulse.t);
      });
      pulses.geometry.attributes.position.needsUpdate = true;
    }

    // pointer parallax, lerped (±~2°)
    const group = groupRef.current;
    if (group) {
      const targetY = state.pointer.x * 0.035;
      const targetX = -state.pointer.y * 0.025;
      group.rotation.y += (targetY - group.rotation.y) * 0.05;
      group.rotation.x += (targetX - group.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[graph.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[graph.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glowTexture}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={0.22}
          sizeAttenuation
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[graph.edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glowTexture}
          color="#7fb8ff"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={0.34}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function HeroScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={["#0a0a0c", 9, 16]} />
      <Network />
    </Canvas>
  );
}
