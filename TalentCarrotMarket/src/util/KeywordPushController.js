import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import PushNotification from 'react-native-push-notification'

function KeywordPushController (props) {
  useEffect(() => {

    /*
		* 키워드 푸시알림을 해봅시다.
		* 먼저, 사용자의 키워드 정보, 동네 정보(동네와 반경)를 가져와요
		* 다음으로, 각 게시물 정보를 가져옵니다. 
		* 
		* 지금 보내는 메시지(msg)가 누구냐에 따라 각 상대방에게 알림이 가도록 합시다.
		* 푸시 알림 메시지의 포맷을 정해줍니다 -> title,tag 등..
		* sendFCM 메시지를 통해 메시지 보냅시다!
		 */

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
        console.log('TOKEN:', token)
      },
// (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('REMOTE NOTIFICATION ==>', notification)
// process the notification here
      },
      // Android only: GCM or FCM Sender ID
      // senderID: '537122353222',
      // popInitialNotification: true,
      // requestPermissions: true
    })

    // notification channel
    PushNotification.createChannel({
        channelId: "keyword-channel", // (required)
        channelName: "My channel", // (required)
    },
    (created) => console.log(`CreateChannel returned '${created}'`)
    );
    
    // PushNotification.channelExists(channel_id, function (exists) {
    //   console.log("channel은 존재합니다 "+exists); // true/false
    //   if(exists){}
    // });
  }, [])

  useEffect(()=>{
    console.log("키워드에 맞는 게시물이 확인되었습니다. "+props.keyword)

    //원래 스케줄있던거 삭제
    PushNotification.cancelLocalNotifications({id:'123'});

    PushNotification.localNotificationSchedule({
      channelId: "keyword-channel",
      autoCancel: true,
      bigText:
        props.keyword,
      subText: '키워드에 맞는 게시물이 확인되었습니다.',
      title: 'TalentMarket',
      message: '키워드에 맞는 게시물이 확인되었습니다.',
      vibrate: false,
      vibration: 300,
      playSound: false,
      soundName: 'default',
      actions: '["OK"]',
      date: new Date(Date.now()+(props.time-300)*1000),
      id:'123'
    })
  }, [props.keyword])
  return null
  // return <View><Text style={{color:'white'}}>안녕하세요 {props.keyword}</Text></View>
}
export default KeywordPushController