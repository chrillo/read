import React from 'react'

import { Page } from '../components/app/page';
import { Header } from '../components/header/header'
import { Feed } from '../components/feed/feed';

import { getFeed, getUser, markAsRead, markAllAsRead } from '../lib/api';

export default class IndexPage extends React.Component{
    static async getInitialProps(ctx) {
        const {feed,feedMeta} = await getFeed({limit:50}, ctx)
        return {feed,feedMeta}
    }
    onRead = async(item)=>{
        await markAsRead({feedItemIds:[item.id]})
    }
    onMarkAllAsRead = async()=>{
       
        const {feedMeta} = await markAllAsRead()
        console.log('on mark all as read', feedMeta)
    }
    render(){
        const {feed, feedMeta} = this.props
        return <Page title="read">
            <Header onMarkAllAsRead={this.onMarkAllAsRead} feedMeta={feedMeta} />
            {feed && <Feed items={feed} onRead={this.onRead} />}
           
        </Page>
    }
}