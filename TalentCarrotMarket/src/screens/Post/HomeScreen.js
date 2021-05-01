import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Platform,
    Button,
    RefreshControl
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import {SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../../requestAPI';


export default class HomeScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            search:'',
            data:[],
            page:0,
            rerender: false,
            refreshing: false
        }
    }

    async componentDidMount() {
        //console.log("홈스크린 componentDidMount");
        const postData = await request.getPost(this.state.page);
        this.setState({
            data: this.state.data.concat(postData),
            page : this.state.page + 1
        });
    }

    morePage = async() => {
        //console.log('더 불러와 제발!!');
        const postData = await request.getPost(this.state.page);
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

        const postData = await request.getPost(this.state.page);
        this.setState({
            data: postData,
            page : this.state.page + 1,
            rerender: !this.state.rerender,
            refreshing: false
        });
    }



    updateSearch = (search) =>{
        this.setState({search});
    }

    searchPost = () =>{
        console.log(`${this.state.search} 검색 시작!!`)
        this.props.navigation.navigate('SearchPost', {searchValue: this.state.search});
        this.setState({search:''});
    }

    returnFlatListItem(item,index){
        return(
            <View style={styles.post}>
                <Image style={{width: wp(30), height: hp(30),resizeMode: 'contain'}} source={{ uri: item.image[0]}} />
                <Text  style={styles.postTitle}>{item.title}</Text>
            </View>

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

    filterOption = () =>{
        console.log('필터 옵션 설정!!')
        this.props.navigation.navigate('FilterOption');
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
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('MakePost')}
                                  style={{borderWidth:0,position:'absolute',bottom:5,alignSelf:'flex-end'}}>
                    <Icon name="add-circle"  size={80} color="#01a699" />
                </TouchableOpacity>

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


// import React, {Component} from 'react';
// import {
//     View,
//     Text,
//     Image,
//     ScrollView,
//     StyleSheet
// } from 'react-native';


// export default class HomeScreen extends Component{
//     render(){
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//              <Text>Home!</Text>
//              <Image source = {require('../molly.png')} />
//             </View>
//         );
//     }
// }
