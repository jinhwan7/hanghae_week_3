const express = require('express');

const router = express.Router();
const Posts = require('../schemas/post.js')
const Comments = require('../schemas/comment.js')
// {  
//     "user": "Developer",  
//     "password": "1234",  
//     "content": "안녕하세요 댓글입니다."
//     }
router.post('/:postId', async (req, res) => {
    const { postId } = req.params;
    console.log(postId)
    const { user, password, content } = req.body;
    const date = new Date();
    date.setHours(date.getHours() + 9);

    try {
        const post = await Posts.find({ _id: postId });
        await Comments.create({ postId: postId, user: user, password: password, content: content, date: date });
        res.status(200).json({ messege: "댓글을 생성하였습니다" })
    } catch {
        res.status(400).json({ "messege": "그런 게시글은 없습니다" })
    }

});


router.get('/:postId', async (req, res) => {
    const { postId } = req.params
    try {
        const comments = await Comments.find({ postId: postId });
        const result = [];
        comments.forEach(comment => {
            const reComment = {
                "commentId": comment._id,
                "user": comment.user,
                "content": comment.content,
                "createdAt": comment.date
            }
            result.push(reComment)
        });

        res.status(200).json({ "data": result });
    } catch {
        res.status(400).json({ messege: "postId가 이상합니다" })
    }

});

//댓글 수정
router.put('/:commentId', async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body;


    try {
        if(Boolean(content) === false){
            return res.status(400).json({messege:"댓글을 써주세요"})
        }
        await Comments.update({ _id: commentId }, { $set: { content: content } });
        res.status(200).json({ messege: "댓글이 수정되었습니다" });
    }catch(err){
        console.log(err)
        res.status(400).json({"messege":"그런 댓글아이디는 없습니다"});
    }
    
});


//댓글 삭제
router.delete('/:commentId', async (req, res) => {
    const {commentId} = req.params;
    const {password} = req.body;
    
    try{
        const existComment = await Comments.find({_id:commentId})
        if(existComment.length && Number(existComment[0].password) === password){
            await Comments.deleteOne({_id:commentId});   
            res.status(200).json({message:"삭제완료"});
        }else{
            res.status(400).json({messaege:"비밀번호가 다릅니다"});
        }

    }catch(err){
        console.log(err);
        res.status(400).json({message:"그런 댓글아이디 없어요"});
    }
});

module.exports = router;