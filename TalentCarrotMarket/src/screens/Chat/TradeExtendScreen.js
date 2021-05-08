import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import NaverMapView, {Circle, Marker, Path, Polyline, Polygon, Align} from "react-native-nmap";
import DateTimePicker from '@react-native-community/datetimepicker';

const P0 = {latitude: 37.564362, longitude: 126.977011};

const TradeExtendScreen =({navigation})=>{

      const [startTime,setStartTime]=useState('');
      const [endTime,setEndTime]=useState('');
      const [workTime,setWorkTime]=useState('');
      const [locate,setLocate]=useState('');
      const [isSave,setSave]=useState(false);

      const [date, setDate] = useState(new Date(1598051730000));
      const [mode, setMode] = useState('date');
      const [show, setShow] = useState(false);

      const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'android');
        setDate(currentDate);
      };

      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };

      const showDatepicker = () => {
        showMode('date');
      };

      const showTimepicker = () => {
        showMode('time');
      };

      // 거래 시간 및 장소 제안
      const proposeTrade =
      <View>
        <NaverMapView 
          style={{flex: 0.7, width: '100%', height: '100%'}}
          showsMyLocationButton={true}
          center={{...P0, zoom:16}}
          onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
          onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
          onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}>
        </NaverMapView>
          
          
          <Text>장소를 선택하세요</Text>
          <TouchableOpacity><Text>제안하기</Text></TouchableOpacity>
        </View>
     

      // 거래 시간 및 장소 저장 후
      const saveTrade =
      <View>
        <NaverMapView 
          style={{flex: 0.7, width: '100%', height: '100%'}}
          showsMyLocationButton={true}
          center={{...location, zoom:16}}
          onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
          onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
          onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}>
        </NaverMapView>
          
        <View style={styles.bottomArea}>
          <Text>시작 시간</Text>
          <Text>끝나는 시간</Text>
          <Text>예상시간 : {workTime}</Text>
          <Text>선택된 장소</Text>
          <TouchableOpacity><Text>다시 제안하기</Text></TouchableOpacity>
        </View>
      </View>



      return (
        <View style={styles.container}>
        <View style={styles.topArea}>
            <Text style={{paddingBottom:10,paddingTop:10}}><B>거래 종료</B></Text>
        </View>

        {isSave == false ?(
          {proposeTrade}
        ): {saveTrade}}
    </View>
      );
    
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1
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
  });
export default TradeExtendScreen;