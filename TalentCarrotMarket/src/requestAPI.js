import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000/"});

export async function userTest(){
    const info = await axi.get('/user/test')

    console.log(info.data)
    return info.data;
}

export async function postInfo({title,content}){
    console.log("request")
    console.log({title,content});
    const info = await axi.post("/user/write", {title, content});
    console.log(info);
    //return info.data;
}

export default{
    userTest,
    postInfo
}