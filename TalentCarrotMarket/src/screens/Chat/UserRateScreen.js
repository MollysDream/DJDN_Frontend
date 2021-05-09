import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';


export default class UserRateScreen extends Component{
    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text>거래가 완료되었습니다!</Text>
             <Text>사용자 평가를 해보아요!</Text>
            </View>
        );
    }
}
