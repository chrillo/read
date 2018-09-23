import React from 'react'

import { Page } from '../components/app/page';
import { Header } from '../components/header/header'
import { Feed } from '../components/feed/feed';

import { getFeed } from '../lib/api';

export default class IndexPage extends React.Component{
    static async getInitialProps({ req }) {
        const feed = await getFeed({limit:20}, {req})
        return {feed}
    }
    render(){
        const {feed} = this.props
        return <Page title="read">
            <Header />
            {feed && <Feed items={feed} />}
        </Page>
    }
}