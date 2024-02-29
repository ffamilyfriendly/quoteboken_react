import UserManager from "../components/admin/UserManager"
import QuoteManager from "../components/admin/QuoteManager"

export default function Admin() {
    return (
        <main>
            <UserManager    />
            <QuoteManager   />
        </main>
    )
}