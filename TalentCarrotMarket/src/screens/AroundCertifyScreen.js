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

import NaverMapView, {Circle, Marker, Path, Polyline, Polygon, Align} from "react-native-nmap";
import Geolocation from 'react-native-geolocation-service';

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const P0 = {latitude: 37.564362, longitude: 126.977011};

const AroundCertifyScreen = () => {
    const [errortext, setErrortext] = useState('');
    const [location,setLocation]= useState({
        locations:[
          {latitude:null,longitude:null}
        ]
      });
    const [address,setAddress]= useState('');

    useEffect(() =>{
        Geolocation.getCurrentPosition(
        position =>{
            const {latitude,longitude}=position.coords;
            setLocation({
              latitude,
              longitude
            });
          },
          error => {console.log(error.code,error.message)},
          { enableHighAccuracy:true, timeout: 20000, maximumAge:1000},
        );
      },[]);

    const changeAroundButton = () =>{
        setAddress()
    }

    return (
        <View style={styles.container}>
              <NaverMapView style={{flex: 0.5, width: '100%', height: '100%'}}
              showsMyLocationButton={true}
              center={{...location, zoom:16}}
              onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
              onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
              onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}>
              </NaverMapView>

            {errortext != '' ? (
            <View>
              <Text style={styles.textValidation}> {errortext}</Text>
              <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnAround} onPress={changeAroundButton}>
                  <Text style={(styles.Text, {color: 'black'})}>현재 위치로 동네 변경하기</Text>
                </TouchableOpacity>
              </View>
            </View>
            ) : 
            <View>
              <Text style={styles.textValidationTrue}>현재 위치가 내 동네로 설정한 <B>{address}</B>에 있습니다.</Text>
                <View style={styles.btnArea}>
                  <TouchableOpacity style={styles.btnAround} onPress={changeAroundButton}>
                    <Text style={(styles.Text, {color: 'white'})}>동네 인증 완료하기</Text>
                  </TouchableOpacity>
                </View>
            </View>
          
              }

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
    btnArea:{
      flex:0.12,
      flexDirection: "row",
      justifyContent: 'center',
    },
    btnCertify: {
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
    btnChangeAround: {
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
    Text: {
      fontSize: wp('4%'),
    },
    textValidation: {
      fontSize: wp('4%'),
      color: 'red',
      paddingTop: wp(2),
    },
    textValidationTrue: {
      fontSize: wp('4%'),
      paddingTop: wp(2),
    },
  
  });

export default AroundCertifyScreen;