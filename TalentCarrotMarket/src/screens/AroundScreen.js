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
        console.log("안녕 친구들")
        const infos = await request.userTest();
        console.log(infos);
        //this.setState({infos:infos});
        //console.log(this.state.infos);
        const data={
            title: "Moooooly",
            content: "Ih"
        }
        //await request.postInfo(data);
    }

    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text> 주재!</Text>
            </View>
        );
    }
}
