import { useState } from 'react'
import { EQUIPMENT } from '../data/exercises'

export default function WheelEditor({ exercises, setExercises, onResetDefaults }) {
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('10 reps')
    const [equipment, setEquipment] = useState('dumbbells')

    function update(id, changes) {
        setExercises((current) => current.map((exercise) => (exercise.id === id ? { ...exercise, ...changes } : exercise)))
    }

    function remove(id) {
        setExercises((current) => current.filter((exercise) => exercise.id !== id))
    }

    function add(event) {
        event.preventDefault()
        if (!name.trim()) return
        setExercises((current) => [
            ...current,
            { id: `custom-${Date.now()}`, name: name.trim(), amount: amount.trim() || '10 reps', equipment, enabled: true },
        ])
        setName('')
    }

    return (
        <section className="panel editor">
            <h2 className="panel-title"><i className="fa-solid fa-scroll" /> Customise the wheel</h2>
            <p className="panel-hint">Untick an exercise to take it off the wheel. Changes save automatically.</p>

            <ul className="exercise-list">
                {exercises.map((exercise) => (
                    <li key={exercise.id} className={exercise.enabled ? '' : 'off'}>
                        <input
                            type="checkbox"
                            checked={exercise.enabled}
                            onChange={(event) => update(exercise.id, { enabled: event.target.checked })}
                            aria-label={`Include ${exercise.name}`}
                        />
                        <input
                            className="name-input"
                            value={exercise.name}
                            onChange={(event) => update(exercise.id, { name: event.target.value })}
                            aria-label="Exercise name"
                        />
                        <input
                            className="amount-input"
                            value={exercise.amount}
                            onChange={(event) => update(exercise.id, { amount: event.target.value })}
                            aria-label="Reps or time"
                        />
                        <select
                            value={exercise.equipment}
                            onChange={(event) => update(exercise.id, { equipment: event.target.value })}
                            aria-label="Equipment"
                        >
                            {Object.entries(EQUIPMENT).map(([key, info]) => (
                                <option key={key} value={key}>{info.label}</option>
                            ))}
                        </select>
                        <button className="icon-btn" onClick={() => remove(exercise.id)} aria-label={`Delete ${exercise.name}`}>
                            <i className="fa-solid fa-trash" />
                        </button>
                    </li>
                ))}
            </ul>

            <form className="add-form" onSubmit={add}>
                <input placeholder="New exercise" value={name} onChange={(event) => setName(event.target.value)} />
                <input placeholder="Reps or time" value={amount} onChange={(event) => setAmount(event.target.value)} />
                <select value={equipment} onChange={(event) => setEquipment(event.target.value)}>
                    {Object.entries(EQUIPMENT).map(([key, info]) => (
                        <option key={key} value={key}>{info.label}</option>
                    ))}
                </select>
                <button className="btn btn-primary btn-small" type="submit">
                    <i className="fa-solid fa-plus" /> Add
                </button>
            </form>

            <button className="text-btn" onClick={onResetDefaults}>
                <i className="fa-solid fa-rotate-left" /> Restore Rae&apos;s default wheel
            </button>
        </section>
    )
}
