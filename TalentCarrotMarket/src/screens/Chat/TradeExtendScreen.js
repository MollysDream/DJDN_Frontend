import React, {useState} from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DateTimePicker from '@react-native-community/datetimepicker';

import axios from "axios";


const TradeExtendScreen = ({navigation, route}) =>{

  const {tradeId,endDate}=route.params;

  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [newEndDate, setNewEndDate] = useState(endDate);

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
      setStartDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios'); 
    }
    else if(mode == 'time'){
      const selectedTime = selectedValue || new Date();
      setStartTime(selectedTime);
      setShow(Platform.OS === 'ios');
      setMode('date');
    }
  }

  const extendSetButton = () =>{

    setNewEndDate('')
    //거래완료 통신
    const send_param = {
      tradeId:tradeId,
      endTime: newEndDate
    }
    axios
    .post("http://10.0.2.2:3000/trade/updateTradeTime", send_param)
      //정상 수행
      .then(returnData => {
        navigation.navigate('tradeTimer',{
          endDate:newEndDate,
        })
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  }

  const extendCancelButton = () =>{

    navigation.navigate('tradeTimer',{
      endDate:endDate,
    })
  }
  return (
    <View style ={{ flex : 1, justifyContent : 'center', alignItems : 'center'}}>
      <View style={styles.dateArea}>
          <TouchableOpacity style={styles.btnDate} onPress={showDatepicker} >
            <Text style={{color: 'black'}}>연장할 종료 날짜 및 시간을 설정하세요 ⌚</Text>
          </TouchableOpacity>
      </View>

      {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />)}


      <View style={styles.rowbtnArea}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btn} onPress={extendSetButton}>
            <Text style={{color: 'white'}}>연장하기</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btnCancel} onPress={extendCancelButton}>
            <Text style={{color: 'white'}}>연장취소하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    )
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
    width: 150,
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
});
export default TradeExtendScreen;