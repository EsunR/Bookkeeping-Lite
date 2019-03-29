let arr = [[1, 2], 2, 3];
let cpArr = JSON.parse(JSON.stringify(arr))
cpArr[0][0] = 2;
cpArr[1] = 1;
console.log(arr);
console.log(cpArr);