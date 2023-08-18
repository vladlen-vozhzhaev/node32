import mysql from "mysql2";

const connection = mysql.createConnection(
    {
        host: "vladle43.beget.tech",
        user: 'vladle43_32',
        password: 'HOVw43*h',
        database: "vladle43_32"
    }
);
export class Comment{
    static addComment(req, res){
        console.log(req.body);
        const userId = 1;
        const comment = req.body.comment;
        const articleId = req.body.articleId;
        connection.execute("INSERT INTO `comments`(`comment`, `article_id`, `user_id`) " +
                    "VALUES (?,?,?)", [comment, articleId, userId], (err)=>{
            console.log(err);
            res.send("Комментарий добавлен");
        });
    }

    static showComments(req,  res){
        const articleId = req.params['articleId'];
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