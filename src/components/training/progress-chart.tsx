"use client"

import * as React from "react"
import { format } from "date-fns"
import { cn, formatSeconds } from "@/lib/utils"

export interface DataPoint {
  date: Date
  value: number // seconds for breath hold times
  label?: string
}

export interface ProgressChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DataPoint[]
  title?: string
  yAxisLabel?: string
  showTooltip?: boolean
  height?: number
}

function ProgressChart({
  data,
  title = "Breath Hold Progress",
  yAxisLabel = "Hold Time",
  showTooltip = true,
  height = 200,
  className,
  ...props
}: ProgressChartProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<DataPoint | null>(null)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-dashed p-8",
          className
        )}
        style={{ height }}
        {...props}
      >
        <p className="text-sm text-muted-foreground">
          No data available yet. Start training to see your progress!
        </p>
      </div>
    )
  }

  // Sort data by date
  const sortedData = [...data].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )

  // Calculate chart dimensions
  const padding = { top: 20, right: 20, bottom: 30, left: 50 }
  const chartWidth = 400
  const chartHeight = height - padding.top - padding.bottom

  // Calculate scales
  const values = sortedData.map((d) => d.value)
  const minValue = Math.min(...values) * 0.9
  const maxValue = Math.max(...values) * 1.1
  const valueRange = maxValue - minValue || 1

  // Generate Y-axis ticks
  const yTicks = 5
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    Math.round(minValue + (valueRange / (yTicks - 1)) * i)
  )

  // Generate path
  const getX = (index: number): number => {
    if (sortedData.length === 1) return chartWidth / 2
    return (index / (sortedData.length - 1)) * (chartWidth - padding.left - padding.right) + padding.left
  }

  const getY = (value: number): number => {
    return (
      chartHeight -
      ((value - minValue) / valueRange) * chartHeight +
      padding.top
    )
  }

  const pathData = sortedData
    .map((point, index) => {
      const x = getX(index)
      const y = getY(point.value)
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  // Generate area path for gradient fill
  const areaPath = `${pathData} L ${getX(sortedData.length - 1)} ${
    chartHeight + padding.top
  } L ${padding.left} ${chartHeight + padding.top} Z`

  const handleMouseMove = (
    event: React.MouseEvent<SVGElement>,
    point: DataPoint
  ) => {
    if (showTooltip) {
      const rect = event.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
      setHoveredPoint(point)
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}

      <div className="relative">
        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="w-full overflow-visible"
          style={{ height }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines and labels */}
          {yTickValues.map((tick, index) => {
            const y = getY(tick)
            return (
              <g key={index}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeDasharray="4"
                />
                <text
                  x={padding.left - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {formatSeconds(tick)}
                </text>
              </g>
            )
          })}

          {/* Y-axis label */}
          <text
            x={12}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90, 12, ${height / 2})`}
            className="fill-muted-foreground text-[10px]"
          >
            {yAxisLabel}
          </text>

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {sortedData.map((point, index) => {
            const x = getX(index)
            const y = getY(point.value)

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="transparent"
                  onMouseMove={(e) => handleMouseMove(e, point)}
                  onMouseLeave={handleMouseLeave}
                  className="cursor-pointer"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={hoveredPoint === point ? 5 : 4}
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  className="pointer-events-none transition-all"
                />
              </g>
            )
          })}

          {/* X-axis date labels */}
          {sortedData.map((point, index) => {
            // Only show every nth label to avoid crowding
            const showLabel =
              sortedData.length <= 7 ||
              index === 0 ||
              index === sortedData.length - 1 ||
              index % Math.ceil(sortedData.length / 5) === 0

            if (!showLabel) return null

            const x = getX(index)

            return (
              <text
                key={index}
                x={x}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {format(point.date, "MMM d")}
              </text>
            )
          })}
        </svg>

        {/* Tooltip */}
        {showTooltip && hoveredPoint && (
          <div
            className="absolute z-10 rounded-lg border bg-popover px-3 py-2 text-sm shadow-md pointer-events-none"
            style={{
              left: mousePosition.x + 10,
              top: mousePosition.y - 40,
              transform:
                mousePosition.x > chartWidth / 2
                  ? "translateX(-100%)"
                  : "translateX(0)",
            }}
          >
            <p className="font-medium">{formatSeconds(hoveredPoint.value)}</p>
            <p className="text-xs text-muted-foreground">
              {format(hoveredPoint.date, "MMM d, yyyy")}
            </p>
            {hoveredPoint.label && (
              <p className="text-xs text-muted-foreground mt-1">
                {hoveredPoint.label}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Legend / Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Best: {formatSeconds(Math.max(...values))}
        </span>
        <span>
          {sortedData.length} {sortedData.length === 1 ? "session" : "sessions"}
        </span>
      </div>
    </div>
  )
}

export { ProgressChart }
