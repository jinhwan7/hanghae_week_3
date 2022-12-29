const express = require('express');

const router = express.Router();
const Posts = require('../schemas/post.js')
const Comments = require('../schemas/comment.js')

router.post('/:postId', async (req, res) => {
    const { postId } = req.params;

    const { user, password, content } = req.body;
    const date = new Date();
    date.setHours(date.getHours() + 9);

    try {
        const post = await Posts.find({ _id: postId });
        if (post.length) {
            await Comments.create({ postId: postId, user: user, password: password, content: content, date: date });
            res.status(200).json({ messege: "댓글을 생성하였습니다" })
        } else {
            res.status(404).json({ messege: "게시글아이디가 잘못되었습니다" })
        };

    } catch (err) {
        console.log(err);
        res.status(400).json({ "messege": "입력 형식이 잘못되었습니다" });
    }

});

//댓글조회
router.get('/:postId', async (req, res) => {
    const { postId } = req.params

    const comments = await Comments.find({ postId: postId });//이게 에러를 안내는이유는 postId가 오브잭트 아이디인_id가 아니기때문이다
    if (comments.length) {
        const result = comments.map(comment => {
            return {
                "commentId": comment._id,
                "user": comment.user,
                "content": comment.content,
                "createdAt": comment.date
            }
        }).reverse();

        res.status(200).json({ "data": result });
    } else {
        res.status(400).json({ messege: "postId가 없습니다" })
    }




});

//댓글 수정
router.put('/:commentId', async (req, res) => {
    const { commentId } = req.params //길이가 24가 아니면 예외처리 
    const { password, content } = req.body;
    const reg = /\s/;
    //패스워드가 형식에 맞고 내용이 들어있으면
    if (reg.test(password)) { return res.status(400).json({ message: "패스워드형식이 잘못되었습니다" }) }
    if (Boolean(content) === false) { return res.status(400).json({ messege: "댓글을 써주세요" }) }


    try {
        const comment = await Comments.find({ _id: commentId });
        if (comment.length) {
            if (String(password) !== String(comment[0].password)) {
                return res.status(400).json({ messege: "비밀번호가 잘못되었습니다" });
            }

            await Comments.updateOne({ _id: commentId }, { $set: { content: content } });
            res.status(200).json({ messege: "댓글이 수정되었습니다" });
        } else {
            res.status(404).json({ message: "그런 아이디는 없습니다" });
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ "messege": "아이디형식이 잘못되었습니다" });
    }

});


//댓글 삭제
router.delete('/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;

    try {
        const existComment = await Comments.find({ _id: commentId })
        if (existComment.length) {
            if (String(existComment[0].password) === String(password)) {
                await Comments.deleteOne({ _id: commentId });
                res.status(200).json({ message: "삭제완료" });
            }else{
                res.status(400).json({ messaege: "비밀번호가 다릅니다" });    
            }
        }
        else {
            res.status(400).json({ messaege: "아이디가 없습니다" });    
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "아이디형식이 잘못됬어요" });
    }
});

module.exports = router;