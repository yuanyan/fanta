## Fanta.js - when function met fanta

### What is fanta ?

Fanta是关于 *JavaScript函数式编程的原生扩展库* 。Fanta与 [prototype.js](http://prototypejs.org/) 的实现方式一致都扩展了原生的宿主对象，
这是被一些作者认为是evil的事情，因为扩展 `Array.prototype`, `Object.prototype` 等原生对象会带来容易被忽略的副作用，但Fanta的确这样做了，
理由很简单，相比其他方式扩展原生带来的编程流畅性，会使编程的体验更愉悦，就仿佛一瓶芬达入肚，一气呵成。况且在编程中，当需要用` for in `遍历对象时，
我们建议都应通过 `hasOwnProperty` 方法来判断获取到的属性是否为该对象的属性，而非原型对象属性。这促使Fanta实现选择了扩展原生的方式。

### What is fanta not ?

Fanta不是JavaScript框架，它不提供常见框架所具有的DOM节点的操作，Ajax请求，动画等一些特性。这与 [Underscore.js](http://documentcloud.github.com/underscore/)
的定位比较类似，让Fanta与其他框架相辅相成。

### Fanta api

####bind(scope, arg1, arg2,...) {  return Function  }

方法绑定

```javascript
 function func(){
     return this;
 }
 function func2(arg1, arg2){
     return arg2;
 }
 func.bind("scope")()  // -> 'scope'
 func2.bind("scope", "arg1")("arg2") // -> 'arg2'
```
####bindAsEventListener(scope, arg1, arg2,...) {  return Function  }

绑定为事件回调方法

```javascript
 function click(evt, output){
     console.log(output);
 }
 var handler = click.bindAsEventListener(button，"be clicked");
 document.addEventListener(button, "click",  handler); // 每次点击时输出“be clicked"
```
####curry(arg1, arg2, ...) {  return Function  }

柯里化

```javascript
function foo() {
     return toArray(arguments);
};
// 柯里化
var bar = foo.curry(1,2);
bar(3);   // -> [1,2，3]
bar(3,4,5); // -> [1,2，3，4，5]
```
####rightCurry(arg1, arg2, ...) {  return Function  }

右柯里化

```javascript
function foo() {
     return toArray(arguments);
};
// 右柯里化
var bar = foo.rightCurry(1,2);
bar(3);   // -> [3,1,2]
bar(3,4,5); // -> [3,4,5,1,2]
```
####interval([delay] = 1) {  return Function  }

生成间隔执行当前方法的定时器

```javascript
function foo(v){
   console.log(v);
}
// 间隔1秒执行
var barTimer = foo.interval(1000)(1); // -> 1
// 取消间隔执行
barTimer.cancel();
// 间隔2秒执行
var barTimer2 = foo.interval(2000);
barTimer2(2); // -> 2
// 取消间隔执行
barTimer2.cancel();
```
####delay([wait] = 1) {  return Function  }

生成延迟执行当前方法的定时器

```javascript
  function foo(arg) {
     console.log(arg);
  }
  // 延迟1秒后执行
  var fooTimer = foo.delay(1000)(1); // -> 1

  // 取消延迟执行
  fooTimer.cancel();
  function bar(v) {
     console.log(v);
  }
  var barTimer = bar.delay(1000);
  // 执行3次, 每次延迟执行1秒
  [1,2,3].forEach(barTimer); // -> 1 2 3
  barTimer.cancel(); // 取消所有的延迟执行
```
####defer() {  return result  }

推迟到当前程序执行堆栈为空时执行函数

```javascript
(function(){return 'called'}).defer(); // -> 'called'
```
####debounce([wait] = 100) {  return Function  }

生成一个函数当被连续的重复调用时，将以上一次调用时间为基线的指定时间后延迟执行，常用于事件处理

```javascript
var lazyLayout = calculateLayout.debounce(300);
$(window).resize(lazyLayout);
```
####count(times) {  return Function  }

生成一个函数当被调用了指定次数后才执行

```javascript
function foo(){console.log('done')};
var foo2 = foo.count(10);
foo.exec(10); // print 'done'
```
####once() {  return Function  }

生成一个函数无论被调用多少次但只执行一次

```javascript
var tmp = 0;
function foo(){ return ++tmp;}
var bar = foo.once();
bar(); // -> 1
bar(); // -> 1
```
####wrap(wrapper) {  return Function  }

生成一个函数在原函数执行前后添加额外的执行

```javascript
function foo(){return 'foo'}
function wrapper(fn){ return "foo"+fn()+"foo";}
(foo.wrap(wrapper))(); // -> foofoofoo
```
####before(advice) {  return Function  }

在函数执行前注入

```javascript
function foo(){console.log("foo")}
var foo2 = foo.before(function(){console.log("before")})
foo2(); // print 'before' 'foo'
```
####after(advice) {  return Function  }

在函数执行后注入

```javascript
function foo(){console.log("foo")}
var foo2 = foo.after(function(){console.log("after")})
foo2(); // print  'foo' 'after'
```
####around(advice) {  return Function  }

在函数执行前后注入

```javascript
function foo(){console.log("foo")}
var foo2 = foo.around(function(){console.log("around")})
foo2(); // print 'around' 'foo' 'around'
```
####lock() {  return Function  }

生成一个函数，执行时忽略所有的传入的参数

```javascript
function foo(x){return x||2}
var foo2 = foo.lock();
foo2(1); // -> 2
```
####sandbox() {  return Function  }

在沙箱中执行函数，使函数异常时不会影响其他程序执行

```javascript
function foo(){throw Error('err')}
function bar(){console.log('ok')}
(foo.sandbox())(); bar(); // -> print 'ok'
foo();bar(); // nothing print
```
####memoize(hasher) {  return Function  }

保存函数计算结果

```javascript
var fibonacci = (function(n) {
 return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}).memoize();
fibonacci(10); // -> 55
```
####exec([times] = 1) {  return Number  }

执行指定次数

```javascript
function foo(){}
foo.exec(100);
```
####Function.S(f,g) {  return Function  }

组合子S，函数应用的组合子

####Function.K(value) {  return Function  }

组合子K，生成一个常数函数,永远返回指定的值

####Function.I(value) {  return value  }

组合子I，恒等函数

####Function.isFunction(obj) {  return Boolean  }

判断是否为函数

```javascript
function foo(){}
Function.isFunction(foo); // -> true
Function.isFunction(1); // ->false
```
####Function.EMPTY { }

空函数

```javascript
  var onSuccess = callback || Function.EMPTY
```
####Function.error(message) {  return Function  }

创建一个方法执行时抛出指定错误信息

```javascript
 var deprecated = Function.error("deprecated method");
```
####Function.constant(value) {  return Function  }

生成一个常数函数,永远返回指定的值

```javascript
 Function.constant("invalid")(); // => "invalid"
```
####Function.identity { }

恒等函数

####Function.flow(...functions) {  return Function  }

阻塞线程的函数串行化执行，返回最后一个函数的执行结果如 (Function.flow(f, g))(x) 执行结果等同于 f(x);g(x);

```javascript
function foo(val){return ++val;}
function bar(val){return val*val;}
(Function.flow(foo, bar))(10); // => 100
```
####Function.chain(...functions) {  return Function  }

与flow的执行结果相同，但chain的执行是非阻塞的

```javascript
function foo(val){ ++val; }
function bar(val){ val*val;}
var worker = (Function.chain(foo, bar))(10); // => 100
worker.hasCompleted();
```
####Function.compose(...functions) {  return Function  }

后面函数执行的返回结果是前面函数执行的参数，以此规则类推。如 (Function.compose(f, g))(x) 执行结果等同于 f(g(x)).

```javascript
function foo(val){return ++val;}
function bar(val){return val*val;}
(Function.compose(foo, bar))(10) // => 101
```
####Function.or(...functions) {  return Function  }

按参数顺序执行函数，其中遇到任意函数执行返回结果为真时中断执行并返回true,否则返回false.如 (Function.or(f, g))(x); 执行结果等同于 f(x) || g(x);

```javascript
 function foo(){return false;}
 function bar(){return false;}
 (Function.or(foo, bar))(1); // => false
 function foo2(){return false;}
 function bar2(){return true;}
 (Function.or(foo2, bar2))(1); // => true
```
####Function.and(...functions) {  return Function  }

按参数顺序执行函数，其中遇到任意函数执行返回结果不为真时中断执行并返回false,否则返回true如 (Function.and(f, g))(x); 执行结果等同于 f(x) && g(x);

```javascript
 function foo(){return ture;}
 function bar(){return ture;}
 (Function.and(foo, bar))(1); // => true

 function foo2(){return false;}
 function bar2(){return ture;}
 (Function.and(foo, bar, foo2, bar2))(1); // => false
```
####lambda() {  return Function  }

lambda表达式是一个匿名函数，表达式由参数列表与表达式体组成；

```javascript
'x -> x + 1'.lambda()(1) // -> 2
'x y -> x + 2*y'.lambda()(1, 2) // -> 5
'x, y -> x + 2*y'.lambda()(1, 2) // -> 5
'x -> y -> x + 2*y'.lambda()(1)(2); // -> 5
'_ + 1'.lambda()(1) // -> 2
'/2'.lambda()(4) // -> 2
'2/'.lambda()(4) // -> 0.5
'/'.lambda()(2,4) // -> 0.5
'Math.cos(angle)'.lambda()(Math.PI) // -> -1
'point.x'.lambda()({x:1, y:2}) // -> 1
'({x:1, y:2})[key]'.lambda()('x') // -> 1
```
####apply(thisArg, args) {  return result  }

Lambda表达式的apply方法

```javascript
'x+1'.apply(null, [2]); // -> 3
'/'.apply(null, [2, 4]); // -> 1/2
```
####call(thisArg, ...args) {  return result  }

Lambda表达式的call方法

```javascript
'x+1'.call(null, 2); // -> 3
'/'.call(null, 2, 4); // -> 1/2
```

###License

(The MIT License)

Copyright (c) 2010-2012 yuanyan <yuanyan.cao@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.