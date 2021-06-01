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
import {getAdEndDate, getGMT9Date, message} from "../../function";
import FlashMessage from "react-native-flash-message";
import Postcode from "@actbase/react-daum-postcode";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import NaverMapView, {Circle, Marker} from "react-native-nmap";
import Geolocation from "react-native-geolocation-service";
import SwitchSelector from "react-native-switch-selector";
import {add} from "react-native-reanimated";

import DateTimePicker from '@react-native-community/datetimepicker';

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
        image:[],

        mapModal:false,
        P1:{latitude: 37.564362, longitude: 126.977011},
        pickPoint:null,
        radius:0,
        addressName:null,

        dateModal:false,
        endDate: null
    }

    async componentDidMount() {

        Geolocation.getCurrentPosition(
            position =>{
                const {latitude,longitude}=position.coords;
                this.setState({P1:{latitude, longitude}});
            },
            error => {console.log(error.code,error.message)},
            { enableHighAccuracy:true, timeout: 20000, maximumAge:1000},
        );

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

        //광고 위치 함수
    setLocation(){
        //if()
        this.setState({mapModal:true});
    }

    async pickLocation(point){
        console.log(point);
        let latitude = point.latitude;
        let longitude = point.longitude;
        if(this.state.radius==0)
            this.setState({pickPoint:{latitude,longitude}, P1:{latitude,longitude}, radius:500})

        this.setState({pickPoint:{latitude,longitude}, P1:{latitude,longitude}});
        let addressData = await requestAddressAPI.currentLocation(longitude, latitude);
        this.setState({addressName:addressData.data.address});
        console.log(addressData.data.address);
    }

    radiusInitial = 0;
    radiusOptions = [
        {label:"500m", value: 500},
        {label:"1km", value: 1000},
        {label:"1.5km", value: 1500},
        {label:"2km", value: 2000},
    ];
    selectSwitchRadius(value){
        if(this.state.pickPoint==null)
            return
        switch(value){
            case 500:this.radiusInitial=0;
                break;
            case 1000:this.radiusInitial=1;
                break;
            case 1500:this.radiusInitial=2;
                break;
            case 2000:this.radiusInitial=3;
                break;
        }
        this.setState({radius:value});
    }

        //광고 기간 함수
    setDate(){
        this.setState({dateModal:true});
    }

    changeDate = (event, selectedDate)=>{
        let currentDate = selectedDate || new Date();

        console.log(getGMT9Date(new Date));

        if(currentDate< getGMT9Date(new Date)){
            message('현재보다 먼 시간을 골라주세요')
            this.setState({dateModal:false});
            return
        }


        this.setState({endDate:currentDate, dateModal:false});
    }


    render() {
        return (
            <Container>
                <FlashMessage position="top"/>

                {/*광고 시간선택 모달*/}
                {this.state.dateModal?
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={'date'}
                        is24Hour={true}
                        display="spinner"
                        onChange={this.changeDate}
                    />
                    :null
                }

                {/*광고 위치선택 모달*/}
                <Modal isVisible={this.state.mapModal}>

                    <View style={{backgroundColor:'white',borderRadius:20, width:'100%', height:'100%'}}>

                        <Text style={styles.locationModalText}>광고 위치 선택</Text>
                        <NaverMapView
                            style={{width: '100%', height: hp(60)}}
                            /*showsMyLocationButton={true}*/
                            center={{...this.state.P1, zoom:14}}
                            onMapClick={e => this.pickLocation(e)}>

                            {this.state.pickPoint==null?null:
                                <Marker coordinate={this.state.pickPoint} pinColor={"red"}/>
                            }
                            {this.state.radius==0?null:
                                <Circle coordinate={this.state.pickPoint} radius={this.state.radius} color={'rgba(144,64,201,0.2)'}/>
                            }
                        </NaverMapView>

                        <Text style={[styles.locationModalText,{fontSize:17}]}>광고 반경 설정</Text>
                        <SwitchSelector style={{paddingBottom:4}}
                                        options={this.radiusOptions}
                                        initial={this.radiusInitial}
                                        onPress={value => this.selectSwitchRadius(value)}
                                        textColor={'#af7bff'}
                                        selectedColor={'white'}
                                        buttonColor={'#af7bff'}
                                        borderColor={'#af7bff'}
                                        hasPadding
                        />

                        {this.state.addressName==null?null:
                            <TouchableOpacity onPress={()=>this.setState({mapModal:false})} style={{marginTop:15,alignSelf:"center", borderRadius:10, borderWidth:1,backgroundColor:'#d3acff', borderColor:'purple',padding:10}}>
                                <Text style={{alignSelf:'center',fontSize:17}}>{`${this.state.addressName} - ${this.state.radius}m`}</Text>
                            </TouchableOpacity>
                        }

                        <TouchableOpacity onPress={()=>this.setState({mapModal:false})}
                                          style={{position:'absolute',top:3,right:5}}>
                            <Icon2 name="cancel"  size={40} color="#c18aff" />
                        </TouchableOpacity>

                    </View>

                </Modal>

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
                                
                                <View style={{flexDirection:'row'}}>

                                    {this.state.addressName==null?
                                        <TouchableOpacity style={styles.ruleButton} onPress={()=>this.setLocation()}>
                                            <Text style={{alignSelf:'center'}}>광고위치 선택</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity style={[styles.ruleButton, {backgroundColor:'#d3acff'}]} onPress={()=>this.setLocation()}>
                                            <Text style={{alignSelf:'center'}}>{`${this.state.addressName} - ${this.state.radius}m`}</Text>
                                        </TouchableOpacity>
                                    }

                                    {this.state.endDate==null?
                                        <TouchableOpacity style={styles.ruleButton} onPress={()=>this.setDate()}>
                                            <Text style={{alignSelf:'center'}}>광고만료 기간 선택</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity style={[styles.ruleButton, {backgroundColor:'#d3acff'}]} onPress={()=>this.setDate()}>
                                            <Text style={{alignSelf:'center'}}>{`만료: ${getAdEndDate(this.state.endDate)}`}</Text>
                                        </TouchableOpacity>

                                    }

                                    
                                </View>
                                
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

    locationModalText:{
        alignSelf:'center', fontSize:20, fontWeight:'bold', margin:10
    },

    ruleButton:{
      width:'50%',
        borderRadius: 10,
        borderColor:'purple',
        borderWidth:1,
        paddingTop:4,
        paddingBottom:4

    },

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