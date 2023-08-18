import mysql from "mysql2";

const connection = mysql.createConnection(
    {
        host: "vladle43.beget.tech",
        user: 'vladle43_32',
        password: 'HOVw43*h',
        database: "vladle43_32"
    }
);
export class User{
    static login(req, res){
        const email = req.body.email;
        const pass = req.body.pass;
        connection.execute("SELECT * FROM users WHERE email = ? AND pass = ?",
            [email, pass], (err, resultSet)=>{
                if(resultSet.length){
                    res.cookie("session_id", 111);
                    console.log("sessionID", req.sessionID);
                    connection.execute("UPDATE `users` SET `token`= ? WHERE email = ?",
                        [req.sessionID, email], (err, resultSet)=>{
                            res.json({result: "success"});
                        });
                }else{
                    res.json({result: "error"});
                }
            });
    }

    static reg(req, res){
        console.log(req.body);
        const name = req.body.name;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const pass = req.body.pass;
        connection.execute("SELECT id FROM users WHERE email = ?", [email], (err, resultSet)=>{
            if(resultSet.length){
                res.json({result:"exist"});
            }else{
                connection.execute("INSERT INTO users (name, lastname, email, pass) VALUE (?,?,?,?)",
                    [name, lastname, email, pass], ()=>{
                        res.json({result: "success"});
                    });
            }
        })

    }

    static showProfile(req, res){
        if(req.cookies.session_id){
            connection.execute("SELECT * FROM users WHERE id = ?", [1], (err, resultSet)=>{
                res.send(resultSet[0].name);
            })
        }else{
            res.send("error");
        }
    }

    static getCurrentUserData(req, res){
        let sessionID = req.sessionID;
        console.log("sessionID", sessionID);
        connection.execute("SELECT id, name, lastname, email FROM users WHERE token = ?",
            [sessionID], (err, resultSet)=>{
                if(resultSet.length){
                    res.json(resultSet[0]);
                }else{
                    res.send("Пользователь не авторизован")
                }
            })
    }

    static logout(req, res){
        let sessionID = req.sessionID;
        connection.execute("UPDATE `users` SET `token`= '' WHERE token = ?",
            [sessionID], (err, resultSet)=>{
                res.redirect('/');
            });
    }
}