import Link from "next/link"
import Style from "./Quote.module.css"
import { returnValueThing as rawQuoteData } from "@/lib/quoteActions"
import QuoteText from "./QuoteText"

type QuoteProps = {
    data: rawQuoteData
}

export default function Quote(props: QuoteProps) {
    const { id, text, author, authorPrefix, date } = props.data

    return (
        <div className={ Style.main } >
            <div className={ Style.row }>
                <QuoteText text={text} />
                
                <div>
                    <Link href={`/users/${author}`}><b>{author}</b></Link>
                    <p className={ Style.timestamp }>{ new Date(date).toLocaleDateString() }</p>
                </div>
            </div>
            
        </div>
    )
}