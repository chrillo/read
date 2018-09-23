import React,{PureComponent} from 'react'
import styled from 'styled-components'
import { FeedItem } from './feedItem';

const StyledList = styled.div`
    max-width:960px;
    margin:0 auto;
   
`
export class Feed extends PureComponent{

    render(){
        const {items} = this.props

        return (<StyledList>
            {items.map((item)=>{
                return <FeedItem item={item} key={item.id} />
            })}
        </StyledList>)
    }
}