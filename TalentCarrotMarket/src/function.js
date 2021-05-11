
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



    ret = String(second-parseInt(S)+16)+'초 전';
    if(parseInt(HM[1]) != parseInt(minutes))
        ret = String(minutes- HM[1])+'분 전';
    if((parseInt(HM[0])+9)%24 != parseInt(hour))
        ret = String(hour - HM[0] - 9)+'시간 전';
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

export {
    getDate,
    getPrice
}