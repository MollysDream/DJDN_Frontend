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


//////
export async function getPostTitle(postId){
    console.log("getpostTitle");
    const postTitleData = await axi.get("/data/getPostTitle", {params:{postId:postId}});
    return postTitleData.data;
}




//HomeScreen 컴포넌트로 게시물 데이터 GET
export async function getPost(page, userId){
    console.log(`getPost함수 ${page} 페이지 호출됨/ 사용자 ID: ${userId}`);
    const postData = await axi.get("/data/getPost", {params:{page:page, userId:userId}});
    //console.log(postData.data);
    return postData.data;
}
// chat 내용 조회
export async function getChat(chatRoomId){
    console.log("getChat, requestAPI, 채팅로그 불러오는거");
    const preData = await axi.get("/chat/getChat", {params : {chatRoomId : chatRoomId}});
    //console.log(postData.data);
    return preData.data;
}
// chatroom 조회
export async function getChatRoom(){

    console.log("getroom, requestAPI, room정보 불러오는거");
    const roomData = await axi.get("/chat/getChatRoom");

    //console.log(postData.data);
    return roomData.data;
}
// current Id가 포함되어 있는 chatroom 조회
export async function getChatRoomById(currentUserId){
    console.log("getroomById : " , currentUserId);
    const RoomByIdData = await axi.get("/chat/getChatRoomById",{params : {currentUserId : currentUserId}});
    console.log(RoomByIdData.data);
    return RoomByIdData.data;
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
    //console.log(postData);
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
    const result = await axi.post("/data/updatePostView", {postId,view});
    return result.data;
}

export async function updatePostTradeStatus(postId, status){
    console.log("updatePostTradeStatus함수 호출됨");
    console.log(`거래 상태: ${status}로 변경`);
    const result = await axi.post("/data/updatePostTradeStatus", {postId, status});
    return result.data;
}

export async function getUserPost(userId){
    console.log('getUserPost함수 호출됨');
    const userPostData = await axi.get("/data/getUserPost", {params:{userId:userId}});

    return userPostData.data;
}

export async function getUserTradingPost(userId) {
    console.log('getUserTradingPost함수 호출됨');
    const userTradingPostData = await axi.get("/data/getUserTradingPost", {params:{userId:userId}});
    //console.log(userTradingPostData.data);
    return userTradingPostData.data;
}

export async function deletePost(postId){
    console.log('deletePost함수 호출됨');
    const result = await axi.delete("/data/deletePost", {params:{postId:postId}});

    return result.data;
}

// location = 거래장소 ex) 경기도 수원시 영통구 중부대로271번길, 27-9 104-1402
export async function createTradeTime({ startTime, endTime, workTime, location, userId1, userId2, postId }){
    console.log('createTradeTime함수 호출됨');
    const result = await axi.post("/trade/createTradeTime", { startTime, endTime, workTime, location, userId1, userId2, postId});
    return result.data;
}

export async function updateTradeTime({tradeInfo, workTime, endTime}){
    console.log('updateTradeTime함수 호출됨');
    const result = await axi.post("/trade/updateTradeTime", {tradeInfo, workTime, endTime});
    return result.data;
}

export async function endTrade(tradeId){
    console.log('endTrade함수 호출됨');
    const result = await axi.post("/trade/endTrade", {tradeId});
    return result.data;
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
    updatePostTradeStatus,
    getUserPost,
    updatePost,
    deletePost,
    getChat,
    getChatRoom,
    getChatRoomById,
    getUserTradingPost,
    getPostTitle
}
