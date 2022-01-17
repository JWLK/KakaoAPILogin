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
                    const sqlGetUser = 'SELECT password FROM user_list WHERE email = ?'
                    const rows = await pool.query(sqlGetUser, email)
                    // res.status(200).json({"code": "200", "desc": "Login Succeed", "result" : rows})
                    if(rows[0]) {
                        const isValid = await bcrypt.compare(password, rows[0].password)
                        if(isValid) {
                            done(null, rows[0]);
                        } else {
                            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                        }
                    } else {
                        done(null, false, { message: '가입되지 않은 회원입니다.' });
                     }

                } catch(error) {
                    console.error(error)
                    done(error)
                }
            }
        )
    )

}