import React from 'react'
import Router from 'next/router'
import { Page } from '../components/app/page';
import { logout } from '../lib/api';
export default class LogoutPage extends React.PureComponent{

    componentDidMount(){
        logout()
        Router.push('/login')
    }
    render(){
        return <Page>Logging out...</Page>
    }
}
