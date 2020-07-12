let os = function() {
    var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone, 
    isAndroid = /(?:Android)/.test(ua), 
    isFireFox = /(?:Firefox)/.test(ua), 
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid : isAndroid,
        isPc : isPc
    }
}()

export function isPc() {
    return os.isPc
}

export function extend(to, from) {
    for(const key in from) {
        to[key] = from[key]
    }
}

export function nextTick(fn) {
    Promise.resolve().then(fn)
}

export function fmtSec(seconds) {
    let min = Math.floor(seconds % 3600)
    let h = Math.floor(seconds / 3600)
    let m = Math.floor(min / 60)
    let s = seconds % 60
    return `${addZ(m)}:${addZ(s)}`
}

export function addZ(n) {
    return n < 10 ? `0${n}` : `${n}`
}

export function formatSeconds(seconds, format = 'HH:mm:ss') {
    if(isNaN(seconds)) return '00:00'
    let min = Math.floor(seconds % 3600)
    let h = Math.floor(seconds / 3600)
    let m = Math.floor(min / 60)
    let s = seconds % 60

    return format
        .replace('HH', addZ(h))
        .replace('mm', addZ(m))
        .replace('ss', addZ(Math.floor(s)))
}