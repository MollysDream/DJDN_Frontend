import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function userTest(){
    const info = await axi.get('/user/test')

    console.log(info.data)
    return info.data;
}

export async function postInfo({title, content, category, tag, view, date}){
    console.log("request");
    console.log({title,content});
    const info = await axi.post("/user/write", {title, content, category, tag, view, date});
    console.log(info);
    return info.data;
}

//HomeScreen 컴포넌트로 게시물 데이터 GET
export async function getPost(){
    console.log("getPost함수 호출됨");
    const postData = await axi.get("/data/getPost");
    //console.log(postData.data);

    return postData.data;
}

export default{
    userTest,
    postInfo,
    getPost
}
