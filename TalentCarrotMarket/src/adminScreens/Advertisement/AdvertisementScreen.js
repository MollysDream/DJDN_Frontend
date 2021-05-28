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

import ModifyApproveScreen from "./ModifyApproveScreen";
import AdverStatusScreen from "./AdverStatusScreen";

const AdvertisementScreen = ({navigation}) => {

    const [tab, setTab] = useState(0) // 0 -> 요청대기 광고, 1 -> 현재 광고 현황


    let Screen = null;
    if(tab==0)
        Screen = <AdverStatusScreen data={false}/>
    else if(tab==1)
        Screen = <AdverStatusScreen data={true}/>

    return (
        <View style={styles.container}>

            <View style={styles.title}>
                <TouchableOpacity style={{width:'50%', alignItems:'center'}} onPress={()=>setTab(0)}>
                    <Text style={tab == 0 ? styles.text_on : styles.text_off}>
                        {`요청대기 광고`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width: '50%', alignItems:'center'}} onPress={()=>setTab(1)}>
                    <Text style={tab == 1 ? styles.text_on : styles.text_off}>
                        {`승인된 광고 현황`}
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
        color: '#8636ff',
        borderBottomWidth: 2,
        borderColor: '#8636ff'
    },
    text_off:{
        fontSize:18,
        fontWeight: 'bold',
        color: 'grey'
    },
    title:{
        margin:10,
        flexDirection:'row',
        borderBottomWidth:5,
        borderColor:'#ddc4ff',
        paddingBottom:5
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: wp(2),
        paddingRight: wp(2),
    },

});

export default AdvertisementScreen;
