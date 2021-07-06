const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = Number(document.documentMode);

const camelCase = function (name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

export function hasClass(el, cls) {
    if (!el || !cls) {
        return false;
    }
    if (cls.indexOf(' ') !== -1) {
        throw new Error('className should not contain space.');
    }
    if (el.classList) {
        return el.classList.contains(cls);
    }
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;

};

export const getStyle = ieVersion < 9 ? function (element, styleName) {
    if (!element || !styleName) {
        return null;
    }
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'styleFloat';
    }
    try {
        switch (styleName) {
            case 'opacity':
                try {
                    return element.filters.item('alpha').opacity / 100;
                }
                catch (e) {
                    return 1.0;
                }
            default:
                return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
        }
    }
    catch (e) {
        return element.style[styleName];
    }
} : function (element, styleName) {
    if (!element || !styleName) {
        return null;
    }
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        let computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    }
    catch (e) {
        return element.style[styleName];
    }
};

export function setStyle(element, styleName, value) {
    if (!element || !styleName) {
        return;
    }

    if (typeof styleName === 'object') {
        for (let prop in styleName) {
            if (styleName.hasOwnProperty(prop)) {
                setStyle(element, prop, styleName[prop]);
            }
        }
    }
    else {
        styleName = camelCase(styleName);
        if (styleName === 'opacity' && ieVersion < 9) {
            element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
        }
        else {
            element.style[styleName] = value;
        }
    }
};
