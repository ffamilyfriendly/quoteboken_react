"use client"

import { Dispatch, SetStateAction, useState } from "react"
import TabbedView from "../TabbedView"
import Style from "./QuoteManager.module.css"
import { FaFolderOpen } from "react-icons/fa6"
import Button from "../Button"
import { parseQuoteFile } from "@/lib/quoteActions"
import { useRouter } from "next/navigation"

type inputThingValue = {
    state: Dispatch<SetStateAction<File|null>>,
    value: File|null
}

function TextInputThing(props: inputThingValue) {

    const onChange = (target: EventTarget & HTMLTextAreaElement) => {
        const txt = target.value
        const file = new File([ new Blob([txt], { type: "text/plain" })], "quotes.txt", { type: "text/plain" })

        props.state(file)
    }

    return (
        <div>
            <b>Text-input</b>
            <textarea onChange={(e) => { onChange(e.target) }} placeholder="wow massa quotes här..." className={Style.textarea}>

            </textarea>
            <small>Shallom Labean! Kopiera all text från quote-dokumentet och klistra in åvan</small>
        </div>
    )
}

function PdfInput(props: inputThingValue) {

    const onChange = (target: EventTarget & HTMLInputElement) => {
        if(target.files) props.state(target.files[0])
    }

    return (
        <div className={Style.inputContainer}>
            <b>file-input</b>
            <div className={Style.filearea}>
                <input onChange={(e) => { onChange(e.target) }} className={Style.fileareaInput} type="file" accept="application/pdf"></input>
                <FaFolderOpen color={ (props.value && props.value.name.endsWith("pdf")) ? "lightgreen" : "white" } />
            </div>
            
            <small>Shallom Labean! Använd text-input ist.</small>
        </div>
    )
}

export default function UploadQuotes() {
    const [ file, setFile ] = useState<File|null>(null)
    const router = useRouter()

    const uploadQuotes = async () => {
        if(!file) return

        const formData = new FormData()
        formData.append("file", file)

        const r = await parseQuoteFile(formData)

        if(r.ok) {
            router.refresh()
        } else {
            alert(r.data.devFriendly ?? r.data.message)
        }
    }

    return (
        <main>
            <h1>Quotes</h1>

            <TabbedView 
                pages={[
                    [ "text", <TextInputThing key={0} value={file} state={setFile} /> ],
                    [ "pdf", <PdfInput key={1} value={file} state={setFile} /> ],
                ]}
            />

            <Button onClick={uploadQuotes} disabled={ !file } width="100%" color="primary">ladda upp</Button>
        </main>
    )
}