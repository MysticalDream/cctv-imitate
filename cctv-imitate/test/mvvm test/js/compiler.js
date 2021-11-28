class Compiler {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {
            //将真实的DOM树移到内存中
            let frag = this.nodeFragment(this.el);
            //提取元素中的v-model等和{{}}
            this.compile(frag);
            //把编译后的文档片段放回容器
            this.el.appendChild(frag);
        }
    }
    /*辅助方法 */
    isElementNode(node) {
        return node.nodeType === 1;
    }
    //是否是指令
    isInstruction(attr) {
        return attr.includes("v-");
    }
    /*核心方法 */
    compileElement(elem) {
        //带有 v-model的
        let attr = elem.attributes;
        Array.from(attr).forEach((element) => {
            //判断属性名是否带有 v-
            let attrName = element.name;
            if (this.isInstruction(attrName)) {
                //取到对应的值到节点 
                let exp = element.value;
                let name = attrName.substring(2);
                //element this.vm.$data exp
                CompilerUtil[name](elem, this.vm, exp);
            }
        });
    }
    compileText(textNode) {
        //取到文本节点的内容
        let text = textNode.textContent;
        //可能有 {{1}} {{2}} {{3}}这种情况
        let reg = /\{\{([^}]+)\}\}/g;//执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）
        if (reg.test(text)) {
            //textNode this.vm.$data text
            CompilerUtil['text'](textNode, this.vm, text);
        }
    }
    //编译文档片段
    compile(frag) {
        let childNodes = frag.childNodes;
        childNodes.forEach(element => {
            //判断是否是元素节点还是文本节点
            if (element.nodeType === 1) {
                //是元素节点编译元素解析属性
                this.compileElement(element);
                //继续递归编译（子节点可能还有）
                this.compile(element);
            }
            //element.nodeType === 3
            else {
                this.compileText(element);
            }
        });
    }
    nodeFragment(el) {
        //文档片段存放dom节点
        //DocumentFragment 不是真实 DOM 树的一部分，它的变化不会触发 DOM 树的重新渲染
        let frag = document.createDocumentFragment();
        let first;
        while (first = el.firstChild) {
            frag.appendChild(first);
        }
        return frag;
    }
}





CompilerUtil = {
    text(node, vm, exp) {//文本
        let updateFunc = this.updater['textUpdate'];
        //[message.a.b] 拆解成数组一步一步取值
        let value = this.getTextValue(vm, exp);

        exp.replace(/\{\{([^}]+)\}\}/g, (...args) => {
            new Watcher(vm, args[1], (newValue) => {
                //当值变化时会调用callBack
                //如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                updateFunc && updateFunc(node, this.getTextValue());
            });
        });
        updateFunc && updateFunc(node, value);
    }
    , model(node, vm, exp) {//输入框
        let updateFunc = this.updater['modelUpdate'];
        //这里加入监控，数据变化就调用watcher的callback
        new Watcher(vm, exp, (newValue) => {
            //当值变化时会调用callBack
            updateFunc && updateFunc(node, newValue);
        });
        updateFunc && updateFunc(node, this.getValue(vm, exp));
    }
    , updater: {
        //更新文本
        textUpdate(node, value) {
            node.textContent = value;
        },
        //输入框更新
        modelUpdate(node, value) {
            node.value = value;
        }
    },
    getValue(vm, exp) {
        exps = exp.split('.');//[a,b,c]
        //对数组中的每个元素执行一个由您提供的reducer函数(升序执行) 即执行((vm.$data[a])[b])[c]
        //es5
        return exps.reduce((p, currentValue) => {
            return p[currentValue];
        }, vm.$data);
    }
    ,
    //获取文本结果
    getTextValue(vm, exp) {
        return exp.replace(/\{\{([^}]+)\}\}/g, (...args) => {
            return this.getValue(vm, args[1]);
        });
    }
}