import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';


const AroundScreen = ({navigation}) => {

    return (
        <View style={{flex: 0.75, paddingTop:30}}>
            <View style={styles.btnArea}>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('aroundSet')}>
                <Text style={(styles.Text, {color: 'white'})}>내 동네 설정</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.btnArea}>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('aroundCertify')}>
                <Text style={(styles.Text, {color: 'white'})}>동네 인증하기</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
}
export default AroundScreen;