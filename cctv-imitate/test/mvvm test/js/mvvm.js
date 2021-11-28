class MVVM {
    constructor(obj) {
        //装载到实例上
        this.$el = obj.el;
        this.$data = obj.data;
        //如果有要编译的节点就开始编译
        if (this.$el) {
            //数据劫持 把对象的所有属性 改为get和set方法
            new Observer(this.$data);
            //编译DOM节点 用元素和数据
            new Compiler(this.$el, this);
        }
    }

}