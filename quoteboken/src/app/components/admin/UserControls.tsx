"use client"

import Style from "./UserControls.module.css"
import { changePassword, deleteUser } from "@/lib/userActions"
import Button from "../Button"

export default function UserControls({ uid }: { uid: number }) {
    "use client"
    
    const handleChangePassword = async () => {
        const psw =     prompt("new password")
        if(!psw) return
        const conPsw =  prompt("confirm password")

        if(psw != conPsw) return alert("passwords do not match")

        const res = await changePassword(uid, psw)

        if(!res.ok) {
            alert(res.data.devFriendly ?? res.data.message)
        } else {
            alert("updated!")
        }
    }

    const handleDeleteAccount = async () => {
        const confirm = prompt("Type DELETE to confirm deletion")

        if(confirm != "DELETE") return

        const res = await deleteUser(uid)

        if(!res.ok) {
            alert(res.data.devFriendly ?? res.data.message)
        } else {
            alert("deleted!")
        }

    }

    return (
        <div className={Style.main}>
            <Button onClick={handleChangePassword} color="primary" >Change Password</Button>
            <Button onClick={handleDeleteAccount} color="danger" >Delete Account</Button>
        </div>
    )
} 