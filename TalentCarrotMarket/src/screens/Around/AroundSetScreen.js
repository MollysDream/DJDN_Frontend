import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

import SwitchSelector from "react-native-switch-selector";
import axios from 'axios';

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const AroundSetScreen = ({navigation}) => {

    const options = [
      {label:"10", value: "10"},
      {label:"20", value: "20"},
      {label:"30", value: "30"}
    ];

    const [address1,setAddress1]= useState('우만2동');
    const [address2,setAddress2]= useState('');
    const [aroundAddress,setAroundAddress]= useState(10);
    const [chooseState1,setChooseState1] = useState('choose');
    const [chooseState2,setChooseState2] = useState('');

    //설정된 동네 삭제
    const addressOneDeleteButton = () => {
      setAddress1('');
    };

    const addressTwoDeleteButton = () => {
      setAddress2('');   
    };


    //내 동네 설정 추가
    const addressOneAddButton = () => {
      navigation.navigate('aroundAdd')
    };

    const addressTwoAddButton = () => {
      navigation.navigate('addressAdd')      
    };

    //동네 선택
    const chooseAddressOneButton = (value) => {
      setChooseState1('choose')
      setChooseState2('')
      navigation.navigate('aroundCertify',{
        chosenAddress:address1
      })
    }

    const chooseAddressTwoButton = (value) => {
      setChooseState1('')
      setChooseState2('choose')
      navigation.navigate('aroundCertify',{
        chosenAddress:address2
      })
    }

    //근처 동네 갯수 설정
    const aroundAddressButton = (value) => {
      setAroundAddress(value)
    }


    return (
        <View style={styles.container}>
            <View style={styles.topArea}>
                <Text style={{paddingBottom:10,paddingTop:10}}><B>동네 선택</B></Text>
                <Text style={{paddingBottom:25}}>지역은 최소 1개 이상 최대 2개까지 설정 가능해요.</Text>
            </View>

            <View style={styles.btnArea}>
              {address1 !=''?(
                    <View style={styles.btnArea2}>
                      {chooseState1 !=''?(
                      <TouchableOpacity onPress={chooseAddressOneButton} style={styles.btnAroundChoose}>
                        <Text style={(styles.Text, {color: 'white'})}>{address1}</Text>
                      
                        <TouchableOpacity onPress={addressOneDeleteButton} style={styles.btn}>
                          <Text style={{paddingLeft:20}}>❌</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>

                      ):<TouchableOpacity onPress={chooseAddressOneButton} style={styles.btnAround}>
                      <Text style={(styles.Text, {color: 'black'})}>{address1}</Text>
                    
                      <TouchableOpacity onPress={addressOneDeleteButton} style={styles.btn}>
                        <Text style={{paddingLeft:20}}>❌</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                      }
                    </View>
                    
                  ):
                  <View style={styles.btnArea2}>
                    <TouchableOpacity style={styles.btnNoAround} onPress={addressOneAddButton}>
                          <Text style={{
                            color: 'gray',
                            textAlign: 'center',
                            marginBottom: 6,
                            fontSize: 15,
                          }}>➕</Text>
                      </TouchableOpacity>
                    </View>}

              {address2 !=''?(
                
                  <View style={styles.btnArea2}>
                  {chooseState2 !=''?(
                  <TouchableOpacity onPress={chooseAddressTwoButton} style={styles.btnAroundChoose}>
                    <Text style={(styles.Text, {color: 'white'})}>{address2}</Text>
                    <TouchableOpacity onPress={addressTwoDeleteButton} style={styles.btn}>
                      <Text style={{paddingLeft:20}}>❌</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>

                  ):<TouchableOpacity onPress={chooseAddressTwoButton} style={styles.btnAround}>
                  <Text style={(styles.Text, {color: 'black'})}>{address2}</Text>
                  <TouchableOpacity onPress={addressTwoDeleteButton} style={styles.btn}>
                    <Text style={{paddingLeft:20}}>❌</Text>
                  </TouchableOpacity>
                </TouchableOpacity>}
                </View>
                
              ):
              <View style={styles.btnArea2}>
                <TouchableOpacity style={styles.btnNoAround} onPress={addressTwoAddButton}>
                    <Text style={{
                      color: 'gray',
                      textAlign: 'center',
                      marginBottom: 6,
                      fontSize: 15,
                    }}>➕</Text>
                </TouchableOpacity>
              </View>}
            </View>

            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              />
              
            <View style={styles.bottomArea}>
              <Text style={{paddingBottom:10,paddingTop:10}}><B>{address1} 근처동네 {aroundAddress}개</B></Text>
              <Text style={{paddingBottom:25}}>선택한 범위의 게시글만 볼 수 있어요.</Text> 
              <SwitchSelector 
              options={options} 
              initial={0}
              onPress={aroundAddressButton}
              textColor={'#7a44cf'}
              selectedColor={'white'}
              buttonColor={'#7a44cf'}
              borderColor={'#7a44cf'}
              hasPadding
              />      
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
    Text: {
      fontSize: wp('4%'),
    },
    topArea: {
      flex: 0.15,
      paddingTop: wp(3),
      alignItems: 'center',
    },
    bottomArea: {
      flex: 0.15,
      paddingTop: wp(3),
      alignItems: 'center',
    },
    btnArea:{
      flex:0.12,
      flexDirection: "row",
      justifyContent: 'center',
    },
    btnArea2: {
      height: hp(8),
      // backgroundColor: 'orange',
      paddingBottom: hp(1.5),
      paddingRight:15
      
    },
    btnNoAround: {
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'gray',
      },
    btnAround: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      flexDirection: "row",
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: 'gray',
    },
    btnAroundChoose: {
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

export default AroundSetScreen;