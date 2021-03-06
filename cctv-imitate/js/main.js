//------------------------------------------
//辅助函数
/**
 * ajax函数
 * @param {object} opt 
 */
function ajax(opt = {}) {
    //强制opt为对象
    opt = opt || {};
    //http连接的方式
    opt.method = opt.method || 'POST';
    //发送请求的url
    opt.url = opt.url || '';
    //是否为异步请求，true为异步的，false为同步的
    opt.async = opt.async || true;
    //发送的参数，类型为对象类型
    opt.data = opt.data || null;
    //预期服务器返回数据类型
    opt.dataType = opt.dataType || 'JSON';
    //ajax发送并接收成功调用的回调函数
    opt.success = opt.success || function () { };
    //ajax发送并接收失败调用的回调函数
    opt.error = opt.error || function () { };


    let xhr = null;
    if (window.XMLHttpRequest) {
        // IE7+, Firefox, Chrome, Opera, Safari 代码
        xhr = new XMLHttpRequest();
        //针对某些特定版本的mozilla浏览器的bug进行修正。
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/xml');
        }
    }
    else {
        // IE6, IE5 代码
        xhr = new ActiveXObject('Microsoft.XMLHTTP');

    }
    let params = [];

    // Object.keys(opt.data).forEach(key => { params.push(key + '=' + opt.data[key]) });
    for (let key in opt.data) params.push(key + '=' + opt.data[key]);

    let postData = params.join('&');
    //跨域请求
    if (opt.dataType === 'JSONP') {
        creatScript(opt.url, postData);
    }
    else {
        if (opt.method.toUpperCase() === 'POST') {
            xhr.open(opt.method, opt.url, opt.async);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xhr.send(postData);
            // xhr.setRequestHeader('Content-Type', 'application/json');
            // xhr.send(JSON.stringify(data));
        }
        else if (opt.method.toUpperCase() === 'GET') {
            if (postData.length > 0) {
                xhr.open(opt.method, opt.url + '?' + postData, opt.async);
            }
            else {
                xhr.open(opt.method, opt.url, opt.async);
            }
            xhr.send(null);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // 信息响应(100–199)，成功响应(200–299)，重定向(300–399)，客户端错误(400–499)和服务器错误 (500–599)
                if (xhr.status >= 200 && xhr.status < 400) {
                    opt.success(xhr.response);
                }
                else if (xhr.status >= 400) {
                    opt.error(xhr.status);
                }
            };
        }
    }
}
/**
 * 动态创建script标签
 * --------------------------------------------
 * 同源策略，它是由Netscape提出的一个著名的安全策略
 * 现在所有支持JavaScript 的浏览器都会使用这个策略。
 * 所谓同源是指
 * ----》域名，协议，端口相同
 * 当一个浏览器的两个tab页中分别打开来 百度和谷歌的页面当一个百度浏览器执行一个脚本的时候会检查这个脚本是属于哪个页面的，
 * 即检查是否同源，只有和百度同源的脚本才会被执行
 * 
 * @param {string} url 发送请求的url
 * @param {object} data 发送的参数
 */
function creatScript(url, data) {
    //应用搜索接口
    //JSONP get请求 
    //利用script标签的src属性没有同源策略限制这一特点，访问非同源数据
    let oScript = document.createElement('script');
    //回调函数名jsonp,远程服务上调用这个函数并且将JSON 数据形式作为参数传递，完成回调
    oScript.src = url + '?' + data + '&callback=jsonp';
    document.body.appendChild(oScript);
}

/**
 * 判断img是否支持loading属性
 * @returns 返回当前浏览器对于loading的支持情况，支持返回true，反之false;
 */
function isSupportLoading() {
    return 'loading' in document.createElement('IMG');
}
/**
 * 判断浏览器是否支持IntersectionObserver
 * @returns  返回当前浏览器对于IntersectionObserver的支持情况，支持返回true，反之false;
 */
function isSupportIntersectionObserver() {
    return (typeof IntersectionObserver).toLowerCase() === "function";
}
/**
 * 获取DOM对象
 * @param {*} arg 选择器组
 * @returns 返回与指定的选择器组匹配的文档中的元素列表 
 */
function $(arg) {
    return document.querySelectorAll(arg);
}
/**
 * 在指定位置插入字符串
 * 例如 insertStr("123","5",2);返回结果是"1523"
 * @param {string} source 原字符串
 * @param {string} str 要插入的字符串
 * @param {number} position 要插入的位置
 * @returns 插入字符后的字符串
 */
function insertStr(source, str, position) {
    return source.substring(0, position - 1) + str + source.substring(position - 1);
}
/**
 * 移除行内样式
 * @param {*} obj 
 * @param {*} opt 需要移除得样式名称数组
 */
function removeInlineCssStyle(obj, opt) {
    var temp = obj.style.cssText;
    opt.forEach((e) => {
        var re = new RegExp(e + ".*?;");
        temp = temp.replace(re, "");
    });
    obj.style.cssText = temp;
}
/**
 * 获取样式值
 * @param {*} obj 
 * @param {*} attr 
 * @returns 
 */
function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];//ie的
    }
    else {
        return getComputedStyle(obj, null)[attr];
    }
}
/**
 * 获取背景图片
 * @param {*} Ele 
 * @returns 返回url
 */
function getBackgroundImage(Ele) {
    return getStyle(Ele, "backgroundImage").replaceAll("\"", "").replace("url(", "").replace(")", "");
}
/**
 * 清空子元素
 * @param {*} element 
 */
function empty(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
/**
 * 格式化时间
 * @param {*} fmt 
 * @returns 
 */
Date.prototype.Format = function (fmt) {
    var o = {
        //月份 
        "M+": this.getMonth() + 1,
        //日 
        "d+": this.getDate(),
        //小时 
        "h+": this.getHours(),
        //分
        "m+": this.getMinutes(),
        //秒 
        "s+": this.getSeconds(),
        //季度 
        "q+": Math.floor((this.getMonth() + 3) / 3),
        //毫秒 
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
            k]).substr(("" + o[k]).length)));
    return fmt;
}
/**
 * 淡入
 * @param {*} time 
 * @param {*} callBack 
 * @returns 
 */
fadeIn = function (el, time, callBack) {
    el.style.opacity = 0;
    let t = setInterval(function () {
        el.style.opacity = parseFloat(el.style.opacity) + 0.01;
        if (el.style.opacity >= 1) {
            clearInterval(t);
            callBack && callBack();
        }
    }, time);
    return this;
}
/**
 * 淡出
 * @param {*} time 
 * @param {*} callBack 
 * @returns 
 */
fadeOut = function (el, time, callBack) {
    el.style.opacity = 1;
    let t = setInterval(function () {
        el.style.opacity = parseFloat(el.style.opacity) - 0.01;
        if (el.style.opacity <= 0) {
            clearInterval(t);
            callBack && callBack();
        }
    }, time);
    return this;
}

/**
 * 判断数据类型
 * @returns 
 */
function judge() {
    return {
        isArray: (o) => Object.prototype.toString.call(o) == "[object Array]",
        isObj: (o) => Object.prototype.toString.call(o) == "[object Object]",
        isNull: (o) => Object.prototype.toString.call(o) == "[object Null]",
        isFunction: (o) => Object.prototype.toString.call(o) == "[object Function]",
        isDate: (o) => Object.prototype.toString.call(o) == "[object Date]",
        isDocument: (o) => Object.prototype.toString.call(o) == "[object Document]" || Object.prototype.toString.call(o) == "[object HTMLDocument]",
        isNumber: (o) => Object.prototype.toString.call(o) == "[object Number]",
        isString: (o) => Object.prototype.toString.call(o) == "[object String]",
        isUndefined: (o) => Object.prototype.toString.call(o) == "[object Undefined]",
        isBoolean: (o) => Object.prototype.toString.call(o) == "[object Boolean]",
        isHTMLCollection: (o) => Object.prototype.toString.call(o) == "[object HTMLCollection]",
        isHTMLLIElement: (o) => Object.prototype.toString.call(o) == "[object HTMLLIElement]"
    }
}
//获取数据函数
getData = function (opt) {
    ajax({
        method: "GET",
        url: opt.url,
        data: opt.data
        ,
        success: function (response) {
            data = JSON.parse(response);
            opt.callBack && opt.callBack(data);
        },
        error: function (status) {
            throw new Error('状态码：' + status);
        }
    });
}
/**
 * 防抖函数 执行最后一次
 * @param {*} func 业务代码
 * @param {*} delay 延时
 * @returns 
 */
function antiShake(func, delay) {
    var t = null;
    return function () {
        if (t !== null) {
            clearTimeout(t);
        }
        t = setTimeout(() => {
            func.call(this);
        }, delay);
    };
}
/**
 * 节流函数 减少执行次数
 * @param {*} func 业务代码
 * @param {*} delay 延时
 */
function throttle(func, delay) {
    var flag = true;
    return function () {
        if (flag) {
            setTimeout(() => {
                func.call(this);
                flag = true;
            }, delay);
        }
        flag = false;
    };
}
/**
 * 节流函数 减少执行次数
 * @param {*} func 业务代码
 * @param {*} delay 延时
 */
// function throttle(func, delay) {
//         var flag = true;
//         return function (e) {
//             if (flag) {
//                 setTimeout(() => {
//                     func.call(this,e);
//                     flag = true;
//                 }, delay);
//             }
//             flag = false;
//         };
//     }
/**
 * 调用搜索函数
 * @param {*} input 
 * @param {*} btn 
 */
function searchFunc(Oinput, type, btn) {
    btn.onclick = function () {
        queryFunc(Oinput.value, type);
    }
}
/**
 * 搜索函数
 * @param {*} qtext 
 */
function queryFunc(qtext, type) {
    if (qtext.trim() != "") {
        window.open("https://search.cctv.com/search.php?qtext=" + encodeURIComponent(qtext) + "&type=" + type,
            "_blank");
    } else {
        window.open("https://search.cctv.com/index.php");
    }
}
/**
 * 创建通用video字符串
 * @param {*} src 
 * @returns 
 */
function getVideoStr(src) {
    let video = '<video width="100%" height="100%" muted="true"  autoplay="autoplay" loop="loop" src="' + src +
        '"><source src="' + src + '" type="video/mp4"></video>';

    return video;
}
/**
 * 获取当前时间戳，精确到毫秒
 * @returns 
 */
function getNowTimeStamp() {
    return (new Date).valueOf();
}

//---------------------------核心区域
//分割图
//
// ♪ 加油加油! ♪
// ミ ゛ミ ∧＿∧ ミ゛ミ
// ミ ミ ( ・∀・ )ミ゛ミ
// ゛゛ ＼　　　／゛゛
// 　　 　i⌒ヽ ｜
// 　　 　 (＿) ノ
// 　　　　　 ∪

// 待我代码编成，一定好好休息一下
// ￣￣￣￣￣＼／￣￣￣￣￣￣￣￣
// 　　　　∧＿∧　　　　 
// 　　;;（´・ω・） 　 
// 　＿旦_(っ(,,■)＿＿  
// 　|l￣l||￣しﾞしﾞ￣|i


//图片懒加载---轮播图之下使用
window.addEventListener("load", function () {
    if (isSupportIntersectionObserver()) {
        observerFunc();
    }
    else {
        commonLazyFunc();
    }
});
/**
 * 支持IntersectionObserver接口的浏览器使用的懒加载函数
 */
function observerFunc() {
    var limitIndex = 33;
    var allImages = $('img');
    var observer = new IntersectionObserver(callback);
    allImages.forEach((e, index) => {
        if (index > limitIndex) {
            observer.observe(e);
        }
    });
    function callback(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                var imgEle = entry.target;
                var img_src = imgEle.dataset.src;
                if (img_src) {
                    imgEle.src = img_src;
                }
                observer.unobserve(imgEle);
            }
        })
    }
}
/**
 * 不支持IntersectionObserver接口的浏览器使用的懒加载函数
 */
function commonLazyFunc() {
    var limitIndex = 33;
    var allImages = $('img');
    var flag = true;
    var len = allImages.length;
    window.addEventListener("scroll", throttle(function () {//节流
        if (flag) {
            allImages.forEach((img, index) => {
                if (index > limitIndex) {
                    const imgTop = img.getBoundingClientRect().top;
                    if (imgTop < window.innerHeight) {
                        var img_src = img.dataset.src;
                        if (img_src && !img.src) {
                            img.src = img_src;
                            if (index === len - 1) {
                                flag = false;
                            }
                        }
                    }
                }
            })
        }
    }, 500));
}


