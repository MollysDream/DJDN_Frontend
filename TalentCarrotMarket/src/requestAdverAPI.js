import axios from 'axios';
import {RNS3} from "react-native-aws3";
import {HOST} from "./function";

const axi = axios.create({baseURL: `http://${HOST}:3000`});

export async function createAdver(adverData){
    console.log("createAdver함수 호출됨");
    //console.log(postData);
    const info = await axi.post("/advertisement/createAdver", adverData);
    return info.data;
}


export async function getAdver() {
    console.log('getAdver함수 호출됨');
    const adverData = await axi.get("/advertisement/getAdver");
    //console.log(userTradingPostData.data);
    return adverData.data;
}

export async function updateAdverActive(_id, active){
    console.log("updateAdverActive함수 호출됨");
    console.log(`거래 상태: ${active}로 변경`);
    const result = await axi.post("/advertisement/updateAdverActive", {_id, active});
    return result.data;
}

export async function createPoint(email){
    console.log("createPoint함수 호출됨");
    const info = await axi.post("/advertisement/createPoint", {email});
    return info.data;
}

export default{
    createAdver,
    updateAdverActive,
    getAdver,
    createPoint

}