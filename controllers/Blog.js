import DataBase from './DataBase.js';
import HTMLParser from 'node-html-parser';
import fs from 'fs';
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
        let connection = DataBase.connect();
        connection.execute("INSERT INTO `articles`(`title`, `content`, `author`) VALUES (?, ?, ?)",
            [title, document.toString(), author], (err)=>{
                res.send('Статья добавлена');
            });
    }
    static getArticles(req, res){
        let connection = DataBase.connect();
        connection.execute("SELECT * FROM articles", (err, resultSet)=>{
            console.log(resultSet);
            res.render('articles', {resultSet: resultSet || []});
        })
    }
    static getArticleById(req, res){
        const articleId = req.params['articleId'];
        console.log(articleId);
        let connection = DataBase.connect();
        connection.execute("SELECT * FROM articles WHERE articles.id=?",
            [articleId], (err, resultSet)=>{
                res.render('article', {article: resultSet[0], comments: [], name: ""});
            })
    }
    static showEditArticle(req, res){
        const articleId = req.params['articleId'];
        let connection = DataBase.connect();
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
        let connection = DataBase.connect();
        connection.execute("UPDATE articles SET title=?, content=?, author=? WHERE id = ?",
            [title, content, author, articleId], (err => {
                res.send("ok");
            }));
    }
    static deleteArticle(req, res){
        const articleId = req.params['articleId'];
        let connection = DataBase.connect();
        connection.execute("DELETE FROM `articles` WHERE id = ?", [articleId], (err)=>{
            res.send("ok");
        });
    }
}