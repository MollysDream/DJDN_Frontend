import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image, ScrollView
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import requestUserAPI from "../../requestUserAPI";
import requestAddressAPI from "../../requestAddressAPI";
import {useIsFocused} from "@react-navigation/native";
import { Rating } from 'react-native-ratings';

const MypageScreen = ({navigation}) => {

  const [address, setAddress] = useState([]);
  const [userId, setUserId]= useState('');
  const [userData, setUserData] = useState();
  const [userAddress, setUserAddress] = useState('');

  const [admin, setAdmin] = useState(null);

    const isFocused = useIsFocused();

    const handleLogoutButton = () => {
        AsyncStorage.clear();
        navigation.replace('Auth');
    };

    //인증한 동네 확인 - 사용자
    useEffect(() => {
        async function getUserData(){
            let userId = await AsyncStorage.getItem('user_id');

            //로그아웃 시 에러 방지
            if(userId == undefined)
                return;

            let adminData = await requestUserAPI.checkAdmin(userId);
            setAdmin(adminData)

            setUserId(userId);

            let userData = await requestUserAPI.getUserData(userId);
            setUserData(userData);

            let userAddressDataList = await requestAddressAPI.getUserAddress(userId);
            setUserAddress(userAddressDataList);

            userAddressDataList.address.map((address)=>{
                if(address.addressIndex == userData.addressIndex){
                    setUserAddress(address);
                    return;
                }
            })

        }
        console.log("마이페이지 불러옴");

        let result = getUserData();
    }, [isFocused]);

    /*const certifyAddress=address.map(list=>
      <Text>내가 인증한 동네 : {list.addressName}</Text>
    )*/

    const goToUserPostScreen = ()=>{
        navigation.navigate('userPostScreen', {userId:userId});
    }
    const editProfileButton = ()=>{
        console.log('프로필 수정!!');
        navigation.navigate('editProfileScreen',{userId:userId, userData:userData});
    }
    const goToUserTradingPostScreen = ()=>{
        navigation.navigate('userTradingPostScreen', {userId:userId});
    }
    const goToKeywordScreen = ()=>{
        navigation.navigate('keywordScreen', {userId:userId, keywordList:userData.keyword});
    }
    const goToCertificationScreen = ()=>{
        console.log('자격증 증명');
        navigation.navigate('자격증 증명', {userId:userId});
    }
    const goToAdvertiseScreen =()=>{
        console.log('advertise');
        navigation.navigate('advertise', {userId:userId});
    }
    return (
      <View style={styles.container}>

          <View style={styles.profileBox}>

              {
                  userData==undefined ?null:
                      (
                          <>
                              {admin===null?null:
                                  <View style={{position:'absolute', right:0}}>
                                      <TouchableOpacity style={{padding:10, borderRadius:10, backgroundColor:'#9a63ff'}} onPress={()=>navigation.replace('AdminTab')}>
                                          <Text style={{color: 'black'}}>관리자 페이지</Text>
                                      </TouchableOpacity>
                                  </View>
                              }
                            <View style={styles.user}>
                              <Image style={styles.profileImage} source={{uri:userData.profileImage}}/>
                              <Text style={{fontSize:15,marginTop:5, color:'grey'}}>{`${userAddress.addressName}의`}</Text>
                              <Text style={styles.nickname}>{userData.nickname}</Text>
                            </View>

                            <View style={styles.ratingArea}>
                                <View style={styles.ratingView}>
                                    <Text style={(styles.Text, {color: 'black'})}>평가점수: {userData.averageRating}</Text>
                                </View>
                            </View>

                            <Rating
                            ratingCount={5}
                            startingValue={userData.averageRating}
                            imageSize={40}
                            readonly='true'
                            type="star"
                            />
                          </>

                      )

              }



          </View>



          <View
              style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
              }}
          />

          <ScrollView style={styles.tradeBox}>


              <TouchableOpacity style={styles.buttonList} onPress={goToUserPostScreen}>
                  <Icon style={styles.iconPlace} name="hand-holding-usd"  size={40} color="#37CEFF" />
                  <Text style={styles.buttonText}>재능구매 내역 (내 게시물)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonList} onPress={goToUserTradingPostScreen}>
                  <Icon style={[styles.iconPlace, {marginTop:3}]} name="hands-helping"  size={36} color="#37CEFF" />
                  <Text style={styles.buttonText}>재능판매 내역</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonList} onPress={goToKeywordScreen}>
                  <Icon style={[styles.iconPlace, {marginTop:3}]} name="tags"  size={36} color="#37CEFF" />
                  <Text style={styles.buttonText}>키워드 설정</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.buttonList} onPress={goToAdvertiseScreen}>
                  <Icon3 style={[styles.iconPlace, {marginTop:3}]} name="creative-commons-noncommercial-us"  size={46} color="#37CEFF" />
                  <Text style={styles.buttonText}>광고 </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonList} onPress={goToCertificationScreen}>
                  <Icon2 style={[styles.iconPlace, {marginTop:3}]} name="certificate"  size={46} color="#37CEFF" />
                  <Text style={styles.buttonText}>자격증 증명</Text>
              </TouchableOpacity>


          </ScrollView>

          {/*<View>
              {certifyAddress}
          </View>*/}
            <View style={styles.rowbtnArea}>
                <View style={styles.bottomArea}>
                    <TouchableOpacity style={styles.editButton} onPress={editProfileButton}>
                        <Text style={(styles.Text, {color: 'black'})}>프로필 수정</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomArea}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutButton}>

                        <Text style={(styles.Text, {color: 'black'})}>로그아웃</Text>
                    </TouchableOpacity>
                </View>
            </View>

      </View>


    );
 }


const styles = StyleSheet.create({
    container: {
      flex: 1, //전체의 공간을 차지한다는 의미
      flexDirection: 'column',
      backgroundColor: 'white',
      paddingLeft: wp(7),
      paddingRight: wp(7),
    },
    user:{
      alignItems:'center'
    },
    profileBox:{
        alignItems: 'center',
        flexDirection:'column',
        paddingTop:10,
        marginBottom:10
    },
    profileImage:{
        width: 100,
        height: 100,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "#6fceff"
    },
    nickname:{
      fontSize: 27,
    },
    ratingArea:{
        height:20,
        margin:5,
    },
    ratingView:{
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d4fbff',
    },
    editButton:{
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d4fbff',
    },
    rowbtnArea:{
        flexDirection: "row",
        justifyContent: 'center',
      },
    bottomArea: {
      height: hp(8),
        paddingRight: wp(2),
      paddingBottom: hp(1.5),
        // position: "absolute", bottom: 0, right: 0
    },
    logoutButton: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffc6c6',
      flexDirection: "row",

    }, tradeBox: {
        //borderWidth: 1,
        flexDirection:'column',
        marginTop:7

    },
    buttonList: {
        //borderWidth:1,
        height:55,
        flexDirection:'row',
        backgroundColor: '#ecfeff',
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
    }

});

  export default MypageScreen;
