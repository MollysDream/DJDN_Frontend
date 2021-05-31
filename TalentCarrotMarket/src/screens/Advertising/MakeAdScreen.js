import React, {useState, createRef, Component} from 'react';
import { Content, Container, Header, Left, Right, Title, Body, Item, Label, Text,
    Input, Form, Textarea } from 'native-base';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Alert } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import request from "../../requestAPI";
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import {PickerItem} from "react-native/Libraries/Components/Picker/Picker";
import AsyncStorage from "@react-native-community/async-storage";
import {S3Key} from "../../Key";
import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";
import requestAdverAPI from "../../requestAdverAPI";
import {message} from "../../function";
import FlashMessage from "react-native-flash-message";

export default class MAkeAdScreen extends Component{
    state={
        approve : false,
        active: false,
        title: "",
        imageTemp:[],
        text: "",
        price: 0,
        count: 0,
        shopOwner:"",
        area: {},
        image:[]
    }

    async componentDidMount() {


        //광고 작성 사용자의 userId값을 저장하기 위해 요청
        const userId = await AsyncStorage.getItem('user_id');

        let userData = await requestUserAPI.getUserData(userId);

        //광고 작성시 게시글의 위치정보 저장을 위해 요청
        const userAddressDataList = await requestAddressAPI.getUserAddress(userId);
        let userAddress;

        userAddressDataList.address.map((address)=>{
            if(address.addressIndex == userData.addressIndex){
                userAddress = address;
            }
        })

        this.setState({
            shopOwner:userId,
            area:userAddress,
        })
        //console.log(this.state.userAddress);
    }

    writeAd = (text, type)=>{

        if(type == "active"){
            this.setState({active:text})
        }
        else if(type == 'title'){
            this.setState({title:text})
        }
        else if(type == 'text'){
            this.setState({text:text})
        }
        else if(type == 'duration'){
            this.setState({tag:text})
        }
        else if(type == 'price'){
            this.setState({price:text})
        }
    }

    async confirmPost(){
        if(this.state.title.length === 0){
            message("제목을 작성해주세요");
            return;
        }
        else if(this.state.imageTemp.length === 0){
            message("이미지를 첨부해주세요");
            return;
        }
        else if(this.state.text.length === 0){
            message("광고 내용을 작성해주세요");
            return;
        }
        else if(this.state.price.length === 0){
            message("가격을 작성해주세요");
            return;
        }

        const options = {
            keyPrefix: `---광고---/${this.state.shopOwner}/${this.state.title}/`,  //제목 뒤에 user_id 값 추가해야 됨.
            bucket: 'mollysdreampostdata',
            region: 'ap-northeast-2',
            accessKey: S3Key.accessKey,
            secretKey: S3Key.secretKey,
            successActionStatus: 201,
        }

        try{
            const imageUrl: string[] = await Promise.all(this.state.imageTemp.map(async (file):Promise<string>=>{
                let imageLocation = await request.postImageToS3(file,options);
                return imageLocation
            }))
            this.setState({image:imageUrl});

            }catch(err){
            console.log("여기?");
            console.log(err);
        }

        try{
            const adverData = await requestAdverAPI.createAdver(this.state)
            Alert.alert("작성 완료", "광고 작성이 완료되었습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> {
                    this.props.navigation.navigate('advertise')
                }}])
        }catch(err){
            Alert.alert("작성 실패","광고를 다시 작성해주세요.", err.response.data.error,[
                {text:'확인', style:'cancel', onPress: () => {this.setState({loading: false})}}
            ])
        }
    }
  
        selectImage = async ()=>{
            const path =require('path');
            ImagePicker.openPicker({
                width: 200,
                height: 200,
                multiple: true,
                sortOrder : 'asc',
                compressImageQuality : 0.1,
                includeBase64 : true,
                cancelButtonTitle : true,
              }).then(images => {
                  const imageTemp = []
                  images.map((i)=>{
                    const name = path.parse(i.path).base;  
                      const file = {
                          uri: i.path,
                          name: name,
                          type: i.mime
                      }
                      imageTemp.push(file);
                  })
                this.setState({imageTemp:imageTemp})
                this.setState({countImage:this.state.imageTemp.length})
                console.log(this.state.imageTemp)
                /*this.state.imageTemp.map((file)=>{
                    console.log(file);
                })*/
            })
    
        }


    render() {
        return (
            <Container>
                <FlashMessage position="top"/>
                <Header style={{backgroundColor:"#a75bff"}}>
                <Right>
                    <TouchableOpacity
                        onPress={()=>this.confirmPost()}
                        style={{ marginRight: '3%' }}>
                        <Text style={{fontWeight: 'bold'}}>완료</Text>
                    </TouchableOpacity>
                </Right>
            </Header>
            <TouchableWithoutFeedback >
                <KeyboardAvoidingView>
                    <ScrollView style={{ marginTop : '3%' }}>
                        <Container>
                            <Content>
                                <Form>
                                    <Item inlinelabel style={{ marginTop: '3%' }}>
                                        <Label style={{width:'18%'}}>제목</Label>
                                        <Input autoCapitalize='none'
                                               onChangeText={(text) => this.writeAd(text, "title")} />
                                    </Item>

                                    <Item inlinelabel >
                                        <Label style={{width:'18%'}}>가격</Label>
                                        <Input autoCapitalize='none'
                                               keyboardType="numeric"
                                               onChangeText={(text) => this.writeAd(text, "price")}
                                        />

                                    </Item>
                                    <Item  inlinelabel >
                                        <TouchableOpacity
                                            onPress={this.selectImage}
                                            style={styles.imageArea}>
                                                <Icon name="camera"  size={50} />
                                        </TouchableOpacity>
                                                                              </Item>

                                    {
                                        this.state.countImage != 0 &&
                                        <Item  inlinelabel laststyle={{ marginTop: '5%' }} >
                              
                                           <FlatList
                                           data ={this.state.imageTemp}
                                           horizontal = {true}
                                           nestedScrollEnabled={true}
                                           keyExtractor={item => item.name}
                                           renderItem={({item}) => (
                                               
                                            <Image style={styles.image} source={{uri: item.uri}} /> )}
                                            />  
                                        </Item>
                                    }

                                    <Textarea rowSpan={8} placeholder="광고 내용을 입력해주세요." autoCapitalize='none'
                                              onChangeText={(text) => this.writeAd(text, "text")}
                                              style={styles.textAreaContainer} />
                                    
                                </Form>
                            </Content>
                        </Container>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Container>
    );
    }
}


const styles = StyleSheet.create({
    image:{
        width: wp(28),
        overflow:"hidden",
        height: hp(28),
        aspectRatio: 1,
        borderRadius: 9,
        marginRight:10
    },
    post:{
        flexDirection: "row",
        alignItems : "center",
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        padding: 5,
        height: 150,
        width : 150
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: wp(7),
        paddingRight: wp(7),
    },
    topArea: {
        flex: 1,
        paddingTop: wp(2),
    },

    formArea: {
        justifyContent: 'center',
        // paddingTop: wp(10),
        flex: 1.5,
    },
    imageArea : {
        marginVertical: '5%',
        marginLeft:'40%',
     
    },
    imageTextArea : {
        marginVertical: '0%',
        marginLeft:'0%',
     
    }
   
});