"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface AddressInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  id?: string
}

export function AddressInput({ value, onChange, placeholder, className, id }: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const fetchSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([])
      return
    }

    try {
      // Using Nominatim OpenStreetMap API for address autocomplete (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&countrycodes=us,ca&addressdetails=1&limit=5`,
      )
      const data = await response.json()
      setSuggestions(data)
      setShowSuggestions(true)
    } catch (error) {
      console.error("Error fetching address suggestions:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Debounce the API call
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(newValue)
    }, 300)
  }

  const handleSelectSuggestion = (suggestion: any) => {
    onChange(suggestion.display_name)
    setSuggestions([])
    setShowSuggestions(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative" ref={inputRef}>
      <Input
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn("border-black", className)}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-black rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm border-b border-gray-200 last:border-b-0"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
