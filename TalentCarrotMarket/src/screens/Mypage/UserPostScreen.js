import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Button,
    RefreshControl,
    TouchableHighlight, TouchableOpacity
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import AsyncStorage from '@react-native-community/async-storage';
import {getDate, getPrice} from "../../function";
import Icon from "react-native-vector-icons/FontAwesome5";


export default class UserPostScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            search:'',
            data:[],
            page:0,
            rerender: false,
            refreshing: false,
            userId: this.props.route.params.userId
        }
    }

    async componentDidMount() {
        /*const userId = await AsyncStorage.getItem('user_id');
        this.setState({userId:userId})*/
        const postData = await request.getUserPost(this.state.userId);
        //console.log(postData);
        this.setState({
            data: this.state.data.concat(postData),
            page : this.state.page + 1
        });
    }


    async goToDetailPostScreen(item){
        console.log(`${item._id} 게시글 확인`);
        const postImages = []
        item.image.map((image)=>{
            let temp={
                image:image,
                desc:image,
            }
            postImages.push(temp);
        })

        const userData = await requestUser.getUserData(item.user_id);

        this.props.navigation.navigate('DetailPost',{detailPost: item, postImages: postImages, postOwner: userData});
    }

    goToEditPostScreen(item){
        const postImages = []
        item.image.map((image)=>{
            postImages.push(image);
        })

        this.props.navigation.navigate('editUserPostScreen',
            {
                detailPost: item,
                postImages: postImages,
                onGoBack: ()=>this.refreshPage()
            });

    }

    async deletePost(item){
        console.log(item._id);
        let result = await request.deletePost(item._id);
        let result_refresh = await this.refreshPage();
    }

    refreshPage = async() => {
        console.log('페이지 새로고침');

        this.state.page = 0;
        this.setState({page:this.state.page, refreshing: true});

        const postData = await request.getUserPost(this.state.userId);
        //console.log(postData);
        this.setState({
            data: postData,
            page : this.state.page + 1,
            rerender: !this.state.rerender,
            refreshing: false
        });

    }

    returnFlatListItem(item,index){
        let time = getDate(item.date);
        let price = getPrice(item.price);
        return(
            <View>
                <TouchableHighlight onPress={() => this.goToDetailPostScreen(item)}>
                    <View style={styles.post}>
                        <Image style={styles.image} source={{ uri: item.image[0]}} />
                        <View>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.postPrice}>{`${price}원`}</Text>
                                <Text style={styles.postAddressTime}>{`${item.addressName}\n${time}`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                <Button title={'수정'} onPress={()=>this.goToEditPostScreen(item)}/>
                <Button title={'삭제'} onPress={()=>this.deletePost(item)}/>
            </View>



        );
    }


    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:1}} >
                    <View style={styles.buttonList}>
                        <Icon style={styles.iconPlace} name="hand-holding-usd"  size={40} color="#37CEFF" />
                        <Text style={styles.buttonText}>재능구매 내역</Text>
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
                </View>


            </View>
        );
    }
}


const styles = StyleSheet.create({
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
    postTitle:{fontSize:18, fontWeight: "bold", width:280, height:80, paddingTop:9},
    postAddressTime: {fontSize:13, textAlign:'right', width:'30%', marginRight:10},
    postPrice: {width:'50%',fontSize:17 , color:"#0088ff" ,paddingTop: 9}
,
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