export default function QuestLog({ entries, onClear }) {
    return (
        <section className="panel log">
            <h2 className="panel-title"><i className="fa-solid fa-book-skull" /> Today&apos;s quest log</h2>
            {entries.length === 0 ? (
                <p className="panel-hint">No sets yet. Spin the wheel and mark a set as done to log it here.</p>
            ) : (
                <>
                    <p className="log-total">
                        <strong>{entries.length}</strong> {entries.length === 1 ? 'set' : 'sets'} survived today
                    </p>
                    <ol className="log-list">
                        {entries.map((entry, index) => (
                            <li key={index}>
                                <span className="log-time">{entry.time}</span>
                                <span className="log-name">{entry.name}</span>
                                <span className="log-amount">{entry.amount}</span>
                            </li>
                        ))}
                    </ol>
                    <button className="text-btn" onClick={onClear}>
                        <i className="fa-solid fa-eraser" /> Clear today&apos;s log
                    </button>
                </>
            )}
        </section>
    )
}
