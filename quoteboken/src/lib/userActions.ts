"use server"

import { db } from "@/lib/manager/db"
import { ApiResponse } from "../types"
import UserManager from "./manager/usermanager"
import { cookies } from "next/headers"

type UserSession = {
    admin: boolean,
    name: string,
    id: number
}

export async function createUser(username: string, password: string, admin: number): Promise<ApiResponse<null>> {
    try {
        const psw = await UserManager.HashPassword(password)
        await db.insertInto("user").values({ name: username, admin, password: psw }).execute()

        return {
            code: 200,
            ok: true,
            data: null
        }
    } catch(e) {
        console.log(e)
        return {
            code: 500,
            ok: false,
            data: {
                message: `${e}`,
                devFriendly: "Could not create user. Something went wrong"
            }
        }
    }
}

export async function changePassword(id: number, password: string): Promise<ApiResponse<null>> {
    try {
        const psw = await UserManager.HashPassword(password)
        await db.updateTable("user").set("password", psw).where("id", "=", id).execute()

        return {
            code: 200,
            ok: true,
            data: null
        }
    } catch(e) {
        console.log(e)
        return {
            code: 500,
            ok: false,
            data: {
                message: `${e}`,
                devFriendly: "Could not update user. Something went wrong"
            }
        }
    }
}

export async function deleteUser(id: number): Promise<ApiResponse<null>> {
    try {
        await db.deleteFrom("user").where("id", "=", id).execute()
        return {
            code: 200,
            ok: true,
            data: null
        }
    } catch(e) {
        console.log(e)
        return {
            code: 500,
            ok: false,
            data: {
                message: `${e}`,
                devFriendly: "Could not delete user. Something went wrong"
            }
        }
    }
}

export async function getSession(): Promise<UserSession|null> {
    const cookie = cookies().get("quoteboken_session")

    if(cookie) return JSON.parse(cookie.value) as UserSession
    else return null
}

export async function login(username: string, password: string): Promise<ApiResponse<boolean>> {
    const user = await db.selectFrom("user").where("name", "=", username).selectAll().executeTakeFirst()

    if(!user) {
        return {
            code: 404,
            ok: false,
            data: {
                message: "user not found",
                devFriendly: `User ${username} was not found`
            }
        }
    }

    try {
        const matches = await UserManager.ComparePassword(password, user.password)

        if(matches) {
            const session: UserSession = { admin: user.admin === 1, name: user.name, id: user.id }

            cookies().set("quoteboken_session", JSON.stringify(session), { secure: true })
            await db.updateTable("user").set({ lastLogin: Date.now().toString() }).where("id", "=", user.id).execute()

            return {
                code: 200,
                ok: true,
                data: matches
            }
        } else {
            return {
                code: 200,
                ok: false,
                data: {
                    message: "wrong password was provided"
                }
            }
        }
    } catch(err) {
        return {
            code: 500,
            ok: false,
            data: {
                message: `${err}`,
                devFriendly: "Something went wrong"
            }
        }
    }
}