import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function getUserAddress(userId){
    console.log(`getUserAddress함수 ${userId} ID 호출됨`);
    const categoryData = await axi.post("/address/checkAddress",{userId:userId});
    console.log(categoryData.data);
    return categoryData.data;
}

export default{
    getUserAddress
}