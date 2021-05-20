import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button, Image, TouchableHighlight, Alert, TouchableOpacity
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Entypo';

import AsyncStorage from '@react-native-community/async-storage';
import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";
import {useIsFocused} from "@react-navigation/native";

import Modal from 'react-native-modal';

const CertificationScreen = ({navigation}) => {

    const [addModalVisibel, setAddModalVisible] = useState(false);

    useEffect(() => {

    }, []);


    function addCertificateModal() {
        setAddModalVisible(!addModalVisibel);
    }

    function cancelAdd(){
        console.log('취소');
        Alert.alert("확인","자격증 추가를 취소 하실건가요?",[
            {text:'확인', style:'cancel',
                onPress:()=>{
                    setAddModalVisible(!addModalVisibel);
                }
            }
        ])
    }

    return (
        <View style={styles.container}>

            <Modal isVisible={addModalVisibel}>
                <View style={styles.addModalBox}>
                    <TouchableOpacity style={styles.cancleIcon} onPress={cancelAdd}>
                        <Icon3 name="circle-with-cross"  size={35} color="#37CEFF" />
                    </TouchableOpacity>

                </View>
            </Modal>

            <View style={styles.TitleView}>
                <Icon2 style={[styles.iconPlace, {marginTop:3}]} name="certificate"  size={46} color="#37CEFF" />
                <Text style={styles.titleText}>자격증 증명</Text>
            </View>

            <View style={styles.certificateBox}>

                <TouchableOpacity style={styles.addButton} onPress={addCertificateModal}>
                    <Icon style={[styles.iconPlace, {marginTop:3}]} name="plus"  size={46} color="#00C0FF" />
                </TouchableOpacity>

            </View>




        </View>


    );
}


const styles = StyleSheet.create({
    cancleIcon:{
        position:'absolute',
        top:3,
        right:3
    },
    addModalBox:{
        margin:20,
        flex:1,
        backgroundColor:'white',
        borderRadius:10
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    TitleView: {
        //borderWidth:1,
        height:55,
        flexDirection:'row',
        backgroundColor: '#ecfeff',
        borderRadius: 20,
        marginBottom:7,
    },
    titleText:{
        fontSize: 20,
        color:'black',
        height:'100%',
        paddingTop:13,
        //borderWidth:1,
        marginLeft: 13
    },
    certificateBox: {
        paddingLeft:wp(3),
        paddingRight:wp(3)

    }, addButton: {
        borderRadius: 10,
        height: 80,
        backgroundColor:'#c5f1ff',
        alignItems:'center',
        justifyContent:'center',

    }


});

export default CertificationScreen;
