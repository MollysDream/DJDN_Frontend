import React, {useEffect, useState} from 'react';
import CountDown from 'react-native-countdown-component';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet, Button,
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

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

// var diffTime;
let userId ;
let sender;
let receiver;

const TradeTimerScreen = ({navigation, route}) =>{

  const {tradeId,endSet,proLocate,user1,user2}=route.params;
  AsyncStorage.getItem('user_id').then((value) =>
        userId=value
      );


  const [endDateTime, setEndDateTime] = useState(endSet);
  const [endDateChange, setEndDateChange] = useState(false);
  const nowDate = Date.now();
  // diffTime= 100;
  // const diffTime = (endDateTime.getTime() - nowDate.getTime())/1000;
  const [diffTime, setDiffTime] = useState((endDateTime.getTime()- nowDate)/1000);

  // const [newEndDate, setNewEndDate] = useState(new Date());
  // const [newEndTime, setNewEndTime] = useState(new Date());

  // const [mode, setMode] = useState('date');
  // const [show, setShow] = useState(false);

  const [isEndSuggest, setIsEndSuggest] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(()=>{
    console.log("새로운 종료시간은 "+endDateTime)
    setDiffTime((endDateTime.getTime()-nowDate)/1000);
    console.log("새로운 연장시간은 "+diffTime);
    setEndDateChange(false)
  },[endDateChange])

  useEffect(()=>{
    console.log("거래 번호 "+tradeId)
    const send_param={
      tradeId:tradeId
    }

    axios
    .post("http://10.0.2.2:3000/trade/getEndTrade",send_param)
      .then(returnData => {
        if(returnData.data.message){

          setIsEndSuggest(returnData.data.trade.completeSuggest);
          setIsEnd(returnData.data.trade.complete);

          console.log("현재 종료 제안 상태는 "+isEndSuggest);
          console.log("현재 종료 상태는 "+isEnd);

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
  },[])


  // const showMode = (currentMode) => {
  //   setShow(true);
  //   setMode(currentMode);
  // };

  // const showDatepicker = () => {
  //   showMode('date');
  // };

  // const onChange = (event, selectedValue) =>{
  //   setShow(Platform.OS === 'ios');
  //   if(mode == 'date'){
  //     const currentDate = selectedValue || new Date();
  //     setNewEndDate(currentDate);
  //     setMode('time');
  //     setShow(Platform.OS !== 'ios');
  //   }
  //   else if(mode == 'time'){
  //     const selectedTime = selectedValue || new Date();
  //     setNewEndTime(selectedTime);
  //     setShow(Platform.OS === 'ios');
  //     setMode('date');
  //   }
  // }


  const extendButton = () =>{

    endDateTime.setMinutes(endDateTime.getMinutes()+10)
    console.log("연장 후 시간은ㅇㅇ "+endDateTime)
    setEndDateChange(true)
    const newEndSet = newFormatDate(endDateTime)

    //거래연장 통신
    const send_param = {
      tradeId:tradeId,
      endTime: newEndSet
    }
    axios
    .post("http://10.0.2.2:3000/trade/updateTradeTime", send_param)
      //정상 수행
      .then(returnData => {
        if(returnData.data.message){

        var compareDiffTime=(endDateTime.getTime()-nowDate)/1000;
        console.log("차이는?? "+compareDiffTime)

          if(compareDiffTime>0){
            alert("거래 연장에 성공했습니다!");
          } else{
            alert("거래 연장 시간이 현재시간보다 빠릅니다. 거래시간 재 설정을 해주세요")
          }

        } else{
          alert('거래 연장에 실패하였습니다.');
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  }

  const endSuggestButton = () =>{

    //거래완료 통신
    const send_param = {
      tradeId:tradeId
    }
    axios
    .post("http://10.0.2.2:3000/trade/endSuggestTrade", send_param)
      //정상 수행
      .then(returnData => {
        if(returnData.data.message){
          alert('거래 완료 제안을 했습니다!')
          sender=userId;
          setIsEndSuggest(true);
        } else{
          alert('거래 완료 제안이 실패했습니다.')
        }

      })
      //에러
      .catch(err => {
        console.log(err);
      });

  }

  const endButton = () =>{

    //거래완료 통신
    const send_param = {
      tradeId:tradeId
    }
    axios
    .post("http://10.0.2.2:3000/trade/endTrade", send_param)
      //정상 수행
      .then(returnData => {
        if(returnData.data.message){
          //async.getitem(userId)-value
          //if(returnData.data.userId(1)==value --> returnData.data.userId(2)평가, 아니면 반대
          navigation.navigate('userRate',{
            user1: user1,
            user2: user2,
            tradeId: tradeId
          })
        } else{
          alert('거래 완료가 실패했습니다.')
        }

      })
      //에러
      .catch(err => {
        console.log(err);
      });

  }

  const cancelButton = () =>{

    //거래취소(삭제) 통신
    const send_param = {
      tradeId:tradeId
    }
    axios
    .post("http://10.0.2.2:3000/trade/deleteTrade", send_param)
      //정상 수행
      .then(returnData => {
        if(returnData.data.message){
          alert('거래가 취소되어 거래를 다시 제안합니다.')
          navigation.navigate('chatch')
        } else{
          alert('거래 취소 실패!')
        }

      })
      //에러
      .catch(err => {
        console.log(err);
      });

  }

   async function autoReport(){

    console.log("신고된 주소 "+proLocate);
    console.log("확인 accesskey: "+smsKey.accessKey);
    console.log("확인 secretkey: "+smsKey.secretKey);
    console.log("확인 serviceId: "+smsKey.serviceId);
    console.log("확인 phoneNumber: "+smsKey.phoneNumber);
    console.log("확인 timestamp: "+Date.now() + " 타입 : " + typeof Date.now().toString());

    const body = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: smsKey.phoneNumber, // 발신자 번호, 바꾸지 X
      content: `${proLocate} 주소에서 신고가 들어왔습니다.`,
      messages: [
        {
          to: '01075301550', // 수신자 번호
        },
      ],
    };
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': Date.now().toString(),
        'x-ncp-iam-access-key': smsKey.accessKey,
        'x-ncp-apigw-signature-v2': makeSignature(),
      },
    };
    axios
      .post(`https://sens.apigw.ntruss.com/sms/v2/services/${smsKey.serviceId}/messages`, body, options)
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
    {/* <View style={styles.dateArea}>
            <TouchableOpacity style={styles.btnDate} onPress={showDatepicker} >
              <Text style={{color: 'black', paddingBottom:hp(2)}}><B>연장할 종료 날짜 및 시간을 설정하세요 ⌚</B></Text>
              <Text style={{color: 'black'}}>연장을 하실 경우, 연장할 종료 날짜 및 시간을 설정한 후,</Text>
              <Text style={{color: 'black'}}>연장완료 버튼을 눌러야 연장 시간이 저장됩니다!</Text>
            </TouchableOpacity>
        </View> */}

        <View style={styles.rowbtnArea}>
          <View style={styles.btnArea,{paddingRight:wp('1')}}>
            <TouchableOpacity style={styles.btn} onPress={extendButton}>
              <Text style={{color: 'white'}}>10분 연장</Text>
            </TouchableOpacity>
          </View>

          {/* {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={newEndDate}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />)} */}

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
  </>

  const senderView =
  <>
    {isEnd==false?
          (
          <View style={styles.dateArea}>
           <Text style={{fontSize:wp('4.5%')}}>상대방이 거래 종료를 할 때까지 기다려주세요!</Text>
          </View>):

          <View style={styles.dateArea}>
            <View style={styles.btnArea}>
              <TouchableOpacity style={styles.btnEnd} onPress={endButton}>
                <Text style={{color: 'white'}}>사용자 평가하기</Text>
              </TouchableOpacity>
            </View>
          </View>
      }
  </>

  const receiverView =
  <>
    {isEnd==false?
          (
            <View style={styles.dateArea}>
              <View style={styles.btnArea,{paddingLeft:wp('1')}}>
                <TouchableOpacity style={styles.btnEnd} onPress={()=>{setIsEnd(true)}}>
                  <Text style={{color: 'white'}}>거래종료확인</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnCancel} onPress={cancelButton}>
                  <Text style={{color: 'white'}}>거래 취소하기</Text>
                </TouchableOpacity>
              </View>
            </View>):

          <View style={styles.dateArea}>
           <View style={styles.btnArea,{paddingLeft:wp('1')}}>
            <TouchableOpacity style={styles.btnEnd} onPress={endButton}>
              <Text style={{color: 'white'}}>사용자 평가하기</Text>
            </TouchableOpacity>
            </View>
          </View>
      }
  </>

  const tradeEnd =
  <>
    {userId==sender?(
      <>{senderView}</>):
      <>{receiverView}</>
    }
  </>


  return (
    <View style ={{ flex : 1, justifyContent : 'center', alignItems : 'center'}}>

      <Text style={{paddingBottom:hp(3)}}><B>거래 종료까지 남은 시간</B></Text>

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

      {isEndSuggest==false?
      (<>{tradeEndSuggest}</>):
          <>{tradeEnd}</>}

      {/* <TouchableOpacity>
        <Button title={'SMS 보내기!'} onPress={autoReport}/>
      </TouchableOpacity> */}

    </View>
    )
}

function makeSignature(){
  var space = " ";				// one space
  var newLine = "\n";				// new line
  var method = "POST";				// method
  var url = `/sms/v2/services/${smsKey.serviceId}/messages`;	// url (include query string)
  var timestamp = Date.now().toString();			// current timestamp (epoch)
  var accessKey = smsKey.accessKey;			// access key id (from portal or Sub Account)
  var secretKey = smsKey.secretKey;			// secret key (from portal or Sub Account)

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
    backgroundColor: '#4672B8'
  },
  btnCancel: {
    width: 200,
    height: 50,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EB3B30'
  },
  btnEnd: {
    width: 200,
    height: 50,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4672B8'
  },
  rowbtnArea:{
    flexDirection: "row",
    justifyContent: 'center',
    paddingTop:hp(5),
    paddingBottom:hp(3)
  },
  dateArea:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:hp(5),
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
});

export default TradeTimerScreen;