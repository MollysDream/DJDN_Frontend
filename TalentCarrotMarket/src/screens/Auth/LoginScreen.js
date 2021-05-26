import React, {useState, useEffect, createRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput, Alert,
} from 'react-native';

import { GoogleSignin,GoogleSigninButton,statusCodes } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
// import auth from "@react-native-firebase/auth";
import requestMemberAPI from "../../requestMemberAPI";
import requestUserAPI from "../../requestUserAPI";

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const LoginScreen = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errortext, setErrortext] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  // const [gettingLoginStatus, setGettingLoginStatus] = useState(true);
  const idInputRef = createRef();
  const passwordInputRef = createRef();
  
  //구글 로그인
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '537122353222-043ifccqh4l5itmeiom3rubaf7vdnvp4.apps.googleusercontent.com',
    });
    // _isSignedIn();
  }, []);

  // const _isSignedIn = async () => {
  //   const isSignedIn = await GoogleSignin.isSignedIn();
  //   if (isSignedIn) {
  //     navigation.replace('MainTab')
  //     AsyncStorage.setItem('user_id', 'googlelogin');
  //   } else {
  //     console.log('Please Login');
  //   }
  //   setGettingLoginStatus(false);
  // };


  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      setUserInfo(userInfo);
    } catch (error) {
      console.log('Message', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (
          error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
        alert('Play Services Not Available or Outdated');
      } else {
        alert(error.message);
      }
    }
  };


  //일반 로그인
  const handleLoginButton = async() => {
    setErrortext('');
    if (!userId) {
      alert('이메일 주소를 입력해주세요');
      return;
    }
    if (!userPassword) {
      alert('비밀번호를 입력해주세요');
      return;
    }

    try{
      //로그인
       const returnData = await requestMemberAPI.getLogin(userId,userPassword);

       if (returnData.data.message) {
          if (returnData.data.message && returnData.data.login === "1") {
            //console.log(returnData.data.message);
            let admin = await requestUserAPI.checkAdmin(returnData.data.userId);
            let userData = await requestUserAPI.getUserData(returnData.data.userId);

            if(userData.ban){
              let curDate = new Date();
              let banDate = new Date(userData.banDate)
              if(curDate<banDate){
                setErrortext(`${userData.banDate}까지 차단된 사용자입니다`);
                return;
              }

            }

            AsyncStorage.setItem('user_id', returnData.data.userId);

            if(admin === null){
              navigation.replace('MainTab');
            }else{
              console.log("Admin 로그인!");
              navigation.replace('AdminTab');
            }

        } else {
            setErrortext('아이디와 비밀번호를 다시 확인해주세요');
            console.log('Please check your id or password');
        }
       }
    } catch(err){
        console.log(err);
  }

  };

    return (
      <View style={styles.container}>
        <View style={styles.topArea}>
          <View style={styles.titleArea}>
            <Image
              source={require('../../login.png')}
              style={{width: wp(30), resizeMode: 'contain'}}
            />
          </View>
          <View style={styles.TextArea}>
            <Text style={[styles.Text,{paddingBottom:5}]}>로그인하여 당신 주변 재능을 거래하는</Text>
            <Text style={{paddingLeft:20}}><B>다재다능</B>을 사용해보세요.</Text>
          </View>
        </View>
  
         <View Style={styles.formArea}>
          <TextInput
            style={styles.textFormTop}
            placeholder={'아이디'}
            onChangeText={(userId) => setUserId(userId)}
            ref={idInputRef}
          />
          <TextInput
            style={styles.textFormBottom}
            onChangeText={(userPassword) => setUserPassword(userPassword)}
            secureTextEntry={true}
            placeholder={'비밀번호'}
            ref={passwordInputRef}
          />
          {errortext != '' ? (
            <Text style={styles.TextValidation}> {errortext}</Text>
          ) : null}
        </View>
  
        <View style={{flex: 0.75, paddingTop:30}}>
          <View style={styles.btnArea}>
            <TouchableOpacity style={styles.btn} onPress={handleLoginButton}>
              <Text style={(styles.Text, {color: 'white'})}>로그인</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowbtnArea}>
            <View style={styles.btnArea2} >
              <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('Register')}>
                <Text style={(styles.Text, {color: 'white'})}>회원가입</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnArea2} >
              <GoogleSigninButton
              style={{ width: 220, height: 50 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={_signIn}
              />
            </View>
          </View>
          
        </View>
        <View style={{flex: 3}}></View>
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
  topArea: {
    flex: 3,
    paddingTop: wp(2),
    alignItems: 'center',
  },
  titleArea: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom :30,
  },
  TextArea: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 15,
  },
  Text: {
    fontSize: wp('4%'),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    paddingTop: wp(2),
  },

  formArea: {
    justifyContent: 'center',
    paddingTop: wp(10),
    // paddingBottom: 30,
    flex: 1.5,
  },
  textFormTop: {
    borderWidth: 2,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  textFormBottom: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
  },
  btnArea: {
    height: hp(8),
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  rowbtnArea:{
    flexDirection: "row",
    justifyContent: 'center',
  },
  btnArea2: {
    height: hp(8),
    // backgroundColor: 'orange',
    paddingBottom: hp(1.5),
  },
  btn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  btn2: {
    flex: 1,
    width: 150,
    height: 50,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4672B8',
  },
});
export default LoginScreen;