import mysql from "mysql2";
import HTMLParser from 'node-html-parser';
import fs from 'fs';
const connection = mysql.createConnection(
    {
        host: "vladle43.beget.tech",
        user: 'vladle43_32',
        password: 'HOVw43*h',
        database: "vladle43_32"
    }
);
export class Blog{
    static addArticle(req, res){
        const title = req.body.title;
        const content = req.body.content;  // HTML код из SunEditor
        const author = req.body.author;
        const document = HTMLParser.parse(content); // Парсим HTML код, создаём объект document как в браузере
        const images = document.querySelectorAll('img');
        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            let src = img.getAttribute('src');
            let base64 = src.split(',')[1];
            let extension = src.split(',')[0].split('/')[1].split(';')[0];
            let filename = Math.random()+Date.now()+'.'+extension;
            fs.writeFile('public/userfiles/'+filename, base64, 'base64', (err)=>{
                console.log(err);
            });
            img.setAttribute("src", "/userfiles/"+filename);
        }

        connection.execute("INSERT INTO `articles`(`title`, `content`, `author`) VALUES (?, ?, ?)",
            [title, document.toString(), author], (err)=>{
                res.send('Статья добавлена');
            });
    }
    static getArticles(req, res){
        connection.execute("SELECT * FROM articles", (err, resultSet)=>{
            console.log(resultSet);
            res.render('articles', {resultSet: resultSet});
        })
    }
    static getArticleById(req, res){
        const articleId = req.params['articleId'];
        console.log(articleId);
        connection.execute(" SELECT articles.id, title, content, comment, author, name, comments.id as comment_id FROM articles, comments, users WHERE articles.id=? AND comments.article_id = articles.id AND users.id = comments.user_id;",
            [articleId], (err, resultSet)=>{
                res.render('article', {article: resultSet[0], comments: resultSet, name: ""});
            })
    }
    static showEditArticle(req, res){
        const articleId = req.params['articleId'];
        connection.execute("SELECT * FROM articles WHERE id = ?",
            [articleId], (err, resultSet)=>{
                res.render('editArticle', {article: resultSet[0]});
            })
    }
    static editArticle(req, res){
        const articleId = req.params['articleId'];
        const title = req.body.title;
        const content = req.body.content;
        const author = req.body.author;
        let temp = [title, content, author, articleId];
        console.log(temp);
        connection.execute("UPDATE articles SET title=?, content=?, author=? WHERE id = ?",
            [title, content, author, articleId], (err => {
                res.send("ok");
            }));
    }
    static deleteArticle(req, res){
        const articleId = req.params['articleId'];
        connection.execute("DELETE FROM `articles` WHERE id = ?", [articleId], (err)=>{
            res.send("ok");
        });
    }
}