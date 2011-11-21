var docs = {
    "auth": "yuanyan",
    "methods": [
        {
            "desc": "方法绑定",
            "method": "bind(scope, arg1, arg2,...)",
            "ret": "Function",
            "example": " function func(){\n     return this;\n }\n function func2(arg1, arg2){\n     return arg2;\n }\n func.bind(\"scope\")()  // -> 'scope'\n func2.bind(\"scope\", \"arg1\")(\"arg2\") // -> 'arg2'"
        },
        {
            "desc": "绑定为事件回调方法",
            "method": "bindAsEventListener(scope, arg1, arg2,...)",
            "ret": "Function",
            "example": " function click(evt, output){\n     console.log(output);\n }\n var handler = click.bindAsEventListener(button，\"be clicked\");\n document.addEventListener(button, \"click\",  handler); // 每次点击时输出“be clicked\""
        },
        {
            "desc": "柯里化",
            "method": "curry(arg1, arg2, ...)",
            "ret": "Function",
            "example": "function foo() {\n     return toArray(arguments);\n};\n// 柯里化\nvar bar = foo.curry(1,2);\nbar(3);   // -> [1,2，3]\nbar(3,4,5); // -> [1,2，3，4，5]"
        },
        {
            "desc": "右柯里化",
            "method": "rightCurry(arg1, arg2, ...)",
            "ret": "Function",
            "example": "function foo() {\n     return toArray(arguments);\n};\n// 右柯里化\nvar bar = foo.rightCurry(1,2);\nbar(3);   // -> [3,1,2]\nbar(3,4,5); // -> [3,4,5,1,2]"
        },
        {
            "desc": "生成间隔执行当前方法的定时器",
            "method": "interval([delay] = 1)",
            "ret": "Function",
            "example": "function foo(v){\n   console.log(v);\n}\n// 间隔1秒执行\nvar barTimer = foo.interval(1000)(1); // -> 1\n// 取消间隔执行\nbarTimer.cancel();\n\n// 间隔2秒执行\nvar barTimer2 = foo.interval(2000);\nbarTimer2(2); // -> 2\n// 取消间隔执行\nbarTimer2.cancel();\n"
        },
        {
            "desc": "生成延迟执行当前方法的定时器",
            "method": "delay([wait] = 1)",
            "ret": "Function",
            "example": "  function foo(arg) {\n     console.log(arg);\n  }\n  // 延迟1秒后执行\n  var fooTimer = foo.delay(1000)(1); // -> 1\n  \n  // 取消延迟执行\n  fooTimer.cancel();\n  function bar(v) {\n     console.log(v);\n  }\n  var barTimer = bar.delay(1000);\n  // 执行3次, 每次延迟执行1秒\n  [1,2,3].forEach(barTimer); // -> 1 2 3\n  barTimer.cancel(); // 取消所有的延迟执行"
        },
        {
            "desc": "推迟到当前程序执行堆栈为空时执行函数",
            "method": "defer()",
            "ret": "result",
            "example": "(function(){return 'called'}).defer(); // -> 'called'"
        },
        {
            "desc": "生成一个函数当被连续的重复调用时，将以上一次调用时间为基线的指定时间后延迟执行，常用于事件处理",
            "method": "debounce([wait] = 100)",
            "ret": "Function",
            "example": "var lazyLayout = calculateLayout.debounce(300);\n$(window).resize(lazyLayout);"
        },
        {
            "desc": "生成一个函数当被调用了指定次数后才执行",
            "method": "count(times)",
            "ret": "Function",
            "example": "\nfunction foo(){console.log('done')};\nvar foo2 = foo.count(10);\nfoo.exec(10); // print 'done'\n"
        },
        {
            "desc": "生成一个函数无论被调用多少次但只执行一次",
            "method": "once()",
            "ret": "Function",
            "example": "var tmp = 0;\nfunction foo(){ return ++tmp;}\nvar bar = foo.once();\nbar(); // -> 1\nbar(); // -> 1"
        },
        {
            "desc": "生成一个函数在原函数执行前后添加额外的执行",
            "method": "wrap(wrapper)",
            "ret": "Function",
            "example": "function foo(){return 'foo'}\nfunction wrapper(fn){ return \"foo\"+fn()+\"foo\";}\n(foo.wrap(wrapper))(); // -> foofoofoo"
        },
        {
            "desc": "在函数执行前注入",
            "method": "before(advice)",
            "ret": "Function",
            "example": "\nfunction foo(){console.log(\"foo\")}\nvar foo2 = foo.before(function(){console.log(\"before\")})\nfoo2(); // print 'before' 'foo'"
        },
        {
            "desc": "在函数执行后注入",
            "method": "after(advice)",
            "ret": "Function",
            "example": "function foo(){console.log(\"foo\")}\nvar foo2 = foo.after(function(){console.log(\"after\")})\nfoo2(); // print  'foo' 'after'"
        },
        {
            "desc": "在函数执行前后注入",
            "method": "around(advice)",
            "ret": "Function",
            "example": "\nfunction foo(){console.log(\"foo\")}\nvar foo2 = foo.around(function(){console.log(\"around\")})\nfoo2(); // print 'around' 'foo' 'around'"
        },
        {
            "desc": "生成一个函数，执行时忽略所有的传入的参数",
            "method": "lock()",
            "ret": "Function",
            "example": "function foo(x){return x||2}\nvar foo2 = foo.lock();\nfoo2(1); // -> 2"
        },
        {
            "desc": "在沙箱中执行函数，使函数异常时不会影响其他程序执行",
            "method": "sandbox()",
            "ret": "Function",
            "example": "function foo(){throw Error('err')}\nfunction bar(){console.log('ok')}\n(foo.sandbox())(); bar(); // -> print 'ok'\nfoo();bar(); // nothing print"
        },
        {
            "desc": "保存函数计算结果",
            "method": "memoize(hasher)",
            "ret": "Function",
            "example": "var fibonacci = (function(n) {\n return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);\n}).memoize();\nfibonacci(10); // -> 55"
        },
        {
            "desc": "执行指定次数",
            "method": "exec([times] = 1)",
            "ret": "Number",
            "example": "function foo(){}\nfoo.exec(100);"
        },
        {
            "desc": "组合子S，函数应用的组合子",
            "method": "Function.S(f,g)",
            "ret": "Function"
        },
        {
            "desc": "组合子K，生成一个常数函数,永远返回指定的值",
            "method": "Function.K(value)",
            "ret": "Function"
        },
        {
            "desc": "组合子I，恒等函数",
            "method": "Function.I(value)",
            "ret": "value"
        },
        {
            "desc": "判断是否为函数",
            "method": "Function.isFunction(obj)",
            "ret": "Boolean",
            "example": "function foo(){}\nFunction.isFunction(foo); // -> true\nFunction.isFunction(1); // ->false"
        },
        {
            "desc": "空函数",
            "method": "Function.EMPTY",
            "ret": null,
            "example": "  var onSuccess = callback || Function.EMPTY"
        },
        {
            "desc": "创建一个方法执行时抛出指定错误信息",
            "method": "Function.error(message)",
            "ret": "Function",
            "example": " var deprecated = Function.error(\"deprecated method\");"
        },
        {
            "desc": "生成一个常数函数,永远返回指定的值",
            "method": "Function.constant(value)",
            "ret": "Function",
            "example": " Function.constant(\"invalid\")(); // => \"invalid\""
        },
        {
            "desc": "恒等函数",
            "method": "Function.identity",
            "ret": null
        },
        {
            "desc": "阻塞线程的函数串行化执行，返回最后一个函数的执行结果如 (Function.flow(f, g))(x) 执行结果等同于 f(x);g(x);",
            "method": "Function.flow(...functions)",
            "ret": "Function",
            "example": "function foo(val){return ++val;}\nfunction bar(val){return val*val;}\n(Function.flow(foo, bar))(10); // => 100\n"
        },
        {
            "desc": "与flow的执行结果相同，但chain的执行是非阻塞的",
            "method": "Function.chain(...functions)",
            "ret": "Function",
            "example": "function foo(val){ ++val; }\nfunction bar(val){ val*val;}\nvar worker = (Function.chain(foo, bar))(10); // => 100\nworker.hasCompleted();"
        },
        {
            "desc": "后面函数执行的返回结果是前面函数执行的参数，以此规则类推。如 (Function.compose(f, g))(x) 执行结果等同于 f(g(x)).",
            "method": "Function.compose(...functions)",
            "ret": "Function",
            "example": "function foo(val){return ++val;}\nfunction bar(val){return val*val;}\n(Function.compose(foo, bar))(10) // => 101"
        },
        {
            "desc": "按参数顺序执行函数，其中遇到任意函数执行返回结果为真时中断执行并返回true,否则返回false.如 (Function.or(f, g))(x); 执行结果等同于 f(x) || g(x);",
            "method": "Function.or(...functions)",
            "ret": "Function",
            "example": " function foo(){return false;}\n function bar(){return false;}\n (Function.or(foo, bar))(1); // => false\n function foo2(){return false;}\n function bar2(){return true;}\n (Function.or(foo2, bar2))(1); // => true"
        },
        {
            "desc": "按参数顺序执行函数，其中遇到任意函数执行返回结果不为真时中断执行并返回false,否则返回true如 (Function.and(f, g))(x); 执行结果等同于 f(x) && g(x);",
            "method": "Function.and(...functions)",
            "ret": "Function",
            "example": " function foo(){return ture;}\n function bar(){return ture;}\n (Function.and(foo, bar))(1); // => true\n \n function foo2(){return false;}\n function bar2(){return ture;}\n (Function.and(foo, bar, foo2, bar2))(1); // => false"
        },
        {
            "desc": "lambda表达式是一个匿名函数，表达式由参数列表与表达式体组成；",
            "method": "lambda()",
            "ret": "Function",
            "example": "'x -> x + 1'.lambda()(1) // -> 2\n'x y -> x + 2*y'.lambda()(1, 2) // -> 5\n'x, y -> x + 2*y'.lambda()(1, 2) // -> 5\n'x -> y -> x + 2*y'.lambda()(1)(2); // -> 5\n'_ + 1'.lambda()(1) // -> 2\n'/2'.lambda()(4) // -> 2\n'2/'.lambda()(4) // -> 0.5\n'/'.lambda()(2,4) // -> 0.5\n'Math.cos(angle)'.lambda()(Math.PI) // -> -1\n'point.x'.lambda()({x:1, y:2}) // -> 1\n'({x:1, y:2})[key]'.lambda()('x') // -> 1"
        },
        {
            "desc": "Lambda表达式的apply方法",
            "method": "apply(thisArg, args)",
            "ret": "result",
            "example": "'x+1'.apply(null, [2]); // -> 3\n'/'.apply(null, [2, 4]); // -> 1/2"
        },
        {
            "desc": "Lambda表达式的call方法",
            "method": "call(thisArg, ...args)",
            "ret": "result",
            "example": "'x+1'.call(null, 2); // -> 3\n'/'.call(null, 2, 4); // -> 1/2"
        }
    ]
}