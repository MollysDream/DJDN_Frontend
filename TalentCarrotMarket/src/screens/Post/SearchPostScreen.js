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

    goToDetailPostScreen(item){
        console.log(`${item.title} 게시글 확인`);
        const postImages = []
        item.image.map((image)=>{
            let temp={
                image:image,
                desc:image,
            }
            postImages.push(temp);
        })
        this.props.navigation.navigate('DetailPost',{detailPost: item, postImages: postImages});
    }

    returnFlatListItem(item,index){
        return(
            <TouchableHighlight onPress={() => this.goToDetailPostScreen(item)}>
                <View style={styles.post}>
                    <Image style={{width: wp(30), height: hp(30),resizeMode: 'contain'}} source={{ uri: item.image[0]}} />
                    <Text  style={styles.postTitle}>{item.title}</Text>
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
    post:{
        flexDirection: "row",
        alignItems : "center",
        backgroundColor: "#FFFFFF",
        borderBottomColor: "#AAAAAA",
        borderBottomWidth: 1,
        padding: 5,
        height: 150
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
    postTitle:{fontSize:18, fontWeight: "bold", paddingLeft : 5},
    postTime: {fontSize:13},
    postPrice: {fontSize:13}

});
