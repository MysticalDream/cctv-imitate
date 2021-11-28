/**
 * 观察者为需要变化的元素增加一个观察者，当数据变化后执行对应方法
 */
class Watcher {
    constructor(vm, exp, callBack) {
        this.vm = vm;
        this.exp = exp;
        this.cb = callBack;
        //获取旧值
        this.value = this.get();
    }
    getValue(vm, exp) {
        exps = exp.split('.');//[a,b,c]
        //对数组中的每个元素执行一个由您提供的reducer函数(升序执行) 即执行((vm.$data[a])[b])[c]
        //es5
        return exps.reduce((p, currentValue) => {
            return p[currentValue];
        }, vm.$data);
    }
    get() {
        let value = this.getValue(this.vm, this.exp);
        return value;
    }
    //对外暴露的方法
    update() {
        let newValue = this.getValue(this.vm, this.exp);
        let oldValue = this.value;
        if (newValue !== oldValue) {
            this.cb(newValue);//调用watcher的callback
        }
    }
}
