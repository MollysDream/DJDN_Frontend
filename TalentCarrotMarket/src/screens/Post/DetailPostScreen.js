import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet, Image, FlatList, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import request from "../../requestAPI";
import {Container, Content, Form, Header, Input, Item, Label, Left, Right, Textarea} from "native-base";
import requestUser from "../../requestUserAPI";
import {FlatListSlider} from 'react-native-flatlist-slider';
import AsyncStorage from "@react-native-community/async-storage";


export default class SearchPostScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            detailPost:this.props.route.params.detailPost,
            postOwner:this.props.route.params.postOwner,
            postImages:this.props.route.params.postImages
        }
    }

    async componentDidMount() {
        //게시글 조회수 증가
        await request.updatePostView({
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


    render(){
        const item = this.state.detailPost;
        var slice_date = item.date.split("T");
        const postOwner = this.state.postOwner;
        const images = this.state.postImages;
        //console.log(slice_date);
        return (
            <Container>
                <TouchableWithoutFeedback >
                    <KeyboardAvoidingView>
                        <ScrollView style={{ marginTop : '3%' }}>
                            <Container>
                                <Content>
                                   
                                <Item >
                                    <View>
                                        <FlatListSlider
                                            data={images}
                                            width={275}
                                            autoscroll={false}
                                            onPress={(item) => console.log(item)}
                                            indicatorActiveWidth={15}
                                            contentContainerStyle={{paddingHorizontal: 16}}
                                            separatorWidth={16}
                                            loop={false}
                                        />
                                    </View>
                                </Item>
                                <Item >
                                    <Text style={{fontSize:15, marginBottom : "3%", marginTop : "3%" ,marginLeft : "3%"}}>
                                        {`${postOwner.nickname}`}
                                        </Text>
                                </Item>
                              
                                    <Text style={{fontSize:20, fontWeight : 'bold', marginLeft : '3%', marginTop : '3%',  marginBottom : '3%'}}>
                                      {`${item.title}`}
                                    </Text>
                                    
                                <Item >
                                    <View>
                                        <Text style={{fontSize:15, color : "grey",marginBottom : '2%', marginLeft : "3%"}}>
                                            {`  ${item.category}`}
                                            {"    "}
                                            {slice_date[0]}
                                        </Text>
                                    </View>
                                </Item>
                                <Item >
                                   
                                        <Text style={{fontSize:15, marginTop : '7%',marginBottom : '20%', marginLeft : '3%'}}>
                                            {`${item.text}`}
                                        </Text>
                                </Item>
                                <Item >
                                    <Left>
                                        <Text style={{fontSize: 15 , marginLeft : "3%",marginTop : '10%',marginBottom : '10%'}}>
                                        {`  가격 ${item.price}`}
                                        </Text>
                                    </Left>
                                    <Right>
                                    <Text style={{fontSize:15, color : "grey", marginRight : "10%", marginTop : "10%",marginBottom : '10%'}}>
                                            {`조회수: ${item.view + 1}`}
                                    </Text>
                                    </Right>
                                </Item>    
                                <View style={styles.btnArea2} >
                                    <TouchableOpacity style={styles.btn2} onPress={() => this.props.navigation.navigate('chat',{postOwner})}>
                                        <Text style={(styles.Text, {color: 'white'})}>채팅</Text>
                                    </TouchableOpacity>
                                </View>
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
        borderBottomColor: "#AAAAAA",
        borderBottomWidth: 1,
        padding: 5,
        height: 150,
        width: 150,
    }, 
    btn2: {
        flex: 1,
        width: 300,
        height: 50,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4672B8',
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
    postTitle:{fontSize:18, fontWeight: "bold", paddingLeft : 5},
    postTime: {fontSize:13},
    postPrice: {fontSize:13}

});
