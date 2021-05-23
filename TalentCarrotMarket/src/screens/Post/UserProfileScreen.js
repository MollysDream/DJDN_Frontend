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

import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-community/async-storage';
import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";
import {useIsFocused} from "@react-navigation/native";
import Icon3 from "react-native-vector-icons/Entypo";

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

    const[certificateData, setCertificateData]=useState([]);
    const[certificateModal, setCertificateModal]=useState(false);

    const[detailCertificateModal, setDetailCertificateModal]=useState(false);
    const [selectedData ,setSelectedData]= useState({
        _id:'',
        title:'',
        text:'',
        certificateImage:''
    });

    const checkCertification = async()=>{
        let certificate = await requestUserAPI.getUserCertificate(userId);
        console.log(certificate);
        setCertificateData(certificateData.concat(certificate));

        setCertificateModal(!certificateModal);
        console.log('사용자의 자격 확인');
    }

    const seeDetail=(item)=>{
        setSelectedData(item);
        setDetailCertificateModal(!detailCertificateModal);
    }

    const returnFlatListItem = (item,index)=>{
        return(
            <TouchableOpacity style={styles.dataBox} onPress={()=>seeDetail(item)}>
                <View style={{width:'95%', height:'95%'}}>
                    <Image style={styles.dataImage} source={{ uri: item.certificateImage}} />
                    <View style={{alignItems:'center'}}>
                        <Text style={{fontSize:20, fontWeight:'bold'}}>{item.title}</Text>
                        <View
                            style={{
                                borderBottomColor: '#ace9ff',
                                borderBottomWidth: 1,
                                width:'90%'
                            }}
                        />
                        <Text style={{height:40}}>{item.text}</Text>

                    </View>
                </View>
                <Icon style={{position:'absolute',left:-5, top:-5}} name="certificate" size={35} color="#ABC6FF" />

            </TouchableOpacity>
        );
    }


    if(dataFlag==false)
        return(<Text>Loading...</Text>)
    return (
        <View style={styles.container}>

            {/*자격 확인*/}
            <Modal isVisible={certificateModal} KeyboardAvoidingView ={false}>
                <View style={styles.certificateBox}>

                    <FlatList
                        numColumns={2}
                        data={certificateData}
                        keyExtractor={(item,index) => String(item._id)}
                        renderItem={({item,index})=>returnFlatListItem(item,index)}
                    />

                </View>
                <TouchableOpacity style={styles.cancleIcon} onPress={()=>{
                    setCertificateModal(!certificateModal)
                    setCertificateData([])
                }}>
                    <Icon3 name="circle-with-cross"  size={35} color="#39BFFF" />
                </TouchableOpacity>

                {/*자격 상세 확인*/}
                <Modal isVisible={detailCertificateModal} KeyboardAvoidingView ={false}>
                    <TouchableOpacity style={[styles.addModalBox, {backgroundColor:'#ecfbff'}]} onPress={()=>setDetailCertificateModal(!detailCertificateModal)}>
                        <View style={[styles.imageBox]}>
                            <Image style={[styles.blankImage,{width:'100%', height:450}]} source={{uri:selectedData.certificateImage}}/>
                        </View>

                        <View style={{margin:9,flexDirection:'column', alignItems:'center'}}>
                            <Text style={[styles.titleBox, {paddingLeft:0, fontSize:23, fontWeight:'bold'}]}>{selectedData.title}</Text>
                            <View style={{borderBottomColor: '#93E3FF', borderBottomWidth: 1, width:'90%'}}/>
                            <Text style={[styles.titleBox, {paddingLeft:0, marginTop:5}]}>{selectedData.text}</Text>
                        </View>

                        <Icon style={{position:'absolute',left:-10, top:-15}} name="certificate" size={65} color="#ABC6FF" />
                    </TouchableOpacity>
                </Modal>
            </Modal>

            {/*메인 화면*/}
            <View style={styles.profileBox}>

                <View style={styles.user}>
                    <Image style={styles.profileImage} source={{uri:userData.profileImage}}/>
                    {/*{
                        userAddress.length==1?
                            <Text style={{marginTop:5, color:'grey'}}>{`${userAddress[0].addressName}의`}</Text>
                            :
                            <Text style={{marginTop:5, color:'grey'}}>{`${userAddress[0].addressName}/${userAddress[1].addressName}의`}</Text>
                    }*/}
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
                    <Text style={styles.buttonText}>{`'${userData.nickname}'님의 재능구매 내역`}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonList} onPress={()=>checkCertification()}>
                    <Icon2 style={[styles.iconPlace, {marginTop:3}]} name="certificate"  size={46} color="#37CEFF" />
                    <Text style={styles.buttonText}>{`'${userData.nickname}'님의 자격 확인`}</Text>
                </TouchableOpacity>


            </View>



        </View>


    );
}


const styles = StyleSheet.create({
    //자격 상세 모달
    addModalBox:{
        margin:20,
        flex:1,
        backgroundColor:'white',
        borderRadius:10
    },
    blankImage:{
        borderWidth: 2,
        width:260,
        borderRadius:20,
        height:350,
        borderColor:'#7DCBFF',
        overflow:'hidden'
    },
    imageBox:{
        //borderWidth:1,
        marginLeft: 7,
        marginRight: 7,
        flexDirection:'row',
        marginTop: 8
    },
    titleBox:{
        //borderWidth:1,
        backgroundColor:'#ecfeff',
        borderRadius:7,
        paddingLeft: 10,
        fontSize: 16
    },
    /// 자격 내역 모달
    certificateBox: {
        flex:1,
        //borderWidth:1
    },
    dataImage:{
        width: '100%',
        overflow:"hidden",
        height: '80%',
        borderRadius: 9,
    },
    dataBox:{
        alignItems:'center',
        borderRadius: 10,
        width:'48%',
        height: 300,
        marginBottom: 10,
        marginLeft:4,
        backgroundColor:'#d7f2ff',
        paddingTop:4,
        marginTop:2
    },
    cancleIcon:{
        position:'absolute',
        top:-10,
        right:-10
    },
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
