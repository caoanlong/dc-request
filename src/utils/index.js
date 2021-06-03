import { KJUR, hextob64 } from 'jsrsasign'

export const sizeof = function(str, charset){
    let total = 0,
        charCode,
        i,
        len;
    charset = charset ? charset.toLowerCase() : '';
    if(charset === 'utf-16' || charset === 'utf16'){
        for(i = 0, len = str.length; i < len; i++){
            charCode = str.charCodeAt(i);
            if(charCode <= 0xffff){
                total += 2;
            }else{
                total += 4;
            }
        }
    }else{
        for(i = 0, len = str.length; i < len; i++){
            charCode = str.charCodeAt(i);
            if(charCode <= 0x007f) {
                total += 1;
            }else if(charCode <= 0x07ff){
                total += 2;
            }else if(charCode <= 0xffff){
                total += 3;
            }else{
                total += 4;
            }
        }
    }
    return total;
}

export function sign(privateKey, json){
    var sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    sig.init(privateKey);
    var sortdata = oprint(json, true);
    sig.updateString(sortdata);
    var hSigVal = sig.sign();
    return hextob64(hSigVal);
}
function parseobj(v, ini) {
    var vv;
    var ir = [];
    for (var j in v) {
        if (j === "sign") continue;
        if (typeof v[j] === 'object') {
            if (ini) {
                ir.push(j + "=" + oprint(v[j], false));
            } else {
                ir.push(j + ":" + oprint(v[j], false));
            }
        } else {
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
    return vv;
}