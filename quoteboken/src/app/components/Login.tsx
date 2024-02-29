"use client"

import { FaUserCircle, FaLock  } from "react-icons/fa";
import Input from "./Input"
import Style from "./Login.module.css"
import Button from "./Button";
import { useState } from "react";
import { login } from "@/lib/userActions";


export default function Login() {

    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")

    const handleLogin = async () => {
        const res = await login(username, password)

        if(res.ok) {
            alert("logged in!")
        } else {
            alert(res.data.devFriendly ?? res.data.message)
        }
    }

    return (
        <main className={Style.main}>
            <div className={ Style.container }>
                <div>
                    <h5>Username</h5>
                    <Input value={username} state={setUsername} Placeholder="BigJohnson69" Icon={ FaUserCircle  } />
                </div>
                <div>
                    <h5>Password</h5>
                    <Input value={password} state={setPassword} Type="password" Icon={ FaLock  } />
                </div>
                <Button onClick={handleLogin} disabled={ !username || !password } color="primary" width="100%">Login</Button>
                <a href="https://www.youtube.com/watch?v=as5WyxIgM9o"><small>Ive forgotten my password</small></a>
            </div>
        </main>
    )
}