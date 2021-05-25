import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image, FlatList, ScrollView, Alert
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

import { useNavigation } from '@react-navigation/native';

import Modal from "react-native-modal";
import request from "../../requestAPI";
import {Picker} from "@react-native-picker/picker";


const UserReportScreen = ({navigation}) => {

    const [reportData, setReportData] = useState([]);

    async function getReportData(category){
        let data = await requestReportAPI.getUserReport(category);
        setReportData(data);
    }
    useEffect(() => {

        getReportData('');
    }, [rerender]);


    const returnReportFlatListItem = (item,index)=>{
        let time = getDate(item.date);

        let reportUser = item.reportUser;
        let targetUser = item.targetUser;
        let targetPost = item.targetPost;
        let status = '사용자 신고';
        let title = <Text style={[styles.postTitle, {color:'#ff7070'}]}>{targetUser.nickname}</Text>
        let image = <Image style={styles.profileImage} source={{ uri: targetUser.profileImage}} />
        let statusStyle = styles.user_sign

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

                    {
                        item.done?
                            <View style={styles.done}>
                                <Text>처리완료</Text>
                            </View>
                            :
                            null
                    }

                </TouchableOpacity>
            </View>
        );
    }

    const [detailModal, setDetailModal] = useState(0);
    const [currentData, setCurrentData] = useState();
    const navigations = useNavigation();

    const [rerender, setRerender] = useState(false);

    function detailReport(item) {
        setCurrentData(item);
        setDetailModal(!detailModal);
    }

    function deleteReport(){
        Alert.alert("확인","신고를 삭제 하실건가요?",[
            {text:'네', style:'cancel',
                onPress:async()=>{
                    await requestReportAPI.deleteReport(currentData._id);
                    let updateData = reportData.filter(obj=>{

                        return obj._id !== currentData._id
                    })
                    setReportData(updateData);
                    setRerender(!rerender);
                    setDetailModal(!detailModal);
                }
            },
            {text:'아니요', style:'cancel'}
        ])
    }

    async function blockUser(){
        await requestReportAPI.banUser(currentData.targetUser._id);
        let updateData = reportData.filter(obj=>{

            if(obj.targetUser._id == currentData.targetUser._id){
                obj.targetUser.ban = true;
                obj.done = true;
            }
            return true
        })
        setReportData(updateData);
    }

    async function unBlockUser(){
        await requestReportAPI.unBanUser(currentData.targetUser._id);
        let updateData = reportData.filter(obj=>{

            if(obj.targetUser._id == currentData.targetUser._id){
                obj.targetUser.ban = false;
                obj.done = false;
            }
            return true
        })
        setReportData(updateData);

    }

    // 카테고리 관련 함수
    const [category, setCategory] = useState('');
    const categoryList = ['비매너', '욕설', '성희롱', '또라이', '기타']

    return (
        <View style={{height:'95%'}}>
            <Picker
                onValueChange={(value) => getReportData(value)}
                placeholder='카테고리'
            >
                <Picker.Item color={'grey'} label={'카테고리 선택'} value={''}/>
                {
                    categoryList.map((category, key)=>(
                        <Picker.Item label={category} value={category} key={key}/>
                    ))

                }
            </Picker>

            <FlatList
                data={reportData}
                keyExtractor={(item,index) => String(item._id)}
                renderItem={({item,index})=>returnReportFlatListItem(item,index)}
                extraData={rerender}
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

                            <Text style={styles.buttonText}>{`'${currentData.targetUser.nickname}' 사용자 신고 내용`}</Text>

                        </View>

                        <View style={{flexDirection:'row', paddingLeft:5, paddingRight:5, width:'100%'}}>
                            <View >

                                <View style={styles.modal_profile}>
                                    <Image style={styles.profileImage} source={{ uri: currentData.targetUser.profileImage}} />
                                    <Text style={{fontSize:20, fontWeight:'bold'}}>{currentData.targetUser.nickname}</Text>
                                </View>

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
                                currentData.targetUser.ban?
                                    <TouchableOpacity style={[styles.function,{backgroundColor:'#ff6b58'}]} onPress={()=>unBlockUser()}>
                                        <Text style={styles.functionText}>사용자 차단 해제</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.function} onPress={()=>blockUser()}>
                                        <Text style={styles.functionText}>사용자 차단</Text>
                                    </TouchableOpacity>
                            }

                            <TouchableOpacity style={styles.function} onPress={()=>deleteReport()}>
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
    done:{
        backgroundColor:'#ff2e2e',
        borderRadius:3,
        position:'absolute',
        right:5,
        top:35,
        padding:3
    },
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

export default UserReportScreen;
