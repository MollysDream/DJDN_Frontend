import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const ChatChScreen =({navigation})=>{

      const [threads, setThreads] = useState([]);

      useEffect(() => {
        const unsubscribe = firestore()
        .collection('Trade')
        .onSnapshot(querySnapshot => {
          const threads = querySnapshot.docs.map(documentSnapshot =>{
            return {
              _id: documentSnapshot.id,
              name:'',
              ...documentSnapshot.data()
            };
        });

        setThreads(threads);
        });

        return () => unsubscribe();
      }, []);
    
      return (
          <View style={styles.container}>
            <FlatList 
              data={threads}
              keyExtractor={item=>item._id}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({}) => (
                <List.Item
                  description="Item description"
                  titleNumberOfLines={1}
                  descriptionStyle={styles.listDescription}
                  descriptionNumberOfLines={1}
                  />
              )}
            />
          </View>
      );
    
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f5f5f5',
      flex: 1
    },
    listDescription: {
      fontSize: 16
    }
  });
export default ChatChScreen;