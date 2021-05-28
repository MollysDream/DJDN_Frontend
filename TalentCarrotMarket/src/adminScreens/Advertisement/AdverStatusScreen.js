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
import {useIsFocused, useNavigation} from "@react-navigation/native";
import requestUser from "../../requestUserAPI";
import requestUserAPI from "../../requestUserAPI";


function AdverStatusScreen(props,navigation){
    const [adverInfo, setAdverInfo] = useState("");

    const select = props.data;
    const navigations = useNavigation();

    const isFocused = useIsFocused();

    let adver;

    useEffect(() => {
        async function getadver(){
            adver = await requestAdverAPI.getAdver();
            setAdverInfo(adver);
        }
        getadver();
    }, [isFocused]);

    function returnFlatListItem(item,index){
        const itemApprove = item.approve;
        let status = null;
        let statusStyle = styles.post_sign
        if(item.approve === false){
            status='승인 대기중'
        }
        else if(item.approve ===true){
            status = '광고중';
        }

        return (
            <>
            {
                itemApprove == false && select == false ?
                <TouchableHighlight onPress={() => {navigations.navigate('modifyapprove', {item})}}>
                <View style={styles.post}>

                    <Text style={[styles.Address,{top:53}]}>{`${item.addressName}`}</Text>
                    <Text style={[styles.Address,{top:70, fontSize:15, fontWeight:'bold'}]}>{`신청자 - ${item.shopOwner.nickname}`}</Text>
                    <Image style={styles.profileImage} source={{ uri: item.image[0]}} />

                    <View style={{flexDirection:'column', marginLeft:10}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.postTitle}>{item.title}</Text>
                        </View>

                        <View style={[statusStyle,{marginTop:3}]}>
                            <Text>{status}</Text>
                        </View>
                    </View>

                </View>
                </TouchableHighlight>
                    : null
            }
            {
                itemApprove == true && select == true ?
                    <TouchableHighlight onPress={() => {navigations.navigate('modifyapprove', {item})}}>
                        <View style={styles.post}>

                            <Text style={[styles.Address,{top:53}]}>{`${item.addressName}`}</Text>
                            <Text style={[styles.Address,{top:70, fontSize:15, fontWeight:'bold'}]}>{`신청자 - ${item.shopOwner.nickname}`}</Text>
                            <Image style={styles.profileImage} source={{ uri: item.image[0]}} />

                            <View style={{flexDirection:'column', marginLeft:10}}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.postTitle}>{item.title}</Text>
                                </View>

                                <View style={[statusStyle,{marginTop:3, backgroundColor:'#9c7eff'}]}>
                                    <Text>{status}</Text>
                                </View>
                            </View>

                        </View>
                    </TouchableHighlight>
                    : null
            }

           </>
            )
        }

    return (
         <View style={{height:'95%'}}>
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

    );
}



const styles = StyleSheet.create({



    post:{
        flexDirection: "row",
        borderRadius: 15,
        backgroundColor: "white",
        borderBottomColor: "purple",
        borderBottomWidth: 1,
        padding: 10,
    },
    postTitle:{
        fontSize:18,
        fontWeight: "bold",
        width:"75%",
        paddingTop:5,
        color:'#7751ff'
    },
    Address: {fontSize:13, textAlign:'right', position:'absolute',right:10,top:15, marginRight:3},
    profileImage:{
        width: wp(20),
        overflow:"hidden",
        height: hp(20),
        aspectRatio: 1,
        borderRadius: 10,

        borderWidth:2,
        borderColor:'#c18aff',
    },
    post_sign:{
        backgroundColor:'#d9c8ee',
        padding: 3,
        borderRadius: 7,
        alignSelf:'flex-start',
    },
    user_sign:{
        backgroundColor:'#ffaeae',
        padding: 3,
        borderRadius: 7
    },
    status_none:{
        position: 'absolute'
    },

});


export default AdverStatusScreen;
