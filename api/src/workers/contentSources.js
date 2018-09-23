import { getItems as getHackernewsItems } from "../contentSources/hackernews";

import {ContentSource} from '../contentSources/contentSource'
import {ContentItem} from '../contentSources/contentItem'
import { JOBS } from "../lib/jobs";
import { promiseMap } from "../lib/helpers";
import { ContentSourceConnection } from "../contentSources/contentSourceConnection";
import { FeedItem } from "../feeds/feedItem";
import { log } from "../lib/log";

export const SOURCE_TYPES = {
    'hackernews':getHackernewsItems
}

export const updateContentSources = ({jobs}) => async(job, done)=>{

    const sources = await ContentSource.find().exec()

    log('worker-content-source','sources loaded', sources.length)
    await promiseMap(sources,async(source)=>{
        await jobs.now(JOBS.UPDATE_CONTENT_SOURCE, {sourceId: source._id})
    },{concurrency:5})
    log('worker-content-source','content sources update scheduled')
    done()
    

}

export const updateContentSource = ({jobs})=>async(job, done)=>{

       const {sourceId} = job.attrs.data || {}
       log('worker-content-source','start content source udpate', sourceId)
       let source = await ContentSource.findById(sourceId)
       if(!source) return
       if(source.updatedAt && (Date.now() - source.updatedAt.getTime()) < 4 * 60 * 1000){
           log('worker-content-source','source has recently been updated', Date.now() - source.updatedAt.getTime())
           return done()
       }
       
       source.updatedAt = new Date()
       source.status = 'updating'
       source = await source.save()

       const getItems = SOURCE_TYPES[source.type]
       
       if(getItems){
            log('worker-content-source','loading items for source', source.id)
            let items = await getItems({count:20, sourceId: source._id})
            log('worker-content-source','got items for source',source.id, items.length)
            await promiseMap(items, async(item)=>{
                    await jobs.now(JOBS.UPDATE_CONTENT_ITEM,{item})
            },{concurrency:5})  
       }else{
            log('worker-content-source','unkown source type', source.id)
       }
       source.status = 'active'
       source = await source.save()
       done()
       log('worker-content-source','end content source update', sourceId)
       return source
}

export const updateContentItem = ({jobs})=>async(job, done)=>{
 
     const {item} = job.attrs.data
     if(!item){
         done()
         return
     }
     const query ={
        fingerprint:item.fingerprint
    }
    const options = {
        upsert:true,
        setDefaultsOnInsert:true
    }
   
    let contentItem = await ContentItem.findOneAndUpdate(query,item, options)
    
    if(!contentItem){
        contentItem = await ContentItem.findOne(query) 
        await jobs.now(JOBS.PUBLISH_CONTENT_ITEM, {contentItemId:contentItem._id})
    }
    log('worker-content-source','content item updated', contentItem._id) 
    done()
    return contentItem
}

export const publishContentItem = ({jobs})=>async(job, done)=>{
    const {contentItemId} = job.attrs.data 
    const contentItem = await ContentItem.findById(contentItemId)
    if(!contentItem){
        log('worker-content-source','content item not found', contentItemId)
        done()
        return
    }
    const {contentSourceId} = contentItem
    const connections = await ContentSourceConnection.find({contentSourceId})

    // TODO: handle uniquenes constraint errors
    const feedItems = connections.map((connection)=>{
        log('worker-content-source','publish content item',contentItem._id)
        return new FeedItem({
            user: connection.user,
            contentSource: connection.contentSource,
            contentItem: contentItem._id
        })
    })  
    // TODO: handle case of individual failures
    await FeedItem.insertMany(feedItems)

    done()
}