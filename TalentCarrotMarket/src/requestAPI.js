import axios from 'axios';

const axi = axios.create({baseURL: "http://10.0.2.2:3000"});

export async function userTest(){
    const info = await axi.get('/user/test')

    console.log(info.data)
    return info.data;
}

//Test
export async function postInfo({title, content, category, tag, view, date}){
    console.log("request");
    console.log({title,content});
    const info = await axi.post("/user/write", {title, content, category, tag, view, date});
    console.log(info);
    return info.data;
}

//HomeScreen 컴포넌트로 게시물 데이터 GET
export async function getPost(page){
    console.log(`getPost함수 ${page} 페이지 호출됨`);
    const postData = await axi.get("/data/getPost", {params:{page:page}});
    //console.log(postData.data);
    return postData.data;
}

export async function getPostBySearch(search){
    //console.log(search);
    console.log("getPostBySearch함수 호출됨");
    const postData = await axi.get("/data/getPostBySearch", {params:{searchValue : search}});
    return postData.data;
}

export async function createPost({title, image, text, category, tag}){
    console.log("createPost함수 호출됨");
    console.log({title, image, text, category, tag});
    const info = await axi.post("/data/createPost", {title, image, text, category, tag});
    return info.data;
}

export async function getPostByCategory(category){
    console.log("getPostByCategory함수 호출됨");
    console.log(category);
    const postData = await axi.get("/data/getPostByCategory", {params:{category:category}});
    return postData.data;
}

export default{
    userTest,
    postInfo,
    getPost,
    getPostBySearch,
    createPost,
    getPostByCategory
}
