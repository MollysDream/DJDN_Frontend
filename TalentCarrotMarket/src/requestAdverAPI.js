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

export async function deleteAdver(_id){
    console.log('deleteAdver함수 호출됨');
    const result = await axi.delete("/advertisement/deleteAdver", {params:{_id:_id}});
    return result.data;
}

export async function updateAdver(adverData){
    console.log("updateAdver 호출됨");
    console.log(adverData);
    const info = await axi.post("/advertisement/updateAdver", adverData);
    return info.data;
}

export async function getMyAdver(userId) {
    console.log('getMyAdver함수 호출됨');
    console.log("여기 : ", userId);
    const InfoData = await axi.get("/advertisement/getMyAdver", {params : {userId : userId}});
    //console.log(userTradingPostData.data);
    return InfoData.data;
}

export async function updateAdverApprove(_id, approve){
    console.log("updateAdverApprove함수 호출됨");
    console.log(`거래 상태: ${approve}로 변경`);
    const result = await axi.post("/advertisement/updateAdverApprove", {_id, approve});
    return result.data;
}


export async function updateAdverActive(_id, active){
    console.log("updateAdverActive함수 호출됨");
    console.log(`거래 상태: ${active}로 변경`);
    const result = await axi.post("/advertisement/updateAdverActive", {_id, active});
    return result.data;
}

export async function getAdverByAddressName(addressName) {
    console.log('getAdByAddressName함수 호출됨');
    const adverData = await axi.get("/advertisement/getAdverByAddressName", {params:{addressName:addressName}});
    //console.log(userTradingPostData.data);
    return adverData.data;
}

export default{
    createAdver,
    updateAdverApprove,
    getAdver,
    getMyAdver,
    deleteAdver,
    updateAdver,
    updateAdverActive,
    getAdverByAddressName
}