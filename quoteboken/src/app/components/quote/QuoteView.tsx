"use client"
import { RefObject, useEffect, useMemo, useRef, useState } from "react"
import { getAuthors, getQuotes, getQuotesFilters, returnValueThing as rawQuoteData } from "@/lib/quoteActions"
import Quote from "./Quote"
import QuoteStyle from "./Quote.module.css"
import Style from "./QuoteView.module.css"

import Input from "../Input"
import { FaSearch } from "react-icons/fa"

type QuoteViewProps = {
    name?: string
}

const getUniqueBy = (arr: rawQuoteData[]) => {
    const set = new Set;
    return arr.filter(o => !set.has(o.id) && set.add(o.id));
};

function safeFormat(d: Date|undefined): string {
    let rv = ""

    if(!d) return rv

    try {
        rv = d.toISOString()?.substring(0,10)
    } catch(e) { }

    return rv
}

export default function QuoteView(props: QuoteViewProps) {
    const [ name, setName ] = useState(props.name)
    const [ search, setSearch ] = useState("")
    const [ before, setBefore ] = useState<Date|undefined>()
    const [ after, setAfter ] = useState<Date|undefined>()

    const [ nameOptions, setNameOptions ] = useState<string[]>([])

    const clearFilters = () => {
        setName(props.name)
        setSearch("")
        setBefore(undefined)
        setAfter(undefined)
    }

    useEffect(() => {
        const fetchAuthors = async () => {
            const authors = await getAuthors()
            setNameOptions(authors.map(a => a.author))
        }
        
        fetchAuthors()
    }, [])

    return(
        <main>
            <div className={ Style.filters }>
                <Input Placeholder="search..." Type="text" Icon={ FaSearch } value={ search } state={ setSearch } />

                <div className={ Style.filterRow }>

                    <div>
                        <small>Author</small>
                        <select className={ Style.selectPerson } onChange={(e) => { setName(e.target.value) }} value={name}>
                            <option value={""} defaultChecked={true}>all</option>
                            { nameOptions.map(n => <option key={n} value={n}>{n}</option>) }
                        </select>
                    </div>

                    <div>
                        <small>after</small>
                        <input className={ Style.date } value={safeFormat(after)} onChange={(e) => { setAfter(new Date(e.target.value)) }} type="date"></input>
                    </div>

                    <div>
                        <small>before</small>
                        <input className={ Style.date } value={safeFormat(before)} onChange={(e) => { setBefore(new Date(e.target.value)) }} type="date"></input>
                    </div>
                    
                </div>
                <small onClick={clearFilters}>clear</small>
            </div>

            <QuoteViewInner name={name} search={search} after={after} before={before} />
        </main>
    )
}

export function useOnScreen(ref: RefObject<HTMLElement>) {

    const [isIntersecting, setIntersecting] = useState(false)
  
    const observer = useMemo(() => new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    ), [ref])
  
  
    useEffect(() => {
      observer.observe(ref.current as Element)
      return () => observer.disconnect()
    }, [])
  
    return isIntersecting
}

export function QuoteViewInner( { ...props }: getQuotesFilters ) {

    const [ quotes, setQuotes ] = useState<rawQuoteData[]>([])
    let [ offset, setOffset ] = useState(0)

    const ref = useRef<HTMLElement>(null)
    const isVisibile = useOnScreen(ref)


    const fetchQuotes = async ( fresh = false ) => {
        console.log("getting quotes with offset ", offset)
        const q =  await getQuotes(offset, props)

        if(q.ok) {
            if(!fresh) {
                setQuotes(qList => {
                    qList.push(...q.data.quotes)
                    return qList
                })
            } else {
                setQuotes(q.data.quotes)
            }
            console.log(q.data)
            setOffset(q.data.offset)
        }
        
    }

    useEffect(() => {
        console.log("got change...")
        const timeout = setTimeout(() => {
            console.log("running change")
            setOffset(offset = 0)
            fetchQuotes(true)
        }, 500)


        return () => {
            clearTimeout(timeout)
        }
    }, [ props.name, props.search, props.before, props.after ])

    useEffect(() => {
        if(isVisibile && quotes.length > 1) {
            fetchQuotes()
            console.log("visible")
        }
    }, [ isVisibile ])

    return (
        <main>            
            <section className={QuoteStyle.quoteList}>
                { getUniqueBy(quotes).map(qw => <Quote key={qw.id} data={qw} />) }
            </section>
            <small ref={ref} onClick={() => { fetchQuotes() }}>load more</small>
        </main>
    )
}