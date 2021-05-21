import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button, Image, TouchableHighlight, Alert, TouchableOpacity, TextInput, ScrollView, RefreshControl, FlatList
} from 'react-native';
import {Form, Input, Item, Label, Textarea} from 'native-base';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Entypo';

import AsyncStorage from '@react-native-community/async-storage';
import requestUserAPI from "../../requestUserAPI";
import {useIsFocused} from "@react-navigation/native";

import FlashMessage, {showMessage} from "react-native-flash-message";
import Modal from 'react-native-modal';

import {RNCamera} from 'react-native-camera';
import {S3Key} from "../../Key";
import request from "../../requestAPI";
import {getDate, getPrice} from "../../function";

const CertificationScreen = ({navigation, route}) => {

    const [userId, setUserId]= useState(route.params.userId);

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [title,setTitle] = useState('');
    const [text,setText] = useState('');

    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedData ,setSelectedData]= useState({
        _id:'',
        title:'',
        text:'',
        certificateImage:''
    });
    
    //const [deviceImage.uri, setImageDevicePath] = useState('');
    const [deviceImage, setDeviceImage] = useState({
        uri: '',
        name: '',
        type: ''
    });

    //const [S3url, setS3url] = useState('');
    ///////////////////////////////////
    const [certificateData, setCertificateData] = useState([]);

    const [rerender, setRerender] = useState(false);



    useEffect(() => {
        async function getData(){
            let certificate = await requestUserAPI.getUserCertificate(userId);
            console.log(certificate);
            setCertificateData(certificateData.concat(certificate));
        }

        getData();

    }, []);

    function message(text){
        showMessage({message:text, type:'info'});
    }

    function addCertificateModal() {
        setAddModalVisible(!addModalVisible);
    }

    function resetData(){
        setDeviceImage({uri: '',
            name: '',
            type: ''});
        setTitle('');
        setText('');
        //setS3url('');
    }

    function cancelAdd(){
        console.log('취소');
        Alert.alert("확인","자격증 추가를 취소 하실건가요?",[
            {text:'네', style:'cancel',
                onPress:()=>{
                    setAddModalVisible(!addModalVisible);
                    resetData();
                }
            },
            {text:'아니요', style:'cancel'}
        ])
    }

    function writeCertificate(text, type) {

        if(type == 'title'){
            setTitle(text)
        }
        else if(type == 'text'){
            setText(text)
        }
    }

    const cameraRef = React.useRef(null);
    async function takePicture() {
        if(deviceImage.uri!=''){
            console.log('사진 다시 찍기!');
            //setImageDevicePath('');
            setDeviceImage({uri: '', name: '', type: ''});
            return
        }

        console.log('사진 찍기!');

        console.log('cameraRef', cameraRef);
        if (cameraRef) {
            const data = await cameraRef.current.takePictureAsync({
                quality: 1,
                exif: true,
            });
            //console.log(data);
            message('사진을 찍었습니다!');
            const file ={
                uri: data.uri,
                name: title,
                type: 'image/jpeg'
            }
            setDeviceImage(file);
        }
    }

    async function completeAdd() {
        if(title.length===0){
            message('자격증 명을 입력해주세요!');
            return;
        }
        else if(text.length===0){
            message('간단한 설명을 입력해주세요!');
            return;
        }
        else if(deviceImage.uri==''){
            message('자격증을 인증할 사진을 찍어주세요');
            return;
        }


        const options = {
            keyPrefix: `---자격증---/${title}/`,  //제목 뒤에 user_id 값 추가해야 됨.
            bucket: 'mollysdreampostdata',
            region: 'ap-northeast-2',
            accessKey: S3Key.accessKey,
            secretKey: S3Key.secretKey,
            successActionStatus: 201,
        }

        let imageUrl
        try{
            imageUrl = await request.postImageToS3(deviceImage,options);
            console.log(imageUrl);
            //setS3url(imageUrl);
        }catch(err){
            console.log(err);
        }

        try{
            await requestUserAPI.addCertificate(userId, title, text, imageUrl);

            Alert.alert("추가 완료", "자격증 추가가 완료되었습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> {
                        setAddModalVisible(!addModalVisible);
                        let newData = {
                            _id:userId,
                            title:title,
                            text:text,
                            certificateImage:imageUrl
                        }
                        setCertificateData(certificateData.concat(newData));
                        setRerender(!rerender);
                        resetData();
                    }}])

        }catch(err){
            console.log(`프로필 수정 실패 ${err}`);
        }
    }

    //자격증 삭제 버튼
    function deleteCertificate(item) {
        Alert.alert("확인","자격을 삭제 하실건가요?",[
            {text:'네', style:'cancel',
                onPress:async()=>{
                    //delete API 호출하고// certificateData에서 item 찾아서 삭제하고 flatlist refresh하자.
                    await requestUserAPI.deleteCertificate(userId,item._id);
                    let updateData = certificateData.filter(obj=>{
                        return obj._id !== item._id
                    })
                    setCertificateData(updateData);
                    setRerender(!rerender);
                }
            },
            {text:'아니요', style:'cancel'}
        ])

    }
    //자격증 자세히보기
    function seeDetail(item){
        setSelectedData(item);
        setDetailModalVisible(!detailModalVisible);
    }

    //FlatList 렌더
    function returnFlatListItem(item,index){

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
                <TouchableOpacity style={styles.deleteButton} onPress={()=>deleteCertificate(item)}>
                    <Icon name="trash-o"  size={25} color="#FFBDA4" />
                </TouchableOpacity>
                <Icon style={{position:'absolute',left:-5, top:-5}} name="certificate" size={35} color="#ABC6FF" />

            </TouchableOpacity>

        );
    }


    return (
        <View style={styles.container}>

            <Modal isVisible={addModalVisible} KeyboardAvoidingView ={false}>

                <ScrollView style={styles.addModalBox}>
                    <View style={styles.imageBox}>
                        <View style={styles.blankImage}>
                            {
                                deviceImage.uri == '' ?
                                    <RNCamera
                                        ref={cameraRef}
                                        style={styles.cameraBox}
                                        captureAudio={false} />
                                        :
                                    <Image style={styles.blankImage} source={{uri:deviceImage.uri}}/>
                            }
                            
                        </View>
                        <View style={{flex:1,alignItems:'center',justifyContent:'center',}}>
                            <TouchableOpacity onPress={takePicture}>
                                {
                                    deviceImage.uri == '' ?
                                        <Icon2 name="camera"  size={40} color="#37CEFF" />
                                        :
                                        <Icon2 name="camera-retake-outline"  size={40} color="#37CEFF" />
                                }
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{margin:9}}>
                        <TextInput style={styles.titleBox} placeholder={'자격증 명'}
                            onChangeText={(text) => writeCertificate(text, 'title')}/>
                        <Textarea placeholderTextColor={'grey'} style={styles.textBox} placeholder={'간단 설명'}
                                  rowSpan={4} onChangeText={(text) => writeCertificate(text, 'text')}/>
                    </View>
                    <View style={{alignItems:'flex-end'}}>
                        <TouchableOpacity style={styles.completeButton} onPress={completeAdd}>
                            <Text style={{fontSize:16}}>추가</Text>
                        </TouchableOpacity>
                    </View>



                    <TouchableOpacity style={styles.cancleIcon} onPress={cancelAdd}>
                        <Icon3 name="circle-with-cross"  size={35} color="#37CEFF" />
                    </TouchableOpacity>

                    <FlashMessage position="top"/>
                </ScrollView>

            </Modal>

            {/*상세정보 모달*/}
            <Modal isVisible={detailModalVisible} KeyboardAvoidingView ={false}>
                <TouchableOpacity style={[styles.addModalBox, {backgroundColor:'#ecfbff'}]} onPress={()=>setDetailModalVisible(!detailModalVisible)}>
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


            <View style={styles.TitleView}>
                <Icon2 style={[styles.iconPlace, {marginTop:3}]} name="certificate"  size={46} color="#37CEFF" />
                <Text style={styles.titleText}>자격 증명</Text>
                <TouchableOpacity style={styles.addButton} onPress={addCertificateModal}>
                    <Icon style={[styles.iconPlace, {marginTop:3}]} name="plus"  size={40} color="#00C0FF" />
                </TouchableOpacity>
            </View>

            <View style={styles.certificateBox}>

                <FlatList
                    numColumns={2}
                    data={certificateData}
                    keyExtractor={(item,index) => String(item._id)}
                    renderItem={({item,index})=>returnFlatListItem(item,index)}
                    extraData={rerender}
                    //refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshPage} />}
                />




            </View>

        </View>


    );
}