// ---------------------------------------------------------------------------------------------------------------end
//顶部导航
(
    function () {
        var topNavData = '{\"logosrc\":\"https://p1.img.cctvpic.com/photoAlbum/templet/common/DEPA1546583592748817/logo31.png\",\"nav\":[{\"text\":\"时政\",\"isGroup\":true,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"新闻\",\"isGroup\":false,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"视频\",\"isGroup\":false,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"经济\",\"isGroup\":false,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"评论\",\"isGroup\":false,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"奥运\",\"isGroup\":false,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"军事\",\"isGroup\":false,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"熊猫频道\",\"isGroup\":false,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"直播中国\",\"isGroup\":false,\"isHot\":false,\"isIcon\":false,\"isBorder\":false},{\"text\":\"超高清\",\"isGroup\":true,\"isHot\":true,\"isIcon\":false,\"isBorder\":true},{\"text\":\"CCTV.直播\",\"isGroup\":true,\"isHot\":false,\"isIcon\":false,\"isBorder\":true},{\"text\":\"English\",\"isGroup\":true,\"isHot\":false,\"isIcon\":false,\"isBorder\":true},{\"text\":null,\"isGroup\":false,\"isHot\":false,\"isIcon\":true,\"isBorder\":false},{\"text\":\"\",\"isGroup\":false,\"isHot\":false,\"isIcon\":true,\"isBorder\":false},{\"text\":\"\",\"isGroup\":false,\"isHot\":false,\"isIcon\":true,\"isBorder\":false},{\"text\":null,\"isGroup\":false,\"isHot\":false,\"isIcon\":true,\"isBorder\":false}]}';
        var secondData = '{\"hoverList\":[[[\"人民领袖习近平\",\"联播+\",\"中国领导人\"],[\"传习录\",\"央视快评\",\"习式妙语\"],[\"热解读\",\"天天学习\"]],[[\"4K专区\",\"VR浸新闻\",\"互动直播\"]],[[\"直播\",\"看点\",\"栏目\"],[\"片库\",\"节目单\",\"收视榜\"],[\"主持人\",\"上电视\"]],[[\"繁体\",\"English\",\"Монгол\"],[\"\",\"iPanda\"]]]}';
        var secondListData = '{\"titleList\":[\"总台春晚\",\"网络春晚\",\"才艺\",\"共产党员网\",\"精品动画\",\"秧纪录\",\"纪录片网\",\"国家大剧院\",\"广播电视公益广告\",\"网上展馆\",\"广告精准扶贫\",\"国庆70周年成就展\"],\"content\":[[{\"text\":\"新闻\",\"isImage\":false},{\"text\":\"时政\",\"isImage\":false},{\"text\":\"国内\",\"isImage\":false},{\"text\":\"国际\",\"isImage\":false},{\"text\":\"经济\",\"isImage\":false},{\"text\":\"农业\",\"isImage\":false},{\"text\":\"军事\",\"isImage\":false},{\"text\":\"科技\",\"isImage\":false},{\"text\":\"法治\",\"isImage\":false},{\"text\":\"文娱\",\"isImage\":false},{\"text\":\"健康\",\"isImage\":false},{\"text\":\"人物\",\"isImage\":false},{\"text\":\"公益\",\"isImage\":false},{\"text\":\"文旅\",\"isImage\":false},{\"text\":\"书画\",\"isImage\":false},{\"text\":\"评论\",\"isImage\":false},{\"text\":\"图片\",\"isImage\":false},{\"text\":\"汽车\",\"isImage\":false},{\"text\":\"教育\",\"isImage\":false},{\"text\":\"AI\",\"isImage\":false}],[{\"text\":\"体育\",\"isImage\":false},{\"text\":\"直播\",\"isImage\":false},{\"text\":\"奥运\",\"isImage\":false},{\"text\":\"冬奥\",\"isImage\":false},{\"text\":\"竞猜\",\"isImage\":false},{\"text\":\"VIP\",\"isImage\":false},{\"text\":\"中超\",\"isImage\":false},{\"text\":\"意甲\",\"isImage\":false},{\"text\":\"法甲\",\"isImage\":false},{\"text\":\"综合\",\"isImage\":false}],[{\"text\":\"视频频道\",\"isImage\":false},{\"text\":\"熊猫频道\",\"isImage\":false},{\"text\":\"直播中国\",\"isImage\":false},{\"text\":\"4K专区\",\"isImage\":false},{\"text\":\"VR浸新闻\",\"isImage\":false},{\"text\":\"小央视频\",\"isImage\":false},{\"text\":\"快看\",\"isImage\":false},{\"text\":\"现场\",\"isImage\":false},{\"text\":\"young计划\",\"isImage\":false},{\"text\":\"光华锐评\",\"isImage\":false},{\"text\":\"威虎堂\",\"isImage\":false},{\"text\":\"比划\",\"isImage\":false}],[{\"text\":\"CCTV.节目官网\",\"isImage\":false},{\"text\":\"直播\",\"isImage\":false},{\"text\":\"　看点\",\"isImage\":false},{\"text\":\"栏目\",\"isImage\":false},{\"text\":\"　片库\",\"isImage\":false},{\"text\":\"节目单\",\"isImage\":false},{\"text\":\"收视榜\",\"isImage\":false},{\"text\":\"主持人\",\"isImage\":false},{\"text\":\"上电视\",\"isImage\":false}],[{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528406440_814.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528390691_530.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528373534_317.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528352175_261.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/18/1605692190875_616.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528339414_210.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528320031_759.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528282486_251.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528267349_212.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528251924_387.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528234836_832.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528221284_111.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528202423_600.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528182081_974.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528110879_923.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605528095635_692.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/16/1605527797963_390.png\"},{\"text\":\"\",\"isImage\":true,\"imgsrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2020/12/31/1609429396236_320.png\"}]]}';
        /**
         * 一级导航数据填充
         * @param {*} wrap 
         * @param {*} data 
         */
        function NavDataFillFunc(wrap, data) {
            var liStr = '';
            data.nav.forEach((e) => {
                var txt = e.text ? '<a href="javascript:void(0)">' + e.text + '</a>' : "";
                var arrowStr = e.isGroup ? '<span class="arrow"></span>' : '';
                var hotStr = e.isHot ? '<span class="hot"></span>' : '';
                var className = '';
                var spanName = 'title';
                if (e.isBorder) {
                    className += 'line';
                }
                if (e.isGroup) {
                    className += ' normal';

                }
                if (e.isIcon) {
                    spanName = 'icon_btn';
                }
                liStr += '<li class="' + className + '"><span class="' + spanName + '">' + txt + arrowStr + hotStr + '</span></li>';
            });
            var navL = '<div class="logo"><a href="javascript:void(0)"><img src="' + data.logosrc + '"></a></div><ul class="nav_list">' + liStr + '</ul>';
            wrap.innerHTML = navL;
            secondNavFillDataFunc(wrap, JSON.parse(secondData));
            addHover();
            topSearchFunc();
        }
        /**
         * 搜索
         */
        function topSearchFunc() {
            var search_btn = $('#search_btn')[0];
            var top_input = $('#top_input')[0];
            search_btn.onclick = function () {
                var type = $('#search_sort')[0].innerText === "网页" ? "web" : "video";
                queryFunc(top_input.value, type);
            }
        }
        /**
         * 二级导航数据填充
         * @param {*} wrap 
         * @param {*} data 
         */
        function secondNavFillDataFunc(wrap, data) {
            var secondL = '';
            data.hoverList.forEach((e) => {
                secondL += '<div class="second"><div class="second_con">';
                e.forEach((e1, index) => {
                    if (index + 1 === e.length) {
                        secondL += '<ul class="last">';
                    }
                    else {
                        secondL += '<ul>';
                    }
                    e1.forEach((e) => {
                        if (e === "") {
                            secondL += '<li><a href="javascript:void(0)"><img src="	https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/18/1605690249449_273.png"></a></li>';
                        }
                        else {
                            secondL += '<li><a href="javascript:void(0)">' + e + '</a></li>';
                        }

                    });
                    secondL += '</ul>';
                });
                secondL += '</div></div>';
            });
            nav_listStr = fillNavFunc(JSON.parse(secondListData));

            wrap.innerHTML += '<div class="second_list">' + secondL + '<div class="second"><div class="second_con"><div class="search_box"><div class="search_con"><div class="search_sort_wrap"><p id="search_sort">网页</p><div class="selectList"style="display: none;"><a href="javascript:void(0)">网页</a><a href="javascript:void(0)">视频</a></div></div><div class="input"><input type="text"name="qtext"id="top_input"autocomplete="off"></div><div class="hot"><a href="javascript:void(0)">热搜榜</a></div><div class="btn_wrap"><input id="search_btn"type="button"></div></div></div></div></div><div class="second"><div class="second_con"><div class="login_wrap"><div class="login_inner"><div class="box"><div class="login_list"><div class="input_box"><div><input type="text"autocomplete="off"placeholder="账号"></div><div><input type="password"autocomplete="off"placeholder="密码"></div></div><div class="select_box"><span><input type="checkbox"></span><span>下次自动登录</span><a href="javascript:void(0)"class="forget">忘记密码</a></div><div class="btns_box"><a href="javascript:void"class="login_btn">登录</a><a href="javascript:void"class="register_btn">立即注册</a></div></div><div class="login_coop"><span>使用合作网站账号登录</span><span><a href="javascript:void(0)"><img title="微信"alt="微信"src="https://p5.img.cctvpic.com/photoAlbum/templet/common/DEPA1381197220279381/cooper_wx_141230.png"></a><a href="javascript:void(0)"><img src="https://p5.img.cctvpic.com/photoAlbum/templet/common/DEPA1381197220279381/cooper_qq_10886_140506.png"alt="QQ"title="QQ"></a><a href="javascript:void(0)"><img src="https://p1.img.cctvpic.com/photoAlbum/templet/common/DEPA1441519391707376/cooper_wb_13730_151019.png"alt="新浪网"title="新浪网"></a><a href="javascript:void(0)"><img src="https://p1.img.cctvpic.com/photoAlbum/templet/common/DEPA1456645307521846/zfb_14686_160513.png"alt="支付宝"title="支付宝"></a></span></div></div></div></div></div></div>' + nav_listStr + '</div>';
        }
        /**
         * 二级导航列表数据填充
         * @param {*} data 
         * @returns 
         */
        function fillNavFunc(data) {
            var titleList = '';
            data.titleList.forEach((e) => {
                titleList += '<li><a href="javascript:void(0)">' + e + '</a></li>';
            });
            var list_cont = '';
            data.content.forEach((e) => {
                list_cont += '<div><ul>';
                e.forEach((e1) => {
                    if (e1.isImage) {
                        list_cont += '<li><a href="javascript:void(0)"><img src="' + e1.imgsrc + '"></a></li>';
                    }
                    else {
                        list_cont += '<li><a href="javascript:void(0)">' + e1.text + '</a></li>';
                    }
                });
                list_cont += '</ul></div>';

            });
            var str = '<div class="second"><div class="second_con"><div class="title_list"><ul>' + titleList + '</ul></div><div class="list_con">' + list_cont + '</div></div></div>';
            return str;
        }
        /**
         * 悬浮事件
         */
        function addHover() {
            var indexArr = [0, 9, 10, 11];
            indexArr.forEach((e, index) => {
                navHoverEvent(e, index);
            });
            iconEventFunc();
            listHoverEvent();
        }
        /**
         * 二级列表悬浮事件
         */
        function listHoverEvent() {
            var lists = $('div.topnav_wrap_bg > div > div > div.second_list>div');
            lists.length = 4;
            var indexMap = [0, 9, 10, 11];
            lists.forEach((e, index) => {
                e.onmouseenter = function () {
                    var obj = $('div.topnav_wrap_bg >div>div>ul>li')[indexMap[index]];
                    obj && obj.onmouseenter && obj.onmouseenter();
                }
                e.onmouseleave = function () {
                    var obj = $('div.topnav_wrap_bg >div>div>ul>li')[indexMap[index]];
                    obj && obj.onmouseleave && obj.onmouseleave();
                }
            });
        }
        /**
         * 图标事件
         */
        function iconEventFunc() {
            var obj = $('div.topnav_wrap_bg > div > div > ul > li');
            //12,14,15
            obj[12].onclick = function () {
                var second_list = $('div.second_list>div')[4];
                second_list.style.cssText = "width:440px;";
                setTimeout(() => { second_list.style.overflow = "visible" }, 500);
            }
            obj[14].onclick = function () {
                var second_list = $('div.second_list>div')[5];
                if (parseFloat(second_list.style.height) > 0) {
                    second_list.style.cssText = "height:0px;overflow:hidden";
                    second_list.querySelector('.second_con').style.marginTop = -290 + "px";
                }
                else {
                    second_list.style.cssText = "height:290px;overflow:hidden";
                    second_list.querySelector('.second_con').style.marginTop = 0;
                }

            }
            obj[15].onclick = function () {
                var second_list = $('div.second_list>div')[6];
                if (parseFloat(second_list.style.height) > 0) {
                    second_list.style.cssText = "height:0px;overflow:hidden";
                    second_list.querySelector('.second_con').style.marginTop = -240 + "px";
                }
                else {
                    second_list.style.cssText = "height:246px;overflow:hidden";
                    second_list.querySelector('.second_con').style.marginTop = 0;
                }
            }
            document.body.onclick = function (e) {
                judgeHiddenSearchFunc(e);
                judgeHiddenLoginFunc(e);
                judgeHiddenListFunc(e);
            }
            /**
             * 判断是否隐藏搜索
             * @param {*} e 
             * @returns 
             */
            function judgeHiddenSearchFunc(e) {
                var search_out = $("div.topnav_wrap_bg > div > div > div.second_list > div:nth-child(5)")[0];
                var search_btn_out = $(' div.topnav_wrap_bg > div > div > ul > li:nth-child(13)')[0];
                var path = e && (e.path || (e.composedPath && e.composedPath()));
                if (e && path.includes(search_btn_out)) {
                    return;
                }
                if (e === null || !path.includes(search_out)) {
                    var second_list = $('div.second_list>div')[4];
                    if (parseFloat(second_list.style.width) > 0) {
                        $('div.search_sort_wrap')[0].onclick(null);
                        second_list.style.cssText = "width:0px;overflow:hidden;";
                    }
                }
            }
            /**
             * 判断是否隐藏登录
             * @param {*} e 
             * @returns 
             */
            function judgeHiddenLoginFunc(e) {
                var login_out = $("div.topnav_wrap_bg > div > div > div.second_list > div:nth-child(6)")[0];
                var login_btn_out = $(' div.topnav_wrap_bg > div > div > ul > li:nth-child(15)')[0];
                var path = e && (e.path || (e.composedPath && e.composedPath()));
                if (e && path.includes(login_btn_out)) {
                    return;
                }
                if (e === null || !path.includes(login_out)) {
                    var second_list = $('div.second_list>div')[5];
                    if (parseFloat(second_list.style.height) > 0) {
                        second_list.style.cssText = "height:0px;overflow:hidden";
                        second_list.querySelector('.second_con').style.marginTop = -290 + "px";
                    }
                }
            }
            /**
             * 判断是否隐藏列表
             * @param {*} e 
             * @returns 
             */
            function judgeHiddenListFunc(e) {
                var list_out = $("div.topnav_wrap_bg > div > div > div.second_list > div:nth-child(7)")[0];
                var list_btn_out = $(' div.topnav_wrap_bg > div > div > ul > li:nth-child(16)')[0];
                var path = e && (e.path || (e.composedPath && e.composedPath()));
                if (e && path.includes(list_btn_out)) {
                    return;
                }
                if (e === null || !path.includes(list_out)) {
                    var second_list = $('div.second_list>div')[6];
                    if (parseFloat(second_list.style.height) > 0) {
                        second_list.style.cssText = "height:0px;overflow:hidden";
                        second_list.querySelector('.second_con').style.marginTop = -240 + "px";
                    }
                }
            }
            changeSortFunc();
        }
        /**
         * 搜索更换选项
         */
        function changeSortFunc() {
            var obj = $('div.search_sort_wrap')[0];
            var opt = $('div.search_sort_wrap > div > a');
            var sort = $('#search_sort')[0];
            obj.onclick = function (e) {
                var wrap = this.querySelector('.selectList');
                if (wrap && wrap.style.display === "none") {
                    wrap.style.display = "block";
                }
                else {
                    wrap.style.display = "none";
                }
                if (!e) {
                    wrap.style.display = "none";
                }
            }
            opt.forEach((e) => {
                e.onclick = function () {
                    sort.innerText = this.innerText;
                }
            })
        }
        /**
         * 悬浮事件具体处理
         * @param {*} index 
         * @param {*} p 
         */
        function navHoverEvent(index, p) {
            var obj = $('div.topnav_wrap_bg >div>div>ul>li')[index];
            obj.onmouseenter = function () {
                hiddenAllFunc();
                var second_list = $('div.second_list>div')[p];
                this.classList.remove('normal');
                this.classList.add('rotate');
                second_list.style.cssText = "height:146px;overflow:hidden";
                second_list.querySelector('.second_con').style.marginTop = 0;
            }
            obj.onmouseleave = function () {
                var second_list = $('div.second_list>div')[p];
                this.classList.remove('rotate');
                this.classList.add('normal');
                second_list.style.cssText = "height:0px;overflow:hidden";
                second_list.querySelector('.second_con').style.marginTop = -146 + "px";
            }
        }
        /**
         * 隐藏所有
         */
        function hiddenAllFunc() {
            var obj = $('div.topnav_wrap_bg >div>div>ul>li');
            obj.forEach((e) => {
                e.onmouseleave && e.onmouseleave();
                document.body.onclick && document.body.onclick(null);
            });
        }
        NavDataFillFunc($('.topnav_wrap')[0], JSON.parse(topNavData));

    }
)();
//--------------》》》首页轮播
(function () {

    getData({
        callBack: function (opt) {
            let postData = (function (opt) {
                var dt = [];
                data.data.forEach(element => {
                    dt.push(element);
                });
                return dt;
            })(opt);
            fillData(postData);
        },
        url: "https://service-dxtrccme-1302998929.gz.apigw.tencentcs.com/release/charts"
    });
    //死数据
    // JSONStr = "[{\"title\":\"时政微纪录丨跨越23年的牵挂\",\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/27/1627341960945_187.jpg\"},{\"title\":\"联播+丨我比任何时候更懂你·最鲜亮的底色\",\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/26/1627269802212_893.jpg\"},{\"title\":\"国务院安委会、国家防总部署城市安全工作，重点强化这六方面！\",\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/27/1627358584607_833.jpg\"},{\"title\":\"独家口述！暴雨“大转移”后复诊，郑大一附院医生曝光抢险细节\",\"imgsrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/27/1627357794121_372.jpg\"},{\"title\":\"台风“烟花”来袭 威力多大？如何应对？\",\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/27/1627335321548_704.jpg\"},{\"title\":\"独家微纪录丨渡海登陆119高地\",\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/27/1627356811261_468.jpg\"},{\"title\":\"【微故事】“住”进车间的“宝藏女孩”\",\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/26/1627301575279_503.jpg\"},{\"title\":\"第7金！姜冉馨/庞伟夺得射击10米气手枪混合团体金牌\",\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/27/1627362000285_114.jpg\"},{\"title\":\"中国组合女子双人10米台夺金 正全景视频直播东京奥运会\",\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/27/1627369033741_308.jpg\"},{\"title\":\"【ai美食】酸奶拌馅儿蜂蜜和面 人气大麻花在家轻松做\",\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/26/1627301531419_644.jpg\"}]";
    // fillData(JSON.parse(JSONStr));

    /**
     * 填充数据
     * @param {*} 获取的数据对象
     */
    function fillData(data) {
        let len = data.length;
        let target = createNotes(len)
        for (let i = 0; i < len; i++) {
            //ajax获取的图片url缺少符号:-----已更正
            // target.imgObject[i].src = insertStr(data[i].imgsrc, ':', 6);
            //死数据的写法
            target.imgObject[i].src = data[i].imgsrc;
            target.titleObject[i].innerText = data[i].title;
        }
    }
    /**
     * 轮播图,创建节点
     * @param {number} length 
     * @returns img和a标签数组对象
     */
    function createNotes(length) {
        let slide_img = $('#slide_img')[0];
        let slide_title = $('#slide_title')[0];

        for (let i = 0; i < length; i++) {
            let slide_img_node = document.createElement('li');

            slide_img_node.innerHTML += '<a href="javascript:void(0)"><img /></a>';
            let slide_title_node = document.createElement('div');
            slide_title_node.className = "title_div";
            if (i === 0) {
                slide_title_node.className += " active";
            }
            slide_title_node.innerHTML += '<a href="javascript:void(0)"></a>';

            slide_img.appendChild(slide_img_node);
            slide_title.appendChild(slide_title_node);
        }
        slideFunc(slide_img, slide_title);
        return {
            imgObject: slide_img.getElementsByTagName('img'),
            titleObject: slide_title.getElementsByTagName('a')
        }
    }
    /**
     * 轮播图核心函数
     * @param {*} slide_img 
     * @param {*} slide_title 
     */
    function slideFunc(slide_img, slide_title) {
        let activeIndex = 0;
        let title_list = slide_title.children;
        slide_title.addEventListener("mouseover", function (e) {
            if (e.target.className.includes("title_div")) {
                title_list[activeIndex].classList.remove("active");
                e.target.className += " active";
                activeIndex = Array.prototype.indexOf.call(title_list, e.target);
                imgSlideStyleFunc(slide_img.children, activeIndex);
                e.stopPropagation();//阻止事件的冒泡
            }
        });
        //设置间隔调用和清除
        let timer = setInterval(() => {
            title_list[(activeIndex + 1) % title_list.length].dispatchEvent(new Event("mouseover", { bubbles: true }));
        }, 5000);
        $('.slide_wrap')[0].addEventListener("mouseleave", (e) => {
            timer = setInterval(() => {
                title_list[(activeIndex + 1) % title_list.length].dispatchEvent(new Event("mouseover", { bubbles: true }));
            }, 5000);
        });
        $('.slide_wrap')[0].addEventListener("mouseover", (e) => {
            timer && clearInterval(timer);
        });
    }
    /**
     * 轮播样式变化
     * @param {*} slide_list 
     * @param {*} activeIndex 
     */
    function imgSlideStyleFunc(slide_list, activeIndex) {
        Array.from(slide_list).forEach((e, index) => {
            if (index === activeIndex) {
                e.style.cssText = "z-index:2;opacity:1;";
            }
            else {
                e.style.cssText = "z-index:1;opacity:0;";
            }
        });

    };
})();
//----------》》》要闻 news
(function () {

    newsData = '{\"left\":{\"head\":{\"title\":\"习近平“七一”重要讲话中的党史｜北伐战争篇\",\"list\":[{\"att\":\"联播+\",\"text\":\"建军百年奋斗目标 习近平指明方向\"},{\"att\":\"快评\",\"text\":\"确保如期实现建军一百年奋斗目标\"}]},\"middle\":[{\"left\":[{\"isTitle\":true,\"text\":\"正告美方：反中乱港图谋注定失败\"},{\"isTitle\":false,\"text\":\"国家发改委：确保重要民生商品供应充足、价格稳定\"},{\"isTitle\":false,\"text\":\"今年前7月全国发生地质灾害2042起 8月仍是关键期\"},{\"isTitle\":false,\"text\":\"十部门联合部署开展打击新闻敲诈和假新闻专项行动\"},{\"isTitle\":false,\"text\":\"禁止驶入！南海部分海域6日至10日将进行军事训练\"},{\"isTitle\":true,\"text\":\"我国现有疫苗仍有良好预防和保护作用\"},{\"isTitle\":false,\"text\":\"北京：重大突发事件最迟应5小时内向社会发布信息\"},{\"isTitle\":false,\"text\":\"南京鼓楼区一小区降为低风险地区 今有7名患者出院\"},{\"isTitle\":false,\"text\":\"海南海口4个区今日在这些地方设置临时核酸采样点\"}],\"right\":{\"pic\":[{\"imgsrc\":\"https://p2.img.cctvpic.com/photoworkspace/2021/08/06/2021080608081174802.jpg\",\"text\":\"中央美院确诊教授辟谣出轨传闻\",\"textBots\":\"社会新闻\"},{\"imgsrc\":\"https://p1.img.cctvpic.com/photoworkspace/2021/08/06/2021080604555938465.jpg\",\"text\":\"网红感染去世背后，抽脂乱象有多少？\",\"textBots\":\"社会新闻\"}],\"list\":[{\"isTitle\":true,\"text\":\"我科学家揭开红超巨星参宿四致暗之谜\"},{\"isTitle\":false,\"text\":\"江苏省90个高速公路收费站出口或入口暂时关闭\"},{\"isTitle\":false,\"text\":\"辽宁大连一市场发生火情 明火已扑灭 无人员伤亡\"}]}},{\"left\":{\"pic\":[{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/6/1628206489044_783.jpg\",\"text\":\"菲律宾多位学者发起请愿 呼吁调查德堡实验室\",\"textBots\":\"国际新闻\"},{\"imgsrc\":\"https://p1.img.cctvpic.com/photoworkspace/2021/08/06/2021080609132277763.jpg\",\"text\":\"距日本货轮触礁漏油已有一年 毛里求斯伤痕仍存\",\"textBots\":\"国际新闻\"}]},\"right\":[{\"isTitle\":true,\"text\":\"世卫组织数据：全球累计确诊超2亿例\"},{\"isTitle\":false,\"text\":\"应对确诊病例激增 日本扩大防疫限制措施实施范围\"},{\"isTitle\":false,\"text\":\"层出不穷！美再现种族歧视暴力执法事件 视频公布\"},{\"isTitle\":false,\"text\":\"希腊正面临多起山火 该国总理表示形势“极其危急”\"},{\"isTitle\":false,\"text\":\"科学家警告：忽视气候变化将带来“难以言表的痛苦”\"}]}],\"hot\":{\"mhb\":{\"heats\":[\"学习强国\",\"德耀中华\",\"AI新闻+\",\"8点见\"],\"title\":\"热点专题\"},\"mbd\":{\"img\":[\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/2/2/1612252363904_927.jpg\",\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/6/25/1624616188521_718.jpg\",\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/6/26/1624670728221_92.jpg\",\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/4/1628082735307_455.jpg\"],\"hover\":[\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/1/20/1611129881927_440.jpg\",\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/6/25/1624616191146_77.jpg\",\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/6/26/1624670366827_287.jpg\",\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/4/1628082739006_74.jpg\"]}}},\"right\":[{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/5/1628165423103_895.jpg\",\"option\":\"广东搭建市场体系 助推特色农产品优质优价\",\"col\":\"新闻联播\"},{\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/5/1628165477023_497.jpg\",\"option\":\"掌舵定向新征程\",\"col\":\"焦点访谈\"},{\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/6/1628221904321_508.jpg\",\"option\":\"全球累计新冠确诊病例超2亿例\",\"col\":\"新闻直播间\"},{\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/6/1628218240896_54.jpg\",\"option\":\"美国新冠确诊和死亡病例全球居首\",\"col\":\"中国新闻\"},{\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/6/1628218376596_168.jpg\",\"option\":\"北京：原家庭住房套数超限购 离婚3年内不得买房\",\"col\":\"第一时间\"},{\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/6/1628218457223_81.jpg\",\"option\":\"南京9个区开展第五轮核酸检测\",\"col\":\"朝闻天下\"},{\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/6/1628218529314_506.jpg\",\"option\":\"西班牙巴塞罗那俱乐部：梅西将离开球队\",\"col\":\"正点财经\"}]}';
    /**
     * 要闻左边数据填充
     * @param {*} wrap 
     * @param {*} data 
     */
    function newsLeftFillDataFunc(wrap, data) {
        var l = data.left;
        var conList = commonListFunc(l.middle[0].left);
        var conList2 = commonListFunc(l.middle[0].right.list);
        var conList3 = commonListFunc(l.middle[1].right);
        var ulShowStr = commonUlShowFunc(l.middle[0].right.pic, { 1: true }, null);
        var ulShowStr2 = commonUlShowFunc(l.middle[1].left.pic, { 1: true }, null);
        var titleStr = titleFunc(l.hot.mhb);
        var imgStr = '';
        var hoverStr = '';
        Array.from(l.hot.mbd.img).forEach((e, index) => {
            imgStr += '<li><img data-src="' + e + '" data-index="' + index + '"></li>';
        });
        Array.from(l.hot.mbd.hover).forEach((e, index) => {
            var liName = 'imgl';
            if (index > 1) {
                liName = 'imgr';
            }
            hoverStr += '<li class="' + liName + '"><a href="javascript:void(0)"><img data-src="' + e + '"></a></li>';
        })

        var str = '<div class="top_wrap"><div class="news_top"><h2><a href="javascript:void(0)">' + l.head.title + '</a></h2><ul><li><span><a href="javascript:void(0)">' + l.head.list[0].att + '</a></span><a href="javascript:void(0)">' + l.head.list[0].text + '</a></li><li class="last"><span><a href="javascript:void(0)">' + l.head.list[1].att + '</a></span><a href="javascript:void(0)">' + l.head.list[1].text + '</a></li></ul></div></div><div class="con"><div class="con_l"><div class="common_list"><ul>' + conList + '</ul></div></div><div class="con_r"><div class="common_list"><ul>' + conList2 + '</ul></div><div class="common_show common_card">' + ulShowStr + '</div></div></div><div class="con"><div class="con_l"><div class="common_show common_card">' + ulShowStr2 + '</div></div><div class="con_r"><div class="common_list"><ul>' + conList3 + '</ul></div></div></div><div class="common_main"><div class="banner">' + titleStr + '</div><div class="main_part"><div class="inner_wrap"><div class="hotspot"><ul class="img_wrap">' + imgStr + '</ul><ul class="hoverImg">' + hoverStr + '</ul></div></div></div></div>';
        wrap.innerHTML = str;
    };

    /**
     * 要闻右边数据填充
     * @param {*} wrap 
     * @param {*} data 
     */
    function newsRightFillDataFunc(wrap, data) {
        var r = data.right;
        var listStr = '<ul>';
        r.forEach((e) => {
            listStr += '<li><div class="img"><a href="javascript:void(0)"><img data-src="' + e.imgsrc + '"></a></div><div class="title"><div class="twrap"><p><a href="javascript:void(0)">' + e.option + '</a></p></div><p class="icon"><a href="javascript:void(0)">' + e.col + '</a><p></div></li>';
        });
        listStr += '</ul>';
        wrap.innerHTML = listStr;
    };

    /**
     * 要闻列表函数
     * @param {*} data 
     * @returns 
     */
    function commonListFunc(data) {
        var temps = '';
        Array.from(data).forEach((e) => {
            var nameStr = '';
            if (e.isTitle) {
                nameStr = 'sp';
            }
            temps += '<li class="' + nameStr + '"><a href="javascript:void(0)">' + e.text + '</a></li>';
        });
        return temps;
    };

    /**
     * 标题函数
     * @param {*} data 
     */
    function titleFunc(data) {
        let str = '';
        Array.from(data.heats).forEach((e) => {
            str += '<a href="javascript:void(0)">' + e + '</a>';
        });
        return '<span class="title">' + data.title + '</span><span class="heat">' + str + '</span>';
    };
    /**
     * 通用列表展示函数
     * @param {*} wrap 
     * @param {*} data {imgsrc: "", text: "清除昨日的烦恼，开启今天的快乐", textBots: Array(2)}
     */
    function commonUlShowFunc(data, last, specialSize) {
        let str = '<ul>';
        Array.from(data).forEach((e, index) => {
            let botStr = '';
            let nameStr = '';
            botStr += '<a href="javascript:void(0)">' + e.textBots + '</a>';
            if (specialSize && specialSize[index] === true) {
                nameStr = "minRight";
            }
            if (last && last[index] === true) {
                nameStr = "last"
            }
            str += '<li class="' + nameStr + '"><div class="img"><a href="javascript:void(0)"><img data-src="' + e.imgsrc + '"></a></div><div class="text"><a href="javascript:void(0)">' + e.text + '</a><div class="text_bottom">' + botStr + '</div></div></li>';
        })
        str += '</ul>';
        return str;
    };
    /**
     * 要闻数据填充
     * @param {*} data 
     */
    function newsFillFunc(data) {
        newsLeftFillDataFunc($('#news .main_l')[0], data);
        newsRightFillDataFunc($('#news .main_r .con')[0], data);
    };

    newsFillFunc(JSON.parse(newsData));

    function newsHoverFunc() {

        var obj = $('#news ul.img_wrap li');
        var wrap = $('#news .hotspot')[0];
        var Ohover = $('#news  ul.hoverImg>li');

        Array.from(obj).forEach((e, index) => {
            e.onmouseenter = function () {
                Array.from(Ohover).forEach((e) => {
                    e.style.cssText = "";
                });
                Ohover[index].style.display = 'block';
                if (index > 1) {
                    myAnimate(Ohover[index], { 'right': 0 }, 20)
                }
                else {
                    myAnimate(Ohover[index], { 'left': 0 }, 20)
                }
            };
        });
        wrap.onmouseleave = function () {
            Array.from(Ohover).forEach((e) => {
                fadeOut(e, 4, function () {
                    e.style.display = "none";
                });
            });
        };
    };
    newsHoverFunc();
})();
//-----------》》》品质活动 quality
(function () {
    qualityShowData = '[{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/2/5/1612502798496_142.jpg\",\"text\":\"好品中国计划\\n好品中国 品质生活\",\"textBots\":[]},{\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/25/1606287327483_36.jpg\",\"text\":\"人人都爱中国造\\n支持国货 赋能品牌\",\"textBots\":[]},{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/26/1606354719585_764.jpg\",\"text\":\"“博潮”大会\\n品牌·文创盛会\",\"textBots\":[]},{\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/26/1606354691611_679.jpg\",\"text\":\"数字样板间智敬中国\\n记录行业企业成长\",\"textBots\":[]},{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/25/1606287360756_933.jpg\",\"text\":\"“开城相见”公益直播\\n地域文旅新名片\",\"textBots\":[]}]';
    qualityTitleData = '{\"title\":\"品质活动\",\"heat\":[\"冬奥频道\",\"广州国际美食节\",\"云上音乐厅\"]}';
    /**
     * 标题函数
     * @param {*} data 
     */
    function titleFunc(wrap, data) {
        let str = '';
        Array.from(data.heat).forEach((e) => {
            str += '<a href="javascript:void(0)">' + e + '</a>';
        });
        wrap.innerHTML = '<span class="title">' + data.title + '</span><span class="heat">' + str + '</span>';
    }
    /**
     * 通用列表展示函数
     * @param {*} wrap 
     * @param {*} data {imgsrc: "", text: "清除昨日的烦恼，开启今天的快乐", textBots: Array(2)}
     */
    function commonUlShowFunc(wrap, data, last, specialSize) {
        let str = '<ul>';
        Array.from(data).forEach((e, index) => {
            let botStr = '';
            let nameStr = '';
            Array.from(e.textBots).forEach((e1) => {
                botStr += '<a href="javascript:void(0)">' + e1 + '</a>';
            });
            if (specialSize && specialSize[index] === true) {
                nameStr = "minRight";
            }
            if (last && last[index] === true) {
                nameStr = "last"
            }
            str += '<li class="' + nameStr + '"><div class="img"><a href="javascript:void(0)"><img data-src="' + e.imgsrc + '"></a></div><div class="text"><a href="javascript:void(0)">' + e.text.replace('\n', '<br/>') + '</a></div></li>';
        })
        str += '</ul>';
        wrap.innerHTML = str;
    }
    titleFunc($('#quality .banner')[0], JSON.parse(qualityTitleData));
    commonUlShowFunc($('#quality .common_show')[0], JSON.parse(qualityShowData), { 4: true }, null);
})();

