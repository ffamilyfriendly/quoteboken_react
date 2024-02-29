"use server"

import { ApiResponse } from "../../../shared/types";
import PDFParser from "pdf2json"
import parseQuotes from "./quoteParser";
import { db } from "./manager/db";
import { Translate } from "@google-cloud/translate/build/src/v2" 
import { sql } from "kysely";

function parseJson(file: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const parser = new PDFParser(null, 1)
        
        parser.on("pdfParser_dataReady", pdfData => {
            // @ts-ignore
            resolve(parser.getRawTextContent())
            // @ts-check
        })

        parser.on("pdfParser_dataError", reject)

        parser.parseBuffer(Buffer.from(file))
    })
}

type res = {
    inserted: number,
    failed: number
}

export async function parseQuoteFile(data: FormData): Promise<ApiResponse<res>>  {
    const file: File | null = data.get("file") as unknown as File;

    if(!file) return {
        ok: false,
        code: 400,
        data: {
            message: "no file passed"
        }
    }

    let text: string = ""

    try {
        if(file.type === "application/pdf") {
            text = await parseJson(await file.arrayBuffer())
        } else if(file.type === "text/plain") {
            text = await file.text()
        }
    } catch(err) {
        return {
            code: 500,
            ok: false,
            data: {
                message: `${err}`,
                devFriendly: "could not parse file"
            }
        }
    }

    const quotes = parseQuotes(text)

    try {
        let re: res = { inserted: 0, failed: 0 }
        for(const quote of quotes) {
            try {
                await db.insertInto("quote").values(quote).execute()
                re.inserted += 1
            } catch(e) {
                re.failed += 1
            }
            
        }

        return {
            ok: true,
            code: 200,
            data: re
        }
    } catch(err) {
        return {
            ok: false,
            code: 500,
            data: {
                message: `${err}`,
                devFriendly: "could not save quotes"
            }
        }
    }
}

export async function getQuoteAmount(): Promise<ApiResponse<number>> {
    try {
        const r = await db.selectFrom("quote").select(db.fn.countAll().as("count")).executeTakeFirstOrThrow()

        return {
            ok: true,
            code: 200,
            data: Number(r.count)
        }
    } catch(err) {
        return {
            ok: false,
            code: 500,
            data: {
                message: `${err}`,
                devFriendly: "could not get count"
            }
        }
    }
}

export type returnValueThing = {
    text: string;
    date: number;
    id: string;
    author: string;
    authorPrefix: string | undefined
}

type compositeThing = {
    quotes: returnValueThing[],
    offset: number
}

export type getQuotesFilters = { name?: string, search?: string, after?: Date, before?: Date }

export async function getQuotes(offset: number, options?: getQuotesFilters): Promise<ApiResponse<compositeThing>> {
    let query = db.selectFrom("quote").orderBy("date asc").offset(offset).limit(30)

    if(options?.name) {
        query = query.where("author", "=", options.name)
    }

    if(options?.search) {
        query = query.where("text", "like", `%${options.search}%`)
    }

    if(options?.before) {
        query = query.where("date", "<", options.before.getTime())
    }

    if(options?.after) {
        query = query.where("date", ">", options.after.getTime())
    }

    try {
        const res = await query.selectAll().execute()

        return {
            ok: true,
            code: 200,
            data: {
                offset: offset + 31,
                quotes: res
            }
        }

    } catch(err) {
        return {
            ok: false,
            code: 500,
            data: {
                message: `${err}`,
                devFriendly: "could not get quotes"
            }
        }
    }
}

export async function getRandom(amount = 1) {
    return await db.selectFrom("quote").selectAll().orderBy(sql`random()`).limit(amount).execute()
}

export async function getAuthors() {
    return await db.selectFrom("quote").select(["author", db.fn.countAll().as("count")]).groupBy("author").orderBy("count desc").execute()
}

export async function translateText(txt: string) {
    const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_KEY })

    const [ translation ] = await translate.translate(txt, { to: "en" })

    return translation
}