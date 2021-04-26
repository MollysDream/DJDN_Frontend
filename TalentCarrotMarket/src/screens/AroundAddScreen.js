import React, {useState,useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const AroundAddScreen = () => {

    const [location,setLocation]= useState({
        locations:[
          {latitude:null,longitude:null}
        ]
      });
    const [aroundAddress,setAroundAddress]= useState('');

    const addAddressButton = () => {
      setAroundAddress('existAround');   
    };


    return (
        <View style={styles.container}>   
          <View style={styles.btnArea}>
            <TouchableOpacity style={styles.btnAround} onPress={addAddressButton}>
              <Text style={(styles.Text, {color: 'white'})}>현재 위치로 찾기</Text>
              {aroundAddress != '' ? (
              <Text style={styles.TextValidation}> {aroundAddress}</Text>
              ) : null}
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
    btnArea: {
      height: hp(8),
      // backgroundColor: 'orange',
      paddingTop: hp(1.5),
      paddingBottom: hp(1.5),
      flexDirection: "row",
      // justifyContent: 'center',
    },
    btnAround: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
    },
    Text: {
      fontSize: wp('4%'),
    },
    TextValidation: {
      fontSize: wp('4%'),
      color: 'red',
      paddingTop: wp(2),
    },
  
  });

export default AroundAddScreen;