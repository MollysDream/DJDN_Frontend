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

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import requestChatAPI from "../../requestChatAPI";


// let roomById;
let userData;
let count = 0;

function ChatChScreen({navigation}) {
      const [currentId, setCurrentId] = useState("");
      const [roomById, setRoomById] = useState([]);
      //const [nickInfo, setNickInfo] = useState([]);
      const [refreshing, setRefreshing] = useState(false);
      const [rerender, setRerender] = useState(false);
      const [nickInfo, setNickInfo] = useState([]);
      const [host, setHost] = useState('');
      const [post, setPost] = useState('');

      useEffect(()=>{
        async function loadingCurrentId(){
            AsyncStorage
                .getItem('user_id')
                .then((value) => {
                    setCurrentId(value);
                });
            }
        loadingCurrentId();
      },[]);

      useEffect(()=>{
        async function loadingRoom(){
          console.log("현재 사용자 ID : ",currentId);
          let nick =[];

          if(currentId){
            const roomInfo = await request.getChatRoomById(currentId);
            userData = await requestUser.getUserData(currentId);
            await setRoomById(roomInfo);

            roomInfo.map(async (data)=>{

                let latestChat = await requestChatAPI.getLatestChat(data._id);
                //console.log(latestChat);
                let hostData = await requestUser.getUserData(data.hostId);
                setHost(hostData);
                let postOwnerData = await requestUser.getUserData(data.postOwnerId);
                setPost(postOwnerData);

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
        loadingRoom();
      },[currentId]);

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
            <TouchableHighlight onPress={() => {navigation.navigate('chatchroom', {host:host, postOwner: post, roomInfo: item})}}>
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
                            <View style={{flexDirection:'row'}}>
                                <Icon style={styles.chat_text} name="sms" size={20}/>
                                <Text style={[styles.chat_text,{width:140}]}>{` ${chat}`}</Text>
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
    postTitle:{
        fontSize:15,
        paddingTop:7,
        //borderWidth:1,
        width:170,

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
        marginRight:7,
        marginTop:1
    },
    user_data_text:{
        marginTop: 2,
        marginRight: 13
    },
    chat_text:{
        paddingTop: 18,
        color:'grey'
    },
    chatTime_text:{
        position:'absolute',
        right: 12,
        top: 10,
        color:'grey'
    }

});

export default ChatChScreen;
