import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Button, Image, TouchableHighlight, ScrollView
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import requestAdverAPI from "../../requestAdverAPI";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {getDate} from "../../function";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/MaterialIcons";


import Modal from "react-native-modal";
import Postcode from "@actbase/react-daum-postcode";

function AdverStatusScreen(props,navigation){
    const [adverInfo, setAdverInfo] = useState("");

    const select = props.data;
    const navigations = useNavigation();

    const isFocused = useIsFocused();

    let adver;

    async function getadver(){
        adver = await requestAdverAPI.getAdver();
        setAdverInfo(adver);
        setCurrentLocation('전체');
    }

    useEffect(() => {
        getadver();
    }, [isFocused]);

    function returnFlatListItem(item,index){
        let time = getDate(item.date);

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

                    <Text style={styles.Address}>{`${time}`}</Text>
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

                            <Text style={styles.Address}>{`${time}`}</Text>
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



    const [filterModal, setFilterModal] = useState(false);
    const[currentLocation, setCurrentLocation] = useState('전체');

    function filterModalButton() {
        setFilterModal(!filterModal);
    }

    async function selectByPostcode(data){

        let adverData = await requestAdverAPI.getAdverByAddressName(data.bname);
        setAdverInfo(adverData);

        setCurrentLocation(data.bname);
        setFilterModal(!filterModal);
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

             <Modal isVisible={filterModal}>
                 <ScrollView style={{ padding:3,height:hp(85), width:wp(95)}}>

                     <Postcode
                         style={{ height:hp(80), marginTop:20, marginRight: 30 }}
                         jsOptions={{ animated: true }}
                         onSelected={data => selectByPostcode(data)}
                     />

                     <TouchableOpacity onPress={()=>setFilterModal(!filterModal)}
                                       style={{position:'absolute',top:3,right:5}}>
                         <Icon2 name="cancel"  size={40} color="#c18aff" />
                     </TouchableOpacity>

                 </ScrollView>

             </Modal>

             <TouchableOpacity onPress={()=>filterModalButton()}
                               style={{position:'absolute',bottom:10,right:10,alignSelf:'flex-end'}}>
                 <Icon name="search-location"  size={50} color="purple" />
             </TouchableOpacity>

             <View style={{position:'absolute',bottom:70,right:10, backgroundColor:"#ebdbff", padding:3, borderRadius:100}}>
                 <TouchableOpacity onPress={()=>getadver()} style={{alignSelf:'flex-end',flexDirection:'row'}}>
                     <Text >{`${currentLocation} 광고 확인중`}</Text>
                     {
                         currentLocation =='전체'?null:
                             <Icon2 name="cancel"  size={20} color="#c18aff" />
                     }
                 </TouchableOpacity>
             </View>


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
