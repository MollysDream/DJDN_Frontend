import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet, Image, FlatList, Button, AsyncStorage, TouchableOpacity
} from 'react-native';
import SwitchSelector from "react-native-switch-selector";
import {CheckBox} from 'react-native-elements';
import request from "../../requestAPI";
import requestUserAPI from "../../requestUserAPI";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import Icon from 'react-native-vector-icons/AntDesign';
import Icon4 from "react-native-vector-icons/MaterialIcons";

export default class FilterOptionScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            categoryChecked:{},
            userCategory:this.props.route.params.userData.category,
            userData:this.props.route.params.userData,
            sort:this.props.route.params.userData.sort
        }
    }

    async componentDidMount() {
        const categoryList = await request.getCategoryList();
        console.log(categoryList)

        this.setState({
            categoryChecked:categoryList.category[0],
        })

        for(const [key, value] of Object.entries(this.state.categoryChecked)){
            if(this.state.userCategory.includes(key))
                this.state.categoryChecked[key]=true;
        }

        this.setState({
            categoryChecked:this.state.categoryChecked
        })

    }

    setFilter = async()=>{
        console.log("필터 적용 누름");

        const newUserCategory = []
        for(const [key, value] of Object.entries(this.state.categoryChecked)){
            if(value)
                newUserCategory.push(key);
        }
        console.log(`${newUserCategory} 사용자 필터 설정함`);

        let result = await requestUserAPI.updateUserCategoryAndSort({
            userId:this.state.userData._id,
            newUserCategory:newUserCategory,
            newSort:this.state.sort
        });

        this.props.route.params.onGoBack();
        this.props.navigation.goBack();

    }


    render(){
        const options = [
            {label: "최신순", value:0},
            {label: "거리순", value:1},
            {label: "키워드", value:2}
        ]
        return (
            <View style={{flex:1, backgroundColor:'white'}}>
                <View style={styles.content}>
                    <Text style={styles.text}>카테고리 설정</Text>
                    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                        {
                            Object.keys(this.state.categoryChecked).map((key,index)=>
                                <CheckBox
                                    key={index}
                                    title={key}
                                    checked={
                                        this.state.categoryChecked[key]
                                    }
                                    onPress={()=>{
                                        this.state.categoryChecked[key] = !this.state.categoryChecked[key]
                                        this.setState({categoryChecked:this.state.categoryChecked})
                                    }}

                                />
                            )
                        }
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{width:'66.6%'}}>
                            <Text style={[styles.text]}>정렬</Text>
                        </View>
                        <View style={{width:'33.3%'}}>
                            <Text style={[styles.text]}>필터</Text>
                        </View>
                    </View>

                    <SwitchSelector
                        initial={this.state.sort}
                        options={options}
                        onPress={value => this.setState({sort:value})}
                        buttonColor={'#69d5ff'}
                        borderColor={'#69d5ff'}
                        hasPadding
                    />
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('keywordScreen', {userId:this.state.userData._id, keywordList:this.state.userData.keyword})}
                        style={{borderRadius:10,backgroundColor:'#b4ecff',alignSelf:'flex-end', marginTop:5, marginRight:31, padding:4}}>
                        <Text style={{fontSize:13}}>키워드 설정</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.btnArea2}>
                    <TouchableOpacity style={styles.btn2} onPress={this.setFilter}>
                        <Text style={{color: 'white', fontWeight:'bold'}}>필터 적용</Text>

                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    content:{
      borderRadius: 10,
        marginBottom: 20,
      backgroundColor: 'white',
    },
    text:{
        fontSize:20,
        textAlign: 'center',
        paddingBottom: 8,
        fontWeight: "bold"
    },
    btnArea2: {
        height: hp(8),
        // backgroundColor: 'orange',
        paddingBottom: hp(1.5),
        marginTop:10,
        alignItems: 'center'
    },
    btn2: {
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#30bfff',
        flexDirection: "row",
    },
});
