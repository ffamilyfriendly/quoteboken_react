import { compare, hash } from "bcrypt"

export default class UserManager {
    constructor() {

    }

    static HashPassword(psw: string): Promise<string> {
        return new Promise((resolve, reject) => {
            hash(psw, 10, (err, hash) => {
                if(err) return reject(err)
                else return resolve(hash)
            })
        })
    }

    static ComparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            compare(plainPassword, hashedPassword, (err, hash) => {
                if(err) return reject((err))
                else return resolve(hash)
            })
        })
    }
}