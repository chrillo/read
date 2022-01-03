import { FC } from "react"
import { Navigation } from "../nav/navigation"


export const Page:FC = ({children})=>{
    return <div className="page">
        <Navigation />
        <div className="page-content">
        {children}
        </div>
    </div>
}

export const PageActions:FC = ({children})=>{
    return <div className="page-actions">{children}</div>
}