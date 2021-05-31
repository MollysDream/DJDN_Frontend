import React, {Component} from 'react';
import { Content, Container, Text, Form, Textarea } from 'native-base';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import {Picker} from '@react-native-picker/picker';
import {PickerItem} from "react-native/Libraries/Components/Picker/Picker";
import requestReportAPI from "../../requestReportAPI";
import FlashMessage, {showMessage} from "react-native-flash-message";

export default class ReportScreen extends Component {
    state = {
        detailPost:this.props.route.params.detailPost,
        postOwner:this.props.route.params.postOwner,
        reportWhat:0, //0-> 게시물, 1-> 사용자,

        postCategory:'',
        postCategoryList:['사기 글', '불법 재능', '불법 광고', '욕설','물건 판매', '기타'],

        userCategory:'',
        userCategoryList:['비매너', '욕설', '성희롱', '채팅비매너', '기타'],
        text:'',

        userId:this.props.route.params.userId
    }

    message=(text)=>{
        showMessage({message:text, type:'info'});
    }

    writeText = (text, type)=>{
        this.setState({text:text})
    }

    async report(){
        let categoryParam = '';

        if(this.state.reportWhat == 0){
            categoryParam = this.state.postCategory
            if(this.state.postCategory == ''){
                this.message(`게시글 신고 사유를 설정해주세요!`);
                return;
            }
        }else{
            categoryParam = this.state.userCategory
            if(this.state.userCategory == ''){
                this.message(`사용자 신고 사유를 설정해주세요!`);
                return;
            }
        }

        if(this.state.text.length === 0){
            this.message(`신고 상세 내용을 작성해주세요!`);
            return;
        }

        const reportDataParam ={
            reportUser: this.state.userId,
            targetUser: this.state.postOwner._id,
            targetPost: this.state.detailPost._id,
            reportWhat: this.state.reportWhat,
            reportCategory: categoryParam,
            text: this.state.text
        }

        try{
            const resultData = await requestReportAPI.reportPostOrUser(reportDataParam);
            Alert.alert("신고 완료", "신고가 정상적으로 접수 되었습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> {
                        this.props.navigation.goBack();
                    }}])
        }
        catch(err){
            console.log(err);
        }




    }



    render() {
        const post = this.state.detailPost;
        const postOwner = this.state.postOwner;
        return (
            <Container>
                <TouchableWithoutFeedback>

                    <Container>
                        <Content>
                            <FlashMessage position="top"/>
                            <View style={styles.title}>
                                <TouchableOpacity style={{width:'50%', paddingLeft:10}} onPress={()=>this.setState({reportWhat:0})}>
                                    <Text style={this.state.reportWhat == 0 ? styles.text_on : styles.text_off}>
                                        {`'${post.title}' 게시글 신고`}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{width: '50%', paddingRight:10, alignItems:'flex-end'}} onPress={()=>this.setState({reportWhat:1})}>
                                    <Text style={this.state.reportWhat == 1 ? styles.text_on : styles.text_off}>
                                        {`'${postOwner.nickname}' 사용자 신고`}
                                    </Text>
                                </TouchableOpacity>
                            </View>


                            {this.state.reportWhat == 0 ?
                                (
                                    <Form>
                                        <Picker
                                            selectedValue={this.state.postCategory}
                                            onValueChange={(value) => this.setState({postCategory:value})}
                                        >
                                            <Picker.Item color={'grey'} label={'게시글 신고 사유'} value={''}/>
                                            {
                                                this.state.postCategoryList.map((category, key)=>(
                                                    <Picker.Item label={category} value={category} key={key}/>
                                                ))

                                            }
                                        </Picker>

                                        <Textarea rowSpan={8} placeholder="신고 상세 내용을 입력해주세요." autoCapitalize='none'
                                                  onChangeText={(text) => this.writeText(text, "text")}
                                                  style={styles.textAreaContainer} />
                                    </Form>


                                ):

                                (
                                    <Form>
                                        <Picker
                                            selectedValue={this.state.userCategory}
                                            onValueChange={(value) => this.setState({userCategory:value})}
                                        >
                                            <Picker.Item color={'grey'} label={'사용자 신고 사유'} value={''}/>
                                            {
                                                this.state.userCategoryList.map((category, key)=>(
                                                    <Picker.Item label={category} value={category} key={key}/>
                                                ))

                                            }
                                        </Picker>

                                        <Textarea rowSpan={8} placeholder="신고 상세 내용을 입력해주세요." autoCapitalize='none'
                                                  onChangeText={(text) => this.writeText(text, "text")}
                                                  style={styles.textAreaContainer} />
                                    </Form>


                                )

                            }
                            <View style={styles.btnArea2}>
                                <TouchableOpacity style={styles.btn2} onPress={()=>this.report()}>
                                    <Text style={{color: 'black', fontWeight:'bold'}}>신고</Text>

                                </TouchableOpacity>
                            </View>

                        </Content>
                    </Container>
                </TouchableWithoutFeedback>


            </Container>
        );
    }
}


const styles = StyleSheet.create({
    title:{
      margin:10,
        flexDirection:'row'
    },
    text_on:{
        fontSize:18,
        fontWeight: 'bold',
        color: 'black'
    },
    text_off:{
        fontSize:18,
        fontWeight: 'bold',
        color: 'grey'
    },
    textAreaContainer:{
        marginLeft:5,
        marginRight:5,
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: wp(7),
        paddingRight: wp(7),
    },
    topArea: {
        flex: 1,
        paddingTop: wp(2),
    },
    formArea: {
        justifyContent: 'center',
        // paddingTop: wp(10),
        flex: 1.5,
    },
    btnArea2: {
        height: hp(8),
        // backgroundColor: 'orange',
        paddingBottom: hp(1.5),
        marginTop:10,
        alignItems: 'flex-end',
        paddingRight: 8
    },
    btn2: {
        flex: 1,
        width: 100,
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffaaaa',
        flexDirection: "row",
    },

});