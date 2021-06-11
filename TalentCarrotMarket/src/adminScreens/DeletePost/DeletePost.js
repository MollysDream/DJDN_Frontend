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
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/Ionicons";
import requestUserAPI from "../../requestUserAPI";

import Modal from 'react-native-modal';
import requestAPI from "../../requestAPI";
import requestAdverAPI from "../../requestAdverAPI";
import {SearchBar} from "react-native-elements";


export default class DeletePostScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            search:'',
            data:[],
            page:0,
            rerender: false,
            refreshing: false,
            userId: '',
            modalVisible: false,
            currentItem:{}
        }
    }

    async componentDidMount() {
        const postData = await requestAPI.getAdminPost(0, '', this.state.page);
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

        this.props.navigation.navigate('상세 게시물',{detailPost: item, postImages: postImages, postOwner: userData});
    }


    async deletePost(item){
        this.toggleModal();
        console.log(item._id);
        let result = await request.deletePost(item._id);
        let result_refresh = await this.refreshPage();
    }

    morePage = async() => {
        const postData = await requestAPI.getAdminPost(0, this.state.search, this.state.page);
        this.setState({
            data: this.state.data.concat(postData),
            page : this.state.page + 1,
            rerender: !this.state.rerender,
        });
    }

    refreshPage = async() => {
        console.log('페이지 새로고침');

        this.state.page = 0;
        this.setState({page:this.state.page, refreshing: true});

        const postData = await requestAPI.getAdminPost(0, this.state.search, this.state.page);
        //console.log(postData);
        this.setState({
            data: postData,
            page : this.state.page + 1,
            rerender: !this.state.rerender,
            refreshing: false
        });

    }


    toggleModal(){
        this.setState({modalVisible:!this.state.modalVisible});
    }

    async onOptionPress(item){
        this.setState({currentItem:item});
        this.toggleModal();
    }

    updateSearch = (search) =>{
        this.setState({search});
    }
    searchPost = async() =>{
        console.log(`${this.state.search} 검색 시작!!`)

        this.state.page = 0;
        this.setState({page:this.state.page, refreshing: true});

        const postData = await requestAPI.getAdminPost(0, this.state.search, this.state.page);
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
            <View>
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
                <TouchableHighlight style={styles.optionButton} onPress={()=>this.onOptionPress(item)}>
                    <Icon2 name="dots-three-vertical" size={25} color={"black"}></Icon2>
                </TouchableHighlight>

            </View>



        );
    }


    render() {
        const {search} = this.state;
        return (
            <View style={{flex:1}}>
                <View style={{flex:1}} >
                    <SearchBar
                        searchIcon={null}
                        placeholder="   검색어 혹은 동네를 입력해주세요"
                        onChangeText={this.updateSearch}
                        value={search}
                        onSubmitEditing={this.searchPost}
                        lightTheme
                        inputContainerStyle={{backgroundColor:'#edffff', borderRadius:15}}
                        containerStyle={{borderWidth:0, borderRadius:10, backgroundColor:'#ffffff'}}
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

                <Modal isVisible={this.state.modalVisible} onBackdropPress={()=>this.toggleModal()}>
                    <View style={styles.optionBox}>
                        <TouchableOpacity style={styles.buttonList} onPress={()=>this.deletePost(this.state.currentItem)}>
                            <Icon2 style={styles.iconPlace} name="cross"  size={45} color="#37CEFF" />
                            <Text style={styles.buttonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>


            </View>
        );
    }

    onChatRoomPress(item) {
        return undefined;
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
    postTitle:{fontSize:18, fontWeight: "bold", width:200, height:80, paddingTop:9},
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
    },
    optionButton: {
        position: 'absolute',
        top: 19,
        right: 15,
    },
    chatRoomButton: {
        position: 'absolute',
        top: 15,
        right: 48,
    },
    optionBox: {
        //borderWidth: 1,
        flexDirection:'column',
        marginTop:7

    },
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
    },

});