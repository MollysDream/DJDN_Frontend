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
import {AnimatedAbsoluteButton} from 'react-native-animated-absolute-buttons'

import io from "socket.io-client";



const ChatScreen = ({navigation}) =>{
    
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    var socket = io("http://10.0.2.2:3001")


    //gift chat 관련
    useEffect(() => {
      setMessages([
        {
          _id: 1,
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
    }, [])

    // //소켓 연동
    // useEffect(()=> {
    //   socket.on("chat message", msg=>{
    //     console.log("bye"+socket.connect().connected);
    //     setMessages(msg)
    //     console.log(messages)
    //   })
    // })

    // // const chatMessages=messages.map(chatMessage=>
    // //   <Text style={{borderWidth:2, top:500}}>{chatMessage}</Text>
    // // )

    // const submitChatMessage = () =>{
    //   console.log("hi"+socket.connect().connected);
    //   socket.emit('chat message', message);
    //   setMessage('')
    // }

    const buttons = [
      {
          color: '#4672B8',
          content: 
          <View>
            <Text>  ⌚ 🗺️</Text> 
            <Text>시간 설정</Text> 
          </View>,
          action: () => {
              navigation.navigate('tradeSet')
          }
      }
      
  ];

  
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
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
      // <View style={styles.container}>
      //   {/* {chatMessages} */}
      //   <TextInput
      //     style={{height: 40, borderWidth: 2, top: 600}}
      //     autoCorrect={false}
      //     value={message}
      //     onSubmitEditing={submitChatMessage}
      //     onChangeText={message => {
      //       setMessage(message);
      //     }}
      //   />
      // </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    height:400,
    backgroundColor: 'white'
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