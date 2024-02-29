"use client"
import { useState } from "react"
import Input from "../Input"
import Style from "./CreateUser.module.css"
import { FaCog, FaLock, FaUser } from "react-icons/fa"
import Button from "../Button"
import { createUser } from "@/lib/userActions"
import { useRouter } from "next/navigation"

export default function CreateUser() {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ admin, setAdmin ] = useState(0)

    const router = useRouter()

    const onClick = async () => {
        const res = await createUser(username, password, Number(admin))

        if(!res.ok) {
            alert(res.data.devFriendly ?? res.data.message)
        } else {
            router.refresh()
        }
    }

    return (
        <main className={Style.main}>
            <h2>new user</h2>

            <h5>Username</h5>
            <Input Icon={ FaUser } Placeholder="username" value={ username } state={ setUsername } Type="text" />

            <h5>Password</h5>
            <Input Icon={ FaLock } Placeholder="password" value={ password } state={ setPassword } Type="password" />

            <h5>Admin</h5>
            <Input Icon={ FaCog } Placeholder="0" value={ admin.toString() } state={ setAdmin } />
            <small>this account <b>{ (admin == 1) ? "will be" : "won't be" }</b> an admin.</small>

            <Button color="primary" onClick={onClick} disabled={ !username || !password } width="100%">Create</Button>
        </main>
    )
}