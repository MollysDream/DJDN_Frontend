import React, {useState, useCallback, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import {GiftedChat} from 'react-native-gifted-chat'
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';
import requestUser from "../../requestUserAPI";
import request from '../../requestAPI';

let socket;
let messages
let seller;
function ChatScreen(props) {
  
    const [messages, setMessages] = useState([]);
    const [buyerId, setbuyerid] = useState(props.route.params.postOwner._id);
    const [sellerId, setsellerid] = useState();
    const [roomId, setRoomid] = useState("");
    const [buyerNick, setbuyerNick] = useState(props.route.params.postOwner.nickname);

    const buttons = [
      {
          color: '#4672B8',
          content: 
          <View>
            <Text>  ⌚ 🗺️</Text> 
            <Text>시간 장소</Text> 
          </View>,
          action: () => {
              navigation.navigate('tradeSet')
          }
      }

  ];
    
    useEffect( async() => {
    AsyncStorage.getItem('user_id')
    .then((value) => {
      setsellerid(value);
    });
    console.log(":1111");
  },[]);

  let sellerNick;
  let socketId;
  
    useEffect( async() => {
      const temp = sellerId;
      seller = await requestUser.getUserData(temp);
      sellerNick = seller.nickname;
      socket = io("http://10.0.2.2:3002");
      socket.emit("usersId",buyerId,buyerNick, sellerId, sellerNick);
      socket.emit('joinRoom','room1');
      socketId = socket.id;

      const preData = await request.getChat();

      if(preData.length != 0){
        preData.map((data)=>{
        if(data.senderId == sellerId){
          setMessages((prevMessages)=>GiftedChat.append(prevMessages,[
            {
              _id : data._id,
              text: data.text,
              createdAt: data.createdAt,
              user: {
                _id: 1,
                
              },
            },
          ]));
        }
        else{
          setMessages((prevMessages)=>GiftedChat.append(prevMessages, 
           [
            {
              _id : data._id,
              text: data.text,
              createdAt: data.createdAt,
              user: {
                _id: 2,
                
              },
             },
           ]));
       }
      });
      }
    return () => {
        socket.emit('leaveRoom','room1');
        socket.disconnect();
      };

    },[sellerId]);

 
    function onSend(newMessages = []){
      socket.emit("chat message to server", newMessages);
      setMessages((prevMessages)=>GiftedChat.append(prevMessages, newMessages));
      onSendDB(newMessages);
    };


    function onSendDB(newMessage) {
      let beforeTime = new Date();
      let month = beforeTime.getMonth() + 1;
      let time =
        beforeTime.getFullYear() +
        '-' +
        month +
        '-' +
        beforeTime.getDate() +
        ' ' +
        beforeTime.getHours() +
        ':' +
        beforeTime.getMinutes() +
        ':' +
        beforeTime.getSeconds();
      let textId = newMessage[0]._id;
      let createdAt = time;
      let text = newMessage[0].text;
      let senderId = sellerId;
      let roomId = 'room1';
  
      let newChat = {
        beforeTime: time,
        textId : textId,
        createdAt : createdAt,
        text : text,
        senderId : sellerId,
        roomId : roomId,
      }

      axios.post("http://10.0.2.2:3000/chat/createChat", newChat)
        .then((data)=>{
         })
      }


    return (
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={(newMessages) => onSend(newMessages)}
        
          user={{
            _id: 1,
          }}
        />

        <AnimatedAbsoluteButton
            buttonSize={100}
            buttonColor='gray'
            buttonShape='circular'
            buttonContent={<Text>거래 제안</Text>}
            direction='top'
            position='bottom-right'
            positionVerticalMargin={10}
            positionHorizontalMargin={10}
            time={500}
            easing='bounce'
            buttons={buttons}
        />
      </View>
  )

}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    height:400,
    backgroundColor: '#6E5BAA'
    },
 
});
export default ChatScreen;