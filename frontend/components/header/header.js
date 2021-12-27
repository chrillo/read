import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const StyledHeader = styled.div`
    header{
        position:fixed;
        height:50px;
        display:flex;
        left:0;
        right:0;
        top:0;
        background:#FFF;
        align-items:center;
        box-shadow:0 0 15px 0 rgba(0,0,0,0.1);
    }
    .header-spacer{
        height:50px;
        width:100%;
    }

    .logo{
        padding: 0 30px;
        font-weight:300;
        color:#000;
        text-decoration:none;
        text-transform:uppercase;
    }

    .actions{
        margin-left: auto;
        button{
            display:flex;
            height:50px;
            border:none;
            cursor:pointer;
            border-left: 1px solid #ccc;
            background: #FFF;
            padding: 0 10px;
            color:#999;
        }
    }
    @media (max-width: 1024px) { 
        .logo,.logout{
            padding: 30px 10px;
        }
    }
    @media (max-width: 768px) { 
      
    }
`

export const Header = ({user,feedMeta, onMarkAllAsRead}={})=>{
    const {feedItemCount} = feedMeta || {}
    return (<StyledHeader>
        <div className="header-spacer"></div>
        <header>
            <Link href="">
                <a className="logo">Read</a>
            </Link>
            <div className="actions">
                {feedItemCount > 0 && <button onClick={onMarkAllAsRead}>
                    Mark {feedItemCount} as read
                </button>}
            </div>
        </header>
    </StyledHeader>)
   
}