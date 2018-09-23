import { User } from "../users/user";
import ApiError from "../lib/apiError";
import bycrypt from 'bcrypt/bcrypt'
import jwt from 'jsonwebtoken'
import { log } from "../lib/log";


const ERRORS = {
    INVALID_LOGIN:{code:10001, message:'Invalid login', code:401},
    NOT_AUTHORIZED:{code:10002, message:'Not Authorized', code: 401}
}

export const hashPassword = async(password)=>{
    return bycrypt.hash(password, 1)
}
export const login = async({email, password,JWT_SECRET})=>{

    email = email.trim()
    password = password.trim()

    if(!email){
        throw new ApiError(ERRORS.INVALID_LOGIN)
    }
    if(!password){
        throw new ApiError(ERRORS.INVALID_LOGIN)
    }

    let user = await User.findOne({email}).select('+password')
    if(!user){
        throw new ApiError(ERRORS.INVALID_LOGIN)
    }
    
    let valid = await bycrypt.compare(password, user.password)
    if(!valid){
        throw new ApiError(ERRORS.INVALID_LOGIN)
    }

    const {id, role} = user 

    const authUser = {
        email,
        id, 
        role
    }

    const token = jwt.sign(authUser, JWT_SECRET);
    authUser.jwt = token
    log('auth','successful login for', id)
    return authUser

}