//-----------》》》》精彩导视 guide
(
    function () {
        var wrap = $('#guide .chess_con')[0];
        for (var i = 0; i < 38; i++) {
            var divEle = document.createElement('div');
            var spanEle = document.createElement('span');
            divEle.appendChild(spanEle);
            wrap.appendChild(divEle);
        }
    }
)();

//-----------》》》》视频 flv
(
    function () {
        flvTitleData = '{\"title\":\"视频\",\"heat\":[{\"text\":\" 小央视频\",\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/17/1605609010464_983.png\"},{\"text\":\" 新时代·瞰百城\",\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/5/24/1621842338195_768.jpg\"},{\"text\":\" 直播中国\",\"imgsrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/1/19/1611049457869_276.png\"}],\"option\":\"更多>\"}';
        flvVideoData = '{\"mp4\":\"https://p2.img.cctvpic.com/uploadimg/mp4/2021/07/30/PNdLTtNzjFS51sszLVVz210730.mp4\",\"title\":\"如果祖国需要 我义无反顾\",\"img\":\"https://p2.img.cctvpic.com/apple3g/www/upload/image/20210730/1627629509385049718.jpg\"}';
        flvRightShowData = '[{\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/30/1627630146279_240.jpg\",\"text\":\"数架直升机依次升空 海南舰最新训练现场来了！\",\"textBots\":[\"威虎堂\"]},{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/30/1627630188239_616.jpg\",\"text\":\"“祝融号”火星越野 4亿公里外怎么收图？\",\"textBots\":[\"现场\"]},{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/30/1627630222526_263.jpg\",\"text\":\"“低保”不再区分城市农村！统一规范为“最低生活保障”\",\"textBots\":[\"现场\"]}]';
        flvLastShowData = '[{\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627716752042_753.jpg\",\"text\":\"这个新兴奥运项目 中国拿到了最多的奖牌\",\"textBots\":[\"现场\"]},{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627716729705_63.jpg\",\"text\":\"央视探访珠宝国检实验室 真假钻石这样分辨！\",\"textBots\":[\"现场\"]},{\"imgsrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627716777525_832.jpg\",\"text\":\"“北斗导航”有多厉害？地面虚线实线都给你标出来！\",\"textBots\":[\"威虎堂\"]},{\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627716709017_769.jpg\",\"text\":\"太空惊魂！国际空间站对接新舱突发意外\",\"textBots\":[\"现场\"]},{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627716691911_472.jpg\",\"text\":\"何冰娇逆转日本头号选手 奥原希望：我接不住她的重杀\",\"textBots\":[\"现场\"]}]';
        flvChannelData = '[{\"bgSrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/5/21/1621579520692_768.jpg\",\"imgSrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/5/21/1621579530943_768.png\",\"title\":\"新兵请入列\",\"text\":\"00后新兵脱胎换骨全过程\"},{\"bgSrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/13/1605267730468_833.jpg\",\"imgSrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/17/1605580308574_750.png\",\"title\":\"前线\",\"text\":\"我们用不同的视角解释世界\"},{\"bgSrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/13/1605267735688_951.jpg\",\"imgSrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/17/1605580379791_463.png\",\"title\":\"比划\",\"text\":\"解释热点，分享知识，演绎流行\"},{\"bgSrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/17/1605580931326_554.jpg\",\"imgSrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/17/1605580928735_418.png\",\"title\":\"人人都爱中国造\",\"text\":\"助力企业复工复产 为中国品牌代言\"},{\"bgSrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2020/12/16/1608081014287_7.jpg\",\"imgSrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/12/16/1608080204993_996.png\",\"title\":\"威虎堂\",\"text\":\"年轻化的军事科普类短视频栏目\"}]';

        flvTitleFunc($('#flv  div.banner')[0], JSON.parse(flvTitleData));
        flvVideoData = JSON.parse(flvVideoData);
        flvFormData = {
            'wrap': $('#flv .video_show')[0],
            'mp4': flvVideoData.mp4,
            'img': flvVideoData.img,
            'title': flvVideoData.title
        }
        videoShowFunc(flvFormData);
        flvChannelFunc($('#flv .card')[0], JSON.parse(flvChannelData), { 4: true }, { 0: true, 1: true });
        //模板列表
        commonUlShowFunc($('#flv div.common_show.fr')[0], JSON.parse(flvRightShowData), { 2: true }, { 1: true });
        commonUlShowFunc($('#flv > div > div.main_part > div > div:nth-child(5)')[0], JSON.parse(flvLastShowData), { 4: true }, { 0: true, 1: true });
    }
)();

