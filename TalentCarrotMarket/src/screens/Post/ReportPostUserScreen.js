import React, {useState} from 'react';

import { Content, Container, Text, Form, Textarea } from 'native-base';
import {
    StyleSheet,
    View,
    TouchableOpacity,
   } from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import requestReportAPI from "../../requestReportAPI";
import FlashMessage, {showMessage} from "react-native-flash-message";
import {message} from "../../function";

const ReportPostUserScreen = ({navigation, route}) => {

    const detailPost = route.params.detailPost;
    const postOwner = route.params.postOwner;
    const [reportWhat, setReportWhat] = useState(0);

    //const [postCategory, setPostCategory]=useState('');
    //const postCategoryList = ['사기 글', '불법 재능', '불법 광고', '욕설','물건 판매', '기타'];

    //const [userCategory, setUserCategory]=useState('');
    //const userCategoryList = ['비매너', '욕설', '성희롱', '채팅비매너', '기타'];
    const [text, setText] = useState('');

    const userId = route.params.userId;

    //Picker
    const [open, setOpen] = useState(false);
    const [postCategory, setPostCategory] = useState('');
    const [postCategoryList, setPostCategoryList] = useState([
        {label: '사기 글', value: '사기 글'},
        {label: '불법 재능', value: '불법 재능'},
        {label: '불법 광고', value: '불법 광고'},
        {label: '욕설', value: '욕설'},
        {label: '물건 판매', value: '물건 판매'},
        {label: '기타', value: '기타'}
    ]);

    const [userCategory, setUserCategory] = useState('');
    const [userCategoryList, setUserCategoryList] = useState([
        {label: '비매너', value: '비매너'},
        {label: '욕설', value: '욕설'},
        {label: '성희롱', value: '성희롱'},
        {label: '채팅비매너', value: '채팅비매너'},
        {label: '기타', value: '기타'}
    ]);


    const writeText = (text, type)=>{
        setText(text);
    }

    async function report(){
        let categoryParam = '';

        if(reportWhat == 0){
            categoryParam = postCategory
            if(postCategory == ''){
                message(`게시글 신고 사유를 설정해주세요!`);
                return;
            }
        }else{
            categoryParam = userCategory
            if(userCategory == ''){
                message(`사용자 신고 사유를 설정해주세요!`);
                return;
            }
        }

        if(text.length === 0){
            message(`신고 상세 내용을 작성해주세요!`);
            return;
        }

        const reportDataParam ={
            reportUser: userId,
            targetUser: postOwner._id,
            targetPost: detailPost._id,
            reportWhat: reportWhat,
            reportCategory: categoryParam,
            text: text
        }

        try{
            const resultData = await requestReportAPI.reportPostOrUser(reportDataParam);
            Alert.alert("신고 완료", "신고가 정상적으로 접수 되었습니다.",
                [{ text: '확인', style: 'cancel',
                    onPress : ()=> {
                        navigation.goBack();
                    }}])
        }
        catch(err){
            console.log(err);
        }




    }

        return (

                <View style={{backgroundColor:'white', flex:1}}>

                        <FlashMessage position="top"/>
                        <View style={styles.title}>
                            <TouchableOpacity style={{width:'50%', paddingLeft:10}} onPress={()=>setReportWhat(0)}>
                                <Text style={reportWhat == 0 ? styles.text_on : styles.text_off}>
                                    {`'${detailPost.title}' 게시글 신고`}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{width: '50%', paddingRight:10, alignItems:'flex-end'}} onPress={()=>setReportWhat(1)}>
                                <Text style={reportWhat == 1 ? styles.text_on : styles.text_off}>
                                    {`'${postOwner.nickname}' 사용자 신고`}
                                </Text>
                            </TouchableOpacity>
                        </View>


                        {reportWhat == 0 ?
                            (
                                <Form>

                                    <DropDownPicker
                                        placeholder={'게시글 신고 사유'}
                                        open={open}
                                        value={postCategory}
                                        items={postCategoryList}
                                        setOpen={setOpen}
                                        setValue={setPostCategory}
                                        setItems={setPostCategoryList}
                                        textStyle={{fontSize:15}}
                                    />

                                    {/*<Picker
                                        selectedValue={postCategory}
                                        onValueChange={(value) => setPostCategory(value)}
                                    >
                                        <Picker.Item color={'grey'} label={'게시글 신고 사유'} value={''}/>
                                        {
                                            postCategoryList.map((category, key)=>(
                                                <Picker.Item label={category} value={category} key={key}/>
                                            ))

                                        }
                                    </Picker>*/}

                                    <Textarea rowSpan={8} placeholder="신고 상세 내용을 입력해주세요." autoCapitalize='none'
                                              onChangeText={(text) => writeText(text, "text")}
                                              style={styles.textAreaContainer} />
                                </Form>


                            ):

                            (
                                <Form>

                                    <DropDownPicker
                                        placeholder={'사용자 신고 사유'}
                                        open={open}
                                        value={userCategory}
                                        items={userCategoryList}
                                        setOpen={setOpen}
                                        setValue={setUserCategory}
                                        setItems={setUserCategoryList}
                                        textStyle={{fontSize:15}}
                                    />
                                    {/*<Picker
                                        selectedValue={userCategory}
                                        onValueChange={(value) => setUserCategory(value)}
                                    >
                                        <Picker.Item color={'grey'} label={'사용자 신고 사유'} value={''}/>
                                        {
                                            userCategoryList.map((category, key)=>(
                                                <Picker.Item label={category} value={category} key={key}/>
                                            ))

                                        }
                                    </Picker>*/}

                                    <Textarea rowSpan={8} placeholder="신고 상세 내용을 입력해주세요." autoCapitalize='none'
                                              onChangeText={(text) => writeText(text, "text")}
                                              style={styles.textAreaContainer} />
                                </Form>


                            )

                        }
                        <View style={styles.btnArea2}>
                            <TouchableOpacity style={styles.btn2} onPress={()=>report()}>
                                <Text style={{color: 'black', fontWeight:'bold'}}>신고</Text>

                            </TouchableOpacity>
                        </View>


                </View>


    );
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

        alignItems: 'flex-end',
        paddingRight: 8,
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

export default ReportPostUserScreen;
