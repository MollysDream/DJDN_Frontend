import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Button,
    RefreshControl,
    TouchableHighlight
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import AsyncStorage from '@react-native-community/async-storage';


export default class UserPostScreen extends Component{

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
        const userId = await AsyncStorage.getItem('user_id');
        this.setState({userId:userId})
        const postData = await request.getUserPost(userId);
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
        await request.deletePost(item._id);
        await this.refreshPage();
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
        return(
            <View>
                <TouchableHighlight onPress={() => this.goToDetailPostScreen(item)}>
                    <View style={styles.post}>
                        <Image style={{width: wp(30), height: hp(30),resizeMode: 'contain'}} source={{ uri: item.image[0]}} />
                        <Text  style={styles.postTitle}>{item.title}</Text>
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
                    <Text>사용자의 거래 게시물</Text>
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