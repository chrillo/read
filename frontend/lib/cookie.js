import cookie from 'cookie'
export const setCookie = (name,value,days)=>{
    var expires = ''
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = '; expires=' + date.toUTCString()
    }
    document.cookie = name + '=' + value + expires + '; path=/'
}

export const getCookies = ({req} = {}, options = {})=>{
    return cookie.parse(
        req && req.headers ? req.headers.cookie : document.cookie,
        options
    )
}