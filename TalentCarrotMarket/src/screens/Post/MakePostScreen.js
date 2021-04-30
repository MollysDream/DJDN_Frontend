import React, {useState, createRef, Component} from 'react';
import { Content, Container, Header, Left, Right, Title, Body, Item, Label, Text,
    Input, Form, Textarea, Icon } from 'native-base';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import request from "../../requestAPI";
import formdata from 'form-data';
import { Alert } from 'react-native';

import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

var postData = new FormData();

export default class MakePostScreen extends Component {
    state = {
        title:"",
        image: ["https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/20191020_112929+(2).jpg"],
        text:"",
        category:[],
        price: 0,
        tag:[],
    }

    postInfo = () =>{
        postData = new FormData()
        postData.append('title',this.state.title)
        postData.append('image',this.state.image)
        postData.append('text',this.state.text)
        postData.append('category',this.state.category)
        postData.append('tag',this.state.tag)
        postData.append('price',this.state.price)
    }

    writePost = (text, type)=>{
        if(type == 'title'){
            this.setState({title:text},()=>{ console.log(this.state.title)})
        }

        else if(type == 'text'){
            this.setState({text:text},()=>{ console.log(this.state.text)})
        }
        else if(type == 'category'){
            this.setState({category:text},()=>{ console.log(this.state.category)})
        }
        else if(type == 'tag'){
            this.setState({tag:text},()=>{ console.log(this.state.tag)})
        }
        else if(type == 'price'){
            this.setState({price:text},()=>{ console.log(this.state.price)})
        }
    }

    async confirmPost(){
        if(this.state.title.length === 0){
            Alert.alert("경고","제목을 작성해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }
        else if(this.state.image.length === 0){
            Alert.alert("경고","이미지를 첨부해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }

        else if(this.state.category.length === 0){
            Alert.alert("경고","카테고리를 설정해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }

        else if(this.state.tag.length === 0){
            Alert.alert("경고","테그을 작성해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }

        else if(this.state.text.length === 0){
            Alert.alert("경고","게시글 내용을 작성해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }
        else if(this.state.price.length === 0){
            Alert.alert("경고","가격을 작성해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }
        console.log(this.state)

        try{
            const postData = await request.createPost(this.state)
            Alert.alert("작성 완료", "게시글 작성이 완료되었습니다.",
                [{ text: '확인', style: 'cancel',
                onPress : ()=> this.props.navigation.navigate('Home')}])
        }catch(err){
            Alert.alert("작성 실패","게시글을 다시 작성해주세요.", err.response.data.error,[
                {text:'확인', style:'cancel', onPress: () => {this.setState({loading: false})}}
            ])
        }

        /*axi.post("/data/createPost", (this.state)).then((data)=> {  //수범이가 requestAPI에서 쉽게 할 수 있다고 수정하겠다고 냅두라고 함..
            Alert.alert("작성 완료", "게시글 작성이 완료되었습니다.", [{ text: '확인', style: 'cancel', onPress : ()=> this.props.navigation.navigate('Home')}])}).catch(function (e) {
            Alert.alert("작성 실패","게시글을 다시 작성해주세요.", e.response.data.error,[
                {text:'확인', style:'cancel', onPrees: () => {this.setState({loading: false})}}
            ])
        })*/
    }


    render() {
        return (
            <Container>
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
                                                   onChangeText={(text) => this.writePost(text, "title")} />
                                        </Item>
                                        <Item inlinelabel last>
                                            <Label style={{width:'18%'}}>Tag</Label>
                                            <Input autoCapitalize='none'
                                                   onChangeText={(text) => this.writePost(text, "tag")} />
                                        </Item>

                                        <Item inlinelabel>
                                            <Label style={{width:'18%'}}>카테고리</Label>
                                            <Input autoCapitalize='none'
                                                   onChangeText={(text) => this.writePost(text, "category")} />
                                        </Item>
                                        <Item inlinelabel last>
                                            <Label style={{width:'18%'}}>가격</Label>
                                            <Input autoCapitalize='none'
                                                   keyboardType="numeric"
                                                   onChangeText={(text) => this.writePost(text, "")}
                                            />
                                        </Item>
                                        <Textarea rowSpan={8} placeholder="게시글 내용을 입력해주세요." autoCapitalize='none'
                                                  onChangeText={(text) => this.writePost(text, "text")}
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
    titleArea: {
        flex: 0.7,
        justifyContent: 'center',
        paddingTop: wp(3),
    },
    TextArea: {
        flex: 0.3,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    Text: {
        fontSize: wp('4%'),
    },
    TextValidation: {
        fontSize: wp('4%'),
        color: 'red',
        paddingTop: wp(2),
    },

    formArea: {
        justifyContent: 'center',
        // paddingTop: wp(10),
        flex: 1.5,
    },
    textFormTop: {
        borderWidth: 2,
        borderBottomWidth: 1,
        borderColor: 'black',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7,
        width: '100%',
        height: hp(6),
        paddingLeft: 10,
        paddingRight: 10,
    },
    textFormBottom: {
        borderWidth: 2,
        borderTopWidth: 1,
        borderColor: 'black',
        borderBottomRightRadius: 7,
        borderBottomLeftRadius: 7,
        width: '100%',
        height: hp(6),
        paddingLeft: 10,
        paddingRight: 10,
    },
    btnArea: {
        height: hp(8),
        // backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: hp(1.5),
    },
    btn: {
        flex: 1,
        width: '100%',
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
});