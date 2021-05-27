import React, {Component, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Button,
    RefreshControl,
    TouchableHighlight, Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import requestAdverAPI from "../../requestAdverAPI";

const ActivationScreen = ({navigation}) => {

    return(
      
            <View>
                <Text> 활성화</Text>
            </View>
        
    )
}


export default ActivationScreen;
