import { useEffect, useRef } from 'react'
import { playTick } from '../utils/sound'

const SIZE = 400
const CENTER = SIZE / 2
const RADIUS = 188
const COLORS = ['#6b1717', '#1e2228', '#4a3417']

// point on the circle, with 0 degrees at the top going clockwise
function point(angle, radius = RADIUS) {
    const radians = (angle * Math.PI) / 180
    return [CENTER + radius * Math.sin(radians), CENTER - radius * Math.cos(radians)]
}

function segmentPath(start, end) {
    const [x1, y1] = point(start)
    const [x2, y2] = point(end)
    const largeArc = end - start > 180 ? 1 : 0
    return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

function shorten(text, max) {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

// current rotation of an element in degrees, read from its live transform
function liveRotation(element) {
    const transform = getComputedStyle(element).transform
    if (!transform || transform === 'none') return 0
    const [a, b] = transform.slice(7, -1).split(',').map(Number)
    return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360
}

export default function Wheel({ items, rotation, spinning, soundOn, onSpinEnd }) {
    const wheelRef = useRef(null)
    const segment = 360 / Math.max(items.length, 1)

    // tick each time a segment boundary passes the pointer
    useEffect(() => {
        if (!spinning || !soundOn || items.length < 2) return
        let frame
        let lastSegment = null
        const step = () => {
            const angle = (360 - liveRotation(wheelRef.current)) % 360
            const current = Math.floor(angle / segment)
            if (lastSegment !== null && current !== lastSegment) playTick()
            lastSegment = current
            frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frame)
    }, [spinning, soundOn, segment, items.length])

    const labelMax = items.length > 12 ? 13 : 17

    return (
        <div className="wheel-wrap">
            <div className="wheel-pointer" aria-hidden="true" />
            <svg
                ref={wheelRef}
                className="wheel"
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                style={{ transform: `rotate(${rotation}deg)` }}
                onTransitionEnd={onSpinEnd}
                role="img"
                aria-label={`Workout wheel with ${items.length} exercises`}
            >
                <circle cx={CENTER} cy={CENTER} r={RADIUS + 8} className="wheel-rim" />
                {items.length === 1 && <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={COLORS[0]} />}
                {items.length > 1 &&
                    items.map((item, index) => (
                        <path
                            key={item.id}
                            d={segmentPath(index * segment, (index + 1) * segment)}
                            fill={COLORS[index % COLORS.length]}
                            className="wheel-segment"
                        />
                    ))}
                {items.map((item, index) => {
                    const middle = (index + 0.5) * segment
                    const [x, y] = point(middle, RADIUS * 0.6)
                    return (
                        <text
                            key={item.id}
                            x={x}
                            y={y}
                            className="wheel-label"
                            transform={`rotate(${middle - 90} ${x} ${y})`}
                            textAnchor="middle"
                            dominantBaseline="middle"
                        >
                            {shorten(item.name, labelMax)}
                        </text>
                    )
                })}
                {/* studs around the rim */}
                {Array.from({ length: 24 }, (_, index) => {
                    const [x, y] = point(index * 15, RADIUS + 4)
                    return <circle key={index} cx={x} cy={y} r={2.6} className="wheel-stud" />
                })}
                <circle cx={CENTER} cy={CENTER} r={34} className="wheel-hub" />
                <text x={CENTER} y={CENTER + 1} className="wheel-hub-text" textAnchor="middle" dominantBaseline="middle">
                    20
                </text>
            </svg>
        </div>
    )
}
