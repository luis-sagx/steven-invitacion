'use client'

import { motion } from 'motion/react'
import {
  Dna,
  FlaskConical,
  Microscope,
  Atom,
  Beaker,
  TestTube,
} from 'lucide-react'

/* ─── Molecule network SVG ────────────────────────────────────────────── */
function MoleculeNetwork({
  style,
  color = 'rgba(79,109,122,0.3)',
}: {
  style?: React.CSSProperties
  color?: string
}) {
  const nodes = [
    { cx: 80, cy: 80 },
    { cx: 160, cy: 40 },
    { cx: 200, cy: 130 },
    { cx: 120, cy: 180 },
    { cx: 40, cy: 160 },
    { cx: 30, cy: 90 },
    { cx: 240, cy: 70 },
  ]
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 0],
    [0, 5],
    [1, 6],
    [2, 6],
    [0, 3],
  ]

  return (
    <svg
      width="280"
      height="220"
      style={{ position: 'absolute', ...style }}
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke={color}
          strokeWidth="1.2"
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={i === 0 ? 7 : 5}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}

/* ─── Hexagonal cell grid SVG ─────────────────────────────────────────── */
function HexGrid({
  style,
  color = 'rgba(79,109,122,0.12)',
}: {
  style?: React.CSSProperties
  color?: string
}) {
  const R = 36 // hex radius
  const rows = 5
  const cols = 4

  const hexPath = (cx: number, cy: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30)
      return `${cx + R * Math.cos(angle)},${cy + R * Math.sin(angle)}`
    })
    return `M ${pts.join(' L ')} Z`
  }

  const hexes: { cx: number; cy: number }[] = []
  const w = R * Math.sqrt(3)
  const h = R * 2 * 0.75

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * w + (row % 2 === 1 ? w / 2 : 0) + R
      const cy = row * h + R
      hexes.push({ cx, cy })
    }
  }

  const svgW = cols * w + R
  const svgH = rows * h + R

  return (
    <svg
      width={svgW}
      height={svgH}
      style={{ position: 'absolute', ...style }}
      aria-hidden="true"
    >
      {hexes.map((h, i) => (
        <path
          key={i}
          d={hexPath(h.cx, h.cy)}
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}

/* ─── Floating icon ───────────────────────────────────────────────────── */
const floatingIcons = [
  { Icon: Dna, top: '8%', left: '3%', size: 28, delay: 0, duration: 8 },
  {
    Icon: FlaskConical,
    top: '18%',
    right: '4%',
    size: 22,
    delay: 1.5,
    duration: 10,
  },
  {
    Icon: Microscope,
    top: '55%',
    left: '2%',
    size: 26,
    delay: 0.8,
    duration: 9,
  },
  { Icon: Atom, top: '70%', right: '3%', size: 30, delay: 2, duration: 11 },
  { Icon: Beaker, top: '38%', right: '5%', size: 20, delay: 0.4, duration: 7 },
  { Icon: TestTube, top: '85%', left: '5%', size: 22, delay: 1, duration: 12 },
  { Icon: Dna, top: '45%', left: '88%', size: 18, delay: 3, duration: 9 },
  { Icon: Atom, top: '25%', left: '92%', size: 24, delay: 1.2, duration: 10 },
]

export default function BiotechBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Dot grid */}
      <div className="absolute inset-0 biotech-pattern opacity-100" />

      {/* Central glow */}
      <div className="absolute inset-0 glow-effect" />

      {/* Molecule networks */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <MoleculeNetwork
          style={{ bottom: 80, right: 90 }}
          color="rgba(79,109,122,0.55)"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <MoleculeNetwork
          style={{ top: 60, left: 100 }}
          color="rgba(79,109,122,0.40)"
        />
      </motion.div>

      {/* Hex cell grids */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <HexGrid
          style={{ bottom: 20, left: -20 }}
          color="rgba(79,109,122,0.22)"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.2 }}
      >
        <HexGrid
          style={{ top: -20, right: 60 }}
          color="rgba(79,109,122,0.18)"
        />
      </motion.div>

      {/* Large decorative circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1.5 }}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        className="absolute top-[5%] left-[8%] w-96 h-96 border border-accent-blue rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 3 }}
        className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] border border-white rounded-full"
      />

      {/* Floating biotech icons */}
      {floatingIcons.map(
        ({ Icon, top, left, right, size, delay, duration }, i) => (
          <motion.div
            key={i}
            style={{ position: 'absolute', top, left, right }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.28, y: [0, -12, 0] }}
            transition={{
              opacity: { duration: 1.5, delay },
              y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
            }}
          >
            <Icon
              width={size}
              height={size}
              strokeWidth={1}
              className="text-accent-blue"
            />
          </motion.div>
        ),
      )}
    </div>
  )
}
