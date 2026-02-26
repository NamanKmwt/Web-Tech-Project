import { Link } from "react-router-dom"
import f1logo from "../images/f1logo.png"
export const Navbar = () => {
    return (
        <nav className="navbar px-4">
            <Link to = '/'>
                <img src = {f1logo}/>
            </Link> 
        </nav>
    )
}