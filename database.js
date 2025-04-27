const fs = require("fs")
const crypto = require("crypto")
const dbFile = "./chat.db";
const exists = fs.existsSync(dbFile)
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;
dbWrapper
    .open({
        filename: dbFile,
        driver: sqlite3.Database
    })
    .then(async dBase => {
        db = dBase
        try{
            if(!exists){
                await db.run(
                    `CREATE TABLE user(
                        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        login TEXT,
                        password TEXT
                    );`
                );
                await db.run(`INSERT INTO user(login,password) VALUES(VD, 123456)`);
                await db.run(`CREATE message(
                    msg_id INTERGER AUTOINCREMENT,
                    content TEXT,
                    author PRIMARY KEY (user_id), FOREING KEY(author) 
                    );`
                );
            } else {
                console.log(await db.all("SELECT * from user"))
            }
        } catch(dbError){
            console.error(dbError);
        }
    })
module.exports = {
    getMessages: async () => {
        try{
            return await db.all(
                `SELECT msg_id, content, login, user_id from message
                JOIN user ON message.author = user.user_id`
            );
        } catch(dbError){
            console.error(dbError);
        }
    },
    addMessage: async (msg, userId) => {
        await db.run(
            `INSERT INTO message (content, author) VALUES (?, ?)`,
            [msg, userId]
        )
    },
    isUserExists: async(login) => {
        const canditate = await db.all(`SELECT * FROM user WHERE login = ?`, [login]);
        return !!canditate.length;
    },
    getAuthToken: async (user) => {
        const canditate = await db.all(`SELECT * FROM user WHERE login = ?`, [user.login]);
        if(!canditate.length){
            throw 'Wrong login';
        }
        if(canditate[0].password !== user.password){
            throw 'Wrong password';
        }
        user.id + '.' + login + '.' + crypto.randomBytes(20).toString('hex');
    }
};