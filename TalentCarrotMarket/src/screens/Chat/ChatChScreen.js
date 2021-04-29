import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const ChatChScreen =({navigation})=>{
    
        return (
            <View style={styles.container}>
                <FlatList
                    data={threads}
                    keyExtractor={item => item._id}
                    ItemSeparatorComponent={() => <Divider />}
                    renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        description="Item description"
                        titleNumberOfLines={1}
                        titleStyle={styles.listTitle}
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
    listTitle: {
      fontSize: 22
    },
    listDescription: {
      fontSize: 16
    }
  });
export default ChatChScreen;