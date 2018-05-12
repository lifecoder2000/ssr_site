const crypto = require('crypto');

const CHECK_LIST = {
    app: [
        { property: 'name', reg: /^.{2,4}$/, message: '2~4이내의 이름을 입력해주세요!' },
        { property: 'email', reg: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '올바른 이메일주소를 입력해주세요!' },
        { property: 'class', reg: /G1|U1|U2|H1|H2/, message: '과/반 선택해주세요!' },
        { property: 'number', reg: /[0-9]{1,2}/, message: '번호 선택해주세요' },
        { property: 'position', reg: /[a-zA-Z\s]{8,20}/, message: '지원분야 선택해주세요' },
        { property: 'password', reg: /[a-zA-Z0-9]{8,30}/, message: '영문자,숫자로 이루어진 암호를 8자 이상 입력해주세요.' },
        { property: 'application', reg: /.+/m, message: '자기소개서 작성해주세요!' }
    ]
};

module.exports = {

    checkProperty: (data, service, strict) => {
        let result = {};
        for (const item of CHECK_LIST[service]) {
            if (data[item.property] && item.reg.exec(data[item.property])) {
                result[item.property] = data[item.property];
            } else {
                if (!strict && !data[item.property]) continue;
                return { message: item.message, data: null };
            }
        }
        return { message: 'SUCCESS', data: result };
    }

};