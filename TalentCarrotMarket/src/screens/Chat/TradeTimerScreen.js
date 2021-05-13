import React, {useEffect, useState} from 'react';
import CountDown from 'react-native-countdown-component';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import axios from "axios";
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

let diffTime;
const TradeTimerScreen = ({navigation, route}) =>{

  const {tradeId,endSet}=route.params;
  const [endDateTime, setEndDateTime] = useState(endSet);
  const nowDate = new Date();
  diffTime= (endDateTime.getTime() - nowDate.getTime())/1000;
  // const diffTime = (endDateTime.getTime() - nowDate.getTime())/1000;
  // const [diffTime, setDiffTime] = useState((endDateTime.getTime() - nowDate.getTime())/1000);

  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [newEndDate, setNewEndDate] = useState(new Date());
  const [newEndTime, setNewEndTime] = useState(new Date());

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(()=>{
    console.log("새로운 연장시간은"+diffTime);
  },[endDateTime])

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
  
  const onChange = (event, selectedValue) =>{
    setShow(Platform.OS === 'ios');
    if(mode == 'date'){
      const currentDate = selectedValue || new Date();
      setNewEndDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios'); 
    }
    else if(mode == 'time'){
      const selectedTime = selectedValue || new Date();
      setNewEndTime(selectedTime);
      setShow(Platform.OS === 'ios');
      setMode('date');
    }
  }


  const extendButton = () =>{

    const newEndSet = sendFormatDate(newEndDate,newEndTime);
    const newEndDateTime = parse(newEndSet);
    console.log("현재 시간은 "+nowDate);
    console.log("남은 시간은 "+diffTime);

    //거래연장 통신
    const send_param = {
      tradeId:tradeId,
      endTime: newEndDateTime
    }
    axios
    .post("http://10.0.2.2:3000/trade/updateTradeTime", send_param)
      //정상 수행
      .then(returnData => {
        if(returnData.data.message){
        var compareDiffTime=(endDateTime.getTime()-newEndDateTime.getTime())/1000;
         setEndDateTime(newEndDateTime);

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
          navigation.navigate('userRate')
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


  return (
    <View style ={{ flex : 1, justifyContent : 'center', alignItems : 'center'}}>

    <Text style={{paddingBottom:hp(3)}}><B>거래 종료까지 남은 시간</B></Text>

    <CountDown
        size={30}
        until={diffTime}
        // onFinish={() => alert('거래 종료를 누르지 않아 자동으로 신고가 됩니다.')} 자동신고필요
        digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
        digitTxtStyle={{color: '#1CC627'}}
        timeLabelStyle={{color: 'green', fontWeight: 'bold'}}
        separatorStyle={{color: '#1CC625'}}
        timeToShow={['D','H', 'M', 'S']}
        timeLabels={{d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds'}}
        showSeparator
      />

      <View style={styles.dateArea}>
          <TouchableOpacity style={styles.btnDate} onPress={showDatepicker} >
            <Text style={{color: 'black', paddingBottom:hp(1)}}><B>연장할 종료 날짜 및 시간을 설정하세요 ⌚</B></Text>
            <Text style={{color: 'black'}}>연장을 하실 경우, 연장할 종료 날짜 및 시간을 설정한 후,</Text>
            <Text style={{color: 'black'}}>연장완료 버튼을 눌러야 연장 시간이 저장됩니다!</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.rowbtnArea}>
        <View style={styles.btnArea,{paddingRight:wp('1')}}>
          <TouchableOpacity style={styles.btn} onPress={extendButton}>
            <Text style={{color: 'white'}}>연장완료</Text>
          </TouchableOpacity>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={newEndDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />)}

        <View style={styles.btnArea,{paddingLeft:wp('1')}}>
          <TouchableOpacity style={styles.btn} onPress={endButton}>
            <Text style={{color: 'white'}}>종료하기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.btnArea}>
        <TouchableOpacity style={styles.btnCancel} onPress={cancelButton}>
          <Text style={{color: 'white'}}>거래 취소하기</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
}

//타이머 설정용 시간
const sendFormatDate = (date,time)=>{
  const setDate= `${date.getFullYear()}/${date.getMonth() +
    1}/${date.getDate()}/${time.getHours()}/${time.getMinutes()}`;
  return setDate;
  };

//str-->date
function parse(str){
  var newDd=str.split('/');
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