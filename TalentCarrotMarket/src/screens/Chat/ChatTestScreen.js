import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import ChatScreen from "./ChatScreen";
import {HOST} from "../../function";


const socket = io(`http://${HOST}:3002`); // replace with the IP of your server, when testing on real devices

export default class ChatTestScreen extends Component{
	constructor(props) {
		super(props);
		this.state = {
			connected: socket.connected,
			currentTransport: socket.connected ? socket.io.engine.transport.name : '-',
			lastMessage: "",
			message:[]
		};
	}


	componentDidMount() {
		socket.on('connect', () => this.onConnectionStateUpdate());
		socket.on('disconnect', () => this.onConnectionStateUpdate());
		socket.on('message', (content) => this.onMessage(content));
		socket.on('newMessage',()=> this.newMessage());
	}

	componentWillUnmount() {
		socket.off('connect');
		socket.off('disconnect');
		socket.off('message');
		socket.off('newMessage');
	}

	onConnectionStateUpdate() {
		this.setState({
			connected: socket.connected,
			currentTransport: socket.connected ? socket.io.engine.transport.name : '-'
		});
		if (socket.connected) {
			socket.io.engine.on('upgrade', () => this.onUpgrade());
		} else {
			socket.io.engine.off('upgrade');
		}
	}

	onMessage(content) {
		this.setState({
			lastMessage: content
		});
		// console.log('유야효~'+content);

	}

	newMessage(){
		socket.on('newMessage', (msg)=>{
			this.setState({
				message: msg
			});
			console.log('무야호  ');
			console.log(msg);
			});

	};

	onUpgrade() {
		this.setState({
			currentTransport: socket.io.engine.transport.name
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>State: { this.state.connected ? 'Connected' : 'Disconnected' }</Text>
				<Text>Current transport: { this.state.currentTransport }</Text>
				<Text>Last message: { this.state.lastMessage }</Text>
				<Text>Message : {this.state.message}</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});


