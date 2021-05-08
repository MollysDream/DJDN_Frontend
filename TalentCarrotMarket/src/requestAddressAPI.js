import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function getUserAddress(userId){
    console.log(`getUserAddress함수 ${userId} ID 호출됨`);
    const categoryData = await axi.post("/address/checkAddress",{userId:userId});
    //console.log(categoryData.data);
    return categoryData.data;
}

export async function updateRadius(userId, Radius, addressIndex){
    console.log(`updateRadius함수 호출됨 인덱스:${addressIndex} ${Radius}m ${userId} ID 호출됨`);
    await axi.post("/address/updateRadius", {userId:userId, radius:Radius, addressIndex:addressIndex});
}

export async function createAddress(userId, addressName, chooseIndex){
    console.log(`createAddress함수 호출됨 ${addressName}으로 ${chooseIndex}인덱스로 ${userId} ID 호출됨`);
    await axi.post("/address/createAddress", {userId:userId, addressName:addressName, chooseIndex:chooseIndex});
}

export async function certifyAddress(addressDataParam){
    console.log(`certifyAddress함수 호출됨`);
    console.log(addressDataParam);
    const returnData = await axi.post("/address/certifyAddress", addressDataParam);
    //console.log(returnData.data);
    return returnData.data;
}

export default{
    getUserAddress,
    updateRadius,
    createAddress,
    certifyAddress
}