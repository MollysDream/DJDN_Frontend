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

export async function getPostOrUserReport(category, postOrUser){
    console.log(`getPostOrUserReport함수 호출됨`);
    const reportData = await axi.get("/report/getPostOrUserReport", {params:{category:category, postOrUser:postOrUser}});
    //console.log(reportData.data);
    return reportData.data;
}

/*export async function getUserReport(category){
    console.log(`getUserReport함수 호출됨`);
    console.log(category);
    const reportData = await axi.get("/report/getUserReport", {params:{category:category}});
    //console.log(reportData.data);
    return reportData.data;
}*/

export async function deleteReport(reportId){
    console.log('deleteReport함수 호출됨');
    const result = await axi.delete("/report/deleteReport", {params:{reportId:reportId}});

    return result.data;
}

export async function deletePostandReport(postId){
    console.log('deletePostandReport함수 호출됨');
    const result = await axi.delete("/report/deletePostandReport", {params:{postId:postId}});

    return result.data;
}

export async function setBanUser(userId, TF, banDate){
    console.log("setBanUser함수 호출됨");
    console.log(`밴 상태: ${TF} 로 변경`);
    const result = await axi.post("/report/setBanUser", {userId, TF, banDate});
    return result.data;
}

/*export async function unBanUser(userId){
    console.log("banUser함수 호출됨");
    console.log(`밴 상태: false 로 변경`);
    const result = await axi.post("/report/unBanUser", {userId});
    return result.data;
}*/

export default{
    reportPostOrUser,
    getAllReport,
    getPostOrUserReport,
    deleteReport,
    deletePostandReport,
    setBanUser,

}