const styles = StyleSheet.create({
    deleteButton:{
        position:'absolute',
        bottom:6,
        right:7
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
        width:'45%',
        height: 300,
        marginLeft: 15,
        marginBottom: 10,
        backgroundColor:'#d7f2ff',
        paddingTop:4,
        marginTop:2
    },
    completeButton:{
        backgroundColor:'#bce2ff',
        borderRadius:8,
        width:80,
        height:40,
        alignItems: 'center',
        justifyContent:'center',
        marginRight: 7
    },
    cameraBox:{
        borderWidth: 2,
        borderRadius:20,
        width:260,
        height:349,
        borderColor:'#7DCBFF',
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
    textBox:{
        marginTop:5,
        backgroundColor:'#ecfeff',
        borderRadius:7,
        paddingLeft: 10,
        fontSize: 14,
    },
    titleBox:{
      //borderWidth:1,
        backgroundColor:'#ecfeff',
        borderRadius:7,
        paddingLeft: 10,
        fontSize: 16
    },
    cancleIcon:{
        position:'absolute',
        top:3,
        right:3
    },
    addModalBox:{
        margin:20,
        flex:1,
        backgroundColor:'white',
        borderRadius:10
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    TitleView: {
        //borderWidth:1,
        height:55,
        flexDirection:'row',
        backgroundColor: '#ecfeff',
        borderRadius: 20,
        marginBottom:7,
    },
    titleText:{
        fontSize: 20,
        color:'black',
        height:'100%',
        paddingTop:13,
        //borderWidth:1,
        marginLeft: 13
    },
    certificateBox: {
        flex:1,
        //borderWidth:1
    },
    addButton: {
        borderRadius: 100,
        backgroundColor:'#c5f1ff',
        alignItems:'center',
        justifyContent:'center',
        //borderWidth:1,
        position:'absolute',
        right:13,
        width:55,
        height: 55,

    }


});

export default CertificationScreen;
