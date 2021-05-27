import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import NaverMapView, {Circle, Marker, Path, Polyline, Polygon, Align} from "react-native-nmap";
import Geolocation from 'react-native-geolocation-service';

const P0 = {latitude: 37.564362, longitude: 126.977011};

const AroundScreen = ({navigation}) => {

    /*const [location,setLocation]= useState({
      locations:[
        {latitude:null,longitude:null}
      ]
    });
    
    // 실제 안드로이드 폰에서 되는지 확인 필요
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
    },[]);*/

    /*const certifyButton = () =>{
      const send_param = {
          currentX: location.longitude,
          currentY: location.latitude
        }
      axios
      .post("http://:3000/address/currentLocation", send_param)
        //정상 수행
        .then(returnData => {
          navigation.navigate('aroundCertify',{
            chosenAddress:returnData.data.address
          })
        })
        //에러
        .catch(err => {
          console.log(err);
        });

    }*/
    
    return (

      // //위도 경도 확인
      // <View style={{flex:1, alignItems:'center', justifyContent: 'center'}}>
      //   <Text>Latitude : {location.latitude}</Text>
      //   <Text>Longitude: {location.longitude}</Text>
      // </View>

      <View style={styles.container}>
          {/*<NaverMapView
          style={{flex: 0.7, width: '100%', height: '100%'}}
          showsMyLocationButton={true}
          center={{...P0, zoom:16}}
          onTouch={e => console.log('onTouch', JSON.stringify(e.nativeEvent))}
          onCameraChange={e => console.log('onCameraChange', JSON.stringify(e))}
          onMapClick={e => console.log('onMapClick', JSON.stringify(e))}>
          </NaverMapView>*/}
          <View style={styles.btnArea2} >
            <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('aroundSet')}>
              <Text style={(styles.Text, {color: 'white'})}>내 동네 설정</Text>
            </TouchableOpacity>
          </View>
          {/*<View style={styles.btnArea2} >
            <TouchableOpacity style={styles.btn2} onPress={certifyButton}>
              <Text style={(styles.Text, {color: 'white'})}>동네 인증하기</Text>
            </TouchableOpacity>
        </View>*/}
      </View>
      

    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },
  btnArea2: {
    height: hp(10),
    paddingTop: hp(1.5),
    paddingBottom: hp(1.5),
    alignItems: 'center',
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
export default AroundScreen;
