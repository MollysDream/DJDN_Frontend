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

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import request from "../../requestAPI";
import requestAddressAPI from "../../requestAddressAPI"
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from "@react-native-community/async-storage";
import {Picker} from '@react-native-picker/picker';
import {PickerItem} from "react-native/Libraries/Components/Picker/Picker";

export default class EditUserPostScreen extends Component {
    state = {
        postId:this.props.route.params.detailPost._id,
        title:this.props.route.params.detailPost.title,
        image: this.props.route.params.postImages,
        text:this.props.route.params.detailPost.text,
        category:this.props.route.params.detailPost.category[0],
        price: this.props.route.params.detailPost.price,
        imageTemp:[], //디바이스에서 불러온 이미지 정보 임시 저장
        countImage:0, //선택한 이미지 개수
        user_id:"",
        userAddress:{},
        categoryList:[]
    }

    async componentDidMount() {
        //카테고리 설정에 필요한 카테고리 불러옴
        const category = await request.getCategoryList();
        const categoryList = []
        //카테고리 객체를 key로만 구성된 카테고리 배열로 변경
        for(const [key, value] of Object.entries(category.category[0])){
            categoryList.push(key);
        }

        //게시글 작성 사용자의 userId값을 저장하기 위해 요청
        const userId = await AsyncStorage.getItem('user_id');
        //게시글 작성시 게시글의 위치정보 저장을 위해 요청
        const addressData = await requestAddressAPI.getUserAddress(userId);

        //이미 설정된 이미지를 보여주기 위해 imageTemp로 값 넣기
        const changeToImageTemp = []
        this.props.route.params.postImages.map((image)=>{
            const file = {
                uri: image,
            }
            changeToImageTemp.push(file);
        })
        this.setState({imageTemp:changeToImageTemp})
        this.setState({countImage:this.state.imageTemp.length})
        console.log(this.state.imageTemp)


        this.setState({
            user_id:userId,
            userAddress:addressData.address[0],
            categoryList:categoryList
        })
        console.log(this.state.categoryList);
        //console.log(this.state.userAddress);

        //동네 인증이 되었는지 확인 (안되어 있으면 작성 불가 => 홈 화면으로 이동)
        if(this.state.userAddress == undefined || !this.state.userAddress['isAuth']){
            this.props.navigation.navigate('Home');
            Alert.alert("알림","게시글을 작성하기 위해\n동네 인증을 먼저 해주세요", [{ text: '확인', style: 'cancel' }])
            return;

        }
    }


    writePost = (text, type)=>{

        if(type == 'title'){
            this.setState({title:text})
        }
        else if(type == 'text'){
            this.setState({text:text})
        }
        /*else if(type == 'category'){
            this.setState({category:text})
        }*/
        else if(type == 'tag'){
            this.setState({tag:text})
        }
        else if(type == 'price'){
            this.setState({price:text})
        }
    }

    async confirmPost(){
        if(this.state.title.length === 0){
            Alert.alert("경고","제목을 작성해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }
        else if(this.state.category == ''){
            Alert.alert("경고","카테고리를 설정해주세요", [{ text: '확인', style: 'cancel' }])
            return;
        }
        else if(this.state.imageTemp.length === 0){
            Alert.alert("경고","이미지를 첨부해주세요", [{ text: '확인', style: 'cancel' }])
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


        const options = {
            keyPrefix: `${this.state.title}/`,  //제목 뒤에 user_id 값 추가해야 됨.
            bucket: 'mollysdreampostdata',
            region: 'ap-northeast-2',
            accessKey: 'AKIA2H2WIFGYFMLG6XFV',
            secretKey: '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',
            successActionStatus: 201,
        }

        console.log(this.state.imageTemp)
        if(this.state.imageTemp[0].type != undefined)
            try{
                const imageUrl: string[] = await Promise.all(this.state.imageTemp.map(async (file):Promise<string>=>{
                    let imageLocation = await request.postImageToS3(file,options);
                    return imageLocation
                }))
                this.setState({image:imageUrl});

            }catch(err){
                console.log(err);
            }

        console.log(this.state)

        try{
            const postData = await request.updatePost(this.state)
            Alert.alert("수정 완료", "게시글 수정이 완료되었습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> {
                        this.props.route.params.onGoBack();
                        this.props.navigation.navigate('userPostScreen')
                    }}])
        }catch(err){
            Alert.alert("작성 실패","게시글을 다시 수정해주세요.", err.response.data.error,[
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

    returnFlatListItem(item,index){
        console.log(item)
        return(

            <View style={styles.post}>
                <Image source={{uri : item.uri}} />

            </View>

        );
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

                                                   onChangeText={(text) => this.writePost(text, "title")}>{this.props.route.params.detailPost.title}</Input>
                                        </Item>
                                        <Picker
                                            onValueChange={(value) => this.setState({category:value})}
                                            placeholder='카테고리'
                                            selectedValue={this.props.route.params.detailPost.category[0]}
                                        >
                                            <PickerItem color={'grey'} label={'카테고리 선택'} value={''}/>
                                            {
                                                this.state.categoryList.map((category, key)=>(
                                                    <PickerItem label={category} value={category} key={key}/>
                                                ))

                                            }
                                        </Picker>
                                        <Item inlinelabel >
                                            <Label style={{width:'18%'}}>가격</Label>
                                            <Input autoCapitalize='none'
                                                   keyboardType="numeric"
                                                   onChangeText={(text) => this.writePost(text, "price")}
                                            >{this.props.route.params.detailPost.price}</Input>

                                        </Item>
                                        <Item  inlinelabel style={{ marginTop: '5%' }} >
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
                                                        <Image style={styles.post} source={{uri: item.uri}} /> )}
                                                />
                                            </Item>
                                        }

                                        <Textarea rowSpan={8} placeholder="게시글 내용을 입력해주세요." autoCapitalize='none'
                                                  onChangeText={(text) => this.writePost(text, "text")}
                                                  style={styles.textAreaContainer}>
                                            {this.props.route.params.detailPost.text}</Textarea>

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