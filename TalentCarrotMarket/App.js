import React from 'react';
import type {Node} from 'react';
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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons';

import homeScreen from './src/screens/HomeScreen';
import aroundScreen from './src/screens/AroundScreen';
import chattingScreen from './src/screens/ChattingScreen';
import mypageScreen from './src/screens/MypageScreen';
import talentScreen from './src/screens/TalentScreen';


const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen
        name="TabFirst"
        component={homeScreen}
        options={{
          tabBarLabel: 'HOOOOOOOOOOOOOOOOOOOOOOOOOMMMMMEEEEEEEEEE',
          tabBarIcon: ({color}) => <Icon2 name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="TabSecond"
        component={talentScreen}
        options={{
          tabBarLabel: '재능',
          tabBarIcon: ({color}) => (
            <Icon3 name="document-text" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TabThird"
        component={aroundScreen}
        options={{
          tabBarLabel: '내 근처',
          tabBarIcon: ({color}) => (
            <Icon4 name="map-marker-radius-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TabFourth"
        component={chattingScreen}
        options={{
          tabBarLabel: '채팅',
          tabBarIcon: ({color}) => (
            <Icon3 name="ios-chatbubble-ellipses-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="TabFifth"
        component={mypageScreen}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({color}) => (
            <Icon3 name="person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
    </NavigationContainer>
  );
}
