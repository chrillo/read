import React,{PureComponent} from 'react'
import styled from 'styled-components'
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'

const StyledListItem = styled.div`
    padding:10px 0;
    border-bottom:1px solid #eee;
    font-weight:300;
    display:flex;
    flex-direction:row;
    .title{
        flex:1;
    }
    a{
       
        color:#000;
        text-decoration:none;
        &:hover{
            text-decoration:underline;
        }
    }
    .source{
        font-size:12px;
        color:#999;
        flex:1;
        padding: 0 5px;
    }
    .age{
        font-size:12px;
        
        text-align:right;
        color:#999;
    }
   
`
export class FeedItem extends PureComponent{

    render(){
        const {item} = this.props
        if(!item) return null
        const {title, url, time,createdAt, itemSourceLabel} = item.contentItem
        return (<StyledListItem>
                <span class="title">
                    <a href={url} target="_blank">{title}</a>
                    <span className="source">{itemSourceLabel}</span>
                </span>
                <span className="age">{time ? distanceInWordsStrict(new Date(createdAt), new Date()): '-'}</span>
        </StyledListItem>)
    }
}