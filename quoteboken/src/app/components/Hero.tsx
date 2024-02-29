import { Fredoka } from "next/font/google"
import Style from "./Hero.module.css"
import Image from "next/image"

const fredoka = Fredoka({ subsets: ["latin"] });

type HeroProps = {
    title: string,
    image?: `/${string}`,
    children?: any|any[]
}

export default function Hero( { title, ...props }: HeroProps ) {
    return (
        <div className={Style.main}>
            <div className={Style.image}>
                { props.image ? <Image fill={true} src={props.image} alt="image" /> : null }
            </div>
            <h1 className={ fredoka.className }>{ title }</h1>
            <div className={ Style.content }>
                { props.children }
            </div>
        </div>
    )
}