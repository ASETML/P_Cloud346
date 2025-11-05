"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  initialRating?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
}

export default function StarRating({ initialRating = 0, onChange, readOnly = false }: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (index: number) => {
    if (readOnly) return

    const newRating = index + 1
    setRating(newRating)
    if (onChange) {
      onChange(newRating)
    }
  }

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const filled = index < (hoverRating || rating)

        return (
          <Star
            key={index}
            className={`w-6 h-6 cursor-pointer ${filled ? "fill-primary-green text-primary-green" : "text-light-gray"}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
          />
        )
      })}
    </div>
  )
}
