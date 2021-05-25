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



export default class DetailReportPostScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            detailPost:this.props.route.params.detailPost,
            postOwner:this.props.route.params.postOwner,
            postImages:this.props.route.params.detailPost.image,
            modalVisible:false,
            modalImage:0,
            userId:'',
            currentUserId:''
        }
    }

    async componentDidMount() {

        const userId = await AsyncStorage.getItem('user_id');
        this.setState({userId:userId})
        this.setState({currentUserId:userId})


    }

    onImagePress(index){
        this.setState({
            modalVisible:true,
            modalImage:index
        })
    }



    render(){
        const item = this.state.detailPost;
        var slice_date = item.date.split("T");
        const postOwner = this.state.postOwner;
        const postOwnerId = this.state.postOwner._id;
        const currentUserId = this.state.currentUserId;
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
                            <Item style={{marginTop:10, paddingBottom:10, flexDirection:'row'}} >
                                <TouchableOpacity style={{ flexDirection:'row'}}>
                                    <Image style={styles.profileImage} source={{ uri: postOwner.profileImage}}/>
                                    <View style={{flexDirection:'column', paddingTop:9}}>
                                        <Text style={{color:'grey',fontSize:13}}>{`${item.addressName}의`}</Text>
                                        <Text style={{fontSize:17, marginBottom : "3%", marginTop : "3%" }}>
                                            {`${postOwner.nickname}님`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>


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

                        </Content>
                    </Container>
                </TouchableWithoutFeedback>
            </Container>


        );
    }
}

const styles = StyleSheet.create({
    profileImage:{
        borderWidth:2,
        borderColor:'#65b7ff',
        borderRadius:50,
        height:60,
        width:60,
        overflow:"hidden",
        aspectRatio: 1,
        marginRight:12,
        marginLeft:12,
    },
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
