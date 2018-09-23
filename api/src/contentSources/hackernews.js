
import axios from 'axios'
import { promiseMap } from '../lib/helpers';
import url from 'url'

export const serializeItem = (sourceId) => (item)=>{
    item.sourceId = sourceId
    item.fingerprint = `hn:${item.id}`
    item.time = item.time * 1000
    item.type = 'url'
    item.itemSourceLabel = getItemSourceLabel(item)
    return item
}

export const getItemSourceLabel = (item)=>{
    let label = 'hn'
    if(item.url){
        label = url.parse(item.url).host 
        label = label.replace(/^www\./, '');
    }
    return label
}

export const getItems = async({count = 20, sourceId} = {})=>{
    const url = 'https://hacker-news.firebaseio.com/v0/topstories.json'
    const {data} = await axios.get(url)

    let ids = data.slice(0,count)

    const items = await promiseMap(ids,async(id)=>{
        const {data} = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return data
    },{concurrency:10})

    return items.map(serializeItem(sourceId))

}

