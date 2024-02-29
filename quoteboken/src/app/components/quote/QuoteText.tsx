"use client"
import { translateText } from "@/lib/quoteActions"
import { useState } from "react"

export default function QuoteText({ text, ...props }: { text: string }) {

    const [ translated, setTranslated ] = useState("")

    const handleTranslate = async () => {
        const res = await translateText(text)

        setTranslated(res)
        if(res) console.log("translated from ", text, " to ", res)
    }

    return (
        <div>
            <p>{ translated ? translated : text }</p>
            { translated ? null : <small onClick={() => handleTranslate()}>translate</small> }
        </div>
    )
}