function flvChannelFunc(wrap, data, last, specialData) {
    let str = '<ul>';
    data.forEach((e, index) => {
        let name = '';
        if (last[index] === true) {
            name = 'last'
        }
        if (specialData[index] === true) {
            name = 'minRight';
        }
        str += '<li class="' + name + '"><div class="bg"><img data-src="' + e.bgSrc + '"></div><div class="img"><a href="javascript:void(0)"><img data-src="' + e.imgSrc + '"></a></div><div class="text"><h3><a href="javascript:void(0)">' + e.title + '</a></h3><p><a href="javascript:void(0)">' + e.text + '</a></p></div></li>';
    });
    str += '</ul>';
    wrap.innerHTML = str;
}
/**
 * 视频标题函数
 * @param {*} data 
 */
function flvTitleFunc(wrap, data) {
    let str = '';
    Array.from(data.heat).forEach((e) => {
        str += '<a href="javascript:void(0)"><span><img data-src="' + e.imgsrc + '"></span>' + e.text + '</a>';
    });
    wrap.innerHTML = '<span class="title">' + data.title + '</span><span class="option"><a href="javascript:void(0)">' + data.option + '</a></span><span class="heat">' + str + '</span>';
}


//----------窗口监听
var w_flag = window.innerWidth <= 1417 ? true : false;

window.addEventListener('resize', function () {
    let w = window.innerWidth;
    if (w <= 1417 && w_flag === false) {
        w_flag = true;
        acc_initialize();//手风琴初始化
    }
    else if (w > 1417 && w_flag === true) {
        w_flag = false;
        acc_initialize();//手风琴初始化
    }
});

//----------》》》手风琴
accordionIconTextData = '[\"直播专题\",\"短视频\",\"短视频\",\"直播专题\",\"直播专题\",\"正在直播\",\"正在直播\",\"直播专题\",\"正在直播\"]';
getData(
    {
        url: "https://service-dxtrccme-1302998929.gz.apigw.tencentcs.com/release/accordin",
        callBack: function (data) {
            accordionFillData($('.accordion_wrap')[0], data.data, JSON.parse(accordionIconTextData));
        }
    }
);

/**
 * 手风琴数据填充
 * @param {*} wrap 
 * @param {*} data 
 */
function accordionFillData(wrap, data, iconTextData) {
    let str = '';
    Array.from(data).forEach((e, index) => {
        str += '<div class="item"><img data-src="' + e.imgsrc + '"><div class="title_wrap"><div class="title_bg"><span>' + e.title + '</span></div></div><div class="show_wrap"><span class="tiny_img">' + iconTextData[index] + '</span><a href="javascript:void(0)"class="text"><span class="text_title">' + e.textTitle + '</span><span class="summary">' + e.text + '</span></a></div></div>';
    });
    wrap.innerHTML = str;
    acc_initialize();
    addEventFunc();
}
/**
 * 添加事件
 */
function addEventFunc() {
    let now = 0;
    Array.from($('.accordion_wrap .item .title_wrap')).forEach(function (e, index) {
        e.onmouseenter = function () {
            accordionAnimation(now, index);
            now = index;
        };
    })
}
/**
 * 手风琴初始化
 */
function acc_initialize() {
    $('.accordion_wrap')[0].style.cssText = "pointer-events: none;";
    let acc_items = $('.accordion_wrap .item');
    let itemW = 444;
    let ed = 82;
    if (!w_flag) {
        itemW = 480;
        ed = 90;
    }
    Array.from(acc_items).forEach((e, index) => {
        if (index) {
            e.style.cssText = "left:" + (itemW + ed * (index - 1)) + "px;" + "z-index:" + (index + 1);
            e.classList.remove('cur');
            if (index + 1 === acc_items.length) {
                $('.accordion_wrap')[0].style.cssText = "";
            }
        }
        else {
            e.style.cssText = "left:0;z-index:1";
            e.classList.add('cur');
            $('.accordion_wrap .item .title_wrap')[0].onmouseenter && $('.accordion_wrap .item .title_wrap')[0].onmouseenter();
        }
    });
}
/**
 * 手风琴动画
 */
