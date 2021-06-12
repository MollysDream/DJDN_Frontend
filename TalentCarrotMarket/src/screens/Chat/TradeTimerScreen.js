import React, {useEffect, useState} from 'react';
import CountDown from 'react-native-countdown-component';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet, Image, Button
} from 'react-native';

import axios from "axios";
// import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import smsKey from '../../smsKey';
import Base64 from 'crypto-js/enc-base64';
const CryptoJS =require ('crypto-js');

import requestUserAPI from "../../requestUserAPI";
import requestTradeAPI from "../../requestTradeAPI";
import RemotePushController from '../../util/RemotePushController'

import io from "socket.io-client";
import {HOST} from "../../function";


//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>


let userId ;
let sender;
let receiver;
let socket = io(`http://${HOST}:3002`);
let nowDateString;

const TradeTimerScreen = ({navigation, route}) =>{

  AsyncStorage.getItem('user_id').then((value) =>
    userId=value
  );

  const {tradeId,endSet,proLocate,user1,user2, chatRoom, chatRoomData}=route.params;
  const [endDateTime, setEndDateTime] = useState(endSet);
  const [endDateChange, setEndDateChange] = useState(false);
  const nowDate = Date.now();
  nowDateString = Date.now().toString();
  const [diffTime, setDiffTime] = useState((endDateTime.getTime()- nowDate)/1000);
  const [isEndSuggest, setIsEndSuggest] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  //실시간 통신 확인
  const [socketCome, setSocketCome] = useState(false);
  //사용자 정보 가져오기
  const [userData, setUserData] = useState();
  //거래 삭제 시 적용
  const [isDelete, setIsDelete] = useState(false);

  //연장시간 적용
  useEffect(()=>{
    console.log("새로운 종료시간은 "+endDateTime)
    setDiffTime((endDateTime.getTime()-nowDate)/1000);
    console.log("새로운 연장시간은 "+diffTime);
    setEndDateChange(false)
  },[endDateChange])

  //접속 사용자 확인 (거래 상대 정보 얻기 위함)
  useEffect(() => {
    async function getData(){

        let user= await AsyncStorage.getItem('user_id');

        console.log("현재 접속자는 "+ user)
        console.log('user1은? '+user1)
        console.log('user2는? '+user2)

      if (user1 == user){
        console.log("user1이에요! "+ user1)
        console.log("user2아니에요! "+ user2)
        let userData = await requestUserAPI.getUserData(user2);
        setUserData(userData);
      } else{
        console.log("user2에요! "+ user2)
        console.log("user1이 아니에요! "+ user1)
        let userData = await requestUserAPI.getUserData(user1);
        setUserData(userData);
      }
    }

    let result = getData();
  },[]);

  useEffect(()=>{
    async function settingTrade() {
      socket.emit('joinTradeRoom', tradeId);
      console.log("joinTradeRoom 실행됐다!! 방 번호 : " + tradeId);
    }

    settingTrade();

    socket.emit('joinTradeRoom', tradeId);

    socket.on('extend endTime to client', (endDateTime) => {
      let newEndTime = parse(endDateTime);
      console.log("프론트에서 받은 새 연장시간ㄴㄴㄴㄴㄴㄴ : " +  newEndTime);
      // setDiffTime((newEndTime.getTime()- nowDate)/1000);   
      setSocketCome(true);
    });

    socket.on('suggest tradeEnd to client', () => {
      setSocketCome(true);
    });

    socket.on('end trade to client', () => {
      console.log("거래 종료 옴")
      setSocketCome(true);
    });

    socket.on('delete trade to client', () => {
      setIsDelete(true);
      setSocketCome(true);
    });
  },[])
  


  useEffect(()=>{
    console.log("거래 번호 "+tradeId)

    requestTradeAPI.getEndTrade(tradeId)
      .then(returnData => {
        if(returnData.data.message){

          const returnEndDate = parse(returnData.data.trade.endTime);
          setEndDateTime(returnEndDate);

          setDiffTime((returnEndDate.getTime()-nowDate)/1000);

          setIsEndSuggest(returnData.data.trade.completeSuggest);
          setIsEnd(returnData.data.trade.complete);
          setSocketCome(false);

          console.log("현재 종료 제안 상태는 "+isEndSuggest);
          console.log("현재 종료 상태는 "+isEnd);

          console.log("거래제안자 "+returnData.data.trade.sender)
          console.log("거래제안받는사람 "+returnData.data.trade.receiver)

          if(returnData.data.trade.sender==userId){
            console.log("현재 접속자는 거래 제안자임 "+ returnData.data.trade.sender);
            sender=userId;
          } else{
            console.log("현재 접속자는 거래 제안받은사람임 "+ returnData.data.trade.receiver);
            receiver=userId;
          }
        } else{
          console.log("거래가 존재하지 않습니다.");
        }
        })
        //에러
        .catch(err => {
            console.log(err);
        });

  },[socketCome])

  useEffect(()=>{
    console.log("거래 삭제 진행"+isDelete)
    if(isDelete==true){
      navigation.navigate('chatch')
    }
    setIsDelete(false);
  },[isDelete])


  const extendButton = async() =>{

    endDateTime.setMinutes(endDateTime.getMinutes()+10)
    setEndDateChange(true)

    const newEndSet = newFormatDate(endDateTime)

    //거래연장 통신
    try{
       const returnData = await requestTradeAPI.updateTradeTime(tradeId,newEndSet);

       if (returnData.data.message) {
        var compareDiffTime=(endDateTime.getTime()-nowDate)/1000;
        console.log("차이는?? "+compareDiffTime);
        socket.emit("extend endTime",tradeId, endDateTime, userId );

        if(compareDiffTime>0){
          alert("거래 연장에 성공했습니다!");
        } else{
          alert("거래 연장에 실패하였습니다.")
        }
      } else {
        alert('거래 연장에 실패하였습니다.')
      }
    } catch(err){
        console.log(err);
  }
  }

  const endSuggestButton = async() =>{

    setIsEndSuggest(true);

    let user= await AsyncStorage.getItem('user_id');

    if(user1==user){
      sender = user1;
      receiver = user2;
    } else{
      sender = user2;
      receiver = user1;
    }

    console.log("sender는 "+sender);
    console.log("receiver는 "+receiver);

    //거래완료제안 통신
    try{
      const returnData = await requestTradeAPI.endSuggestTrade(tradeId,sender,receiver);

      if (returnData.data.message) {
        alert('거래 완료 제안을 했습니다!');
        socket.emit("suggest tradeEnd", tradeId, userId);
      }
      else{
        alert('거래 완료 제안이 실패했습니다.')
      }

    } catch(err){
       console.log(err);
    }

  }

  const endButton = async() =>{
    setIsEnd(true);
    //거래완료 통신
    try{
      const returnData = await requestTradeAPI.endTrade(tradeId);

      if (returnData.data.message) {
        console.log(returnData.data.message)
        socket.emit("end trade", tradeId, userId);
      }
        else{
          alert('거래 완료 제안이 실패했습니다.')
        }

    } catch(err){
       console.log(err);
    }

  }

  const userRateButton = () =>{
    navigation.navigate('userRate',{
      user1: user1,
      user2: user2,
      tradeId: tradeId,
      chatRoomData: chatRoomData
    })
  }

  const cancelButton = async() =>{

    //거래취소(삭제) 통신
    try{
      socket.emit("delete trade", chatRoom, userId);
      const returnData = await requestTradeAPI.deleteTrade(tradeId);

      if (returnData.data.message) {
        alert('거래가 취소되어 거래를 다시 제안합니다.')
        navigation.navigate('chatch')
      }
        else{
          alert('거래 취소 실패!')
        }

    } catch(err){
       console.log(err);
    }

  }

  const msgSendButton = () =>{
    navigation.navigate('chatch')
  }

  const checkUserProfile= () =>{
    console.log("사용자 프로필 확인!!");
    navigation.navigate('사용자 프로필',{userData:userData});
  }

  async function autoReport(){

    let secretKey = smsKey.secretKey;
    let accessKey = smsKey.accessKey;
    let serviceId = encodeURIComponent(smsKey.serviceId);
    let phoneNumber = smsKey.phoneNumber;

    let signatureValue = makeSignature();

    console.log("암호화된것은?"+signatureValue)

    console.log("신고된 주소 "+proLocate);
    console.log("확인 accesskey: "+accessKey);
    console.log("확인 secretkey: "+secretKey);
    console.log("확인 serviceId: "+serviceId);
    console.log("확인 phoneNumber: "+phoneNumber);
    console.log("확인 timestamp: "+nowDateString + " 타입 : " + typeof(nowDateString));

    const body = {
      "type": 'SMS',
      "contentType": 'COMM',
      "countryCode": '82',
      "from": phoneNumber, // 발신자 번호, 바꾸지 X
      "content": `${proLocate} 주소에서 신고가 들어왔습니다.`,
      "messages": [
        {
          "to": '01075301550', // 수신자 번호
          "content":`${proLocate} 주소에서 신고가 들어왔습니다.`
        },
      ],
    };

    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': nowDateString,
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-signature-v2': signatureValue,
      },
    };


    axios
      .post(`https://sens.apigw.ntruss.com/sms/v2/services/${serviceId}/messages`, body, options)
      .then(async (res) => {
        // 성공 이벤트
        alert('거래 종료를 누르지 않아 자동으로 신고가 됩니다.')
        console.log(res);
      })
      .catch((err) => {
        console.error(err.response.data);
      });

  }

  const tradeEndSuggest =
  <>
        <View style={styles.timeText}>
          <Text><B>남은 시간</B></Text>
        </View>

        <CountDown
            size={30}
            until={diffTime}
            onFinish={autoReport}
            digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
            digitTxtStyle={{color: '#1CC627'}}
            timeLabelStyle={{color: 'green', fontWeight: 'bold'}}
            separatorStyle={{color: '#1CC625'}}
            timeToShow={['D','H', 'M', 'S']}
            timeLabels={{d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds'}}
            showSeparator
          />
        <View style={styles.btnList}>
          <View style={styles.rowArea}>
            <View style={styles.btnArea,{paddingRight:wp('1')}}>
              <TouchableOpacity style={styles.btn} onPress={extendButton}>
                <Text style={{color: 'white'}}>10분 연장</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnArea,{paddingLeft:wp('1')}}>
              <TouchableOpacity style={styles.btn} onPress={endSuggestButton}>
                <Text style={{color: 'white'}}>거래종료</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.btnArea}>
            <TouchableOpacity style={styles.btnCancel} onPress={cancelButton}>
              <Text style={{color: 'white'}}>거래 취소하기</Text>
            </TouchableOpacity>
          </View>
        </View>
  </>

  const senderView =
  <>
    {isEnd==false?
          (
            <>
              <View style={styles.helpMsg}>
                <Text style={{fontSize:20,marginTop:5,}}>상대방이 거래 종료를 할 때까지 기다려주세요!</Text>
              </View>

              <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,

              }}/>
              <View style={styles.helpMsg}>
                <Text style={{fontSize:15, marginTop:5, color:'grey'}}>현재 상대방이 거래종료를 하지 않은 상태입니다.</Text>
                <Text style={{fontSize:15, marginTop:5, color:'grey'}}>메세지를 보내어 거래종료를 요청해보세요!</Text>
                <View style={styles.btnArea}>
                  <TouchableOpacity style={styles.btnRate} onPress={msgSendButton}>
                    <Text style={{color: 'white'}}>메세지 보내기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ):
          <>
            <View style={styles.dateArea}>
              <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnRate} onPress={userRateButton}>
                  <Text style={{color: 'white'}}>사용자 평가하기</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,

            }}
          />
          <View style={styles.helpMsg}>
            <Text style={{fontSize:15, marginTop:5, color:'grey'}}>사용자 평가하기 버튼을 눌러 사용자 매너 평가를 해주세요!</Text>
          </View>
         </>
      }
  </>

  const receiverView =
  <>
    {isEnd==false?
          (
            <>
              <View style={{paddingTop:hp(3)}}>
                <CountDown
                  size={30}
                  until={diffTime}
                  onFinish={autoReport}
                  digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
                  digitTxtStyle={{color: '#1CC627'}}
                  timeLabelStyle={{color: 'green', fontWeight: 'bold'}}
                  separatorStyle={{color: '#1CC625'}}
                  timeToShow={['D','H', 'M', 'S']}
                  timeLabels={{d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds'}}
                  showSeparator
                />
              </View>

              <View style={styles.rowArea}>
                <View style={styles.btnArea,{paddingRight:wp(1)}}>
                  <TouchableOpacity style={styles.btn} onPress={endButton}>
                    <Text style={{color: 'white'}}>거래 종료확인</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.btnArea,{paddingLeft:wp(1)}}>
                  <TouchableOpacity style={styles.btnCancel2} onPress={cancelButton}>
                    <Text style={{color: 'white'}}>거래 취소하기</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
              style={{
                paddingTop:hp(3),
                // paddingBottom:hp(5),
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,

              }}

            />
              <View style={styles.helpMsg}>
                <Text style={{fontSize:15, marginTop:5, color:'grey'}}>현재 상대방이 거래종료를 기다리는 상태입니다.</Text>
                <Text style={{fontSize:15, marginTop:5, color:'grey'}}>거래 종료확인을 누르고 사용자를 평가해보세요!</Text>
              </View>
            </>
            ):
          <>
            <View style={styles.dateArea}>
              <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnRate} onPress={userRateButton}>
                  <Text style={{color: 'white'}}>사용자 평가하기</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,

            }}
          />
          <View style={styles.helpMsg}>
            <Text style={{fontSize:15, marginTop:5, color:'grey'}}>사용자 평가하기 버튼을 눌러 사용자 매너 평가를 해주세요!</Text>
          </View>
        </>
      }
  </>

  const tradeEnd =
  <>
    {userId==sender && userId!=receiver?(
      <>{senderView}</>):
      <>{receiverView}</>
    }
  </>


  return (
    <View style ={styles.container}>
      {userData ?
          <View style={styles.rowTopArea}>
            <View style={styles.titleArea}>
              <Text style={{fontSize:15, marginTop:5, color:'grey'}}>거래자 정보</Text>
              <TouchableOpacity style={{ flexDirection:'row'}} onPress={checkUserProfile}>
                <Image
                source={{uri:userData.profileImage}}
                style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={{fontSize:12, marginTop:5, color:'grey'}}>닉네임</Text>
              <Text style={{paddingLeft:wp(1),paddingRight:wp(25),fontSize:wp('5.5')}}>{userData.nickname}</Text>
            </View>
            <View>
              <Text style={{fontSize:12, marginTop:5, color:'grey'}}>평가점수</Text>
              <Text style={{paddingLeft:wp(2),fontSize:wp('5.5')}}>{userData.averageRating}</Text>
            </View>
          </View>
          :
          <Text>Loading....</Text>
        }
        <View
          style={{
            paddingBottom:hp(3),
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,

          }}
          />

      {isEndSuggest==false?
      (<>{tradeEndSuggest}</>):
          <>{tradeEnd}</>}

      {/* <TouchableOpacity>
        <Button title={'SMS 보내기!'} onPress={autoReport}/>
      </TouchableOpacity> */}
      <RemotePushController time={diffTime}/>
    </View>
    )
}

