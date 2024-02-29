"use client"
import Style from "./page.module.css"
import { getRandom, returnValueThing as rawQuoteData } from "@/lib/quoteActions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Quote from "../components/quote/Quote";
import Button from "../components/Button";
import Link from "next/link";

function shuffle(array: any[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function GameRound( props: { quote: rawQuoteData, options: string[], next: () => void  } ) {

    // I hate javascript
    const correct = props.quote.author

    const copyQuote = JSON.parse(JSON.stringify(props.quote)) as rawQuoteData
    copyQuote.author = "<REDACTED>"

    const [ disabled, setDisabled ] = useState(false)

    const correctAnswer = () => {
        props.next()
    }

    const wrongAnswer = () => {
        setDisabled(true)
    }

    useEffect(() => {
        if(disabled) {
            setTimeout(() => {
                setDisabled(false)
            }, 2000)
        }
    })

    const options = [
        <Button disabled={disabled} key={1} onClick={correctAnswer} color="primary">{ correct }</Button>,
        <Button disabled={disabled} key={2} onClick={wrongAnswer} color="primary">{ props.options[0] }</Button>,
        <Button disabled={disabled} key={3} onClick={wrongAnswer} color="primary">{ props.options[1] }</Button>
    ]

    return (
        <>
            <Quote data={copyQuote} />

            <div className={ Style.options }>
                { shuffle(options) }
            </div>
        </>
    )
}


function Result(props: { result: number }) {
    let bully = "ur cheating bruh"

    if(props.result > 20) bully = "max verstappen!!"
    if(props.result > 30) bully = "nice nice"
    if(props.result > 100) bully = "that's not very good"
    if(props.result > 160) bully = "nice going, grandma!"
    if(props.result > 200) bully = "how????"
    if(props.result > 1000) bully = "you suck"

    return (
        <div className={ Style.result }>
            <div>
                <h1>Result is in!</h1>
                <h3>you completed the questions in <b>{props.result.toFixed(1)}</b>seconds...</h3>
                <h5>{bully}</h5>
                <Button href="/" width="100%" color="primary">Home</Button>
            </div>
        </div>
    )
}

export default function GameView({ quotes, options, ...props}: { quotes: rawQuoteData[], options: { author:string, count: string | number | bigint }[] }) {
    const [ cursor, setCursor ] = useState(0)
    const [ start, setStart ] = useState<number | undefined>()
    const [ result, setResult ] = useState<number|null>(null)

    const opt = (): string[] => {
        let rv: string[] = []

        const acceptable = options.filter(p => (!p.author.includes("-") && p.author != quotes[cursor].author)).splice(0, 15)

        for(let i = 0; i < 2; i++) {
            const index = Math.floor(Math.random() * acceptable.length)
            const item = acceptable.splice(index, 1)

            rv[i] = item[0].author
        }

        return rv
    }

    const handleNext = () => {

        if(!start) setStart(Date.now())

        if(cursor == quotes.length - 1) {
            if(!start) return
            const diff = Date.now() - start

            setResult(diff / 1000)
        } else setCursor(c => c+1)
    }

    return (
        <div className={ Style.game }>
            { result ? <Result result={result} /> : null }
            <h1> question: {cursor + 1}/10 </h1>
            <GameRound next={handleNext} quote={quotes[cursor]} options={ opt() } />
        </div>
    )
}