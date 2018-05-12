const crypto = require('crypto');
/**
 * exec({ password }) -> { encryptedPassword, createdSalt } // 새로 생성 시
 *
 * ex) exec({ password: ‘asdf1234’ }) -> { password: ‘5oAEewKsMWlQ…’, salt: ‘5oAEewKsMWlQ…’ }
 *
 * exec({ password, salt }) -> { encryptedPassword, salt } // 로그인 시
 *
 * ex) exec({ password: ‘asdf1234’, salt: ‘5oAEewKsMWlQ…’ }) -> { password: ‘5oAEewKsMWlQ…’, salt: ‘5oAEewKsMWlQ…’ }
 */

module.exports = (ps) => {
    if (!ps.salt) ps.salt = crypto.createHash("sha256").update(new Date().getTime().toString()).digest('base64');
    ps.password = crypto.createHash("sha256").update(ps.password + ps.salt).digest('base64');
    return ps;
}