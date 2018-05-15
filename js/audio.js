
var para = {
    t_time:"",  //音乐文件播放总时间
    p_time:"",  //已播放时间

    volume:0.1,
    isFirstPlay:true, //未播放

    musicList:[
    {songSheet:"我的歌单",name:"斑马斑马",src:"audios/1.mp3",author:"沙宝亮"},
    {songSheet:"我的歌单",name:"不要就这样离开我",src:"audios/2.mp3",author:"樊凡"},
    {songSheet:"我的歌单",name:"美人心计",src:"audios/3.mp3",author:"无"},
    ]

}

var audio = new Audio()
//在页面中生成音乐列表
var songliTremplate = (index, value) => {
    var name = value.name
    var author = value.author
    var t = `
    <li class="musicLi" data-index="${index}">
        <a href='javascript:void(0)' class='sing_name' data-id="${index}" >${name}</a>
        <a href='javascript:void(0)' style='color:#FF6C00' data-id="${index}" >${author}</a>
        <a href='javascript:void(0)' class='fr' data-id="${index}" ></a>
    </li>
    `
    return t
}

var insertSongli = (index, value) => {
    var musicList = document.querySelector('#music_list')
    var html = songliTremplate(index, value)
    musicList.insertAdjacentHTML('beforeend', html)
}
var insertSonglis = (songlist) => {
    for (var i = 0; i < songlist.length; i++) {
        var songli = songlist[i]
        insertSongli(i, songli)
    }
}

var mousePosition = (evt) => {
    var xPos,yPos
    evt = evt || window.event
    if(evt.pageX) {
        xPos = evt.pageX
        yPos = evt.pageY
    } else {
        xPos = evt.clientX+document.body.scrollLeft -document.body.clientLeft
        yPos = evt.clientY+document.body.scrollTop-document.body.clientTop
    }
    return [xPos, yPos]
}

//得到元素的绝对位置  left
var getElementLeft = (element) => {
    var actualLeft = element.offsetLeft
    var current = element.offsetParent
    while (current !== null){
        actualLeft += current.offsetLeft
        current = current.offsetParent
    }
    return actualLeft
}

var getStyle = (element) => {
    return element.currentStyle? element.currentStyle : window.getComputedStyle(element, null)
}

var setProgress = () => {
    //父元素绑定事件
    e("#play_rolling").addEventListener("click", (e) => {
        if(!para.isFirstPlay){//如果首次还没播放就快进，我们不予处理
            var move=mousePosition(e)[0]-getElementLeft(this);
            var percent= move/ parseInt(getStyle(this).width);

            //设置滚动条位置
            e("#percent").style.width=percent*100+"%";

            //切换到播放状态
            playOrpause(true);
            //播放歌曲
            var duration=audio.getMusicDuration();
            audio.setCurrentTime(duration*percent);
            //暂停后  再快进 就需要继续播放
            if(audio.getAudioDom().paused)audio.continuePlay();
        }
        //得到
    },false)
}

var setVolume = (initVolume) => {
    //初始音量  para.volume
    e("#v_percent").style.width=initVolume*100+"%"
    e("#v_progress").addEventListener("click",function(e){
        var move=mousePosition(e)[0]-getElementLeft(this)
        var percent= move/ parseInt(getStyle(this).width)

        e("#v_percent").style.width=percent*100+"%"
        audio.getAudioDom().volume=percent
    })
}

var addMusic = (musicList) => {
    if(musicList) {
        musicList.forEach(function(value,index){
            audio.add(value.songSheet,value.src);
        })
    }
}
var musicCount = (id) => {
    if (para.musicList) {
        e(`#${id}`).innerHTML = para.musicList.length
    }
}
var init = () => {
    //初始化进度条
    setProgress();
    //初始化音量
    setVolume(para.volume);
    //添加音乐
    addMusic(para.musicList);  //这句要先执行

    //给页面设置歌曲数目
    musicCount("exlist");
    //给页面添加播放列表
    if(para.musicList.length){
        insertSonglis(para.musicList);
    }

    //初始化歌曲信息
    setMusicMsg(para.musicList[0]);
    beforePlay()
}

