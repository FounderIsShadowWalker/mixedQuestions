(function(){
    var columns = document.querySelectorAll('.column'),
        container = document.querySelector('.container'),
        containerLeft = container.getBoundingClientRect().left;


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

    //绑定拖动元素
    container.onmousedown = function(e) {
        //拖动圆形
        if (e.target.className.indexOf("circle") > -1) {
            var target = e.target,
                startX = e.clientX,
                startY = e.clientY,
                distance = 0;

            document.onmousemove = function (e) {
                var x = e.clientX,
                    y = e.clientY;

                target.style.left = x - startX + "px";
                target.style.top = y - startY + "px";
                distance = x - startX;
            }

            document.onmouseup = target.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;

                var columnNum = detectColumn(target);
                //发现是否该列被占用
                if(!columns[columnNum].lastElementChild || columns[columnNum].lastElementChild.className !== "circle") {
                    columns[columnNum].appendChild(target);
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
                var columnNum = detectColumn(target);
                //发现是否该列被占用

                if(!columns[columnNum].lastElementChild) {
                    for(var i=0; i<moveArr.length; i++) {
                        columns[columnNum].appendChild(moveArr[i]);
                    }
                }
                else{
                    alert("被占用了");
                }
                for(var i=0; i<moveArr.length; i++) {
                    moveArr[i].removeAttribute('style');
                }

                moveArr = [];
            }
        }
    }
}());