import axios from 'axios';
import {RNS3} from "react-native-aws3";

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function userTest(){
    const info = await axi.get('/user/test')

    console.log(info.data)
    return info.data;
}

//Test
export async function postInfo({title, content, category, tag, view, date}){
    console.log("request");
    console.log({title,content});
    const info = await axi.post("/user/write", {title, content, category, tag, view, date});
    console.log(info);
    return info.data;
}

//HomeScreen 컴포넌트로 게시물 데이터 GET
export async function getPost(page, userId){
    console.log(`getPost함수 ${page} 페이지 호출됨/ 사용자 ID: ${userId}`);
    const postData = await axi.get("/data/getPost", {params:{page:page, userId:userId}});
    //console.log(postData.data);
    return postData.data;
}
///////////
export async function getChat(){
    console.log("getpre");
    const preData = await axi.get("/chat/getChat");
    //console.log(postData.data);
    return preData.data;
}
//////////////


export async function getPostBySearch(search){
    //console.log(search);
    console.log("getPostBySearch함수 호출됨");
    const postData = await axi.get("/data/getPostBySearch", {params:{searchValue : search}});
    return postData.data;
}

export async function createPost(postData){
    console.log("createPost함수 호출됨");
    console.log(postData);
    const info = await axi.post("/data/createPost", postData);
    return info.data;
}

export async function updatePost(postData){
    console.log("updatePost함수 호출됨");
    console.log(postData);
    const info = await axi.post("/data/updatePost", postData);
    return info.data;
}

export async function getPostByCategory(category){
    console.log("getPostByCategory함수 호출됨");
    console.log(category);
    const postData = await axi.get("/data/getPostByCategory", {params:{category:category}});
    return postData.data;
}

export async function postImageToS3(file, options){
    console.log("postImageToS3함수 호출됨");
    const imageData = await RNS3.put(file, options);
    //console.log(imageData.body.postResponse.location);
    return imageData.body.postResponse.location
}

export async function getCategoryList(){
    console.log('getCategoryList함수 호출됨');
    const categoryData = await axi.get("/data/getCategoryList");
    //console.log(categoryData.data);
    return categoryData.data;
}

export async function updatePostView({postId, view}){
    console.log('updatePostView함수 호출됨');
    await axi.post("/data/updatePostView", {postId,view});

}


export async function getUserPost(userId){
    console.log('getUserPost함수 호출됨');
    const userPostData = await axi.get("/data/getUserPost", {params:{userId:userId}});

    return userPostData.data;
}

export async function deletePost(postId){
    console.log('deletePost함수 호출됨');
    await axi.delete("/data/deletePost", {params:{postId:postId}});

}


// location = 거래장소 ex) 경기도 수원시 영통구 중부대로271번길, 27-9 104-1402
export async function createTradeTime({ startTime, endTime, workTime, location, userId1, userId2, postId }){
    console.log('createTradeTime함수 호출됨');
    await axi.post("/trade/createTradeTime", { startTime, endTime, workTime, location, userId1, userId2, postId});
}

export async function updateTradeTime({tradeInfo, workTime, endTime}){
    console.log('updateTradeTime함수 호출됨');
    await axi.post("/trade/updateTradeTime", {tradeInfo, workTime, endTime});
}

export async function endTrade(tradeId){
    console.log('endTrade함수 호출됨');
    await axi.post("/trade/endTrade", {tradeId});
}


export default{
    userTest,
    postInfo,
    getPost,
    getPostBySearch,
    createPost,
    getPostByCategory,
    postImageToS3,
    getCategoryList,
    updatePostView,
    getUserPost,
    updatePost,
    deletePost,
    getChat
}
