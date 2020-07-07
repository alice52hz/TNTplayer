/**
 * Custom event system.
 */
let cid = 0

export default class EventEmitter {
    constructor() {
        this.eid = cid++
        this.events = {}
    }

    on(eventName, fn) {
        (this.events[eventName] || (this.events[eventName] = [])).push(fn)
    }

    once(eventName, fn) {
        const eventHandler = () => {
            fn()
            this.removeListener(eventName, eventHandler)
        }
        this.on(eventName, eventHandler)
    }

    removeListener(eventName, fn) {
        const events = this.events[eventName]
        if(!Array.isArray(events) || events.length == 0) {
            return
        }
        this.events[eventName].forEach((exisitFn, index) => {
            if(exisitFn == fn) {
                this.events[eventName].splice(index, 1)
            }
        })
    }

    clear(eventName) {
        this.events[eventName] = []
    }

    emit(eventName, ...args) {
        const events = this.events[eventName]
        if(!Array.isArray(events) || events.length == 0) {
            return
        }
        
        events.forEach(eventFn => {
            const context = eventFn.context || null
            eventFn.call(context, ...args)
        })
    }
}