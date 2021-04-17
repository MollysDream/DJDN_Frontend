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
            title:"몰리 산책",
            content:{
                image:"https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/20190308_173803(0).jpg",
                text:"귀여운 몰리 산책시켜 줄사람!!!"
            },
            category:["애견","산책"],
            tag:["산책"],
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
