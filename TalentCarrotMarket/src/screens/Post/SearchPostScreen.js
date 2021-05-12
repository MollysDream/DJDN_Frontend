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
            data:[],
            page:0,
            rerender: false
        }
    }

    async componentDidMount() {
        const postData = await request.getPostBySearch(this.state.search);
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
        const postData = await request.getPostBySearch(this.state.search);
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
                        <Text style={styles.postPrice}>{`${price}원`}</Text>
                        <Text style={styles.postAddressTime}>{`${item.addressName} ◦ ${time}`}</Text>
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
                    placeholder= "   검색어를 입력해주세요"
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
                />

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
    postTitle:{fontSize:18, fontWeight: "bold", width:280, height:80, paddingTop:5},
    postAddressTime: {fontSize:13, textAlign:'right', width:250, marginRight:10},
    postPrice: {fontSize:17}

});
