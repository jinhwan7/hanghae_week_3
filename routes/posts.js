const express = require('express');
const router = express.Router();

const Posts = require('../schemas/post.js')

//게시글 전체 조회
router.get('/', async (req, res) => {
    const posts = await Posts.find({});
    // const renamePosts = []
   const result =  posts.map(post => {
       return {
           "postId": post._id,
           "user": post.user,
           "title": post.title,
           "createdAt": post.date
        }

    }).reverse();
    res.status(200).json({
        "data": result
    });
});




//게시글 상세 조회
router.get('/:postId', async (req, res) => {
    const { postId } = req.params
    try {
        const post = await Posts.find({ _id: postId });
        if (post.length === 0) {
            return res.json({ "message": "그런 아이디는 없습니다" })
        } else {
            const result = {
                "postId": post[0]._id,
                "user": post[0].user,
                "title": post[0].title,
                "content": post[0].content,
                "createdAt": post[0].date

            }
            res.status(200).json({ "data": result });
        }
    } catch(err) {
        console.log(err);
        res.status(400).json({ messege: "아이디 문제있어요" });
    }
});



//게시글작성
router.post('/', async (req, res) => {
    const { user, password, title, content } = req.body;
        
    const date = new Date();
    date.setHours(date.getHours() + 9);

    const reg = / /;
    if (Boolean(user)===false || Boolean(password)===false || reg.test(password) || Boolean(title)===false || Boolean(content)===false) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    } else {
        const postCreate = await Posts.create({ user, password, title:title, content, date });
        return res.status(200).json({ message: "작성완료되었습니다" });
    }
});


//게시글 수정
router.put('/:postId', async (req, res) => {
    const { postId } = req.params
    const { password, title, content } = req.body

    if (Boolean(password) === false ||Boolean(title) === false || Boolean(content) === false) {
        return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    }
    try {
        const posts = await Posts.find({ _id: postId });
        if(!posts.length) return res.status(404).json({message:"postid가잘못되었습니다"});
        const postpass = posts.map(v => v.password);
        if (String(postpass[0]) === String(password)) {
            await Posts.updateOne({ _id: postId }, { $set: { content,title } });
            res.status(200).json({ message: "게시글 수정됬어요" });
        } else {
            res.status(400).json({ message: "비밀번호가 틀렸습니다" })
        }
    } catch {
        return res.status(404).json({ message: "postid형식이 잘못됬습니다" });
    }
});


//게시글 삭제
router.delete('/:postId', async (req, res) => {
    const { postId } = req.params
    const { password } = req.body

    if (!!password == false) {
        return res.status(400).json({ message: "비밀번호 형식이 올바르지 않습니다" });
    }
    try {
        const existPost = await Posts.find({ _id: postId });
       
        if (existPost.length && existPost[0].password === password) {
            await Posts.deleteOne({ _id: postId });
            res.status(200).json({ message: "삭제완료" });
        } else {
            res.status(400).json({ messaege: "비밀번호가 다릅니다" });
        }

    } catch {
        return res.status(404).json({ message: "postid형식이 잘못되었습니다" });
    }

});


module.exports = router;