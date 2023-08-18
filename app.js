import express from 'express';
import multer from 'multer';
import mysql from 'mysql2';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import {User} from './controllers/User.js';
import {Blog} from "./controllers/Blog.js";
import {Comment} from "./controllers/Comment.js";
import path from 'path';
const __dirname = path.resolve();
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser("q"));
app.use((req, res, next)=>{
    console.log(req.cookies.session_id);
    next();
});
app.use(
    session({
        secret: 'you secret key',
        saveUninitialized: true,
    })
);
app.get('/', Blog.getArticles);
app.get('/reg', (req, res)=>{
   res.render('reg');
});
app.get('/login', (req, res)=>{
    res.render('login');
})
app.get('/profile', User.showProfile);
app.post('/login', multer().fields([]), User.login);
app.post('/reg', multer().fields([]), User.reg);
app.get('/getCurrentUserData', User.getCurrentUserData);
app.get('/logout', User.logout);
app.get('/addArticle', (req, res)=>{
    res.render('addArticle');
});
app.get('/article/:articleId', Blog.getArticleById);
app.post('/addArticle', multer().fields([]), Blog.addArticle);
app.get('/editArticle/:articleId', Blog.showEditArticle);
app.post('/editArticle/:articleId', multer().fields([]), Blog.editArticle);
app.get('/deleteArticle/:articleId', Blog.deleteArticle);
app.post('/addComment', multer().fields([]), Comment.addComment);
app.get('/getComments/:articleId', Comment.showComments);

app.listen(3000);