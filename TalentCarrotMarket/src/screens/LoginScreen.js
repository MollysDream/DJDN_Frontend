import React, {useState, createRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';
import Loader from './Loader';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

import { GoogleSignin,GoogleSigninButton } from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId: "802274360449-798tp4c3ph9955dng3cp9q50vlpansct.apps.googleusercontent.com",
  offlineAccess: true,
});

import AsyncStorage from '@react-native-community/async-storage';

const LoginScreen = ({navigation}) => {
  
  const preURL = require('../../preURL/preURL');
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();

  // const setUseridStorage = async (stu_id) => {
  //   try {
  //     await AsyncStorage.setItem('user_id', stu_id);
  //   } catch (e) {
  //     // read error
  //   }
  //   console.log('Done.');
  // };

  async function setUseridStorage(stu_id) {
    await AsyncStorage.setItem('user_id', stu_id);
    console.log('Done.');
  }

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userId) {
      alert('아이디를 입력해주세요');
      return;
    }
    if (!userPassword) {
      alert('비밀번호를 입력해주세요');
      return;
    }
    setLoading(true);
    let dataToSend = {stu_id: userId, stu_pw: userPassword};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    // console.log(formBody);

    fetch(preURL.preURL + '/api/user/login', {
      method: 'POST',
      body: formBody,
      headers: {
        //Header Defination
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        // console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          // const saveUserid = async () => {
          //   await AsyncStorage.setItem('user_id', responseJson.data.stu_id);
          //   console.log('done save user_id' + AsyncStorage.getItem('user_id'));
          // };
          // saveUserid();
          AsyncStorage.setItem('user_id', responseJson.data.stu_id);
          setLoading(false);
          navigation.replace('MainTab');
        } else {
          setErrortext('아이디와 비밀번호를 다시 확인해주세요');
          console.log('Please check your id or password');
        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };

    return (
      <View style={styles.container}>
        <View style={styles.topArea}>
          <View style={styles.titleArea}>
            <Image
              source={require('../login.png')}
              style={{width: wp(30), resizeMode: 'contain'}}
            />
          </View>
          <View style={styles.TextArea}>
            <Text style={styles.Text}>로그인하여 당신 주변 재능을 거래하는</Text>
            <Text style={styles.Text}>다재다능을 사용해보세요</Text>
          </View>
        </View>
  
         <View Style={styles.formArea}>
          <TextInput
            style={styles.textFormTop}
            placeholder={'아이디'}
            onChangeText={(userId) => setUserId(userId)}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() =>
              passwordInputRef.current && passwordInputRef.current.focus()
            }
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.textFormBottom}
            onChangeText={(userPassword) => setUserPassword(userPassword)}
            secureTextEntry={true}
            placeholder={'비밀번호'}
            returnKeyType="next"
            keyboardType="default"
            ref={passwordInputRef}
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
          />
          {errortext != '' ? (
            <Text style={styles.TextValidation}> {errortext}</Text>
          ) : null}
        </View>
  
        <View style={{flex: 0.75, paddingTop:30}}>
          <View style={styles.btnArea}>
            <TouchableOpacity style={styles.btn}>
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