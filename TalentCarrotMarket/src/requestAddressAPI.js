import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function getUserAddress(userId){
    console.log(`getUserAddress함수 ${userId} ID 호출됨`);
    const categoryData = await axi.post("/address/checkAddress",{userId:userId});
    //console.log(categoryData.data);
    return categoryData.data;
}

export async function updateRadius(userId, Radius){
    console.log(`updateRadius함수 호출됨 ${Radius}m ${userId} ID 호출됨`);
    await axi.post("/address/updateRadius", {userId:userId, radius:Radius});
}

export default{
    getUserAddress,
    updateRadius
}