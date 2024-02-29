import { getAuthors, getRandom } from "@/lib/quoteActions"
import Hero from "../components/Hero"
import GameView from "./GameView"
import Style from "./page.module.css"

export default async function Game() {
    return (
        <main>
            <Hero title="Drinking Game">
                <p>
                    You will be given 10 quotes with an unknown author. You will have to guess who said whatever horrible shit pops up. You will be given 3 options
                    <br/> <b>The one with the best time wins! The others drink 🍻</b>
                </p>
            </Hero>

            <GameView quotes={await getRandom(10)} options={await getAuthors()} />
        </main>
    )
}