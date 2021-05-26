import axios from 'axios';
import {RNS3} from "react-native-aws3";

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function createAdver(adverData){
    console.log("createAdver함수 호출됨");
    //console.log(postData);
    const info = await axi.post("/advertisement/createAdver", adverData);
    return info.data;
}

export async function getRequestAdver() {
    console.log('getUserTradingPost함수 호출됨');
    const adverData = await axi.get("/advertisement/getRequestAdver");
    //console.log(userTradingPostData.data);
    return adverData.data;
}


export default{
    createAdver,
    getRequestAdver

}