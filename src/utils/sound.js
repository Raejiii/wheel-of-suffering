// Small Web Audio sound effects, so the app needs no audio files
let context = null

function audio() {
    if (!context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        if (!AudioContext) return null
        context = new AudioContext()
    }
    if (context.state === 'suspended') context.resume()
    return context
}

function tone(frequency, start, duration, { type = 'sine', volume = 0.25 } = {}) {
    const ctx = audio()
    if (!ctx) return
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + start)
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration)
    oscillator.connect(gain).connect(ctx.destination)
    oscillator.start(ctx.currentTime + start)
    oscillator.stop(ctx.currentTime + start + duration + 0.05)
}

// call from a click so browsers allow audio later
export function unlockAudio() {
    audio()
}

export function playTick() {
    tone(1400, 0, 0.04, { type: 'square', volume: 0.05 })
}

export function playResult() {
    tone(392, 0, 0.5, { type: 'triangle' })
    tone(523, 0.12, 0.5, { type: 'triangle' })
    tone(784, 0.24, 0.8, { type: 'triangle' })
}

// a deep bell for when the interval timer runs out
export function playBell() {
    ;[0, 0.9, 1.8].forEach((start) => {
        tone(196, start, 1.6, { volume: 0.35 })
        tone(392, start, 1.2, { volume: 0.15 })
        tone(587, start, 0.8, { volume: 0.08 })
    })
}
