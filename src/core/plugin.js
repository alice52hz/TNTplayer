/**
 * Plugin of player
 * 
 */
import { noop, isDef, isFunction } from '../util/lang'
import { extend } from '../util/index'
import { hooks } from './constants'
import { 
    VIDEO_EVENT_LIST, 
    USER_EVENT_LIST 
} from './event'

let cid = 0

/**
 * A function to define a plugin of player and returns a definePlugin function
 * User can call definePlugin and pass user parameters to definePlugin
 * 
 * @param {Object} pluginOpts 
 * @returns {Plugin} definePlugin
 */
export function definePlugin(pluginOpts) {
    return function definePlugin(userOpts) {
        return new Plugin(pluginOpts, userOpts)
    }   
}

/**
 * Constructor of plugin
 * @param {Object} pluginOpts 
 * @param {Object} userOtps 
 */
export default class Plugin {
    constructor(opts = {}, userOtps = {}) {
        this.id = cid++
        this._opts = this.pluginOpts = opts
        this.name = opts.name
        this.player = null

        this.$opts = this.opts = this.userOpts = userOtps
        this._init()
    }

    _init() {
        this._mergeHooks()
        this._proxyMethods()
    }

    _mergeHooks() {
        const instanceHooks = {}
        /**
         * Rewrite beforeCreate fucntion
         * Set player instance to plugin instance so that
         * we can access this.player in plugin hook function.
         * Bind event in plugin instance's on/once property
         * to player instance
         */
        const userBeforeCreate = this._opts['beforeCreate']
        this._opts['beforeCreate'] = player => {
            this.player = player
            this._handleEvent()
            userBeforeCreate.call(this)
        }

        hooks.forEach(hook => {
            const h = this._opts[hook]
            instanceHooks[hook] = isDef(h) && isFunction(h)
                ? h
                : noop
        })

        //  Merge hooks to plugin instance
        extend(this, instanceHooks)
    }

    /**
     * Proxy method to instance
     */
    _proxyMethods() {
        const methods = this._opts.methods || {}
        for(const method in methods) {
            Object.defineProperty(this, method, {
                get() {
                    return methods[method]
                }
            })
        }
    }

    /**
     * Plugin provide an `on` method to listen evnets of video
     */
    _handleEvent() {
        const listeners = this._opts.on || {}
        const onceListeners = this._opts.once || {}
        //  Add listeners to player
        for(const evt in listeners) {
            if(VIDEO_EVENT_LIST.includes(evt) || USER_EVENT_LIST.includes(evt)) {
                this.player.on(evt, listeners[evt], {
                    isPlugin: true,
                    plugin: this
                })
            }
        }
        //  Once listener
        for(const evt in onceListeners) {
            if(VIDEO_EVENT_LIST.includes(evt)) {
                this.player.once(evt, onceListeners[evt])
            }
        }
    }
}