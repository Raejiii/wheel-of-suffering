import { useEffect, useState } from 'react'

const PREFIX = 'wheel-of-suffering:'

function read(key, fallback) {
    try {
        const saved = localStorage.getItem(PREFIX + key)
        return saved === null ? fallback : JSON.parse(saved)
    } catch {
        return fallback
    }
}

// useState that survives page reloads
export function useStoredState(key, fallback) {
    const [value, setValue] = useState(() => read(key, fallback))

    useEffect(() => {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value))
        } catch {
            // storage can be unavailable (private mode); the app still works for this visit
        }
    }, [key, value])

    return [value, setValue]
}

export function todayKey() {
    return new Date().toISOString().slice(0, 10)
}
