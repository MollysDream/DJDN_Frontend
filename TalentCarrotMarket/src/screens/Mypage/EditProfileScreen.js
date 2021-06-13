import React, {useState,useEffect} from 'react';
import {Container, Form, Input, Item, Label} from 'native-base';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image, Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-crop-picker";
import {S3Key} from "../../Key";
import request from "../../requestAPI";
import {message} from "../../function";
import FlashMessage from "react-native-flash-message";

const EditProfileScreen = ({navigation, route}) => {

    const [userId, setUserId]= useState(route.params.userId);
    const [userData, setUserData] = useState(route.params.userData);

    const [editImage, setEditImage] = useState(userData.profileImage);
    const [editNickname, setEditNickname] = useState(userData.nickname);

    const [deviceImage, setDeviceImage] = useState();

    //default image number
    const [num, setNum] = useState(1);


    function writeNickname(text) {
        setEditNickname(text);
    }

    const options = {
        keyPrefix: `---프로필 이미지---/${userId}/${editNickname}/`,  //제목 뒤에 user_id 값 추가해야 됨.
        bucket: 'mollysdreampostdata',
        region: 'ap-northeast-2',
        accessKey: S3Key.accessKey,
        secretKey: S3Key.secretKey,
        successActionStatus: 201,
    }

    async function saveProfile() {

        if(editNickname.length === 0){
            message("닉네임을 작성해주세요")
            return;
        }

        let imageUrl = null;
        //ImagePicker을 이용한 경우
        if(deviceImage!=null)
            try{
                console.log('이미지 피커 불림');
                imageUrl = await request.postImageToS3(deviceImage,options);

                console.log(imageUrl);
                setEditImage(imageUrl);
            }catch(err){
                console.log(err);
            }

        try{
            if(deviceImage!=null){
                const result = await requestUserAPI.updateUserProfile(userId, editNickname, imageUrl);
            }
            else{
                const result = await requestUserAPI.updateUserProfile(userId, editNickname, editImage);
            }

            Alert.alert("수정 완료", "프로필 수정이 완료되었습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> {
                        navigation.goBack();
                    }}])

        }catch(err){
            console.log(`프로필 수정 실패 ${err}`);
        }


    }

    function selectImage() {
        const path =require('path');
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            multiple: false,
            sortOrder : 'asc',
            compressImageQuality : 0.1,
            includeBase64 : true,
            cancelButtonTitle : true,
        }).then(image => {
            const name = path.parse(image.path).base;
            const file = {
                uri: image.path,
                name: name,
                type: image.mime
            }
            setDeviceImage(file);
            setEditImage(file.uri);
            console.log(file);

        })
    }

    function defaultImageButton() {
        setDeviceImage(null);

        if(num==1){
            setEditImage('https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/---%ED%94%84%EB%A1%9C%ED%95%84+%EC%9D%B4%EB%AF%B8%EC%A7%80---/DefaultImage/default-image.jpg')
            setNum(2);
        }else if(num==2){
            setEditImage('https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/---%ED%94%84%EB%A1%9C%ED%95%84+%EC%9D%B4%EB%AF%B8%EC%A7%80---/DefaultImage/default2.jpg')
            setNum(3);
        }else if(num==3){
            setEditImage('https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/---%ED%94%84%EB%A1%9C%ED%95%84+%EC%9D%B4%EB%AF%B8%EC%A7%80---/DefaultImage/default3.jpg')
            setNum(1);
        }
    }

    return (
        <View style={styles.container}>
            <FlashMessage position="top"/>
            <View style={styles.profileBox}>
                <View style={styles.user}>
                    <View style={styles.imageBox}>
                        <Image style={styles.profileImage} source={{uri:editImage}}/>
                        <TouchableOpacity style={styles.editImage} onPress={selectImage}>
                            <Icon name="images"  size={40} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.defaultArea}>
                        <TouchableOpacity style={styles.defaultButton} onPress={defaultImageButton}>
                            <Text style={(styles.Text, {color: 'black'})}>{`기본 이미지 - ${num}`}</Text>
                        </TouchableOpacity>
                    </View>

                    <Form style={{width:250}}>
                        <Item inlinelabel style={{ marginTop: '3%' }}>
                            <Label style={{width:'27%' ,fontSize:20}}>닉네임</Label>
                            <Input autoCapitalize='none' style={styles.nickname}
                                   onChangeText={(text) => writeNickname(text)}>{editNickname}</Input>
                        </Item>

                    </Form>
                </View>


            </View>

            <View style={styles.saveArea}>
                <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                    <Text style={(styles.Text, {color: 'black'})}>수정 완료</Text>
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
        borderColor: "#6fceff"
    },
    nickname:{
        fontSize: 27,
    },
    saveArea:{

        height:50,
        marginTop:100,
        alignItems:'center'
    },
    saveButton:{
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d4fbff',
    },
    imageBox: {
    },
    editImage: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },

    defaultArea:{
        height:20,
        margin:5,
    },
    defaultButton:{
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d4fbff',
    },

});

export default EditProfileScreen;