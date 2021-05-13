import React, {useState} from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import { RadioButton } from 'react-native-paper';

import axios from "axios";

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const UserRateScreen = ({navigation}) => {

        const [value, setValue] = useState('')

        //평가 취소 버튼
        const cancelButton=()=>{
            navigation.navigate('chatch')
        }

        //사용자 평가 버튼
        const rateButton=()=>{

            const send_param={

            }
            axios
              .post("http://10.0.2.2:3000/trade/userRate", send_param)
            //정상 수행
              .then(returnData => {
                  if(returnData.data.message){
                  //async.getitem(userId)-value
                  //if(returnData.data.userId(1)==value --> returnData.data.userId(2)평가, 아니면 반대
                  alert('사용자 평가를 완료했습니다.')
                  navigation.navigate('chatch')
                  } else{
                  alert('사용자 평가를 실패하였습니다.')
                  }
                
              })
              //에러
              .catch(err => {
                console.log(err);
              });
            }


        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.topArea}>
                <View style={styles.rowArea}>
                  <Image
                    source={require('../../login.png')}
                    style={{width: wp(10), resizeMode: 'contain'}}
                  />
                  <Text style={{paddingRight:wp(3)}}>
                    사용자 이름
                  </Text>
                  <Text>
                    사용자 평가온도
                  </Text> 
                </View>
              </View>

              <View style={styles.bottomArea}>
                <View style={{paddingBottom:hp(3)}}>
                  <Text style={{paddingBottom:hp(3)}}><B>남기고 싶은 칭찬을 선택해주세요</B></Text>
                  <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                    <View style={styles.rowArea}>
                        <RadioButton value="first" />
                        <Text>친절하고 매너가 좋아요.</Text>
                        
                    </View>
                    <View style={styles.rowArea}>
                        <RadioButton value="second" />
                        <Text>시간 약속을 잘 지켜요.</Text>
                    </View>
                    <View style={styles.rowArea}>
                        <RadioButton value="third" />
                        <Text>응답이 빨라요.</Text>
                    </View>
                  </RadioButton.Group>
                      
                </View>

                <View style={{paddingBottom:hp(3)}}>
                  <Text style={{paddingBottom:hp(3)}}><B>불편했던 점을 선택해주세요</B></Text>

                  <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                    <View style={styles.rowArea}>
                        <RadioButton value="forth" />
                        <Text>불친절해요.</Text>
                    </View>
                    <View style={styles.rowArea}>
                        <RadioButton value="fifth" />
                        <Text>시간 약속을 안 지켜요.</Text>
                    </View>
                    <View style={styles.rowArea}>
                        <RadioButton value="sixth" />
                        <Text>응답이 느려요.</Text>
                    </View>
                  </RadioButton.Group>
                </View>

                <View style={styles.rowArea}> 
                    <View style={styles.btnArea,{paddingRight: wp('1')}}>
                        <TouchableOpacity style={styles.btn} onPress={cancelButton}>
                            <Text style={{color:'white'}}>취소하기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnArea,{paddingLeft: wp('1')}}>
                        <TouchableOpacity style={styles.btn} onPress={rateButton}>
                            <Text style={{color:'white'}}>평가하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>

            </View>
        );
}

const styles = StyleSheet.create({
    topArea: {
        flex: 0.125,
        paddingTop: wp(3),
        alignItems: 'center',
    },
    rowArea:{
        flexDirection: "row",
        justifyContent: 'center',
    },
    bottomArea: {
        flex: 0.65,
        paddingTop: wp(3),
        alignItems: 'center',
    },
    btnArea: {
        height: hp(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: 150,
        height: 50,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4672B8'
    },
  });


  export default UserRateScreen;