import React, {Component, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,ScrollView,
    Alert
} from 'react-native';
import { Content, Container, Header, Left, Right, Title, Body, Item, Label,
    Input, Form, Textarea } from 'native-base';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import request from '../../requestAPI';
import requestAdverAPI from "../../requestAdverAPI";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import FlashMessage, {showMessage} from "react-native-flash-message";
import {getAdEndDate, getGMT9Date, message} from "../../function";
import {S3Key} from "../../Key";
import requestAddressAPI from "../../requestAddressAPI";
import DateTimePicker from "@react-native-community/datetimepicker";
import NaverMapView, {Circle, Marker} from "react-native-nmap";
import SwitchSelector from "react-native-switch-selector";

export default class EditAdverScreen extends Component {
    state = {
        _id: this.props.route.params.detailAdver._id,
        title: this.props.route.params.detailAdver.title,
        image: this.props.route.params.adverImages,
        text: this.props.route.params.detailAdver.text,
        price: this.props.route.params.detailAdver.price===0?'':this.props.route.params.detailAdver.price,
        phoneNumber:this.props.route.params.detailAdver.phoneNumber,
        imageTemp: [], //디바이스에서 불러온 이미지 정보 임시 저장
        countImage: 0, //선택한 이미지 개수
        user_id: "",

        mapModal:false,
        P1:{latitude: Number(this.props.route.params.detailAdver.latitude), longitude: Number(this.props.route.params.detailAdver.longitude)},
        pickPoint:{latitude: Number(this.props.route.params.detailAdver.latitude), longitude: Number(this.props.route.params.detailAdver.longitude)},
        radius:this.props.route.params.detailAdver.radius,
        addressName:this.props.route.params.detailAdver.addressName,

        dateModal:false,
        endDate: new Date(this.props.route.params.detailAdver.endDate)
    }

    async componentDidMount() {

        this.selectSwitchRadius(this.props.route.params.detailAdver.radius);

        const userId = await AsyncStorage.getItem('user_id');

        const changeToImageTemp = []
        this.props.route.params.adverImages.map((image) => {
                const file = {
                    uri: image
                }
                changeToImageTemp.push(file);
            })
        this.setState({imageTemp: changeToImageTemp})
        this.setState({countImage: changeToImageTemp.length})
        console.log(changeToImageTemp)

        this.setState({user_id:userId});
    }

    writeAd = (text, type) => {

        if (type == 'title') {
            this.setState({title: text})
        } else if (type == 'text') {
            this.setState(
                {text: text}
            )
        } else if (type == 'price') {
            this.setState({price: text})
        }else if(type=='phoneNumber'){
            console.log(this.state.phoneNumber);
            this.setState({phoneNumber:text})
        }
    }

    async confirmPost() {
        if(this.state.addressName == null){
            message("광고 위치를 선택해주세요");
            return;
        }
        else if(this.state.endDate==null){
            message("만료 날짜를 선택해주세요");
            return;
        }
        else if(this.state.title.length === 0){
            message("제목을 작성해주세요");
            return;
        }else if (this.state.imageTemp.length === 0) {
            message("이미지를 첨부해주세요");
            return;
        } else if (this.state.text.length === 0) {
            message("광고 내용을 작성해주세요");
            return;
        }

        const options = {
            keyPrefix: `---광고---/${this.state.user_id}/${this.state.title}/`,  //제목 뒤에 user_id 값 추가해야 됨.
            bucket: 'mollysdreampostdata',
            region: 'ap-northeast-2',
            accessKey: S3Key.accessKey,
            secretKey: S3Key.secretKey,
            successActionStatus: 201,
        }

        if (this.state.imageTemp[0].type != undefined) 
            try {
                const imageUrl: string[] = await Promise.all(
                    this.state.imageTemp.map(async (file) : Promise<string> => {
                        let imageLocation = await request.postImageToS3(file, options);
                        return imageLocation
                    })
                )
                this.setState({image: imageUrl});

            } catch (err) {
                console.log(err);
            }
        
        console.log(this.state)

        try {
            const adverData = await requestAdverAPI.updateAdver(this.state);
            Alert.alert("수정 완료", "광고 수정이 완료되었습니다.", [
                {
                    text: '확인',
                    style: 'cancel',
                    onPress: () => {
                        this.props.route.params.onGoBack();
                        this.props.navigation.navigate('advertise')
                    }
                }
            ])
        } catch (err) {
            Alert.alert("작성 실패", "광고를 다시 수정해주세요.", err.response.data.error, [
                {text: '확인', style: 'cancel', onPress: () => {this.setState({loading: false})}}
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

        if(getGMT9Date(currentDate)< getGMT9Date(new Date)){
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
                            <Icon3 name="cancel"  size={40} color="#c18aff" />
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
                                            <Text style={{alignSelf:'center'}}>광고만료 날짜 선택</Text>
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
                                               onChangeText={(text) => this.writeAd(text, "title")}>{this.props.route.params.detailAdver.title}</Input>
                                    </Item>

                                    <Item inlinelabel >
                                        <Label style={{width:'18%'}}>가격</Label>
                                        <Input autoCapitalize='none'
                                               keyboardType="numeric"
                                               placeholder={"(선택사항)"}
                                               onChangeText={(text) => this.writeAd(text, "price")}
                                        >{this.state.price}</Input>

                                    </Item>

                                    <Item inlinelabel >
                                        <Label style={{width:'18%'}}>연락처</Label>
                                        <Input autoCapitalize='none'
                                               keyboardType="numeric"
                                               placeholder={"(선택사항)"}
                                               onChangeText={(text) => this.writeAd(text, "phoneNumber")}
                                        >{this.props.route.params.detailAdver.phoneNumber}</Input>

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
                                           keyExtractor={item => item.uri}
                                           renderItem={({item}) => (
                                               <Image style={styles.image} source={{uri: item.uri}} /> )}
                                            />  
                                        </Item>
                                    }

                                    <Textarea rowSpan={8} placeholder="광고 내용을 입력해주세요." autoCapitalize='none'
                                              onChangeText={(text) => this.writeAd(text, "text")}
                                              style={styles.textAreaContainer}>
                                        {this.props.route.params.detailAdver.text}</Textarea>
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