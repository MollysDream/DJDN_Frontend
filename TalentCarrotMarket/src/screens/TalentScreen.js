import React from 'react'
import { Text, View, Button, StyleSheet } from 'react-native'
import { LocalNotification } from '../util/LocalNotification'
import RemotePushController from '../util/RemotePushController'


const TalentScreen = () => {

//  const handleButtonPress = () => {
//     LocalNotification()
// }

return (
    <View style={styles.container}>
      {/* <Text>Press a button to trigger the notification</Text>
      <View style={{ marginTop: 20 }}>
        <Button title={'거래 시간 푸쉬 알람'} onPress={handleButtonPress} />
      </View> */}
      <RemotePushController time={310}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 20
  }
})
export default TalentScreen

// import React, {Component} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TouchableHighlight, Button
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import axios from 'axios';
// import smsKey from '../smsKey';
// import Base64 from 'crypto-js/enc-base64';
// const CryptoJS =require ('crypto-js');

// export default class TalentScreen extends Component{

//   /*
// 	https://code.google.com/archive/p/crypto-js/
// 	https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/crypto-js/CryptoJS%20v3.1.2.zip
// 	*/

//   /*
// 	CryptoJS v3.1.2
// 	code.google.com/p/crypto-js
// 	(c) 2009-2013 by Jeff Mott. All rights reserved.
// 	code.google.com/p/crypto-js/wiki/License
// 	*/

//   /*
//   <script type="text/javascript" src="./CryptoJS/rollups/hmac-sha256.js"></script>
//   <script type="text/javascript" src="./CryptoJS/components/enc-base64.js"></script>
//   */
//   async sendSMS(){
//     // console.log("확인!!");
//     // console.log("확인"+SENS.phoneNumber);
//     console.log("확인 accesskey: "+smsKey.accessKey);
//     console.log("확인 secretkey: "+smsKey.secretKey);
//     console.log("확인 serviceId: "+smsKey.serviceId);
//     console.log("확인 phoneNumber: "+smsKey.phoneNumber);
//     console.log("확인 timestamp: "+Date.now() + " 타입 : " + typeof Date.now().toString());



//     const body = {
//       type: 'SMS',
//       contentType: 'COMM',
//       countryCode: '82',
//       from: smsKey.phoneNumber, // 발신자 번호
//       content: `안녕하세요!!! 됐습니다!!!`,
//       messages: [
//         {
//           to: '01038007363', // 수신자 번호
//         },
//       ],
//     };
//     const options = {
//       headers: {
//         'Content-Type': 'application/json; charset=utf-8',
//         'x-ncp-apigw-timestamp': Date.now().toString(),
//         'x-ncp-iam-access-key': smsKey.accessKey,
//         'x-ncp-apigw-signature-v2': makeSignature(),
//       },
//     };
//     axios
//       .post(`https://sens.apigw.ntruss.com/sms/v2/services/${smsKey.serviceId}/messages`, body, options)
//       .then(async (res) => {
//         // 성공 이벤트
//         console.log("sms 발신 성공");
//         console.log(res);
//       })
//       .catch((err) => {
//         console.error(err.response.data);
//       });
//     return 1;
//   }
//     render(){
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//               <Text>Talent!</Text>
//               <TouchableOpacity>
//                 <Button title={'SMS 보내기!'} onPress={this.sendSMS}/>
//               </TouchableOpacity>
//             </View>
//         );
//     }
// };

// function makeSignature(){
//   var space = " ";				// one space
//   var newLine = "\n";				// new line
//   var method = "POST";				// method
//   var url = `/sms/v2/services/${smsKey.serviceId}/messages`;	// url (include query string)
//   var timestamp = Date.now().toString();			// current timestamp (epoch)
//   var accessKey = smsKey.accessKey;			// access key id (from portal or Sub Account)
//   var secretKey = smsKey.secretKey;			// secret key (from portal or Sub Account)

//   var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
//   hmac.update(method);
//   hmac.update(space);
//   hmac.update(url);
//   hmac.update(newLine);
//   hmac.update(timestamp);
//   hmac.update(newLine);
//   hmac.update(accessKey);

//   var hash = hmac.finalize();
//   var result = Base64.stringify(hash);

//   console.log(result + " 타입 : " + typeof(result))

//   return result;
// };
// const styles = StyleSheet.create({
//   iconBox:{
//     height:67,
//     alignItems: 'center',
//     marginTop:3
//   },
//   icon:{
//     width: wp(9),
//     overflow:"hidden",
//     height: hp(9),
//     aspectRatio: 1,
//     borderRadius: 9,
//   },
//   image:{
//     width: wp(28),
//     overflow:"hidden",
//     height: hp(28),
//     aspectRatio: 1,
//     borderRadius: 9,
//     marginRight:12
//   },
//   post:{
//     flexDirection: "row",
//     borderRadius: 15,
//     backgroundColor: "white",
//     borderBottomColor: "#a6e5ff",
//     borderBottomWidth: 1,
//     padding: 10,
//     height: 136
//   },
//   cover:{
//     flex: 1,
//     width: 200,
//     height:200,
//     resizeMode: "contain"
//   },
//   postDetail:{
//     flex:3,
//     alignItems :"flex-start",
//     flexDirection : "column",
//     alignSelf : "center",
//     padding:20
//   },
//   postTitle:{fontSize:18, fontWeight: "bold", width:250, height:80, paddingTop:9},
//   postAddressTime: {fontSize:13, textAlign:'right', width:'30%', marginRight:10},
//   postPrice: {width:'50%',fontSize:17 , color:"#0088ff" ,paddingTop: 9}
//   ,
//   status_ing:{
//     backgroundColor:'#b4e6ff',
//     position: 'absolute',
//     top: 40,
//     padding: 3,
//     borderRadius: 7
//   },
//   status_complete:{
//     backgroundColor:'#98afbf',
//     position: 'absolute',
//     top: 40,
//     padding: 3,
//     borderRadius: 7
//   },
//   status_none:{
//     position: 'absolute'
//   }
// });