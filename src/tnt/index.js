import Player from '@/core/'
import controls from '@/plugin/controls/'

//  Methods to be proxied to TNTplayer
const methodToProxyOnTNT = [
    'on',
    'once',
    'isFullscreen',
    'setFullScreen',
    'exitFullscren',
    'set',
    'play',
    'pause',
    'load',
    'seekTo'
]

export default class TNTplayer {
    constructor(opts) {
        const ctrls = controls(opts)
        const plugins = [ctrls]
        const coreOpts = {
            ...opts,
            plugins
        }
        this.player = new Player(coreOpts)

        //  proxy methods of core player to TNTplayer
        methodToProxyOnTNT.forEach(method => {
            this[method] = this.player[method].bind(this.player)
        })

        //  Proxy plugin's methods to TNTplayer instance
        //  Public api method begin with $, they will be proxy to TNTplayer
        plugins.forEach(plugin => {
            const methods = plugin.pluginOpts.methods
            for(const method in methods) {
                if(method.charAt(0) == '$'){
                    this[method] = methods[method].bind(plugin)
                }
            }
        })
    }
}