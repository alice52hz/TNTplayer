/**
 * Player core without UI
 * Create by bing
 */
import './css/index.less'
import Emitter from '../util/emitter'
import {
    KEYS_TO_PROXY_GET,
    KEYS_TO_PROXY_SET
} from './constants'
import { isUndef, isDef } from '@/util/lang'
import { attrs } from '@/util/dom'
import { isMp4, isHls, isFlv } from './util'
import initEvent from './event'
import initPublicApi from './public'
import pkg from '../../package.json'
import Plugin from './plugin'

class Player extends Emitter {
    constructor(options) {
        super()
        this.$options = this._handleOptions(options)
        this.VERSION = pkg.version

        //  Trigger plugin's `beforeCreate` function
        this._callHooks('beforeCreate', this)
        this._init()
    }

    /**
     * Static method
     * Define a plugin of player
     * @param {Object} options of plugin
     * @returns {Plugin} instance of plugin
     */
    static plugin(pluginOpts) {
        return function definePlugin(userOpts) {
            return new Plugin(pluginOpts, userOpts)
        }
    }

    /**
     * Handle user input options
     * @param {Object} options 
     */
    _handleOptions(options) {
        const tmp = {}
        if(isUndef(options.el)) {
            throw new Error(`'el' is required`)
        }
        try {
            tmp.el = document.querySelector(options.el)    
        } catch(err) {
            throw new TypeError(`'el' must be a legal selector`)
        }
        if(tmp.el === null) {
            throw new Error(`selector 'el' was not found in document`)
        }
        if(isDef(options.plugins) && !Array.isArray(options.plugins)) {
            throw new TypeError(`'plugins' must be Array`)
        }

        const setDf = (key, val) => {
            return isUndef(options[key])
                ? val
                : !!options[key]
        }

        tmp.controls = setDf('controls', true)
        tmp.autoplay = setDf('autoplay', false)
        tmp.preload = setDf('preload', true)
        tmp.loop = setDf('loop', false)
        tmp.defaultMuted = setDf('defaultMuted', false)
        tmp.userPlainCtrl = setDf('userPlainCtrl', true)
        tmp.src = options.src
        tmp.volume = options.volume || 0.5
        tmp.plugins = options.plugins
        this.plugins = tmp.plugins
        return tmp
    }

    /**
     * Trigger lifecycle functions of every plugin
     * @param {String} hook name of hook
     * @param  {...any} args arguments
     */
    _callHooks(hook, ...args) {
        if(isDef(this.plugins)) {
            this.plugins.forEach(plugin => {
                plugin[hook](...args)
            })
        }
    }

    _init() {
        this.box = null
        this.video = null
        this.flvPlayer = null
        this.hlsPlayer = null

        this._render(this._createElement())
        //  Bind event to video and box
        this._bindVideoEvent()
        
        //  Proxy video props to player instance
        this._proxyProps()
        this._initState()
    }

    _createElement() {
        const opts = this.$options
        this.box = document.createElement('div')
        this.box.className = 'player_box--wrapper'
        const video = this.video = document.createElement('video')
        this._callHooks('created')

        //  Set default attribute to video element
        this._setVideoDefault(opts, video)
        this.box.appendChild(video)

        this._callHooks('beforeMount')
        return this.box
    }

    _render(videoBox) {
        this.$options.el.innerHTML = ''
        this.$options.el.appendChild(videoBox)
        this._callHooks('mounted')
    }

    _setVideoDefault(opts, video) {
        const videoAttrs = {
            preload: opts.preload ? 'auto' : 'metadata',
            defaultMuted: opts.defaultMuted
        }
        if(opts.controls) videoAttrs.controls = opts.controls
        if(opts.loop) videoAttrs.loop = opts.loop

        attrs(video, videoAttrs)
    }

    _initHlsOrFlvPlayer() {
        //  Destroy old flvPlayer or hlsPlayer when load new source.
        if(this.flvPlayer) {
            this.flvPlayer.destroy()
            this.flvPlayer = null
        }
        if(this.hlsPlayer) {
            this.hlsPlayer.destroy()
            this.hlsPlayer = null
        }
    }