//currentStyle,getComputedStyle都是获得元素最终属性值，兼容性不同
//https://www.cnblogs.com/cythia/p/6721145.html
var css = (obj,attr) => {
    var v = obj.currentStyle ?obj.currentStyle[attr]:
    window.getComputedStyle(obj,null)[attr]; //获得元素最终属性值
    if(v=="auto")v = 0;
    return v;
}

var memuAction = (e) => {
    var self = e.target
    var playlist = document.querySelector('.play_list')
    if (playlist.style.display == 'none') {
        playlist.style.display = 'block'
    } else {
        playlist.style.display = 'none'
    }
}

//设置歌曲信息
var setMusicMsg = (msg) => {

    e("#musicMsg").querySelector(".musicName").innerText = msg.name
    e("#musicMsg").querySelector(".author").innerText = "演唱:"+msg.author

}

//是否第一次播放
var firstPlay = (index) => {
    return (!index && index!=0)?true:false
}

var showHide = (id, style) => {
    e(`#${id}`).style.display = style
}
//实现按钮播放/暂停状态的切换
var playOrpause = (status) => {
    if (status) { //播放状态
        showHide("play","none")
        showHide("pause","inline-block")
    } else {  //暂停状态
        showHide("play","inline-block");
        showHide("pause","none");
    }
}
var rangeRandom = (start, end) => {
    if (start === end) {
        return start
    }
    return Math.floor(Math.random()*(end-start+1))+start

}
var beforePlay = () => {
    //拿到当前播放索引
    var index=audio.getCurrentIndex()

    //拿到播放模式
    var mode =audio.getPlayMode()

    if(mode==1){//顺序模式  索引加1
        //这里要做索引的值判断 不然顺序播放会越界
        index = (index + 1) % audio.playList.length
    }else if(mode==2){//随机模式，索引随机
        log('22222' ,rangeRandom(0,audio.playList.length-1))
        index=rangeRandom(0,audio.playList.length-1);
    }else if(mode==3){//单曲循环模式，索引不变

    }
    log('beforeplay' , index)
    //设置索引
    audio.setCurrentIndex(index)
    return audio.getCurrentIndex()

}
var newPlay = (flag) => {

    var index = audio.getCurrentIndex()
    log(index,'index')
    var musicMsg = para.musicList[index]
    setMusicMsg(musicMsg)

    if (para.isFirstPlay) {
        log('firstplay')
        audio.play(index)

        para.isFirstPlay = false
    } else {
        if (flag) {
            audio.play(index)
        } else {
            audio.continuePlay()
        }
    }
    playOrpause(true)
    audio.getAudioDom.autoplay = true
}
//点击歌曲播放
var bindEventEachSong = (songlist) => {
    //insertSonglis(songlist)
    var musiclist = e('#music_list')
    musiclist.addEventListener('click', (e) => {
        log('点击歌曲')
        var self = e.target
        var index = self.dataset.id

        log('点击歌曲后',index,self)
        audio.setCurrentIndex(index)
        playOrpause(true)
        newPlay(true)
    })
}

//上一首歌
var playPrev = () => {
    audio.stop()
    var nextindex = nextSongindex(-1)
    audio.setCurrentIndex(nextindex)
    newPlay(true)
}
//下首歌
var playNext = () => {
    audio.stop()
    var nextindex = nextSongindex(1)
    audio.setCurrentIndex(nextindex)
    newPlay(true)
}

//重播
var repeat = () => {
    audio.stop()
    audio.setCurrentTime(0)
    newPlay(true)
}

//暂停歌曲
var stop = () => {
    //调用audio.js的stop方法
    audio.stop()
    //关闭播放按钮的
    playOrpause(false)
}

//继续播放

//随机播放
var choice = function(array) {
    // 1. 得到  0 - 1 之间的小数 a
    var a = Math.random()
    // 2. 把 a 转成 0 - array.length 之间的小数
    a = Math.random()*array.length
    a = Math.abs(a)
    a = Math.floor(a)
    // 3. 得到 0 - array.length - 1 之间的整数作为下标
    return a
}

