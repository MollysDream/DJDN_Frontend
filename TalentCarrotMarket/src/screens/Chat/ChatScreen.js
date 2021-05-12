import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {GiftedChat} from 'react-native-gifted-chat'
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';
import requestUser from "../../requestUserAPI";
import request from '../../requestAPI';
import {AnimatedAbsoluteButton} from 'react-native-animated-absolute-buttons';

let socket;
let messages;
let host ;
let roomID;
let chatRoomId;

function ChatScreen(props) {
    const [messages, setMessages] = useState([]);
    const [postOwnerId, setPostOwnerId] = useState(
        props.route.params.postOwner._id
    );
    const [hostId, sethostId] = useState();
    const [roomId, setRoomId] = useState("");
    const [postOwnerNick, setPostOwnerNick] = useState(
        props.route.params.postOwner.nickname
    );
    const [postId, setpostid] = useState(props.route.params.item._id);

    const buttons = [
        {
            color: '#4672B8',
            content: <View>
                <Text>
                    ⌚ 🗺️</Text>
                <Text>시간 장소</Text>
            </View>,
            action: () => {
                props
                    .navigation
                    .navigate('tradeset')
            }
        }
    ];
    useEffect(() => {
        function loadingUserId(){
        AsyncStorage
            .getItem('user_id')
            .then((value) => {
                sethostId(value);
            });
        }
        loadingUserId();
    }, []);

    let hostNick = "";

 

    useEffect(() => {
        async function createChat() {
            host = await requestUser.getUserData(hostId);
            hostNick = host.nickname;

            //  채팅방 조회 -> 연결 -> 채팅방 존재 여부 확인 -> 해당 채팅방의 채팅기록 가져오기
            const roomData = await request.getChatRoom();


            socket = io("http://10.0.2.2:3002");
            console.log("io 정보", socket);
            socket.emit("searchChatRoom", postOwnerId, postOwnerNick, hostId);
           
            Room(roomData);

            const preData = await request.getChat(chatRoomId);
            checkChat(preData);
          

            return() => {
                socket.emit('leaveRoom', chatRoomId);
                socket.disconnect();
            };
        }
        createChat();
    }, [hostId]);

    function onSend(newMessages = []) {  
        socket.emit("chat message to server", newMessages);
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
        onSendDB(newMessages);
    };

    async function Room(roomData){ // 받아온 채팅방들 중에서 있으면 그거로, 없으면 생성 ... 설명이 너무 구린가..? 죄송함다.. 
      let flag = 0;
      roomData.map((data)=>{
        if(data.postOwnerId == postOwnerId && data.hostId == hostId && data.postId == postId){
          chatRoomId = data._id;
          console.log("조회중 찾았다! : ", chatRoomId);
          socket.emit('joinRoom', chatRoomId);
          flag = 1;
          return false;
        }
      })
      if(flag == 0){
        let newChatRoom = {
          hostId : hostId,
          postOwnerId : postOwnerId,
          postId : postId,
        }
        let roomInfo;
        await axios.post("http://10.0.2.2:3000/chat/createChatRoom", newChatRoom)
          .then((data)=>{
            console.log(data);
            roomInfo = data.data;
            chatRoomId = roomInfo._id;
            socket.emit("joinRoom", chatRoomId);
           })
       
      }
    }

    function checkChat(preData){  //채팅 내용들 중에서 내가 보낸 것, 상대방이 보낸 것 구분
      if (preData.length != 0) {
        preData.map((data) => {
            if (data.senderId == hostId) {
                setMessages((prevMessages) => GiftedChat.append(prevMessages, [
                    {
                        _id: data._id,
                        text: data.text,
                        createdAt: data.createdAt,
                        user: {
                            _id: 1
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
                            _id: 2
                        }
                    }
                ]));
            }
        });
      }
    }

    function onSendDB(newMessage) {
        let beforeTime = new Date();
        let month = beforeTime.getMonth() + 1;
        let time = beforeTime.getFullYear() + '-' + month + '-' + beforeTime.getDate() +
                ' ' + beforeTime.getHours() + ':' + beforeTime.getMinutes() + ':' +
                beforeTime.getSeconds();
        let textId = newMessage[0]._id;
        let createdAt = time;
        let text = newMessage[0].text;
        let senderId = hostId;
        let roomId = chatRoomId;

      

        let newChat = {
            beforeTime: time,
            textId: textId,
            createdAt: createdAt,
            text: text,
            senderId: senderId,
            roomId: chatRoomId
        }
        console.log("chatRoomId : ", chatRoomId);
        
        console.log("roomId : ", roomId);
        axios
            .post("http://10.0.2.2:3000/chat/createChat", newChat)
            .then((data) => {})
    }

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                    _id: 1
                }}/>

            {/* <AnimatedAbsoluteButton
                buttonSize={100}
                buttonColor='gray'
                buttonShape='circular'
                buttonContent={<Text> 거래 제안</Text>}
                direction='top'
                position='bottom-right'
                positionVerticalMargin={10}
                positionHorizontalMargin={10}
                time={500}
                easing='bounce'
                buttons={buttons}/> */}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 400
    }
});

export default ChatScreen;