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

const MypageScreen = ({navigation}) => {

    const [userId, setUserId]= useState('');
    const [userData, setUserData] = useState();

    const isFocused = useIsFocused();

    const handleLogoutButton = () => {
        AsyncStorage.clear();
        navigation.replace('Auth');
    };

    //인증한 동네 확인 - 사용자
    useEffect(() => {
        async function getUserData(){
            let userId = await AsyncStorage.getItem('user_id');

            //로그아웃 시 에러 방지
            if(userId == undefined)
                return;

            setUserId(userId);

            let userData = await requestUserAPI.getUserData(userId);
            setUserData(userData);


        }
        console.log("마이페이지 불러옴");

        let result = getUserData();
    }, [isFocused]);




    return (
        <View style={styles.container}>

            <View style={styles.profileBox}>

                {
                    userData==undefined ?null:
                        (
                            <View style={styles.user}>
                                <Image style={styles.profileImage} source={{uri:userData.profileImage}}/>
                                <Text style={{fontSize:17,marginTop:5, color:'#ff986f'}}>관리자</Text>
                                <Text style={styles.nickname}>{userData.nickname}</Text>
                            </View>

                        )

                }



            </View>


            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />




            <View style={styles.logoutArea}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutButton}>

                    <Text style={(styles.Text, {color: 'black'})}>로그아웃</Text>
                </TouchableOpacity>
            </View>


        </View>


    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: wp(7),
        paddingRight: wp(7),
    },
    user:{
        alignItems:'center'
    },
    profileBox:{
        alignItems: 'center',
        flexDirection:'column',
        paddingTop:10,
        marginBottom:10
    },
    profileImage:{
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#ff986f"
    },
    nickname:{
        fontSize: 27,
    },

    logoutArea: {
        height: hp(8),
        paddingRight: wp(2),
        paddingBottom: hp(1.5),
        position: "absolute", bottom: 0, right: 0
    },
    logoutButton: {
        flex: 1,
        width: 100,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffc6c6',
        flexDirection: "row",

    },

});

export default MypageScreen;
