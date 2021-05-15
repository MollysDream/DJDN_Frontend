import React, {useState,useEffect} from 'react';
import { Content, Container, Header, Left, Right, Title, Body, Item, Label,
    Input, Form, Textarea } from 'native-base';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image, FlatList, RefreshControl
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Entypo';
import requestUserAPI from "../../requestUserAPI";
import FlashMessage, {showMessage} from "react-native-flash-message";
import {backgroundColor} from "react-native-tab-view/lib/typescript/example/src/CoverflowExample";



const KeywordScreen = ({navigation, route}) => {
    const [userId, setUserId]= useState(route.params.userId);
    const [editKeyword, setEditKeyword] = useState('');
    const [keywordList, setKeywordList] = useState(route.params.keywordList);

    const MAXKEYWORD = 15;

    function writeKeyword(text) {
        setEditKeyword(text);
    }

    function message(text){
        showMessage({message:text, type:'info'});
    }

    async function saveKeyword() {

        if(keywordList.length>=MAXKEYWORD){
            message(`키워드는 최대 ${MAXKEYWORD}개까지 등록 가능합니다!`)
            return;
        }
        if(keywordList.includes(editKeyword)){
            message('이미 등록한 키워드입니다!')
            return;
        }
        if(editKeyword.length > 8){
            message('키워드는 8자까지 등록 가능합니다!')
            return;
        }


        let result = await requestUserAPI.addKeyword(userId, editKeyword);
        //console.log(keywordList);
        setKeywordList([...keywordList,editKeyword]);
        setEditKeyword('');
    }

    async function deleteKeyword(keyword) {
        let result = await requestUserAPI.deleteKeyword(userId, keyword);
        setKeywordList(keywordList.filter(word=> word != keyword));
    }

    return (
        <View style={{flex:1, backgroundColor:'white'}}>
            <FlashMessage position="top"/>

            <View style={styles.buttonList}>
                <Icon style={styles.iconPlace} name="tags"  size={40} color="#37CEFF" />
                <Text style={styles.buttonText}>{`키워드 알림`}</Text>
                <Text style={[styles.buttonText, {color:'#006BFF'}]}>{keywordList.length}</Text>
                <Text style={[styles.buttonText, {marginLeft:1}]}>{`/${MAXKEYWORD}`}</Text>
            </View>

            <Form style={styles.formBox}>
                <View style={styles.inputKeyword}>
                    <Item style={{borderColor:'transparent'}}>
                        <Input autoCapitalize='none'
                               placeholder={'키워드를 입력해주세요'} onChangeText={(text) => writeKeyword(text)}>{editKeyword}</Input>
                    </Item>
                </View>


                {
                    editKeyword == '' ?
                        <TouchableOpacity style={styles.saveButton}>
                            <Text style={(styles.TextOff)}>등록</Text>
                        </TouchableOpacity>:
                        <TouchableOpacity style={styles.saveButton} onPress={saveKeyword}>
                            <Text style={(styles.Text)}>등록</Text>
                        </TouchableOpacity>
                }
                

            </Form>

            <View style={styles.keywordBox}>
                {
                    keywordList.map(keyword=>
                        <View style={styles.keyword} key={keyword}>
                            <Text style={{fontSize:17}}>{keyword}</Text>
                            <TouchableOpacity onPress={()=>deleteKeyword(keyword)}>
                                <Icon2 name="cross"  size={22} color="#505a84" />
                            </TouchableOpacity>
                        </View>
                    )
                }

            </View>



        </View>


    );
}


const styles = StyleSheet.create({
    buttonList: {
        //borderWidth:1,
        height:55,
        flexDirection:'row',
        backgroundColor: '#ecfeff',
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
    inputKeyword:{
        fontSize: 18,
        //borderWidth:1,
        width:'87%'
    },
    formBox: {
        paddingRight: 12,
       // borderWidth: 1,
        marginLeft:10,
        marginRight: 10,
        backgroundColor: '#ecfeff',
        borderRadius: 10,
        flexDirection: 'row'
    },
    Text:{
        fontSize:18,
        color: '#00c1ff'
    },
    saveButton:{
        width:50,
        //borderWidth:1,
        alignItems:'center',
        paddingTop:13
    },
    TextOff: {
        fontSize:18,
        color: '#7f7f7f'
    },
    keywordBox: {
        //borderWidth:1,
        paddingLeft:5,
        paddingRight: 5,
        marginLeft:10,
        marginRight: 10,
        marginTop:10,
        flexDirection:'row',
        flexWrap:'wrap'

    },
    keyword:{
        borderWidth:1,
        borderColor:'#9babb4',
        borderRadius:10,
        backgroundColor:'#daeeff',
        paddingLeft:8,
        paddingTop:8,
        paddingBottom:8,
        paddingRight:3,
        marginRight:8,
        flexDirection:'row',
        marginBottom: 8


    },


});

export default KeywordScreen;