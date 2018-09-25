import React,{PureComponent} from 'react'
import styled from 'styled-components'
import { FeedItem } from './feedItem';

const StyledList = styled.div`
    max-width:1100px;
    margin:0 auto;
    .no-items{
        font-size:24px;
        text-align:center;
        padding: 50px 0;
        color:#ccc;
        font-weight:300;
        text-transform:uppercase;
    }
`
export class Feed extends PureComponent{

    render(){
        const {items, onRead} = this.props

        return (<StyledList>
            {items.length > 0 && items.map((item)=>{
                return <FeedItem onRead={onRead} item={item} key={item.id} />
            })}
            {!items.length && <div className="no-items">Nothing to read, go do something else</div>}
        </StyledList>)
    }
}