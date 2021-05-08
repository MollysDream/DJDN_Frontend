import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView, Button, Alert
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

import SwitchSelector from "react-native-switch-selector";
import axios from 'axios';

import NaverMapView, {Circle, Marker, Path, Polyline, Polygon, Align} from "react-native-nmap";
import Geolocation from 'react-native-geolocation-service';

import requestAddressAPI from "../../requestAddressAPI";
import requestUserAPI from "../../requestUserAPI";

//const P0 = {latitude: 37.564362, longitude: 126.977011};
const haversine = require('haversine');


//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const AroundSetScreen = ({navigation}) => {

    //현재 위치값 저장
    const [location,setLocation]= useState({
        locations:[
            {latitude:null,longitude:null}
        ]
    });


    //navermap에서 보여줄 초기 위치
    const [P1, setP1] = useState({latitude: 37.564362, longitude: 126.977011})
    //반경 저장
    const [distance, setDistance] = useState(0)
    const [strDistance, setStrDistance] = useState('');
    const [tempDistance, setTempDistance] = useState(0);
    //사용자 id,정보,주소인덱스
    const [userId,setUserId] = useState('');
    const [userData, setUserData] = useState();
    const [userAddressIndex, setUserAddressIndex]=useState();
    //동 이름
    const [address1,setAddress1]= useState('');
    const [address2,setAddress2]= useState('');
    //반경 저장 및 커스텀 플래그
    const [Radius,setRadius]= useState(0);
    const [customFlag, setCustomFlag]= useState(1);
    //선택된 상태 표시를 위한 Flag
    const [chooseState1,setChooseState1] = useState('');
    const [chooseState2,setChooseState2] = useState('');
    //지정한 동네 갯수
    const [numberOfAddress, setNumberOfAddress] = useState(0);

    // 실제 안드로이드 폰에서 되는지 확인 필요
    useEffect(() =>{
        Geolocation.getCurrentPosition(
            position =>{
                const {latitude,longitude}=position.coords;
                setLocation({
                    latitude,
                    longitude
                });
                setP1({
                    latitude,
                    longitude
                })
            },
            error => {console.log(error.code,error.message)},
            { enableHighAccuracy:true, timeout: 20000, maximumAge:1000},
        );
    },[]);



    useEffect(async ()=>{

        let userId = await AsyncStorage.getItem('user_id');
        setUserId(userId);

        console.log('사용자 Address Data 불러오기');
        let userAddressDataList = await requestAddressAPI.getUserAddress(userId);
        console.log(userAddressDataList.address);

        setNumberOfAddress(userAddressDataList.address.length);

        let add1
        let add2
        let userRadius;

        if(userAddressDataList.address.length == 1){
            if(userAddressDataList.address[0].addressIndex == 1){
                console.log("인덱스1 일때 1개")
                add1 = userAddressDataList.address[0]
                setAddress1(add1.addressName);
                setChooseState1('choose')
                userRadius = add1.radius;
            }else{
                console.log("인덱스2 일때 1개")
                add2 = userAddressDataList.address[0]
                setAddress2(add2.addressName);
                setChooseState2('choose');
                userRadius = add2.radius;

            }

            setRadius(userRadius);
            setDistance(userRadius);
            return;
        }


        if(userAddressDataList.address[0].addressIndex == 1){
            add1 = userAddressDataList.address[0]
            add2 = userAddressDataList.address[1]
        }else{
            add2 = userAddressDataList.address[0]
            add1 = userAddressDataList.address[1]
        }

        setAddress1(add1.addressName);
        setAddress2(add2.addressName);

        console.log(add1);
        console.log(add2);

        //**********사용자가 사용중인 동네 무엇인지 불러옴
        let userData = await requestUserAPI.getUserData(userId);
        setUserData(userData);
        setUserAddressIndex(userData.addressIndex);

        //현재 선택된 동네 색으로 표시  +  Radius 값 저장
        if(userData.addressIndex == 1){
            setChooseState1('choose')
            setChooseState2('')
            userRadius = add1.radius;
        }else{
            setChooseState1('')
            setChooseState2('choose');
            userRadius = add2.radius;
        }

        //**************이중에서 하나만 이용해야됨************//
        //console.log(userAddressDataList.address[0]);
        //let userRadius = userAddressDataList.address[0].radius;
        //console.log(userRadius);
        setRadius(userRadius);
        setDistance(userRadius);
    },[])

    const setMapRadius= (endLocation)=>{

        //커스텀이 아닐경우 반경 조작 못함
        if(!customFlag)
            return;

        const start = {
            latitude: location.latitude,
            longitude: location.longitude
        }
        const end ={
            latitude: endLocation.latitude,
            longitude: endLocation.longitude
        }
        //console.log(Math.floor(haversine(start,end ,{unit:'meter'})))
        setDistance(Math.floor(haversine(start,end ,{unit:'meter'})));
    }

    //근처 동네 갯수 설정
    const selectSwitchRadius = (value) => {
        console.log(`${value}m의 재능 구매 게시글 찾기`)

        //컴스텀일 경우 Flag 1로 지정
        if(value == -1){
            console.log('커스텀')
            setCustomFlag(1);
            setDistance(tempDistance);
            setRadius(distance);
            return;
        }

        //커스텀 아닐경우 Flag 0으로 지정
        console.log('지정값');
        setCustomFlag(0);

        setRadius(value);
        setDistance(value);
    }

    useEffect(()=>{
        //커스텀 상태이면 실행
        if(customFlag){
            if(distance >= 1000)
                setStrDistance(`${(distance/1000).toFixed(1)}km`);
            else
                setStrDistance(`${distance}m`);

            console.log(distance);
            setTempDistance(distance);
            setRadius(distance);

        }
        
    },[distance])

    const circleClick = ()=>{
        if(!customFlag)
            return;

        setDistance(0);
    }

    const saveRadius = async () =>{
        console.log(`${Radius} 반경 저장!!!`);

        if(Radius < 50){
            Alert.alert("설정 실패","50m 이상 반경으로 설정해주세요.",[
                {text:'확인', style:'cancel'}
            ])
            return
        }

        await requestAddressAPI.updateRadius(userId, Radius, userAddressIndex);

        Alert.alert("설정 완료",`거래 반경이 ${Radius}m로 설정 되었습니다.`,[
            {text:'확인', style:'cancel'}
        ])

    }

    const options = [
      {label:"500m", value: 500},
      {label:"1km", value: 1000},
      {label:"2km", value: 2000},
        {label:'커스텀: '+ strDistance, value:-1}
    ];


    function blockDelete(numberOfAddress){
        if(numberOfAddress==1){
            Alert.alert("삭제 실패","동네는 최소한 1개가 필요합니다.",[
                {text:'확인', style:'cancel'}
            ])
            return 1;
        }
        return 0;
    }
    //설정된 동네 삭제
    const addressOneDeleteButton = async () => {
        if(blockDelete(numberOfAddress))
            return;

      setAddress1('');
      await requestAddressAPI.deleteAddress(userId, 1);

      if(userAddressIndex == 1){
          await requestUserAPI.updateUserAddressIndex(userId, 2);
          setUserAddressIndex(2);
          setChooseState2('choose');
      }
      setNumberOfAddress(1);
    };

    const addressTwoDeleteButton = async () => {
        if(blockDelete(numberOfAddress))
            return;

      setAddress2('');
      await requestAddressAPI.deleteAddress(userId, 2);

        if(userAddressIndex == 2){
            await requestUserAPI.updateUserAddressIndex(userId, 1);
            setUserAddressIndex(1);
            setChooseState1('choose');
        }
        setNumberOfAddress(1);
    };

    //내 동네 추가 ( ** 동 설정 ** )
    const addressOneAddButton = () => {
      navigation.navigate('aroundAdd',{chooseIndex: 1})
    };

    const addressTwoAddButton = () => {
      navigation.navigate('aroundAdd',{chooseIndex: 2});
    };

    //동네 선택 및 인증
    const chooseAddressOneButton = (value) => {
      navigation.navigate('aroundCertify',{
        chosenAddress:address1,
          addressIndex: 1,
          userId: userId
      })
    }

    const chooseAddressTwoButton = (value) => {
      navigation.navigate('aroundCertify',{
        chosenAddress:address2,
          addressIndex: 2,
          userId: userId
      })
    }


    return (
        <View style={styles.container}>
            <View style={styles.topArea}>
                <Text style={{paddingTop:10}}><B>동네 선택</B></Text>
                <Text style={{paddingBottom:25}}>지역은 최소 1개 이상 최대 2개까지 저장 가능해요.</Text>
            </View>

            <View style={styles.btnArea}>
              {address1 !=''?(
                    <View style={styles.btnArea2}>
                      {chooseState1 !=''?(
                      <TouchableOpacity onPress={chooseAddressOneButton} style={styles.btnAroundChoose}>
                        <Text style={(styles.Text, {color: 'white'})}>{address1}</Text>
                      
                        <TouchableOpacity onPress={addressOneDeleteButton} style={styles.btn}>
                          <Text style={{paddingLeft:20}}>❌</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>

                      ):<TouchableOpacity onPress={chooseAddressOneButton} style={styles.btnAround}>
                      <Text style={(styles.Text, {color: 'black'})}>{address1}</Text>
                    
                      <TouchableOpacity onPress={addressOneDeleteButton} style={styles.btn}>
                        <Text style={{paddingLeft:20}}>❌</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                      }
                    </View>
                    
                  ):
                  <View style={styles.btnArea2}>
                    <TouchableOpacity style={styles.btnNoAround} onPress={addressOneAddButton}>
                          <Text style={{
                            color: 'gray',
                            textAlign: 'center',
                            marginBottom: 6,
                            fontSize: 15,
                          }}>➕</Text>
                      </TouchableOpacity>
                    </View>}

              {address2 !=''?(
                
                  <View style={styles.btnArea2}>
                  {chooseState2 !=''?(
                  <TouchableOpacity onPress={chooseAddressTwoButton} style={styles.btnAroundChoose}>
                    <Text style={(styles.Text, {color: 'white'})}>{address2}</Text>
                    <TouchableOpacity onPress={addressTwoDeleteButton} style={styles.btn}>
                      <Text style={{paddingLeft:20}}>❌</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                      ):
                      <TouchableOpacity onPress={chooseAddressTwoButton} style={styles.btnAround}>
                  <Text style={(styles.Text, {color: 'black'})}>{address2}</Text>
                  <TouchableOpacity onPress={addressTwoDeleteButton} style={styles.btn}>
                    <Text style={{paddingLeft:20}}>❌</Text>
                  </TouchableOpacity>
                </TouchableOpacity>}
                </View>
                
              ):
              <View style={styles.btnArea2}>
                <TouchableOpacity style={styles.btnNoAround} onPress={addressTwoAddButton}>
                    <Text style={{
                      color: 'gray',
                      textAlign: 'center',
                      marginBottom: 6,
                      fontSize: 15,
                    }}>➕</Text>
                </TouchableOpacity>
              </View>}
            </View>

            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              />

            <View style={styles.bottomArea}>
              <Text style={{paddingBottom:5}}>
                  <B>{userAddressIndex == 1 ? address1: address2} 반경 {
                  Radius>=1000?
                      `${(Radius/1000).toFixed(1)}km`:
                      `${Radius}m`
              }</B>
              </Text>
              <Text style={{paddingBottom:5}}>선택한 범위의 게시글만 볼 수 있어요.</Text>
            </View>

            <NaverMapView
                style={{flex: 0.5, width: '100%', height: '100%'}}
                showsMyLocationButton={true}
                center={{...P1, zoom:16}}
                onMapClick={e => setMapRadius(e)}>
                {
                    location.latitude == null ? null :
                        <Circle coordinate={location} color={"rgba(0,199,249,0.2)"} radius={distance} onClick={circleClick}/>

                }
            </NaverMapView>
            <SwitchSelector style={{paddingTop:10, paddingBottom:4}}
                options={options}
                initial={3}
                onPress={selectSwitchRadius}
                textColor={'#7a44cf'}
                selectedColor={'white'}
                buttonColor={'#7a44cf'}
                borderColor={'#7a44cf'}
                hasPadding
            />
            <Button title={'반경설정'} onPress={saveRadius}/>

        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1, //전체의 공간을 차지한다는 의미
      flexDirection: 'column',
      backgroundColor: 'white',
      paddingLeft: wp(7),
      paddingRight: wp(7),
    },
    Text: {
      fontSize: wp('4%'),
    },
    topArea: {
      flex: 0.15,
      paddingTop: wp(3),
      alignItems: 'center',
    },
    bottomArea: {
      flex: 0.15,
      paddingTop: wp(3),
      alignItems: 'center',
    },
    btnArea:{
      flex:0.12,
      flexDirection: "row",
      justifyContent: 'center',
    },
    btnArea2: {
      height: hp(8),
      // backgroundColor: 'orange',
      paddingBottom: hp(1.5),
      paddingRight:15
      
    },
    btnNoAround: {
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'gray',
      },
    btnAround: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      flexDirection: "row",
      borderWidth: 0.5,
      borderColor: 'gray',
    },
    btnAroundChoose: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
      flexDirection: "row",
    },
  });

export default AroundSetScreen;