function accordionAnimation(old_index, new_index) {
    let obj = $('.accordion_wrap .item');
    let itemW = 444;
    let ed = 82;
    let acc_wrap_w = $('.accordion_wrap')[0].offsetWidth;
    if (!w_flag) {
        itemW = 480;
        ed = 90;
    }
    obj[old_index].classList.remove('cur');
    obj[new_index].classList.add('cur');
    if (new_index > old_index) {
        for (let index = old_index + 1; index <= new_index; index++) {
            obj[index].style.left = (ed * index) + "px";
        }
    }
    else {
        for (let index = old_index; index > new_index; index--) {
            obj[index].style.left = (acc_wrap_w - (obj.length - index) * ed) + "px";
        }
    }
}
//------------》》》军事
(
    function () {
        militaryTitleData = '{\"title\":\"军事\",\"heat\":[\"军情时间到\",\"军事科技\",\"军事纪实\",\"军事报道\"],\"option\":\"更多>\"}';
        militaryVideoData = '{\"mp4\":\"https://p3.img.cctvpic.com/uploadimg/mp4/2021/07/31/l5KNFKEO7ZYXOSdWbcCL210731.mp4\",\"title\":\"海军战机雨中升空 穿云破雾锤炼过硬技能\",\"img\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627702323453_247.jpg\"}';
        militaryLeftDownData = '[{\"imgsrc\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627707199659_224.jpg\",\"text\":\"中国海警赴北太平洋公海开展渔业执法巡航\",\"textBots\":[\"正午国防军事\"]},{\"imgsrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627706040008_871.jpg\",\"text\":\"影像志 林宇辉：为烈士画像 让亲人“相见”\",\"textBots\":[\"国防军事早报\"]}]';
        militaryRightData = '[{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627705738183_951.jpg\",\"text\":\"辽宁辽阳：整合军地资源 精准对接部队战时需求\",\"textBots\":[\"军事报道\"]},{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627702873076_653.jpg\",\"text\":\"一座“活界碑” 拳拳爱国情——“七一勋章”获得者魏德友\",\"textBots\":[\"国防故事\"]},{\"imgsrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627702710338_136.jpg\",\"text\":\"重走古战场 到底哪里才是真正的赤壁古战场呢？\",\"textBots\":[\"军事纪录\"]},{\"imgsrc\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627703011271_288.jpg\",\"text\":\"台当局妄图造舰“反航母” 拜登政府在策划大国“热战”？\",\"textBots\":[\"防务新观察\"]},{\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627703088407_734.jpg\",\"text\":\"从“米兰”到MMP反坦克导弹\",\"textBots\":[\"兵器面面观\"]},{\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/31/1627705178620_316.jpg\",\"text\":\"新式武器造成了大规模的恐慌与难以忘却的苦痛\",\"textBots\":[\"世界战史\"]}]';
        //标题
        titleFunc($('#military .banner')[0], JSON.parse(militaryTitleData));
        //视频
        militaryVideoData = JSON.parse(militaryVideoData);
        militaryFormData = {
            'wrap': $('#military .video_show')[0],
            'mp4': militaryVideoData.mp4,
            'img': militaryVideoData.img,
            'title': militaryVideoData.title
        }
        videoShowFunc(militaryFormData);
        //模板列表
        commonUlShowFunc($('#military .down_part')[0], JSON.parse(militaryLeftDownData), { 1: true });
        commonUlShowFunc($('#military .common_right_wrap')[0], JSON.parse(militaryRightData), { 2: true, 5: true });
    }
)();

//-------------》》》体育
//{title: "熊猫频道", heat: Array(3), option: "更多>"}
sportTitleData = '{\"title\":\"体育\",\"heat\":[\"奥运会\",\"冬奥会\",\"NBA\",\"国际足球\",\"中超\",\"意甲\",\"法甲\",\"CCTV5直播\",\"CCTV5+直播\"],\"option\":\"更多>\"}';
sportVideoData = '{\"mp4\":\"https://p1.img.cctvpic.com/uploadimg/mp4/2021/07/30/GI8QczOF40w4L225kzLF210730.mp4\",\"title\":\"乒乓球男单决赛 马龙击败队友樊振东卫冕成功\",\"img\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/30/1627653046376_526.jpg\"}';
sportLeftDownData = '[{\"imgsrc\":\"https://p1.img.cctvpic.com/photoworkspace/2021/07/31/2021073110581975749.jpg\",\"text\":\"男女4乘100混中国队亚军 英国队打破世界纪录夺冠\",\"textBots\":[\"奥运会\"]},{\"imgsrc\":\"https://p5.img.cctvpic.com/photoworkspace/2021/07/31/2021073111171138579.jpg\",\"text\":\"遗憾！闫子贝赛后泣不成声：我们离冠军那么近\",\"textBots\":[\"奥运会\"]}]';
sportRightUpData = '[{\"imgsrc\":\"https://p4.img.cctvpic.com/photoworkspace/2021/07/31/2021073114271182022.jpg\",\"text\":\"东京奥运会男子蹦床董栋摘银 白俄罗斯名将夺金\",\"textBots\":[\"奥运会\"]},{\"imgsrc\":\"https://p1.img.cctvpic.com/photoworkspace/2021/07/31/2021073110142598880.jpg\",\"text\":\"巴赫给孙颖莎递水送手表 刘国梁：你俩聊啥了?\",\"textBots\":[\"奥运会\"]},{\"imgsrc\":\"https://p1.img.cctvpic.com/photoworkspace/2021/07/31/2021073110022484141.jpg\",\"text\":\"女800自决赛莱德基夺冠摘第二金 王简嘉禾获第五\",\"textBots\":[\"奥运会\"]}]';
titleFunc($('#sport .banner')[0], JSON.parse(sportTitleData));

function sportLeftFunc() {
    sportVideoData = JSON.parse(sportVideoData);
    sportFormData = {
        'wrap': $('#sport .video_show')[0],
        'mp4': sportVideoData.mp4,
        'img': sportVideoData.img,
        'title': sportVideoData.title
    };
    videoShowFunc(sportFormData);
    commonUlShowFunc($('#sport .down_part')[0], JSON.parse(sportLeftDownData), { 1: true });
}
sportLeftFunc();
//--------------体育比赛展示
getData({
    url: 'https://cbs-u.sports.cctv.com/pc/game/home_list',
    data: {
        't': getNowTimeStamp(),
        'client': 'pc'
    }
    ,
    callBack: function (data) {
        data.results.length = 10;
        sportBlockNavFunc($('#sport  div.sport_nav')[0], data.results);
        sportInfoShowFunc($('#sport div.list_wrap')[0], data.results[0].list);
    }
});

function sportBlockNavFunc(wrap, data) {
    let str = '<ul>';
    Array.from(data).forEach((e, index) => {
        let name = '';
        if (index === 0) {
            name = 'active';
        }
        str += '<li class="' + name + '"><span>' + e.league + '</span></li>';
    });
    str += '</ul>';
    wrap.innerHTML = str;
    sportNavSelectFunc();
}
/**
 * 体育导航
 */
function sportNavSelectFunc() {
    let wrap = $("#sport  div.sport_nav > ul")[0];
    let lists = wrap.children;
    let cur = 0;
    wrap.addEventListener("click", (e) => {
        let index = Array.prototype.indexOf.call(lists, e.target.parentElement);
        if (e.target.tagName === "SPAN" && index !== cur) {
            lists[cur].className = "";
            lists[index].className = "active";
            sportInfoShowFunc($('#sport div.list_wrap')[0], data.results[index].list);
            cur = index;
        }
    });
}
var imgBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAMCAYAAABvEu28AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGtmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOS0wMS0xMVQxMTo1NTowOCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wMS0xNlQxNzo0NDo0NyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTktMDEtMTZUMTc6NDQ6NDcrMDg6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDVhYjM4YWQtZTkwOS1iMTRkLWE5NDQtYjdmZTBkZjYzZDNhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTNhZjJlZjEtMjljMC0xMDRmLWEyZmYtNTZlYmNkOGJmODFhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MThjYTliOWMtMzNjMy0xYzRlLTgwOGItMzU3ZTMwZDE4ZDBkIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOGNhOWI5Yy0zM2MzLTFjNGUtODA4Yi0zNTdlMzBkMThkMGQiIHN0RXZ0OndoZW49IjIwMTktMDEtMTFUMTE6NTU6MDgrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjEzZDNiYmY5LWU0OGMtZWE0Zi04ODQ2LWViYTY3YWE2ZGQxMCIgc3RFdnQ6d2hlbj0iMjAxOS0wMS0xMVQxMTo1NTowOCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDVhYjM4YWQtZTkwOS1iMTRkLWE5NDQtYjdmZTBkZjYzZDNhIiBzdEV2dDp3aGVuPSIyMDE5LTAxLTE2VDE3OjQ0OjQ3KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsgFpiEAAABfSURBVCgVYzgoK8QMxP1A/BWI/5OIvwBxL8gMBiBRT4YB6LgaZNBzKhj0mAGP5BUgbgDiP8QYhs+gC0AMkjcB4uvUMAiEOaAR8m9QGATy2g1KvEZyYFMt+qmWIKmSRQBkRYyllBjbgQAAAABJRU5ErkJggg==';

var sportNowData;
/**
 * 体育展示函数
 * @param {*} wrap 
 * @param {*} data 
 */
function sportInfoShowFunc(wrap, data) {
    sportNowData = data;
    let str = '';
    let offset = 0;
    Array.from(data).forEach((e) => {
        let imgStr = '<img src="' + imgBase64 + '">';
        let timeStr = '';
        let scoreStr = '';
        if (e.subStatus === 100) {
            offset++;
        }
        if (e.appStatusDesc === '图文/数据' || e.appStatusDesc === '图文直播') {
            imgStr = '';
        }
        if (e.statusDesc === "未开始") {
            timeStr = `<div class="date">${new Date(e.startTime).Format('MM月dd日')}</div><div class="time">${new Date(e.startTime).Format('hh:mm')}</div>`;
        }
        else {
            scoreStr = `<div class="score">${e.homeScore}:${e.guestScore}</div>`;
        }
        str += `<li><a href="javascript:void(0)"><div class="up"><div>${e.leagueName} ${e.gameRound}</div></div><div class="middle"><div class="team"><div class="img"style='background-image: url("${e.homePicUrl}"); background-position: center center; background-repeat: no-repeat; background-size: contain; '></div><div class="name">${e.homeName}</div></div><div class="info">${timeStr}<div class="status">${e.statusDesc}</div>${scoreStr}</div><div class="team"><div class="img"style='background-image: url("${e.guestPicUrl}"); background-position: center center; background-repeat: no-repeat; background-size: contain; '></div><div class="name">${e.guestName}</div></div></div><div class="down"><div class="replay">${imgStr}<span>${e.appStatusDesc}</span></div></div></a></li>`;
    });

    if ((offset - 1) > (data.length - 3)) {
        offset = data.length - 2;
    }
    str = '<ul style="transform: translateX(-' + $('#sport div.sport_show  div.list_wrap')[0].offsetWidth * (offset - 1) / 3 + 'px);">' + str + '</ul>';
    wrap.innerHTML = str;
    setWidthFunc();
    sportClickFunc();
    $('#sport div.list_wrap ul')[0].offsetData = offset - 1;
    if (offset - 1 === data.length - 3) {
        nextDisabledFunc(true);
    }
    else {
        nextDisabledFunc(false);
    }
    if (offset - 1 === 0) {
        prevDisabledFunc(true);
    }
    else {
        prevDisabledFunc(false);
    }
}
/**
 * 默认水平移动距离
 * @param {*} wrap 
 */
function tranFunc(wrap) {
    let offset = 0;
    Array.from(sportNowData).forEach((e) => {
        if (e.subStatus === 100) {
            offset++;
        }
    });
    if ((offset - 1) > (sportNowData.length - 3)) {
        offset = sportNowData.length - 2;
    }
    wrap.style.cssText = "transform:translateX(-" + $('#sport div.sport_show  div.list_wrap')[0].offsetWidth * (offset - 1) / 3 + "px)";
    wrap.offsetData = offset - 1;
    if (offset - 1 === sportNowData.length - 3) {
        nextDisabledFunc(true);
    }
    else {
        nextDisabledFunc(false);
    }
    if (offset - 1 === 0) {
        prevDisabledFunc(true);
    }
    else {
        prevDisabledFunc(false);
    }
}
/**
 * 体育展示点击切换函数
 */
function sportClickFunc() {
    let prevBtn = $('#sport  span.arrow_prev')[0];
    let nextBtn = $('#sport  span.arrow_next')[0];
    let Oul = $('#sport div.list_wrap ul')[0];
    prevBtn.onclick = () => {
        let dataLen = sportNowData.length - 3;
        let nowOffset = Oul.offsetData;
        if (nowOffset > 0) {
            if (nowOffset > 3) {
                Oul.style.cssText = "transform:translateX(-" + $('#sport div.sport_show  div.list_wrap')[0].offsetWidth * (nowOffset - 3) / 3 + "px)";
                Oul.offsetData = nowOffset - 3;
            }
            else {
                Oul.style.cssText = "transform:translateX(-" + $('#sport div.sport_show  div.list_wrap')[0].offsetWidth * 0 / 3 + "px)";
                Oul.offsetData = 0;
            }
            if (Oul.offsetData === 0) {
                prevDisabledFunc(true);
            }
            if (Oul.offsetData < dataLen) {
                nextDisabledFunc(false);
            }
        }
    };
    nextBtn.onclick = () => {
        let dataLen = sportNowData.length - 3;
        let nowOffset = Oul.offsetData;
        if (nowOffset < dataLen) {
            if (dataLen - nowOffset >= 3) {
                Oul.style.cssText = "transform:translateX(-" + $('#sport div.sport_show  div.list_wrap')[0].offsetWidth * (nowOffset + 3) / 3 + "px)";
                Oul.offsetData = nowOffset + 3;
            }
            else {
                Oul.style.cssText = "transform:translateX(-" + $('#sport div.sport_show  div.list_wrap')[0].offsetWidth * (dataLen) / 3 + "px)";
                Oul.offsetData = dataLen;
            }
            if (Oul.offsetData === dataLen) {
                nextDisabledFunc(true);
            }
            if (Oul.offsetData > 0) {
                prevDisabledFunc(false);
            }
        }
    };
}
/**
 * 是否禁止上一个点击样式函数 
 * @param {*} flag 
 */
