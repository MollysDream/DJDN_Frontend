import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {GiftedChat} from 'react-native-gifted-chat'
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';
import requestUser from "../../requestUserAPI";
import request from '../../requestAPI';
import { IconButton } from 'react-native-paper';
import {HOST} from "../../function";
import requestChatAPI from "../../requestChatAPI";
// import {AnimatedAbsoluteButton} from 'react-native-animated-absolute-buttons';

let socket;
let chatRoomId="";
let currentUserId ;
function ChatScreen(props) {
    const [messages, setMessages] = useState([]);
    const [postOwnerId, setPostOwnerId] = useState(
        props.route.params.postOwner._id
    );
    const [hostId, sethostId] = useState("");
    const [roomId, setRoomId] = useState("");
    const [postOwnerNick, setPostOwnerNick] = useState(
        props.route.params.postOwner.nickname
    );
    const [postId, setpostid] = useState(props.route.params.item._id);
    // const [currentUserId, setCurrentUserId] = useState("");
    const [currentUserImage, setCurrentUserImage] = useState('');

    async function loadingCurrentUserId() {
      await AsyncStorage
        .getItem('user_id')
        .then((value) => {
          currentUserId = value;
        })
      let currentUser = await requestUser.getUserData(currentUserId);
      setCurrentUserImage(currentUser.profileImage);
    };
    loadingCurrentUserId()

    useEffect(() => {
      async function loadingUserId(){
        await AsyncStorage
          .getItem('user_id')
          .then((value) => {
            sethostId(value);
          })
      };
      loadingUserId();
    }, []);

    useEffect(() => {
        async function workBeforeChat() {

          socket = io(`http://${HOST}:3002`);
          // socket.emit("searchChatRoom", postOwnerId, postOwnerNick, hostId);

          const roomData = await request.getChatRoom();
          await Room(roomData);

          const preData = await request.getChat(chatRoomId);
          checkChat(preData);
          socket.emit('joinRoom', chatRoomId);
          console.log("joinRoom 실행됐다!! 방 번호 : " + chatRoomId);
        }
        if(currentUserId){
          workBeforeChat();

          socket.on('chat message to client', (newMessage) => {
            let newMessaged = newMessage;
            console.log("프론트에서 받은 새 메시지 : " +  newMessaged[0].text);
            setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessaged));
          });

          return() => {
            socket.emit('leaveRoom', chatRoomId);
            console.log("leaveRoom 실행됐다!! 방 번호 : " + chatRoomId);
          };
        }


    }, [currentUserId]);

    function onSend(newMessage = []) {
        socket.emit("chat message to server", newMessage, chatRoomId);
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
        onSendDB(newMessage);
    };

    async function Room(roomData){
      let flag = 0;
      // 받아온 roomData에서 조건문 실행해서 값이 존재하면 flag = 1 로 바꾸고, 채팅방 입장.
      roomData.map((data)=>{

        if(data.postOwnerId == postOwnerId && data.hostId == currentUserId && data.postId == postId ){
          chatRoomId = data._id;
          // console.log("roomData.map에서 찾은 postOwnerId : "+ postOwnerId);
          // console.log("roomData.map에서 찾은 hostId : ", hostId);
          // console.log("roomData.map에서 찾은 currentUserId : ", currentUserId);
          console.log("조회중 찾았다! : ", chatRoomId);
          socket.emit('joinRoom', chatRoomId);

          flag = 1;
          return false;
        }
      })

      // flag = 0이면 채팅방 새로 생성
      if(flag == 0){
        console.log('flag가 0이어서 채팅방 새로 생성한다.');
        let newChatRoom = {
          hostId : currentUserId,
          postOwnerId : postOwnerId,
          postId : postId,
        }
        let roomInfo;
        await axios.post(`http://${HOST}:3000/chat/createChatRoom`, newChatRoom)
          .then((data)=>{
            // console.log(data);
            roomInfo = data.data;
            chatRoomId = roomInfo._id;
            socket.emit("joinRoom", chatRoomId);
           })

      }
    }

    async function checkChat(preData){  //채팅 내용들 중에서 내가 보낸 것, 상대방이 보낸 것 구분
      if (preData.length != 0) {
        let postOnwer = await requestUser.getUserData(postOwnerId);
        let postOnwerImage = postOnwer.profileImage;

        console.log(postOnwer.nickname);

        let host = await requestUser.getUserData(currentUserId);
        let hostImage = host.profileImage;
        console.log("호스트Id : " +hostId);
        console.log("호스트닉네임 : " +host.nickname);

        preData.map((data) => {
            if (data.senderId == currentUserId) {
                setMessages((prevMessages) => GiftedChat.append(prevMessages, [
                    {
                        _id: data._id,
                        text: data.text,
                        createdAt: data.createdAt,
                        user: {
                            _id: currentUserId,
                            avatar: currentUserImage
                        }
                    }
                ]));
            } else {
                setMessages((prevMessages) => GiftedChat.append(prevMessages, [
                    {
                        _id: data._id,
                        text: data.text,
                        createdAt: data.createdAt,
                        user: {
                            _id: postOwnerId,
                          avatar: postOnwerImage
                        }
                    }
                ]));
            }
        });
      }
    }

    async function onSendDB(newMessage) {
        let beforeTime = new Date();
        let month = beforeTime.getMonth() + 1;
        let time = beforeTime.getFullYear() + '-' + month + '-' + beforeTime.getDate() +
                ' ' + beforeTime.getHours() + ':' + beforeTime.getMinutes() + ':' +
                beforeTime.getSeconds();
        let textId = newMessage[0]._id;
        let createdAt = time;
        let text = newMessage[0].text;
        let senderId = currentUserId;
        let roomId = chatRoomId;


        let newChat = {
            beforeTime: time,
            textId: textId,
            createdAt: createdAt,
            text: text,
            senderId: senderId,
            roomId: chatRoomId
        }
        console.log("hostId: ");
        console.log("chatRoomId : ", chatRoomId);
        console.log("roomId : ", roomId);
      let chatData = await requestChatAPI.createChat(newChat);
    }

    return (
        <View style={styles.container}>
          <View style={styles.rowTopArea}>
            <View style={{position:'absolute', right:50, backgroundColor:'#ffcaa1', borderRadius:20, padding:3}}>
              <Text style={{fontSize:15, color:'black'}}>시계 아이콘을 눌러 거래를 제안해보세요!</Text>
            </View>
            <View style={styles.clockButtonContainer}>
              <IconButton
                icon="clock"
                size={36}
                color="#6646ee"
                onPress={()=>props.navigation
                  .navigate('tradeset',{
                    user1:postOwnerId,
                    user2:currentUserId,
                    chatRoom:chatRoomId
                  })}
              />
            </View>
          </View>
            <GiftedChat
                messages={messages}
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                    _id: currentUserId,
                  avatar: currentUserImage

                }}/>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 400
    },
    rowTopArea: {
      flex: 0.1,
      // paddingTop: hp(3),
      // paddingLeft: wp(10),
      flexDirection: "row",
      alignItems: 'center',
    },
    clockButtonContainer: {
        position: 'absolute',
        top: 1,
        right: 0,
        zIndex: 1
      },
});

export default ChatScreen;
