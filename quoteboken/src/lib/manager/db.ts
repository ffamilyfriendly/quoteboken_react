import { Database } from "./types"; 
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import UserManager from "./usermanager";


const dialect = new SqliteDialect({
    database: new SQLite("./database.db")
})

export const db = new Kysely<Database>({
    dialect
})

async function ensureTables() {
    console.log("ensuring tables exist!")
    await db.schema.createTable("user")
        .addColumn("id", "integer")
        .addColumn("name", "text")
        .addColumn("admin", "integer")
        .addColumn("lastLogin", "integer")
        .addColumn("password", "text")
            .ifNotExists().execute()

    await db.schema.createTable("quote")
        .addColumn("id", "text")
        .addColumn("text", "text")
        .addColumn("author", "text")
        .addColumn("authorPrefix", "text")
        .addColumn("date", "integer")
            .ifNotExists().execute()
}

async function ensureAdmin() {
    await ensureTables()

    const adminUser = await db.selectFrom("user").where("name", "=", "admin").selectAll().executeTakeFirst()
    if(adminUser) return

    console.log("!!! CREATING ADMIN USER !!!")

    db.insertInto("user").values({ password: await UserManager.HashPassword(process.env.ADMIN_PASSWORD as string), name: process.env.ADMIN_USERNAME as string, admin: 1 }).returningAll().executeTakeFirstOrThrow()
}

ensureAdmin()