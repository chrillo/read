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
        text-transform:uppercase;
    }
    .logout{
        margin-left: auto;
        font-size:13px;
        padding: 30px;
  
        color:#999;
        text-decoration:none;
    }
    @media (max-width: 1024px) { 
        .logo,.logout{
            padding: 30px 10px;
        }
    }
    @media (max-width: 768px) { 
      
    }
`

export const Header = ({user}={})=>{

    return (<StyledHeader>
        <div className="header-spacer"></div>
        <header>
            <span className="logo">Read</span>
            <Link href={'/logout'}>
                <a className="logout" >Logout</a>
            </Link>
        </header>
    </StyledHeader>)
   
}