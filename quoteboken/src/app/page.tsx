import { getSession } from "@/lib/userActions";
import Button from "./components/Button";
import Hero from "./components/Hero";
import styles from "./page.module.css";
import { FaCog, FaUser } from "react-icons/fa";
import QuoteView from "./components/quote/QuoteView";
import { HeroSubtitle } from "./components/HeroSubtitle";



export default async function Home() {
  const user = await getSession()

  return (
    <main className={styles.main}>
      <Hero title="Quoteboken" image="/laban.png">
        <HeroSubtitle />
        <div>
          <Button color="primary" size="icon" href={ `/users/${user?.id}` }>  <FaUser />  </Button>
          <> { user?.admin ? <Button color="secondary" size="icon" href={ `/admin` }>  <FaCog />  </Button> : null } </>
        </div>
      </Hero>
      
      <div className={ styles.buttonRow }>
        <Button href="/game" size="huge"> 🍻 </Button>
      </div>
      
      <h2>Quotes</h2>
      <QuoteView />
    </main>
  );
}
