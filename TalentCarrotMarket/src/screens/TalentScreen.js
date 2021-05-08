import React, {Component} from 'react';
import BackgroundTimer from 'react-native-background-timer';
import CountDown from 'react-native-countdown-component';


import {
    View,
    Text,
    ScrollView,
    StyleSheet
} from 'react-native';



export default class TalentScreen extends Component{
    render() {
    return (
    <View style ={{ flex : 1, justifyContent : 'center', alignItems : 'center'}}>

    <Text>거래 시간 설정</Text>

      <CountDown
        size={30}
        until={100000}
        onFinish={() => alert('Finished')}
        digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
        digitTxtStyle={{color: '#1CC627'}}
        timeLabelStyle={{color: 'green', fontWeight: 'bold'}}
        separatorStyle={{color: '#1CC625'}}
        timeToShow={['D','H', 'M', 'S']}
        timeLabels={{d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds'}}

        showSeparator
      />
    </View>
    )
}
}




/*
// Start a timer that runs continuous after X milliseconds
const intervalId = BackgroundTimer.setInterval(() => {
	// this will be executed every 200 ms
	// even when app is the the background
	console.log('tic');
}, 200);

// Cancel the timer when you are done with it
BackgroundTimer.clearInterval(intervalId);

// Start a timer that runs once after X milliseconds
const timeoutId = BackgroundTimer.setTimeout(() => {
	// this will be executed once after 10 seconds
	// even when app is the the background
  	console.log('tac');
}, 10000);

// Cancel the timeout if necessary
BackgroundTimer.clearTimeout(timeoutId);
*/

/*export default class HomeScreen extends Component{
    render(){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text>Talent!</Text>
            </View>
        );
    }
}*/


/*<View style = {styles.container}>
	<Text style={styles.text}>
		{this.state.text}
	</Text>
	<Button
	onPress={this._Timeset}
	title={'Timeset'}
	/>
</View> */