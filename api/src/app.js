import timber from 'timber'

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import {errorHandler} from './lib/apiError'
import url from 'url'
import {initMongoDb} from './lib/mongodb'
import { updateContentSources, updateContentSource, updateContentItem, publishContentItem } from './workers/contentSources';
import { initJobs, JOBS } from './lib/jobs';
import {initGraphQl} from './graphql/graphqlApi'
import jwt from 'express-jwt';
import { log } from './lib/log';


const CONFIG = process.env

const IS_DEV = CONFIG.NODE_ENV !== 'production'
log('app','init env', CONFIG.NODE_ENV)
if(process.env.NODE_ENV === 'production'){
    log('app','init logging')
    const transport = new timber.transports.HTTPS(process.env.TIMBER);
    timber.install(transport);
}

initMongoDb(CONFIG)


const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use(jwt({ secret: CONFIG.JWT_SECRET, credentialsRequired: false }))

initGraphQl({app, IS_DEV, JWT_SECRET: CONFIG.JWT_SECRET})

app.get('/', (req, res)=>{
    res.json({status:'ok'})
})


app.use(errorHandler);


const start = async(port)=>{
    log('app','start', port)
  
    let jobs = await initJobs(CONFIG)

    jobs.purge()

    jobs.define(JOBS.UPDATE_CONTENT_SOURCES, updateContentSources({jobs}))
    jobs.define(JOBS.UPDATE_CONTENT_SOURCE, updateContentSource({jobs}))
    jobs.define(JOBS.UPDATE_CONTENT_ITEM, updateContentItem({jobs}))
    jobs.define(JOBS.PUBLISH_CONTENT_ITEM, publishContentItem({jobs}))

    jobs.every('5 minutes', JOBS.UPDATE_CONTENT_SOURCES);

    return app.listen(port, async(err) => {
        log('app',`ready on http://localhost:${port}`)
        if (err) throw err
    })

}

module.exports = start
