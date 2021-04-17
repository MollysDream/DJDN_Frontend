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
        /*console.log("안녕 친구들")
        const infos = await request.userTest();
        console.log(infos);*/
        //this.setState({infos:infos});
        //console.log(this.state.infos);
        /*const data={
            title: "Moooooly",
            content: "Ih"
        }*/

        const data={
            title:"턱걸이 보조해주실분 구합니다",
            content:{
                image:"https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/IMG_20191112_212153.jpg",
                text:"귀여운 몰리 산책시켜 줄사람!!!"
            },
            category:["운동","턱걸이"],
            tag:["운동"],
            view:0,
            date:Date.now()
        }
        await request.postInfo(data);
    }

    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text> 주재!</Text>
            </View>
        );
    }
}
