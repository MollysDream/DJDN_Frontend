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
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import {SearchBar} from 'react-native-elements';
import request from "../../requestAPI";
import {Container, Content, Form, Header, Input, Item, Label, Right, Textarea} from "native-base";
import Icon from "react-native-vector-icons/Entypo";
import requestUser from "../../requestUserAPI";
import {FlatListSlider} from 'react-native-flatlist-slider';

export default class SearchPostScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            detailPost:this.props.route.params.detailPost,
            postOwner:[],
            postImages:this.props.route.params.postImages
        }
    }

    async componentDidMount() {
        //post 스키마에 저장된 user_id 값으로 사용자 정보 받아와야 됨
        const userData = await requestUser.getUserData("teller2016@ajou.ac.kr");
        console.log(`사용자의 닉네임 ${userData.nickname}`);
        this.setState({
            postOwner:userData
        })

    }


    render(){
        const item = this.state.detailPost;
        const postOwner = this.state.postOwner;
        const images = this.state.postImages;
        return (
            <Container>
                <Header>
                    <Text style={{fontSize:20}}>
                        {item.title}
                    </Text>
                </Header>
                <TouchableWithoutFeedback >
                    <KeyboardAvoidingView>
                        <ScrollView style={{ marginTop : '3%' }}>
                            <Container>
                                <Content>
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

                                    <View>
                                        <Text>{`카테고리: ${item.category}`}</Text>
                                    </View>

                                    <View>
                                        <Text>{`내용: ${item.text}`}</Text>
                                    </View>

                                    <View>
                                        <Text>{`조회수: ${item.view}`}</Text>
                                    </View>

                                    <View>
                                        <Text>{`가격: ${item.price}`}</Text>
                                    </View>

                                    <View>
                                        <Text>{`게시자: ${postOwner.nickname}`}</Text>
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
