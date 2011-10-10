/**
 * f1.js - an evil library for rock&roll
 * @author yuanyan
 */

;(function() {
    /**
     * 对象属性扩展
     * @private
     * @param target
     * @param name
     * @param method
     */
    function defineProperty(target, name, method) {
        
        // 不覆盖原有命名空间下的实现
        if(target[name]) return console&console.log&console.log(target,"target["+name+"] method hava existed,will not overwrite");

        // ES5 15.2.3.6 Object.defineProperty
        // NOTE: 在 IE 8 中实现了 Object.defineProperty 方法（未实现 Object.defineProperies），但只支持扩展DOM对象，否则会报错，
        // http://msdn.microsoft.com/en-us/library/dd548687(VS.85).aspx
        // http://kangax.github.com/es5-compat-table/
        if (Object.defineProperty && Object.defineProperties) {
            Object.defineProperty(target, name, { value: method, configurable: true, enumerable: false, writeable: true });
        } else {  
            target[name] = method;
        }
    }

    /**
     * 对象多属性扩展
     * @private
     * @param target
     * @param obj
     */
    function extend(target, obj) {
        for (var name in obj) {
            if(obj.hasOwnProperty(name))
                defineProperty.call(target, target, name, obj[name]);
        }
    }

    /**
     * 转化为数组
     * @private
     * @param arg
     * @param index
     */
    function toArray(arg, index){
        return Array.prototype.slice.call(arg, index)
    }



    extend(Function.prototype, {

        /**
         * 方法绑定
         * @method bind(scope, arg1, arg2,...)
         * @return Function
         * @example
         *
         *  function func(){
         *      return this;
         *  }
         *
         *  function func2(arg1, arg2){
         *      return arg2;
         *  }
         *
         *  func.bind("scope")()  // -> 'scope'
         *  func2.bind("scope", "arg1")("arg2") // -> 'arg2'
         *
         *
         */
        "bind": function(scope) {
            var fn = this, args = toArray(arguments, 1), nop, bound;
            if (!Function.isFunction(this)) {
                throw new TypeError('Function.prototype.bind called on a non-function');
            }
            bound = function() {
                return fn.apply(fn.prototype && this instanceof fn ? this : scope, args.concat(Array.prototype.slice.call(arguments)));
            }
            nop = function() {
            };
            nop.prototype = this.prototype;
            bound.prototype = new nop();
            return bound;
        },

        /**
         * 绑定为事件回调方法
         * @method bindAsEventListener(scope, arg1, arg2,...)
         * @return Function
         * @example
         *  function click(evt, output){
         *      console.log(output);
         *  }
         *  var handler = click.bindAsEventListener(button，"be clicked");
         *  document.addEventListener(button, "click",  handler); // 每次点击时输出“be clicked"
         */
        "bindAsEventListener": function(scope) {
            var fn = this, args = toArray(arguments, 1);

            return function(event) {
                return fn.apply(scope, [event].concat(args));
            };
        },
        
        // http://en.wikipedia.org/wiki/Currying
        /**
         * 柯里化
         * @method curry(arg1, arg2, ...)
         * @return Function
         * @example
         * function foo() {
         *      return toArray(arguments);
         * };
         *
         * // 柯里化
         * var bar = foo.curry(1,2);
         *
         * bar(3);   // -> [1,2，3]
         * bar(3,4,5); // -> [1,2，3，4，5]
         */
        "curry": function() {
            var args = toArray(arguments);
            return this.bind.apply(this, [this].concat(args));
        },


        /**
         * 右柯里化
         * @method rightCurry(arg1, arg2, ...)
         * @return Function
         * @example
         * function foo() {
         *      return toArray(arguments);
         * };
         *
         * // 右柯里化
         * var bar = foo.rightCurry(1,2);
         *
         * bar(3);   // -> [3,1,2]
         * bar(3,4,5); // -> 【3,4,5,1,2]
         *
         */
        "rightCurry": function() {
            var fn = this, args = toArray(arguments);

            return function() {
                return fn.apply(fn, toArray(arguments).concat(args));
            };
        },

        /**
         * 生成间隔执行当前方法的定时器
         * @method interval([delay] = 1)
         * @return Function
         * @example
         *
         * function foo(v){
         *    console.log(v);
         * }
         * // 间隔1秒执行
         * var barTimer = foo.interval(1000)(1); // -> 1
         * // 取消间隔执行
         * barTimer.cancel();
         * 
         * // 间隔2秒执行
         * var barTimer2 = foo.interval(2000);
         * barTimer2(2); // -> 2
         * // 取消间隔执行
         * barTimer2.cancel();
         * 
         */
        "interval": function( between ) {
            var fn = this, timers = [];
            if(between === undefined) between = 1;

            function interval() {

                var t = new Number(setInterval(fn.bind.apply(fn, [fn].concat(arguments)), between));
                timers.push( t );
                // clearInterval 
                t.cancel = function(){
                    clearInterval(this);
                }

                return t;
            }
            
            interval.cancel = function(){
                var timer;
                while(timer = timers.shift()){
                    clearTimeout(timer);
                }
            }
            return interval;
        },

        /**
         * 生成延迟执行当前方法的定时器
         * @method delay([wait] = 1)
         * @return Function
         * @example
         *
         *   function foo(arg) {
         *      console.log(arg);
         *   }
         *   // 延迟1秒后执行
         *   var fooTimer = foo.delay(1000)(1); // -> 1
         *   
         *   // 取消延迟执行
         *   fooTimer.cancel();
         *
         *   function bar(v) {
         *      console.log(v);
         *   }
         *
         *   var barTimer = bar.delay(1000);
         *
         *   // 执行3次, 每次延迟执行1秒
         *   [1,2,3].forEach(barTimer); // -> 1 2 3
         *
         *   barTimer.cancel(); // 取消所有的延迟执行
         *
         *
         */
        'delay': function(wait) {
            var fn = this, run = 0, timers = [];
            if(wait === undefined) wait = 1;

            function delay() {
                var t = new Number(setTimeout( fn.bind.apply(fn, [fn].concat(arguments) ), ++run * wait ));
                timers.push( t );
                // clearTimout
                t.cancel = function(){
                    clearTimeout(this);
                }
                return t;
            }

            delay.cancel = function(){
                var timer;
                while(timer = timers.shift()){
                    clearTimeout(timer);
                }
            }

            return delay;
        },

        /**
         * 推迟到当前程序执行堆栈为空时执行函数
         * @method defer()
         * @return result
         * @example
         * (function(){return 'called'}).defer(); // -> 'called'
         */
        "defer": function() {
            return this.delay(1).apply(this, arguments);
        },

        /**
         * 生成一个函数当被连续的重复调用时，将以上一次调用时间为基线的指定时间后延迟执行，常用于事件处理
         * @method debounce([wait] = 100)
         * @return Function
         * @example
         *
         * var lazyLayout = calculateLayout.debounce(300);
         * $(window).resize(lazyLayout);
         *
         */
        'debounce': function(wait) {
            var fn = this;
                timer = 0;

            var debounce = function() {
                var args = arguments;
                if(timer) { clearTimeout(timer) };
                timer = setTimeout(function() {
                    fn.apply(fn, args);
                }, wait||100);
            };

            return debounce;
        },

        /**
         * 生成一个函数当被调用了指定次数后才执行
         * @method count(times)
         * @return Function
         * @example
         * 
         * function foo(){console.log('done')};
         * var foo2 = foo.count(10);
         * foo.exec(10); // print 'done'
         * 
         */
        'count': function(times) {
            var fn = this;
            return function() {
                if (--times < 1) {
                    return fn.apply(this, arguments);
                }
            };
        },

        /**
         * 生成一个函数无论被调用多少次但只执行一次
         * @method once()
         * @return Function
         * @example
         *
         * var tmp = 0;
         * function foo(){ return ++tmp;}
         * var bar = foo.once();
         * bar(); // -> 1
         * bar(); // -> 1
         */
        'once' : function() {
            var fn = this, ran = false, memo;
            return function() {
                if (ran) return memo;
                ran = true;
                return memo = fn.apply(this, arguments);
            };
        },



        // AOP

        /**
         * 生成一个函数在原函数执行前后添加额外的执行
         * @method wrap(wrapper)
         * @return Function
         * @example
         * function foo(){return 'foo'}
         * function wrapper(fn){ return "foo"+fn()+"foo";}
         *
         * (foo.wrap(wrapper))(); // -> foofoofoo
         *
         */
        'wrap' : function(wrapper) {
            var fn = this;
            return function() {
                return wrapper.call(this, fn);
            };
        },

        /**
         * 在函数执行前注入
         * @method before(advice)
         * @return Function
         * @example
         * 
         * function foo(){console.log("foo")}
         * var foo2 = foo.before(function(){console.log("before")})
         * foo2(); // print 'before' 'foo'
         */
        'before': function(advice){
            var fn = this;
            return function() {
                advice();
                return fn();
            };
        },
        /**
         * 在函数执行后注入
         * @method after(advice)
         * @return Function
         * @example
         *
         * function foo(){console.log("foo")}
         * var foo2 = foo.after(function(){console.log("after")})
         * foo2(); // print  'foo' 'after'
         */
        'after': function(advice){
            var fn = this;
            return function() {
                var ret = fn();
                advice();
                return ret;
            };
        },

        /**
         * 在函数执行前后注入
         * @method around(advice)
         * @return Function
         * @example
         * 
         * function foo(){console.log("foo")}
         * var foo2 = foo.around(function(){console.log("around")})
         * foo2(); // print 'around' 'foo' 'around'
         */
        'around': function(advice){
            var fn = this;
            return function() {
                advice();
                var ret = fn();
                advice();
                return ret;
            };
        },

        // safe function

        /**
         * 生成一个函数，执行时忽略所有的传入的参数
         * @method lock()
         * @return Function
         * @example
         *
         * function foo(x){return x||2}
         * var foo2 = foo.lock();
         * foo2(1); // -> 2
         */
        'lock': function() {
            var fn = this;
            return function() {
                return fn.call(fn);
            }

        },
        
        /**
         * 在沙箱中执行函数，使函数异常时不会影响其他程序执行
         * @method sandbox()
         * @return Function
         * @example
         * function foo(){throw Error('err')}
         * function bar(){console.log('ok')}
         *
         * (foo.sandbox())(); bar(); // -> print 'ok'
         * foo();bar(); // nothing print
         *
         */
        'sandbox': function() {
            var fn = this;
            return function() {
                try {
                    return fn.apply(this, arguments);
                } catch(e) {
                    setTimeout(function() {
                        throw e;
                    }, 0);
                }
            }

        },
        

        // performance

        /**
         * 保存函数计算结果
         * @method memoize(hasher)
         * @return Function
         * @example
         * var fibonacci = (function(n) {
         *  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
         * }).memoize();
         *
         * fibonacci(10); // -> 55
         */
        "memoize":function(hasher) {
            var fn = this;
            var memo = {};
            hasher || (hasher = Function.I);
            return function() {
                var key = hasher.apply(this, arguments);
                return Object.hasOwnProperty.call(memo, key) ? memo[key] : (memo[key] = fn.apply(this, arguments));
            };
        },
        
        /**
         * 执行指定次数
         * @method exec([times] = 1)
         * @return Number
         * @example
         *
         * function foo(){}
         * foo.exec(100);
         */
        'exec': function(times) {
            var fn = this,
                start = new Date;
            times = times || 1;

            for (var i = times ; i > 0 ; i--) {
                fn();
            }

            return (new Date - start);
        }

    });

     // SKI 组合子演算 http://zh.wikipedia.org/wiki/SKI%E7%B5%84%E5%90%88%E5%AD%90%E6%BC%94%E7%AE%97
    extend(Function,{

        /**
         * 组合子S，函数应用的组合子
         * @method Function.S(f,g)
         * @return Function
         */
        'S' : function(f, g) {

            return function() {
                return f.apply(this, [g.apply(this, arguments)].concat(toArray(arguments, 0)));
            };
        },



        /**
         * 组合子K，生成一个常数函数,永远返回指定的值
         * @method Function.K(value)
         * @return Function
         */
        'K' : function(value) {
            return function() {
                return value;
            };
        },

        /**
         * 组合子I，恒等函数
         * @method Function.I(value)
         * @return value
         */
        'I' : function(value){
            return value;
        }

    })


    extend(Function, {

        // 工具方法

        /**
         * 判断是否为函数
         * @method Function.isFunction(obj)
         * @return Boolean
         * @example
         *
         * function foo(){}
         * Function.isFunction(foo); // -> true
         * Function.isFunction(1); // ->false
         */
        'isFunction' : function(obj) {
            // typeof obj === "function"
            return Object.prototype.toString.call(obj) === "[object Function]";
        },

        /**
         * 空函数
         * @method Function.EMPTY
         * @return
         * @example
         *   var onSuccess = callback || Function.EMPTY
         */
        'EMPTY' : function() {
            //EMPTY
        },
        
        /**
         * 创建一个方法执行时抛出指定错误信息
         * @method Function.error(message)
         * @return Function
         * @example
         *  var deprecated = Function.error("deprecated method");
         */
        'error' : function(message) {
            return function() {
                throw Error(message);
            };
        },
        
        /**
         * 生成一个常数函数,永远返回指定的值
         * @method Function.constant(value)
         * @return Function
         * @example
         *  Function.constant("invalid")(); // => "invalid"
         */
        'constant' : Function.K,
        
        /**
         * 恒等函数
         * @method Function.identity
         *
         */
        'identity': Function.I,


        // 串行化

        /**
         * 阻塞线程的函数串行化执行，返回最后一个函数的执行结果
         * 如 (Function.flow(f, g))(x) 执行结果等同于 f(x);g(x);
         * @method Function.flow(...functions)
         * @return Function
         * @example
         * function foo(val){return ++val;}
         * function bar(val){return val*val;}
         * (Function.flow(foo, bar))(10); // => 100
         * 
         */
        'flow' : function(/*fn1,fn2,fn3...*/) {
            var args = arguments;

            return function() {
                var result;
                for (var i = 0,len = args.length; i < len; i++) {
                    result = args[i].apply(this, arguments);
                }
                return result;
            };
        },
        
        /**
         * 与flow的执行结果相同，但chain的执行是非阻塞的
         * @method Function.chain(...functions)
         * @return Function
         * @example
         * function foo(val){ ++val; }
         * function bar(val){ val*val;}
         * var worker = (Function.chain(foo, bar))(10); // => 100
         * worker.hasCompleted();
         *
         */
        'chain': function(/*fn1,fn2,fn3...*/) {
            var fn,
                args = toArray(arguments),
                todoes = args.length;
                
            var next = function () {
                if (!(fn = args.shift())) {
                    return;
                }

                var nextArgs = arguments;
                setTimeout(function() {
                    fn.apply(this, nextArgs);
                    --todoes;
                    next.apply(this, nextArgs);
                }, 100);

                return next;
            };

            next.hasCompleted = function(){
                return !todoes;
            };

            return next;
        },
        
        // 高阶函数

        /**
         * 后面函数执行的返回结果是前面函数执行的参数，以此规则类推。
         * 如 (Function.compose(f, g))(x) 执行结果等同于 f(g(x)).
         * @method Function.compose(...functions)
         * @return Function
         * @example
         * function foo(val){return ++val;}
         * function bar(val){return val*val;}
         * (Function.compose(foo, bar))(10) // => 101
         *
         */
        'compose' : function(/*fn1,fn2,fn3...*/) {
            var fns = arguments,
                length = fns.length;
            return function() {
                var result;
                if (length) {
                    result = fns[length - 1].apply(this, arguments);
                }

                for (var i = length - 2; i >= 0; i--) {
                    result = fns[i].call(this, result);
                }
                return result;
            };
        },

        // 谓词

        /**
         * 按参数顺序执行函数，其中遇到任意函数执行返回结果为真时中断执行并返回true,否则返回false.
         * 如 (Function.or(f, g))(x); 执行结果等同于 f(x) || g(x);
         * @method Function.or(...functions)
         * @return Function
         * @example
         *  function foo(){return false;}
         *  function bar(){return false;}
         *  (Function.or(foo, bar))(1); // => false
         *
         *  function foo2(){return false;}
         *  function bar2(){return true;}
         *  (Function.or(foo2, bar2))(1); // => true
         */
        'or' : function(/*fn1,fn2,fn3...*/) {
            var fns = arguments,
                length = fns.length;
            return function() {
                for (var i = 0; i < length; i++) {
                    if (fns[i].apply(this, arguments)) {
                        return true;
                    }
                }
                return false;
            };
        },

        /**
         * 按参数顺序执行函数，其中遇到任意函数执行返回结果不为真时中断执行并返回false,否则返回true
         * 如 (Function.and(f, g))(x); 执行结果等同于 f(x) && g(x);
         * @method Function.and(...functions)
         * @return Function
         * @example
         *  function foo(){return ture;}
         *  function bar(){return ture;}
         *  (Function.and(foo, bar))(1); // => true
         *  
         *  function foo2(){return false;}
         *  function bar2(){return ture;}
         *  (Function.and(foo, bar, foo2, bar2))(1); // => false
         */
        'and' : function(/*fn1,fn2,fn3...*/) {
            var fns = arguments,
                length = fns.length;

            return function() {
                for (var i = 0; i < length; i++) {
                    if (!fns[i].apply(this, arguments)) {
                        return false;
                    }
                }
                return true;
            };
        }

    });


    // lambda表达式
    // Copyright 2007 by Oliver Steele. http://osteele.com/javascripts/functional
    extend(String.prototype,{

        // IE6 split is not ECMAScript-compliant.  This breaks '->1'.lambda().
        // ECMAsplit is an ECMAScript-compliant `split`, although only for
        // one argument.
        'split' : 'ab'.split(/a*/).length > 1 ? String.prototype.split :
          function(separator, limit) {
             if (typeof limit != 'undefined')
                 throw "ECMAsplit: limit is unimplemented";
             var result = this.split.apply(this, arguments),
                 re = RegExp(separator),
                 savedIndex = re.lastIndex,
                 match = re.exec(this);
             if (match && match.index === 0)
                 result.unshift('');
             // in case `separator` was already a RegExp:
             re.lastIndex = savedIndex;
             return result;
         },
        
        /**
         * lambda表达式是一个匿名函数，表达式由参数列表与表达式体组成；
         * @method lambda()
         * @return Function
         * @example
         *
         * 'x -> x + 1'.lambda()(1) // -> 2
         * 'x y -> x + 2*y'.lambda()(1, 2) // -> 5
         * 'x, y -> x + 2*y'.lambda()(1, 2) // -> 5
         * 'x -> y -> x + 2*y'.lambda()(1)(2); // -> 5
         *
         * '_ + 1'.lambda()(1) // -> 2
         *
         * '/2'.lambda()(4) // -> 2
         * '2/'.lambda()(4) // -> 0.5
         * '/'.lambda()(2,4) // -> 0.5
         *
         * 'Math.cos(angle)'.lambda()(Math.PI) // -> -1
         * 'point.x'.lambda()({x:1, y:2}) // -> 1
         * '({x:1, y:2})[key]'.lambda()('x') // -> 1
         */
        'lambda':function(){
            var params = [],
                expr = this,
                sections = expr.split(/\s*->\s*/m);
            if (sections.length > 1) {
                while (sections.length) {
                    expr = sections.pop();
                    expr.match();
                    params = sections.pop().split(/\s*,\s*|\s+/m);
                    sections.length && sections.push('(function('+params+'){return ('+expr+')})');
                }
            } else if (expr.match(/\b_\b/)) {
                params = '_';
            } else {
                // test whether an operator appears on the left (or right), respectively
                var leftSection = expr.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m),
                    rightSection = expr.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);
                if (leftSection || rightSection) {
                    if (leftSection) {
                        params.push('$1');
                        expr = '$1' + expr;
                    }
                    if (rightSection) {
                        params.push('$2');
                        expr = expr + '$2';
                    }
                } else {
                    // `replace` removes symbols that are capitalized, follow '.',
                    // precede ':', are 'this' or 'arguments'; and also the insides of
                    // strings (by a crude test).  `match` extracts the remaining
                    // symbols.
                    var vars = this.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '').match(/([a-z_$][a-z_$\d]*)/gi) || []; // '
                    for (var i = 0, v; v = vars[i++]; )
                        params.indexOf(v) >= 0 || params.push(v);
                }
            }
            return new Function(params, 'return (' + expr + ')');
        },
        /**
         * Lambda表达式的apply方法
         * @method apply(thisArg, args)
         * @return result
         * @example
         * 'x+1'.apply(null, [2]); // -> 3
         * '/'.apply(null, [2, 4]); // -> 1/2
         */
        'apply': function(thisArg, args) {
            return this.lambda().apply(thisArg, args);
        },

        /**
         * Lambda表达式的call方法
         * @method call(thisArg, ...args)
         * @return result
         * @example
         * 'x+1'.call(null, 2); // -> 3
         * '/'.call(null, 2, 4); // -> 1/2
         */
        'call' : function(){
            return this.lambda().apply(arguments[0],toArray(arguments,1));
        }
        
    });



})();