    _loadSrc(src) {
        return new Promise((resolve, reject) => {
            /**
             * Load different content base on script command
             * 
             * Video at pc end can only support video type mp4/ogg
             * If we want to play hls stream or rtmp stream, we need to 
             * import hls.js/flv.js. Mobile end can support hls or rtmp 
             * naturally. We'll not import flv.js/hls.js when compile 
             * to Mobile platform so that can reduce size of javascript file.
             * And improve load efficiency.
             * 
             */
            if(TARGET_PLATFORM === 'pc') {
                //  We will require hls.js or flv.js when compile
                const HLS = require('hls.js')
                const Flv = require('flv.js')

                //  Init hlsPlaer/flvPlayer
                this._initHlsOrFlvPlayer()

                //  Video type: mp4/ogg
                if(isMp4(src)) {
                    this._set('src', src)
                    resolve(this.video)
                } else if(isHls(src)) {
                    //  Video type: m3u8
                    //  hls.js is a JavaScript library which implements an HTTP Live Streaming client.
                    //  It relies on HTML5 video and MediaSource Extensions for playback.
                    //  For details https://www.npmjs.com/package/hls.js
                    if(HLS.isSupported()) {
                        const hls = this.hlsPlayer = new HLS()
                        hls.loadSource(src)
                        hls.attachMedia(this.video)
                        hls.on(HLS.Events.MANIFEST_PARSED, () => resolve(this.video))
                    } else {
                        reject(new Error('hls is not support'))
                    }
                } else if(isFlv(src)) {
                    //  Video type: flv
                    //  An HTML5 Flash Video (FLV) Player written in pure JavaScript without Flash. 
                    //  Relies on Media Source Extensions to work.
                    //  flv.js works by transmuxing FLV file stream into ISO BMFF (Fragmented MP4) segments, 
                    //  followed by feeding mp4 segments into an HTML5 <video> element through Media Source Extensions API.
                    //  For details https://www.npmjs.com/package/flv.js
                    const flv = Flv.default
                    if(flv.isSupported()) {
                        const flvPlayer = this.flvPlayer = flv.createPlayer({
                            type: 'flv',
                            url: src
                        })
                        flvPlayer.attachMediaElement(this.video)
                        flvPlayer.load()
                        resolve(flvPlayer)
                    } else {
                        reject(new Error('flv is not support'))
                    }
                } else {
                    //  For other types that can't support.
                    reject(new TypeError(`Can't distinguish video type of src`))
                }
            } 
            
            if(TARGET_PLATFORM === 'mobile') {
                if(isMp4(src)) {
                    this._set('src', src)
                    resolve(this.video)
                } else {
                    reject(new TypeError(`Can't distinguish video type of src`))
                }
            }
        })
    }
    
    _initState() {
        const opts = this.$options
        if(opts.src) {
            this._loadSrc(opts.src).then(video => {
                //  Handle auto play
                //  Most browsers forbidden video autoplay
                //  Unless we has seted video to muted.
                if(opts.autoplay) {
                    this._set('muted', true)
                    video.play()
                }
            }).catch(err => {
                throw err
            })
        }
    }

    /**
     * Proxy video props to player instance
     */
    _proxyProps() {
        KEYS_TO_PROXY_GET.forEach(key => {
            const proxyObject = {
                get() {
                    return this.video[key]
                }
            }
            //  Proxy set method of video to player instance
            if(KEYS_TO_PROXY_SET.includes(key)) {
                proxyObject.set = val => {
                    this.video[key] = val
                }
            }
            Object.defineProperty(this, key, proxyObject)
        })
    }

    _set(key, val) {
        this.video[key] = val
    }

    _destory() {
        this._callHooks('beforeDestroy')

        //  remove player DOM from document 
        this.box.parentNode.removeChild(this.box)
        this._initHlsOrFlvPlayer()
        this.box = null
        this.video = null
        
        this._callHooks('destoryed')
    }
}

initEvent(Player)
initPublicApi(Player)

export default Player