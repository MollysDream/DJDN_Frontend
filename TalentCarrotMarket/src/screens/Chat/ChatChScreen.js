import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {AnimatedAbsoluteButton} from 'react-native-animated-absolute-buttons';

import AsyncStorage from '@react-native-community/async-storage';
import requestUser from "../../requestUserAPI";
import request from '../../requestAPI';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


// let roomById;
let userData;

function ChatChScreen({navigation}) {
      const [currentId, setCurrentId] = useState("");
      const [roomById, setRoomById] = useState([]);
      useEffect(()=>{
        async function loadingCurrentId(){
            AsyncStorage
                .getItem('user_id')
                .then((value) => {
                    setCurrentId(value);
                });
            }
        loadingCurrentId();
      },[]);

      useEffect(()=>{
        async function loadingRoom(){
          console.log("현재 사용자 ID : ",currentId);
          if(currentId){
            const roomInfo = await request.getChatRoomById(currentId);
            userData = await requestUser.getUserData(currentId);
          }
          console.log("uuuuuuuusssssssseeerrr : " , userData);
          setRoomById(roomInfo);

        }
        loadingRoom();
      },[currentId]);

      function returnFlatListItem(item,index){
        return(
            <TouchableHighlight onPress={() => {navigation.navigate('chatchroom', {postOwner: userData, roomInfo: item})}}>
                <View style={styles.post}>
                    <Text  style={styles.postTitle}>{item.postId}</Text>
                </View>
            </TouchableHighlight>
        );
    }



      return (
        <View style={styles.container}>
            <FlatList
                    data={roomById}
                    keyExtractor={(item,index) => String(item._id)}
                    renderItem={({item,index})=>returnFlatListItem(item,index)}
                    //onEndReached={this.morePage}
                    onEndReachedThreshold={1}
                    //extraData={this.state.rerender}
                    //refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshPage} />}
                />
      </View>
      );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1
    },    btn2: {
      flex: 1,
      width: 300,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
    },
    post:{
      flexDirection: "row",
      alignItems : "center",
      backgroundColor: "#FFFFFF",
      borderBottomColor: "#AAAAAA",
      borderBottomWidth: 1,
      padding: 5,
      height: 150
  },
  btnArea2: {
      height: hp(10),
      // backgroundColor: 'orange',
      paddingTop: hp(1.5),
      paddingBottom: hp(1.5),
      alignItems: 'center',
    },
    listDescription: {
      fontSize: 16
    },
    container: {
      flex: 1,
      height:400,
      },
  });
export default ChatChScreen;
