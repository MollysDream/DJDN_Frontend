import React, {useState,useEffect, useCallback} from 'react';
import { Content, Container, Header, Left, Right, Title, Body, Item, Label,
	Input, Form, Textarea } from 'native-base';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	RefreshControl,
	TouchableHighlight, Image
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {AnimatedAbsoluteButton} from 'react-native-animated-absolute-buttons';

import Icon from 'react-native-vector-icons/MaterialIcons';

import AsyncStorage from '@react-native-community/async-storage';
import requestUser from "../../requestUserAPI";
import request from '../../requestAPI';
import requestChat from '../../requestChatAPI';

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import requestChatAPI from "../../requestChatAPI";


let userData;
let roomInfo;
let count = 0;

function ChatListByPostScreen(props) {
	const [currentId, setCurrentId] = useState("");
	const [roomById, setRoomById] = useState([]);
	//const [nickInfo, setNickInfo] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [rerender, setRerender] = useState(false);
	const [nickInfo, setNickInfo] = useState([]);
	const [postId, setPostId] = useState(props.route.params.item._id);
	useEffect(()=>{
		loadingCurrentId();
	},[]);

	useEffect(()=>{
		loadingRoom();
	},[currentId]);

	async function loadingCurrentId(){
		AsyncStorage
			.getItem('user_id')
			.then((value) => {
				setCurrentId(value);
			});
	}
	async function loadingRoom(){
		if(currentId){
			let nick =[];
			roomInfo = await requestChat.getChatRoomByPost(currentId,postId);
			await setRoomById(roomInfo);
			console.log(`지금 랜더링 ${count++}: 번 실행됐다!`);
			console.log(roomInfo);
			roomInfo.map(async (data)=>{
				let latestChat = await requestChatAPI.getLatestChat(data._id);
				//console.log(latestChat);
				let partnerUserData;
				//let myUserData;
				if(currentId == data.hostId){
					//myUserData = await requestUser.getUserData(data.hostId);
					partnerUserData = await requestUser.getUserData(data.postOwnerId);
				}else{
					partnerUserData = await requestUser.getUserData(data.hostId);
					//myUserData = await requestUser.getUserData(data.postOwnerId);
				}

				let postData = await request.getPostTitle(data.postId);



				nick = nick.concat({_id : data._id/*, myUserData : myUserData*/ , partnerUserData : partnerUserData, postData : postData[0], latestChat:latestChat });
				await setNickInfo(nick);
			})
		}
	}

	async function onRefresh(){
		try{
			setRefreshing(true);
			console.log("setrefreshing", refreshing);
			let nick =[];
			const roomInfo = await request.getChatRoomById(currentId);
			userData = await requestUser.getUserData(currentId);
			setRoomById(roomInfo);

			roomInfo.map(async (data)=>{
				let latestChat = await requestChatAPI.getLatestChat(data._id);

				let partnerUserData;
				//let myUserData;
				if(currentId == data.hostId){
					//myUserData = await requestUser.getUserData(data.hostId);
					partnerUserData = await requestUser.getUserData(data.postOwnerId);
				}else{
					partnerUserData = await requestUser.getUserData(data.hostId);
					//myUserData = await requestUser.getUserData(data.postOwnerId);
				}

				let postData = await request.getPostTitle(data.postId);

				nick = nick.concat({_id : data._id/*, myUserData : myUserData */, partnerUserData : partnerUserData, postData : postData[0], latestChat:latestChat });
				setNickInfo(nick);

			})
			setRefreshing(false);
			setRerender(!rerender);

		}
		catch(err){
			console.log("DB에러")
			console.log(err);
		}
	}

	function returnFlatListItem(item,index){
		//let myUserData = item.myUserData;
		let partnerUserData = item.partnerUserData;
		let postData = item.postData;
		let chat = '';
		let chatTime = '';
		if(item.latestChat != null){
			chat = item.latestChat.text;
			chatTime = item.latestChat.createdAt;
		}
		return(
			<TouchableHighlight onPress={() => props.navigation.navigate('게시글별 채팅리스트 채팅방', {postOwner: userData, roomInfo: item})}>
				<View style={styles.chatRoomBox}>

					<View style={styles.userDataBox}>
						<Image style={styles.user_image} source={{uri:partnerUserData.profileImage}}/>
						<View style={styles.user_data_text}>
							<Text style={{fontSize:12, color:'grey'}}>{postData.addressName}</Text>
							<Text style={{fontWeight:'bold',fontSize:20}}>{partnerUserData.nickname}</Text>
							<View style={{flexDirection:'row'}}>
								<Icon style={styles.chat_text} name="sms" size={20}/>
								<Text style={styles.chat_text}>{` ${chat}`}</Text>
							</View>
						</View>

					</View>
					<Text style={styles.chatTime_text}>{chatTime}</Text>

				</View>
			</TouchableHighlight>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={nickInfo}
				keyExtractor={(item,index) => String(item._id)}
				renderItem={({item,index})=>returnFlatListItem(item,index)}
				//onEndReached={this.morePage}
				onEndReachedThreshold={1}
				extraData ={rerender}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			/>
		</View>
	);
}



const styles = StyleSheet.create({
	container:{
		//borderWidth:1,
		flex:1,
		paddingTop:5

	},
	chatRoomBox:{
		//borderBottomWidth: 1,
		marginRight:10,
		marginLeft:10,
		marginBottom:5,
		backgroundColor:'#c2ebff',
		borderRadius:10,
		flexDirection:'row'

	},
	userDataBox:{
		flexDirection:'row',
		paddingTop: 5,
		paddingLeft: 5,
		paddingBottom: 5
	},
	user_image:{
		width: wp(20),
		overflow:"hidden",
		height: hp(20),
		aspectRatio: 1,
		borderRadius: 40,
		marginRight:12,
		marginTop:1
	},
	user_data_text:{
		marginTop: 2
	},
	chat_text:{
		//borderWidth: 1,
		paddingTop: 8,
		color:'grey',
	},
	chatTime_text:{
		position:'absolute',
		right: 14,
		top: 10,
		color:'grey',
		fontSize: 15
	}

});

export default ChatListByPostScreen;
