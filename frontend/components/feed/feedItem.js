import React,{Component} from 'react'
import styled from 'styled-components'
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'

const StyledListItem = styled.div`
    padding:10px 0;
    border-bottom:1px solid #eee;
    font-weight:300;
    display:flex;
    flex-direction:row;
    align-items:center;
    opacity:${({read})=> read ? 0.1 : 1};
    
    .title{
        flex:1;
    }
    a{
        color:#000;
        text-decoration:none;
        &:hover{
            text-decoration:underline;
        }
        &:visited{
            color:#999;
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
    .actions{
        padding:0 5px;
        button{
            display:inline-block;
            padding:5px 10px;
        }
    }
    @media (max-width: 1024px) { 
        padding:10px 10px;
    }
    @media (max-width: 768px) { 
        font-size:16px;
        .actions{
            
        } 
    }
   
`
export class FeedItem extends Component{
    state = {}
    constructor(){
        super()
        this.item
    }
    onRead=()=>{
        
        const {onRead,item} = this.props
        if(onRead) onRead(item)
        this.setState({read:true})
    }
    componentDidMount(){

    }
    render(){
        const {item} = this.props
        if(!item) return null
        const {title, url, time,createdAt, itemSourceLabel} = item.contentItem
        const {read} = this.state
        return (<StyledListItem read={read}>
            
                <span className="title">
                    <a href={url} target="_blank">{title}</a>
                    <span className="source">{itemSourceLabel}</span>
                </span>
                <span className="age">{time ? distanceInWordsStrict(new Date(createdAt), new Date()): '-'}</span>
                <span className="actions"> 
                    <button disabled={read} onClick={this.onRead}>x</button>
                </span>
        </StyledListItem>)
    }
}