describe("f1.js", function() {
	
	beforeEach(function() {  

	});
	
	
	it("Function.prototype.bind",function(){
	
		function func(){
			return this;
		}
		function func2(arg1, arg2){
			return arg2;
		}
		expect(func.bind("scope")()).toEqual('scope');
		expect(func2.bind("scope", "arg1", "arg2")()).toEqual('arg2');
		
	});
	
	it("Function.prototype.bindAsEventListener",function(){
	
		function func(event, arg1, arg2){
			return this;
		}

		function func2(event, arg1, arg2){			
			return [event, arg1, arg2];
		}
		
		expect(func.bindAsEventListener("scope")()).toEqual("scope");
		expect(func2.bindAsEventListener("scope", "arg1", "arg2")("event")).toEqual(["event","arg1","arg2"]);
		
	});

	it("Function.prototype.curry",function(){

		function func(arg1, arg2, arg3){			
			return [arg1, arg2, arg3];
		}
		
		expect( func.curry("arg1")("arg2") ).toEqual(['arg1','arg2',undefined]);
		expect( func.curry("arg1", "arg2")("arg3") ).toEqual(["arg1","arg2","arg3"]);
		
	});
	
	it("Function.prototype.rightCurry",function(){

		function func(arg1, arg2, arg3){			
			return [arg1, arg2, arg3];
		}
		
		expect( func.rightCurry("arg1")("arg2") ).toEqual(['arg2','arg1', undefined]);
		expect( func.rightCurry("arg1", "arg2")("arg3") ).toEqual(["arg3", "arg1", "arg2"]);
		
	});

	it("Function.prototype.rightCurry",function(){

		function func(arg1, arg2, arg3){			
			return [arg1, arg2, arg3];
		}
		
		expect( func.rightCurry("arg1")("arg2") ).toEqual(['arg2','arg1', undefined]);
		expect( func.rightCurry("arg1", "arg2")("arg3") ).toEqual(["arg3", "arg1", "arg2"]);
		
	});
	
	
	it("Function.prototype.interval",function(){

		runs(function(){
			this.func = jasmine.createSpy();
			this.timer = this.func.interval(100)(1,2,3);
		});
		
		waits(200);
		
		runs(function(){
			this.timer.cancel();
			expect( this.func ).toHaveBeenCalledWith( [1,2,3]);
		});
		
	});	

	it("Function.prototype.delay",function(){

		runs(function(){
			this.func = jasmine.createSpy();
			this.timer = this.func.delay(100)(1,2,3);
		});
		
		waits(200);
		
		runs(function(){
			this.timer.cancel();
			expect( this.func ).toHaveBeenCalledWith( [1,2,3]);
		});
		
	});

	it("Function.prototype.defer",function(){

		runs(function(){
			this.func = jasmine.createSpy();
			this.timer = this.func.defer(1,2,3);
		});

		waits(200);

		runs(function(){
			this.timer.cancel();
			expect( this.func ).toHaveBeenCalledWith( [1,2,3]);
		});

	});

	it("Function.prototype.debounce",function(){


        var tmp = 0;
        function foo(){++tmp;}
        var foo2 = foo.debounce(100);
        foo2.exec(10);
        
        
        waits(200);

        runs(function(){
            foo2()
            expect(tmp).toEqual(1);
        });

	});

	it("Function.prototype.count",function(){
        var tmp = 0;
        function foo(){return ++tmp;}
        var bar = foo.count(10);
        bar.exec(10);
        expect(tmp).toEqual(1);
	});
    
	it("Function.prototype.once",function(){

        var tmp = 0;
        function foo(){return ++tmp;}
        var bar = foo.once();
        expect(bar()).toEqual(1);
        expect(bar()).toEqual(1);
        expect(bar()).toEqual(1);
	});

	it("Function.prototype.wrap",function(){
         function foo(){return 'foo'}
         function wrapper(fn){ return "foo"+fn()+"foo";}

         expect(foo.wrap(wrapper)()).toEqual('foofoofoo'); // -> foofoofoo
        
	});

	it("Function.prototype.before",function(){
        function foo(){return 'foo'}
        var before = jasmine.createSpy();

        expect(foo.before(before)()).toEqual('foo');
        expect(before.wasCalled).toBeTruthy();

	});

	it("Function.prototype.after",function(){
        function foo(){return 'foo'}
        var after = jasmine.createSpy();

        expect(foo.after(after)()).toEqual('foo');

        expect(after.wasCalled).toBeTruthy();

	});

	it("Function.prototype.around",function(){
        function foo(){return 'foo'}
        var around = jasmine.createSpy();

        expect(foo.around(around)()).toEqual('foo');
        expect(around.wasCalled).toBeTruthy();

	});

	it("Function.prototype.lock",function(){
        
        function foo(x){return x||2}
        var foo2 = foo.lock();
        expect(foo2(1)).toEqual(2);

        
	});
	it("Function.prototype.sandbox",function(){
        function foo(){throw Error('err')}
        
        expect(function(){foo(); return 'ok';}).toThrow(Error('err'));

        foo = foo.sandbox();
        
        expect(function(){foo(); return 'ok';}()).toEqual('ok');

	});

	it("Function.prototype.memoize",function(){

        var fibonacci = (function(n) {
            return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
        }).memoize();

        expect(fibonacci(10)).toEqual(55);
	});


	it("Function.prototype.exec",function(){
        var total= 0;
        function foo(){return ++total;}
        foo.exec(1000);
        // expect(foo.exec(1000)).toBe(1000);
        expect(total).toBe(1000);

	});


    
    it("Function.isFunction",function(){

         function foo(){}
         expect( Function.isFunction(foo) ).toEqual( true ); // -> true
         expect( Function.isFunction(1) ).toEqual( false ); // ->false

	});

    it("Function.EMPTY",function(){


         expect( Function.EMPTY ).toBeTruthy( ); // -> true

	});


    it("Function.S",function(){


         expect( Function.S ).toBeTruthy( ); // -> true

	});
    it("Function.K",function(){


         expect( Function.K ).toBeTruthy( ); // -> true

	});
    it("Function.I",function(){


         expect( Function.I ).toBeTruthy( ); // -> true

	});

    it("Function.constant",function(){


         expect( Function.constant(1)(12) ).toEqual( 1 );

	});
    it("Function.identity",function(){

 
         expect( Function.identity(1) ).toEqual( 1 );

	});

     it("Function.isFunction",function(){

         function foo(){}
         expect( Function.isFunction(foo) ).toBeTruthy(  );
         expect( Function.isFunction(1) ).toBeFalsy(  );
         expect( Function.isFunction(new Function()) ).toBeTruthy(  );
         expect( Function.isFunction('') ).toBeFalsy(  );


	});
     it("Function.error",function(){

         function foo(){
             Function.error("error")()
         }
         expect( foo ).toThrow( Error("error") );

	});
     it("Function.flow",function(){
         function foo(val){return ++val;}
         function bar(val){return val*val;}

         expect((Function.flow(foo, bar))(10) ).toEqual( 100 );

	});
     it("Function.chain",function(){
         var total = 0;
         function foo(val){ total+=val; }
         function bar(val){ total+=val; }
         var next = Function.chain(foo,bar)(10);
         
        waitsFor(next.hasCompleted);

        runs(function () {
         expect( total ).toEqual( 20 );
        });

	});
    it("Function.compose",function(){
         function foo(val){return ++val;}
         function bar(val){return val*val;}

         expect((Function.compose(foo, bar))(10) ).toEqual( 101 ); //11*11

	});

    it("Function.or",function(){
         var total = 0;
         function foo(v){total+=v;return false;}
         function bar(v){total+=v;return false;}
         expect(Function.or(foo, bar)(1)).toBeFalsy(); // => false
         expect(total).toEqual(2);
         function foo2(v){total+=v;return true;}
         function bar2(v){total+=v;return false;}
         expect(Function.or(foo2, bar2)(1)).toBeTruthy(); // => true
         expect(total).toEqual(3);
	});
    it("Function.and",function(){
         var total = 0;
         function foo(v){total+=v;return false;}
         function bar(v){total+=v;return true;}
         expect(Function.and(foo, bar)(1)).toBeFalsy(); // => false
        expect(total).toEqual(1);
         function foo2(v){total+=v;return true;}
         function bar2(v){total+=v;return true;}
         expect(Function.and(foo2, bar2)(1)).toBeTruthy(); // => true
        expect(total).toEqual(3);
	});
    // lambda
    it("String.prototype.lambda", function(){

        expect('x -> x + 1'.lambda()(1)).toEqual(2);

        expect('x y -> x + 2*y'.lambda()(1, 2)).toEqual(5);

        expect('x, y -> x + 2*y'.lambda()(1, 2)).toEqual(5);

        expect('_ + 1'.lambda()(1)).toEqual(2);

        expect('/2'.lambda()(4)).toEqual(2);

        expect('2/'.lambda()(4)).toEqual(1/2);

        expect('/'.lambda()(2,4)).toEqual(1/2);

        expect('x + 1'.lambda()(1)).toEqual(2);

        expect('x + 2*y'.lambda()(1, 2)).toEqual(5);

        expect('y + 2*x'.lambda()(1, 2)).toEqual(5);

        expect('x -> y -> x + 2*y'.lambda()(1)(2)).toEqual(5);

        expect('x + 1'.lambda()(1)).toEqual(2);
        expect('x + 1'.lambda()(1)).toEqual(2);
        expect('x + 1'.lambda()(1)).toEqual(2);

        expect('Math.cos(angle)'.lambda()(Math.PI)).toEqual(-1); // -> -1
        expect('point.x'.lambda()({x:1, y:2})).toEqual(1); // -> 1
        expect('({x:1, y:2})[key]'.lambda()('x')).toEqual(1); // -> 1

    })

    it("String.prototype.apply", function(){
        expect('x+1'.apply(null, [2])).toEqual(3);
        expect('/'.apply(null, [2, 4])).toEqual(1/2);
    });

    it("String.prototype.call", function(){
        expect('x+1'.call(null, 2)).toEqual(3);
        expect('/'.call(null, 2, 4)).toEqual(1/2);
    });


});