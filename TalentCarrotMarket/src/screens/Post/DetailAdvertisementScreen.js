import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image, TouchableWithoutFeedback, TouchableHighlight, ScrollView, Modal
} from 'react-native';
import {Container, Content, Form, Header, Input, Item, Label, Left, Right, Textarea} from "native-base";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { SliderBox } from "react-native-image-slider-box";
import {getAdEndDate, getDate} from "../../function";

const DetailAdvertisementScreen = (props) => {

    const [advertisement, setadver] = useState(props.route.params.item);

    const [modalVisible, setMv] = useState(false);
    const [modalImage, setMi] = useState(0);


    useEffect(() => {
        console.log(advertisement);
    }, []);

    function onImagePress(index){
        setMv(!modalVisible);
        setMi(index);
    }


    function seeLocation(){
        setMapModal(!mapModal)
    }

    return (
        <ScrollView>
            <Content>

                <Modal animationType={"fade"} transparent={false}
                       visible={modalVisible}
                       onRequestClose={() => { console.log("Modal has been closed.") }}>
                    <View style={styles.modal}>
                        <TouchableHighlight onPress={() => { setMv(!modalVisible) }}>
                            <Image
                                style={{ width: '100%', height: '100%', resizeMode:"contain" }}
                                source={{ uri: advertisement.image[modalImage] }}
                            />
                        </TouchableHighlight>
                    </View>
                </Modal>

                <Item >
                    <View>
                        <SliderBox
                            images={advertisement.image}
                            sliderBoxHeight={350}
                            onCurrentImagePressed={index => onImagePress(index)}
                            dotColor="#3AC2FF"
                            inactiveDotColor="#d2f0ff"
                            ImageComponentStyle={{borderRadius: 15, width: '100%'}}
                        />
                    </View>
                </Item>
                <Text style={{fontSize:20, fontWeight : 'bold', marginLeft : '3%', marginTop : '3%',  marginBottom : '3%'}}>
                    {`${advertisement.title}`}
                </Text>
                <Item>
                    <Text style={{fontSize:15, color : "grey",marginBottom : '2%', marginLeft : "3%"}}>
                        {getDate(advertisement.date)}
                    </Text>
                </Item>

                <Item>
                    <Text style={{fontSize:16, marginTop : '7%',marginBottom : '20%', marginLeft : '3%'}}>
                        {`${advertisement.text}`}
                    </Text>
                </Item>

                <Item>
                    <View style={{flexDirection:'column'}}>
                        <Text style={{fontSize: 15 , marginLeft : "3%",marginTop : '5%',marginBottom : '10%'}}>
                            {
                                advertisement.price===0?
                                    `  가격: 없음`:`  가격: ${advertisement.price}원`
                            }
                        </Text>
                        <Text style={{fontSize: 15 , marginLeft : "3%",marginTop : '5%',marginBottom : '10%'}}>
                            {
                                advertisement.phoneNumber?
                                    `  연락처: ${advertisement.phoneNumber}`:`  연락처: 없음`
                            }
                        </Text>
                    </View>
                </Item>

            </Content>
        </ScrollView>



    );
}


const styles = StyleSheet.create({
    locationModalText:{
        alignSelf:'center', fontSize:20, fontWeight:'bold', margin:10
    },

    ruleButton:{
        width:'50%',
        borderRadius: 10,
        borderColor:'purple',
        borderWidth:1,
        paddingTop:4,
        paddingBottom:4

    },
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
        alignSelf : "center",
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
export default DetailAdvertisementScreen;

