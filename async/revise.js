// 'use strict'
const f1 = (param, cont) => {
    setTimeout(() => {
        cont(`f1: ${param}`);
    }, 1000);
};
// f1(1, v => {
//     console.log(v === `f1: 1`);
// });

const f2 = (param, cont) => {
    setTimeout(() => {
        cont(`f2: ${param}`);
    }, 2000);
};
// f2(2, v => {
//     console.log(v === `f2: 2`);
// });

function NowToNext(func, callbacks, arg, index) {
    var prev = callbacks[0],

        now = function(){
               var _args =  Array.prototype.slice.call(arguments)
               prev(_args[0]);
               func.splice(0, 1);
               callbacks.splice(0,1);
               arg.splice(0, 1);

               func.length > 0 ? NowToNext(func, callbacks, arg, index) : console.log('end');
        }

    func[index](arg[index], now);
}

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

const f = chain(f1, f2);

f([1, 2], (v1, v2) => {
    console.log(v1 === `f1: 1`);
    console.log(v2 === `f2: 2`);
});