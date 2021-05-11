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
        const postImages = []
        item.image.map((image)=>{
            let temp={
                image:image,
                desc:image,
            }
            postImages.push(temp);
        })

        let userData
        try{
            userData = await requestUser.getUserData(item.user_id);
        }catch(err){
            console.log('게시글이 존재하지 않습니다');
            Alert.alert("수정 완료", "게시글이 존재하지 않습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> this.refreshPage()}])
        }


        this.props.navigation.navigate('DetailPost',{detailPost: item, postImages: postImages, postOwner: userData});
    }

    returnFlatListItem(item,index){
        let time = getDate(item.date);
        let price = getPrice(item.price);
        return(
            <TouchableHighlight onPress={() => this.goToDetailPostScreen(item)}>
                <View style={styles.post}>
                    <Image style={styles.image} source={{ uri: item.image[0]}} />
                    <View>
                        <Text style={styles.postTitle}>{item.title}</Text>
                        <Text style={styles.postPrice}>{`${price}원`}</Text>
                        <Text style={styles.postAddressTime}>{`${item.addressName} ◦ ${time}`}</Text>
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

        const userId = await AsyncStorage.getItem('user_id');
        //user_id 값으로 사용자 정보 받아와야 됨
        const userData = await requestUser.getUserData(userId);

        this.props.navigation.navigate('FilterOption',{
            userData:userData,
            onGoBack: ()=>this.refreshPage()
        });
    }

    render() {
        const {search} = this.state;
        return (
            <View style={{flex:1}}>
            <View style={{flex:1}} >
                {/*<Button
                    onPress={this.categoryFilter}
                    title="카테고리 검색"
                />*/}
                <Button
                    title={"필터 설정"}
                    onPress={this.filterOption}
                />
                <SearchBar
                    placeholder="   검색어를 입력해주세요"
                    onChangeText={this.updateSearch}
                    value={search}
                    onSubmitEditing={this.searchPost}
                />
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item,index) => String(item._id)}
                    renderItem={({item,index})=>this.returnFlatListItem(item,index)}
                    onEndReached={this.morePage}
                    onEndReachedThreshold={1}
                    extraData={this.state.rerender}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshPage} />}
                />
            </View>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('MakePost',{onGoBack: ()=>this.refreshPage()})}
                                  style={{borderWidth:0,position:'absolute',bottom:5,alignSelf:'flex-end'}}>
                    <Icon name="add-circle"  size={80} color="#01a699" />
                </TouchableOpacity>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    image:{
        width: wp(30),
        overflow:"hidden",
        height: hp(30),
        aspectRatio: 1,
        borderRadius: 9,
        marginRight:10
    },
    post:{
        flexDirection: "row",

        backgroundColor: "#f6faff",
        borderBottomColor: "#d2f0ff",
        borderBottomWidth: 2,
        padding: 10,
        height: 145
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
    postTitle:{fontSize:18, fontWeight: "bold", width:280, height:80},
    postAddressTime: {fontSize:13, textAlign:'right', width:250, marginRight:10},
    postPrice: {fontSize:17}

});