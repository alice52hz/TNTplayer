import './assets/index.less'
const html = require('html-loader!./assets/index.html')

import { definePlugin } from '@/core/plugin'
import handleProgress from './progress'
import handleCtrl from './ctrl'
import publicApi from './public'

import $$, {
    creEleByCls
} from '@/util/dom'


//  控制栏插件
export default definePlugin({
    name: 'controls',

    beforeCreate() {
        //  隐藏默认的控制栏
        this.playerOpts = this.player.$options
        this.isLive = this.opts.isLive || false
        
        //  用户设置显示控制栏，并不使用系统控制栏时，加载此插件
        const opts = this.playerOpts
        if(opts.controls && !opts.userPlainCtrl) {
            opts.controls = false
        }
    },

    mounted() {
        //  创建DOM
        this.render(this.createElement())
        this.init()
    },

    methods: {
        ...handleProgress,
        ...handleCtrl,
        ...publicApi,

        createElement() {
            this.el = creEleByCls('player_box--controls')
            this.el.innerHTML = html
            return this.el
        },

        render(el) {
            this.player.box.appendChild(el)
        },

        init() {
            //  选择当前实例中的class
            const $ = this.$ = v => $$(v, this.el)
            
            //  获取DOM元素
            this.eles = {
                el: $$(this.el),
                progressBox: $('.ctrl_box--progress'),
                loaded: $('.ctrl_progress--loaded'),
                played: $('.ctrl_progress--played'),
                cursor: $('.ctrl_progress--cursor'),
                pointer: $('.ctrl_progress--pointer'),
                timeBox: $('.ctrl_box--time'),
                playBtn: $('.ctrl_box--play'),
                play: $('.ctrl_item--play'),
                pause: $('.ctrl_item--pause'),
                cntTime: $('.ctrl_time--start'),
                endTime: $('.ctrl_time--end'),
                volumeBox: $('.volume_line--outbox'),
                volumeValue: $('.volume_line--innerbox'),
                volCur: $('.volume_line--cursor'),
                muted: $('.volume_muted--true'),
                unMuted: $('.volume_muted--false'),
                fullScreen: $('.ctrl_fullscreen--enter'),
                exitFullScreen: $('.ctrl_fullscreen--exit'),
                fullScreenBox: $('.ctrl_fullscreen--box'),
                ctrlBox: $('.ctrl_box--ctrl')
            }

            this.initProgress()
            this.initCtrl()
        }
    },
    
    on: {
        play() {
            this.togglePlay(true)
        },
        pause() {
            this.togglePlay(false)
        },
        playing() {
            this.togglePlay(true)
        },
        waiting() {
            this.togglePlay(false)
        },
        timeupdate() {
            this.handleTimeUpdate()
            this.handleCtrlTime()
        },
        progress() {
            this.handleLoadingData()
        },
        loadedmetadata() {
            this.initPlayState()
        },
        seeking() {
            this.handleTimeUpdate()
        },
        volumechange() {
            this.volumechange()
        },
        fullscreen() {
            //  全屏状态发生改变时，重新计算尺寸
            //  全屏具有动画效果，同步计算的值会有误差，所以延时计算
            setTimeout(() => {
                this.calcSize()
            }, 1000)

            this.handleScreenChange()
        }
    }
})
