import React, { useEffect, createRef} from 'react';
import {
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon5 from 'react-native-vector-icons/MaterialIcons';
import Icon6 from 'react-native-vector-icons/FontAwesome5';


import SplashScreen from './src/screens/SplashScreen';
import talentScreen from './src/screens/TalentScreen';

//Auth
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';

//postStack(home)
import homeScreen from './src/screens/Post/HomeScreen';
import searchPostScreen from './src/screens/Post/SearchPostScreen';

import makePostScreen from './src/screens/Post/MakePostScreen';
import filterOptionScreen from './src/screens/Post/FilterOptionScreen';

import detailPostScreen from './src/screens/Post/DetailPostScreen';
import tradeSetScreen from './src/screens/Chat/TradeSetScreen';
import reportScreen from './src/screens/Post/ReportScreen';

import userProfileScreen from './src/screens/Post/UserProfileScreen';

//TalentStack
import advertising from './src/screens/Advertising/AdvertisingScreen';
import makead from './src/screens/Advertising/MakeAdScreen';

//chatStack
import chatchScreen from './src/screens/Chat/ChatChScreen';
import chatScreen from './src/screens/Chat/ChatScreen';
import chatListByPostScreen from './src/screens/Chat/ChatListByPostScreen';
import chatListRoomScreen from './src/screens/Chat/ChatListRoomScreen';
import chatchroomScreen from './src/screens/Chat/ChatchRoomScreen';
import chatTestScreen from './src/screens/Chat/ChatTestScreen';
import tradeTimerScreen from './src/screens/Chat/TradeTimerScreen';
import userRateScreen from './src/screens/Chat/UserRateScreen';
import chatUserProfileScreen from './src/screens/Chat/ChatUserProfileScreen';
import chatDetailPostScreen from './src/screens/Chat/ChatDetailPostScreen';

//aroundStack
import aroundScreen from './src/screens/Around/AroundScreen';
import aroundSetScreen from './src/screens/Around/AroundSetScreen';
import aroundAddScreen from './src/screens/Around/AroundAddScreen';
import aroundCertifyScreen from './src/screens/Around/AroundCertifyScreen';

//MyPageStack
import mypageScreen from './src/screens/Mypage/MypageScreen';
import userPostScreen from './src/screens/Mypage/UserPostScreen';
import userTradingPostScreen from './src/screens/Mypage/UserTradingPostScreen';
import editUserPostScreen from './src/screens/Mypage/EditUserPostScreen';
import editProfileScreen from './src/screens/Mypage/EditProfileScreen';
import keywordScreen from './src/screens/Mypage/KeywordScreen';
import certificationScreen from './src/screens/Mypage/CertificationScreen';
import editadverScreen from './src/screens/Advertising/EditAdverScreen';
import detailadverScreen from './src/screens/Advertising/DetailAdverScreen';
import Iamport from "./src/Iamport";

//admin
//import adverRequest from './src/adminScreens/Advertisement/AdverRequestScreen';
import adverStatus from './src/adminScreens/Advertisement/AdverStatusScreen';
import modifyApprove from './src/adminScreens/Advertisement/ModifyApproveScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const TalentStack = createStackNavigator();
const AroundStack = createStackNavigator();
const ChatStack = createStackNavigator();
const SettingStack = createStackNavigator();

//AdminReportStack
import adminReportScreen from './src/adminScreens/Report/ReportScreen';
import detailReportPostScreen from './src/adminScreens/Report/DetailReportPostScreen';
//AdminAdvertisementStack
import adminAdvertisementScreen from './src/adminScreens/Advertisement/AdvertisementScreen';
//AdminMypageStack
import adminMypageScreen from './src/adminScreens/Mypage/MypageScreen';

import { LogBox } from 'react-native';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();

const AdminReportStack = createStackNavigator();
const AdminAdvertisementStack = createStackNavigator();
const AdminMypageStack = createStackNavigator();

//로그인, 회원가입
const Auth = () =>{
  return(
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
    </Stack.Navigator>

  )
}
//Home Tab 스크린 기준 Stack(게시글 확인)
const HomeStackScreen = () => {
  return (
    <Stack.Navigator>
      <HomeStack.Screen options={{title: "홈"}} name="Home" component={homeScreen} />
      <HomeStack.Screen options={{title: "게시글 검색"}} name="SearchPost" component={searchPostScreen} />
      <HomeStack.Screen options={{title: "게시글 만들기"}} name="MakePost" component={makePostScreen}/>
      <HomeStack.Screen options={{title: "검색 옵션"}} name="FilterOption" component={filterOptionScreen}/>
      <HomeStack.Screen options={{title: "게시글 정보"}} name="DetailPost" component={detailPostScreen}/>
      <HomeStack.Screen options={{title: "채팅"}} name="chat" component={chatScreen} />
      <ChatStack.Screen options={{title: "게시글 만들기"}} name="게시글별 채팅리스트" component={chatListByPostScreen} />
      <ChatStack.Screen options={{title: "채팅"}}  name="게시글별 채팅리스트 채팅방" component={chatListRoomScreen} />

      <HomeStack.Screen options={{title: "거래"}} name="tradeset" component={tradeSetScreen} />
      <HomeStack.Screen options={{title: "신고"}} name="Report" component={reportScreen} />

      <HomeStack.Screen options={{title: "사용자 프로필"}} name="사용자 프로필" component={userProfileScreen} />

    </Stack.Navigator>
  );
};

//재능 Tab 스크린 기준 Stack
const TalentStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerTitle: false,    }}>
      {/*<TalentStack.Screen name="advertise" component={advertising} />*/}
      {/*<TalentStack.Screen name="makeadver" component={makead}/>*/}
    </Stack.Navigator>
  );
};

