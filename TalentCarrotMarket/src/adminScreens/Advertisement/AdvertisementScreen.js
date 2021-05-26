import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-community/async-storage';
import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";
import {useIsFocused} from "@react-navigation/native";

const AdvertisementScreen = ({navigation}) => {

    //인증한 동네 확인 - 사용자
    useEffect(() => {

    }, []);


    return (
        <View style={styles.btnArea1} >
    
           <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('adverrequest')}>
                <Text style={(styles.Text, {color: 'white'})}>요청중인 광고</Text>
            </TouchableOpacity>
    
    
            <TouchableOpacity style={styles.btn2} onPress={() =>navigation.navigate('adverstatus')}>
                <Text style={(styles.Text, {color: 'white'})}>현재 광고 현황</Text>
            </TouchableOpacity>
      

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
    btn1: {
        width: 45,
        height: 40,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffefef',
        paddingBottom : hp(1.5)
    },
    btnArea1: {
        flex:0.5,
        alignItems: 'flex-end',
        paddingRight:50,
        justifyContent : 'space-around'
    },
    btn2: {
        width: 300,
        height: 50,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#38b9ff',
        
      },
    btnArea2: {
        height: hp(10),
        // backgroundColor: 'orange',
        paddingTop: hp(1.5),
        paddingBottom: hp(1.5),
        alignItems: 'center',
      },

});

export default AdvertisementScreen;
