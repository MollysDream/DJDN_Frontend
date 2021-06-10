import {showMessage} from "react-native-flash-message";

function getDate(date){

    let itemTime = getGMT9Date(new Date(date));
    let curTime = getGMT9Date(new Date());
    //console.log(itemTime);
    //console.log(curTime);

    let delta = Math.abs(curTime - itemTime) / 1000;

    let days = Math.floor(delta / 86400);
    delta -= days * 86400;

    let hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    let minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    let seconds = Math.floor(delta % 60);  // in theory the modulus is not required

    //console.log(days +" "+hours+" "+minutes+" "+seconds);

    //console.log(String(itemTime));
    if(days>30){
        return `${itemTime.getUTCFullYear()}년-${itemTime.getUTCMonth()+1}월`;
    }
    if(days>0)
        return days+'일 전';
    if(hours>0)
        return hours+'시간 전';
    if(minutes)
        return minutes+'분 전';
    return seconds+'초 전';


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

//const HOST = '192.168.25.35' // 정수범 안드로이드
// const HOST = '192.168.219.114' // 나준엽 안드로이드
// const HOST = '192.168.25.32' // 김영웅 안드로이드
// const HOST = '101.101.208.25'
const HOST = '101.101.208.25'

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
