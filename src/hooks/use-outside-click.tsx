"use client"

import { useEffect, useRef } from "react"

export const useOutsideClick = (ref: any, callback: any) => {
  const callbackRef = useRef(callback)

  // Update the callback ref when the callback function changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callbackRef.current()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])
}

