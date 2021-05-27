import React, {useState,useEffect} from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import ActivationScreen from './ActivationScreen';
import DisabledScreen from './DisabledScreen';

const AdvertisingScreen = ({navigation}) => {

    const [tab, setTab] = useState(0);


    let Screen = null;
    if(tab==0)
        Screen = <DisabledScreen navigation={navigation}/>
    else if(tab==1)
        Screen = <ActivationScreen navigation={navigation}/>
  

        return (
            
            <View style={styles.container}>
                 <TouchableOpacity onPress={()=>navigation.navigate('makeadver')}
                                  style={{borderWidth:0,position:'absolute',bottom:5,alignSelf:'flex-end'}}>
                    <Icon name="add-circle"  size={70} color="#37CEFF" />
                </TouchableOpacity>
                 <View style={styles.title}>                
                

                <TouchableOpacity style={{width:'50%', alignItems:'center'}} onPress={()=>setTab(0)}>
                    <Text style={tab == 0 ? styles.text_on : styles.text_off}>
                        {`비활성화 광고`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width: '50%', alignItems:'center'}} onPress={()=>setTab(1)}>
                    <Text style={tab == 1 ? styles.text_on : styles.text_off}>
                        {`활성화 광고`}
                    </Text>
                </TouchableOpacity>
                </View>
                <View>{Screen}</View>
                </View>
     
        )
    

}

const styles = StyleSheet.create({
    text_on:{
    fontSize:18,
        fontWeight: 'bold',
        color: '#ff5900',
        borderBottomWidth: 2,
        borderColor: '#ff5900'
},
text_off:{
    fontSize:18,
        fontWeight: 'bold',
        color: 'grey'
},
    title:{
        margin:10,
        flexDirection:'row',
        borderBottomWidth:5,
        borderColor:'#ffd6c4',
        paddingBottom:5
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: wp(2),
        paddingRight: wp(2),
    },

});
export default AdvertisingScreen;