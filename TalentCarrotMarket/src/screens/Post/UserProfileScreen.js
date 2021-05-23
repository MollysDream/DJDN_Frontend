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

const UserProfileScreen = ({navigation,route}) => {

    //이 스크린에서의 user는 postOwner이다.
    const [userId, setUserId]= useState(route.params.postOwnerData._id);
    const [userData, setUserData] = useState(route.params.postOwnerData);
    const [userAddress, setUserAddress] = useState([]);

    const[dataFlag,setDataFlag]=useState(false);

    useEffect(() => {
        async function getUserData(){

            let userAddressDataList = await requestAddressAPI.getUserAddress(userId);
            setUserAddress(userAddressDataList);

            let addressList=[]
            userAddressDataList.address.map((address)=>{
                addressList.push(address);
            })
            if(addressList.length==2){
                if(addressList[0].addressName == addressList[1].addressName) //중복되는 인증된 동네가 있을 경우 하나로 표시
                    setUserAddress([addressList[0]]);
                else
                    setUserAddress(addressList);
            }
            else
                setUserAddress(addressList);

            setDataFlag(true);
        }

        console.log("사용자 프로필 불러옴");
        let result = getUserData();
    }, []);


    const checkPost = ()=>{
        console.log('사용자의 게시글 확인')
    }
    const checkCertification = ()=>{
        console.log('사용자의 자격 확인');
    }

    if(dataFlag==false)
        return(<Text>Loading...</Text>)
    return (
        <View style={styles.container}>

            <View style={styles.profileBox}>

                <View style={styles.user}>
                    <Image style={styles.profileImage} source={{uri:userData.profileImage}}/>
                    {
                        userAddress.length==1?
                            <Text style={{marginTop:5, color:'grey'}}>{`${userAddress[0].addressName}의`}</Text>
                            :
                            <Text style={{marginTop:5, color:'grey'}}>{`${userAddress[0].addressName}/${userAddress[1].addressName}의`}</Text>
                    }
                    <Text style={styles.nickname}>{userData.nickname}</Text>
                </View>

            </View>



            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />

            <View style={styles.tradeBox}>

                <TouchableOpacity style={styles.buttonList} >
                    <Icon style={styles.iconPlace} name="hand-holding-usd"  size={40} color="#37CEFF" />
                    <Text style={styles.buttonText}>재능구매 내역</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonList} >
                    <Icon2 style={[styles.iconPlace, {marginTop:3}]} name="certificate"  size={46} color="#37CEFF" />
                    <Text style={styles.buttonText}>자격증 증명</Text>
                </TouchableOpacity>


            </View>


        </View>


    );
}


const styles = StyleSheet.create({

    /// 자격 내역 모달

    /// 재능구매 내역 모달

    /// 메인 화면
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
        borderColor: "#6fceff"
    },
    nickname:{
        fontSize: 27,
    },
    tradeBox: {
        //borderWidth: 1,
        flexDirection:'column',
        marginTop:7

    },
    buttonList: {
        //borderWidth:1,
        height:55,
        flexDirection:'row',
        backgroundColor: '#ecfeff',
        borderRadius: 20,
        marginBottom:7,
    },
    iconPlace: {
        height:'100%',
        marginLeft:10,
        paddingTop: 5

    },
    buttonText:{
        fontSize: 20,
        color:'black',
        height:'100%',
        paddingTop:13,
        //borderWidth:1,
        marginLeft: 13
    }

});

export default UserProfileScreen;
