import { useEffect, useRef, useState } from 'react'
import { useStoredState } from '../utils/storage'
import { playBell, unlockAudio } from '../utils/sound'

function format(seconds) {
    const minutes = Math.floor(seconds / 60)
    const rest = Math.floor(seconds % 60)
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

// keeps the phone screen awake while the timer runs, where supported
function useWakeLock(active) {
    useEffect(() => {
        if (!active || !('wakeLock' in navigator)) return
        let lock = null
        navigator.wakeLock.request('screen').then((sentinel) => (lock = sentinel)).catch(() => {})
        return () => lock?.release()
    }, [active])
}

export default function Timer({ onRound, soundOn, disabled }) {
    const [minutes, setMinutes] = useStoredState('timer-minutes', 3)
    const [rounds, setRounds] = useStoredState('timer-rounds', 10)
    const [autoSpin, setAutoSpin] = useStoredState('timer-autospin', true)

    const [status, setStatus] = useState('idle') // idle | running | paused | done
    const [round, setRound] = useState(0)
    const [remaining, setRemaining] = useState(minutes * 60)
    const endAt = useRef(0)

    const total = minutes * 60
    const running = status === 'running'
    useWakeLock(running)

    useEffect(() => {
        if (status === 'idle') setRemaining(minutes * 60)
    }, [minutes, status])

    function startRound(roundNumber) {
        setRound(roundNumber)
        endAt.current = Date.now() + total * 1000
        setRemaining(total)
        if (autoSpin) onRound()
    }

    // count down using timestamps so it stays accurate in background tabs
    useEffect(() => {
        if (!running) return
        const interval = setInterval(() => {
            const left = Math.max(0, (endAt.current - Date.now()) / 1000)
            setRemaining(left)
            if (left > 0) return
            if (soundOn) playBell()
            if (round >= rounds) {
                setStatus('done')
            } else {
                startRound(round + 1)
            }
        }, 250)
        return () => clearInterval(interval)
    })

    function start() {
        unlockAudio()
        setStatus('running')
        startRound(1)
    }

    function pause() {
        setStatus('paused')
    }

    function resume() {
        endAt.current = Date.now() + remaining * 1000
        setStatus('running')
    }

    function reset() {
        setStatus('idle')
        setRound(0)
        setRemaining(total)
    }

    const progress = status === 'idle' ? 0 : 1 - remaining / total
    const ringLength = 2 * Math.PI * 54

    return (
        <section className="panel timer">
            <h2 className="panel-title"><i className="fa-solid fa-hourglass-half" /> Interval timer</h2>

            <div className="timer-face">
                <svg viewBox="0 0 120 120" className="timer-ring" aria-hidden="true">
                    <circle cx="60" cy="60" r="54" className="ring-track" />
                    <circle
                        cx="60"
                        cy="60"
                        r="54"
                        className="ring-fill"
                        strokeDasharray={ringLength}
                        strokeDashoffset={ringLength * (1 - progress)}
                    />
                </svg>
                <div className="timer-readout">
                    <span className="timer-time">{format(Math.ceil(remaining))}</span>
                    <span className="timer-round">
                        {status === 'done' ? 'Quest complete!' : status === 'idle' ? `${rounds} rounds` : `Round ${round} of ${rounds}`}
                    </span>
                </div>
            </div>

            <div className="timer-buttons">
                {status === 'idle' && (
                    <button className="btn btn-primary" onClick={start} disabled={disabled}>
                        <i className="fa-solid fa-play" /> Start
                    </button>
                )}
                {status === 'running' && (
                    <button className="btn btn-primary" onClick={pause}>
                        <i className="fa-solid fa-pause" /> Pause
                    </button>
                )}
                {status === 'paused' && (
                    <button className="btn btn-primary" onClick={resume}>
                        <i className="fa-solid fa-play" /> Resume
                    </button>
                )}
                {status !== 'idle' && (
                    <button className="btn btn-outline" onClick={reset}>
                        <i className="fa-solid fa-rotate-left" /> Reset
                    </button>
                )}
            </div>

            <div className="timer-settings">
                <label>
                    <span>Every</span>
                    <input
                        type="number"
                        min="1"
                        max="60"
                        value={minutes}
                        disabled={status !== 'idle'}
                        onChange={(event) => setMinutes(Math.min(60, Math.max(1, Number(event.target.value) || 1)))}
                    />
                    <span>min</span>
                </label>
                <label>
                    <span>For</span>
                    <input
                        type="number"
                        min="1"
                        max="99"
                        value={rounds}
                        disabled={status !== 'idle'}
                        onChange={(event) => setRounds(Math.min(99, Math.max(1, Number(event.target.value) || 1)))}
                    />
                    <span>rounds</span>
                </label>
                <label className="check">
                    <input type="checkbox" checked={autoSpin} onChange={(event) => setAutoSpin(event.target.checked)} />
                    <span>Spin the wheel automatically each round</span>
                </label>
            </div>
        </section>
    )
}
