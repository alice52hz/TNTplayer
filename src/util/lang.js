/**
 * Tools function of language
 */
export function isDef(val) {
    return val !== undefined
}

export function isUndef(val) {
    return val === undefined
}

export function isFunction(val) {
    return typeof val === 'function'
}

export function isNumber(val) {
    return typeof val === 'number'
}

export function noop() {}