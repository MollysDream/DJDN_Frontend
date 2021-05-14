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
            this.setState({userId:userId})
            const postData = await request.getPost(this.state.page, userId);

            this.setState({
                data: this.state.data.concat(postData),
                page : this.state.page + 1
            });

        }catch(err){
            console.log("DB에러")
            console.log(err);
        }

    }

    morePage = async() => {
        //console.log('더 불러와 제발!!');
        const postData = await request.getPost(this.state.page, this.state.userId);
        this.setState({
            data: this.state.data.concat(postData),
            page : this.state.page + 1,
            rerender: !this.state.rerender,
        });
    }

    refreshPage = async() => {
        console.log('페이지 새로고침');
        try{
            this.state.page = 0;
            this.setState({page:this.state.page, refreshing: true});

            const postData = await request.getPost(this.state.page, this.state.userId);
            this.setState({
                data: postData,
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
        this.props.navigation.navigate('SearchPost', {searchValue: this.state.search});
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

    returnFlatListItem(item,index){
        let time = getDate(item.date);
        let price = getPrice(item.price);
        let status = null
        let statusStyle = styles.status_none
        if(item.tradeStatus === 1){
            status = '거래중';
            statusStyle = styles.status_ing
        }
        else if(item.tradeStatus ===2){
            status = '거래완료';
            statusStyle = styles.status_complete
        }
        return(
            <TouchableHighlight onPress={() => this.goToDetailPostScreen(item)}>
                <View style={styles.post}>
                    <Image style={styles.image} source={{ uri: item.image[0]}} />
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

    categoryFilter = async() =>{
        const category = ['운동','애견']
        const postData = await request.getPostByCategory(category);
        console.log(postData);
        this.setState({
            data: postData,
            page : 0,
            rerender: !this.state.rerender
        });
    }

    filterOption = async () =>{
        console.log('필터 옵션 설정!!')

        //const userId = await AsyncStorage.getItem('user_id');
        //user_id 값으로 사용자 정보 받아와야 됨
        const userData = await requestUser.getUserData(this.state.userId);

        this.props.navigation.navigate('FilterOption',{
            userData:userData,
            onGoBack: ()=>this.refreshPage()
        });
    }

    render() {
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
                    keyExtractor={(item,index) => String(item._id)}
                    renderItem={({item,index})=>this.returnFlatListItem(item,index)}
                    onEndReached={this.morePage}
                    onEndReachedThreshold={1}
                    extraData={this.state.rerender}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshPage} />}
                />
                {console.log("이거", this.state.data)}
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