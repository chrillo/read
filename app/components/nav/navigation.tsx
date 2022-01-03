import { NavLink } from "remix"


export const Navigation = ()=>{
    return <nav className="navigation">
        <NavLink className={({isActive})=>isActive ? 'active' : ''} to="/">Read</NavLink>
        <NavLink className={({isActive})=>isActive ? 'active' : ''} to="/feed">Feeds</NavLink>
    </nav>
}