const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const Application = require('../database/Application');
const ADMIN_ACCOUNT = require('../config/ADMIN_ACCOUNT');

router.get('/auth', (req, res) => {
    res.redirect('/adminAuth.html');
});

router.post('/auth', (req, res) => {
    if (req.body.username === ADMIN_ACCOUNT.username && req.body.password === ADMIN_ACCOUNT.password) {
        req.session.isLogin = true;
        return res.redirect('/admin');
    } else {
        req.session.destroy();
        return res.send("<script>alert('Invalid username or password!');location.href='/admin/auth'</script>");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    return res.send("<script>alert('로그아웃되었습니다.');location.href='/'</script>");
});

router.get('/', async (req, res) => {
    try {
        if (req.session.isLogin === true) {
            return res.render('admin', {
                applications: await Application.find({}).sort({ updatedAt: 1 }),
                count: {
                    bySubmitted: await getCountBySubmitted(),
                    submittedByClass: await getSubmittedCountByClass(),
                    savedByClass: await getSavedCountByClass()
                },
                isBlocked: require('../config/status').isBlocked
            });
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.session.isLogin === true) {
            let query = {};
            if (req.body.submissionStatus === 'submit') query = Object.assign(query, { isSubmitted: true });
            if (req.body.class !== 'None') query = Object.assign(query, { class: req.body.class });
            if (req.body.position !== 'None') query = Object.assign(query, { position: req.body.position });

            return res.render('admin', {
                applications: await Application.find(query).sort({ updatedAt: 1 }),
                count: {
                    bySubmitted: await getCountBySubmitted(),
                    submittedByClass: await getSubmittedCountByClass(),
                    savedByClass: await getSavedCountByClass()
                },
                isBlocked: require('../config/status').isBlocked
            });
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
});

router.get('/application/:email', async (req, res) => {
    try {
        if (req.session.isLogin === true) {
            const application = await Application.findOne({ email: req.params.email });
            return res.render('application', { application: application });
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
});

router.get('/block', (req, res) => {
    try {
        if (req.session.isLogin === true) {
            const status = require('../config/status');
            status.isBlocked = !status.isBlocked;
            jsonfile.writeFile(__dirname + '/../config/status.json', status, { spaces: 2 }, err => {
                if (err) {
                    return res.send("<script>alert('알 수 없는 에러 발생');location.href='/admin'</script>");
                } else {
                    if (status.isBlocked) {
                        return res.send("<script>alert('모집 중단되었습니다.');location.href='/admin'</script>");
                    } else {
                        return res.send("<script>alert('모집 재개되었습니다.');location.href='/admin'</script>");
                    }
                }
            });
        } else {
            return res.send("<script>alert('Access Denied!');location.href='/'</script>");
        }
    } catch (err) {
        return res.send("<script>alert('알 수 없는 오류');location.href='/'</script>");
    }
});

async function getCountBySubmitted() {
    return {
        saved: await Application.find({ isSubmitted: false}).count(),
        submitted: await Application.find({ isSubmitted: true }).count(),
    };
}

async function getSavedCountByClass() {
    return {
        G1: await Application.find({ class: 'G1', isSubmitted: false }).count(),
        U1: await Application.find({ class: 'U1', isSubmitted: false }).count(),
        U2: await Application.find({ class: 'U2', isSubmitted: false }).count(),
        H1: await Application.find({ class: 'H1', isSubmitted: false }).count(),
        H2: await Application.find({ class: 'H2', isSubmitted: false }).count()
    };
}

async function getSubmittedCountByClass() {
    return {
        G1: await Application.find({ class: 'G1', isSubmitted: true }).count(),
        U1: await Application.find({ class: 'U1', isSubmitted: true }).count(),
        U2: await Application.find({ class: 'U2', isSubmitted: true }).count(),
        H1: await Application.find({ class: 'H1', isSubmitted: true }).count(),
        H2: await Application.find({ class: 'H2', isSubmitted: true }).count()
    };
}

module.exports = router;
