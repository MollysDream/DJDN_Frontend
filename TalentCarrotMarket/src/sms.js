import axios from 'axios';
import smsKey from './smsKey';
import Base64 from 'crypto-js/enc-base64';
const CryptoJS =require ('crypto-js');

export default class sms {

	makeSignature(){
		var space = " ";				// one space
		var newLine = "\n";				// new line
		var method = "POST";				// method
		var url = `/sms/v2/services/${smsKey.serviceId}/messages`;	// url (include query string)
		var timestamp = Date.now().toString();			// current timestamp (epoch)
		var accessKey = smsKey.accessKey;			// access key id (from portal or Sub Account)
		var secretKey = smsKey.secretKey;			// secret key (from portal or Sub Account)

		var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
		hmac.update(method);
		hmac.update(space);
		hmac.update(url);
		hmac.update(newLine);
		hmac.update(timestamp);
		hmac.update(newLine);
		hmac.update(accessKey);

		var hash = hmac.finalize();
		var result = Base64.stringify(hash);
		return result.toString();
	};
	async sendSMS(){
		const body = {
			type: 'SMS',
			contentType: 'COMM',
			countryCode: '82',
			from: smsKey.phoneNumber, // 발신자 번호
			content: `문자 내용 부분 입니다.`,
			messages: [
				{
					to: smsKey.phoneNumber, // 수신자 번호
				},
			],
		};
		const options = {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'x-ncp-apigw-timestamp': Date.now().toString(),
				'x-ncp-iam-access-key': smsKey.accessKey,
				'x-ncp-apigw-signature-v2': this.makeSignature()
			},
		};
		axios
			.post(`https://sens.apigw.ntruss.com/sms/v2/services/${smsKey.serviceId}/messages`, body, options)
			.then(async (res) => {
				console.log('sms 발신 성공');
				console.log(res);
			})
			.catch((err) => {
				console.error(err.response.data);
			});

	}
}
