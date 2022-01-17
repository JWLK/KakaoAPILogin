const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email', // req.body.email
                passwordField: 'password', // req.body.password 
                /*
                session: true, // 세션에 저장 여부
                passReqToCallback: false, 
                    express의 req 객체에 접근 가능 여부. true일 때, 뒤의 callback 함수에서 req 인자가 더 붙음. 
                    async (req, email, password, done) => { } 가 됨
                */
            },
            async (email, password, done) => {
                try {
                    const sqlQuery_UserCheck = 'SELECT * FROM user_list WHERE email = ?'
                    const exUser = await pool.query(sqlQuery_UserCheck, email)

                } catch(error) {
                    console.error(error)
                    done(error)
                }
            }
        )
    )

}