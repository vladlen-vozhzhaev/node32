import mysql from "mysql2";

class DataBase{
    static connect(){
        return mysql.createConnection(
            {
                host: "127.0.0.1",
                user: 'root',
                password: '',
                database: "blog32"
            }
        );
    }
}
export default DataBase