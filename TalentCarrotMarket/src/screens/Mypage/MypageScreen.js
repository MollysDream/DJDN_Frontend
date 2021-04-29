import React, {Component} from 'react';
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

import AsyncStorage from '@react-native-community/async-storage';

const P0 = {latitude: 37.564362, longitude: 126.977011};

const MypageScreen = ({navigation}) => {

  const [address, setAddress] = useState('');
    
    const handleLogoutButton = () => {
        AsyncStorage.clear();
        navigation.replace('Auth');
        
    };

    const certifyAroundButton = () =>{

      AsyncStorage.getItem('user_id')
      .then((value) => {
        const data = JSON.parse(value);
        console.log('name is ', data.name);

        const send_param = {
          email:data,
          location: P0
        };

      axios
      .post("http://10.0.2.2:3001/address/certifyAddress", send_param)
        //정상 수행
        .then(returnData => {
          if (returnData.data.message) {
            setCertify(true);
            setCertifyPopup(returnData.data.message);
            navigation.replace('home');
          } else {
            setCertify(false);
            setCertifyPopup('동네인증을 다시 해주세요');
          }
        })
        //에러
        .catch(err => {
          console.log(err);
        });
      });

  }
 
    return (
      <View style={styles.container}>
            <View style={styles.btnArea2}>
                <TouchableOpacity style={styles.btn2} onPress={handleLogoutButton}>
                    <Text style={(styles.Text, {color: 'white'})}>로그아웃</Text>
                    
                    <TouchableOpacity style={styles.btn, {flex:0.35}} onPress={certifyAroundButton}>
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
                <Text>{address}</Text>
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