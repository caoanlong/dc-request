const { KJUR, KEYUTIL, hextob64 } = require('jsrsasign')

const fs = require('fs')
const path = require('path')
function sign(privateKey, json){
    var sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    sig.init(privateKey);
    var sortdata = oprint(json, true);
    sig.updateString(sortdata);
    var hSigVal = sig.sign();
    return hextob64(hSigVal);
}
function parseobj(v, ini) {
    // console.log(v, "not array");
    var vv;
    var ir = [];
    for (var j in v) {
        if (j == "sign") continue;
        if (typeof v[j] === 'object') {
        //   console.log(v, j, "is object");
            if (ini) {
                ir.push(j + "=" + oprint(v[j], false));
            } else {
                ir.push(j + ":" + oprint(v[j], false));
            }
        } else {
        //   console.log(v, j, "not object");
            if (ini) {
                ir.push(j + "=" + v[j]);
            } else {
                ir.push(j + ":" + v[j]);
            }
        }
    }
    ir.sort();
    if (ini) {
        vv = ir.join("&");
    } else {
        vv = "map[" + ir.join(" ") + "]";
    }
    return vv;
}
function parsearr(v) {
    var ir = [];
    for (var i in v) {
        if (typeof v[i] === 'object') {
            ir.push(oprint(v[i], false));
        } else if (v[i] instanceof Array) {
            ir.push(parsearr(v[i]));
        } else {
            ir.push(v[i]);
        }
    }
    var vv = "[" + ir.join(" ") + "]";
    return vv;
}
function oprint(v, ini) {
    var vv;
    if (typeof v === 'object') {
        if (v instanceof Array) {
            vv = parsearr(v);
        } else {
            vv = parseobj(v, ini)
        }
    } else {
        vv = v
    }
    // console.log(vv);
    return vv;
}

const reqData = {
    appid: "BITOLLWALLETDEMO",
    client_type: "11",
    data: {
        device_id: "4bc9dbe590d0e672b63039180d9ab128",
        email: "barronong@gmail.com",
        password: "a12345678"
    },
    retrieve: "login_by_email_password",
    seq: "1618420577-login_by_email_password",
    sign: "login_by_email_password",
    sign_type: "SHA256WithRSAClient"
}
// console.log(reqData)
const signatureString = 'appid=dcbox&data=map[captcha_id: client_type:11 device_id:3c81debdef50c21e email:barronong@gmail.com nonce: password:a12e45678 phone: phone_code: sms_code:]&retrieve=login_by_email_password&seq=1618556699-login_by_email_password&sign_type=SHA256WithRSAClient'
// const privateKey = fs.readFileSync(path.resolve(__dirname, '../rsa/private.pem'), { encoding: 'utf-8'} )
const rsaKeypair = KEYUTIL.generateKeypair('RSA', 2028)
const privateKey = KEYUTIL.getPEM(rsaKeypair.prvKeyObj, "PKCS1PRV")
const publicKey = KEYUTIL.getPEM(rsaKeypair.pubKeyObj)
console.log(privateKey)
console.log(publicKey)

const s = sign(privateKey, signatureString)
console.log(s)