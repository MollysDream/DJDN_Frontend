import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image, FlatList, RefreshControl, TouchableHighlight, Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from "react-native-vector-icons/Entypo";

import Modal from 'react-native-modal';
import AsyncStorage from "@react-native-community/async-storage";

import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";
import requestAPI from "../../requestAPI";
import {getDate, getPrice} from "../../function";
import {Content, Form, Textarea} from "native-base";
import {Picker} from "@react-native-picker/picker";
import requestReportAPI from "../../requestReportAPI";
import FlashMessage, {showMessage} from "react-native-flash-message";
import { Rating } from 'react-native-ratings';

const UserProfileScreen = ({navigation,route}) => {

    const [myUserId, setMyUserId]=useState('');

    //이 스크린에서의 user는 postOwner이다.
    const [userId, setUserId]= useState(route.params.postOwnerData._id);
    const [userData, setUserData] = useState(route.params.postOwnerData);
    const [userAddress, setUserAddress] = useState([]);


    const[dataFlag,setDataFlag]=useState(false);

    useEffect(() => {
        async function getMyUserId(){
            let id = await AsyncStorage.getItem('user_id');
            setMyUserId(id);
        }
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
        let result2 = getMyUserId();
    }, []);

    //*************자격증 확인 함수*************
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
        setCertificateData(certificateData.concat(certificate));

        setCertificateModal(!certificateModal);
        console.log('사용자의 자격 확인');
    }

    const seeDetail=(item)=>{
        setSelectedData(item);
        setDetailCertificateModal(!detailCertificateModal);
    }

    const returnCertificateFlatListItem = (item,index)=>{
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
                <Icon style={{position:'absolute',left:-5, top:-5}} name="certificate" size={35} color="#FFB294" />

            </TouchableOpacity>
        );
    }

    //*************재능구매 내역 확인 함수*************

    const[postModal, setPostModal]=useState(false);
    const[postData, setPostData]=useState([]);

    const checkPost = async ()=>{

        let post = await requestAPI.getUserPost(userId);

        setPostData(post);
        setPostModal(!postModal);
        console.log("사용자 재능거래 내역 확인!!");
    }

    const goToDetailPostScreen = (item)=> {
        setPostModal(!postModal);
        const postImages = []
        item.image.map((image)=>{
            let temp={
                image:image,
                desc:image,
            }
            postImages.push(temp);
        })
        navigation.push('DetailPost',{detailPost: item, postImages: postImages, postOwner: userData});

    }

    const returnPostFlatListItem = (item,index)=>{
        let time = getDate(item.date);
        let price = getPrice(item.price);
        let status = null
        let statusStyle = styles.status_none
        if(item.tradeStatus === 1){
            status = '거래중';
            statusStyle = styles.status_ing
        }
        else if(item.tradeStatus ===2){
            status = '거래완료';
            statusStyle = styles.status_complete
        }

        return(
            <View style={{marginBottom:10}}>
                <TouchableOpacity onPress={()=>goToDetailPostScreen(item)}>
                    <View style={styles.post}>
                        <Image style={styles.image} source={{ uri: item.image[0]}} />
                        <View>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <View style={statusStyle}>
                                <Text>{status}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.postPrice}>{`${price}원`}</Text>
                                <Text style={styles.postAddressTime}>{`${item.addressName}\n${time}`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    //*************신고 함수*************

    const [reportModal, setReportModal] = useState(false);
    const userCategoryList = ['비매너', '욕설', '성희롱', '채팅비매너', '기타'];
    const [reportCategory, setReportCategory] = useState('');

    const [reportText, setReportText] = useState('');

    const reportUser = async ()=>{
        setReportModal(!reportModal);
    }

    const writeText = (text, type)=>{
        setReportText(text)
    }

    const report = async ()=>{

        let categoryParam = reportCategory;
        if(reportCategory == ''){
            showMessage({message:'사용자 신고 사유를 설정해주세요', type:'info'});
            return;
        }
        if(reportText.length === 0){
            showMessage({message:'신고 상세 내용을 작성해주세요', type:'info'});
            return;
        }

        const reportDataParam ={
            reportUser: myUserId,
            targetUser: userId,
            targetPost: undefined,
            reportWhat: 1,
            reportCategory: reportCategory,
            text: reportText
        }

        try{
            const resultData = await requestReportAPI.reportPostOrUser(reportDataParam);
            Alert.alert("신고 완료", "신고가 정상적으로 접수 되었습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> {
                        setReportCategory('');
                        setReportText('');
                        setReportModal(!reportModal);
                    }}])
        }
        catch(err){
            console.log(err);
        }

    }

    if(dataFlag==false)
        return(<Text>Loading...</Text>)
    return (
        <View style={styles.container}>

            {/*재능구매 확인*/}
            <Modal isVisible={postModal}>
                <View style={{flex:1}} >
                    <View style={styles.buttonList}>
                        <Icon style={styles.iconPlace} name="hand-holding-usd"  size={40} color="#37CEFF" />
                        <Text style={styles.buttonText}>{`'${userData.nickname}'님의 재능구매 내역`}</Text>
                    </View>
                    <FlatList
                        data={postData}
                        keyExtractor={(item,index) => String(item._id)}
                        renderItem={({item,index})=>returnPostFlatListItem(item,index)}
                    />
                </View>

                <TouchableOpacity style={styles.cancleIcon} onPress={()=>{
                    setPostModal(!postModal);
                    setPostData([]);
                }}>
                    <Icon3 name="back"  size={40} color="#8DAAFF" />
                </TouchableOpacity>

            </Modal>

            {/*자격 확인*/}
            <Modal isVisible={certificateModal}>
                <View style={styles.certificateBox}>
                    <View style={styles.buttonList} >
                        <Icon2 style={[styles.iconPlace, {marginTop:3}]} name="certificate"  size={46} color="#37CEFF" />
                        <Text style={styles.buttonText}>{`'${userData.nickname}'님의 자격증`}</Text>
                    </View>

                    <FlatList
                        numColumns={2}
                        data={certificateData}
                        keyExtractor={(item,index) => String(item._id)}
                        renderItem={({item,index})=>returnCertificateFlatListItem(item,index)}
                    />

                </View>
                <TouchableOpacity style={styles.cancleIcon} onPress={()=>{
                    setCertificateModal(!certificateModal)
                    setCertificateData([])
                }}>
                    <Icon3 name="back"  size={40} color="#8DAAFF" />
                </TouchableOpacity>

                {/*자격 상세 확인*/}
                <Modal isVisible={detailCertificateModal}>
                    <TouchableOpacity style={[styles.addModalBox, {backgroundColor:'#ecfbff'}]} onPress={()=>setDetailCertificateModal(!detailCertificateModal)}>
                        <View style={[styles.imageBox]}>
                            <Image style={[styles.blankImage,{width:'100%', height:450}]} source={{uri:selectedData.certificateImage}}/>
                        </View>

                        <View style={{margin:9,flexDirection:'column', alignItems:'center'}}>
                            <Text style={[styles.titleBox, {paddingLeft:0, fontSize:23, fontWeight:'bold'}]}>{selectedData.title}</Text>
                            <View style={{borderBottomColor: '#93E3FF', borderBottomWidth: 1, width:'90%'}}/>
                            <Text style={[styles.titleBox, {paddingLeft:0, marginTop:5}]}>{selectedData.text}</Text>
                        </View>

                        <Icon style={{position:'absolute',left:-10, top:-15}} name="certificate" size={65} color="#FFB294" />
                    </TouchableOpacity>
                </Modal>
            </Modal>

            {/*신고 모달*/}
            <Modal isVisible={reportModal}>

                <FlashMessage position="top"/>
                <View style={{backgroundColor:'white'}}>
                    <TouchableOpacity style={styles.cancleIcon} onPress={()=>{
                        setReportModal(!reportModal);
                        setReportCategory('');
                        setReportText('');
                    }}>
                        <Icon3 name="back"  size={40} color="#8DAAFF" />
                    </TouchableOpacity>
                    <View style={{margin:10, flexDirection:'row'}}>
                        <View style={{width: '50%', paddingRight:10, alignItems:'flex-end'}}>
                            <Text style={{fontSize:18, fontWeight:'bold'}}>
                                {`'${userData.nickname}' 사용자 신고`}
                            </Text>
                        </View>
                    </View>


                    <Form>
                        <Picker
                            selectedValue={userCategoryList}
                            onValueChange={(value) => setReportCategory(value)}
                        >
                            <Picker.Item color={'grey'} label={'사용자 신고 사유'} value={''}/>
                            {
                                userCategoryList.map((category, key)=>(
                                    <Picker.Item label={category} value={category} key={key}/>
                                ))

                            }
                        </Picker>

                        <Textarea rowSpan={8} placeholder="신고 상세 내용을 입력해주세요." autoCapitalize='none'
                                  onChangeText={(text) => writeText(text, "text")}
                                  style={styles.textAreaContainer} />
                    </Form>

                    <View style={[styles.btnArea1,{bottom:8}]}>
                        <TouchableOpacity style={styles.btn1} onPress={()=>report()}>
                            <Text style={{color: 'black', fontWeight:'bold'}}>신고</Text>

                        </TouchableOpacity>
                    </View>

                </View>

            </Modal>

            {/*메인 화면*/}
            <View style={styles.profileBox}>

                <View style={styles.user}>
                    <Image style={styles.profileImage} source={{uri:userData.profileImage}}/>
                    {
                        userAddress.length==1?
                            <Text style={{fontSize:15, marginTop:5, color:'grey'}}>{`${userAddress[0].addressName}의`}</Text>
                            :
                            <Text style={{fontSize:15, color:'grey'}}>{`${userAddress[0].addressName}/${userAddress[1].addressName}의`}</Text>
                    }
                    <Text style={styles.nickname}>{userData.nickname}</Text>
                    <View style={styles.ratingArea}>
                        <View style={styles.ratingView}>
                            <Text style={(styles.Text, {color: 'black'})}>평가점수: {userData.averageRating}</Text>
                        </View>
                    </View>

                    <Rating
                    ratingCount={5}
                    startingValue={userData.averageRating}
                    imageSize={40}
                    readonly='true'
                    type="star"
                    />
                </View>

                <View style={styles.btnArea1}>
                    {
                        myUserId == userId || myUserId == '' ?
                            null:
                            <TouchableOpacity style={styles.btn1} onPress={()=>reportUser()}>
                                <Text>신고</Text>
                            </TouchableOpacity>
                    }
                </View>

            </View>

            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />

            <View style={styles.tradeBox}>

                <TouchableOpacity style={styles.buttonList} onPress={()=>checkPost()} >
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
    /// 재능구매 내역 모달

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
    image:{
        width: wp(28),
        overflow:"hidden",
        height: hp(28),
        aspectRatio: 1,
        borderRadius: 9,
        marginRight:12
    },
    status_ing:{
        backgroundColor:'#b4e6ff',
        position: 'absolute',
        top: 40,
        padding: 3,
        borderRadius: 7
    },
    status_complete:{
        backgroundColor:'#98afbf',
        position: 'absolute',
        top: 40,
        padding: 3,
        borderRadius: 7
    },
    status_none:{
        position: 'absolute'
    },

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
        top:7,
        right:12
    },


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
    },
    btn1: {
        width: 45,
        height: 30,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffefef',
    },
    btnArea1: {
        flex:1,
        position:'absolute',
        bottom:0,
        right:0,
        paddingRight:10
    },
    ratingArea:{
        height:20,
        margin:5,
    },
    ratingView:{
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d4fbff',
    },

});

export default UserProfileScreen;
