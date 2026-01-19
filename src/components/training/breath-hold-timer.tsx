"use client"

import * as React from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { cn, formatSeconds } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type TimerPhase = "breathe_up" | "hold" | "recover" | "idle"

const phaseConfig: Record<
  TimerPhase,
  { label: string; color: string; bgColor: string }
> = {
  idle: {
    label: "Ready",
    color: "text-muted-foreground",
    bgColor: "stroke-muted",
  },
  breathe_up: {
    label: "Breathe Up",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "stroke-blue-500",
  },
  hold: {
    label: "Hold",
    color: "text-red-600 dark:text-red-400",
    bgColor: "stroke-red-500",
  },
  recover: {
    label: "Recover",
    color: "text-green-600 dark:text-green-400",
    bgColor: "stroke-green-500",
  },
}

export interface BreathHoldTimerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  breatheUpDuration?: number // seconds
  onComplete?: (holdTime: number) => void
  onPhaseChange?: (phase: TimerPhase) => void
}

function BreathHoldTimer({
  breatheUpDuration = 120, // 2 minutes default
  onComplete,
  onPhaseChange,
  className,
  ...props
}: BreathHoldTimerProps) {
  const [phase, setPhase] = React.useState<TimerPhase>("idle")
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [holdTime, setHoldTime] = React.useState(0)

  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const audioContextRef = React.useRef<AudioContext | null>(null)

  // Calculate progress for the circular indicator
  const getProgress = (): number => {
    if (phase === "breathe_up") {
      return Math.min((elapsedSeconds / breatheUpDuration) * 100, 100)
    }
    // For hold phase, we'll just use a pulsing animation instead of progress
    return 0
  }

  const playBeep = React.useCallback(() => {
    if (isMuted) return

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }

      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.3)
    } catch {
      // Audio not supported
    }
  }, [isMuted])

  const handleStart = () => {
    setIsRunning(true)
    setPhase("breathe_up")
    setElapsedSeconds(0)
    onPhaseChange?.("breathe_up")
  }

  const handleStop = () => {
    setIsRunning(false)

    if (phase === "hold") {
      const finalHoldTime = elapsedSeconds
      setHoldTime(finalHoldTime)
      setPhase("recover")
      onPhaseChange?.("recover")
      onComplete?.(finalHoldTime)
      playBeep()
    }
  }

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
    setPhase("idle")
    setElapsedSeconds(0)
    setHoldTime(0)
    onPhaseChange?.("idle")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Timer effect
  React.useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newValue = prev + 1

          // Check if breathe up phase is complete
          if (phase === "breathe_up" && newValue >= breatheUpDuration) {
            setPhase("hold")
            onPhaseChange?.("hold")
            playBeep()
            return 0 // Reset for hold phase
          }

          return newValue
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, phase, breatheUpDuration, onPhaseChange, playBeep])

  // Cleanup audio context on unmount
  React.useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const currentPhaseConfig = phaseConfig[phase]
  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDashoffset =
    phase === "breathe_up"
      ? circumference - (getProgress() / 100) * circumference
      : 0

  return (
    <div
      className={cn("flex flex-col items-center space-y-6", className)}
      {...props}
    >
      {/* Circular Timer Display */}
      <div className="relative flex h-64 w-64 items-center justify-center">
        <svg
          className="absolute h-full w-full -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/20"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-1000",
              currentPhaseConfig.bgColor,
              phase === "hold" && "animate-pulse"
            )}
          />
        </svg>

        <div className="z-10 flex flex-col items-center">
          <span className="text-5xl font-bold tabular-nums">
            {formatSeconds(elapsedSeconds)}
          </span>
          <span className={cn("mt-2 text-lg font-medium", currentPhaseConfig.color)}>
            {currentPhaseConfig.label}
          </span>
          {phase === "recover" && holdTime > 0 && (
            <span className="mt-1 text-sm text-muted-foreground">
              Hold: {formatSeconds(holdTime)}
            </span>
          )}
        </div>
      </div>

      {/* Phase Indicator */}
      <div className="flex items-center gap-4">
        {(["breathe_up", "hold", "recover"] as const).map((p) => (
          <div
            key={p}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-all",
              phase === p
                ? "bg-accent font-medium"
                : "text-muted-foreground opacity-50"
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                phase === p
                  ? phaseConfig[p].bgColor.replace("stroke-", "bg-")
                  : "bg-muted"
              )}
            />
            {phaseConfig[p].label}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {phase === "idle" ? (
          <Button size="lg" onClick={handleStart}>
            <Play className="mr-2 h-5 w-5" />
            Start
          </Button>
        ) : isRunning ? (
          <Button
            size="lg"
            variant={phase === "hold" ? "destructive" : "default"}
            onClick={handleStop}
          >
            <Pause className="mr-2 h-5 w-5" />
            {phase === "hold" ? "Stop Hold" : "Pause"}
          </Button>
        ) : (
          <Button size="lg" onClick={handleStart}>
            <Play className="mr-2 h-5 w-5" />
            Resume
          </Button>
        )}

        <Button variant="outline" size="icon" onClick={handleReset}>
          <RotateCcw className="h-5 w-5" />
          <span className="sr-only">Reset</span>
        </Button>

        <Button variant="outline" size="icon" onClick={toggleMute}>
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
        </Button>
      </div>
    </div>
  )
}

export { BreathHoldTimer }
