import React, {useState,useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Button,
    RefreshControl,
    TouchableHighlight, Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import ActivationScreen from './ActivationScreen';
import DisabledScreen from './DisabledScreen';
import WaitApproveScreen from './WaitApproveScreen';
import AsyncStorage from "@react-native-community/async-storage";
import io from "socket.io-client";
import {HOST} from "../../function";

import requestPoint from "../../requestPointAPI";
import {retrySymbolicateLogNow} from "react-native/Libraries/LogBox/Data/LogBoxData";

// let point = 0;
const AdvertisingScreen = ({navigation, route}) => {

    const [tab, setTab] = useState(0);
    const [userId, setUserId]= useState(route.params.userId);
    const [point, setPoint] = useState(0);


  useEffect(() => {
    async function getPoint() {
      console.log('포인트 조회에 쓰이는 userId : ' + userId);
      console.log('1. 조회된 point: '+ point);

      let returnPoint = await requestPoint.getPoint(userId);
      setPoint(returnPoint.point);
      // point = returnPoint;
      console.log('2. 조회된 데이터: '+  returnPoint);
      console.log('3. 조회된 point: '+  returnPoint.point);
      // console.log('4. 조회된 point type : '+  typeof returnPoint.toString());
    }
    getPoint();
  }, []);

  function IamportPayment(){
    navigation.navigate('결제', {userId:userId});
  }



    let Screen = null;
    if(tab==0)
        Screen = <DisabledScreen navigation={navigation}/>
    else if(tab==1)
        Screen = <ActivationScreen navigation={navigation}/>
    else if(tab==2)
        Screen = <WaitApproveScreen navigation={navigation}/>

        return (
            <View style={styles.container}>

              <View style={styles.pointBox}>

                <View style={styles.pointTextBox}>
                  <Text style={({paddingBottom:100},{color: 'black', fontSize: 10, textAlign:'auto'})}>잔여 포인트:</Text>
                  <Text style={styles.pointText}>{`${point}원`}</Text>
                </View>

                <TouchableOpacity style={styles.chargePointButton} onPress={IamportPayment}>
                  <Text style={(styles.Text, {color: 'black',fontWeight: 'bold',})}>충전</Text>
                </TouchableOpacity>

              </View>

              <View style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginBottom:10
              }}/>

              <View style={styles.container}>
                 <TouchableOpacity onPress={()=>navigation.navigate('makeadver')}
                                  style={{borderWidth:0,position:'absolute',bottom:5,alignSelf:'flex-end'}}>
                    <Icon name="add-circle"  size={70} color="#37CEFF" />
                </TouchableOpacity>
                 <View style={styles.title}>

                 <TouchableOpacity style={{width:'33%', alignItems:'center'}} onPress={()=>setTab(2)}>
                    <Text style={tab == 2 ? styles.text_on : styles.text_off}>
                        {`승인 대기`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width:'33%', alignItems:'center'}} onPress={()=>setTab(0)}>
                    <Text style={tab == 0 ? styles.text_on : styles.text_off}>
                        {`비활성화 광고`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width: '33%', alignItems:'center'}} onPress={()=>setTab(1)}>
                    <Text style={tab == 1 ? styles.text_on : styles.text_off}>
                        {`활성화 광고`}
                    </Text>
                </TouchableOpacity>
                </View>
                <View>{Screen}</View>
            </View>

            </View>

        )


}

const styles = StyleSheet.create({
    text_on:{
        fontSize:18,
        fontWeight: 'bold',
        color: '#ff5900',
        borderBottomWidth: 2,
        borderColor: '#ff5900'
    },
    text_off:{
        fontSize:18,
        fontWeight: 'bold',
        color: 'grey'
    },
    title:{
        margin:10,
        flexDirection:'row',
        borderBottomWidth:5,
        borderColor:'#ffd6c4',
        paddingBottom:5
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: wp(2),
        paddingRight: wp(2),
    },
    pointBox:{
      // flex: 1,
      alignItems: 'center',
      flexDirection:'row',
      borderColor:'black',
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 10,
      paddingTop:20,
      paddingBottom:20,
      marginBottom:20
    },
    pointTextBox:{
      width: 150,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 20,
      // paddingLeft: 20,
      // backgroundColor: '#d4fbff',
    },
    pointText:{
      fontSize:22,
      fontWeight: 'bold',
      color: 'black',
      textAlign:'auto'
    },
    chargePointButton:{
      // flex: 2,
      // grid: 1,
      width: 70,
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#d4fbff',
      marginLeft: 120,
      marginRight: 50
    },

});
export default AdvertisingScreen;
