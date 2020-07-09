/**
 * 进度条相关逻辑
 */
import { formatSeconds } from '@/util/index'

export default {
    initProgress() {
        this.boxHeight = 0
        this.boxWidth = 0
        this.isMoving = false
        this.isCursorFlag = false

        this.calcSize()
        //  为进度条添加事件绑定
        this.addListner()
    },

    /**
     * 计算当前尺寸
     */
    calcSize() {
        this.boxHeight = this.eles.progressBox.height()
        this.boxWidth = this.eles.progressBox.width()
    },

    /**
     * 为进度条添加事件
     */
    addListner() {
        const box = this.eles.progressBox
        box.on('mouseenter', this.handleMouseEnter.bind(this))
        box.on('click', this.handleBoxClick.bind(this))
        this.eles.cursor.on('mouseover', this.showPointer.bind(this))
        this.eles.cursor.on('mouseout', this.hidePointer.bind(this))
        this.eles.cursor.on('mousedown', this.handleCursorMouseDown.bind(this))
    },

    handleCursorMouseDown() {
        this.isCursorFlag = true
        this.isMoving = true
        document.onmouseup = () => {
            this.isCursorFlag = false
            this.isMoving = false
        }
    },

    showPointer() {
        this.eles.pointer.hide()
    },

    hidePointer() {
        this.eles.pointer.show()
    },

    /**
     * 当鼠标在进度条上移动时
     * 显示指示标志，并跟随鼠标移动
     */
    handleMouseEnter() {
        this.hidePointer()
        const box = this.eles.progressBox
        const mousemove = document.onmousemove
        const boxLeft = box.offsetLeft()
        let lastValue = 0
        let timeStamp = 0
        this.halfTimeBoxWidth = this.eles.timeBox.width() / 2

        document.onmousemove = e => {
            //  只关注x的数据变化
            if(lastValue == e.clientX) {
                return
            }

            lastValue = e.clientX
            let widthToSet = e.clientX - boxLeft

            if(this.isCursorFlag) {
                this.handleCursorMove(widthToSet)
            } else {
                if(widthToSet >= 0 && widthToSet <= this.boxWidth) {
                    //  修正1px，避免鼠标始终处于pointer元素正上方
                    //  无法触发cursor元素的mouseover事件
                    this.eles.pointer.translateX(widthToSet - 1)
                    this.setTimeBoxLeft(widthToSet)

                    //  时间的显示不需要高频触发
                    //  此处显示修改时间操作的频率，提高性能
                    if(Date.now() - timeStamp > 100){
                        this.setTimeBoxTime(widthToSet)
                        timeStamp = Date.now()
                    }
                }
            }
        }

        box.once('mouseleave', e => {
            if(this.isCursorFlag) {
                this.handleBoxClick(e)
            }
            this.isCursorFlag = false
            document.onmousemove = mousemove
            this.resetTimeBoxPos()
        })
    },

    /**
     * 游标随鼠标移动
     */
    handleCursorMove(width) {
        this.eles.played.width(width)
    },

    /**
     * 进度条点击事件
     * 设置为当前播放时间
     */
    handleBoxClick(e) {
        const box = this.eles.progressBox
        const cTime = this.getCntPosTime(e.clientX - box.offsetLeft())
        this.player.seekTo(cTime)
    },
    
    /**
     * 限制时间框的左右距离，确保不会移出播放器
     */
    setTimeBoxLeft(width) {
        if(width < this.halfTimeBoxWidth) {
            this.eles.timeBox.right(-(this.halfTimeBoxWidth * 2 - width))
        } else if (this.boxWidth - width < this.halfTimeBoxWidth) {
            this.eles.timeBox.right(-(this.boxWidth - width))
        }
    },

    /**
     * 设置时间框中的时间
     */
    setTimeBoxTime(width) {
        let sec = Math.floor(this.getCntPosTime(width))
        let fmt = sec > 3600 ? 'HH:mm:ss' : 'mm:ss'
        this.eles.timeBox.text(formatSeconds(sec, fmt))
    },

    /**
     * 根据给定宽度，得到对应比例的时间
     */
    getCntPosTime(width) {
        return width / this.boxWidth * this.player.duration
    },

    /**
     * 根据给定时间，得到对应比例宽度
     */
    getCntTimePos(time) {
        return time / this.player.duration * this.boxWidth
    },

    /**
     * 重置时间框相对游标的位置
     * 保证位置的正确性
     */
    resetTimeBoxPos() {
        this.eles.timeBox.right(-this.halfTimeBoxWidth)
        //  隐藏标志
        this.showPointer()
    },

    /**
     * 播放更新事件
     */
    handleTimeUpdate() {
        if(!this.isMoving) {
            this.eles.played.width(this.getCntTimePos(this.player.currentTime))    
        }
    },

    /**
     * 处理视频内容加载事件
     */
    handleLoadingData() {
        const buf = this.player.buffered
        if(buf.length > 0) {
            const cntTime = buf.end(buf.length - 1)
            this.eles.loaded.width(this.getCntTimePos(cntTime))
        }
    }
}