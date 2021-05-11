import React, {useState,useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity, Button, Alert,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import Postcode from '@actbase/react-daum-postcode';
import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';
import requestAddressAPI from "../../requestAddressAPI";

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const AroundAddScreen = ({navigation,route}) => {

    const chooseIndex = route.params.chooseIndex;
    const [aroundAddress,setAroundAddress]= useState('');

    const [chosenAddress, setChosenAddress] = useState('');
    const [geoAddress, setGeoAddress] = useState('');
    const userId=route.params.userId;

    const addAddressButton = () =>{
        setChosenAddress(geoAddress);
        /*Geolocation.getCurrentPosition(
            position =>{
                const {latitude,longitude}=position.coords;

                const send_param = {
                    currentX: longitude,
                    currentY: latitude
                }

                axios
                    .post("http://10.0.2.2:3000/address/currentLocation", send_param)
                    //정상 수행
                    .then(returnData => {
                        console.log(returnData.data);
                        setChosenAddress(returnData.data.address)
                    })
                    //에러
                    .catch(err => {
                        console.log(err);
                    });
            },
            error => {console.log(error.code,error.message)},
            { enableHighAccuracy:true, timeout: 20000, maximumAge:1000},
        );*/

    }

    useEffect(() =>{
        Geolocation.getCurrentPosition(
            position =>{
                const {latitude,longitude}=position.coords;

                const send_param = {
                    currentX: longitude,
                    currentY: latitude
                }

                axios
                    .post("http://10.0.2.2:3000/address/currentLocation", send_param)
                    //정상 수행
                    .then(returnData => {
                        console.log(returnData.data);
                        setGeoAddress(returnData.data.address)
                    })
                    //에러
                    .catch(err => {
                        console.log(err);
                    });
            },
            error => {console.log(error.code,error.message)},
            { enableHighAccuracy:true, timeout: 20000, maximumAge:1000},
        );
    },[]);

    const selectByPostcode = (data)=>{
        //console.log(data.bname);
        setChosenAddress(data.bname);

        /*Alert.alert("동네 검색 완료", `${data.bname}으로 동네 선택함`,
            [{ text: '확인', style: 'cancel'}])*/
    }

    const saveChosenAddress = async() =>{
        console.log(`${chosenAddress} 저장`);
        //let userId = await AsyncStorage.getItem('user_id');
        let result = await requestAddressAPI.createAddress(userId, chosenAddress, chooseIndex);

        navigation.navigate('aroundCertify',{
            chosenAddress:chosenAddress,
            addressIndex: chooseIndex,
            userId: userId
        })
       /* Alert.alert("동네 저장 완료", `${chosenAddress}으로 동네 저장함`,
            [{ text: '확인', style: 'cancel',
            onPress:()=>{
                navigation.navigate('aroundCertify',{
                    chosenAddress:chosenAddress,
                    addressIndex: chooseIndex,
                    userId: userId
                })
            }}])*/
    }

    return (
        <View style={styles.container}>
            {
                chosenAddress == ''? null:
                    <Button title={`${chosenAddress} 인증하기`} onPress={()=>saveChosenAddress()}/>
            }
          <View style={styles.btnArea}>
            <TouchableOpacity style={styles.btnAround} onPress={addAddressButton}>
              <Text style={(styles.Text, {color: 'white'})}>현재 위치로 찾기</Text>
              {aroundAddress != '' ? (
              <Text style={styles.TextValidation}> {aroundAddress}</Text>
              ) : null}
            </TouchableOpacity>
          </View>
            {/*주소 찾기 태그*/}
            <Postcode
                style={{ flex:1 }}
                jsOptions={{ animated: true }}
                onSelected={data => selectByPostcode(data)}
            />
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
    btnArea: {
      height: hp(8),
      // backgroundColor: 'orange',
      paddingTop: hp(1.5),
      paddingBottom: hp(9),
      flexDirection: "row",
      // justifyContent: 'center',
    },
    btnAround: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
    },
    Text: {
      fontSize: wp('4%'),
    },
    TextValidation: {
      fontSize: wp('4%'),
      color: 'red',
      paddingTop: wp(2),
    },
  
  });

export default AroundAddScreen;