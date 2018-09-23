import React,{createRef} from 'react'
import { Page } from '../components/app/page';
import { login } from '../lib/api';
import styled from 'styled-components'

const StyledForm = styled.form`

    max-width:320px;
    height:90vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    margin: 0 auto;
    h1{
        font-size:24px;
    }
    p{
        width:100%;
        margin-bottom:5px;
    }
    label{
        font-size:13px;
        color:#999;
    }
    input{
        display:block;
        width:100%;
        padding:5px;
    }
    input[type=submit]{
        background:#000;
        display:block;
        border:none;
        color:#FFF;
        width:100%;
        margin-top:10px;
        padding:10px 0;

    }
`

export default class LoginPage extends React.Component{
    constructor(){
        super()
        this.emailRef = createRef()
        this.passwordRef = createRef()
    }
    onLogin = async(event)=>{
        event.preventDefault()
        const email = this.emailRef.current.value
        const password = this.passwordRef.current.value
        let user = await login({email,password})
    }
    render(){

        return <Page title="read">
                <StyledForm onSubmit={this.onLogin}>
                    <h1>Login</h1>
                    <p><label>Email: <input value="" type="email" ref={this.emailRef} /></label></p>
                    <p><label>Password: <input value="" type="password" ref={this.passwordRef} /></label></p>
                    <input type="submit" value="Login" />
                </StyledForm>
        </Page>
    }
}