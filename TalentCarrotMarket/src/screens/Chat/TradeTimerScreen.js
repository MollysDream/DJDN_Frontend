import React, {useState} from 'react';
import CountDown from 'react-native-countdown-component';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import axios from "axios";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const TradeTimerScreen = ({navigation, route}) =>{

  const {tradeId,endDate}=route.params;
  const currentDate = Date.now();
  const diffTime = Math.abs(endDate - currentDate)/100;

  const extendButton = () =>{
    
    navigation.navigate('tradeExtend',{
      tradeId:tradeId, 
      endDate: endDate
    })
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
        //async.getitem(userId)-value
        //if(returnData.data.userId(1)==value --> returnData.data.userId(2)평가, 아니면 반대
        navigation.navigate('userRate')
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
          navigation.navigate('tradeSet')
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
      <View style={styles.rowbtnArea}>
        <View style={styles.btnArea,{paddingRight:wp('1')}}>
          <TouchableOpacity style={styles.btn} onPress={extendButton}>
            <Text style={{color: 'white'}}>연장하기</Text>
          </TouchableOpacity>
        </View>
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
});

export default TradeTimerScreen;