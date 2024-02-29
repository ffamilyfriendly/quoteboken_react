"use client"
import { Colour, SafeStyleInstance, SafeStyle } from "@/utils/helpers"
import Style from "./Button.module.css"
import Colours from "../Colours.module.css"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"

const safe = new SafeStyleInstance(Style)

type BaseButtonProps = {
    size?: "huge" | "icon",
    width?: string,
    color?: Colour,
    disabled?: boolean,
    children?: ReactNode
}

interface LinkButtonProps extends BaseButtonProps {
    href: string
}

interface ClickButtonProps extends BaseButtonProps {
    onClick: () => void,
}

function isLinkButton(object: any): object is LinkButtonProps {
    return "href" in object
}

function isClickButton(object: any): object is ClickButtonProps {
    return "onClick" in object
}

type ButtonProps = LinkButtonProps | ClickButtonProps

export default function Button(props: ButtonProps) {
    const router = useRouter()
    
    if(isLinkButton(props)) {
        router.prefetch(props.href)
    }

    const handleOnClick = () => {
        if(props.disabled) return
        
        if(isLinkButton(props)) {
            

            router.push(props.href)
        } else if(isClickButton(props)) {
            props.onClick()
        }
        
    }

    return (
        <button onClick={handleOnClick} className={ `${Style.button} ${props.disabled ? Style.disabled : ""} ${safe.get(props.width, "width")} ${SafeStyle(Colours, props.color)} ${safe.get(props.size, "size")}` }>
            { props.children }
        </button>
    )
}