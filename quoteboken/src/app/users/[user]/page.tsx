import { db } from "@/lib/manager/db"
import Hero from "../../components/Hero"
import Style from "./page.module.css"
import { timeDifference } from "@/utils/helpers"
import { getSession } from "@/lib/userActions"
import UserControls from "@/app/components/admin/UserControls"
import QuoteView from "@/app/components/quote/QuoteView"

type PageParams = {
    params: { user: number|string }
}

export default async function UserPage({ params }: PageParams) {
    let query = db.selectFrom("user").select([ "name", "lastLogin", "admin", "id" ])

    if(typeof params.user === "string") {
        query = query.where("name", "=", params.user)
    } else {
        query = query.where("id", "=", params.user)
    }

    const user = await query.executeTakeFirstOrThrow()

    const ses = await getSession()

    return (
        <main className={ Style.main }>
            <Hero title={ user.name + (user.admin ? " (admin)" : "") } image="/laban.png">
                <div>
                    <small>Last seen { timeDifference(Date.now(), user.lastLogin) }</small>
                </div>
            </Hero>
            { ( ses?.admin || ses?.id == params.user ) ? <UserControls uid={ user.id } /> : null }
            <QuoteView name={ user.name } />
        </main>
    )
}