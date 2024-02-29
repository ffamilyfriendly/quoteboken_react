"use client"

import { IconType } from "react-icons";
import Style from "./Input.module.css"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type InputProps<T> = {
    Icon?: IconType,
    Type?: "password"|"text"|"number",
    Placeholder?: string,
    state: Dispatch<SetStateAction<T>>,
    value: string
}

export default function Input<T>({ ...props }: InputProps<T>) {

    const handleChange = ( e: ChangeEvent<HTMLInputElement> ) => {
        props.state(e.target.value as T)
    }

    return (
        <div className={Style.main}>
            <>{ props.Icon ? <props.Icon /> : null }</>
            <input onChange={handleChange} value={props.value} placeholder={props.Placeholder} type={ props.Type || "text" } className={Style.input}></input>
        </div>
    )
}