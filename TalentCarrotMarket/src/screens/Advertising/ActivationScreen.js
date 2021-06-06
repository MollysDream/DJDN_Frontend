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
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import requestAdverAPI from "../../requestAdverAPI";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/Ionicons";
import Modal from 'react-native-modal';
import Icon4 from "react-native-vector-icons/Fontisto";
import {getDate, getGMT9Date, getPrice} from "../../function";

let userId;

export default class Actiation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            search:'',
            data:[],
            page:0,
            rerender: false,
            refreshing: false,
            modalVisible: false,
            currentItem:{}
        }
    }


    async componentDidMount() {
        userId = await AsyncStorage.getItem('user_id');
        console.log(userId);
        const adverData = await requestAdverAPI.getMyAdver(userId);
        this.setState({
            data: this.state.data.concat(adverData),
            page : this.state.page+1
        });
    }

    refreshPage = async() => {
        console.log('페이지 새로고침');

        this.state.page = 0;
        this.setState({page:this.state.page, refreshing: true});

        const adverData = await requestAdverAPI.getMyAdver(userId);
        //console.log(postData);
        this.setState({
            data: adverData,
            page : this.state.page + 1,
            rerender: !this.state.rerender,
            refreshing: false
        });

    }

    async deleteAdver(item){
        this.toggleModal();
        console.log(item._id);
        let result = await requestAdverAPI.deleteAdver(item._id);
        let result_refresh = await this.refreshPage();
    }

    goToEditAdverScreen(item){
        this.toggleModal();
        const adverImages = []
        item.image.map((image)=>{
            adverImages.push(image);
        })

        this.props.navigation.navigate('editadver',
            {
                detailAdver: item,
                adverImages: adverImages,
                onGoBack: ()=>this.refreshPage()
            });

    }

    async toggleActivation(item){
        const active = !item.active;
        this.toggleModal();
        let result = await requestAdverAPI.updateAdverActive(item._id,active);
        let result_refresh = await this.refreshPage();
    }

    toggleModal(){
        this.setState({modalVisible:!this.state.modalVisible});
    }

    async onOption(item){
        this.setState({currentItem:item});
        this.toggleModal();
    }

    returnFlatListItem(item,index){
        let time = getDate(item.date);
        let status = '활성화';
        let statusStyle = styles.post_sign
        let price = getPrice(item.price);

        let curTime = getGMT9Date(new Date());
        if (new Date(item.endDate)<curTime){
            status = '기간만료';
            statusStyle = [styles.post_sign,{backgroundColor: '#ff6e6e'}]
        }

        return(
            <>
                {
                    item.active == true?
                <>
                <TouchableHighlight onPress={() => this.props.navigation.navigate('detailadver',{item})}>
                    <View style={styles.post}>

                        <Text style={styles.Time}>{`${time}`}</Text>
                        <Text style={[styles.Time,{bottom:28}]}>{`${item.addressName}`}</Text>

                        <Image style={styles.image} source={{ uri: item.image[0]}} />

                        <View style={{flexDirection:'column', marginLeft:10}}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.postTitle}>{item.title}</Text>
                            </View>

                            <View style={[statusStyle,{marginTop:3}]}>
                                <Text>{status}</Text>
                            </View>
                            <Text style={styles.postPrice}>{price==='0'?null:`${price}원`}</Text>

                        </View>

                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.optionButton} onPress={()=>this.onOption(item)}>
                    <Icon2 name="dots-three-vertical" size={23} color={"purple"}></Icon2>
                </TouchableHighlight>
                </>:null
                }
            </>
        );
    }


    render() {
    return(
        <View>
             <FlatList
                        contentContainerStyle={{paddingBottom:70}}
                        data={this.state.data}
                        keyExtractor={(item,index) => String(item._id)}
                        renderItem={({item,index})=>this.returnFlatListItem(item,index)}
                        onEndReached={this.morePage}
                        onEndReachedThreshold={1}
                        extraData={this.state.rerender}
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshPage} />}
                    />
                   <Modal isVisible={this.state.modalVisible} onBackdropPress={()=>this.toggleModal()}>
                    <View style={styles.optionBox}>

                        <TouchableOpacity style={styles.buttonList}  onPress={()=>this.toggleActivation(this.state.currentItem)}>
                            <Icon4 style={styles.iconPlace} name="checkbox-active"  size={40} color="#7453ff" />
                            <Text style={styles.buttonText}>광고 비활성화</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonList}  onPress={()=>this.goToEditAdverScreen(this.state.currentItem)}>
                            <Icon style={styles.iconPlace} name="edit"  size={40} color="#7453ff" />
                            <Text style={styles.buttonText}>광고 수정</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonList} onPress={()=>this.deleteAdver(this.state.currentItem)}>
                            <Icon2 style={styles.iconPlace} name="cross"  size={45} color="#7453ff" />
                            <Text style={styles.buttonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>

            </View>
      
    )
    }
}


const styles = StyleSheet.create({
    Time: {fontSize:13, textAlign:'right', position:'absolute',right:10,bottom:10, marginRight:3},
    post_sign:{
        backgroundColor:'#d9c8ee',
        padding: 3,
        borderRadius: 7,
        alignSelf:'flex-start',
    },
    image:{
        width: wp(20),
        overflow:"hidden",
        height: hp(20),
        aspectRatio: 1,
        borderRadius: 10,

        borderWidth:2,
        borderColor:'#c18aff',
    },
    post:{
        flexDirection: "row",
        borderRadius: 15,
        backgroundColor: "white",
        borderBottomColor: "purple",
        borderBottomWidth: 1,
        padding: 10,
    },
    postTitle:{
        fontSize:18,
        fontWeight: "bold",
        width:"75%",
        paddingTop:5,
        color:'#7751ff'
    },
    postAddressTime: {fontSize:13, textAlign:'right', width:'30%', marginRight:10},
    postPrice: {width:'50%',fontSize:15 , color:"#7453ff" ,paddingTop: 4}
    ,
    buttonList: {
        //borderWidth:1,
        height:55,
        flexDirection:'row',
        backgroundColor: '#edecff',
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

});