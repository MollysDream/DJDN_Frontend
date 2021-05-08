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




// const mongoose = require('mongoose');
// let db = mongoose.connect('mongodb://localhost:27017/CHAT',{
//   useFindAndModify: false,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


let socket;
let messages

function ChatScreen(props) {
    // const [message, setMessage] = useState("");
   // const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [buyerId, setbuyerid] = useState("");
    const [sellerId, setpostid] = useState(props.route.params.postOwner._id);
    const [roomId, setRoomid] = useState("");

    AsyncStorage.getItem('user_id')
    .then((value) => {
      setbuyerid(value);
      // console.log('name is ', value);
      // console.log(userId);
    });

    let socketId;
    //gift chat 관련
    useEffect(() => {


      // 소켓 연결
      socket = io("http://10.0.2.2:3002");

      socket.emit("usersId",buyerId,sellerId);

      // 여기서 room1이 하드코딩
      socket.emit('joinRoom','room1');
      console.log('room1에 접속');

      // 내 현재 소켓 아이디
      console.log(socket.id);

      socketId = socket.id;

      // if(messages !== null){
      //   let helpArray = [];
      //   let text = {
      //     _id: 1,
      //     text: 'Hello developer',
      //     createdAt: new Date(),
      //     user: {
      //       _id: 2,
      //       name: 'React Native',
      //       avatar: 'https://placeimg.com/140/140/any',
      //     }
      //   };
      //   helpArray.push(text);
      //
      //   setMessages(GiftedChat.append(helpArray));
      // }

      // 처음 시작 메세지, messages가 비어있으니까 setState로 설정해
      setMessages([
        {
          _id: 1,
          text: buyerId+'님께서 채팅을 주셨어요.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ])
      // console.log("messages 출력 "+ messages[0]);

      if(messages.length !== 1){

      }



      // 서버에 있는 채팅 불러오기...? 라고 이해하면 될듯?
        socket.on('chat message to client', (msg) => {
        let newMessage= msg;
        newMessage[0].user._id = 1;
        setMessages( (previous) => GiftedChat.append(previous, newMessage));
        console.log("UseEffect 안에 socket.on임// 현재 사용중인 소켓 아이디 : ",socket.id);
        console.log("옛날 message 받아와서 출력할 때 새로 append 되는 msg : " + msg);

        console.log("message 길이 : " + messages.length);
        console.log("client에서 chat message 받는거 :" + msg[0].text);


        onSendDB(newMessage);


      });



        // 채팅방 떠나기
      return () => {
        socket.emit('leaveRoom','room1');
        // socket.emit('disconnect', []);
        socket.disconnect();
      };

    },[buyerId]);





    // 내가 send버튼 눌렀을때 발생하는 이벤트..?
    function onSend(newMessages = []){
      socket.emit("chat message to server", newMessages);
      setMessages((prevMessages)=>GiftedChat.append(prevMessages, newMessages));

      console.log("onSend에서 쓰는 중 // 현재 사용중인 소켓 아이디 : ",socket.id);



      console.log("client에서 지금 메세지 보내는 중: " + newMessages[0]._id);
      console.log(messages.length);

      //이게 실제 보여지는 텍스트임
      console.log(newMessages[0].text);
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
      let senderId = newMessage[0].user._id;
      let roomId = 'room1';
      // let image = newMessage[0].image;
      // let messageType = newMessage[0].messageType;

      let newChat = {
        beforeTime: time,
        textId : textId,
        createdAt : createdAt,
        text : text,
        senderId : senderId,
        roomId : roomId,
        // image : image,
        // messageType : messageType
      }

      axios.post("http://10.0.2.2:3000/chat/createChat", newChat)
        .then((data)=>{
          console.log(data);
        })

      // db.Chat.save(err, (newChat)=>{
      //   if(err){
      //     console.log(err);
      //   }
      //   else{
      //     console.log('newChat 저장 완료');
      //   }
      // })
  }


    // user 정보 좀 손봐야할듯
    return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: buyerId,
      }}
    />
  )

}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    height:400,
    backgroundColor: '#6E5BAA'
    },
    // btnArea2: {
    //     height: hp(8),
    //     paddingBottom: hp(1.5),
    // },
    // btn2: {
    //     flex: 1,
    //     width: 150,
    //     height: 50,
    //     borderRadius: 7,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#4672B8',
    //   },
});
export default ChatScreen;
