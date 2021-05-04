import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {List, Divider} from 'react-native-paper'

const ChatChScreen =({navigation})=>{
    
        return (
            <View style={styles.container}>
                <ChatListItem chatRoom />
            </View>
        );
    
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1
    },
    listTitle: {
      fontSize: 22
    },
    listDescription: {
      fontSize: 16
    }
  });
export default ChatChScreen;