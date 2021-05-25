import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image, FlatList, ScrollView
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-community/async-storage';
import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";
import {useIsFocused} from "@react-navigation/native";
import requestReportAPI from "../../requestReportAPI";
import {getDate, getPrice} from "../../function";
import Icon3 from "react-native-vector-icons/Entypo";
import Icon4 from "react-native-vector-icons/MaterialIcons";


import Modal from "react-native-modal";


const AllReportScreen = ({navigation}) => {

    const [reportData, setReportData] = useState([]);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        async function getReportData(){
            let data = await requestReportAPI.getAllReport();
            setReportData(data);
        }

        getReportData();
    }, []);


    const returnReportFlatListItem = (item,index)=>{
        let time = getDate(item.date);

        let reportUser = item.reportUser;
        let targetUser = item.targetUser;
        let targetPost = item.targetPost;
        let status = null
        let title = null
        let image = null
        let statusStyle = styles.status_none
        if(item.reportWhat === 0){
            status = '게시글 신고';
            statusStyle = styles.post_sign
            title = <Text style={[styles.postTitle, {color:'#ff9e51'}]}>{targetPost.title}</Text>
            image = <Image style={[styles.profileImage, {borderRadius:10, borderColor:'orange'}]} source={{ uri: targetPost.image[0]}} />

        }
        else if(item.reportWhat ===1){
            status = '사용자 신고';
            statusStyle = styles.user_sign
            title = <Text style={[styles.postTitle, {color:'#ff7070'}]}>{targetUser.nickname}</Text>
            image = <Image style={styles.profileImage} source={{ uri: targetUser.profileImage}} />
        }

        return(
            <View style={{marginBottom:10}}>
                <TouchableOpacity onPress={()=>detailReport(item)}>
                    <View style={styles.post}>
                        <Text style={styles.Time}>{`${time}`}</Text>
                        <Text style={[styles.Time,{top:70}]}>{`신고 by.${reportUser.nickname}`}</Text>

                        {image}
                        <View style={{flexDirection:'column', marginLeft:10}}>
                            <View style={{flexDirection:'row'}}>
                                <View style={statusStyle}>
                                    <Text>{status}</Text>
                                </View>
                                <Text> - </Text>
                                <View style={statusStyle}>
                                    <Text>{item.reportCategory}</Text>
                                </View>
                            </View>

                            <View style={{flexDirection:'row'}}>
                                {title}
                            </View>

                            <View style={{flexDirection:'row'}}>

                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    const [detailModal, setDetailModal] = useState(0);
    const [currentData, setCurrentData] = useState();

    function detailReport(item) {
        setCurrentData(item);
        setDetailModal(!detailModal);
    }

    function goToDetailPostScreen() {
        setDetailModal(!detailModal);
        const postImages = []
        currentData.targetPost.image.map((image)=>{
            let temp={
                image:image,
                desc:image,
            }
            postImages.push(temp);
        })
        navigation.push('DetailPost',{detailPost: currentData.targetPost, postImages: postImages, postOwner: currentData.targetUser});
    }

    return (
        <View style={{height:'95%'}}>

            <FlatList
                data={reportData}
                keyExtractor={(item,index) => String(item._id)}
                renderItem={({item,index})=>returnReportFlatListItem(item,index)}
            />

            {currentData == undefined?null:
                <Modal isVisible={detailModal}>
                    <View style={styles.modalBox}>

                        <View style={styles.buttonList} >

                            <TouchableOpacity style={styles.cancleIcon} onPress={()=>{
                                setDetailModal(!detailModal)
                                setCurrentData();
                            }}>
                                <Icon3 name="back"  size={40} color="orange" />
                            </TouchableOpacity>

                            <Icon4 style={[styles.iconPlace]} name="report"  size={46} color="orange" />
                            {
                                currentData.reportWhat==0?
                                    <Text style={styles.buttonText}>{`'${currentData.targetUser.nickname}'의 게시물 신고 내용`}</Text>
                                    :
                                    <Text style={styles.buttonText}>{`'${currentData.targetUser.nickname}' 사용자 신고 내용`}</Text>
                            }
                        </View>

                        <View style={{flexDirection:'row', paddingLeft:5, paddingRight:5, width:'100%'}}>
                            <View >

                                {
                                    currentData.reportWhat==0?
                                        <View style={styles.modal_profile}>
                                            <Image style={[styles.profileImage, {borderRadius:10, borderColor:'orange'}]} source={{ uri: currentData.targetPost.image[0]}} />
                                            <Text style={{fontSize:17, fontWeight:'bold'}}>{currentData.targetPost.title}</Text>
                                        </View>
                                        :
                                        <View style={styles.modal_profile}>
                                            <Image style={styles.profileImage} source={{ uri: currentData.targetUser.profileImage}} />
                                            <Text style={{fontSize:20, fontWeight:'bold'}}>{currentData.targetUser.nickname}</Text>
                                        </View>

                                }

                            </View>

                            <View style={{flexDirection:'column', paddingTop:5, paddingLeft:10,paddingRight:8, width:'62%'}}>
                                <Text style={{fontSize:17, fontWeight:'bold', color:'grey'}}>신고 유형</Text>
                                <View style={[styles.post_sign,{alignSelf:'flex-start'}]}>
                                    <Text style={{fontSize:20, fontWeight:'bold'}}>{currentData.reportCategory}</Text>
                                </View>

                                <Text style={{fontSize:17, fontWeight:'bold', color:'grey'}}>신고 설명</Text>
                                <Text style={{fontSize:20, fontWeight:'bold'}}>{currentData.text}</Text>

                                <Text style={{fontSize:15, color:'grey', alignSelf:'flex-end'}}>{`신고 by.${currentData.reportUser.nickname}`}</Text>
                            </View>


                        </View>

                        <View style={styles.functionBox}>
                            {
                                currentData.reportWhat==0?
                                    <TouchableOpacity style={styles.function} onPress={()=>goToDetailPostScreen()}>
                                        <Text style={styles.functionText}>게시글 확인</Text>
                                    </TouchableOpacity>
                                    :
                                    null

                            }

                            <TouchableOpacity style={styles.function}>
                                <Text style={styles.functionText}>사용자 차단</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.function}>
                                <Text style={styles.functionText}>신고 삭제</Text>
                            </TouchableOpacity>
                        </View>






                    </View>


                </Modal>
            }


        </View>


    );
}


