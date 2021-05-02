import React, {useState} from 'react';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';

import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';


const RegisterScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordchk, setUserPasswordchk] = useState('');
  const [errortext2, setErrortext2] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  // const idInputRef = createRef();
  // const passwordInputRef = createRef();
  // const passwordchkInputRef = createRef();
  // const nameInputRef = createRef();
  // const nicknameInputRef = createRef();

  const handleSubmitButton = () => {
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const regExp2 = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

    if (!userName) {
      alert('이름을 입력해주세요');
      return;
    }
    if (!userId) {
      alert('id를 입력해주세요');
      return;
    }
    if(userId.match(regExp) === null || userId.match(regExp) === undefined){
      alert("이메일 형식에 맞게 입력해주세요.");
    }
    if (!userNickName) {
      alert('닉네임을 선택해주세요');
      return;
    }

    if (!userPassword) {
      alert('비밀번호를 입력해주세요');
      return;
    }
    if (userPassword.match(regExp2) === null || userPassword.match(regExp2) === undefined){
      alert("비밀번호를 숫자와 문자, 특수문자 포함 8~16자리로 입력해주세요.");
      return;
    }
    if (userPasswordchk != userPassword) {
      alert('비밀번호가 일치하지 않습니다');
      return;
    }

    const send_param = {
      email: userId,
      password: userPassword,
      name: userName,
      nickname: userNickName
    };
    axios
      .post("http://10.0.2.2:3000/member/join", send_param)
      //정상 수행
      .then(returnData => {
        setErrortext2('');
        if (returnData.data.message) {
          alert(returnData.data.message);
          //이메일 중복 체크
          if (returnData.data.dupYn === "1") {
            setErrortext2('이미 존재하는 아이디입니다.');
          } else {
            setIsRegistraionSuccess(true);
            console.log('Registration Successful. Please Login to proceed');
          }
        } else {
          alert("회원가입 실패");
        }
      })
      //에러
      .catch(err => {
        console.log(err);
      });
  };

  if (isRegistraionSuccess) {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={{flex: 2}}>
          <View
            style={{
              height: hp(13),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../check.png')}
              style={{
                height: wp(20),
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
            />
          </View>
          <View
            style={{
              height: hp(7),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', fontSize: wp('4%')}}>
              회원가입이 완료되었습니다.
            </Text>
          </View>

          <View style={{height: hp(20), justifyContent: 'center'}}>
            <View style={styles.btnArea}>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('Login')}>
                <Text style={{color: 'white', fontSize: wp('4%')}}>
                  로그인하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.titleArea}>
          <Image
            source={require('../../login.png')}
            style={{width: wp(40), resizeMode: 'contain'}}
          />
        </View>
        <View style={styles.TextArea}>
          <Text style={styles.Text}>회원가입하여 당신 주변 재능을 거래하는</Text>
          <Text style={styles.Text}>다재다능을 사용해보세요 ‍</Text>
        </View>
      </View>

      <View Style={styles.formArea}>
        <TextInput
          style={styles.textFormTop}
          placeholder={'이메일'}
          onChangeText={(userId) => setUserId(userId)}
        />
        <TextInput
          style={styles.textFormMiddle}
          secureTextEntry={true}
          placeholder={'비밀번호(8자 이상)'}
          onChangeText={(UserPassword) => setUserPassword(UserPassword)}
        />
        <TextInput
          style={styles.textFormBottom}
          secureTextEntry={true}
          placeholder={'비밀번호 확인'}
          onChangeText={(UserPasswordchk) =>
            setUserPasswordchk(UserPasswordchk)
          }
        />
      </View>

      <View style={{paddingBottom: 20, justifyContent: 'center'}}>
        {userPassword !== userPasswordchk ? (
          <Text style={styles.TextValidation}>
            비밀번호가 일치하지 않습니다.
          </Text>
        ) : null}
      </View>

      <View Style={styles.formArea2}>
        <TextInput
          style={styles.textFormTop}
          placeholder={'이름을 입력해주세요'}
          onChangeText={(UserName) => setUserName(UserName)}
        />
        <TextInput
          style={styles.textFormBottom}
          onChangeText={(userNickName) => setUserNickName(userNickName)}
          placeholder={'닉네임을 입력해주세요'}
        />
      </View>

      <View style={{paddingBottom: 20, justifyContent: 'center'}}>
        {errortext2 !== '' ? (
          <Text style={styles.TextValidation}>{errortext2}</Text>
        ) : null}
      </View>

      <View style={{flex: 0.75}}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btn} onPress={handleSubmitButton}>
            <Text style={{color: 'white', fontSize: wp('4%')}}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 3}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },
  topArea: {
    flex: 5,
    paddingTop: wp(2),
    alignItems: 'center',
  },
  titleArea: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom :40,
  },
  TextArea: {
    flex: 1,
    paddingTop:15,
    paddingBottom :25,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  Text: {
    fontSize: wp(4),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    // paddingTop: wp(5),
  },

  formArea: {
    flex: 4.5,
    justifyContent: 'center',
    // paddingTop: 10,
    // backgroundColor: 'red',
    marginBottom: hp(-5),
  },

  formArea2: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    marginBottom: hp(-2),
    // alignSelf: 'stretch',
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
  textFormMiddle: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'black',
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
});

export default RegisterScreen;