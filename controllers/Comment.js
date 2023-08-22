import mysql from "mysql2";
import DataBase  from "./DataBase.js";
export class Comment{
    static addComment(req, res){
        console.log(req.body);
        const userId = 1;
        const comment = req.body.comment;
        const articleId = req.body.articleId;
        let connection = DataBase.connect();
        connection.execute("INSERT INTO `comments`(`comment`, `article_id`, `user_id`) " +
                    "VALUES (?,?,?)", [comment, articleId, userId], (err)=>{
            console.log(err);
            res.send("Комментарий добавлен");
        });
    }

    static showComments(req,  res){
        const articleId = req.params['articleId'];
        let connection = DataBase.connect();
        connection.execute("SELECT comment, name, comments.id FROM comments, users WHERE article_id = ? AND comments.user_id = users.id"
                        ,[articleId], (err, resultSet)=>{
                console.log(err);
                res.json(resultSet);
            })
    }

    static editComment(req, res){

    }

    static deleteComment(){

    }
}