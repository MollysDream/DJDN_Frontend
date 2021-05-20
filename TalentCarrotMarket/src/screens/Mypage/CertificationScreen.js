import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button, Image, TouchableHighlight, Alert, TouchableOpacity, TextInput, ScrollView
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
import requestAddressAPI from "../../requestAddressAPI";
import {useIsFocused} from "@react-navigation/native";

import FlashMessage, {showMessage} from "react-native-flash-message";
import Modal from 'react-native-modal';

import {RNCamera} from 'react-native-camera';
import {S3Key} from "../../Key";
import request from "../../requestAPI";

const CertificationScreen = ({navigation}) => {

    const [addModalVisible, setAddModalVisible] = useState(false);
    const [title,setTitle] = useState('');
    const [text,setText] = useState('');
    
    //const [deviceImage.uri, setImageDevicePath] = useState('');
    const [deviceImage, setDeviceImage] = useState({
        uri: '',
        name: '',
        type: ''
    });

    const [S3url, setS3url] = useState('');



    useEffect(() => {

    }, []);

    function message(text){
        showMessage({message:text, type:'info'});
    }

    function addCertificateModal() {
        setAddModalVisible(!addModalVisible);
    }

    function cancelAdd(){
        console.log('취소');
        Alert.alert("확인","자격증 추가를 취소 하실건가요?",[
            {text:'네', style:'cancel',
                onPress:()=>{
                    setAddModalVisible(!addModalVisible);
                    setDeviceImage({uri: '',
                        name: '',
                        type: ''});
                    setTitle('');
                    setTitle('');
                }
            },
            {text:'아니요', style:'cancel'}
        ])
    }

    function writeCertificate(text, type) {

        if(type == 'title'){
            setTitle({title:text})
        }
        else if(type == 'text'){
            setText({text:text})
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
        if(title.length===0)
            message('자격증 명을 입력해주세요!');
        else if(text.length===0)
            message('간단한 설명을 입력해주세요!');
        else if(deviceImage.uri=='')
            message('자격증을 인증할 사진을 찍어주세요');

        const options = {
            keyPrefix: `---자격증---/${title}/`,  //제목 뒤에 user_id 값 추가해야 됨.
            bucket: 'mollysdreampostdata',
            region: 'ap-northeast-2',
            accessKey: S3Key.accessKey,
            secretKey: S3Key.secretKey,
            successActionStatus: 201,
        }

        try{
            let imageUrl = await request.postImageToS3(deviceImage,options);
            console.log(imageUrl);
            setS3url(imageUrl);
        }catch(err){
            console.log(err);
        }


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

            <View style={styles.TitleView}>
                <Icon2 style={[styles.iconPlace, {marginTop:3}]} name="certificate"  size={46} color="#37CEFF" />
                <Text style={styles.titleText}>자격증 증명</Text>
            </View>

            <View style={styles.certificateBox}>

                <TouchableOpacity style={styles.addButton} onPress={addCertificateModal}>
                    <Icon style={[styles.iconPlace, {marginTop:3}]} name="plus"  size={46} color="#00C0FF" />
                </TouchableOpacity>

            </View>

        </View>


    );
}


const styles = StyleSheet.create({
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
        paddingLeft:wp(3),
        paddingRight:wp(3)

    }, addButton: {
        borderRadius: 10,
        height: 80,
        backgroundColor:'#c5f1ff',
        alignItems:'center',
        justifyContent:'center',

    }


});

export default CertificationScreen;
