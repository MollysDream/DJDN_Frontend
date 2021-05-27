import axios from 'axios';
import {HOST} from "./function";

const axi = axios.create({baseURL: `http://${HOST}:3000`});


export async function getChatRoomByPost(currentUserId, postId){
	console.log("getChatRoomByPost 실행!: ");
	const RoomByPostData = await axi.get("/chat/getChatRoomByPost",{params : {currentUserId : currentUserId, postId:postId}});
	console.log("getChatRoomByPost 백 왔다 갔다옴! 길이! : " + RoomByPostData.data.length);
	return RoomByPostData.data;
}

export async function getLatestChat(chatRoomId){
	console.log("getLatestChat함수 실행!:");
	const chatData = await axi.post('/chat/getLatestChat', {chatRoomId:chatRoomId});
	//console.log(chatData.data)
	return chatData.data;
}


export default{
	getChatRoomByPost,
	getLatestChat
}
