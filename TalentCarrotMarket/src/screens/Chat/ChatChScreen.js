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
import {AnimatedAbsoluteButton} from 'react-native-animated-absolute-buttons';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function ChatChScreen({navigation}) {

  
  const buttons = [
    {
        color: '#4672B8',
        content:
        <View>
          <Text>  ⌚ 🗺️</Text>
          <Text>시간 장소</Text>
        </View>,
       action: () => {
        navigation.navigate('tradeset')
       }
    }
];
      return (
        <View style={styles.container}>
           <AnimatedAbsoluteButton
            buttonSize={100}
            buttonColor='gray'
            buttonShape='circular'
            buttonContent={<Text>거래 제안</Text>}
            direction='top'
            position='bottom-right'
            positionVerticalMargin={10}
            positionHorizontalMargin={10}
            time={500}
            easing='bounce'
            buttons={buttons}
        />
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
    },
    container: {
      flex: 1,
      height:400,
      },
  });
export default ChatChScreen;
