import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

import AsyncStorage from '@react-native-community/async-storage';



const MypageScreen = ({navigation}) => {
    
    const handleLogoutButton = () => {
        AsyncStorage.clear();
        navigation.replace('Auth');
        
    };
 
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.btnArea2} >
                <TouchableOpacity style={styles.btn2} onPress={handleLogoutButton}>
                    <Text style={(styles.Text, {color: 'white'})}>로그아웃</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
 }


const styles = StyleSheet.create({
    btnArea2: {
      height: hp(8),
      // backgroundColor: 'orange',
      paddingBottom: hp(1.5),
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

  export default MypageScreen;