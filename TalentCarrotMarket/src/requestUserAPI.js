import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function getUserData(userId){
    console.log('getUsersData함수 호출됨');
    const userData = await axi.get("/user/getUserData", {params:{userId:userId}});
    //console.log(categoryData.data);
    return userData.data;
}

export async function updateUserCategoryAndSort({userId, newUserCategory, newSort}){
    console.log('updateUserCategory함수 호출됨');
    const userData = await axi.post("/user/updateUserCategoryAndSort", {userId,newUserCategory, newSort});
    return userData.data;
}

export async function updateUserAddressIndex(userId, addressIndex){
    console.log(`updateUserAddressIndex함수 호출됨 아이디: ${userId} // 인덱스: ${addressIndex}`);
    const result = await axi.post("/user/updateUserAddressIndex", {userId,addressIndex});
    return result.data;
}

export async function updateUserProfile(userId, editNickname, editImage) {
    console.log(`updateUserProfile함수 호출됨 // 닉네임: ${editNickname} ID: ${userId}`);
    console.log(editImage);
    const result = await axi.post("/user/updateUserProfile", {userId,editNickname, editImage});
    return result.data;
}

export default{
    getUserData,
    updateUserCategoryAndSort,
    updateUserAddressIndex,
    updateUserProfile

}
