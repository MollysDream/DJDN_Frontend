import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet, Image
} from 'react-native';


export default class HomeScreen extends Component{
    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text>Talent!</Text>
                <Image source={{uri:'https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/KakaoTalk_20210326_202400941_03.png'}}/>
            </View>
        );
    }
}
