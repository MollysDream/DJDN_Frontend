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

const ReportScreen = ({navigation}) => {

    const [tab, setTab] = useState(0) // 0 -> 전체신고, 1 -> 게시물 신고, 2 -> 사용자 신고

    //인증한 동네 확인 - 사용자
    useEffect(() => {

    }, []);

    let Screen = null;
    if(tab==0)
        Screen = <Text>전체신고</Text>
    else if(tab==1)
        Screen = <Text>게시물 신고</Text>
    else
        Screen = <Text>사용자 신고</Text>

    return (
        <View style={styles.container}>

            <View style={styles.title}>
                <TouchableOpacity style={{width:'33%', alignItems:'center'}} onPress={()=>setTab(0)}>
                    <Text style={tab == 0 ? styles.text_on : styles.text_off}>
                        {`전체 신고`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width: '33%', alignItems:'center'}} onPress={()=>setTab(1)}>
                    <Text style={tab == 1 ? styles.text_on : styles.text_off}>
                        {`게시글 신고`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width: '33%', alignItems:'center'}} onPress={()=>setTab(2)}>
                    <Text style={tab == 2 ? styles.text_on : styles.text_off}>
                        {`사용자 신고`}
                    </Text>
                </TouchableOpacity>
            </View>

            <View>{Screen}</View>


        </View>


    );
}


const styles = StyleSheet.create({
    text_on:{
    fontSize:18,
        fontWeight: 'bold',
        color: '#ff5900'
},
text_off:{
    fontSize:18,
        fontWeight: 'bold',
        color: 'grey'
},
    title:{
        margin:10,
        flexDirection:'row'
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: wp(2),
        paddingRight: wp(2),
    },

});

export default ReportScreen;
