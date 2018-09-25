import Agenda from 'agenda'
import { log } from './log';

export const JOBS = {
    UPDATE_CONTENT_SOURCES:'content:sources:update',
    UPDATE_CONTENT_SOURCE:'content:source:update',
    UPDATE_CONTENT_ITEM:'content:item:update',
    PUBLISH_CONTENT_ITEM:'content:item:publish'
}

export const initJobs = async({MONGO_DB})=>{
    log('jobs','init jobs')
    const agenda = new Agenda({
        db: {address: MONGO_DB, options:{ useNewUrlParser: true }},
        lockLimit:20
    });
    await agenda.start();
    log('jobs','jobs started')

   

    return agenda

}