import { useState, useCallback } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts'
import { motion } from 'framer-motion'
import { textFadeIn } from '../../utils/animations'

export type Allocation = {
  symbol: string
  percent: number
  color: string
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props
  const { symbol, percent } = payload

  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)

  // Start of line (inside the slice)
  // From the middle of the band: (inner + outer) / 2
  const midRadius = innerRadius + (outerRadius - innerRadius) / 2
  const sx = cx + midRadius * cos
  const sy = cy + midRadius * sin

  // End of line (near center text)
  // Stop ~40px from center to avoid hitting text
  const ex = cx + 40 * cos
  const ey = cy + 40 * sin

  // Dynamic font size
  let fontSize = 24
  if (symbol.length > 8) fontSize = 20
  if (symbol.length > 12) fontSize = 16
  if (symbol.length > 16) fontSize = 14

  return (
    <g>
      {/* Active Sector Highlight */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 8px ${fill}80)` }}
      />
      {/* Hover Zone */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="transparent"
      />

      {/* Internal Simple Line */}
      <path
        d={`M${sx},${sy} L${ex},${ey}`}
        stroke={fill}
        strokeWidth={2}
        fill="none"
        opacity={0.8}
      />

      {/* Center Text Group */}
      <motion.text
        key={symbol} // Key triggers animation on change
        x={cx}
        y={cy}
        dy={-5}
        textAnchor="middle"
        fill="#ffffff"
        initial="hidden"
        animate="visible"
        variants={textFadeIn}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }}
      >
        {symbol}
      </motion.text>
      <text
        x={cx}
        y={cy}
        dy={18}
        textAnchor="middle"
        fill="#94a3b8"
        style={{
          fontSize: '14px',
          fontWeight: '500',
          pointerEvents: 'none'
        }}
      >
        {percent}%
      </text>
    </g>
  )
}

export default function InvestmentChart({ data, onHover, activeSymbol }: { data: Allocation[], onHover?: (symbol: string | null) => void, activeSymbol?: string | null }) {
  // Driven by props (Controlled)
  const activeIndex = data.findIndex(d => d.symbol === activeSymbol)

  const onPieEnter = useCallback((_: any, index: number) => {
    // Only notify parent, parent updates activeSymbol -> updates activeIndex
    if (onHover && data[index]) {
      onHover(data[index].symbol)
    }
  }, [onHover, data])

  const onPieLeave = useCallback(() => {
    if (onHover) onHover(null)
  }, [onHover])

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 320, overflow: 'visible' }}>
      <ResponsiveContainer>
        <PieChart margin={{ top: 60, right: 60, bottom: 60, left: 60 }} style={{ overflow: 'visible' }}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="percent"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            stroke="none"
            isAnimationActive={false} // Prevent internal animation conflict
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                fillOpacity={index === activeIndex ? 1 : 0.6}
                stroke={index === activeIndex ? 'rgba(255,255,255,0.1)' : 'none'}
              />
            ))}
          </Pie>

          {/* GHOST PIE: Extends detection range by ~30% outwards */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={115} // Reduced to prevent clipping
            dataKey="percent"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            stroke="none"
            fill="transparent"
            style={{ cursor: 'pointer' }}
            isAnimationActive={false}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
