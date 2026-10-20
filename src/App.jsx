import { useRef, useState } from 'react'
import Wheel from './components/Wheel'
import Timer from './components/Timer'
import WheelEditor from './components/WheelEditor'
import QuestLog from './components/QuestLog'
import { DEFAULT_EXERCISES, EQUIPMENT, FATE_LINES } from './data/exercises'
import { todayKey, useStoredState } from './utils/storage'
import { playResult, unlockAudio } from './utils/sound'

export default function App() {
    const [exercises, setExercises] = useStoredState('exercises', DEFAULT_EXERCISES)
    const [equipmentOn, setEquipmentOn] = useStoredState('equipment', { bar: true, dumbbells: true, body: true })
    const [soundOn, setSoundOn] = useStoredState('sound', true)
    const [log, setLog] = useStoredState('log', { date: todayKey(), entries: [] })

    const [rotation, setRotation] = useState(0)
    const [spinning, setSpinning] = useState(false)
    const [result, setResult] = useState(null)
    const [logged, setLogged] = useState(false)
    const pending = useRef(null)

    const wheelItems = exercises.filter((exercise) => exercise.enabled && equipmentOn[exercise.equipment])
    const todaysEntries = log.date === todayKey() ? log.entries : []

    function spin() {
        if (spinning || wheelItems.length === 0) return
        unlockAudio()
        const segment = 360 / wheelItems.length
        const index = Math.floor(Math.random() * wheelItems.length)
        // land somewhere inside the chosen segment, not always dead centre
        const target = (index + 0.5) * segment + (Math.random() - 0.5) * segment * 0.7
        const current = ((rotation % 360) + 360) % 360
        const extra = (360 - target - current + 720) % 360
        pending.current = wheelItems[index]
        setResult(null)
        setLogged(false)
        setSpinning(true)
        setRotation(rotation + 360 * 6 + extra)
    }

    function handleSpinEnd() {
        if (!spinning) return
        setSpinning(false)
        setResult({ ...pending.current, line: FATE_LINES[Math.floor(Math.random() * FATE_LINES.length)] })
        if (soundOn) playResult()
    }

    function markDone() {
        if (!result || logged) return
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setLog({ date: todayKey(), entries: [...todaysEntries, { name: result.name, amount: result.amount, time }] })
        setLogged(true)
    }

    function resetDefaults() {
        if (window.confirm("Restore Rae's default wheel? Your custom exercises will be removed.")) {
            setExercises(DEFAULT_EXERCISES)
            setEquipmentOn({ bar: true, dumbbells: true, body: true })
        }
    }

    return (
        <>
            <header className="topbar">
                <div className="brand">
                    <i className="fa-solid fa-dice-d20" />
                    <span>Wheel of Suffering</span>
                </div>
                <button
                    className="icon-btn sound-toggle"
                    onClick={() => setSoundOn(!soundOn)}
                    aria-label={soundOn ? 'Mute sounds' : 'Turn sounds on'}
                    title={soundOn ? 'Mute sounds' : 'Turn sounds on'}
                >
                    <i className={`fa-solid ${soundOn ? 'fa-volume-high' : 'fa-volume-xmark'}`} />
                </button>
            </header>

            <main>
                <section className="hero">
                    <p className="overline">Rae&apos;s home workout grimoire</p>
                    <h1>Wheel of Suffering</h1>
                    <p className="hero-sub">
                        A pull-up bar, a pair of dumbbells and a wheel that decides your fate. Spin it, do the set,
                        and let the timer call the next one.
                    </p>
                </section>

                <div className="layout">
                    <section className="arena">
                        <div className="equipment-chips" role="group" aria-label="Equipment on the wheel">
                            {Object.entries(EQUIPMENT).map(([key, info]) => (
                                <button
                                    key={key}
                                    className={`chip ${equipmentOn[key] ? 'on' : ''}`}
                                    aria-pressed={equipmentOn[key]}
                                    disabled={spinning}
                                    onClick={() => setEquipmentOn({ ...equipmentOn, [key]: !equipmentOn[key] })}
                                >
                                    <i className={`fa-solid ${info.icon}`} /> {info.label}
                                </button>
                            ))}
                        </div>

                        {wheelItems.length > 0 ? (
                            <Wheel
                                items={wheelItems}
                                rotation={rotation}
                                spinning={spinning}
                                soundOn={soundOn}
                                onSpinEnd={handleSpinEnd}
                            />
                        ) : (
                            <p className="empty">The wheel is empty. Turn on some equipment or add an exercise below.</p>
                        )}

                        <button className="btn btn-spin" onClick={spin} disabled={spinning || wheelItems.length === 0}>
                            <i className="fa-solid fa-dice-d20" /> {spinning ? 'Spinning...' : 'Spin the wheel'}
                        </button>

                        <div className={`fate-card ${result ? 'show' : ''}`} aria-live="polite">
                            {result ? (
                                <>
                                    <p className="fate-line">{result.line}</p>
                                    <h2>{result.name}</h2>
                                    <p className="fate-amount">{result.amount}</p>
                                    <p className="fate-equipment">
                                        <i className={`fa-solid ${EQUIPMENT[result.equipment]?.icon}`} />{' '}
                                        {EQUIPMENT[result.equipment]?.label}
                                    </p>
                                    <button className="btn btn-outline btn-small" onClick={markDone} disabled={logged}>
                                        <i className={`fa-solid ${logged ? 'fa-check' : 'fa-skull'}`} />{' '}
                                        {logged ? 'Logged' : 'Done, log it'}
                                    </button>
                                </>
                            ) : (
                                <p className="fate-line">{spinning ? 'The wheel is deciding...' : 'Spin to receive your fate.'}</p>
                            )}
                        </div>
                    </section>

                    <aside className="side">
                        <Timer onRound={spin} soundOn={soundOn} disabled={wheelItems.length === 0} />
                        <QuestLog entries={todaysEntries} onClear={() => setLog({ date: todayKey(), entries: [] })} />
                    </aside>
                </div>

                <WheelEditor exercises={exercises} setExercises={setExercises} onResetDefaults={resetDefaults} />
            </main>

            <footer className="footer">
                Made by <a href="https://web-portfolio-liart-iota.vercel.app" target="_blank" rel="noreferrer">Rahul JS (Rae)</a>
                {' '}for home workouts. Stretch first, and stop if anything hurts.
            </footer>
        </>
    )
}
