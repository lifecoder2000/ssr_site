const express = require('express');
const router = express.Router();
const password = require('../tools/password');
const validator = require('../tools/validator');
const Application = require('../database/Application');
const ip = require('request-ip');

const send = (res, message) => {
    return res.send(`<script>alert('${message}');history.back()</script>`);
}

router.get('/', (req, res) => {
    res.render('write', { name: '', email: '', classNum: '반', number: '번호', position: '지원분야', password: '', application: '', isBlocked: require('../config/status').isBlocked });
});

router.post('/', async (req, res) => {
    try {
        if (require('../config/status').isBlocked) {
            return send(res, '신청 기간이 만료되었습니다. 감사합니다.');
        }
        let application = await Application.findOne({ email: req.body.email }).exec();
        const result = validator.checkProperty(req.body, 'app', true);
        if (result.message !== 'SUCCESS') {
            return send(res, result.message);
        }
        if (application && application.password !== password({ password: req.body.password, salt: application.salt }).password) {
            return send(res, '이미 존재하는 이메일이거나 올바르지 않은 암호입니다.');
        }
        if (application && application.isSubmitted) {
            return send(res, '이미 지원서를 제출하셨습니다!');
        }
        const form = Object.assign(result.data, password({ password: result.data.password }));
        if (req.body.button === '제출하기') {
            form.isSubmitted = true;
        }
        form.clientIp = ip.getClientIp(req);
        if (application) {
            await Application.updateOne({ _id: application._id }, form);
        } else {
            await Application.create(form);
        }
        if (form.isSubmitted) {
            return res.send(`<script>alert('지원해주셔서 감사합니다!');location.href='/';</script>`);
        }
        if (application) {
            return res.send(`<script>alert('수정되었습니다!');location.href='/';</script>`);
        } else {
            return res.send(`<script>alert('저장되었습니다!');location.href='/';</script>`);
        }
    } catch (err) {
        console.error(err.stack);
        return send(res, '알 수 없는 오류가 발생하였습니다.');
    }
});

router.post('/load', async (req, res) => {
    try {
        if (!req.body || !req.body.email || !req.body.password) {
            return send(res, '이메일과 암호를 입력해주세요!');
        }
        const application = await Application.findOne({ email: req.body.email }).exec();
        if (!application || application.password !== password({ password: req.body.password, salt: application.salt }).password) {
            return send(res, '이메일 혹은 암호가 일치하지 않습니다.');
        }
        if (application.isSubmitted) {
            return send(res, '이미 지원서를 제출하셨습니다!');
        }
        application.classNum = application.class;
        application.password = '';
        application.isBlocked = require('../config/status').isBlocked;
        return res.render('write', application);
    } catch (err) {
        console.error(err.stack);
        return send(res, '알 수 없는 오류가 발생하였습니다.');
    }
});

module.exports = router;