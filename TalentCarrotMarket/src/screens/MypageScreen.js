import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';


export default class MypageScreen extends Component{
    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text>My Page!</Text>
            </View>
        );
    }
}
