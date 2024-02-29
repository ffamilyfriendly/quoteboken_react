"use client"
import { ReactNode, useState } from "react"
import Style from "./TabbedView.module.css"

type TabbedViewProps = {
    pages: [ string, ReactNode ][],
    defaultPage?: number
}

export default function TabbedView({ pages, ...props }: TabbedViewProps) {
    const headings = pages.map(i => i[0])
    const [ selectedPage, setSelectedPage ] = useState( props.defaultPage ?? 0 )

    return (
        <main className={Style.container}>
            <div className={Style.nav}>
                { headings.map((h, i) => <div onClick={() => { setSelectedPage(i) }} key={h} className={ ` ${Style.tab} ${selectedPage == i ? Style.selected : ""} ` }>{h}</div>) }
            </div>

            <div className={Style.content}>
                { pages[selectedPage][1] }
            </div>    
        </main>
    )
}