// const div = dom.create('<div><span>你好</span></div>')
// dom.after(test, div)
//
// const div3 = dom.create('<div id="parent"></div>')
// dom.wrap(test, div3)
//
// let result = dom.empty(empty)
// console.dir(result)
//
//
// // 修改 <div id="test" title="hi">test</div>
// // #test的title属性值为 hello world
// dom.attr(test, 'title', 'hello world')
// const title = dom.attr(test, 'title')
// console.log(`title: ${title}`)
//
// dom.text(test, '我是新加的内容')
//
// dom.style(test, {border: '1px solid red', color: 'blue'})
// dom.style(test, 'border')
// dom.style(test, 'border', '1px solid red')
//
// dom.class.add(test, 'red')
// dom.class.add(test, 'blue')
// dom.class.remove(test, 'red')
// dom.class.has(test, 'blue')
//
//
// // test.addEventListener('click')
// // 改成
// // test.on(node, 'click', fn)
//
// const fn = ()=>{
//     console.log("点击了")
// }
// dom.on(test, 'click', fn)
//
// dom.off(test, 'click', fn)
//
// const testDiv = dom.find('#test')[0]
// console.dir(testDiv)

//只在testDiv里找red类
// const testDiv2 = dom.find('.test2')[0]
// let res = dom.find('.red', testDiv2)[0]
// console.log(res)
//
// dom.parent(testDiv2)
//
// console.log(dom.siblings(e1))
// console.log(dom.next(e1))
// console.log(dom.prev(e1))
// console.log(dom.prev(e2))


// const t = dom.find("#travel")
// console.dir(t)
// console.log(t.children)
// dom.each(dom.children(t), (n)=>dom.style(n, 'color', 'red'))

// const t = dom.find('#travel')
// dom.each(dom.children(t), (n)=> dom.style(n, 'color', 'red'))

// const t1 = dom.find('#t1')
// console.log(t1)
console.log(dom.index(t1))