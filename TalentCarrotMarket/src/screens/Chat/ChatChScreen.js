import React, {useState,useEffect, useCallback} from 'react';
import { Content, Container, Header, Left, Right, Title, Body, Item, Label,
  Input, Form, Textarea } from 'native-base';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
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
let count = 0;

function ChatChScreen({navigation}) {
      const [currentId, setCurrentId] = useState("");
      const [roomById, setRoomById] = useState([]);
      //const [nickInfo, setNickInfo] = useState([]);
      const [refreshing, setRefreshing] = useState(false);
      const [rerender, setRerender] = useState(false);
      const [nickInfo, setNickInfo] = useState([]);
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
          let nick =[];

          if(currentId){
            const roomInfo = await request.getChatRoomById(currentId);
            userData = await requestUser.getUserData(currentId);
            await setRoomById(roomInfo);

            roomInfo.map(async (data)=>{
              let hostid = await requestUser.getUserData(data.hostId);
              let postOwnerid = await requestUser.getUserData(data.postOwnerId);
              let postid = await request.getPostTitle(data.postId);


              nick = nick.concat({_id : data._id, hostNick : hostid.nickname , postOwnerNick : postOwnerid.nickname, postTitle : postid[0].title });

              await setNickInfo(nick);

             })

          }
        }
        loadingRoom();
      },[currentId]);

      function returnFlatListItem(item,index){

        return(
            <TouchableHighlight onPress={() => {navigation.navigate('chatchroom', {postOwner: userData, roomInfo: item})}}>
                 <View style={styles.post}>
                     <View>
                        <Text style={styles.postTitle}>{item.postTitle}</Text>

                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.host}>{item.hostNick}</Text>
                            <Text style={styles.postowner}>{item.postOwnerNick}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    async function onRefresh(){
      try{
        setRefreshing(true);
        console.log("setrefreshing", refreshing);
        nick =[];
        const roomInfo = await request.getChatRoomById(currentId);
            userData = await requestUser.getUserData(currentId);
            setRoomById(roomInfo);

            roomInfo.map(async (data)=>{
              let hostid = await requestUser.getUserData(data.hostId);
              let postOwnerid = await requestUser.getUserData(data.postOwnerId);
              let postid = await request.getPostTitle(data.postId);
              nick = nick.concat({_id : data._id, hostNick : hostid.nickname , postOwnerNick : postOwnerid.nickname, postTitle : postid[0].title });
              setNickInfo(nick);

            })
        setRefreshing(false);
        setRerender(!rerender);

      }
      catch(err){
        console.log("DB에러")
        console.log(err);
      }
    }


      return (
        <View style={styles.container}>
            <FlatList
                    data={nickInfo}
                    keyExtractor={(item,index) => String(item._id)}
                    renderItem={({item,index})=>returnFlatListItem(item,index)}
                    //onEndReached={this.morePage}
                    onEndReachedThreshold={1}
                    extraData ={rerender}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
      </View>
      );
}



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
      //borderRadius: 15,
      backgroundColor: "white",
      borderBottomColor: "#a6e5ff",
      borderBottomWidth: 1,
      padding: 10,
      height: 100
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
  postTitle:{fontSize:18, fontWeight: "bold", flex : 1, height:50, paddingTop:9},
  host: {fontSize:17, textAlign:'right', width:'30%', paddingTop: 9, marginRight:10},
  postowner: {width:'30%',fontSize:17, textAlign:'right',paddingTop: 9, marginRight:10}
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

export default ChatChScreen;
