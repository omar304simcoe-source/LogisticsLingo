"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  type: "date" | "time"
  className?: string
  id?: string
}

export function DateTimePicker({ value, onChange, type, className, id }: DateTimePickerProps) {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("border-black", className)}
    />
  )
}
