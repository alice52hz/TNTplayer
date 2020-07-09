/**
 * 控制栏相关逻辑
 * 播放/暂停、总时长、当前播放时间、音量、全屏操作
 */
import { formatSeconds } from '@/util/index'
import { isDef, isNumber } from '@/util/lang'
import $ from '@/util/dom'

export default {
    initCtrl() {
        this.lastTimeString = ''
        this.hideTime = 3
        this.timer = null
        this.isSpread = true
        this.ctrlHeight = 0

        this.initCtrlListener()
        this.handleCtrlShowOrHide()
    },

    handleCtrlShowOrHide() {
        //  使用用户自定义的时间
        const hideCtrlTime = this.opts.hideCtrlTime
        if(isDef(hideCtrlTime) && isNumber(hideCtrlTime) && hideCtrlTime > 0) {
            this.hideTime = hideCtrlTime
        }

        //  获取高度
        this.ctrlHeight = this.eles.ctrlBox.height()

        this.resetHideFn()
        this.player.box.addEventListener('mousemove', this.resetHideFn.bind(this))
    },

    resetHideFn() {
        if(!this.isSpread) {
            this.setCtrlHeight(true)
        }
        if(this.timer !== null) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
            if(!this.player.paused) {
                this.setCtrlHeight(false)
            }
        }, this.hideTime * 1000)    
    },

    setCtrlHeight(flag) {
        const height2Set = flag ? this.ctrlHeight : 0
        this.eles.ctrlBox.height(height2Set)
        this.eles.el.height(height2Set)
        this.isSpread = flag

        //  是否在隐藏控制栏后，在底部显示一个进度条
        if(!this.opts.showBottomProgress) {
            this.eles.progressBox.style('opacity', flag ? 1 : 0)
        }
    },

    initCtrlListener() {
        //  播放事件
        this.handlePlayOperation()
        //  处理音量的显示与调节
        this.handleVolumeCtrl()
        //  全屏
        this.handleFullScreen()
    },

    handlePlayOperation() {
        const handlePlay = function() {
            //  点击时，重置隐藏时间
            this.resetHideFn()
            this.handlePlay()
        }
        $(this.player.video).on('click', handlePlay.bind(this))
        this.eles.playBtn.on('click', handlePlay.bind(this))
    },

    handleFullScreen() {
        this.eles.fullScreenBox.on('click', () => {
            if(this.player.isFullscreen()) {
                //  退出全屏
                this.player.exitFullscren()
            } else {
                //  进入全屏
                this.player.setFullScreen()
            }
        })
    },

    /**
     * 全屏状态发生改变事件
     */
    handleScreenChange() {
        const isFull = !!this.player.isFullscreen()
        this.setFullScreenUi(isFull)
    },

    setFullScreenUi(fullFlag) {
        if(fullFlag) {
            this.eles.fullScreen.hide()
            this.eles.exitFullScreen.show()
        } else {
            this.eles.fullScreen.show()
            this.eles.exitFullScreen.hide()
        }
    },

    /**
     * 音量相关逻辑
     */
    handleVolumeCtrl() {
        const getScale = (x, left, boxWidth) => {
            let wToSet = x - left
            wToSet = wToSet < 0 ? 0 : wToSet
            wToSet = wToSet > boxWidth ? boxWidth : wToSet
            return wToSet / boxWidth
        }

        const box = this.eles.volumeBox
        const cur = this.eles.volCur

        box.on('click', e => {
            this.setMuted(false)
            const boxWidth = box.width()
            const left = box.offsetLeft()
            this.setVolume(getScale(e.clientX, left, boxWidth))
        })

        cur.on('mousedown', () => {
            const boxWidth = box.width()
            const left = box.offsetLeft()
            let last = 0

            const originMousemove = document.onmousemove
            const originMouseup = document.onmouseup
            document.onmousemove = e => {
                if(last != e.clientX) {
                    last = e.clientX
                    this.setMuted(false)
                    this.setVolume(getScale(e.clientX, left, boxWidth))
                }
            }

            document.onmouseup = () => {
                document.onmousemove = originMousemove
                document.onmouseup = originMouseup
            }
        })

        //  静音操作
        this.eles.muted.on('click', () => this.setMuted(true))
        this.eles.unMuted.on('click', () => this.setMuted(false))  
    },

    /**
     * 是否需要静音
     */
    handleIsMuted(isMuted) {
        if(isMuted) {
            this.setVolumeUi(0)
            this.eles.muted.hide()
            this.eles.unMuted.show()
        } else {
            this.eles.muted.show()
            this.eles.unMuted.hide()
        }
    },

    setVolume(volume) {
        this.player.set('volume', volume)
    },

    setVolumeUi(volume) {
        //  如何优雅计算？
        const volumeOutBoxWidth = (150 - 30) * 0.8
        this.eles.volumeValue.width(volumeOutBoxWidth * volume)
    },

    setMuted(val) {
        this.player.set('muted', val)
    },

    setMutedUi(isMuted) {
        if(isMuted) {
            this.eles.muted.hide()
            this.eles.unMuted.show()
        }
    },

    /**
     * 音量发生改变
     */
    volumechange() {
        this.setVolumeUi(this.player.volume)
        this.handleIsMuted(this.getIsMuted())
    },

    /**
     * 音量为0 或 muted为true 视为静音
     */
    getIsMuted() {
        return this.player.muted || this.player.volume == 0
    },

    /**
     * 播放事件
     */
    handlePlay() {
        if(this.player.paused) {
            this.player.play()
        } else {
            this.player.pause()
        }
    },

    /**
     * 初始化播放UI
     */
    initPlayState() {
        this.togglePlay(!this.player.paused)

        //  初始化 duration  
        this.initDuration()

        //  初始化 volume
        this.initVolume()
    },

    initVolume() {
        this.setVolume(this.player.$options.volume)
    },

    initDuration() {
        const duration = this.player.duration
        //  设置时间显示框的宽度，避免由于数字大小不同，导致位置改变
        const timeBoxWidth = duration >= 3600 ? 58 : 38
        this.setTimeBoxWidth(timeBoxWidth)
        //  设置总时长
        this.eles.endTime.text(this.getTimeString(duration))
    },

    setTimeBoxWidth(width) {
        this.eles.cntTime.width(width)
        this.eles.endTime.width(width)
    },

    /**
     * 播放时间的显示 
     */
    handleCtrlTime() {
        const cTimeString = this.getTimeString(this.player.currentTime)
        if(this.lastTimeString != cTimeString) {
            this.lastTimeString = cTimeString
            this.eles.cntTime.text(cTimeString)
        }
    },

    getTimeString(sec) {
        const fmt = sec > 3600 ? 'HH:mm:ss' : 'mm:ss'
        return formatSeconds(sec, fmt)
    },

    /**
     * 切换播放状态UI
     */
    togglePlay(state) {
        if(state) {
            this.eles.play.hide()
            this.eles.pause.show()
        } else {
            this.eles.play.show()
            this.eles.pause.hide()
        }
    }
}