import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Button, Image, TouchableHighlight
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-community/async-storage';
import requestAdverAPI from "../../requestAdverAPI";
import {useIsFocused} from "@react-navigation/native";
import requestUser from "../../requestUserAPI";


function AdverStatusScreen(props){
    const [adverInfo, setAdverInfo] = useState("");

    let adver;
    //인증한 동네 확인 - 사용자
    useEffect(() => {
        async function getadver(){
            adver = await requestAdverAPI.getAdver();
            setAdverInfo(adver);
        }
        getadver();
    }, []);

    function returnFlatListItem(item,index){
        const itemActive = item.active;
        
        return (
            <View>
            {
                itemActive == false && props.route.params.select == false ?
                <TouchableHighlight onPress={() => {props.navigation.navigate('modifyactive', {item})}}>
                <View style={styles.chatRoomBox}>
                    <Image style={styles.post_image} source={{ uri: item.image[0]}} />
                    <View style={{flexDirection:'column'}}>
                        <Text style={styles.postTitle}>{item.title}</Text>
                        <View style={styles.userDataBox}></View>
                            <Text style={{fontSize:11, color:'grey'}}>{item.addressName}</Text>
                            
                                <Text style={{fontSize:11, color:'grey'}}>요청 대기 중</Text>
                              
                        <View style={styles.user_data_text}></View>
                    </View>
                </View>
                </TouchableHighlight>:null
            }
{
                itemActive == true && props.route.params.select == true ?
                <TouchableHighlight onPress={() => {props.navigation.navigate('modifyactive', {item})}}>
                <View style={styles.chatRoomBox}>
                    <Image style={styles.post_image} source={{ uri: item.image[0]}} />
                    <View style={{flexDirection:'column'}}>
                        <Text style={styles.postTitle}>{item.title}</Text>
                        <View style={styles.userDataBox}></View>
                            <Text style={{fontSize:11, color:'grey'}}>{item.addressName}</Text>
                            
                                <Text style={{fontSize:11, color:'grey'}}>광고중</Text>
                              
                        <View style={styles.user_data_text}></View>
                    </View>
                </View>
                </TouchableHighlight>:null
            }


           </View>
            )
        }

    return (
         <TouchableHighlight>
        <View style={styles.chatRoomBox}>
            <FlatList
                    data={adverInfo}
                    keyExtractor={(item,index) => String(item._id)}
                    renderItem={({item,index})=>returnFlatListItem(item,index)}
                    //onEndReached={this.morePage}
                    onEndReachedThreshold={1}
                    //extraData ={rerender}
                    //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                   />
            </View>
        </TouchableHighlight>

    );
}



const styles = StyleSheet.create({
    container:{
      //borderWidth:1,
        flex:1,
        paddingTop:5

    },
    chatRoomBox:{
        //borderBottomWidth: 1,
        marginRight:10,
        marginLeft:10,
        marginBottom:5,
        backgroundColor:'#c2ebff',
        borderRadius:10,
        flexDirection:'row'

    },
    postTitle:{
        fontSize:15,
        paddingTop:7,
        //borderWidth:1,
        width:170,

    },
    userDataBox:{
        flexDirection:'row',
        paddingTop: 5
    },
    post_image:{
        width: wp(20),
        overflow:"hidden",
        height: hp(20),
        aspectRatio: 1,
        borderRadius: 9,
        marginRight:12
    },
    user_image:{
        width: wp(10),
        overflow:"hidden",
        height: hp(10),
        aspectRatio: 1,
        borderRadius: 40,
        marginRight:7,
        marginTop:1
    },
    user_data_text:{
        marginTop: 2,
        marginRight: 13
    },
    chat_text:{
        paddingTop: 18,
        color:'grey'
    },
    chatTime_text:{
        position:'absolute',
        right: 12,
        top: 10,
        color:'grey'
    }

});


export default AdverStatusScreen;
