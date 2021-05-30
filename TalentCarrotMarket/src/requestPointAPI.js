import axios from 'axios';
import {HOST} from "./function";

const axi = axios.create({baseURL: `http://${HOST}:3000`});

export async function addPoint(user_id, amount){
	console.log('addPoint함수 호출됨');
	const point = await axi.post("/point/addPoint", {user_id,amount});
	return point.data;
}

export async function getPoint(user_id){
	console.log('getPoint함수 호출됨');
	const point = await axi.get("/point/getPointById", {params:{user_id:user_id}});
	return point.data;
}

export async function createPoint(email){
	console.log("createPoint함수 호출됨");
	const info = await axi.post("/point/createPoint", {email});
	return info.data;
}

export default{
	addPoint,
	getPoint,
	createPoint
}
