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


  /*
  *
  * 우리가 참여하고있는 채팅방의 Id값 저장용
  *
  * */
  let chatRoomId;

    useEffect( async() => {
      const temp = sellerId;
      seller = await requestUser.getUserData(temp);
      sellerNick = seller.nickname;
      socket = io("http://10.0.2.2:3002");
      socket.emit("usersId",buyerId,buyerNick, sellerId, sellerNick);
      //딱 여기까지하면, 지금 buyerId,sellerId 가져온 상태니까 ?


      /*
      * buyerId, SellerId가 있는 채팅룸을 DB에서 검색  (근데 여기서 postId가 필요할거같음, 왜냐? 같은 사용자 2명이 다른 게시물에 대해 채팅할수도 있자나!)
      * -> 있으면 getChat()하고,
      * 없으면 채팅방 만들어서 실행 -> 이건 axios.post("http://10.0.2.2:3000/chat/createChatRoom",user1, user2, postId) .-> 요런식?
      *         .then((data)=>{
      *            여기는 뭐 너가 data로 하고싶은거 하면 되고
      *            data._id 해서 roomId값 가져와서 joinRoom args로 주면 될듯? (지금 'room1' 이라고 되어있는거)
      *          })
      *       }
      */

      socket.emit('joinRoom','room1');


      /*
      * getChat 의 인자! => {roomId: chatRoomId}
      *
      * */

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

      // roomId도 chatRoomId로 바꿔서 저장해야돼. 왜? 이래야 몽고DB에 잘 저장돼

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
