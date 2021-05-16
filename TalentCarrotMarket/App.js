import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';

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
import reportScreen from './src/screens/Post/ReportScreen'



//chatStack
import chatchScreen from './src/screens/Chat/ChatChScreen';
import chatScreen from './src/screens/Chat/ChatScreen';
import chatListByPostScreen from './src/screens/Chat/ChatListByPostScreen';
import chatListRoomScreen from './src/screens/Chat/ChatListRoomScreen';
import chatchroomScreen from './src/screens/Chat/ChatchRoomScreen';
import chatTestScreen from './src/screens/Chat/ChatTestScreen';
import tradeTimerScreen from './src/screens/Chat/TradeTimerScreen';
import userRateScreen from './src/screens/Chat/UserRateScreen';

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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const TalentStack = createStackNavigator();
const AroundStack = createStackNavigator();
const ChatStack = createStackNavigator();
const SettingStack = createStackNavigator();

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
      <HomeStack.Screen name="Home" component={homeScreen} />
      <HomeStack.Screen name="SearchPost" component={searchPostScreen} />
      <HomeStack.Screen name="MakePost" component={makePostScreen}/>
      <HomeStack.Screen name="FilterOption" component={filterOptionScreen}/>
      <HomeStack.Screen name="DetailPost" component={detailPostScreen}/>
      <HomeStack.Screen name="chat" component={chatScreen} />
      <ChatStack.Screen name="게시글별 채팅리스트" component={chatListByPostScreen} />
      <ChatStack.Screen name="게시글별 채팅리스트 채팅방" component={chatListRoomScreen} />

      <HomeStack.Screen name="tradeset" component={tradeSetScreen} />
      <HomeStack.Screen name="Report" component={reportScreen} />
    </Stack.Navigator>
  );
};

//재능 Tab 스크린 기준 Stack
const TalentStackScreen = () => {
  return (
    <Stack.Navigator>
      <TalentStack.Screen name="talent" component={talentScreen} />
    </Stack.Navigator>
  );
};

//내 근처 Tab 스크린 기준 Stack
const AroundStackScreen = () => {
  return (
    <Stack.Navigator>
      {/*<AroundStack.Screen name="around" component={aroundScreen} />*/}
      <AroundStack.Screen name="aroundSet" component={aroundSetScreen} />
      <AroundStack.Screen name="aroundAdd" component={aroundAddScreen} />
      <AroundStack.Screen name="aroundCertify" component={aroundCertifyScreen} />
    </Stack.Navigator>
  );
};

//채팅 Tab 스크린 기준 Stack
const ChatStackScreen = () => {
  return (
    <Stack.Navigator>
      <ChatStack.Screen name="chatch" component={chatchScreen} />
      <ChatStack.Screen name="chat" component={chatScreen} />
      <ChatStack.Screen name="chatTest" component={chatTestScreen} />
      <ChatStack.Screen name="게시글별 채팅리스트" component={chatListByPostScreen} />
      <ChatStack.Screen name="tradeTimer" component={tradeTimerScreen} />
      <ChatStack.Screen name="userRate" component={userRateScreen} />
      <ChatStack.Screen name="tradeset" component={tradeSetScreen} />
      <ChatStack.Screen name="chatchroom" component={chatchroomScreen} />
 </Stack.Navigator>
  );
};

//마이페이지 Tab 스크린 기준 Stack
const SettingStackScreen = () => {
  return (
    <Stack.Navigator>
      <SettingStack.Screen name="마이페이지" component={mypageScreen} />
      <SettingStack.Screen name="userPostScreen" component={userPostScreen}/>
      <SettingStack.Screen name="userTradingPostScreen" component={userTradingPostScreen}/>
      <SettingStack.Screen name="editUserPostScreen" component={editUserPostScreen}/>
      <SettingStack.Screen name="editProfileScreen" component={editProfileScreen}/>
      <SettingStack.Screen name="keywordScreen" component={keywordScreen}/>

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
      <Tab.Screen
        name="TabSecond"
        component={TalentStackScreen}
        options={{
          tabBarLabel: '재능',
          tabBarIcon: ({color}) => (
            <Icon3 name="document-text" color={color} size={26} />
          ),
        }}
      />
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

const App=()=> {
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
    </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
