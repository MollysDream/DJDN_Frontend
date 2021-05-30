import React, {Component, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Button,
    RefreshControl,
    TouchableHighlight,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,ScrollView,
    Alert
} from 'react-native';
import { Content, Container, Header, Left, Right, Title, Body, Item, Label,
    Input, Form, Textarea } from 'native-base';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SearchBar} from 'react-native-elements';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import requestAdverAPI from "../../requestAdverAPI";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/Ionicons";
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import {PickerItem} from "react-native/Libraries/Components/Picker/Picker";
import FlashMessage, {showMessage} from "react-native-flash-message";

export default class EditAdverScreen extends Component {
    state = {
        _id: this.props.route.params.detailAdver._id,
        title: this.props.route.params.detailAdver.title,
        image: this.props.route.params.adverImages,
        text: this.props.route.params.detailAdver.text,
        price: this.props.route.params.detailAdver.price,
        imageTemp: [], //디바이스에서 불러온 이미지 정보 임시 저장
        countImage: 0, //선택한 이미지 개수
        user_id: ""
    }

    message(text){
        showMessage({message:text, type:'info'});
    }

    async componentDidMount() {
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
        }
    }

    async confirmPost() {
        if (this.state.title.length === 0) {
            this.message("제목을 작성해주세요");
            return;
        } else if (this.state.imageTemp.length === 0) {
            this.message("이미지를 첨부해주세요");
            return;
        } else if (this.state.text.length === 0) {
            this.message("광고 내용을 작성해주세요");
            return;
        } else if (this.state.price.length === 0) {
            this.message("가격을 작성해주세요");
            return;
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


    render() {
        return (
            <Container>
                <FlashMessage position="top"/>
            <Header>
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
                                               onChangeText={(text) => this.writeAd(text, "title")}>{this.props.route.params.detailAdver.title}</Input>
                                    </Item>

                                    <Item inlinelabel >
                                        <Label style={{width:'18%'}}>가격</Label>
                                        <Input autoCapitalize='none'
                                               keyboardType="numeric"
                                               onChangeText={(text) => this.writeAd(text, "price")}
                                        >{this.props.route.params.detailAdver.price}</Input>

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