//내 근처 Tab 스크린 기준 Stack
const AroundStackScreen = () => {
  return (
    <Stack.Navigator>
      {/*<AroundStack.Screen name="around" component={aroundScreen} />*/}
      <AroundStack.Screen options={{title: "동네 설정"}} name="aroundSet" component={aroundSetScreen} />
      <AroundStack.Screen options={{title: "동네 추가"}} name="aroundAdd" component={aroundAddScreen} />
      <AroundStack.Screen options={{title: "동네 인증"}} name="aroundCertify" component={aroundCertifyScreen} />
    </Stack.Navigator>
  );
};

//채팅 Tab 스크린 기준 Stack
const ChatStackScreen = () => {
  return (
    <Stack.Navigator>
      <ChatStack.Screen options={{title: "채팅"}} name="chatch" component={chatchScreen} />
      <ChatStack.Screen options={{title: "채팅"}} name="chat" component={chatScreen} />
      <ChatStack.Screen options={{title: "채팅"}} name="chatTest" component={chatTestScreen} />
      <ChatStack.Screen options={{title: "게시글별 채팅리스트"}} name="게시글별 채팅리스트" component={chatListByPostScreen} />
      <ChatStack.Screen options={{title: "거래 타이머"}} name="tradeTimer" component={tradeTimerScreen} />
      <ChatStack.Screen options={{title: "사용자 평가"}} name="userRate" component={userRateScreen} />
      <ChatStack.Screen options={{title: "거래"}} name="tradeset" component={tradeSetScreen} />
      <ChatStack.Screen options={{title: "채팅"}} name="chatchroom" component={chatchroomScreen} />
      <ChatStack.Screen options={{title: "사용자 프로필"}} name="사용자 프로필" component={chatUserProfileScreen} />
      <ChatStack.Screen options={{title: "게시글 정보"}} name="DetailPost" component={chatDetailPostScreen}/>
 </Stack.Navigator>
  );
};

//마이페이지 Tab 스크린 기준 Stack
const SettingStackScreen = () => {
  return (
    <Stack.Navigator>
      <SettingStack.Screen options={{title: "마이페이지"}} name="마이페이지" component={mypageScreen} />
      <SettingStack.Screen options={{title: "구매내역"}} name="userPostScreen" component={userPostScreen}/>
      <SettingStack.Screen options={{title: "판매내역"}} name="userTradingPostScreen" component={userTradingPostScreen}/>
      <SettingStack.Screen options={{title: "게시글 수정"}} name="editUserPostScreen" component={editUserPostScreen}/>
      <SettingStack.Screen options={{title: "프로필 수정"}} name="editProfileScreen" component={editProfileScreen}/>
      <SettingStack.Screen options={{title: "키워드"}} name="keywordScreen" component={keywordScreen}/>
      <SettingStack.Screen options={{title: "자격증"}} name="자격증 증명" component={certificationScreen}/>
      <SettingStack.Screen options={{title: "광고"}} name="advertise" component={advertising} />
      <SettingStack.Screen options={{title: "광고 생성"}} name="makeadver" component={makead}/>
      <SettingStack.Screen options={{title: "광고 편집"}} name="editadver" component={editadverScreen}/>
      <SettingStack.Screen options={{title: "광고 정보"}} name="detailadver" component={detailadverScreen}/>
      <SettingStack.Screen options={{title: "결제"}} name="결제" component={Iamport}/>


    </Stack.Navigator>
  );
};

