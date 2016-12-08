var arr = [];

function DeclineReverse(str){
    for(var i=2; i<str.length+1; i++){
        TestReverse(str.substring(0, i));
    }
    arr = [...new Set(arr)];
}
function TestReverse(str){
      var begin = 0, end = str.length-1,
          middle =  (begin + end)/2;
    if(end === 0){
        return;
    }
      if(middle - Math.floor(middle) > 0) {
          middle = Math.ceil(middle);
          var left = str.substr(begin, middle);
          var right = str.substr(middle, middle);
          console.log(left);
          console.log(right);
          if(left === right.split("").reverse().join("")){
             console.log("get You:" + left);
             arr.push(left);
          }
          TestReverse(left);
          TestReverse(right);
      }
      else{
          var left = str.substr(begin, middle) + str.charAt(middle);
          var right = str.substr(middle, middle+1);
          console.log(left);
          console.log(right);
          if(left === right.split("").reverse().join("")){
              arr.push(left);
          }
          TestReverse(left);
          TestReverse(right);
      }
}

DeclineReverse('1221331221');
for(var i=0; i<arr.length; i++){
    console.log("***" + arr[i]);
}