const styles = StyleSheet.create({
    functionText:{
        fontSize:20,

    },
    function:{
        backgroundColor:'#ffc19b',
        alignItems: 'center',
        width:'50%',
        borderRadius:10,
        marginTop:5

    },
    functionBox:{
        flexDirection:'row',
        flexWrap:'wrap'
    },
    modal_profile:{
        flexDirection:'column', alignItems:'center',
        width:135
    },
    modalBox:{
      backgroundColor:'white',
        borderRadius:10,
        paddingBottom:5,
        paddingLeft:3,
        paddingRight:3

    },
    buttonList: {
        //borderWidth:1,
        height:55,
        flexDirection:'row',
        backgroundColor: '#ffe8d8',
        borderRadius: 20,
        marginBottom:7,
    },
    iconPlace: {
        height:'100%',
        marginLeft:10,
        paddingTop: 5

    },
    buttonText:{
        fontSize: 20,
        color:'black',
        height:'100%',
        paddingTop:13,
        //borderWidth:1,
        marginLeft: 13
    },
    cancleIcon:{
        position:'absolute',
        top:7,
        right:12
    },
    post:{
        flexDirection: "row",
        borderRadius: 15,
        backgroundColor: "white",
        borderBottomColor: "orange",
        borderBottomWidth: 1,
        padding: 10,
    },
    postTitle:{fontSize:18, fontWeight: "bold", width:"75%", paddingTop:5},
    Time: {fontSize:13, textAlign:'right', position:'absolute',right:5,top:8, marginRight:3},
    profileImage:{
        width: wp(20),
        overflow:"hidden",
        height: hp(20),
        aspectRatio: 1,
        borderRadius: 100,

        borderWidth:2,
        borderColor:'#ff8a8a',
    },
    post_sign:{
        backgroundColor:'#ffb074',
        padding: 3,
        borderRadius: 7
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

export default AllReportScreen;
