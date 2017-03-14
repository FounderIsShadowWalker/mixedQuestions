"use strict";

const chainContinuation = (...funcs) => (params, cont) => recursiveCore(funcs, params, [], cont);

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

// ——

const f1 = (param, cont) => {
    setTimeout(() => {
        cont(`f1: ${param}`);
    }, 0);
};
f1(1, v => {
    console.log(v === `f1: 1`);
});

const f2 = (param, cont) => {
    setTimeout(() => {
        cont(`f2: ${param}`);
    }, 0);
};
f2(2, v => {
    console.log(v === `f2: 2`);
});

const f = chainContinuation(f1, f2);
f([1, 2], (v1, v2) => {
    console.log(v1 === `f1: 1`);
    console.log(v2 === `f2: 2`);
});