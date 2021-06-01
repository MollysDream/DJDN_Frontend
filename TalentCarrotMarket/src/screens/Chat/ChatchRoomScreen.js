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


let socket;
let hostId;
function ChatChRoomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [chatroomId, setRoomId] = useState(props.route.params.roomInfo._id);
    const [currentUserId, setCurrentUserId] = useState("");

    const postOwnerId = props.route.params.postOwner._id;
    const host = props.route.params.host._id;

    useEffect(()=>{
        async function loadingUserId(){
            await AsyncStorage
              .getItem('user_id')
              .then((value) => {
                  setCurrentUserId(value);
              })

        };

        loadingUserId()
    },[]);

    useEffect(() => {
        async function settingChat() {

            AsyncStorage
                .getItem('user_id')
                .then((value) => {
                    hostId = value;
                });

            socket = io(`http://${HOST}:3002`);
            console.log("io 정보", socket);

            socket.emit('joinRoom', chatroomId);
            const preData = await request.getChat(chatroomId);
            checkChat(preData);
        }
        settingChat();

        socket.on('chat message to client', (newMessage) => {
            let newMessaged = newMessage;
            console.log("프론트에서 받은 새 메시지 : " + newMessaged);
            setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessaged));
        });

    }, []);

    function onSend(newMessage = []) {
        socket.emit("chat message to server", newMessage, chatroomId);
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessage));
        onSendDB(newMessage);
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
        axios
            .post(`http://${HOST}:3000/chat/createChat`, newChat)
            .then((data) => {})
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
            </View>
            <GiftedChat
                messages={messages}
                onSend={(newMessages) => onSend(newMessages)}
                user={{
                    _id: currentUserId
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
