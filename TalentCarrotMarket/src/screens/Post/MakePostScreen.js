import React, {useState, createRef, Component} from 'react';
import { Content, Container, Header, Left, Right, Title, Body, Item, Label, Text,
    Input, Form, Textarea } from 'native-base';
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
import Icon from 'react-native-vector-icons/Entypo';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import request from "../../requestAPI";
//import selectimage from "../Post/SelectImageScreen";
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export default class MakePostScreen extends Component {
    state = {
        title:"",
        image: [],
        text:"",
        category:[],
        price: 0,
    }


    writePost = (text, type)=>{
        if(type == 'title'){
            this.setState({title:text})
        }

        else if(type == 'text'){
            this.setState({text:text})
        }
        else if(type == 'category'){
            this.setState({category:text})
        }
        else if(type == 'tag'){
            this.setState({tag:text})
        }
        else if(type == 'price'){
            this.setState({price:text})
        }
    }

    confirmPost(){
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

        else if(this.state.text.length === 0){
            Alert.alert("경고","게시글 내용을 작성해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }
        else if(this.state.price.length === 0){
            Alert.alert("경고","가격을 작성해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }
        console.log(this.state)
        axi.post("/data/createPost", (this.state)).then((data)=> {  //수범이가 requestAPI에서 쉽게 할 수 있다고 수정하겠다고 냅두라고 함..
            Alert.alert("작성 완료", "게시글 작성이 완료되었습니다.", [{ text: '확인', style: 'cancel', onPress : ()=> this.props.navigation.navigate('Home')}])}).catch(function (e) {
            Alert.alert("작성 실패","게시글을 다시 작성해주세요.", e.response.data.error,[
                {text:'확인', style:'cancel', onPrees: () => {this.setState({loading: false})}}
            ])
        })
    }

    selectImage =()=>{

        ImagePicker.openPicker({
            width: 300,
            height: 300,
            multiple: true,
            sortOrder : 'asc',
            compressImageQuality : 0.1,
            includeBase64 : true,
            cancelButtonTitle : true,
          }).then(images => { images.map((i)=>this.state.image.push(`${i.path}`))
            
        })
          
              
              console.log(this.state.image)
    }


    // url(path) {
    //     //빈파일이 아닌 경우 함수 진행
    //      if (path !== null) {
    //        //FormData 생성
    //        const fd = new FormData();
    //        //FormData에 key, value 추가하기
    //        fd.append('path', path);
    //        // axios 사용해서 백엔드에게 파일 보내기
    //        axi
    //          .post(`${URL}/user/profile-upload`, fd)
    //          .then(res => {
    //       //응답으로 받은 url 저장하기 (응답 내용의 표시나 방법은 백엔드와 결정해야한다.)
    //           this.state.image.push(res.data.image_url)
                
    //          })
    //        //에러가 날 경우 처리
    //          .catch(error => {
    //            console.log(error.response);
    //          });
    //      }
    //    };

    

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
                                        <Item inlinelabel>
                                            <Label style={{width:'18%'}}>카테고리</Label>
                                            <Input autoCapitalize='none'
                                                   onChangeText={(text) => this.writePost(text, "category")} />
                                        </Item>
                                        <Item inlinelabel >
                                            <Label style={{width:'18%'}}>가격</Label>
                                            <Input autoCapitalize='none'
                                                   keyboardType="numeric"
                                                   onChangeText={(text) => this.writePost(text, "price")}
                                            />
                                        </Item>
                                        <Item  inlinelabel laststyle={{ marginTop: '5%' }} >
                                        <TouchableOpacity
                                        onPress={this.selectImage.bind(this)}
                                        style={styles.imageArea}>
                                                <Icon name="camera"  size={50} />
                                        </TouchableOpacity>
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

    formArea: {
        justifyContent: 'center',
        // paddingTop: wp(10),
        flex: 1.5,
    },
    imageArea : {
        marginVertical: '5%',
        marginLeft:'40%',
     
    }
   
});