function prevDisabledFunc(flag) {
    let prevBtn = $('#sport  span.arrow_prev')[0];
    if (flag) {
        prevBtn.style.cursor = "not-allowed";
        prevBtn.style.opacity = 0.3;
    }
    else {
        prevBtn.style.cursor = "pointer";
        prevBtn.style.opacity = 1;
    }
}
/**
 * 是否禁止下一个点击样式函数
 * @param {*} flag 
 */
function nextDisabledFunc(flag) {
    let nextBtn = $('#sport  span.arrow_next')[0];
    if (flag) {
        nextBtn.style.cursor = "not-allowed";
        nextBtn.style.opacity = 0.3;
    }
    else {
        nextBtn.style.cursor = "pointer";
        nextBtn.style.opacity = 1;
    }

}
/**
 * 设置体育展示宽度函数
 */
function setWidthFunc() {
    let nowW = $('#sport div.sport_show  div.list_wrap')[0].offsetWidth / 3;
    Array.from($('#sport  div.list_wrap ul a')).forEach((e) => {
        e.style.width = nowW + "px";
    });

}
/**
 * 获取元素宽度
 * @param {*} wrap 
 * @returns 
 */
function getWidth(wrap) {
    return wrap.offsetWidth;
}

var defaultW = getWidth($('#sport div.sport_show  div.list_wrap')[0]);
//监听窗口宽度变化
window.onresize = () => {
    //体育赛事
    if (getWidth($('#sport div.sport_show  div.list_wrap')[0]) !== defaultW) {
        setWidthFunc();
        defaultW = getWidth($('#sport div.sport_show  div.list_wrap')[0]);
    }
    tranFunc($('#sport div.list_wrap ul')[0]);
}

function sportRightFunc() {
    commonUlShowFunc($('#sport .common_right_wrap')[0], JSON.parse(sportRightUpData), { 2: true });
}
sportRightFunc();

//-------------》》》》熊猫频道
getData(
    {
        callBack: function (data) {
            titleFunc($('#panda .banner')[0], data.data.pandasTitle[0]);
            contentFunc(data.data.pandasContents);
        },
        url: "http://service-dxtrccme-1302998929.gz.apigw.tencentcs.com/release/panda"
    }
);
/**
 * 标题函数
 * @param {*} data 
 */
function titleFunc(wrap, data) {
    let str = '';
    Array.from(data.heat).forEach((e) => {
        str += '<a href="javascript:void(0)">' + e + '</a>';
    });
    wrap.innerHTML = '<span class="title">' + data.title + '</span><span class="option"><a href="javascript:void(0)">' + data.option + '</a></span><span class="heat">' + str + '</span>';
}
/**
 * 处理左右内容函数
 * @param {*} data 
 */
function contentFunc(data) {
    pandaLeftFunc(data[0].leftContent[0]);
    rightFunc($('#panda .common_right_wrap')[0], data[0].rightCotent);
}
/**
 * 处理左边内容函数
 * @param {*} data 
 */
function pandaLeftFunc(data) {
    let vData = {
        'wrap': $('#panda .video_show')[0],
        'mp4': 'http:' + data.pandaMoment.momentMp4,
        'img': 'http:' + data.pandaMoment.momentImg,
        'title': data.pandaMoment.momentTitle
    };
    videoShowFunc(vData);
    liveFunc(data.liveBroadcast[0]);
}

/**
 * 模板视频函数
 * @param {*} data {wrap,img,mp4,title}
 */
function videoShowFunc(data) {
    let wrap = data.wrap;
    let videoStr = getVideoStr(data.mp4);
    wrap.innerHTML = '<div class="img"><a href="javascript:void(0)"><img data-src="' + data.img + '"/></a><div class="title"><a href="javascript:void(0)">' + data.title + '</a></div></div><div class="video"style="display: none;opacity:0;"><a href="javascript:void(0)">' + videoStr + '</a></div>';
    wrap.addEventListener("mouseenter", () => {
        let o = wrap.querySelector('.video');
        o.style.display = "block";
        setTimeout(() => {
            o.style.opacity = 1;
        }, 10);
        //透明度变化
    });
    wrap.addEventListener("mouseleave", () => {
        wrap.querySelector('.video').style.cssText = "display:none;opacity:0;";
    });
}

/**
 * 熊猫直播
 * @param {*} data 
 */
function liveFunc(data) {
    let wrap = $('#panda .down_part')[0];
    let liveData = data.pandaModel;
    let str = '<ul>';
    Array.from(liveData).forEach((e) => {
        str += '<li><div class="img"><a href="javascript:void(0)"><span class="live_gif"><img data-src="http:' + e.liveGif + '"></span><span class="live_img"><img data-src="http:' + e.liveIcon + '"></span></a></div><div class="text"><a href="javascript:void(0)">' + e.text + '</a></div></li>';
    });
    str += '</ul>';
    wrap.innerHTML = '<div class="panda_part"><div class="title"><a href="javascript:void(0)"><span>24小时</span>' + data.modelTitle + '</a></div><div class="content">' + str + '</div><div class="action"><div class="img animation"></div></div>';
    wriggleFunc($('.action .img')[0]);
}
/**
 * 熊猫蠕动函数
 * @param {*} obj 
 */
function wriggleFunc(obj) {
    let tempTop = 152;
    newAnimate(obj, { top: 152 }, 200, null, 700);
    setTimeout(() => {
        for (let index = 0; index < 16; index++) {
            tempTop -= 8;
            newAnimate(obj, { top: tempTop }, 300, null, 1000 * (index * 2 + 1));
        }
        setTimeout(() => {
            obj.classList.remove('animation');
            newAnimate(obj, { top: 160 }, 50, function () {
                tempTop = 152;
                obj.classList.add('animation');
                setTimeout(() => {
                    wriggleFunc(obj);
                }, 300);
            }, 300);
        }, 33000);
    }, 1000);

}
/**
 * 右边函数
 * @param {*} wrap 
 * @param {*} data {imgsrc: "", text: "清除昨日的烦恼，开启今天的快乐", textBots: Array(2)}
 */
function rightFunc(wrap, data) {
    let str = '<ul>';
    Array.from(data).forEach((e, index) => {
        let botStr = '';
        let nameStr = '';
        Array.from(e.textBots).forEach((e1) => {
            botStr += '<a href="javascript:void(0)">' + e1 + '</a>';
        });
        if ((index + 1) % 3 === 0) {
            nameStr = "last"
        }
        str += '<li class="' + nameStr + '"><div class="img"><a href="javascript:void(0)"><img data-src="http:' + e.imgsrc + '"></a></div><div class="text"><a href="javascript:void(0)">' + e.text + '</a><div class="text_bottom">' + botStr + '<span class="love_top"></span><span class="love"></span></div></div></li>';
    })
    str += '</ul>';
    wrap.innerHTML = str;
}
/**
 * 通用列表展示函数
 * @param {*} wrap 
 * @param {*} data {imgsrc: "", text: "清除昨日的烦恼，开启今天的快乐", textBots: Array(2)}
 */
function commonUlShowFunc(wrap, data, last, specialSize) {
    let str = '<ul>';
    Array.from(data).forEach((e, index) => {
        let botStr = '';
        let nameStr = '';
        Array.from(e.textBots).forEach((e1) => {
            botStr += '<a href="javascript:void(0)">' + e1 + '</a>';
        });
        if (specialSize && specialSize[index] === true) {
            nameStr = "minRight";
        }
        if (last && last[index] === true) {
            nameStr = "last"
        }
        str += '<li class="' + nameStr + '"><div class="img"><a href="javascript:void(0)"><img data-src="' + e.imgsrc + '"></a></div><div class="text"><a href="javascript:void(0)">' + e.text + '</a><div class="text_bottom">' + botStr + '<span class="love_top"></span><span class="love"></span></div></div></li>';
    })
    str += '</ul>';
    wrap.innerHTML = str;
}

//--------------》》》》央视看点
highlightTitleData = '{\"title\":\"央视看点\",\"imgsrc\":\"https://p3.img.cctvpic.com/uploadimg/2020/12/28/1609150472191465.png\"}';
highlightTvListData = '{\"text\":\"节目预告\",\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/2/1627872522792_618.jpg\",\"guidesList\":[{\"h3\":\"《人民的小康》\",\"p1\":\"CCTV-1 3日 20:06\",\"p2\":\"展中华大地新面貌、新气象。\"},{\"h3\":\"《医心向党》\",\"p1\":\"CCTV-12 3日 12:00\",\"p2\":\"追寻医者初心。\"},{\"h3\":\"《消费主张》\",\"p1\":\"CCTV-2 3日 19:23\",\"p2\":\"做中国消费市场的守护者。\"}]}';
highlightColumnData = '{\"title\":\"栏目大全\",\"columnList\":[{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList01.png\",\"text\":\"看新闻\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList02.png\",\"text\":\"观体育\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList03.png\",\"text\":\"览综艺\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList04.png\",\"text\":\"享健康\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList05.png\",\"text\":\"爱生活\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList06.png\",\"text\":\"普科教\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList07.png\",\"text\":\"谈经济\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList08.png\",\"text\":\"兴农业\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList09.png\",\"text\":\"懂法治\"},{\"bg\":\"https://p2.img.cctvpic.com/photoAlbum/templet/common/DEPA1603705823513963/columnList10.png\",\"text\":\"赏戏曲\"}]}';
getData(
    {
        callBack: function (data) {
            highlightTitleFunc($('#highlight .banner')[0], JSON.parse(highlightTitleData));
            highlightFunc($('#highlight  div.common_left_wrap')[0], data.data.highlights[0].picPart, { 1: true, 5: true, 9: true, 13: true, 17: true });
            highlightVideoFunc(data.data.highlights[0].videoPart);
            tvListsFunc($('#highlight  div.tvList')[0], JSON.parse(highlightTvListData));
            columnFunc($('#highlight  div.columns')[0], JSON.parse(highlightColumnData));
            special4KFunc($('#highlight  div.special4K')[0], data.data.special4K);
        }
        , url: "http://service-dxtrccme-1302998929.gz.apigw.tencentcs.com/release/highlights"
    }
);

/**
 * 节目预告
 * @param {*} wrap 
 * @param {*} data 
 */
function tvListsFunc(wrap, data) {
    let ulStr = '<ul>'
    Array.from(data.guidesList).forEach((e) => {
        ulStr += '<li><h3><a href="javascript:void(0)">' + e.h3 + '</a></h3><p>' + e.p1 + '</p><p>' + e.p2 + '</p></li>';
    })
    ulStr += '</ul>';
    let str = '<div class="tvtitle">' + data.text + '</div><div class="img"><a href="javascript:void(0)"><img data-src="' + data.imgsrc + '"></a></div><div class="lists">' + ulStr + '<div class="check"><a href="javascript:void(0)">查看完整节目单</a></div></div>';
    wrap.innerHTML = str;
}
/**
 * 栏目大全
 * @param {*} wrap 
 * @param {*} data 
 */
function columnFunc(wrap, data) {
    let ulStr = '<ul>';
    Array.from(data.columnList).forEach((e, index) => {
        ulStr += '<li class="c' + index + '"><a href="javascript:void(0)">' + e.text + '</a></li>';
    })
    let str = '<div class="colTitle">' + data.title + '</div>' + ulStr + '</ul>';
    wrap.innerHTML = str;
}
/**
 * 4k专区
 * @param {*} wrap 
 * @param {*} data 
 */
function special4KFunc(wrap, data) {
    let ulStr = '<ul>';
    Array.from(data).forEach((e, index) => {
        let name = '';
        if (index === 0) {
            name = 'cur';
        }
        ulStr += '<li class="' + name + '"><div class="img"><a href="javascript:void(0)"><img data-src="https:' + e.specialImg + '"></a></div><div class="text"><h3><a href="javascript:void(0)">' + e.specialTitle + '</a></h3><p><a href="javascript:void(0)">' + e.specialText + '</a></p></div></li>';
    });
    let str = '<div class="spTitle">4K专区</div>' + ulStr + '</ul>';
    wrap.innerHTML = str;
    special4KHoverFunc($('#highlight  div.special4K > ul')[0]);
}
/**
 * 4K专区悬浮函数
 * @param {*} obj 
 */
function special4KHoverFunc(obj) {
    let list = obj.children;
    let nowIndex = 0;
    Array.from(list).forEach((e) => {
        e.onmouseenter = function () {
            let index = Array.prototype.indexOf.call(list, this);
            list[nowIndex].className = ''
            this.className = "cur";
            nowIndex = index;
        }
    });
}
/**
 * 看点视频
 * @param {*} data 
 */
function highlightVideoFunc(data) {
    highlightFormData = {
        'wrap': $('#highlight .video_show')[0],
        'mp4': "https:" + data.hlMp4,
        'img': "https:" + data.videoImg,
        'title': data.videoTitle
    }
    videoShowFunc(highlightFormData);
}
/**
 * 央视看点
 * @param {*} wrap 
 * @param {*} data 
 * @param {*} last 
 */
function highlightFunc(wrap, data, last) {
    let str = '<ul><li class="video_show"></li>';
    Array.from(data).forEach((e, index) => {
        let botStr = '';
        let nameStr = '';
        botStr += '<a href="javascript:void(0)">' + e.textBot + '</a>';
        if (last && last[index] === true) {
            nameStr = "last"
        }
        str += '<li class="' + nameStr + '"><div class="img"><a href="javascript:void(0)"><img data-src="https:' + e.picImage + '"></a></div><div class="text"><a href="javascript:void(0)">' + e.textTitle + '</a><div class="text_bottom">' + botStr + '<span class="love_top"></span><span class="love"></span></div></div></li>';
    });
    str += '</ul>';
    wrap.innerHTML = str;
}
/**
 * 央视看点标题
 * @param {*} wrap 
 * @param {*} data 
 */
function highlightTitleFunc(wrap, data) {
    wrap.innerHTML = '<span class="title">' + data.title + '<span><a href="javascript:void(0)"><img data-src="' + data.imgsrc + '"></a></span></span>';
}

