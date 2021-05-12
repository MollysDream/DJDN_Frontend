import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, TouchableHighlight
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import request from "../../requestAPI";
import {Container, Content, Form, Header, Input, Item, Label, Left, Right, Textarea} from "native-base";
import requestUser from "../../requestUserAPI";
import { SliderBox } from "react-native-image-slider-box";
import AsyncStorage from "@react-native-community/async-storage";
import {getDate, getPrice} from "../../function";



export default class DetailPostScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            detailPost:this.props.route.params.detailPost,
            postOwner:this.props.route.params.postOwner,
            postImages:this.props.route.params.detailPost.image,
            modalVisible:false,
            modalImage:0
        }
    }

    async componentDidMount() {
        //게시글 조회수 증가
        let result = await request.updatePostView({
            postId: this.state.detailPost._id,
            view: ++this.state.detailPost.view
        });


        //post 스키마에 저장된 user_id 값으로 사용자 정보 받아와야 됨
        /*const userData = await requestUser.getUserData(this.state.detailPost.user_id);
        console.log(`사용자의 닉네임 ${userData.nickname}`);
        this.setState({
            postOwner:userData
        })*/

    }

    onImagePress(index){
        this.setState({
            modalVisible:true,
            modalImage:index
        })
    }

    reportPost(){
        console.log("신고!!");
        this.props.navigation.navigate('Report',{detailPost: this.state.detailPost, postOwner: this.state.postOwner});
    }


    render(){
        const item = this.state.detailPost;
        var slice_date = item.date.split("T");
        const postOwner = this.state.postOwner;
        const images = this.state.postImages;
        let time = getDate(item.date);
        let price = getPrice(item.price);
        //console.log(slice_date);
        return (
            <Container>
                <TouchableWithoutFeedback >
                    <Container>
                        <Content>
                            <Modal animationType={"fade"} transparent={false}
                                   visible={this.state.modalVisible}
                                   onRequestClose={() => { console.log("Modal has been closed.") }}>
                                <View style={styles.modal}>
                                    <TouchableHighlight onPress={() => { this.setState({modalVisible:false}) }}>
                                        <Image
                                            style={{ width: '100%', height: '100%', resizeMode:"contain" }}
                                            source={{ uri: images[this.state.modalImage] }}
                                        />
                                    </TouchableHighlight>
                                </View>
                            </Modal>

                            <Item >
                                <View>
                                    <SliderBox
                                        images={images}
                                        sliderBoxHeight={350}
                                        onCurrentImagePressed={index => this.onImagePress(index)}
                                        dotColor="#3AC2FF"
                                        inactiveDotColor="#d2f0ff"
                                        ImageComponentStyle={{borderRadius: 15, width: '100%'}}
                                    />
                                </View>
                            </Item>
                            <Item style={{flexDirection:'row'}} >
                                <Text style={{fontSize:15, marginBottom : "3%", marginTop : "3%" ,marginLeft : "3%"}}>
                                    {`${item.addressName}의 ${postOwner.nickname}님`}
                                </Text>
                                <View style={styles.btnArea1}>
                                    <TouchableOpacity style={styles.btn1} onPress={()=>this.reportPost()}>
                                        <Text>신고</Text>
                                    </TouchableOpacity>
                                </View>

                            </Item>

                            <Text style={{fontSize:20, fontWeight : 'bold', marginLeft : '3%', marginTop : '3%',  marginBottom : '3%'}}>
                                {`${item.title}`}
                            </Text>

                            <Item >
                                <View>
                                    <Text style={{fontSize:15, color : "grey",marginBottom : '2%', marginLeft : "3%"}}>
                                        {`  ${item.category}`}
                                        {"  ◦ "}
                                        {time}
                                    </Text>
                                </View>
                            </Item>
                            <Item >

                                <Text style={{fontSize:16, marginTop : '7%',marginBottom : '20%', marginLeft : '3%'}}>
                                    {`${item.text}`}
                                </Text>
                            </Item>
                            <Item >
                                <Left>
                                    <Text style={{fontSize: 15 , marginLeft : "3%",marginTop : '10%',marginBottom : '10%'}}>
                                        {`  가격: ${price}원`}
                                    </Text>
                                </Left>
                                <Right>
                                    <Text style={{fontSize:15, color : "grey", marginRight : "10%", marginTop : "10%",marginBottom : '10%'}}>
                                        {`조회수: ${item.view + 1}`}
                                    </Text>
                                </Right>
                            </Item>
                            <View style={styles.btnArea2} >
                                <TouchableOpacity style={styles.btn2} onPress={() => this.props.navigation.navigate('chat',{postOwner,item})}>
                                    <Text style={(styles.Text, {color: 'white'})}>채팅</Text>
                                </TouchableOpacity>
                            </View>
                        </Content>
                    </Container>
                </TouchableWithoutFeedback>
            </Container>


        );
    }
}

const styles = StyleSheet.create({
    sliderImage:{
        paddingHorizontal: 15,

    },
    post:{
        flexDirection: "row",
        alignItems : "center",
        backgroundColor: "#FFFFFF",
        borderBottomColor: "#AAAAAA",
        borderBottomWidth: 1,
        padding: 5,
        height: 150,
        width: 150,
    },
    btn1: {
        width: 45,
        height: 40,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffefef',
    },
    btnArea1: {
        flex:1,
        alignItems: 'flex-end',
        paddingRight:10
    },
    btn2: {
        flex: 1,
        width: 300,
        height: 50,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#38b9ff',
      },
    btnArea2: {
        height: hp(10),
        // backgroundColor: 'orange',
        paddingTop: hp(1.5),
        paddingBottom: hp(1.5),
        alignItems: 'center',
      },
    cover:{
        flex: 1,
        width: 200,
        height:200,
        resizeMode: "contain"
    },
    postDetail:{
        flex:3,
        alignItems :"flex-start",
        flexDirection : "column",
        alignSelf : "center",
        padding:20
    },
    postTitle:{fontSize:18, fontWeight: "bold", width:280, height:80},
    postAddressTime: {fontSize:13, textAlign:'right', width:250, marginRight:10},
    postPrice: {fontSize:17},

    modal: {
        backgroundColor: '#000000',
        justifyContent: 'center',
    },


});
