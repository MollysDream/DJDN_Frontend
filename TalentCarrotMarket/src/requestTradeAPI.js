import axios from 'axios';
import {HOST} from "./function";

const axi = axios.create({baseURL: `http://${HOST}:3000`});

export async function getTrade(chatRoom){
    console.log('getTrade함수 호출됨');
    const returnData = await axi.post("/trade/getTrade", {chatRoom});
    return returnData;
}

export async function createTradeTime(startTime,endTime,location,sender,receiver,chatRoom,longitude,latitude){
    console.log('createTradeTime함수 호출됨');
    const returnData = await axi.post("/trade/createTradeTime", {startTime,endTime,location,sender,receiver,chatRoom,longitude,latitude});
    return returnData;
}

export async function agreeTrade(tradeId){
    console.log('agreeTrade함수 호출됨');
    const returnData = await axi.post("/trade/agreeTrade", {tradeId});
    return returnData;
}

// export async function updateTradeLocation(tradeId, longitude, latitude){
//     console.log('updateTradeLocation함수 호출됨');
//     const returnData = await axi.post("/trade/updateTradeLocation", {tradeId, longitude, latitude});
//     return returnData;
// }

export async function deleteTrade(tradeId){
    console.log('deleteTrade함수 호출됨');
    const returnData = await axi.post("/trade/deleteTrade", {tradeId});
    return returnData;
}

export async function getEndTrade(tradeId){
    console.log('getEndTrade함수 호출됨');
    const returnData = await axi.post("/trade/getEndTrade", {tradeId});
    return returnData;
}

export async function updateTradeTime(tradeId,endTime){
    console.log('updateTradeTime함수 호출됨');
    const returnData = await axi.post("/trade/updateTradeTime", {tradeId,endTime});
    return returnData;
}

export async function endSuggestTrade(tradeId,sender,receiver){
    console.log('endSuggestTrade함수 호출됨');
    const returnData = await axi.post("/trade/endSuggestTrade", {tradeId,sender,receiver});
    return returnData;
}

export async function endTrade(tradeId){
    console.log('endTrade함수 호출됨');
    const returnData = await axi.post("/trade/endTrade", {tradeId});
    return returnData;
}

export async function userRate(userId,rate,tradeId){
    console.log('userRate함수 호출됨');
    const returnData = await axi.post("/trade/userRate", {userId,rate,tradeId});
    return returnData;
}

export default{
    getTrade,
    createTradeTime,
    agreeTrade,
    deleteTrade,
    getEndTrade,
    updateTradeTime,
    endSuggestTrade,
    endTrade,
    userRate
}