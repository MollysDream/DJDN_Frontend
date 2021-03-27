import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import homeScreen from './src/screens/HomeScreen';
import aroundScreen from './src/screens/AroundScreen';
import chattingScreen from './src/screens/ChattingScreen';
import mypageScreen from './src/screens/MypageScreen';
import talentScreen from './src/screens/TalentScreen';

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
      <AroundStack.Screen name="around" component={aroundScreen} />
    </Stack.Navigator>
  );
};

//채팅 Tab 스크린 기준 Stack
const ChatStackScreen = () => {
  return (
    <Stack.Navigator>
      <ChatStack.Screen name="chat" component={chattingScreen} />
    </Stack.Navigator>
  );
};

//마이페이지 Tab 스크린 기준 Stack
const SettingStackScreen = () => {
  return (
    <Stack.Navigator>
      <SettingStack.Screen name="Home" component={mypageScreen} />
    </Stack.Navigator>
  );
};

const MainTabScreen =({navigation, route}) => {
  return(
    <Tab.Navigator>
      <Tab.Screen
        initialRouteName="HomeStack"
        name="TabFirst"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "홈",
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
       name="SplashScreen"
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