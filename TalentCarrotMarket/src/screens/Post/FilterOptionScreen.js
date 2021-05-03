import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet, Image, FlatList, Button
} from 'react-native';


import {CheckBox} from 'react-native-elements';
import request from "../../requestAPI";
import requestUser from "../../requestUserAPI";
import requestUserAPI from "../../requestUserAPI";

export default class FilterOptionScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            categoryList:[],
            categoryChecked:{},
            userCategory:[],
            userData:[]
        }
    }

    async componentDidMount() {
        const categoryList = await request.getCategoryList();
        console.log(categoryList)
        console.log(`전체 카테고리 리스트 ${categoryList.category}`);

        //user_id 값으로 사용자 정보 받아와야 됨
        const userData = await requestUser.getUserData("teller2016@ajou.ac.kr");
        console.log(`사용자의 카테고리 ${userData.category}`);

        this.setState({
            categoryChecked:categoryList.category[0],
            userCategory:userData.category,
            userData:userData
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

        await requestUserAPI.updateUserCategory({
            userId:this.state.userData._id,
            newUserCategory:newUserCategory
        });

        this.props.navigation.navigate('Home');
    }


    render(){
        return (
            <View style={{flex:1}}>
                <View>
                    <Text>카테고리 설정</Text>
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
                    <Button title={'필터 적용'} onPress={this.setFilter}/>
                </View>


            </View>


        );
    }
}

