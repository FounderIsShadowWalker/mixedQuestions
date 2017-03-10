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

Async([
    [fn1, function(){console.log('fn1')}],
    [fn2, function(){console.log('fn2')}],
    [fn3, function(){console.log('fn3')}]
], function () {
    console.log('调用完毕');
})