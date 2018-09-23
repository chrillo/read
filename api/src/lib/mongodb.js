import mongoose from 'mongoose'
import { log } from './log';

export const initMongoDb = ({MONGO_DB}) =>{
    log('mongodb','init mongodb')

    mongoose.connect(MONGO_DB,{ useNewUrlParser: true });
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true);

}