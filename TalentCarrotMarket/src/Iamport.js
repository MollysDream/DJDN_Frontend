import IMP from 'iamport-react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import requestPointAPI from "./requestPointAPI";
import requestUserAPI from "./requestUserAPI";



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



let amount = 100;

// export default function Iamport(route) {
//
// 	async function callback(response) {
// 		// navigation 을 이용해 결과 렌더링 Component로 이동
// 		console.log("된건가..? " + response);
// 		await requestPointAPI.addPoint(route.params.userId, amount);
//
// 		route.navigation.goBack(null);
// 	}
//
// 	/* [필수입력] 결제에 필요한 데이터를 생성합니다. */
// 	const data = {
// 		pg: 'inicis',
// 		pay_method: 'card',
// 		name: '테스트',
// 		merchant_uid: `mid_${new Date().getTime()}`,
// 		amount: amount,
// 		buyer_name: '홍길동',
// 		buyer_tel: '01012345678',
// 		buyer_email: 'example@naver.com',
// 		buyer_addr: '서울시 강남구 신사동 661-16',
// 		buyer_postcode: '06018',
// 		app_scheme: 'example',
// 		// [Deprecated v1.0.3]: m_redirect_url
// 	};
//
// 	return (
// 		<IMP.Payment
// 			userCode={'imp74960747'}  // 가맹점 식별코드
// 			data={data}           // 결제 데이터
// 			callback={callback}   // 결제 종료 후 콜백
// 		/>
// 	);
// }

export default function Iamport({navigation, route}) {

	async function callback(response) {
		// navigation 을 이용해 결과 렌더링 Component로 이동
		console.log(response);

		if(response.imp_success === 'true'){
			let returnData = await requestPointAPI.addPoint(route.params.userId, amount);
			console.log('포인트 충전 완료했음 , 총 포인트 : '+returnData.point);
		}
		else{
			alert(response.error_msg);
		}

		 navigation.goBack();
	}

	const [userId, setUserId]= useState(route.params.userId);
	const [userData, setUserData] = useState(route.params.userData);

	console.log("iamport에서 호출된 userData.name " + userData.name);
	console.log("iamport에서 호출된 userData.email " + userData.email);

		/* [필수입력] 결제에 필요한 데이터를 생성합니다. */
	const data = {
		pg: 'inicis',
		pay_method: 'card',
		name: userData.name+'의 아임포트 테스트',
		merchant_uid: `mid_${new Date().getTime()}`,
		amount: amount,
		buyer_name: userData.name,
		buyer_tel: '01012345678', //회원의 전화번호 필요
		buyer_email: 'junyeoop@naver.com',
		// buyer_addr: '서울시 강남구 신사동 661-16',
		// buyer_postcode: '06018',
		app_scheme: 'example',
	};

	// callback();

	return (
		// <View>
		// 	<Text>{`${data.name}`}</Text>
		// </View>
		<IMP.Payment
			userCode={'imp74960747'}  // 가맹점 식별코드
			data={data}           // 결제 데이터
			callback={callback}   // 결제 종료 후 콜백
		/>

	);
}

