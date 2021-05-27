import IMP from 'iamport-react-native';

export function IamportPayment() {
	function callback(response) {
		// navigation 을 이용해 결과 렌더링 Component로 이동
		console.log("된건가..? " + response);
	}

	/* [필수입력] 결제에 필요한 데이터를 생성합니다. */
	const data = {
		pg: 'kakao',
		pay_method: 'card',
		name: '테스트',
		merchant_uid: `mid_${new Date().getTime()}`,
		amount: 100,
		buyer_name: '홍길동',
		buyer_tel: '01012345678',
		buyer_email: 'example@naver.com',
		buyer_addr: '서울시 강남구 신사동 661-16',
		buyer_postcode: '06018',
		app_scheme: 'example',
		// [Deprecated v1.0.3]: m_redirect_url
	};

	return (
		<IMP.Payment
			userCode={'iamport'}  // 가맹점 식별코드
			data={data}           // 결제 데이터
			callback={callback}   // 결제 종료 후 콜백
		/>
	);
}

export default IamportPayment;
