export default function serialize(a) {
    const s = [];
    const add = function (k, v) {
        v = typeof v === 'function' ? v() : v;
        v = v === null ? '' : v === undefined ? '' : v;
        s[s.length] = `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    };
    const buildParams = function (prefix, obj) {
        let i;
        let len;
        let key;

        if (prefix) {
            if (Array.isArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    buildParams(
                        `${prefix}[${typeof obj[i] === 'object' && obj[i] ? i : ''}]`,
                        obj[i]
                    );
                }
            } else if (String(obj) === '[object Object]') {
                for (key in obj) {
                    buildParams(`${prefix}[${key}]`, obj[key]);
                }
            } else {
                add(prefix, obj);
            }
        } else if (Array.isArray(obj)) {
            for (i = 0, len = obj.length; i < len; i++) {
                add(obj[i].name, obj[i].value);
            }
        } else {
            for (key in obj) {
                buildParams(key, obj[key]);
            }
        }
        return s;
    };

    return decodeURIComponent(buildParams('', a).join('&'));
}

