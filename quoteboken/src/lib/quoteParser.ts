import { InsertObject } from "kysely"
import { Database } from "./manager/types"

type lexerSymbols = {
    quotePairs: string[],
    haramChars: string[]
}

const lSym: lexerSymbols = {
    quotePairs: [ '\'', '"', '”' ],
    haramChars: [ '“',  ]
}

const hashCode = (s: string) => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)

export default function parseQuotes(s: string): InsertObject<Database, "quote">[] {

    const res = {
        ok: 0,
        asym: 0,
        incest: 0
    }

    const quotes: InsertObject<Database, "quote">[] = []
    let buf: string = ""

    let firstChar = ""
    let lastCharPos: number = 0
    let sCharBuf = ""


    const DATEREGEX = /\d{4}\/[?|\d]+\/\d{2}/gmi

    for(const haram of lSym.haramChars)
        s = s.replace(haram, '"')


    let insanePeopleDate = false

    for( const ch of s ) {

        if(DATEREGEX.test(buf)) {

            const handleQuote = (asym: boolean) => {
                const quote = buf.substring(0, lastCharPos - 1)
                const date = buf.substring(quote.length + 1)

                const name = date.replace(DATEREGEX, "").replace(/\(.*\)/gi, "")
                const nameContext = date.match(/\(.*\)/gi)

                const dArr = date.split(" ")
                const [ year, month, day ] = dArr[dArr.length - 1].split("/")
                
                if(Number(year) === 2020) insanePeopleDate = true
                if(Number(year) === 2021 && Number(month) === 1) insanePeopleDate = false

                const dateObj = insanePeopleDate ? new Date(`${year}/${day}/${month}`) : new Date(`${year}/${month}/${day}`)

                const txt = quote.trim()
                const idSig = hashCode(txt).toString()

                quotes.push( { text: txt, id: Buffer.from(idSig).toString("base64"), date: dateObj.getTime(), authorPrefix: (nameContext?.length === 1 ? nameContext[0].replace(/(\(|\))/gi, "").trim() : undefined), author: name.trim().toLocaleLowerCase() } )
            }

            if(sCharBuf.length % 2 === 0) {
                res.ok += 1
                handleQuote(false)
            } else {
                if(sCharBuf.length === 3) {
                    res.asym += 1
                    handleQuote(true)
                } else {
                    res.incest += 1
                }
            }

            buf = ""
            firstChar = ""
            sCharBuf = ""
        }

        if(lSym.quotePairs.includes(ch)) {
            if(!firstChar) firstChar = ch
            else buf += ch

            lastCharPos = buf.length
            sCharBuf += ch
        } else if(ch === "\n") {
            buf += " "
        } else if (firstChar) {
            buf += ch
        }
    }

    return quotes
}