// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"dom.js":[function(require,module,exports) {
window.dom = {
  //目标效果
  // 输入create("<div><span>你好</span></div>")
  // 自动创建好div和span
  //实现思路，直接把字符串写进InnerHTML
  // 用template是因为这个标签里可以容纳所有标签，
  // div标签里就不能放<tr></tr>标签，而template可以
  create: function create(string) {
    var container = document.createElement("template");
    container.innerHTML = String.prototype.trim.call(string); // 去掉多余空格

    return container.content.firstChild;
  },
  after: function after(node, newNode) {
    // 目标是在Node节点后面插入node2节点
    // 但是DOM只提供了insertBefore接口
    // 1 -> 3
    // 在1后面插入2, 等价于在3的前面插入2
    // 所以我们转换为在node的下一个节点的前面插入node2
    node.parentNode.insertBefore(newNode, node.nextSibling);
  },
  before: function before(node, newNode) {
    node.parentNode.insertBefore(newNode, node);
  },
  append: function append(parent, node) {
    parent.appendChild(node);
  },
  wrap: function wrap(node, newParent) {
    // 把Newparent 放到node前面
    // 把node append到newparent里
    // 目标: div1
    //        ↓----> div2
    // 变成  div1
    //        ↓----> div3
    //                ↓----> div2
    node.before.call(node, node, newParent);
    newParent.append(node);
  },
  remove: function remove(node) {
    node.parentNode.removeChild(node);
    return node;
  },
  // empty 把所有子节点删掉
  // 坑：childNodes.length每次的Length会变化
  empty: function empty(node) {
    // const {childNodes} = node 等价于const childNodes = node.childNodes
    var array = [];
    var x = node.firstChild;

    while (x) {
      array.push(dom.remove(node.firstChild));
      x = node.firstChild;
    }

    return array;
  },
  // 根据参数的个数，实现不同的函数，这叫函数的重载
  attr: function attr(node, name, value) {
    if (arguments.length === 3) {
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      return node.getAttribute(name);
    }
  },
  text: function text(node, string) {
    if (arguments.length === 2) {
      // 适配不同浏览器
      if ('innerText' in node) {
        //ie
        node.innerText = string;
      } else {
        // firefox / chrome
        node.textContent = string;
      }
    } else if (arguments.length === 1) {
      if ('innerText' in node) {
        //ie
        return node.innerText;
      } else {
        // firefox / chrome
        return node.textContent;
      }
    }
  },
  html: function html(node, string) {
    if (arguments.length === 2) {
      //修改
      node.innerHTML = string;
    } else if (arguments.length === 1) {
      // 获取内容
      return node.innerHTML;
    }
  },
  //改样式
  style: function style(node, name, value) {
    if (arguments.length === 3) {
      // dom.style(div, 'color', 'red')
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (typeof name === 'string') {
        //dom.style(test, 'border')
        // 获取某个css属性
        return node.style[name];
      }

      if (name instanceof Object) {
        //dom.style(test, {border: '1px solid red', color: 'blue'})
        var object = name;

        for (var key in object) {
          // key : border / color
          // node.style.border = ....
          // node.style.color = ...
          node.style[key] = object[key];
        }
      }
    }
  },
  class: {
    add: function add(node, className) {
      node.classList.add(className);
    },
    remove: function remove(node, className) {
      node.classList.remove(className);
    },
    has: function has(node, className) {
      return node.classList.contains(className);
    }
  },
  on: function on(node, eventName, fn) {
    node.addEventListener(eventName, fn);
  },
  off: function off(node, eventName, fn) {
    node.removeEventListener(eventName, fn);
  },
  // 根据选择器获取元素
  find: function find(selector, scope) {
    return (scope || document).querySelectorAll(selector);
  },
  parent: function parent(node) {
    return node.parentNode;
  },
  children: function children(node) {
    return node.children;
  },
  siblings: function siblings(node) {
    // 我父母所有孩子里不是我的，就是我的兄弟姐妹
    return Array.from(node.parentNode.children).filter(function (n) {
      return n !== node;
    });
  },
  next: function next(node) {
    var x = node.nextSibling;

    while (x && x.nodeType === 3) {
      // x 是文本
      x = x.nextSibling;
    }

    return x;
  },
  prev: function prev(node) {
    var x = node.previousSibling;

    while (x && x.nodeType === 3) {
      // x 是文本
      x = x.previousSibling;
    }

    return x;
  },
  each: function each(nodelist, fn) {
    for (var i = 0; i < nodelist.length; i++) {
      fn.call(null, nodelist[i]);
    }
  },
  index: function index(node) {
    var nodeList = dom.children(dom.parent(node));
    var i;
    console.dir(nodeList);
    console.log('---node');
    console.log(node);

    for (i = 0; i < nodeList.length; i++) {
      console.log(nodeList[i]);

      if (nodeList[i] === node) {
        return i;
      }
    }

    return -1; //表示没找到
  }
};
},{}]