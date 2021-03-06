var ajax = function(){

}


ajax.prototype = {
    //========通用方法===========
    // 对象继承方法
    extend : function(destination, source, override) {
        if(undefined == override) override = true;
        if(typeof destination != "object" && typeof destination != "function") {
            if(!override)
                return destination;
            else
                destination = {};
        }
        var property = '';
        for(property in source) {
            if(override || !(property in destination)) {
                destination[property] = source[property];
            }
        }

        return destination;
    },


    // 判断数组
    isArray : function(v) {
        return toString.apply(v) === '[object Array]';
    },


    // json to string {name: 'lisi', age: 10} --> name=lisi&age=10
    json2String : function(obj) {
        var msg;
        for(var item in obj){
            var value = obj[item]
            if(this.isArray(value)){
                item = item + '[]'
                var len = value.length
                for(var i = len - 1; i >= 0; i--){
                    var data = data ? data + '&' + item + '=' + value[i] : item + '=' + value[i]
                }
            }else{
                var datas = item + '=' + value
            }
            var Data = data || datas
            msg = msg ? msg + '&' + Data : Data
            data = null
        }
        return msg
    },


    //=========Ajax方法==========
    // 初始化xmlhttpRequest
    init : function() {
        var xmlhttp = null;

        // 针对不同浏览器建立这个对象的不同方式写不同代码
        if(window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
            //针对某些特定版本的Mozillar浏览器的BUG进行修正
            if(xmlhttp.overrideMimeType) {
                xmlhttp.overrideMimeType("text/xml");
            }

        } else if (window.ActiveXObject) {
            var activexName = ['MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
            for (var i=0; i<activexName.length; i++) {
                try {
                    xmlhttp = new ActiveXObject(activexName[i]);
                    break;
                } catch(e) {}
            }
        }
        return xmlhttp;
    },

    // 发送http 请求  opt = {url:'',data:''}
    ajax : function(opt) {
        this.xmlhttp = ajax.init()
        var _self = this,
        isTimeout = false,
        options = {
            url : "",   // string
            data : "",  // json or string
            method : "GET",
            receiveType : "html",  // html json or xml
            timeout : 7000,
            async : true,
            complate: function(data,status){
              if(status=='success'){
                options.success(data)
              }else{
                options.error(data)
              }
            },
            success : function(){},
            error : function(xmlhttp){}
        };
        if("data" in opt) {
            if(typeof opt.data == "string"){} else {opt.data = this.json2String(opt.data); }
        }
        options = this.extend(options, opt);

        this.xmlhttp.onreadystatechange = function(){

            if(_self.xmlhttp.readyState == 4) {

                if(!isTimeout && _self.xmlhttp.status == 200) {
                    var t = options.receiveType.toLowerCase();
                    if(t == "html") {
                        options.complate(_self.xmlhttp.responseText,'success')

                    } else if(t == "xml") {
                        options.complate(_self.xmlhttp.responseXML,'success');

                    } else if(t == 'json') {
                        try {
                            var obj = JSON.parse(_self.xmlhttp.responseText);
                            options.complate(obj,'success');
                        } catch(e) {
                            var str = '(' + _self.xmlhttp.responseText + ')';  //json字符串
                            options.complate(eval(str),'success');
                        }
                    }

                } else {
                    options.complate(_self.xmlhttp,'error');
                }
            }
        };



        this.xmlhttp.open(options.method.toUpperCase(), options.url, options.async);  //打开与服务器连接
        if(options.method.toUpperCase() == "POST") {
            this.xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');  //post方式要设置请求类型
            this.xmlhttp.send(options.data);  //发送内容到服务器

        } else {
            this.xmlhttp.send(null);
        }
    },
}
console.log(new ajax())

window.ajax  = new ajax().ajax
