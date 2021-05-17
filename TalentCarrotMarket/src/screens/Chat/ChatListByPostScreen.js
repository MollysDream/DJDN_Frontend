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

import AsyncStorage from '@react-native-community/async-storage';
import requestUser from "../../requestUserAPI";
import request from '../../requestAPI';
import requestChat from '../../requestChatAPI';

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


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
				let partnerUserData;
				let myUserData;
				if(currentId == data.hostId){
					myUserData = await requestUser.getUserData(data.hostId);
					partnerUserData = await requestUser.getUserData(data.postOwnerId);
				}else{
					partnerUserData = await requestUser.getUserData(data.hostId);
					myUserData = await requestUser.getUserData(data.postOwnerId);
				}

				let postData = await request.getPostTitle(data.postId);


				nick = nick.concat({_id : data._id, myUserData : myUserData , partnerUserData : partnerUserData, postData : postData[0] });
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
				let partnerUserData;
				let myUserData;
				if(currentId == data.hostId){
					myUserData = await requestUser.getUserData(data.hostId);
					partnerUserData = await requestUser.getUserData(data.postOwnerId);
				}else{
					partnerUserData = await requestUser.getUserData(data.hostId);
					myUserData = await requestUser.getUserData(data.postOwnerId);
				}

				let postData = await request.getPostTitle(data.postId);

				nick = nick.concat({_id : data._id, myUserData : myUserData , partnerUserData : partnerUserData, postData : postData[0] });
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
		let myUserData = item.myUserData;
		let partnerUserData = item.partnerUserData;
		let postData = item.postData;
		return(
			<TouchableHighlight onPress={() => props.navigation.navigate('게시글별 채팅리스트 채팅방', {postOwner: userData, roomInfo: item})}>
				<View style={styles.chatRoomBox}>
					<Image style={styles.post_image} source={{ uri: postData.image[0]}} />
					<View style={{flexDirection:'column'}}>
						<Text style={styles.postTitle}>{postData.title}</Text>
						<View style={styles.userDataBox}>
							<Image style={styles.user_image} source={{uri:partnerUserData.profileImage}}/>
							<View style={styles.user_data_text}>
								<Text style={{fontSize:11, color:'grey'}}>{postData.addressName}</Text>
								<Text style={{fontWeight:'bold',fontSize:15}}>{partnerUserData.nickname}</Text>
							</View>

						</View>
					</View>

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
	postTitle:{
		fontSize:15,
		paddingTop:7
	},
	userDataBox:{
		flexDirection:'row',
		paddingTop: 5
	},
	post_image:{
		width: wp(20),
		overflow:"hidden",
		height: hp(20),
		aspectRatio: 1,
		borderRadius: 9,
		marginRight:12
	},
	user_image:{
		width: wp(10),
		overflow:"hidden",
		height: hp(10),
		aspectRatio: 1,
		borderRadius: 40,
		marginRight:12,
		marginTop:1
	},
	user_data_text:{
		marginTop: 2
	},
	post:{
		flexDirection: "row",
		//borderRadius: 15,
		backgroundColor: "white",
		borderBottomColor: "#a6e5ff",
		borderBottomWidth: 1,
		padding: 10,
		height: 100
	},
});

export default ChatListByPostScreen;
