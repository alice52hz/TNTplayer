/**
 * Public player methods
 */
import { USER_EVENT_LIST } from './event'
import { requestFullScreen, exitfullscreen } from '@/util/dom'

export default function(Player) {
    Object.assign(Player.prototype, {
        /**
         * Rewrite `on` and `once` method of Emitter
         * So that we can listen user events on different element via options
         * Such as video and video wrapper, box element. default to video
         */
        on(eventName, fn, options = {}) {
            fn.context = options.isPlugin
                ? options.plugin
                : this
            let evtName = this._getEvtName(eventName, options)
            {(this.events[evtName] || (this.events[evtName] = [])).push(fn)}
        },

        /**
         * Bind event that can touch on once.
         */
        once(eventName, fn, options = {}) {
            let evtName = this._getEvtName(eventName, options)
            const eventHandler = () => {
                fn()
                this.removeListener(evtName, eventHandler)
            }
            this.on(evtName, eventHandler)
        },

        _getEvtName(eventName, options) {
            let evtName = null
            //  If event name belong to user events
            if(USER_EVENT_LIST.includes(eventName)) {
                let target = options.target || 'video'
                evtName = `${eventName}_${target}`
            } else {
                evtName = eventName
            }
            return evtName
        },

        isFullscreen() {
            return document.fullscreenElement ||
                document.msFullscreenElement  ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement || false
        },

        setFullScreen() {
            requestFullScreen(this.box)
        },

        exitFullscren() {
            exitfullscreen()
        },

        set(k, v) {
            this._set(k, v)            
        },

        play() {
            this.video.play().catch(err => { throw err })
        },

        pause() {
            this.video.pause()
        },

        load(src, play = true) {
            this._loadSrc(src).then(video => {
                if(play) video.play()
            })
        },

        seekTo(time) {
            this._set('currentTime', time)
        },

        destory() {
            this._destory()
        }
    })
}