import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image, FlatList
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
import requestReportAPI from "../../requestReportAPI";
import {getDate, getPrice} from "../../function";


const AllReportScreen = ({navigation}) => {

    const [reportData, setReportData] = useState([]);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        async function getReportData(){
            let data = await requestReportAPI.getAllReport();
            setReportData(data);
        }

        getReportData();
    }, []);


    const returnReportFlatListItem = (item,index)=>{
        let time = getDate(item.date);

        let reportUser = item.reportUser;
        let targetUser = item.targetUser;
        let targetPost = item.targetPost;
        let status = null
        let title = null
        let statusStyle = styles.status_none
        if(item.reportWhat === 0){
            status = '게시글 신고';
            statusStyle = styles.post_sign
            title = <Text style={styles.postTitle}>{targetPost.title}</Text>
        }
        else if(item.reportWhat ===1){
            status = '사용자 신고';
            statusStyle = styles.user_sign
            title = <Text style={styles.postTitle}>{targetUser.title}</Text>

        }

        return(
            <View style={{marginBottom:10}}>
                <TouchableOpacity>
                    <View style={styles.post}>
                        <Image style={styles.profileImage} source={{ uri: targetUser.profileImage}} />
                        <View style={{flexDirection:'column'}}>
                            <View style={{flexDirection:'row'}}>
                                <View style={statusStyle}>
                                    <Text>{status}</Text>
                                </View>
                            </View>

                            <View style={{flexDirection:'row'}}>
                                {title}
                            </View>

                            <View style={{flexDirection:'row'}}>

                                <Text style={styles.postAddressTime}>{`${time}`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{height:'90%'}}>

            <FlatList
                data={reportData}
                keyExtractor={(item,index) => String(item._id)}
                renderItem={({item,index})=>returnReportFlatListItem(item,index)}
            />


        </View>


    );
}


const styles = StyleSheet.create({
    post:{
        flexDirection: "row",
        borderRadius: 15,
        backgroundColor: "white",
        borderBottomColor: "#a6e5ff",
        borderBottomWidth: 1,
        padding: 10,
        height: 136
    },
    postTitle:{fontSize:18, fontWeight: "bold", width:230, height:80, paddingTop:9},
    postAddressTime: {fontSize:13, textAlign:'right', width:'30%', marginRight:3},
    postPrice: {width:'50%',fontSize:17 , color:"#0088ff" ,paddingTop: 9},
    profileImage:{
        width: wp(20),
        overflow:"hidden",
        height: hp(20),
        aspectRatio: 1,
        borderRadius: 50,
        marginRight:12,
        borderWidth:2,
        borderColor:'orange',
    },
    post_sign:{
        backgroundColor:'#ffbda6',
        padding: 3,
        borderRadius: 7
    },
    user_sign:{
        backgroundColor:'#ffaeae',
        padding: 3,
        borderRadius: 7
    },
    status_none:{
        position: 'absolute'
    },
});

export default AllReportScreen;
