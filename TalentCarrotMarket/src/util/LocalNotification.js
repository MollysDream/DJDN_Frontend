import PushNotification from 'react-native-push-notification'


export const LocalNotification = () => {

PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
      console.log('LOCAL NOTIFICATION ==>', notification.actions)
    },
    popInitialNotification: true,
    requestPermissions: true})

// // notification channel
//  PushNotification.createChannel({
//     channelId: "my-channel", // (required)
//     channelName: "My channel", // (required)
//  },
//  (created) => console.log(`CreateChannel returned '${created}'`)
//  );



  PushNotification.localNotificationSchedule({
    channelId: "my-channel",
    autoCancel: true,
    bigText:
      '거래 예정시간이 되었습니다.',
    subText: '거래가 시작됩니다.',
    title: 'TalentMarket',
    message: '거래가 시작되었습니다.',
    vibrate: false,
    vibration: 300,
    playSound: false,
    soundName: 'default',
    actions: '["OK"]',
    date: new Date(Date.now() + 10 * 1000),
  })
}
