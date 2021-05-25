import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});


export async function reportPostOrUser(reportDataParam){
    console.log(`reportPostOrUser함수 호출됨`);
    /*console.log(reportDataParam.reportUser);
    console.log(reportDataParam.targetUser);
    console.log(reportDataParam.targetPost);
    console.log(reportDataParam.reportWhat);
    console.log(reportDataParam.reportCategory);
    console.log(reportDataParam.text);*/

    const result = await axi.post("/report/reportDataParam", reportDataParam);

    return result.data;
}

export async function getAllReport(){
    console.log(`getAllReport함수 호출됨`);
    const reportData = await axi.get("/report/getAllReport");
    //console.log(reportData.data);
    return reportData.data;
}

export default{
    reportPostOrUser,
    getAllReport

}
