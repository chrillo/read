import { FC } from "react"
import { Navigation } from "./navigation"


export const Page:FC = ({children})=>{
    return <div className="page">
        <Navigation />
        <div className="page-content">
        {children}
        </div>
    </div>
}