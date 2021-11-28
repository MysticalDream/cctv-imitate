class Observer {
    constructor(data) {
        this.observe(data);
    }

    observe(data) {
        //对data数据将原有的属性改为get和set方法
        if (!data || typeof data !== 'object') {
            return;
        }
        //将数据劫持 先获取到data的key和value
        for (const key in data) {
            //使用原型链上真正的 hasOwnProperty 方法
            if (Object.hasOwnProperty.call(data, key)) {
                let element = data[key];
                this.defineReactive(data, key, element);
                //继续劫持
                this.observe(element);
            }
        }

    }
    
    //定义响应式
    defineReactive(obj, key, value) {
        let that = this;
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                //取值时加入一些处理
                alert(1);
                return value;
            },
            set(newValue) {
                //当data属性中设置值时一样不更改，反之更改
                if (newValue !== value) {
                    //这里的this不是上observer实例，所以用that代替
                    //如果是对象，继续劫持
                    that.observe(newValue);
                    value = newValue;
                }
            }
        });
    }
}