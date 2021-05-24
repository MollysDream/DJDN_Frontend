import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function getRegister(email, password, name, nickname){
    console.log('getRegister함수 호출됨');
    const userData = await axi.post("/member/join", {email,password, name, nickname});
    return userData;
}

export async function getLogin(email, password){
    console.log('getLogin함수 호출됨');
    const userData = await axi.post("/member/login", {email,password});
    return userData;
}

export default{
    getRegister,
    getLogin
}