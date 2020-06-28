window.dom = {
    //目标效果
    // 输入create("<div><span>你好</span></div>")
    // 自动创建好div和span
    //实现思路，直接把字符串写进InnerHTML
    // 用template是因为这个标签里可以容纳所有标签，
    // div标签里就不能放<tr></tr>标签，而template可以
    create(string) {
        const container = document.createElement("template")
        container.innerHTML = String.prototype.trim.call(string) // 去掉多余空格
        return container.content.firstChild
    },
    after(node, newNode) {
        // 目标是在Node节点后面插入node2节点
        // 但是DOM只提供了insertBefore接口
        // 1 -> 3
        // 在1后面插入2, 等价于在3的前面插入2
        // 所以我们转换为在node的下一个节点的前面插入node2
        node.parentNode.insertBefore(newNode, node.nextSibling)
    },
    before(node, newNode) {
        node.parentNode.insertBefore(newNode, node)
    },
    append(parent, node) {
        parent.appendChild(node)
    },
    wrap(node, newParent) {
        // 把Newparent 放到node前面
        // 把node append到newparent里
        // 目标: div1
        //        ↓----> div2
        // 变成  div1
        //        ↓----> div3
        //                ↓----> div2
        node.before.call(node, node, newParent)
        newParent.append(node)
    },
    remove(node) {
        node.parentNode.removeChild(node)
        return node
    },
    // empty 把所有子节点删掉
    // 坑：childNodes.length每次的Length会变化
    empty(node) {
        // const {childNodes} = node 等价于const childNodes = node.childNodes
        const array = []
        let x = node.firstChild
        while (x) {
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
    },
    // 根据参数的个数，实现不同的函数，这叫函数的重载
    attr(node, name, value) {
        if (arguments.length === 3) {
            node.setAttribute(name, value)
        } else if (arguments.length === 2) {
            return node.getAttribute(name)
        }
    },
    text(node, string) {
        if (arguments.length === 2) {
            // 适配不同浏览器
            if ('innerText' in node) { //ie
                node.innerText = string
            } else { // firefox / chrome
                node.textContent = string
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) { //ie
                return node.innerText
            } else { // firefox / chrome
                return node.textContent
            }
        }

    },
    html(node, string) {
        if (arguments.length === 2) {
            //修改
            node.innerHTML = string
        } else if (arguments.length === 1) {
            // 获取内容
            return node.innerHTML
        }
    },
    //改样式
    style(node, name, value) {
        if (arguments.length === 3) {
            // dom.style(div, 'color', 'red')
            node.style[name] = value
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                //dom.style(test, 'border')
                // 获取某个css属性
                return node.style[name]
            }

            if (name instanceof Object) {
                //dom.style(test, {border: '1px solid red', color: 'blue'})
                let object = name
                for (let key in object) {
                    // key : border / color
                    // node.style.border = ....
                    // node.style.color = ...
                    node.style[key] = object[key]
                }
            }
        }

    },
    class: {
        add(node, className) {
            node.classList.add(className)
        },
        remove(node, className) {
            node.classList.remove(className)
        },
        has(node, className) {
            return node.classList.contains(className)
        }
    },
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn)
    },
    // 根据选择器获取元素
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector)
    },
    parent(node) {
        return node.parentNode
    },
    children(node) {
        return node.children
    },
    siblings(node) {
        // 我父母所有孩子里不是我的，就是我的兄弟姐妹
        return Array.from(node.parentNode.children).filter(n => n !== node)
    },
    next(node) {
        let x = node.nextSibling
        while (x && x.nodeType === 3) {
            // x 是文本
            x = x.nextSibling
        }
        return x
    },
    prev(node) {
        let x = node.previousSibling
        while (x && x.nodeType === 3) {
            // x 是文本
            x = x.previousSibling
        }
        return x

    },
    each(nodelist, fn) {
        for (let i = 0; i < nodelist.length; i++) {
            fn.call(null, nodelist[i])
        }
    },
    index(node) {
        let nodeList = dom.children(dom.parent(node))
        let i
        console.dir(nodeList)
        console.log('---node')
        console.log(node)
        for (i = 0; i < nodeList.length; i++) {
            console.log(nodeList[i])
            if (nodeList[i] === node) {
                return i
            }
        }
       return -1 //表示没找到
    }


}

