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

let socket;
let messages

function ChatScreen(props) {
    // const [message, setMessage] = useState("");
    let [messages, setMessages] = useState([]);
    let [userId, setUserid] = useState("");

    let socketId;
    //gift chat 관련
    useEffect(() => {
      AsyncStorage.getItem('user_id')
    .then((value) => {
      setUserid(value);
      // console.log('name is ', value);
      // console.log(userId);
    });

      // 소켓 연결
      socket = io("http://10.0.2.2:3002");

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
          text: userId+'님께서 채팅을 주셨어요.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ])
      // console.log("messages 출력 "+ messages[0]);




      console.log("Hello developer _id 출력 : " );

      // 서버에 있는 채팅 불러오기...? 라고 이해하면 될듯?
        socket.on('chat message to client', (msg) => {
        let newMessage= msg;
        newMessage[0].user._id = 1;
        setMessages( (previous) => GiftedChat.append(previous, newMessage));
        console.log("UseEffect 안에 socket.on임// 현재 사용중인 소켓 아이디 : ",socket.id);
        console.log("옛날 message 받아와서 출력할 때 새로 append 되는 msg : " + msg);

        console.log("message 길이 : " + messages.length);
        console.log("client에서 chat message 받는거 :" + msg[0].text);



        // onSendDB(newMessage);
      });



        // 채팅방 떠나기
      return () => {
        socket.emit('leaveRoom','room1');
        // socket.emit('disconnect', []);
        socket.disconnect();
      };

    },[]);




    let count=0;

    // 내가 send버튼 눌렀을때 발생하는 이벤트..?
    function onSend(newMessages = []){

      if(0){

      }

      else{
      socket.emit("chat message to server", newMessages);
      console.log('onSend가 호출됨!! count : ' + count++);
      setMessages((prevMessages)=>GiftedChat.append(prevMessages, newMessages));

      console.log("onSend에서 쓰는 중 // 현재 사용중인 소켓 아이디 : ",socket.id);



      console.log("client에서 지금 메세지 보내는 중: " + newMessages[0]._id);
      console.log(messages.length);

      //이게 실제 보여지는 텍스트임
      console.log(newMessages[0].text);
      }
    };



    // user 정보 좀 손봐야할듯
    return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: userId,
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
