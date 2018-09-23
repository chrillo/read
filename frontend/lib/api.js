import { setCookie, getCookies } from "./cookie";
import axios from '../../api/node_modules/axios'

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


export const login = async({email, password})=>{
    const {login:user} = await getGraphQLQuery(`mutation{
        login(email:"${email}", password:"${password}"){
            id,
            email, 
            role,
            jwt
        }
    }`)
    if(user && user.jwt){
        setCookie('user', JSON.stringify(user))
        setCookie('jwt', user.jwt)
    }
    return user
}

export const getFeed = async({limit},ctx)=>{
    const {feed} = await getGraphQLQuery(`query{
        feed(limit: 100) {
            id
            read
            contentItem {
              id
              title
              time
              url
              createdAt
            }
        }
    }`,ctx)

    return feed
  
}

export const getGraphQLQuery = async(query, ctx)=>{

    let {jwt} = getCookies(ctx)
    let headers = jwt ? {'Authorization': `Bearer ${jwt}`} : {}

    try{
        let res = await axios({
            url: `${getBase(ctx)}/graphql`,
            method: 'POST',
            headers,
            data:{query},
        })
        if(res){
            return res.data.data
        }
    }catch(e){
        console.log('ajax error', e)
    }
    return null

}