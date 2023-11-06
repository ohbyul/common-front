import {Cookies} from "react-cookie";
import jwtDecode from 'jwt-decode';

const cookies = new Cookies()

export const setCookie = (name, value, option) =>{
  return cookies.set(name, value, {...option})
}

export const getCookie = (name) =>{
  return cookies.get(name)
}

export const removeCookie = (name) =>{
  return cookies.remove(name, { path: '/' })
}




export const decodeJwt = (cookie) => {
  let token = getCookie(cookie)

    if(!token){
        return null
    }
    const result =  jwtDecode(token)
    return result
} 

