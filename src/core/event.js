/**
 * Bind video tag event to local player
 */
//  Video events
export const VIDEO_EVENT_LIST = [
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting'
]

//  User events
export const USER_EVENT_LIST = [
    'click',
    'dbclick',
    'mouseover',
    'mouseenter',
    'mouseleave',
    'mouseout',
    'contextmenu',
    'fullscreen',
    'exitFullscreen'
]

const FULL_SCREEN_EVENT = [
    'fullscreenchange',
    'webkitfullscreenchange',
    'mozfullscreenchange',
    'MSFullscreenChange',
]

export default function(Player) {
    Object.assign(Player.prototype, {
        _bindVideoEvent() {
            //  Video event
            VIDEO_EVENT_LIST.forEach(event => {
                this.video.addEventListener(event, () => {
                    this.emit(event, this)
                })
            })

            //  User event
            USER_EVENT_LIST.forEach(eventName => {
                //  Add user event listener to video element
                this.video.addEventListener(eventName, evt => {
                    let videoEventName = `${eventName}_video`
                    this.emit(videoEventName, evt, this.video, this)
                })
                
                //  Add user event listener to box element
                this.box.addEventListener(eventName, evt => {
                    let videoEventName = `${eventName}_box`
                    this.emit(videoEventName, evt, this.box, this)
                })
            })

            //  Full screen event
            FULL_SCREEN_EVENT.forEach(full => {
                document.addEventListener(full, evt => {
                    this.emit('fullscreen_video', evt, this.box, this)
                })
            })
        }
    })
}
