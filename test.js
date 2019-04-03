var orginData = [
  {
    "probability": {
      "average": 0.983343,
      "min": 0.945009,
      "variance": 4.63E-4
    },
    "words": "20:43"
  },
  {
    "probability": {
      "average": 0.77521,
      "min": 0.395105,
      "variance": 0.051934
    },
    "words": "2.0K(s.8⊙l(88"
  },
  {
    "probability": {
      "average": 0.900981,
      "min": 0.563326,
      "variance": 0.028588
    },
    "words": "X账单详情"
  },
  {
    "probability": {
      "average": 0.999173,
      "min": 0.998359,
      "variance": 0
    },
    "words": "全部账单"
  },
  {
    "probability": {
      "average": 0.988031,
      "min": 0.93066,
      "variance": 5.95E-4
    },
    "words": "南城县筑梦电子商务服务站"
  },
  {
    "probability": {
      "average": 0.995382,
      "min": 0.982795,
      "variance": 5.3E-5
    },
    "words": "5.00"
  },
  {
    "probability": {
      "average": 0.999332,
      "min": 0.996271,
      "variance": 1.0E-6
    },
    "words": "当前状态支付成功"
  },
  {
    "probability": {
      "average": 0.997656,
      "min": 0.997656,
      "variance": 0
    },
    "words": "商"
  },
  {
    "probability": {
      "average": 0.981282,
      "min": 0.586936,
      "variance": 0.00517
    },
    "words": "5659071a8992e537593ed7b7cf4b09cd"
  },
  {
    "probability": {
      "average": 0.983868,
      "min": 0.900281,
      "variance": 8.91E-4
    },
    "words": "商户全称南城县筑梦电子商务服务站"
  },
  {
    "probability": {
      "average": 0.968906,
      "min": 0.474057,
      "variance": 0.012345
    },
    "words": "支付时间2019-03-2311:10:19"
  },
  {
    "probability": {
      "average": 0.994351,
      "min": 0.969516,
      "variance": 1.24E-4
    },
    "words": "支付方式零钱"
  },
  {
    "probability": {
      "average": 0.999057,
      "min": 0.984155,
      "variance": 8.0E-6
    },
    "words": "交易单号4200000308201903233200593147"
  },
  {
    "probability": {
      "average": 0.963025,
      "min": 0.530854,
      "variance": 0.012123
    },
    "words": "商户单号5659071a8992e537593ed7b7cf4 bogd"
  },
  {
    "probability": {
      "average": 0.995012,
      "min": 0.979933,
      "variance": 5.8E-5
    },
    "words": "发起群收款"
  },
  {
    "probability": {
      "average": 0.996587,
      "min": 0.986835,
      "variance": 2.7E-5
    },
    "words": "在此商户的交易账单"
  },
  {
    "probability": {
      "average": 0.996166,
      "min": 0.991613,
      "variance": 9.0E-6
    },
    "words": "联系商户"
  },
  {
    "probability": {
      "average": 0.998394,
      "min": 0.998394,
      "variance": 0
    },
    "words": "评"
  },
  {
    "probability": {
      "average": 0.99389,
      "min": 0.98717,
      "variance": 2.7E-5
    },
    "words": "未评价"
  },
  {
    "probability": {
      "average": 0.93038,
      "min": 0.632437,
      "variance": 0.01788
    },
    "words": "时订单有疑惑"
  }
]

var words = [];
for (let i in orginData) {
  words.push(orginData[i].words);
}

var info = {}

for (let i in words) {
  let moneyReg = /^[0-9]+.[0-9]+$/;
  let timeReg = /支付时间/;
  let remarkReg = /商户全称/;
  if (moneyReg.test(words[i])) {
    info.money = words[i];
  }
  if (timeReg.test(words[i])) {
    let time = words[i].replace(timeReg, "");
    info.time = time.slice(0, 10) + " " + time.slice(10)
  }
  if (remarkReg.test(words[i])) {
    info.remark = words[i].replace(remarkReg, "");
  }
}
console.log(words);
console.log(info);