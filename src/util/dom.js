/**
 * DOM operation methods.
 */
export function attrs(el, attrs) {
    for(const key in attrs) {
        el.setAttribute(key, attrs[key])
    }
}

export function creEleByCls(className) {
    let tmp = document.createElement('div')
    tmp.className = className
    return tmp
}

export function getOffsetDis(el) {
    let left = el.offsetLeft
    let top = el.offsetTop
    let tmp = el.offsetParent
    while(tmp !== null) {
        left += tmp.offsetLeft
        top += tmp.offsetTop
        tmp = tmp.offsetParent
    }
    return {left, top}
}

export function requestFullScreen(element) {
    const requestMethod = element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen
    if (requestMethod) {
        requestMethod.call(element)
    }
}

export function exitfullscreen() { 
    if(document.exitFullscreen) {
        document.exitFullscreen()
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if(document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
    } else if(document.msExitFullscreen) {
        document.msExitFullscreen()
    }
}

class VQuery {
    constructor(selector, context = document) {
        if(selector.nodeType === 1) {
            this.el = selector
        } else if(selector === document) {
            this.el = document
        } else {
            this.el = context.querySelector(selector)
        }
    }

    on(eventName, callback) {
        this.el.addEventListener(eventName, callback)
    }

    unbind(eventName, callback) {
        this.el.removeEventListener(eventName, callback)
    }

    once(eventName, callback) {
        const fn = e => {
            callback(e)
            this.unbind(eventName, fn)
        }
        this.on(eventName, fn)
    }

    style(k, v) {
        this.el.style[k] = v
        return this
    }

    offsetLeft() {
        return getOffsetDis(this.el).left
    }

    offsetTop() {
        return getOffsetDis(this.el).top
    }

    width(v) {
        if(v !== undefined) {
            this.el.style.width = typeof v === 'number' ? `${v}px` : v
            return this
        } else {
            return this.el.offsetWidth
        }
    }

    height(v) {
        if(v !== undefined) {
            this.el.style.height = typeof v === 'number' ? `${v}px` : v
            return this
        } else {
            return this.el.offsetHeight
        }
    }

    left(v) {
        if(v !== undefined) {
            this.el.style.left = typeof v === 'number' ? `${v}px` : v
            return this
        } else {
            return this.el.style.left
        }
    }

    right(v) {
        if(v !== undefined) {
            this.el.style.right = typeof v === 'number' ? `${v}px` : v
            return this
        } else {
            return this.el.style.right
        }
    }

    translateX(v) {
        if(v !== undefined) {
            this.el.style.transform = `translateX(${v}px)`
        }
    }

    text(val) {
        this.el.innerText = val
    }

    show() {
        this.el.style.display = 'block'
        return this
    }
    
    flex() {
        this.el.style.display = 'flex'
        return this
    }

    hide() {
        this.el.style.display = 'none'
        return this
    }
}

function $(selector, context = document) {
    return new VQuery(selector, context)
}

export default $