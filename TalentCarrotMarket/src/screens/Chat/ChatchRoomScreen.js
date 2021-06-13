import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import {List, Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
// import {AnimatedAbsoluteButton} from 'react-native-animated-absolute-buttons';
import { IconButton } from 'react-native-paper';
import {GiftedChat} from 'react-native-gifted-chat'
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';
import requestUser from "../../requestUserAPI";
import request from '../../requestAPI';
import axios from 'axios';
import {HOST} from "../../function";
import requestChatAPI from "../../requestChatAPI";


let socket = io(`http://${HOST}:3002`);
let hostId;
let flag = 1;
let currentUserId ;
function ChatChRoomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [chatroomId, setRoomId] = useState(props.route.params.roomInfo._id);
    // const [currentUserId, setCurrentUserId] = useState("");
    const [currentUserImage, setCurrentUserImage] = useState('');


    const postOwnerId = props.route.params.postOwner._id;
    const host = props.route.params.host._id;
    hostId = host;

    async function loadingUserId(){
        await AsyncStorage
          .getItem('user_id')
          .then((value) => {
              // setCurrentUserId(value);
              currentUserId = value;
          })
        let currentUser = await requestUser.getUserData(currentUserId);
        setCurrentUserImage(currentUser.profileImage);
    };

    loadingUserId()

    // console.log(currentUserImage);

    // useEffect(()=>{
    //     async function loadingUserId(){
    //         await AsyncStorage
    //           .getItem('user_id')
    //           .then((value) => {
    //               // setCurrentUserId(value);
    //               currentUserId = value;
    //           })
    //         let currentUser = await requestUser.getUserData(currentUserId);
    //         setCurrentUserImage(currentUser.profileImage);
    //     };
    //
    //     loadingUserId()
    //
    //
    // },[]);

    useEffect(() => {
        async function settingChat() {

            // AsyncStorage
            //     .getItem('user_id')
            //     .then((value) => {
            //         hostId = value;
            //     });
            // socket = io(`http://${HOST}:3002`);

            socket.emit('joinRoom', chatroomId);
            console.log("joinRoom 실행됐다!! 방 번호 : " + chatroomId);

            const preData = await request.getChat(chatroomId);
            checkChat(preData);
        }
        settingChat();

        socket.on('chat message to client', (newMessage) => {
            let newMessaged = newMessage;
            console.log("프론트에서 받은 새 메시지 : " + newMessaged[0].text);
            setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessaged));
        });

        return() => {
            socket.emit('leaveRoom', chatroomId);
            console.log("leaveRoom 실행됐다!! 방 번호 : " + chatroomId);
        };

    }, []);

    function onSend(newMessage = []) {
        socket.emit("chat message to server", newMessage, chatroomId);
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
        console.log("서버로 넘기는 메세지 : "+ newMessage[0].text);
        console.log("서버로 넘기는 작성자 id : "+ newMessage[0].user._id);
        onSendDB(newMessage);
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
        let roomId = chatroomId;

        let newChat = {
            beforeTime: time,
            textId: textId,
            createdAt: createdAt,
            text: text,
            senderId: senderId,
            roomId: chatroomId
        }

        console.log("roomId : ", roomId);
        console.log("senderId : ",senderId);
        let chatData = await requestChatAPI.createChat(newChat);
    }

    //채팅 내용들 중에서 내가 보낸 것, 상대방이 보낸 것 구분
    async function checkChat(preData) {
        console.log("여기서 hostID : " , hostId);

        let postOnwer = await requestUser.getUserData(postOwnerId);
        let postOnwerImage = postOnwer.profileImage;

        console.log(postOnwer.nickname);

        let host = await requestUser.getUserData(hostId);
        let hostImage = host.profileImage;
        console.log("호스트Id : " +hostId);
        console.log("호스트닉네임 : " +host.nickname);

        if (preData.length != 0) {
            preData.map((data) => {
                if (data.senderId == hostId) {
                    setMessages((prevMessages) => GiftedChat.append(prevMessages, [
                        {
                            _id: data._id,
                            text: data.text,
                            createdAt: data.createdAt,
                            user: {
                                _id: hostId,
                                avatar: hostImage
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

    return (
        <View style={styles.container}>
            {/* <View> */}
                {/* <View>
                    <Text>시계 아이콘을 눌러 거래를 제안해보세요!</Text>
                </View> */}
                <View style={styles.clockButtonContainer}>
                    <IconButton
                    icon="clock"
                    size={36}
                    color="#6646ee"
                    onPress={()=>props.navigation
                        .navigate('tradeset',{
                            user1:postOwnerId,
                            user2:host,
                            chatRoom:chatroomId
                        })}
                    />
                {/* </View> */}
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
    clockButtonContainer: {
        position: 'absolute',
        top: 1,
        right: 0,
        zIndex: 1
      },
});

export default ChatChRoomScreen;
