import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ChatChScreen =({navigation})=>{
      return (
        <View style={styles.btnArea2} >
        <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('chat')}>
          <Text style={(styles.Text, {color: 'white'})}>채팅</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('chatTest')}>
            <Text style={(styles.Text, {color: 'white'})}>채팅2</Text>
          </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1
    },    btn2: {
      flex: 1,
      width: 300,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
    },
  btnArea2: {
      height: hp(10),
      // backgroundColor: 'orange',
      paddingTop: hp(1.5),
      paddingBottom: hp(1.5),
      alignItems: 'center',
    },
    listDescription: {
      fontSize: 16
    }
  });
export default ChatChScreen;
