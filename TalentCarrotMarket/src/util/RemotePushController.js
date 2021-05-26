import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import PushNotification from 'react-native-push-notification'
function RemotePushController (props) {
  useEffect(() => {

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
        channelId: "my-channel", // (required)
        channelName: "My channel", // (required)
    },
    (created) => console.log(`CreateChannel returned '${created}'`)
    );

    PushNotification.localNotificationSchedule({
      channelId: "my-channel",
      autoCancel: true,
      bigText:
        '거래 종료 예정시간 5분전입니다.',
      subText: '거래가 끝났다면 거래종료를 눌러주세요!',
      title: 'TalentMarket',
      message: '거래가 끝났다면 거래종료를 눌러주세요!',
      vibrate: false,
      vibration: 300,
      playSound: false,
      soundName: 'default',
      actions: '["OK"]',
      date: new Date(Date.now()+(props.time-300)*1000),
    })
  }, [props.time])
  return null
//   return <View><Text>안녕하세요 {props.time}</Text></View>
}
export default RemotePushController