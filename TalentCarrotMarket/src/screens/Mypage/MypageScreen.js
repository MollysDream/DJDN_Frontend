import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import axios from "axios";

import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';

const MypageScreen = ({navigation}) => {

  const [address, setAddress] = useState([]);
    
    const handleLogoutButton = () => {
        AsyncStorage.clear();
        navigation.replace('Auth'); 
    };

    const addChatListButton = () =>{

    }

    //인증한 동네 확인 - 사용자
    useEffect(() => {
      AsyncStorage.getItem('user_id')
      .then((value) => {
        console.log('name is ', value);

        const send_param = {
          userId:value,
        };

        axios
        .post("http://10.0.2.2:3000/address/checkAddress", send_param)
          //정상 수행
          .then(returnData => {
            if (returnData.data.address) {
              console.log(returnData.data.address)
              setAddress(returnData.data.address)
            } else {
              setAddress('')
            }
          })
          //에러
          .catch(err => {
            console.log(err);
          });
        });

    }, []);

    const certifyAddress=address.map(list=>
      <Text>내가 인증한 동네 : {list.addressName}</Text>
    )
    
    return (
      <View style={styles.container}>
            <View style={styles.btnArea2}>
                <TouchableOpacity style={styles.btn2} onPress={handleLogoutButton}>
                    <Text style={(styles.Text, {color: 'white'})}>로그아웃</Text>
                    
                    <TouchableOpacity style={styles.btn, {flex:0.35}} onPress={addChatListButton}>
                        <Text style={(styles.Text, {color: 'black', paddingLeft:20})}>❌</Text>
                    </TouchableOpacity>
                  
                </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              />

            <View>
              {certifyAddress}
            </View>
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
    btnArea2: {
      height: hp(8),
      // backgroundColor: 'orange',
      paddingBottom: hp(1.5),
    },
    Text: {
      fontSize: wp('4%'),
    },
    btn: {
        width: 10,
        height: 25,
        borderRadius: 117,
        
        borderWidth: 0.5,
        backgroundColor: 'white',
        borderColor: 'black',
        
      },
    btn2: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
      flexDirection: "row",
      justifyContent: 'center',
    },
  });

  export default MypageScreen;