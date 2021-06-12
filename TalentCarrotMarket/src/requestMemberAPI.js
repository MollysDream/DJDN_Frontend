import axios from 'axios';
import {HOST} from "./function";

const axi = axios.create({baseURL: `http://${HOST}:3000`});

export async function getRegister(email, password, name, nickname,phoneNumber){
    console.log('getRegister함수 호출됨');
    const userData = await axi.post("/member/join", {email,password, name, nickname,phoneNumber});
    return userData;
}

export async function getLogin(email, password,token){
    console.log('getLogin함수 호출됨');
    const userData = await axi.post("/member/login", {email,password,token});
    return userData;
}

export async function autoLogin(userId, token){
    console.log('autoLogin함수 호출됨');
    const userData = await axi.post("/member/autoLogin", {userId, token});
    return userData;
}

export default{
    getRegister,
    getLogin,
    autoLogin
}