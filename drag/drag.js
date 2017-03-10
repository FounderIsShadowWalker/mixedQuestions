(function(){
    var columns = document.querySelectorAll('.column'),
        container = document.querySelector('.container'),
        containerLeft = container.getBoundingClientRect().left;

    //确定一下环境
    var envir = [];
    for(var i=0; i<columns.length; i++){
        if(columns[i].firstElementChild){
            envir.push(1);
        }
        else{
            envir.push(0);
        }
    }

    function getEmptyColumn(start){
        console.log("start:" + start);
        for (var i = start; i < envir.length; i++) {
                  if(envir[i] === 0){
                      return i;
                  }
        }

        for (var i = start - 1; i >=0 ; i--) {
                if(envir[i] === 0){
                    return i;
                }
        }
    }

    console.log(envir);
    function detectColumn(target){
        var distance = target.getBoundingClientRect().left - containerLeft;
        var extra = (distance + 100) % 150;
        var column = Math.floor((distance + 100) / 150);

        if(extra < 50){
            column = column - 1;
            if (column < 0) column = 0;
        }
        return column;
    }

    function easyMove(target, attr, begin, end, callback){
        var animated = setInterval(function(){
            var interval = Math.ceil(end - begin) / 10;
            target.style[attr] = begin + interval + "px";
            begin = begin + interval;
            if(begin >= end){
                target.style[attr] = end + "px";
                clearInterval(animated) && (animated = null);
            }
        },  10);
    }

    //绑定拖动元素
    container.onmousedown = function(e) {
        //拖动圆形
        var startColumn, endColumn, distanceY = 0, direction;

        if (e.target.className.indexOf("circle") > -1) {
            var target = e.target,
                startX = e.clientX,
                startY = e.clientY,
                distance = 0;

            //确定被拖动元素的当前列
            startColumn = detectColumn(target);
            console.log("起始列:" + startColumn);
            console.log(target);

            document.onmousemove = function (e) {
                var x = e.clientX,
                    y = e.clientY;

                target.style.left = x - startX + "px";
                target.style.top = y - startY + "px";
                distance = x - startX;
                distanceY = Math.abs(y - startY);             //circle margin有10px circle 自己高 100px 移动距离只要大于 80px 就要交换
                direction = distanceY > 0 ? 1 : 0;   //1 向下交换 0 向上 交换

                if(distanceY >= 80 && direction === 1 && target.previousElementSibling && target.previousElementSibling.className === "circle"){
                    target.removeAttribute('style');
                    columns[startColumn].insertBefore(target, target.previousElementSibling);
                    distanceY = 0;
                    startY = y;

                }
            }

            document.onmouseup = target.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;

                endColumn = detectColumn(target);

                console.log("目标列:" + endColumn);
                //发现是否该列被占用 或者该行第一个是矩形就好

                if(startColumn === endColumn){
                    //同列交换
                    console.log('最终还是同列');
                }
                else {
                    if(!columns[endColumn].lastElementChild){
                        envir[endColumn] = 1;
                    }
                    if (!columns[endColumn].lastElementChild || columns[endColumn].firstElementChild.className !== "circle") {
                        columns[endColumn].appendChild(target);
                    }
                }
                target.removeAttribute('style');
            }
        }

        //拖动矩形
        if (e.target.className.indexOf("rectangle") > -1) {
            var target = e.target,
                startX = e.clientX,
                startY = e.clientY,
                distance = 0,
                moveArr = [];

            startColumn = detectColumn(target);
            var parent = target.parentNode;

            for(var i=0; i<parent.childNodes.length; i++){
                if(parent.childNodes[i].nodeType == 1)
                moveArr.push(parent.childNodes[i]);
            }

            //确定矩形下圆形的div

            document.onmousemove = function (e) {
                var x = e.clientX,
                    y = e.clientY;

                for(var i=0; i<moveArr.length; i++) {
                    moveArr[i].style.left = x - startX + "px";
                    moveArr[i].style.top = y - startY + "px";
                }

                distance = x - startX;
            }

            document.onmouseup = target.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
                endColumn = detectColumn(target);
                //发现是否该列被占用

                if(!columns[endColumn].lastElementChild) {
                    for(var i=0; i<moveArr.length; i++) {
                        columns[endColumn].appendChild(moveArr[i]);
                    }
                    envir[startColumn] = 0;
                    envir[endColumn] = 1;
                }
                else{
                    console.log(startColumn);
                    console.log(endColumn);

                    var emptyNum = getEmptyColumn(endColumn);
                    console.log("emptyNum:" + emptyNum);
                    //我要动态调整了 优先级先右后左

                    if(!isNaN(emptyNum)){
                        var j = emptyNum < endColumn ? -1 : 1;
                        for(var i=0; i<columns[endColumn+j].childNodes.length; i++) {
                            columns[endColumn+j].childNodes[j].style.marginLeft = j * 150 + "px";
                        }
                    }else {
                        alert("放不下了");
                    }
                }
                for(var i=0; i<moveArr.length; i++) {
                    moveArr[i].removeAttribute('style');
                }

                moveArr = [];
            }
        }
    }
}());