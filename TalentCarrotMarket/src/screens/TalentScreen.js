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
import * as SMS from 'expo-sms';
import {Container, Content, Form, Header, Input, Item, Label, Left, Right, Textarea} from "native-base";
import { SliderBox } from "react-native-image-slider-box";
import AsyncStorage from "@react-native-community/async-storage";
// import {getDate, getPrice} from "../../function";

export default class TalentScreen extends Component{


    SMS = async () => {


    }


    render(){
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Talent!</Text>
            <Button title={'SMS 보내기!'} onPress={this.SMS}/>
          </View>


        );
    }
};

const styles = StyleSheet.create({
  iconBox:{
    height:67,
    alignItems: 'center',
    marginTop:3
  },
  icon:{
    width: wp(9),
    overflow:"hidden",
    height: hp(9),
    aspectRatio: 1,
    borderRadius: 9,
  },
  image:{
    width: wp(28),
    overflow:"hidden",
    height: hp(28),
    aspectRatio: 1,
    borderRadius: 9,
    marginRight:12
  },
  post:{
    flexDirection: "row",
    borderRadius: 15,
    backgroundColor: "white",
    borderBottomColor: "#a6e5ff",
    borderBottomWidth: 1,
    padding: 10,
    height: 136
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
  postTitle:{fontSize:18, fontWeight: "bold", width:250, height:80, paddingTop:9},
  postAddressTime: {fontSize:13, textAlign:'right', width:'30%', marginRight:10},
  postPrice: {width:'50%',fontSize:17 , color:"#0088ff" ,paddingTop: 9}
  ,
  status_ing:{
    backgroundColor:'#b4e6ff',
    position: 'absolute',
    top: 40,
    padding: 3,
    borderRadius: 7
  },
  status_complete:{
    backgroundColor:'#98afbf',
    position: 'absolute',
    top: 40,
    padding: 3,
    borderRadius: 7
  },
  status_none:{
    position: 'absolute'
  }
});


