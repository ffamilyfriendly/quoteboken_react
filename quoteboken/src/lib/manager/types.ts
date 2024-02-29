import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable
} from 'kysely'

export interface Database {
    user: UserTable,
    quote: QuoteTable
}

export interface UserTable {
    id: Generated<number>,
    name: string,
    admin: number,
    lastLogin: ColumnType<number, string | undefined, string | undefined>,
    password: string
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type EditUser = Updateable<UserTable>

export interface QuoteTable {
    id: string,
    text: string,
    author: string,
    authorPrefix?: string,
    date: ColumnType<number, number, never>
}

export type Quote = Selectable<QuoteTable>
export type NewQuote = Insertable<QuoteTable>
export type EditQuote = Updateable<QuoteTable>