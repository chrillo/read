import {ApolloServer} from 'apollo-server-express'
import expressPlayground from 'graphql-playground-middleware-express'
import {resolvers, typeDefs} from './schema'
import { log } from '../lib/log';

export const initGraphQl = ({app,IS_DEV,JWT_SECRET})=>{
    // Construct a schema, using GraphQL schema language
    log('graphql','init graphql api')
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        context: ({ req,res }) => ({
            req,
            res,
            JWT_SECRET,
            user: req.user
        })
     });
    server.applyMiddleware({ app })

    if(IS_DEV){
       log('graphql','init graphql playground')
       app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
    }
}