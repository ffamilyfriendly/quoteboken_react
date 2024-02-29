import { db } from "@/lib/manager/db"
import Style from "./UserList.module.css"
import { timeDifference } from "@/utils/helpers"
import Link from "next/link"

export default async function UserList() {
    const users = await db.selectFrom("user").select(["id", "name", "lastLogin", "admin"]).execute()

    return (
        <main className={Style.main}>
            <table className={Style.table}>
                <tbody>
                <tr className={Style.tableHeader}>
                    <th>id</th>
                    <th>name</th>
                    <th>last login</th>
                    <th>admin</th>
                    <th>profile</th>
                </tr>
                { users.map(u => <tr key={u.id} className={Style.tableItem}><td>{u.id}</td> <td>{u.name}</td> <td>{ u.lastLogin ? timeDifference(Date.now(), new Date(u.lastLogin).getTime()) : "N/A"}</td> <td>{u.admin ? "yes" : "no"}</td>  <td><Link href={`/users/${u.id}`}>open</Link></td></tr>) }
                </tbody>
            </table>
            <small><b>{users.length}</b> user(s) registered.<br/>Open the user profile to change password / delete the account</small>
        </main>
    )
}