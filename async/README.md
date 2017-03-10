##关于异步的一些问题
昨天一个很厉害的朋友给了一个很好玩的题目，在这里给大家分享一下

现在有n个函数，我们要把它们串联起来执行，
它们的样子是这样的，

	fn = (params,cont) => {
    // some code
    cont(message);
	}

	这个cont是一个callback，这个fn不通过返回值得到结果，而是通过调用这个callback

	例如
		fn(1,v=>{
  			console.log(v);
		});

	于是就执行fn，然后适当的时候console.log


拿到这个题目的时候，开始的时候是没get到点，只是以为这个朋友想让异步的方法顺序执行，并执行callback，然后就试着写了一个异步工具(写的贼丑)

这里也可以给大家分享一下，设计的样子是这个样子

	Async([
    [fn1, function(){console.log('fn1')}],
    [fn2, function(){console.log('fn2')}],
    [fn3, function(){console.log('fn3')}]
	], function () {
   	 console.log('调用完毕');	
	})
	
简单解释一下，Async 传递的是一个异步队列，每一个数组成员是一个异步队列，之后的function是执行fn的回调，最后的function是整个异步队列的回调。

好，现在我给出我们的fun组

	var fn1 = function(cb) {
    setTimeout(function () {
        cb();
    }, 1000);
	}

	var fn2 = function (cb) {
    	setTimeout(function () {
       	 cb();
    	}, 2000)
	}

	var fn3 = function (cb) {
    	setTimeout(function () {
       	 cb();
    	}, 3000);	
	}
	
现在的问题是我们如何监测function 结束呢？ 答案就在cb上，我们自然是在cb上做文章啦，cb是唯一的callback，相当于promise的resolve。

开始的时候，最先想到的是reduce方法，大概调用关系是 fn3(fn2(fn1)) 然后试了一下reduce不支持异步，好悲伤啊。

只好自己改写callback了，然后递归调用。直接上代码

	//改写callback
	function NowToNext(func, callback, index, finalCallBack) {
  	 var prev = callback[index],
       now = function(){
           prev();
           console.log('执行下一个');
           func.splice(index, 1);
           callback.splice(index, 1);
           func.length > 0 ? NowToNext(func, callback,  index, finalCallBack) : finalCallBack();

       }

       func[index](now);
	}

	function Async(funcs, finalCallBack) {

    var sequence = funcs.map(function (fun) {
        return fun[0];
    })

    var callback = funcs.map(function (fun) {
        return fun[1];
    });
   	 NowToNext(sequence, callback, 0, finalCallBack)
	}
	
代码异常简单，不做赘述了。

这个demo 在index.js目录下，大家可以试试。

之后我把这个发给了朋友，果然，没get到点。
然后他发了一组测试用例给我，上图。

	const f1 = (param, cont) => {
    setTimeout(() => {
        cont(`f1: ${param}`);
    }, 0);
	};
	f1(1, v => {
    console.assert(v === `f1: 1`);
	});

	const f2 = (param, cont) => {
   	 	setTimeout(() => {
        cont(`f2: ${param}`);
    }, 0);
	};
	f2(2, v => {
   	 	console.assert(v === `f2: 2`);
	});

	const f = chain(f1, f2);
	f([1, 2], (v1, v2) => {
    	console.assert(v1 === `f1: 1`);
    	console.assert(v2 === `f2: 2`);
	});

这些就清晰了，这个f传递参数，后面接回调函数，判断是不是预期的值，感觉这个东东应该是测试的吧，相当于日志？迅速定位错误的点？ 大牛的东西总是花样百出，厉害了。
	
我们这里的难点就是怎么样实现着这个chain方法了，看看我们现在有什么知道的，知道chain 绑定的顺序，也就是func先后的顺序，知道传递的值，知道回调的值，理论上一切都可以判断，那这个chain该怎么写呢？

我的思路是，因为这个回调就是console 判断输入值和默认值是不是相等，那我把这个总的回调拆分，然后依次注入各个fn的回调中吧，上代码。

	function chain() {
    var args = Array.prototype.slice.call(arguments);
    return function () {
        var _args = Array.prototype.slice.call(arguments),
            finalCallback = _args[1].toString();

            var results = [];
            finalCallback.replace(/console.log\((?:.+?)===(.+?)\)/g, function(str1, str2){
                results.push(str2.trim());
            })

            var callbacks = _args[0].map(function (arg, index) {
                var fun;
                return fun = new Function('', ' return function(para){' +
                    '' +  'console.log(para ===' + results[index] + ')}')();
            })
        
        NowToNext(args, callbacks, _args[0], 0)
   		 }
	}
最外面的args 是fn的顺序， _args[0]是参数数组，我们把总的callback 用正则切割'===' 取得右边的参数，然后构造各个fn的callback，又变成我第一次写的问题了，知道fn，知道fn的callback，异步转同步的问题。

代码示例在revise.js里
大家可以试着跑一下，感觉这一次还是要跪，这样写的灵活度太低了，比如只能console.log，我好菜啊(悲伤)。

嗯，就是这样，先写这么多了。	
		