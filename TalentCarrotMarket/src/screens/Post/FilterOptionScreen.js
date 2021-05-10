import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet, Image, FlatList, Button, AsyncStorage
} from 'react-native';
import SwitchSelector from "react-native-switch-selector";


import {CheckBox} from 'react-native-elements';
import request from "../../requestAPI";
import requestUser from "../../requestUserAPI";
import requestUserAPI from "../../requestUserAPI";
import {CommonActions} from '@react-navigation/native';


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
        /*this.props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes:[{name:'Home'}],
            })
        )*/
        //this.props.navigation.navigate('Home');
    }


    render(){
        const options = [
            {label: "최신순", value:0},
            {label: "거리순", value:1}
        ]
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

                    <Text>정렬</Text>
                    <SwitchSelector
                        initial={this.state.sort}
                        options={options}
                        onPress={value => this.setState({sort:value})}
                        buttonColor={'#89dcfd'}
                        borderColor={'#89dcfd'}
                        hasPadding
                                    />

                    <Button title={'필터 적용'} onPress={this.setFilter}/>
                </View>


            </View>


        );
    }
}