//--------------》》》》片库
getData(
    {
        callBack: function (data) {
            filmFunc(data.data.filmLibrary);
        }
        ,
        url: "http://service-dxtrccme-1302998929.gz.apigw.tencentcs.com/release/film"
    }
);

/**
 * 处理接受片库数据函数
 * @param {*} data 
 */
function filmFunc(data) {
    let filmNav = $('#nav')[0];
    let films_box = $('#films_box')[0];
    Array.from(data).forEach((e, index) => {
        filmCreateNode(e, index, filmNav, films_box);
    });
    filmSwitchOver(filmNav, films_box.getElementsByClassName('item'));
}
/**
 * 片库节点创建
 * @param {*} data 
 * @param {*} index 
 * @param {*} filmNav 
 * @param {*} films_box 
 */
function filmCreateNode(data, index, filmNav, films_box) {
    //导航
    let Oa = document.createElement('a');
    Oa.innerText = data.tabTitle;
    Oa.href = "javascript:void(0)";
    if (!index) {
        Oa.className = "cur";
    }
    filmNav.appendChild(Oa);
    //展示
    let Odiv = document.createElement("div");
    let Oul = document.createElement('ul');
    if (!index) {
        Odiv.style.left = 0;
    }
    Odiv.className = "item";
    Odiv.appendChild(Oul);
    Array.from(data.tabBoxs).forEach((e) => {
        let Oli = document.createElement('li');
        Oli.onmouseenter = (function () {
            return filmShow;
        })();
        Oli.onmouseleave = (function () {
            return filmHidden;
        })();
        Oli.innerHTML += '<div class="normal"><div class="img"><a href="javascript:void(0)"><img data-src="https:' + e.common.cImg + '"> </a> </div><div class="text"> <a href="javascript:void(0)">' + e.filmTitle + '</a></div></div>';
        Oli.innerHTML += '<div class="hover"><div class="img"><a href="javascript:void(0)"><img data-src="https:' + e.hover.hImg + '"/></a></div><div class="text"><h3><a href="javascript:void(0)">' + e.filmTitle + '</a></h3><span><a href="javascript:void(0)">' + e.hover.hText + '</a></span><div class="label"><a href="javascript:void(0)">未知</a></div></div></div>';
        Oul.appendChild(Oli);
    });
    films_box.appendChild(Odiv);

}
/**
 * 悬浮展示显示
 */
function filmShow() {
    let f_box = $('#films_box')[0];
    f_box.classList.remove("hover_now");
    this.style.zIndex = "3";
    var hoverBox = this.getElementsByClassName('hover')[0];
    hoverBox.style.cssText = "display:block;box-shadow: rgb(0 0 0 / 20%) 0px 2px 3px 1px;";

}
/**
 * 片库悬浮展示隐藏
 */
function filmHidden() {
    let f_box = $('#films_box')[0];
    f_box.className += " hover_now";
    this.style.zIndex = "1";
    var hoverBox = this.getElementsByClassName('hover')[0];
    hoverBox.style.cssText = "display:none;";
}
/**
 * 切换悬浮监听
 * @param {*} filmNav 
 * @param {*} items 
 */
function filmSwitchOver(filmNav, items) {
    let list = filmNav.children;
    let cur = 0;
    filmNav.addEventListener("mouseover", (e) => {
        let index = Array.prototype.indexOf.call(list, e.target);
        if (e.target.tagName === "A" && index !== cur) {
            list[cur].className = "";
            e.target.className = "cur";
            filmSwitchItem(items, index, cur);
            cur = index;
        }
    });
}
/**
 * 切换片库属性改变函数
 * @param {*} items 
 * @param {*} curIndex 
 * @param {*} oldIndex 
 */
function filmSwitchItem(items, curIndex, oldIndex) {
    items[oldIndex].style.cssText = "z-index:1;left:0;";
    myAnimate(items[oldIndex], { 'left': -1122 }, 30, function () {
        items[oldIndex].style.left = 1222 + "px";
    });
    items[curIndex].style.cssText = "z-index:3;left:1222px;";
    myAnimate(items[curIndex], { 'left': 0 }, 30, null);

}
/**
 * 动画函数（带有延迟）目前只支持正的延迟
 * @param {*} target  使用动画的目标
 * @param {*} opt 动画效果
 * @param {*} time 持续时间
 * @param {*} callBack  动画结束回调函数
 * @param {*} delay 动画延迟 
 */
function newAnimate(target, opt, time, callBack, delay) {
    setTimeout(() => {
        myAnimate(target, opt, time, callBack);
    }, delay);
}

//----------》》》》产经 sankei
sankeiSecondData = JSON.parse('[[{\"background\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/15/1605423622065_532.png\",\"head\":{\"content\":\"国家市场监督总局 汽车缺陷产品管理中心\",\"title\":\"汽车产品缺陷线索报告\",\"img\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/3/1/1614579765103_385.png\"},\"list\":[{\"img\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/4/23/1619154323183_932.jpg\",\"text\":\"安全气囊存缺陷 通用75万辆汽车遭美国国家公路交通安全管理局调查\"},{\"img\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/4/23/1619154435812_909.jpg\",\"text\":\"奔驰汽车销售有限公司召回部分进口A级、CLA、GLE SUV汽车\"}],\"more\":\"进入专题\",\"title\":\"缺陷产品线索\"}],[{\"background\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/15/1605423966328_301.png\",\"head\":{\"content\":\"科技创新，以人为始；智敬中国，看见未来。\",\"title\":\"智敬中国\",\"img\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/21/1626848121013_597.png\"},\"list\":[{\"img\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/21/1626839245868_73.jpg\",\"text\":\"[视频]智敬中国第一集：数字机遇\"},{\"img\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/21/1626839297464_367.jpg\",\"text\":\"[视频]MR隔空问诊“庞然大物”\"}],\"more\":\"进入专题\",\"title\":\"智敬中国\"},{\"background\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/18/1605666933152_694.png\",\"head\":{\"content\":\"优选案例，全方位展示传统行业的数字化转型成果\",\"title\":\"数字样板间\",\"img\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/24/1606188495786_697.png\"},\"list\":[{\"img\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/4/27/1619515748835_1.jpg\",\"text\":\"飞鹤甘南牧场 来自北纬47度的数字接力 它到底神奇在哪里？\"},{\"img\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/1/13/1610526348177_925.jpg\",\"text\":\"感受晋城魅力 走进山西晋城 在这里数字如何传递城市温度\"}],\"more\":\"AI直播间\",\"title\":\"数字样板间\"}],[{\"background\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/8/1625714864888_551.png\",\"head\":{\"content\":\"促推茶产业发展，助力脱贫攻坚、乡村振兴。\",\"title\":\"百县·百茶·百人\",\"img\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/9/1625796461785_426.png\"},\"list\":[{\"img\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/8/1625714913585_828.jpg\",\"text\":\"贵州瓮安茗茶 北纬27°线上的高原生态良品\"},{\"img\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/27/1627351277283_725.jpg\",\"text\":\"“百县·百茶·百人”公益推选活动评审会在北京召开\"}],\"more\":\"进入专题>\",\"title\":\"百县·百茶·百人\"},{\"background\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/15/1605424297627_559.png\",\"head\":{\"content\":\"足不出户，聆听中国殿堂级交响乐团的音乐盛宴。\",\"title\":\"云上音乐厅\",\"img\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/24/1606229120254_730.png\"},\"list\":[{\"img\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/8/1625714692987_654.jpg\",\"text\":\"[百年抒怀]《光荣岁月》——为女中音与乐队而作\"},{\"img\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/12/1626061279063_709.jpg\",\"text\":\"[水上焰火]亨德尔《皇家焰火音乐》 第一乐章 序曲\"}],\"more\":\"进入专题\",\"title\":\"云上音乐厅\"}],[{\"background\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/15/1605424667687_664.png\",\"head\":{\"content\":\"艺术不简单，艺术也简单。海量书画课，线上免费学。\",\"title\":\"艺塾\",\"img\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/24/1606206679000_50.png\"},\"list\":[{\"img\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/3/1627971010896_32.jpg\",\"text\":\"《一日一字圣教序》行书经典碑帖笔法解密274期：及\"},{\"img\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/3/1627971031204_828.jpg\",\"text\":\"《一日一字圣教序》行书经典碑帖笔法解密275期：乎\"}],\"more\":\"进入专题\",\"title\":\"书画课堂\"}],[{\"background\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/6/24/1624497139036_781.jpg\",\"head\":{\"content\":\"多视角、有情怀、有温度的三农故事。\",\"title\":\"中国三农报道\",\"img\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/6/24/1624497259110_2.png\"},\"list\":[{\"img\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/3/1628005792267_637.png\",\"text\":\"银匠离开家乡外出打工为何又纷纷回来？在乡村，就能挣到钱。\"},{\"img\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/3/1628005952254_110.png\",\"text\":\"谭永基偶然发现商机，在买进鳜鱼苗后再培育15天，就能赚一百多万元。\"}],\"more\":\"农业资讯\",\"title\":\"农经热点\"}],[{\"background\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/1/1/1609492245375_431.png\",\"head\":{\"content\":\"关注大众身心、保健意识，倡导健康生活。\",\"title\":\"健康之路\",\"img\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2021/1/1/1609492249943_944.png\"},\"list\":[{\"img\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/4/1628041388451_898.png\",\"text\":\"踝关节周围的肌肉力量不强和平衡稳定性不佳容易经常崴脚。\"},{\"img\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2021/8/4/1628041513990_399.png\",\"text\":\"专家建议训练前和训练后一定要有热身和放松。\"}],\"more\":\"健康资讯\",\"title\":\"健康生活\"},{\"background\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/15/1605426132126_483.png\",\"head\":{\"content\":\"在线大名医，健康守护您；生活大爆款，百人亲测帮您选。\",\"title\":\"生活圈\",\"img\":\"https://p5.img.cctvpic.com/photoAlbum/page/performance/img/2020/12/16/1608099875098_658.png\"},\"list\":[{\"img\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/30/1627613376895_530.png\",\"text\":\"哮喘发病原因\"},{\"img\":\"https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2021/7/29/1627524291390_534.png\",\"text\":\"健身九宫格：仰卧起坐怎么练？\"}],\"more\":\"健康资讯\",\"title\":\"健康生活\"}]]');
getData(
    {
        url: "http://service-dxtrccme-1302998929.gz.apigw.tencentcs.com/release/industrial-economy",
        callBack: function (data) {
            sankeiFillDate(data.data);
        }
    }
)
/**
 * 产经填充数据
 * @param {*} data 
 */
function sankeiFillDate(data) {
    Array.from(data).forEach((e, index) => {
        let liStr = '';
        Array.from(e.common.images).forEach((e) => {
            liStr += '<li><div class="img"><img data-src="' + e.img + '"><div class="text"><a href="javascript:void(0)">' + e.text + '</a></div></div></li>';
        })
        let titleStr = ''
        Array.from(e.common.list).forEach((e) => {
            titleStr += '<li><a href="javascript:void(0)">' + e + '</a></li>';
        })
        let secondStr = '', label_text = '';
        Array.from(sankeiSecondData[index]).forEach((e) => {
            let second_list = '';
            Array.from(e.list).forEach((e) => {
                second_list += '<li><div class="image"><a href="javascript:void(0)"><img data-src="' + e.img + '"></a></div><div class="text"><p><a href="javascript:void(0)">' + e.text + '</a></p></div></li>';
            })
            secondStr += '<div class="second_show"><img data-src="' + e.background + '" width="100%" height="100%"><div class="content"><div class="up"><div class="img"><a href="javascript:void(0)"><img data-src="' + e.head.img + '"></a></div><div class="title"><h3><a href="javascript:void(0)">' + e.head.title + '</a></h3><p>' + e.head.content + '</p></div></div><ul>' + second_list + '</ul><div class="more"><a href="javascript:void(0)"><span>' + e.more + '</span></a></div></div></div>';
            label_text += '<span><a href="javascript:void(0)"><span>' + e.title + '</span></a></span>';
        });
        let str = '<div class="common_main"><div class="banner"></div><div class="main_part"><div class="sankei_con"><div class="show"><div class="swiper"><ul>' + liStr + '</ul><div class="arrow_wrap"><div class="count"><i>1</i>/<i>' + e.common.images.length + '</i></div><span class="prev"></span><span class="next"></span></div></div><div class="title_list"><ul>' + titleStr + '</ul></div></div>' + secondStr + '<div class="label">' + label_text + '</div></div><div class="no_float"></div></div></div>';
        $('#sankei' + index)[0].innerHTML = str;
        sankeiTitleFunc($('#sankei' + index + ' .banner')[0], e.head);
    });
    Array.from($('.swiper')).forEach((e) => {
        sankeiSlideFunc(e);
    });
    sankeiHoverEvent();
}
// 产经悬浮事件
function sankeiHoverEvent() {
    let flag = false;
    Array.from($('#sankei .label')).forEach(function (e) {
        Array.from(e.children).forEach(function (e1, index) {
            e1.onmouseenter = function () {
                if (e1.className.includes('cur')) {
                    return;
                }
                Array.from(e1.parentElement.children).forEach((e2, i) => {
                    e.parentElement.querySelectorAll('.second_show')[i].style.display = "none";
                    e2.classList.remove('cur');
                });
                e.parentElement.querySelectorAll('.second_show')[index].style.display = "block";
                fadeIn(e.parentElement.querySelectorAll('.second_show')[index], 3);
                e1.classList.add('cur');
                flag = true;
            }
        });
    });
    Array.from($('#sankei .main_part')).forEach(function (e) {
        e.onmouseleave = function () {
            if (!flag) { return; }
            let sp = this.querySelectorAll('.label>span');
            Array.from(this.querySelectorAll('.second_show')).forEach((e, index) => {
                sp[index].classList.remove('cur');
                e.style.display = "none";
                fadeOut(e, 3);
            });
            flag = false;
        }
    });
}
// 产经轮播
function sankeiSlideFunc(wrap) {
    let now = 0;
    let lists = wrap.querySelectorAll('ul li');
    let sum = lists.length;
    let re = wrap.querySelector(' div > div > i:nth-child(1)');
    wrap.querySelector('.prev').onclick = function () {
        lists[now].style.cssText = "display:none;z-index:1;";
        now = --now < 0 ? sum - 1 : now;
        lists[now].style.cssText = "display:block;z-index:2;";
        fadeIn(lists[now], 5);
        re.innerText = now + 1;
    };
    wrap.querySelector('.next').onclick = function () {
        lists[now].style.cssText = "display:none;z-index:1;";
        now = ++now > sum - 1 ? 0 : now;
        lists[now].style.cssText = "display:block;z-index:2;";
        fadeIn(lists[now], 5);
        re.innerText = now + 1;
    };
}
/**
 * 产经标题
 * @param {*} wrap 
 * @param {*} data 
 */
