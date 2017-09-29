var Utils = {
    isUrl: function (val) {
        "use strict";
        var regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/;
        return regexp.test(val);
    },

    isColor: function (val) {
        "use strict";
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
    },

    secondsToTime: function(secs) {
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);

        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);

        return {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
    },

    hex2rgba: function(hex, alpha){
        var c;
        alpha = isNaN(alpha) ? 1 : alpha;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length=== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
        }
        throw new Error('Hex2rgba error. Bad Hex value');
    },

    random: function(from, to){
        return Math.floor(Math.random()*(to-from+1)+from);
    },

    isInt: function(n){
        return Number(n) === n && n % 1 === 0;
    },

    isFloat: function(n){
        return Number(n) === n && n % 1 !== 0;
    },

    uniqueId: function () {
        "use strict";
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },

    isTouchDevice: function() {
        return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
    },


    secondsToFormattedString: function(time){
        var hours, minutes, seconds;

        hours = parseInt( time / 3600 ) % 24;
        minutes = parseInt( time / 60 ) % 60;
        seconds = time % 60;

        return (hours ? (hours) + ":" : "") + (minutes < 10 ? "0"+minutes : minutes) + ":" + (seconds < 10 ? "0"+seconds : seconds);
    },

    callback: function(f, args){
        return this.exec(f, args);
    },

    exec: function(f, args){
        if (f === undefined) {return false;}
        var func = this.isFunc(f);
        if (func === false) {
            func = new Function("a", f);
        }

        return func(args);
    },

    isFunc: function(f){
        if (f === undefined || f === null) {
            return false;
        }

        if (typeof f === 'function') {
            return f;
        }

        if (typeof window[f] === 'function') {
            return window[f];
        }

        if (f.indexOf(".") === -1) {
            return false;
        }

        var ns = f.split(".");
        var i, context = window;

        for(i = 0; i < ns.length; i++) {
            context = context[ns[i]];
        }

        return typeof context === "function" ? context : false;
    },

    isMetroObject: function(el, type){
        var $el = $(el), el_obj = $el.data(type);

        if ($el.length === 0) {
            console.log(type + ' ' + el + ' not found!');
            return false;
        }

        if (el_obj === undefined) {
            console.log('Element not contain role '+ type +'! Please add attribute data-role="'+type+'" to element ' + el);
            return false;
        }

        return true;
    },

    isJQueryObject: function(el){
        return (typeof jQuery === "function" && el instanceof jQuery);
    },

    addLocale: function(data){
        $.extend(Locales, data);
    },

    getLocaleNames: function(){
        var result = [];
        $.each(Locales, function(i){
            result.push(i);
        });

        return result;
    },

    elementInViewport: function(el) {
        if (typeof jQuery === "function" && el instanceof jQuery) {
            el = el[0];
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    objectLength: function(obj){
        return Object.keys(obj).length;
    },

    percent: function(a, b, r){
        if (a === 0) {
            return 0;
        }
        var result = b * 100 / a;
        return r ? Math.round(result) : Math.round(result * 100) / 100;
    },

    camelCase: function(str){
        return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    },

    objectShift: function(obj){
        var min = 0;
        $.each(obj, function(i){
            if (min === 0) {
                min = i;
            } else {
                if (min > i) {
                    min = i;
                }
            }
        });
        delete obj[min];

        return obj;
    },

    objectDelete: function(obj, key){
        return obj[key] !== undefined ? obj : delete obj[key];
    },

    arrayDelete: function(arr, key){
        return arr.indexOf(key) > -1 ? arr.splice(arr.indexOf(key), 1) : arr;
    },

    nvl: function(data, other){
        return data === undefined || data === null ? other : data;
    },

    github: function(repo, callback){
        var that = this;
        $.ajax({
            url: 'https://api.github.com/repos/' + repo,
            dataType: 'jsonp'
        })
        .done(function(data){
            that.callback(callback, data.data);
        });
    },

    detectIE: function() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    },

    md5: function(s){
        return hex_md5(s);
    },

    encodeURI: function(str){
        return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
    },

    pageHeight: function(){
        var body = document.body,
            html = document.documentElement;

        return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
    },

    cleanPreCode: function(selector){
        var els = Array.prototype.slice.call(document.querySelectorAll(selector), 0);

        els.forEach(function(el, idx, arr){
            var txt = el.textContent
                .replace(/^[\r\n]+/, "")	// strip leading newline
                .replace(/\s+$/g, "");

            if (/^\S/gm.test(txt)) {
                el.textContent = txt;
                return;
            }

            var mat, str, re = /^[\t ]+/gm, len, min = 1e3;

            while (mat = re.exec(txt)) {
                len = mat[0].length;

                if (len < min) {
                    min = len;
                    str = mat[0];
                }
            }

            if (min === 1e3)
                return;

            el.textContent = txt.replace(new RegExp("^" + str, 'gm'), "");
        });
    },

    coords: function(el){
        if (this.isJQueryObject(el)) {
            el = el[0];
        }

        var box = el.getBoundingClientRect();

        return {
            top: box.top + window.pageYOffset,
            left: box.left + window.pageXOffset
        };
    },

    positionXY: function(e, t){
        switch (t) {
            case 'client': return this.clientXY(e); break;
            case 'screen': return this.screenXY(e); break;
            case 'page': return this.pageXY(e); break;
            default: return {left: o, top: 0}
        }
    },

    clientXY: function(event){
        return {
            x: this.isTouchDevice() ? event.changedTouches[0].clientX : event.clientX,
            y: this.isTouchDevice() ? event.changedTouches[0].clientY : event.clientY
        };
    },

    screenXY: function(event){
        return {
            x: this.isTouchDevice() ? event.changedTouches[0].screenX : event.screenX,
            y: this.isTouchDevice() ? event.changedTouches[0].screenY : event.screenY
        };
    },

    pageXY: function(event){
        return {
            x: this.isTouchDevice() ? event.changedTouches[0].pageX : event.pageX,
            y: this.isTouchDevice() ? event.changedTouches[0].pageY : event.pageY
        };
    }
};

$.Metro['utils'] = window.metroUtils = Utils;