##关于那道题的学习

看看标准答案

	"use strict";

	const chainContinuation = (...funcs) => (params,cont) => recursiveCore(funcs, params, [], cont);

	const recursiveCore = (funcs, params, accumulation, cont) => {
    if (funcs.length == 0) {
        cont(...accumulation);
        return;
    }

    const func = funcs.shift();
    const param = params.shift();

    func(param, result => {
        accumulation.push(result);
        recursiveCore(funcs, params, accumulation, cont);
    });
	}

// Test Case

	const f1 = (param, cont) => {
    setTimeout(() => {
        cont(`f1: ${param}`);
    }, 0);
	};

	const f2 = (param, cont) => {
    	setTimeout(() => {
        	cont(`f2: ${param}`);
    }, 0);
	};
	
	const f = chainContinuation(f1, f2);
	f([1, 2], (v1, v2) => {
    console.log(v1 === `f1: 1`);
    console.log(v2 === `f2: 2`);
	});

拿到标准答案的时候

1. 自己get错了点，我当时的思路是以为在f([para], callback)中分析出callback中各个与v1,v2相关的代码块，然后分别注入到fn1，fn2的回调中，好坑啊(悲伤)，所以很悲伤啊。
2. 看到这么清晰的代码， 觉得自己还有一段很长的路要走。


先看:

	const chainContinuation = (...funcs) => (params,cont) => recursiveCore(funcs, params, [], cont);

函数curry化，缓存funcs。

然后:

	const recursiveCore = (funcs, params, accumulation, 		cont) => {
    if (funcs.length == 0) {
        cont(...accumulation);
        return;
    }

    const func = funcs.shift();
    const param = params.shift();

    func(param, result => {
        accumulation.push(result);
        recursiveCore(funcs, params, accumulation, cont);
    });
	}

cont 作为chain后要执行的那个函数回调，在每个fn执行完后，触发。
result 作为各个fn的callback 中的参数， 这个回调作用收集各个fn cont运行结果。

其实代码并不算难，但是思路却很好。将每级fn的执行结构向下传递，像不像异步的ruduce, compose的灵活使用。

fn3f(fn2(fn1(para)));	
	
	





