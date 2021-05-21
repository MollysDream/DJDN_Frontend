import React, {useState,useEffect,createRef} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';

import axios from "axios";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import NaverMapView, {Marker} from "react-native-nmap";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

let userId ;
let sender;
let receiver;

const TradeSetScreen =({navigation,route})=>{

      const {user1,user2,chatRoom}=route.params;

      const locateInputRef = createRef();
 
      AsyncStorage.getItem('user_id').then((value) =>
        userId=value
      );

      const [locate,setLocate]=useState('')
      const [detailLocate,setDetailLocate]=useState('');
      const [isSuggest,setIsSuggest]=useState(false);
      const [isSave,setIsSave]=useState(false);
      // const [sender, setSender]=useState('');
      // const [receiver, setReceiver]=useState('');
      const [tradeId, setTradeId]=useState('');

      // 제안된 장소, 시간 확인
      const [proLocate, setProLocate]=useState('');
      const [start, setStart]=useState('');
      const [end, setEnd]=useState('');

      useEffect(()=>{

        console.log("채팅방 번호 "+chatRoom)
        const send_param={
          chatRoom:chatRoom
        }

        axios
        .post("http://10.0.2.2:3000/trade/getTrade",send_param)
          .then(returnData => {
            if(returnData.data.message){

              console.log("거래 정보는 "+returnData.data.trade);
              setIsSuggest(true);
              setIsSave(returnData.data.trade.isSave);
              setProLocate(returnData.data.trade.location);
              setStart(returnData.data.trade.startTime);
              setEnd(returnData.data.trade.endTime);
              setTradeId(returnData.data.trade._id);

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

      // 거래 시간 설정
      const [startDate, setStartDate] = useState(new Date());
      const [endDate, setEndDate] = useState(new Date());
      const [startTime,setStartTime]=useState(new Date());
      const [endTime,setEndTime]=useState(new Date());
      const [mode, setMode] = useState('date');
      const [show, setShow] = useState(false);
      const [showEnd, setShowEnd] = useState(false);

      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
      const showEndMode = (currentMode) => {
        setShowEnd(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };

      const showEndDatepicker = () => {
        showEndMode('date');
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

      const onChangeEnd = (event, selectedValue) =>{
        setShowEnd(Platform.OS === 'ios');
        if(mode == 'date'){
          const currentDate = selectedValue || new Date();
          setEndDate(currentDate);
          setMode('time');
          setShowEnd(Platform.OS !== 'ios'); 
        }
        else if(mode == 'time'){
          const selectedTime = selectedValue || new Date();
          setEndTime(selectedTime);
          setShow(Platform.OS === 'ios');
          setMode('date');
        }
      }
      
      // 거래 장소 설정
      const [currentLocation, setCurrentLocation] = useState({latitude: 37.27886373711404, longitude: 127.04245001890514});

      useEffect(()=>{
        console.log(currentLocation)
        const send_param = {
          currentX: currentLocation.longitude,
          currentY: currentLocation.latitude
        }
        axios
        .post("http://10.0.2.2:3000/address/currentAddress", send_param)
          //정상 수행
          .then(returnData => {
            setLocate(returnData.data.address);
          })
          //에러
          .catch(err => {
            console.log(err);
          });
      },[locate, currentLocation])
      
      const locationHandler = (e) => {
        
        Alert.alert(
            "",
            "여기서 거래하실건가요??",
            [
                { text: 'Cancel'},
                { text: 'OK', onPress: () => {
                    setCurrentLocation(e);
                    const send_param = {
                      currentX: currentLocation.longitude,
                      currentY: currentLocation.latitude
                    }
                    axios
                    .post("http://10.0.2.2:3000/address/currentAddress", send_param)
                      //정상 수행
                      .then(returnData => {
                        setLocate(returnData.data.address);
                      })
                      //에러
                      .catch(err => {
                        console.log(err);
                      });
                
                    console.log('onMapClick', JSON.stringify(e));
                }}
            ],
            { cancelable: false }
        );
    };

    // 설정 완료 후, 제안 버튼
    const suggestButton = () =>{
      
      
      if(user1==userId){
        sender = user1;
        receiver = user2;
      } else{
        sender = user2;
        receiver = user1;
      }

      console.log("sender는 "+sender);
      console.log("receiver는 "+receiver);
      
      const entireLocate = locate + detailLocate;
      console.log("전체주소는 "+entireLocate)

      if(!detailLocate){
        alert('상세 주소를 입력해주세요');
        return;

      } else{
        console.log('설정된 시작시간 ' + startTime);
        console.log('현재 접속자 ' + userId);
        
        const startSet = formatDate(startDate,startTime);
        const endSet = formatDate(endDate,endTime);

        setProLocate(entireLocate);
        setStart(startSet);
        setEnd(endSet);


        const send_param = {
          startTime: startSet,
          endTime: endSet,
          location: entireLocate,
          sender: sender,
          receiver: receiver,
          chatRoom: chatRoom
        };
    
        axios
        .post("http://10.0.2.2:3000/trade/createTradeTime", send_param)
          //정상 수행
          .then(returnData => {
            if (returnData.data.message) {
              console.log("거래 장소 및 시간 설정 완료")
              console.log("거래 번호 "+returnData.data.tradeId)
              setTradeId(returnData.data.tradeId);
              setIsSuggest(true);
            } else {
              console.log('거래 장소 및 시간 설정 실패');
            }
          })
          //에러
          .catch(err => {
            console.log(err);
          });

      }
    }

    //동의 버튼
    const agreeButton = () =>{

      const send_param = {
        tradeId: tradeId
      };

      axios
      .post("http://10.0.2.2:3000/trade/agreeTrade", send_param)
        //정상 수행
        .then(returnData => {
          if (returnData.data.message) {
            console.log("거래 동의 완료")
            setIsSave(true);
          } else {
            console.log('거래 장소 및 시간 설정 실패');
          }
        })
        //에러
        .catch(err => {
          console.log(err);
        });
    }

    //남은 시간 확인 버튼
    const timeCheckButton = () =>{

      // const sendEndSet = sendFormatDate(endDate,endTime)
      var sendEndDate = parse2(end);
      console.log("저장된 시간은 "+sendEndDate)

      navigation.navigate('tradeTimer',{
        tradeId: tradeId,
        endSet: sendEndDate,
        user1: user1,
        user2: user2
      })
    }
    

    //재제안 버튼
    const resuggestButton = () =>{
      setIsSuggest(false)
      setIsSave(false)

      //거래취소(삭제) 통신
      const send_param = {
        tradeId:tradeId
      }
      axios
      .post("http://10.0.2.2:3000/trade/deleteTrade", send_param)
        //정상 수행
        .then(returnData => {
          if(returnData.data.message){
            alert('거래를 다시 제안합니다.')
          } else{
            alert('거래 취소 실패!')
          }
          
        })
        //에러
        .catch(err => {
          console.log(err);
        });
    }


    // 거래 시간 및 장소 제안할 시 (isSuggest = false)
    const proposeTrade =
    <>
      <NaverMapView 
        style={{width: '100%', height: '85%'}}
        showsMyLocationButton={true}
        center={{...currentLocation, zoom:16}}
        onTouch={e => console.log('onTouch', JSON.stringify(e.nativeEvent))}
        onCameraChange={e => console.log('onCameraChange', JSON.stringify(e))}
        onMapClick={e => locationHandler(e)}
        useTextureView>
          <Marker coordinate={currentLocation}/>
      </NaverMapView>

      <View style={styles.locateForm}>
        <Text style={{fontSize: wp('4')}}>                          {locate}</Text>
        <TextInput
          style={styles.textForm}
          onChangeText={(locate) => setDetailLocate(locate)}
          placeholder={'🗺️거래를 진행 할 상세 주소를 입력해주세요!(ex 101동 1103호)🗺️'}
          ref={locateInputRef}
        />
      </View>
      
      <View style={styles.dateArea}>
          <TouchableOpacity style={styles.btnDate} onPress={showDatepicker} >
            <Text style={{color: 'black'}}>시작 날짜 및 시간 설정하세요 ⌚</Text>
          </TouchableOpacity>
        <View style={styles.datetimeButton}>
          <TouchableOpacity style={styles.btnDate} onPress={showEndDatepicker} >
            <Text style={{color: 'black'}}>종료 날짜 및 시간 설정하세요 ⌚</Text>
          </TouchableOpacity>
        </View>
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

        {showEnd && (
          <DateTimePicker
            testID="dateTimePicker"
            value={endDate}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChangeEnd}
          />)}
       
      <View style={styles.btnArea}>
        <TouchableOpacity style={styles.btn} onPress={suggestButton}>
          <Text style={{color: 'white'}}>제안하기</Text>
        </TouchableOpacity>
      </View>
    </>  

    // 거래 시간 및 장소 제안 후 (isSuggest = true)
    const saveTrade =
    <>
      <NaverMapView 
        style={{width: '100%', height: '85%'}}
        showsMyLocationButton={true}
        center={{...currentLocation, zoom:16}}
        onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
        onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
        onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}>
      </NaverMapView>
        
      <View style={{justifyContent: 'center',alignItems: 'center', paddingBottom: hp('3')}}> 
        <Text style={{fontSize: wp('4'), paddingTop: hp('2'), paddingBottom: hp('2')}}>시작 시간: {start}</Text>
        <Text style={{fontSize: wp('4'), paddingBottom: hp('2')}}>종료 시간: {end} </Text>
        {/* <Text>예상시간 : {workTime}</Text> */}
        <Text style={{fontSize: wp('4')}}>장소: {proLocate}</Text>
      </View>
    
      
      {isSuggest==true && isSave==false && userId!=sender?
        (<View style={styles.rowbtnArea}> 
          <View style={styles.btnArea,{paddingRight: wp('1')}}>
              <TouchableOpacity style={styles.btn} onPress={agreeButton}>
                <Text style={{color:'white'}}>동의하기</Text>
              </TouchableOpacity>
            </View>
          <View style={styles.btnArea,{paddingLeft: wp('1')}}>
            <TouchableOpacity style={styles.btn} onPress={resuggestButton}>
              <Text style={{color:'white'}}>다시 제안하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        ):
        
        <View style={styles.rowbtnArea}> 
          <View style={styles.btnArea,{paddingRight: wp('1')}}>
              <TouchableOpacity style={styles.btn} onPress={timeCheckButton}>
                <Text style={{color:'white'}}>남은 시간 확인</Text>
              </TouchableOpacity>
            </View>
          <View style={styles.btnArea,{paddingLeft: wp('1')}}>
            <TouchableOpacity style={styles.btn} onPress={resuggestButton}>
              <Text style={{color:'white'}}>다시 제안하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        }
      
    </>

      return (
        <View style={styles.container}>
          <View style={styles.topArea}>
              <Text style={{paddingBottom:10,paddingTop:10}}><B>시간 및 동네 설정</B></Text>
              <Text style={{paddingBottom:15}}>지도 마커를 통해 거래 장소를 설정해주세요!</Text>
          </View>

          {/* <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          /> */}

        {isSuggest == false ?(
          <View style={styles.bottomArea}>{proposeTrade}</View>
        ): <View style={styles.bottomArea}>{saveTrade}</View>}
    </View>
      );
    
}


const formatDate = (date,time)=>{
  const setDate= `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${time.getHours()}:${time.getMinutes()}`;
  return setDate;
  };

//타이머 설정용 전달 시간
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

//str-->date
function parse2(str){
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
      flex: 1
    },
    topArea: {
      flex: 0.125,
      paddingTop: wp(3),
      alignItems: 'center',
    },
    bottomArea: {
      flex: 0.55,
      paddingTop: wp(3),
      alignItems: 'center',
    },
    locateForm:{
      justifyContent: 'center',
      marginTop: wp(3),
      marginBottom:wp(3),
      borderWidth: 0.5,
      borderColor: 'gray',
      backgroundColor:'white'
    },
    textForm: {
      borderWidth: 2,
      borderColor: 'black',
      borderBottomRightRadius: 7,
      borderBottomLeftRadius: 7,
      width: '100%',
      height: hp(6),
      paddingLeft: 10,
      paddingRight: 10,
    },
    rowbtnArea:{
      flexDirection: "row",
      justifyContent: 'center',
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
      backgroundColor: '#4672B8'
    },
    btnDate: {
      width: 500,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#CDDDEF',
      borderWidth: 0.5,
      borderColor: 'gray',
    },
    dateArea:{
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:wp(3),
    },
    datetimeButton: {
      height: hp(5),
      paddingRight: wp(1)
    },
  });
export default TradeSetScreen;