import { setCookie, getCookies } from "./cookie";
import axios from 'axios'
import Router from 'next/router'

const isDev = ({req} = {})=>{
    return (req && req.hostname.indexOf('localhost') > -1) || 
    (typeof window !== 'undefined' && location.href.indexOf('localhost') > -1)
}

const getBase =(ctx)=>{
    let base = 'https://read-api.chrillo.at'
    if(isDev(ctx)){
        base = 'http://localhost:8080'
    }
    return base
}

export const markAsRead = async({feedItemIds})=>{
    const data = await getGraphQLQuery(`mutation{
        markAsRead(feedItemIds:["${feedItemIds.join('","')}"]){
            id,
            read
        }
    }`)
    console.log('marked as read', data)
}

export const markAllAsRead = async()=>{
    const data = await getGraphQLQuery(`mutation{
        markAllAsRead{
            feedItemCount
        }
    }`)
    console.log('marked all as read', data)
}

export const login = async({email, password})=>{
    const {login:user, errors} = await getGraphQLQuery(`mutation{
        login(email:"${email}", password:"${password}"){
            id,
            email, 
            role,
            jwt
        }
    }`)
    if(user && user.jwt){
        setCookie('user', JSON.stringify(user), 365)
        setCookie('jwt', user.jwt, 365)
    }
    return user
}

export const logout = ()=>{
    setCookie('user', null,-1)
    setCookie('jwt', null,-1)
}

export const getFeed = async({limit},ctx)=>{
    const {feed,feedMeta} = await getGraphQLQuery(`query{
        feedMeta{
            feedItemCount,
            contentSourceCount
        }
        feed(limit: ${limit}) {
            id
            read
            contentItem {
              id
              title
              time
              url
              itemSourceLabel
              createdAt
            }
        }
    }`,ctx)

    return {feed,feedMeta}
  
}
export const getUser = (ctx)=>{
    const {user} =getCookies(ctx)
    if(user){
        return JSON.parse(user)
    }
    return null
} 

const handleGraphQLError = (errors, ctx)=>{
    // TODO: refactor this
    if(errors && errors.length){
        const error = errors[0]
        if(error.extensions){
            const {code} = error.extensions
            if(code === 'UNAUTHENTICATED'){
                if(ctx && ctx.res){
                    console.log('redirect',{Location: '/login'})
                    ctx.res.writeHead(302, {Location: '/login'})
                    ctx.res.end()
                }else{
                    Router.push('/login')
                }
                return
            }
        }
        throw new Error(error.message)
    }
}

export const getGraphQLQuery = async(query, ctx)=>{

    let {jwt} = getCookies(ctx)
    let headers = jwt ? {'Authorization': `Bearer ${jwt}`} : {}
    let res 
    try{
        res = await axios({
            url: `${getBase(ctx)}/graphql`,
            method: 'POST',
            headers,
            data:{query},
        })
    }catch(e){
        console.log('ajax error', e)
    }
    if(res){
        const {data,errors} = res.data
        handleGraphQLError(errors, ctx)
        return data
    }
   
    return null

}