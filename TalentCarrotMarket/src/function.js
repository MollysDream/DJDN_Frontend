import {showMessage} from "react-native-flash-message";

function getDate(date){
    let ret='';
    let slice_date = date.split("T");

    //YMD 0 = 년, 1 = 월, 2 = 일
    let YMD = slice_date[0].split('-');
    //console.log(slice_date[1]);
    //HMS 0 = 시간, 1 = 분, 2 = 초
    let HM = slice_date[1].split(':');
    let S = HM[2].split('.')[0];


    let cur_date = new Date();
    let year = cur_date.getFullYear();
    let month = (1 + cur_date.getMonth());
    month = month >= 10 ? month: '0' + month;
    let day = cur_date.getDate();
    day = day >= 10 ? day : '0' + day;
    let hour = cur_date.getHours();
    let minutes = cur_date.getMinutes();
    let second = cur_date.getSeconds();



    ret = String(second-parseInt(S))+'초 전';
    if(parseInt(HM[1]) != parseInt(minutes))
        ret = String(minutes- HM[1])+'분 전';
    if((parseInt(HM[0])+9)%24 != parseInt(hour))
        ret = String(hour - (parseInt(HM[0])+9)%24)+'시간 전';
    if((parseInt(HM[0])+9)>=24)
        YMD[2] = parseInt(YMD[2]) + 1;
    if(YMD[2] != day)
        ret = String(day - YMD[2]) + "일 전";
    if(YMD[1] != month || YMD[0] != year)
        ret = `${YMD[0]}년-${YMD[1]}월`;

    return ret;
}

function getPrice(price){
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getPlusDate(plus){
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    var date = new Date()

    let banDate = date.addDays(plus);

    return banDate;
}

function getBanDate(date){
    let slice_date = date.split("T");
    let YMD = slice_date[0].split("-");
    let year = YMD[0];
    let month = YMD[1];
    let day = YMD[2];
    return `${year}년-${month}월-${day}일`
}

function getGMT9Date(date){
    Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        return this;
    }
    let krDate = date.addHours(9);

    return krDate;
}

function getAdEndDate(date){
    /*Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        return this;
    }
    let krDate = date.addHours(9);

    console.log(krDate);*/

    let year = date.getUTCFullYear();
    let month = date.getUTCMonth()+1;
    let day = date.getUTCDate();

    console.log(`${year}년-${month}월-${day}일`);

    return `${year}년-${month}월-${day}일`
}

//const HOST = '192.168.25.19' // 정수범 안드로이드
// const HOST = '192.168.219.114' // 나준엽 안드로이드
// const HOST = '172.30.1.53' // 김영웅 안드로이드
const HOST = '10.0.2.2'

function message(text){
    showMessage({message:text, type:'warning'});
}

export {
    getDate,
    getPrice,
    getPlusDate,
    getBanDate,
    HOST,
    message,
    getAdEndDate,
    getGMT9Date
}
