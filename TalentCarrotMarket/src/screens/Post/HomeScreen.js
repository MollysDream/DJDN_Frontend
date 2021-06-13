import React, {Component, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Button,
    RefreshControl,
    TouchableHighlight, Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import AsyncStorage from '@react-native-community/async-storage';
import {getDate, getPrice} from '../../function';
import requestAddressAPI from "../../requestAddressAPI";
import requestAdverAPI from "../../requestAdverAPI";

export default class HomeScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            search:'',
            data:[],
            page:0,
            rerender: false,
            refreshing: false,
            userId: undefined
        }
    }


    async componentDidMount() {
        //console.log("홈스크린 componentDidMount");
        try{
            const userId = await AsyncStorage.getItem('user_id');
            this.setState({userId:userId});

            let userAddressDataList = await requestAddressAPI.getUserAddress(userId);
            if(userAddressDataList.address[0] == undefined){
                Alert.alert("알림","동네 인증을 먼저 해주세요", [{ text: '확인', style: 'cancel' },
                    this.props.navigation.navigate('TabThird',{screen:'aroundSet'})
                ])
                return;
            }

            //this.setState({userId:userId})
            const postData = await request.getPost(this.state.page, userId);
            const advertisementData = await requestAdverAPI.getAdvertisementPost(userId);
            this.setState({
                data: this.state.data.concat(postData).concat(advertisementData),
                page : this.state.page + 1,
            });

        }catch(err){
            console.log("DB에러")
            console.log(err);
        }

    }

    morePage = async() => {
        //console.log('더 불러와 제발!!');
        const postData = await request.getPost(this.state.page, this.state.userId);
        const advertisementData = await requestAdverAPI.getAdvertisementPost(this.state.userId);
        this.setState({
            data: this.state.data.concat(postData).concat(advertisementData),
            page : this.state.page + 1,
            rerender: !this.state.rerender,
        });
    }

    refreshPage = async() => {
        console.log('페이지 새로고침');
        try{
            //this.state.page = 0;
            this.setState({page:0, refreshing: true});

            const postData = await request.getPost(0, this.state.userId);
            const advertisementData = await requestAdverAPI.getAdvertisementPost(this.state.userId);

            this.setState({
                data: postData.concat(advertisementData),
                page : this.state.page + 1,
                rerender: !this.state.rerender,
                refreshing: false
            });
        }catch(err){
            console.log("DB에러")
            console.log(err);
        }

    }

    updateSearch = (search) =>{
        this.setState({search});
    }

    searchPost = () =>{
        console.log(`${this.state.search} 검색 시작!!`)
        this.props.navigation.navigate('SearchPost', {searchValue: this.state.search, userId:this.state.userId});
        this.setState({search:''});
    }

    async goToDetailPostScreen(item){
        console.log(`${item.title} 게시글 확인`);

        let userData
        try{
            userData = await requestUser.getUserData(item.user_id);
        }catch(err){
            console.log('게시글이 존재하지 않습니다');
            Alert.alert("오류", "게시글이 존재하지 않습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> this.refreshPage()}])
        }

        this.props.navigation.navigate('DetailPost',{detailPost: item, postOwner: userData});
    }

    async goToDetailAdvertisementScreen(item){
        console.log(`${item.title} 광고 확인`);
        this.props.navigation.navigate('DetailAdvertisement',{item});
    }

    filterOption = async () =>{
        console.log('필터 옵션 설정!!')

        //user_id 값으로 사용자 정보 받아와야 됨
        const userData = await requestUser.getUserData(this.state.userId);

        this.props.navigation.navigate('FilterOption',{
            userData:userData,
            onGoBack: ()=>this.refreshPage()
        });
    }


    returnFlatListItem(item,index){
        let time = getDate(item.date);
        let price = getPrice(item.price);
        let status = null
        let statusStyle = styles.status_none
        let mine = null
        let mineStyle = styles.status_none

        //광고
        if(item.active){
            status='지역광고';
            return(
                <TouchableHighlight onPress={() => this.goToDetailAdvertisementScreen(item)}>
                    <View style={[styles.post,{borderBottomColor: "#cba6ff"}]}>
                        <Image style={[styles.image,{borderWidth:3, borderColor:'#cba6ff'}]} source={{ uri: item.image[0]}} />
                        <View>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <View style={[styles.status_complete, {backgroundColor:'#cba6ff'}]}>
                                <Text>{`${item.addressName} - ${status}`}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={[styles.postPrice,{color:"#a05eff"}]}>{price==='0'?null:`${price}원`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            );
        }
        else{ //게시글

            if(item.tradeStatus === 1){
                status = '거래중';
                statusStyle = styles.status_ing
            }
            else if(item.tradeStatus ===2){
                status = '거래완료';
                statusStyle = styles.status_complete
            }
            if(item.user_id == this.state.userId){
                mine = 'My';
                mineStyle = styles.status_mine;
            }
            return(
                <TouchableHighlight onPress={() => this.goToDetailPostScreen(item)}>
                    <View style={styles.post}>

                        <Image style={styles.image} source={{ uri: item.image[0]}} />
                        <View style={mineStyle}>
                            <Text>{mine}</Text>
                        </View>
                        <View>
                            <Text style={styles.postTitle}>{item.title}</Text>

                            <View style={statusStyle}>
                                <Text>{status}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.postPrice}>{`${price}원`}</Text>
                                <Text style={styles.postAddressTime}>{`${item.addressName}\n${time}`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>

            );

        }


    }


    render() {
        console.log('홈화면 렌더');
        const {search} = this.state;
        return (
            <View style={{flex:1, backgroundColor:'white'}}>
            <View style={{flex:1, backgroundColor:'white'}} >

                <View style={{height:67, flexDirection:'row', backgroundColor:'white'}}>
                    <View style={styles.iconBox}>
                        <Image style={styles.icon} source={{uri:'https://mollysdreampostdata.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/KakaoTalk_20210326_202400941_03.png'}}/>
                    </View>
                    <SearchBar
                        searchIcon={null}
                        placeholder="   검색어를 입력해주세요"
                        onChangeText={this.updateSearch}
                        value={search}
                        onSubmitEditing={this.searchPost}
                        lightTheme
                        inputContainerStyle={{backgroundColor:'#edffff', borderRadius:15}}
                        containerStyle={{borderWidth:0, width:'70%', borderRadius:10, backgroundColor:'#ffffff'}}
                    />
                    <TouchableOpacity onPress={()=>this.filterOption()}
                                      style={{alignItems:'center'}}>
                        <Icon name="options-outline"  size={60} color="#A8A8A8" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={this.state.data}
                    keyExtractor={(item,index) => String(index+'_'+item._id)}
                    renderItem={({item,index})=>this.returnFlatListItem(item,index)}
                    onEndReached={this.morePage}
                    onEndReachedThreshold={0.2}
                    extraData={this.state.rerender}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshPage} />}
                />

            </View>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('MakePost',{onGoBack: ()=>this.refreshPage()})}
                                  style={{borderWidth:0,position:'absolute',bottom:5,alignSelf:'flex-end'}}>
                    <Icon name="add-circle"  size={70} color="#37CEFF" />
                </TouchableOpacity>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    iconBox:{
        height:hp(10),
        alignItems: 'center',
        marginTop:3
    },
    icon:{
        width: wp(8),
        overflow:"hidden",
        height: hp(8),
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
        borderRadius: 15,
        backgroundColor: "white",
        borderBottomColor: "#a6e5ff",
        borderBottomWidth: 1,
        padding: 10,
        height: 136
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
    postTitle:{fontSize:18, fontWeight: "bold", width:250, height:80, paddingTop:9},
    postAddressTime: {fontSize:13, textAlign:'right', width:'30%', marginRight:10},
    postPrice: {width:'50%',fontSize:17 , color:"#0088ff" ,paddingTop: 9}
    ,
    status_ing:{
        backgroundColor:'#b4e6ff',
        position: 'absolute',
        top: 55,
        padding: 3,
        borderRadius: 7
    },
    status_complete:{
        backgroundColor:'#98afbf',
        position: 'absolute',
        top: 55,
        padding: 3,
        borderRadius: 7
    },
    status_mine:{
        backgroundColor:'#ffb575',
        position:'absolute',
        left:10,
        top:10,
        padding:2,
        borderRadius: 7

    },
    status_none:{
        position: 'absolute'
    }
});