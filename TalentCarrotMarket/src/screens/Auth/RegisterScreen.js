import React, {useState} from 'react';

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
  TextInput,
} from 'react-native';

import requestMemberAPI from "../../requestMemberAPI";
import requestPointAPI from "../../requestPointAPI";

const RegisterScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userNickName, setUserNickName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userNumber, setUserNumber] = useState('');
  const [userPasswordchk, setUserPasswordchk] = useState('');
  const [errortext2, setErrortext2] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const [isClick, setIsClick] = useState(false);

  // const idInputRef = createRef();
  // const passwordInputRef = createRef();
  // const passwordchkInputRef = createRef();
  // const nameInputRef = createRef();
  // const nicknameInputRef = createRef();

  const handleSubmitButton = async () => {
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

     try{
        //회원 가입
          const returnData = await requestMemberAPI.getRegister(userId,userPassword,userName,userNickName);
          console.log(userId);
          await requestPointAPI.createPoint(userId); //email
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

        } catch(err){
            console.log(err);
      }

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

  async function sendSMS(){

    console.log("신고된 주소 "+proLocate);
    console.log("확인 accesskey: "+smsKey.accessKey);
    console.log("확인 secretkey: "+smsKey.secretKey);
    console.log("확인 serviceId: "+smsKey.serviceId);
    console.log("확인 phoneNumber: "+smsKey.phoneNumber);
    console.log("확인 timestamp: "+Date.now() + " 타입 : " + typeof Date.now().toString());

    const body = {
      "type": 'SMS',
      "contentType": 'COMM',
      "countryCode": '82',
      "from": smsKey.phoneNumber, // 발신자 번호, 바꾸지 X
      "content": `${proLocate} 주소에서 신고가 들어왔습니다.`,
      "messages": [
        {
          "to": '01075301550', // 수신자 번호
          "content":`${proLocate} 주소에서 신고가 들어왔습니다.`
        },
      ],
    };

    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': Date.now().toString(),
        'x-ncp-iam-access-key': smsKey.accessKey,
        'x-ncp-apigw-signature-v2': makeSignature(),
      },
    };


    axios
      .post(`https://sens.apigw.ntruss.com/sms/v2/services/${encodeURIComponent(smsKey.serviceId)}/messages`, body, options)
      .then(async (res) => {
        // 성공 이벤트
        alert('거래 종료를 누르지 않아 자동으로 신고가 됩니다.')
        console.log(res);
      })
      .catch((err) => {
        console.error(err.response.data);
      });

      setIsClick(true);

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

      <View Style={styles.formArea3}>
        <TextInput
          style={styles.textFormAll}
          placeholder={'전화번호를 입력해주세요'}
          onChangeText={(UserName) => setUserName(UserName)}
        />
        {isClick?(
          <TouchableOpacity style={styles.btn} onPress={handleSubmitButton}>
            <Text style={{color: 'white', fontSize: wp('4%')}}>인증번호 보내기</Text>
          </TouchableOpacity>):
          <TouchableOpacity style={styles.btn} onPress={handleSubmitButton}>
            <Text style={{color: 'white', fontSize: wp('4%')}}>인증번호 확인</Text>
          </TouchableOpacity>
        }
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

function makeSignature(){
  var space = " ";				// one space
  var newLine = "\n";				// new line
  var method = "POST";				// method
  var url = `/sms/v2/services/${encodeURIComponent(smsKey.serviceId)}/messages`;	// url (include query string)
  var timestamp = Date.now().toString();			// current timestamp (epoch)
  var accessKey = smsKey.accessKey;			// access key id (from portal or Sub Account)
  var secretKey = smsKey.secretKey;			// secret key (from portal or Sub Account)

  var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(accessKey);

  var hash = hmac.finalize();
  var result = Base64.stringify(hash);

  console.log(result + " 타입 : " + typeof(result))

  return result;
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
    flex: 3.5,
    justifyContent: 'center',
    // paddingTop: 10,
    // backgroundColor: 'red',
    marginBottom: hp(-5),
  },

  formArea2: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    marginBottom: hp(-2),
    // alignSelf: 'stretch',
  },

  formArea3: {
    flex: 1,
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
    color:'black'
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
    color:'black'

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
    color:'black'
  },
  textFormAll: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
    color:'black'
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
  btnSNS: {

  }
});

export default RegisterScreen;
