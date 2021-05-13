import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import axios from "axios";

import AsyncStorage from '@react-native-community/async-storage';
import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";

const MypageScreen = ({navigation}) => {

  const [address, setAddress] = useState([]);
  const [userId, setUserId]= useState('');
  const [userData, setUserData] = useState('');
  const [userAddress, setUserAddress] = useState('');

    
    const handleLogoutButton = () => {
        AsyncStorage.clear();
        navigation.replace('Auth'); 
    };

    //인증한 동네 확인 - 사용자
    useEffect(() => {
        async function getUserData(){
            let userId = await AsyncStorage.getItem('user_id');
            setUserId(userId);

            let userData = await requestUserAPI.getUserData(userId);
            setUserData(userData);

            let userAddressDataList = await requestAddressAPI.getUserAddress(userId);
            setUserAddress(userAddressDataList);

            userAddressDataList.address.map((address)=>{
                if(address.addressIndex == userData.addressIndex){
                    setUserAddress(address);
                    return;
                }
            })

        }
        console.log("마이페이지 불러옴");
        let result = getUserData();
    }, []);

    const certifyAddress=address.map(list=>
      <Text>내가 인증한 동네 : {list.addressName}</Text>
    )

    const goToUserPostScreen = ()=>{
        navigation.navigate('userPostScreen');
    }

    const editProfileButton = ()=>{
        console.log('프로필 수정!!');

    }

    return (
      <View style={styles.container}>

          <View style={styles.profileBox}>

              {
                  userData=='' ?null:
                      (
                          <View style={styles.user}>
                              <Image style={styles.profileImage} source={{uri:userData.profileImage}}/>
                              <Text style={{marginTop:5, color:'grey'}}>{`${userAddress.addressName}의`}</Text>
                              <Text style={styles.nickname}>{userData.nickname}</Text>
                          </View>

                      )

              }

              <View style={styles.editArea}>
                  <TouchableOpacity style={styles.editButton} onPress={editProfileButton}>
                      <Text style={(styles.Text, {color: 'black'})}>프로필 수정</Text>
                  </TouchableOpacity>
              </View>


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
          <Button title={'재능거래 내역'} onPress={goToUserPostScreen}/>

          <View style={styles.logoutArea}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutButton}>
                  <Text style={(styles.Text, {color: 'black'})}>로그아웃</Text>
              </TouchableOpacity>
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
    user:{
      alignItems:'center'
    },
    profileBox:{
        alignItems: 'center',
        flexDirection:'column',
        paddingTop:10,
        marginBottom:10
    },
    profileImage:{
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#6fceff"
    },
    nickname:{
      fontSize: 27,
    },
    editArea:{
        height:20,
        margin:5,
    },
    editButton:{
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d4fbff',
    },
    logoutArea: {
      height: hp(8),
        paddingRight: wp(2),
      paddingBottom: hp(1.5),
        position: "absolute", bottom: 0, right: 0
    },
    logoutButton: {
      flex: 1,
      width: 100,
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fd7a7a',
      flexDirection: "row",

    },
  });

  export default MypageScreen;