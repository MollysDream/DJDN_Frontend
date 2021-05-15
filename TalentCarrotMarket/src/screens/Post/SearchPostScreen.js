import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet, Image, FlatList, TouchableHighlight
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SearchBar} from 'react-native-elements';
import request from "../../requestAPI";
import requestUser from "../../requestUserAPI";
import {getDate, getPrice} from "../../function";

export default class SearchPostScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            search:this.props.route.params.searchValue,
            userId:this.props.route.params.userId,
            data:[],
            page:0,
            rerender: false
        }
    }

    async componentDidMount() {
        const postData = await request.getPostBySearch(this.state.search, this.state.userId);
        console.log(postData);
        this.setState({
            data: this.state.data.concat(postData),
            page : this.state.page + 1
        });
    }

    async morePage() {
        console.log("더 불러와 제발!");
    }

    updateSearch = (search) =>{
        this.setState({search});
    }

    searchPost = async ()=>{
        console.log(this.state.search);
        const postData = await request.getPostBySearch(this.state.search, this.state.userId);
        this.setState({
            data: postData,
            page : this.state.page + 1,
            refresh: !this.state.rerender
        });
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

        const userData = await requestUser.getUserData(item.user_id);
        
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
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.postPrice}>{`${price}원`}</Text>
                            <Text style={styles.postAddressTime}>{`${item.addressName}\n${time}`}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>

        );
    }

    render(){
        const {search} = this.state;
        return (
            <View style={{flex:1}}>
                <SearchBar
                    placeholder="   검색어를 입력해주세요"
                    onChangeText={this.updateSearch}
                    value={search}
                    onSubmitEditing={this.searchPost}
                    lightTheme
                    inputContainerStyle={{backgroundColor:'#edffff', borderRadius:15}}
                    containerStyle={{borderRadius:10, backgroundColor:'#ffffff'}}
                />
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item,index) => String(item._id)}
                    renderItem={({item,index})=>this.returnFlatListItem(item,index)}
                    onEndReached={this.morePage}
                    onEndReachedThreshold={1}
                    extraData={this.state.rerender}
                />

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

});
