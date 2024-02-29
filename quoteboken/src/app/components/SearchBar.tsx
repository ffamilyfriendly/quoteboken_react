import style from "./SearchBar.module.css"
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    return (
        <div className={style.container}>
            <FaSearch />
            <input placeholder="search" className={style.input} type="search" />
        </div>
    )
}