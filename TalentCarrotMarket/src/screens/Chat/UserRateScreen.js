import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';


const UserRateScreen = ({navigate}) => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View>

                </View>
                <View>

                </View>
                <View>
                   <View>
                    <Text>남기고 싶은 칭찬을 선택해주세요</Text>
                   </View>
                   <View>
                    <Text>불편했던 점을 선택해주세요</Text>
                   </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
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
    btnCancel: {
      width: 200,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#EB3B30'
    },
    rowbtnArea:{
      flexDirection: "row",
      justifyContent: 'center',
      paddingTop:hp(5),
      paddingBottom:hp(3)
    },
    dateArea:{
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop:hp(5),
    },
    btnDate: {
      width: 500,
      height: 150,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#CDDDEF',
      borderWidth: 0.5,
      borderColor: 'gray',
    },
  });


  export default TradeTimerScreen;