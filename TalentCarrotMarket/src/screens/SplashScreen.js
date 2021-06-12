// Import React and Component
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, Image, Alert} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import AsyncStorage from '@react-native-community/async-storage';
import requestUserAPI from "../requestUserAPI";
import requestMemberAPI from '../requestMemberAPI';
import requestReportAPI from "../requestReportAPI";

import messaging from '@react-native-firebase/messaging';

const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);
  //AsyncStorage.clear();

  useEffect(() => {
    setTimeout(async () => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      let userId = await AsyncStorage.getItem('user_id');
      let fcmToken = await messaging().getToken();
      console.log("fcm token은 "+fcmToken);

      if(userId === null){
        navigation.replace('Auth');
      }else{
        let admin = await requestUserAPI.checkAdmin(userId);
        let userData = await requestUserAPI.getUserData(userId);

        //로그인한 사용자가 Ban됐을때.
        if(userData.ban){

          let curDate = new Date();
          let banDate = new Date(userData.banDate)
          if(curDate<banDate || userData.banDate == null){
            Alert.alert("경고","차단된 사용자입니다.\n로그인 화면으로 돌아갑니다.",
                [{text:'네', style:'cancel',
                  onPress:()=>{
                    AsyncStorage.clear();
                    navigation.replace('Auth');
                  } }])
          }else{
            await requestReportAPI.setBanUser(userId, false, null);
            console.log("밴 풀림");
          }


        }

        if(admin === null){
          let autoUserData = await requestMemberAPI.autoLogin(userId,fcmToken);
          
          if(autoUserData.data.message){
            console.log('자동 로그인 성공!')
            navigation.replace('MainTab');
          } else{
            console.log("자동 로그인에 실패하였습니다.");
          }
          
        }else{
          let autoUserData = await requestMemberAPI.autoLogin(userId,fcmToken);
          if(autoUserData.data.message){
            console.log("Admin 로그인!");
            navigation.replace('AdminTab');
          } else{
            console.log("자동 로그인에 실패하였습니다.");
          }
          
        }

      }

      // AsyncStorage.getItem('user_id').then((value) =>{

      //       navigation.replace(
      //           value === null ? 'Auth' : 'MainTab'
      //       )}
      //       );
    }, 100);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../splash.png')}
        style={{width: wp(55), resizeMode: 'contain', margin: 30}}
      />
      <ActivityIndicator
        animating={animating}
        color="#6990F7"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});