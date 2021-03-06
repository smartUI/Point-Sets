/**
 *
 * @author: ouyang.jianhua
 * @last: 16/5/15
 */
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

/*
function handleScreenChange() {
    if (window.orientation == 180 || window.orientation == 0) {
        alert('横屏')
    }
    if (window.orientation == 90 || window.orientation == -90) {
        alert('竖屏')
    }
}
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handleScreenChange, false);
*/
var _audio,part67Audio;
function loadAudio(src, callback) {
    _audio || (_audio = new Audio(src));
    _audio.onloadedmetadata = callback;
    _audio.src = src;
    _audio.loop=false;
    _audio.play();
    return _audio;
};

function goto(index,callback){
    if( !index ){
        return;
    }
    index = index-1;
    var parts = document.querySelectorAll('.part');
    for( var i=0;i<7;i++){
        if( i != index ){
            parts[i].style.display = 'none';
        }else{
            parts[i].style.display = 'block';
        }
    }
    if(callback) callback();
}

function gotoNews(){
    goto(2,function(){
        setTimeout(function(){
            gotoVoiceChat();
        },3000)
        document.title='腾讯新闻';
    })
}

function gotoVoiceChat(){
    goto(3,function(){
        document.title='语音电话';
        var audio = loadAudio('http://cdn.happyjuzi.com/geshang/resource/call.mp3');
        audio.loop=true;
        document.querySelector('.btn-jieting').addEventListener('click',function(){
            audio.pause();
            gotoAcceptVoiceChat();
        },false)
    })
}

function gotoAcceptVoiceChat(){
    goto(4,function(){
        document.title='语音电话';
        var audio = loadAudio('http://cdn.happyjuzi.com/geshang/resource/voice.wav');
        var _time= 1,__time=1;
        window._timerhandle=setInterval(function(){
            _time++;
            __time = _time < 10 ?  '0'+_time : _time;
            document.querySelector('#time').innerHTML='00:'+__time;
        },1000);

        function endedHandle(e){
            audio.removeEventListener('ended',endedHandle);
            clearInterval(window._timerhandle);
            setTimeout(function(){
                goto(5,function(){
                    document.title='戈友';
                    setTimeout(function(){
                        loadAudio('http://cdn.happyjuzi.com/geshang/resource/message.mp3');
                        document.querySelector('.part5-btn').style.display='block';
                    },1000)
                })
            },1000)
        }

        audio.addEventListener('ended',endedHandle,false)

    })
}

function gotoInputName(){
    goto(6,function(){
        document.querySelector('.part6').classList.add('part6-animate');
        document.title='点将台邀请涵';
        part67Audio = loadAudio('http://cdn.happyjuzi.com/geshang/resource/jlbhd.mp3');
        //part67Audio = loadAudio('./resource/jlbhd.mp3');
        part67Audio.loop=true;
    });
}

function receive(){
    var val = document.querySelector('#name').value;
    if( !val ){
        alert('请留下您大名');
    }else{
        document.querySelector('.myname').innerText=val;
        document.title='戈友们，快来领取你的戈十一点将台邀请函';
        goEndPage();
    }
}
function goEndPage(){
    goto(7,function(){
        document.querySelector('.part6').classList.remove('part6-animate');
        document.querySelector('.part7').classList.add('part7-animate');
        if( !part67Audio ){
            part67Audio = loadAudio('http://cdn.happyjuzi.com/geshang/resource/jlbhd.mp3');
            //part67Audio = loadAudio('./resource/jlbhd.mp3');
            part67Audio.loop=true;
        }
    });
}
function showWeixin(){
    document.querySelector('.weixin').style.display="block";
}
function closeWeixin(){
    document.querySelector('.weixin').style.display="none";
}
function playAgain(){
    goto(1,function(){
        document.title='朋友圈';
    });
    document.querySelector('#name').value='';
    document.querySelector('#time').innerHTML='00:01';
    document.querySelector('.part7').classList.remove('part7-animate');
    if(_audio){
        _audio.pause && _audio.pause();
        _audio.loop=false;
        _audio.currentTime=0;
        _audio.remove && _audio.remove();
    }
}
//loading
function loading(img_resource,progress,callback){
    if( !(Array.isArray(img_resource) && img_resource.length) ){
        typeof callback == 'function' && callback.call();
        return;
    }
    var loadImage = function(path, callback) {
        var img = new Image();
        img.onload = function () {
            img.onload = null;
            callback.call(null,path);
        };
        img.onerror = function(){

        };
        img.src = path;
    };
    var progress_now = 0, progress_timer = null, load_img_totle = img_resource.length;
    for(var i = 0; i< load_img_totle; i++){

        loadImage(img_resource[i], function(path){
            //console.log(path)
            var progress_num = parseFloat( progress.innerHTML),//获取当前进度
                max_now_progress = Math.floor( 100 * progress_now / load_img_totle);//获取上一个的最大进度

            // 上一个进度调到上一个进度的最大值
            if( progress_now > 0 ){
                clearInterval(progress_timer);
                progress.innerHTML =  max_now_progress;
            }

            // 处理本次进度
            progress_now ++;
            progress_num = parseFloat( progress.innerHTML);//获取当前进度
            max_now_progress = Math.floor( 100 * progress_now / load_img_totle);

            var delay = progress_now == load_img_totle ? 35 : 55;
            progress_timer = setInterval(function(){
                if(  max_now_progress <= progress_num ){
                    progress.innerHTML =  max_now_progress;
                    clearInterval(progress_timer);
                }else{
                    progress.innerHTML =  progress_num ++;
                }
                // 计算的时候可能有精度丢失，这里加个10的误差
                if( progress_num + 10 > 100 && progress_now == load_img_totle ){
                    clearInterval(progress_timer);
                    progress.innerHTML = '100';
                    window._tl2 = setTimeout(function(){
                        callback.call(null,progress)
                    },200);
                }
            },delay);
        });
    }
}
loading(img_resource,document.getElementById('progress-num'),function(){
    var loading = document.querySelector('.loading-wrapper');
    if( loading.parentElement) {
        loading.parentElement.removeChild( loading );
    }else{
        loading.style.opacity = 0;
        loading.style.display = 'none';
    }
    var _from = getParameterByName('from');
    if( _from == 'timeline' || _from == 'singlemessage' ){
        goEndPage();
    }else{
        document.querySelector('.part1').style.display = 'block';
    }
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}