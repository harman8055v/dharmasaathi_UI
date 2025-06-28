"use client"

import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  progress: number
}

export default function ProgressBarComponent({ progress }: ProgressBarProps) {
  return <Progress value={progress} className="w-full" />
}