function sankeiTitleFunc(wrap, data) {
    let str = '';
    Array.from(data.list).forEach((e) => {
        str += '<a href="javascript:void(0)">' + e + '</a>';
    });
    wrap.innerHTML = '<span class="title" style="background-image:url(https:' + data.img + ')">' + data.title + '</span><span class="option"><a href="javascript:void(0)">更多></a></span><span class="heat">' + str + '</span>';
}
//--------》》》央视大全 cctv

getData({
    url: "http://service-dxtrccme-1302998929.gz.apigw.tencentcs.com/release/encyclopedia",
    callBack: function (data) {
        cctvFunc(data.data);
    }
})
/**
 * 央视大全数据填充
 * @param {*} data 
 */
function cctvFunc(data) {
    let wrap = $('.cctvs .grid_wrap')[0];
    let wrap2 = $('.cctv_wrap .group')[0];
    let str = '';
    let str2 = '';
    Array.from(data).forEach((e, index) => {
        let nameStr = index ? '' : 'cur';
        let divStr = '';
        Array.from(e.content.list).forEach((e) => {
            divStr += '<div><a href="javascript:void(0)">' + e + '</a></div>';
        })
        str += '<div class="' + nameStr + '"><p><a href="javascript:void(0)">' + e.title.tNo + '<br><span>' + e.title.tName + '</span></a></p></div>';
        str2 += '<div class="gwrap"><div class="play_box"><div class="play_inner"><div class="img"><a href="javascript:void(0)"><img data-src="' + e.content.img + '"></a></div><div class="play_text"><p>正在播出</p><a href="javascript；void(0)">' + e.content.now + '</a><p>精彩预告</p><span>' + e.content.next + '</span></div></div></div><div class="play_list">' + divStr + '</div></div>';
    });
    wrap.innerHTML = str;
    wrap2.innerHTML = str2;
    cctvClickFunc();
}
/**
 * 央视大全点击函数
 */
function cctvClickFunc() {
    let p = $('#cctv .grid_wrap>div');
    let con = $('#cctv .gwrap');
    let now = 0;
    Array.from(p).forEach((e, index) => {
        e.onclick = function () {
            if (now === index) { return }
            this.classList.add('cur');
            p[now].classList.remove('cur');
            con[now].style.display = "none";
            con[index].style.display = "block";
            now = index;
        }
    });
}
//--------》》》页脚

(
    function () {
        var footerLinkData = '{\"links\":[{\"title\":\"关于我们\",\"list\":[\"总台之声\",\"CCTV广告中心\",\"关于CCTV.com\",\"象舞广告\",\"网站声明\",\"帮助中心\"]},{\"title\":\"业务概况\",\"list\":[\"央视网\",\"互联网电视\",\"央视影音\",\"手机电视\",\"移动传媒\"]},{\"title\":\"更多链接\",\"list\":[\"网上有害信息举报专区\",\"谣言曝光台\",\"法律顾问\",\"友情链接\",\"人才招聘\"]}],\"topIcon\":[{\"text\":\"央视\\n影音\",\"imgsrc\":\"https://p2.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/13/1605265167859_185.png\"},{\"text\":\"央视\\n新闻\",\"imgsrc\":\"https://p4.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/13/1605265148437_52.png\"},{\"text\":\"央视\\n财经\",\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/13/1605265129349_999.png\"},{\"text\":\"熊猫\\n频道\",\"imgsrc\":\"https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/11/13/1605265106606_738.png\"}]}';
        nameMap = { 0: "ab_us", 1: "business", 2: "more_links" };
        /**
         * 页脚数据填充
         * @param {*} wrap 
         * @param {*} data 
         */
        (function footerFillData(wrap, data) {
            var divStr = '';
            Array.from(data.links).forEach((e, i) => {
                var liStr = '';
                e.list.forEach((e1) => {
                    liStr += '<li><a href="javascript:void(0)">' + e1 + '</a></li>';
                });
                divStr += '<div class="' + nameMap[i] + '"><p>' + e.title + '</p><ul>' + liStr + '</ul></div>';
            });
            var imgSrc = '';
            Array.from(data.topIcon).forEach((e) => {
                imgSrc += '<a href="javascript:void(0)"><img data-src="' + e.imgsrc + '">' + e.text.replace("\n", "<br/>") + '</a>';
            });
            wrap.innerHTML = '<div class="links">' + divStr + '<div class="content_search"><div class="topimg">' + imgSrc + '</div><div class="b_search"><input type="text"name="bot_txt"id="bot_txt"><input type="button"class="btn" id="bot_btn"></div></div></div>';
        }
        )($('.b1_con')[0], JSON.parse(footerLinkData));
        searchFunc($('#bot_txt')[0], $('#bot_btn')[0], "web");
    }
)();
/**
 * 动画函数
 * 目前只支持带有px的属性
 * @param {*} target  使用动画的目标
 * @param {*} opt 动画效果
 * @param {*} time 持续时间
 * @param {*} callBack  动画结束回调函数
 */
function myAnimate(target, opt, time, callBack) {
    clearInterval(target.timer);
    target.timer = setInterval(() => {
        target.isStop = true;
        for (let key in opt) {
            let now = parseFloat(getStyle(target, key));
            let speed = (opt[key] - now) / 5;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            let cur = now + speed;
            target.style[key] = cur + "px";
            if (opt[key] !== cur) {
                target.isStop = false;
            }
        }
        if (target.isStop) {
            clearInterval(target.timer);
            callBack && callBack();
        }

    }, time);
}
/*导航 */
(function () {
    var lists = ["要闻", "品质活动", "精彩导视", "视频", "军事", "体育", "熊猫频道", "央视看点", "片库", "产经", "央视大全"];
    var wrap = $('#floatNav .list_box')[0];
    var nav = $('#floatNav')[0];
    var listStr = '';
    lists.forEach((e, index) => {
        var className = 'item';
        if (!index) {
            className += " cur";
        }
        listStr += '<div class="' + className + '" data-index="' + index + '" data-sort="' + index + '">' + e + '</div>';
    });
    wrap.innerHTML = listStr;

    /**
     * 监听事件
     */
    var position = [];//每个区域位置
    var contentBox = $('div.storey-box > div.content-box>div');
    var sort_btn = $('#sort_btn')[0];//重排按钮
    var backTop_btn = $('#backTop')[0];//置顶按钮
    var item = $('#floatNav .list_box>div');//悬浮导航每个子项目
    var mark = $('#floatNav > div.big_bg')[0];//排序背景
    function getPosition() {
        contentBox.forEach((e, index) => {
            if (index !== 4) {
                position.push(e.offsetTop)
            }
        });
    }
    //置顶
    backTop_btn.onclick = function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    //重排
    sort_btn.onclick = function () {
        if (mark.style.cssText) {
            mark.style.cssText = "";
            showCurFunc();
            showFloatNavFunc();
            wrap.removeEventListener("mousedown", mousedownFunc, false);
            window.addEventListener("scroll", scrollFunc);
            window.addEventListener("resize", resizeFUnc);
            wrap.addEventListener("click", clickFunc);
        }
        else {
            mark.style.cssText = "position:fixed;left:0;top:0;right:0;bottom:0;width:100%;height:100%;background-color:rgba(0,0,0,.5);";
            removeCurName();
            window.removeEventListener("scroll", scrollFunc);
            window.removeEventListener("resize", resizeFUnc);
            wrap.removeEventListener("click", clickFunc);
            sortFunc();
        }
    }
    /**
     * 重排处理函数
     */
    var mousedownFunc;

    function sortFunc() {

        var list_box = $('#floatNav .list_box')[0];
        //鼠标按下
        mousedownFunc = (e) => {
            var target = e.target;
            if (target.className.includes("item")) {
                target.style.transition = "transform 0s";
                var y = e.pageY;
                var mousemoveFunc = (e1) => {
                    var offset = e1.pageY - y;
                    target.style.transform = "translate3d(0," + offset + "px,0)";
                    handleFunc(target, offset);
                }

                list_box.addEventListener("mousemove", mousemoveFunc, false);

                list_box.addEventListener("mouseup", (e2) => {
                    handleEndFunc();
                    removeInlineCssStyle(target, ["transition"]);
                    list_box.removeEventListener("mousemove", mousemoveFunc, false);
                }, false);
            }
        }
        list_box.addEventListener("mousedown", mousedownFunc, false);
    }

    //TODO---------------------------------------------拖拽排序待完成---------------

    var sortItem = $('#floatNav .list_box>div');//悬浮导航每个子项目
    var maxIndex = sortItem.length - 1;
    var positive = 0;
    var minus;

    function handleFunc(obj, y) {
        return;
        var index = Array.prototype.indexOf.call(sortItem, obj);
        if (index > 0 && index < maxIndex) {
            if (y >= 18) {
                var jump = Math.floor(y / 18);
                if (jump > positive) {
                    var start = Math.min(index + jump, maxIndex);
                    var temp = sortItem[start].dataset.sort;
                    sortItem[start].dataset.sort = parseInt(temp) - 1;
                    sortItem[start].style.transform = "translate3d(0,-" + 28 + "px,0)";
                    temp = sortItem[index].dataset.sort;
                    sortItem[index].dataset.sort = parseInt(temp) + 1;
                    positive = start - index;
                }
            } else if (y <= -18) {
                y = -y;

            }
        }
    }
    /**
     * 处理最总结果
     */
    function handleEndFunc() {
        return;
        sortItem = Array.from(sortItem).sort(compareFunc("sort"));
        Array.from(sortItem).forEach((e) => {
            e.style.cssText = "";
            wrap.appendChild(e);
        });
    }
    /**
     * 比较函数
     * @param {*} p 
     * @returns 
     */
    function compareFunc(p) {
        return function (obj1, obj2) {
            var v1 = obj1.dataset[p];
            var v2 = obj2.dataset[p];
            if (!isNaN(Number(v1)) && !isNaN(Number(v2))) {
                v1 = Number(v1);
                v2 = Number(v2);
            }
            if (v1 < v2) {
                return -1;
            }
            else if (v1 > v2) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }
    //--------------------------------------------------------------拖拽排序----------end


    /**
     * 移除导航cur类名
     */
    function removeCurName() {
        Array.from(item).forEach((e) => {
            e.classList.remove("cur");
        })
    }
    //当前位置下标
    var curIndex = 0;
    /**
     * 点击函数
     * @param {*} t 
     */
    function clickFunc(t) {
        var target = t.target;
        var targetIndex = target.dataset.index;
        if (target.className.includes("item") && curIndex !== targetIndex) {
            window.scrollTo({ top: position[target.dataset.index], behavior: "smooth" });
            item[curIndex].classList.remove("cur");
            item[targetIndex].classList.add("cur");
            curIndex = targetIndex;
        }
    }
    //点击事件
    wrap.addEventListener("click", clickFunc);

    //处理悬浮导航得显隐
    function showFloatNavFunc() {
        if (Math.ceil(window.pageYOffset) >= position[0] && nav.style.display === "none") {
            nav.style.display = "block";
            fadeIn(nav, 3, () => {
                nav.style.opacity = 1;
            });
        }
        else if (Math.ceil(window.pageYOffset) < position[0] && nav.style.display === "block") {
            fadeOut(nav, 3, () => {
                nav.style.opacity = 0;
                nav.style.display = "none";
            });

        }
    }

    //浮动导航跟随函数
    function followFunc() {

        var scrollPy = Math.ceil(window.pageYOffset);
        var followIndex = -1;

        for (var i = 0, len = position.length - 1; i < len; i++) {
            if (position[i] <= scrollPy && position[i + 1] > scrollPy) {
                followIndex = i;
                break;
            }
            else if (i === len - 1) {
                if (scrollPy >= position[i + 1]) {
                    followIndex = i + 1;
                }
            }
        }

        if (followIndex !== -1 && followIndex !== curIndex) {
            item[curIndex].classList.remove("cur");
            item[followIndex].classList.add("cur");
            curIndex = followIndex;
        }
    }
    /**
     * 显示cur
     */
    function showCurFunc() {

        position = [];
        getPosition();

        var scrollPy = Math.ceil(window.pageYOffset);
        var followIndex = -1;

        for (var i = 0, len = position.length - 1; i < len; i++) {
            if (position[i] <= scrollPy && position[i + 1] > scrollPy) {
                followIndex = i;
                break;
            }
            else if (i === len - 1) {
                if (scrollPy >= position[i + 1]) {
                    followIndex = i + 1;
                }
            }
        }

        if (followIndex !== -1) {
            item[curIndex].classList.remove("cur");
            item[followIndex].classList.add("cur");
            curIndex = followIndex;
        }
    }

    window.addEventListener("load", () => {
        position = [];
        getPosition();
    });

    var scrollFunc = throttle(function () {//节流
        showFloatNavFunc();
        followFunc();
    }, 500);

    window.addEventListener("scroll", scrollFunc);

    var resizeFUnc = antiShake(function () {//防抖
        position = [];
        getPosition();
        showFloatNavFunc();
        followFunc();
    }, 500);

    window.addEventListener("resize", resizeFUnc);

})();
/**
 * 点赞动画函数
 */
function loveFunc() {
    let os = $('.text_bottom .love');
    var loveFlag = true;
    for (let index = 0, len = os.length; index < len; index++) {
        let obj = os[index];
        obj.addEventListener("click", () => {
            if (loveFlag) {
                loveFlag = false;
                if (!obj.className.includes('loved')) {
                    obj.className += " loved";
                }
                let ani = obj.previousSibling;
                myAnimate(ani, { 'top': -10 }, 50, function () {
                    ani.style.cssText = 'top:5px';
                    loveFlag = true;
                });
            }

        });
    }
}


window.onload = function () {
    loveFunc();

}