var actionRadom = (a, songs) => {
    log('随机播放')
    a.pause()
    var nextindex = choice(songs)
    log(nextindex+'下一首')
    var song = songs[nextindex]
    log('song' + song)
    a.src = song.src
    audio.setCurrentIndex(nextindex)
    a.autoplay = true
    newPlay(true)
}

var nextSongindex = (change) => {
    var songs = para.musicList
    var index = audio.getCurrentIndex()
    index = (index + change + songs.length) % songs.length
    return index
}

var actionRound = (a, songs) => {
    log('循环播放')
    a.pause()
    var nextindex = nextSongindex(1)
    log(nextindex+'下一首')
    var song = songs[nextindex]
    log('song' + song)
    a.src = song.src
    audio.setCurrentIndex(nextindex)
    a.autoplay = true
    newPlay(true)

}

var actionSingle = (a) => {
    log('单曲循环')
    a.currentTime = 0
    a.autoplay = true
    var index = audio.getCurrentIndex()
    audio.play(index)
    log(a.currentTime)
    log(a.autoplay)
}

var bindEventMode = () => {
    var a =audio.getAudioDom()
    var songs = para.musicList
    a.addEventListener('ended', (e) => {
        var mode = audio.getPlayMode()
        log('bindMode',mode)
        var self = e.target
        log(self,'dmjileua')
        if (mode == 1) {
            actionRound(a, songs)
        } else if (mode == 2) {
            actionRadom(a, songs)
        } else if (mode == 3) {
            actionSingle(a)
        }
    })
}
//播放模式

var playModeTab = (mode) => {

    if (mode==1) {
        log('随机播放click')
        showHide("oder_cycle","none")
        showHide("random_cycle","inline-block")
        showHide("single_cycle","none")
        //设置播放模式
        e("#musicMsg").querySelector(".playMode").innerText="随机播放"
        audio.setPlayMode(2)
    } else if (mode==2) {
        log('单曲播放click')
        showHide("oder_cycle","none")
        showHide("random_cycle","none")
        showHide("single_cycle","inline-block")
        //设置播放模式
        e("#musicMsg").querySelector(".playMode").innerText="单曲循环"
        audio.setPlayMode(3)
    } else if (mode==3) {
        log('循环播放click')
        showHide("oder_cycle","inline-block")
        showHide("random_cycle","none")
        showHide("single_cycle","none")

        //设置播放模式
        e("#musicMsg").querySelector(".playMode").innerText="顺序播放"
        audio.setPlayMode(1)
    }

    return mode
}

//更新时间
var updateTime = function() {
    log('update')
    var a = audio.getAudioDom()
    var currentsp = e('#ctimer')
    var currenttime = a.currentTime
    setInterval(function() {
        currenttime = a.currentTime
        var formatetime = audio.getFormatTimer(currenttime)
        currentsp.innerHTML = String(formatetime)
    }, 1000)
}

//总时间
var totalTime = () => {
    var a = audio.getAudioDom()
    a.addEventListener('canplay', () => {
        var duration = a.duration
        var ctime = e('#timer')
        var formatetime = audio.getFormatTimer(duration)
        ctime.innerHTML = String(formatetime)
    })

}
var updateProgress = () => {
    para.p_time = audio.getCurrentTime()
    para.t_time = audio.getAudioDom().duration
    var percent = (para.p_time / para.t_time) * 100
    var p = parseInt(percent)+"%"

    //进度控制相关
    e("#percent").style.width=percent+"%" //底下的进度条
    e("#over").style.height = p
}

var bindEventUpdateProgress = () => {
    var a = audio.getAudioDom()
    a.addEventListener('timeupdate', function () {
    updateProgress();
}, false)
}

var bindEvent = () => {
    var container = document.querySelector('.container')
    container.addEventListener('click', (event) => {
        var self = event.target
        //列表菜单的展开或者收起
        if (self.classList.contains('musicList')){
            memuAction(event)
        }

    })
}

var __main = () => {
    init()
    var songlist = para.musicList
    bindEventEachSong(songlist)
    bindEventMode()
    bindEvent()
    updateTime()
    totalTime()
    bindEventUpdateProgress()
}
__main()
