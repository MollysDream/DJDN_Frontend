import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});


export async function getChatRoomByPost(currentUserId, postId){
	console.log("getChatRoomByPost 실행!: " , currentUserId, postId);
	const RoomByIdData = await axi.get("/chat/getChatRoomByPost",{params : {currentUserId : currentUserId, postId:postId}});
	// console.log(RoomByIdData.data);
	return RoomByIdData.data;
}


export default{
	getChatRoomByPost
}