function makeSignature(){

  let serviceId = encodeURIComponent(smsKey.serviceId);
  var space = " ";				// one space
  var newLine = "\n";				// new line
  var method = "POST";				// method
  var url = `/sms/v2/services/${serviceId}/messages`;	// url (include query string)
  var timestamp = nowDateString;			// current timestamp (epoch)
  var accessKey = smsKey.accessKey;			// access key id (from portal or Sub Account)
  var secretKey = smsKey.secretKey;			// secret key (from portal or Sub Account)

  console.log("확인 timestamp: "+timestamp + " 타입 : " + typeof(timestamp));

  var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  var hash = hmac.finalize();
  var result = Base64.stringify(hash);

  console.log(result + " 타입 : " + typeof(result))

  return result;
};

//타이머 설정용 시간
const newFormatDate = (date)=>{
  const setDate= `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  return setDate;
  };


//str-->date
function parse(str){
  var newDd=str.split(/-| |:/);
  var y = newDd[0];
  var m = newDd[1];
  var d= newDd[2];
  var h = newDd[3];
  var minute = newDd[4];
  return new Date(y,m-1,d,h,minute);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  rowTopArea: {
    flex: 0.3,
    paddingTop: hp(7),
    paddingLeft: wp(10),
    flexDirection: "row",
    alignItems: 'center',
  },
  titleArea: {
    justifyContent: 'center',
    paddingRight:wp(15),
  },
  profileImage:{
    borderWidth:2,
    borderColor:'#65b7ff',
    borderRadius:50,
    height:60,
    width:60,
    overflow:"hidden",
    aspectRatio: 1,
    marginRight:12,
    marginLeft:12,
  },
  timeText:{
    paddingBottom:hp(3),
    paddingTop:hp(3),
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnList: {
    paddingTop:hp(1)
  },
  btnArea: {
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: 150,
    height: 50,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5FC3D9'
  },
  btnCancel: {
    width: 200,
    height: 50,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9665F'
  },
  btnCancel2: {
    width: 150,
    height: 50,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9665F'
  },
  btnRate: {
    width: 200,
    height: 50,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5FC3D9'
  },
  // btnEnd: {
  //   width: 200,
  //   height: 50,
  //   borderRadius: 7,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#4672B8'
  // },
  dateArea:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:hp(3),
    paddingBottom:hp(1)
  },
  rowArea:{
    flexDirection: "row",
    justifyContent: 'center',
    paddingTop: hp(3),
    paddingBottom: hp(1)
  },
  btnDate: {
    width: 500,
    height: 150,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDDDEF',
    borderWidth: 0.5,
    borderColor: 'gray',
  },
  helpMsg:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(5),
    paddingBottom: hp(5)
  }
});

export default TradeTimerScreen;
