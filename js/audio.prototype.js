var audioDom = e('#id-audio-player')
class Audio{
    constructor() {
        /*定义音乐播放的列表,playList是音乐列表，currentIndex:记录播放的索引*/
        this.playList = []
        this.currentIndex = 0
        this.playMode = 1 //默认播放模式1  顺序播放
    }
    //得到播放器DOM
    getAudioDom() {
        return audioDom
    }

    //暂停
    stop() {
        audioDom.pause()
    }

    //播放
    play(index, callback) {
        var song = this.playList[index]
        if (!this.playList) {
            alert('当前列表没有歌曲')
            return
        } else {
            this.stop()
            audioDom.src = song.src
            audioDom.play()
        }

    }

    //获取格式化的分秒
    getFormatTimer(timer) {
        if (timer == 0) {
            return "00:00"
        } else {
            var m = parseInt(timer / 60,10)
    		var s = parseInt(timer % 60,10)
    		return (m<10?("0"+m):m)+":"+(s<10?("0"+s):s)
        }
    }

    //继续播放
    continuePlay() {
        audioDom.play()
    }
    getCurrentTime() {
        return audioDom.currentTime
    }
    setCurrentTime(currenttime) {
        audioDom.currentTime = currenttime
    }

    //设置当前播放歌曲下标
    setCurrentIndex(index) {
        return this.currentIndex = index
    }

    getCurrentIndex() {
		return this.currentIndex
	}
    getMusicDuration() {
        return audioDom.duration
    }
    add(name,src) {
        this.playList.push({name:name,src:src})
    }
    stop() {
        audioDom.pause()
    }
    getPlayMode() {
		return this.playMode
	}
    setPlayMode(value) {
		return this.playMode=value
	}
}
