export default function Layout(props) {

    const { children } = props

    const header = (
        <header>
            <h1 className="text-gradient">The Brogram</h1>
            <p><strong>The 30 Simple Workouts Program</strong></p>
        </header>
    )

    const footer = (
        <footer>
            <p>Built by <a href="https://github.com/Raejiii" target="_blank">Rahul JS (Rae)</a> as part of the Full Stack Course by James McArthur (Smoljames)<br />Styled with <a href="https://www.fantacss.smoljames.com" target="_blank">FantaCSS</a></p>
        </footer>
    )

    //https://www,YOUR_USERNAME.netlify.app

    return (
        <>
            {header}
            {children}
            {footer}
        </>
    )
}