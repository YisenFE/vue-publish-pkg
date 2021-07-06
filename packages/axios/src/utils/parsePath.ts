/**
 * @file 解析网页url
 */

const encodeReserveRE = /[!'()*]/g;
const encodeReserveReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16);
const commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
const encode = (str: string) =>
    encodeURIComponent(str)
        .replace(encodeReserveRE, encodeReserveReplacer)
        .replace(commaRE, ',');

const decode = decodeURIComponent;

export function getFullPath() {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    let href = window.location.href;
    const index = href.indexOf('#');
    // empty path
    if (index < 0) {
        return '';
    }

    href = href.slice(index + 1);
    // decode the hash but not the search or hash
    // as search(query) is already decoded
    // https://github.com/vuejs/vue-router/issues/2708
    const searchIndex = href.indexOf('?');
    if (searchIndex < 0) {
        const hashIndex = href.indexOf('#');
        if (hashIndex > -1) {
            href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
        }
        else {
            href = decodeURI(href);
        }
    }
    else {
        if (searchIndex > -1) {
            href
                = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
        }
    }

    return href;
}

/**
 * 解析url
 */
export function parsePath(path?: string) {
    path = path || getFullPath();
    let hash = '';
    let query = '';

    const hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
        hash = path.slice(hashIndex);
        path = path.slice(0, hashIndex);
    }

    const queryIndex = path.indexOf('?');
    if (queryIndex >= 0) {
        query = path.slice(queryIndex + 1);
        path = path.slice(0, queryIndex);
    }

    return {
        path,
        query,
        hash,
    };
}

/**
 * 解析query
 * @param {string} query query
 */
export function parseQuery(query: string) {
    const res: Record<string, any> = {};

    query = query.trim().replace(/^(\?|#|&)/, '');

    if (!query) {
        return res;
    }

    query.split('&').forEach(param => {
        const parts = param.replace(/\+/g, ' ').split('=');
        const key = decode(parts.shift() || '');
        const val = parts.length > 0 ? decode(parts.join('=')) : null;

        if (res[key] === undefined) {
            res[key] = val;
        }
        else if (Array.isArray(res[key])) {
            res[key].push(val);
        }
        else {
            res[key] = [res[key], val];
        }
    });

    return res;
}

/**
 * 解析query对象
 * @param {Object} obj query对象
 */
export function stringifyQuery(obj: Record<string, any>) {
    const res = obj
        ? Object.keys(obj)
            .map(key => {
                const val = obj[key];

                if (val === undefined) {
                    return '';
                }

                if (val === null) {
                    return encode(key);
                }

                if (Array.isArray(val)) {
                    const result: string[] = [];
                    val.forEach(val2 => {
                        if (val2 === undefined) {
                            return;
                        }
                        if (val2 === null) {
                            result.push(encode(key));
                        }
                        else {
                            result.push(encode(key) + '=' + encode(val2));
                        }
                    });
                    return result.join('&');
                }

                return encode(key) + '=' + encode(val);
            })
            .filter(x => x.length > 0)
            .join('&')
        : null;
    return res ? `?${res}` : '';
}
