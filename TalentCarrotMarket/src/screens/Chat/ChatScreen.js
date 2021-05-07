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


function ChatScreen(props) {
    
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    var [userId, setUserid] = useState(""); 
    var socket = io("http://10.0.2.2:3001");

    
 
  


    //gift chat 관련
    useEffect(() => {
      AsyncStorage.getItem('user_id')
    .then((value) => {
      setUserid(value);
      console.log('name is ', value);
      console.log(userId);
    });
      setMessages([
        {
          _id: userId,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ])
    }, [])

    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      socket.emit("chat message", msg=>{
        console.log("bye"+socket.connect(A).connected);
      })
    }, [])

    

    // const chatMessages=messages.map(chatMessage=>
    //   <Text style={{borderWidth:2, top:500}}>{chatMessage}</Text>
    // )

    const submitChatMessage = () =>{
      console.log("hi"+socket.connect().connected);
      socket.emit('chat message', message);
      setMessage('')
    }

  
    return ( 
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
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