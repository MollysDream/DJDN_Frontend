import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';

import request from "../requestAPI";


export default class AroundScreen extends Component{

    constructor(props){
        super(props);
        this.state = {infos:[]}
    }
    async componentDidMount(){

        const data={
            title:"DDD!",
            image: ["https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/20190212_141450.jpg", "https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/20190308_173803(0).jpg"],
            text: "몰리랑 같이 산책할 사람 찾아요!",
            category:["애견"],
            tag:["애견"],
        }
        await request.createPost(data);
    }

    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text> 주재!</Text>
            </View>
        );
    }
}