const MainTabScreen =({}) => {
  return(
    <Tab.Navigator>
      <Tab.Screen
        initialRouteName="HomeStack"
        name="TabFirst"
        component={HomeStackScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({color}) => <Icon2 name="home" color={color} size={26} />,
        }}
      />
      {/*<Tab.Screen
        name="TabSecond"
        component={TalentStackScreen}
        options={{
          tabBarLabel: '재능',
          tabBarIcon: ({color}) => (
            <Icon3 name="document-text" color={color} size={26} />
          ),
        }}
      />*/}
      <Tab.Screen
        name="TabThird"
        component={AroundStackScreen}
        options={{
          tabBarLabel: '내 근처',
          tabBarIcon: ({color}) => (
            <Icon4 name="map-marker-radius-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TabFourth"
        component={ChatStackScreen}
        options={{
          tabBarLabel: '채팅',
          tabBarIcon: ({color}) => (
            <Icon3 name="ios-chatbubble-ellipses-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TabFifth"
        component={SettingStackScreen}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({color}) => (
            <Icon3 name="person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

// Admin 화면들
const AdminReportStackScreen = () => {
    return (
        <Stack.Navigator>
            <AdminReportStack.Screen name="신고 확인" component={adminReportScreen} />
            <AdminReportStack.Screen name="상세 게시물" component={detailReportPostScreen}/>

        </Stack.Navigator>
    );
};

const AdminAdvertisementStackScreen = () => {
    return (
        <Stack.Navigator>
            <AdminAdvertisementStack.Screen name="광고 확인" component={adminAdvertisementScreen} />
            {/* <AdminAdvertisementStack.Screen name="adverrequest" component={adverRequest} /> */}
            <AdminAdvertisementStack.Screen name="adverstatus" component={adverStatus} />
            <AdminAdvertisementStack.Screen name="modifyapprove" component={modifyApprove} />


        </Stack.Navigator>
    );
};

const AdminMypageStackScreen = () => {
    return (
        <Stack.Navigator>
            <AdminMypageStack.Screen name="관리자 페이지" component={adminMypageScreen} />

        </Stack.Navigator>
    );
};

const AdminTabScreen =({}) => {
    return(
        <Tab.Navigator>
            <Tab.Screen
                initialRouteName="AdminReportStack"
                name="TabFirst"
                component={AdminReportStackScreen}
                options={{
                    tabBarLabel: '신고',
                    tabBarIcon: ({color}) => <Icon5 name="report" color={color} size={26} />,
                }}
            />
            <Tab.Screen
                name="TabSecond"
                component={AdminAdvertisementStackScreen}
                options={{
                    tabBarLabel: '광고',
                    tabBarIcon: ({color}) => (
                        <Icon6 name="ad" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="TabThird"
                component={AdminMypageStackScreen}
                options={{
                    tabBarLabel: '마이페이지',
                    tabBarIcon: ({color}) => (
                        <Icon3 name="person" color={color} size={26} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const App=()=> {

  useEffect(async()=>{
    await messaging().registerDeviceForRemoteMessages();
    // export const navigationRef = React.createRef();

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {

      Toast.show({
        text1: remoteMessage.notification.title,
        text2: remoteMessage.notification.body,
        visibilityTime: 4000,
        topOffset: 20,
      });

    });
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      console.log(remoteMessage.data);
      // setTimeout((remoteMessage) => {
      //   navigate('MainTab', null);
      // }, 1000);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(remoteMessage);
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
            remoteMessage.data.type,
          );
        }
      });

    return unsubscribe;
  }, []);

  return (

      <NavigationContainer>
      {/* Stack Navigator for Login+Logout  */}
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
        name="다재다능"
        component={SplashScreen}
        />
        <Stack.Screen
            name="Auth"
            component={Auth}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="MainTab"
            // options={({route}) => ({
            //   headerTitle: getHeaderTitle(route),
            // })}
            component={MainTabScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
              name="AdminTab"
              component={AdminTabScreen}
              options={{headerShown: false}}
              />
      </Stack.Navigator>
      {/* 알림용 */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
