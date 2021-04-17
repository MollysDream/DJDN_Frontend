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
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import {SearchBar} from 'react-native-elements';

class ListItem extends Component{

    render(){
        console.log(this.props.desc);
        return(
            <View style={styles.post}>

                <View style={styles.postDetail}>
                    <Text  style={styles.postTitle}>{this.props.title}</Text>
                    <Text style={styles.postTime}>{this.props.time}</Text>
                    <Text style={styles.postPrice}>{this.props.price}</Text>
                </View>
            </View>
        );
    }
}



export default class HomeScreen extends Component{
    state = {
        search:'',
        data :[],
        page : 1
    };
    getData = async () => {
        const url = 'https://jsonplaceholder.typicode.com/photos?_limit=10';
        fetch(url)
          .then(res => res.json())
          .then(data => {
            this.setState({
              data: this.state.data.concat(data),
              page : this.state.page +1
            });
          });
      }

      componentDidMount() {
        this.getData();
      }

      morePage = () => {
        this.getData();
      }

    updateSearch = (search) =>{
        this.setState({search});
    }
    returnFlatListItem(item,index){
        return(
            <View style={styles.post}>
             <Image style={{width: wp(30), height: hp(30),resizeMode: 'contain'}} source={{ uri: item.url }} />
             <Text  style={styles.postTitle}>{item.title}</Text>
            </View>

        );
    }

    render() {
        const {search} = this.state;
        return (

            <View >
                <SearchBar
                    placeholder="   검색어를 입력해주세요"
                    onChangeText={this.updateSearch}
                    value={search}
                    />
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item,index) => item.key}
                    renderItem={({item,index})=>this.returnFlatListItem(item,index)}
                    onEndReached={this.morePage}
                    onEndReachedThreshold={1}
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
