const express = require('express');
const router = express.Router();

const Posts = require('../schemas/post.js')

//게시글 전체 조회
router.get('/posts', async (req, res) => {
    const posts = await Posts.find({});
    const renamePosts = []
    posts.forEach(post => {
        renamePosts.push({
            "postId": post._id,
            "user": post.user,
            "title": post.title,
            "createdAt": post.date
        });
    });

    res.status(200).json({
        "data": renamePosts
    });
});

//게시글 상세 조회
router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params 
    console.log(postId);
    const post = await Posts.find({ _id:postId });
    if(post.lengh === 0){
        return res.json({"message":"그런 아이디는 없습니다"})
    }

    console.log(post);

    res.status(200).json({"data":""});
});

//게시글작성
router.post('/posts', async (req, res) => {
    const { user, password, title, content } = req.body;
    const post_arr = Object.values(req.body);
    const date = new Date();
    date.setHours(date.getHours() + 9);


    if (user === '' || password === '' || title === '' || content === '') {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }

    try {
        const postCreate = await Posts.create({ user, password, title, content, date });
        return res.status(200).json({ message: "작성완료되었습니다" });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: "내용이 안써져있습니다" });
    }

});

//게시글 수정
router.put('/posts/:postId', async(req,res) => {
    const { postId } = req.params
    const { content } = req.body
    if ( postId === ""|| content === '') {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    console.log(postId);
    try{
        const existPost = await Posts.find({_id: postId}); 
        if(existPost.length) {
            await Posts.update({_id:postId},{$set:{content: content}});
            res.status(200).json({message:"게시글 수정됬어요"});
        }   
    }catch{
        return res.status(404).json({ message: "postid가 없습니다" });
    }
});


//게시글 삭제
router.delete('/posts/:postId', async(req,res)=>{
    const {postId} =req.params
    const {password} = req.body
    if ( postId === ""|| password === '') {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    try{
        const existPost = await Posts.find({_id: postId}); 
        if(existPost.length) {
            await Posts.deleteOne({_id:postId});
            res.status(200).json({message:"삭제완료"});
        }   
    }catch{
        return res.status(404).json({ message: "postid가 없습니다" });
    }

});


module.exports = router;