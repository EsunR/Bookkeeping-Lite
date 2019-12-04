## 1. 基本
### 1.1 用户登录
url：/login POST

发送：
```js
{
    account: "001",
    password: "123456"
}
```

返回：
```js
// 正常
{
    code: 1,
    data: 'xxx.xxx.xxx'
}

// 异常
{
    code: 2,
    msg: '账号不在' // 或者“密码错误”
}
```

### 1.2 注册
url：register POST

发送：
```js
{
    account: "001",
    name: "张三",
    password: "123456"
+   regTime: "1111111111111"
}
```

返回：
```js
// 正常
{
    code: 1
}

// 异常
{
    code: 2,
    msg: "账号已存在"
}
```

### 1.3 获取用户信息
url：/getUserInfo GET （从此往后的API都需要验证Token）

返回：
```js
{
    uid: "",
    name: "",
    account: ""
+   regTime: "111111111111"
}
```

## 2. 支出、收入相关


### 2.1 获取支出列表
url: /getOutList

发送：
```
/getOutList?time1=1111111111111&time2=1111111111111

获取某一时间段的支出列表，time1为开始时间，time2为结束时间

如：
获取2019年3月29日的支出，time1即为2019年3月29日0点0分，time2时间为2019年3月30日0点0分
获取某一周的支出，time1为目标周周一的0点0分，time2为目标周下周一的0点0分
获取某一月的支出，time1为目标月1号的0点0分，time2为目标月下个月1号的0点0分
```

返回：
```js
{
    code: 1,
    data: [
        [
            // 同一天的支出数据
            {
                id: "1",
                money: "10",
                sortId: "1"
                sort: "消费",
                way: "1",
                time: "1111111111111"
                remark: "早饭"
            },
            ... ...
        ],
        [
            // 同一天的支出数据
            {
                id: "1",
                money: "10",
                sortId: "1",
                sort: "消费",
                way: "1",
                time: "1111111111111"
                remark: "早饭"
            },
            ... ...
        ],
        ... ...
    ]
}
```

### 2.2 获取收入列表
url：/getInList

发送：
```
/getInList?time1=1111111111111&time2=111111111111

与上同理
```

返回：
```js
{
    code: 1,
    data: [
        [
            // 同一天的支出列表
            {
                id: "1",
                money: "100",
                time: "111111111111",
                remark: "工资收入"
            }
            ... ...
        ],
        [
            // 同一天的支出列表
            {
                id: "2",
                money: "100",
                time: "111111111111",
                remark: "工资收入"
            }
            ... ...
        ]
        ... ...
    ]
}
```

### 2.4 添加支出
url： /addOut POST

发送：
```js
{
    money: "10"
    remark: ""
    sort: "1"
    time: "1553685756000"
    way: "1"
}
```

### 2.5 添加收入
url： /addIn POST

发送：
```js
{
    money: "10"
    remark: ""
    time: "1553685756000"
}
```

### 2.6 获取消费分类
url: /getSort

返回：
```js
{
    code: 1,
    data: [
        // 注意：既要获取公有分类又要获取当前用户的私有分类
        {
            id: "1",
            sort: "消费"
            status: "0",  // 1为私有分类，0为公有分类
        },
        {
            id: "2",
            sort: "购物",
            status: "0"
        }
        ... ...
    ]
}
```

### 2.7 修改某项支出
url：/alterOut POST

发送：
```js
{
    id: "1",
    money: "",
    sort: "",       // id
    time: "",       // 时间戳    
    way: "",        // id
    remark: ""
}
```

### 2.8 修改某项收入
url：/alterIn POST

发送：
```js
{
    id: "1",
    money: "",
    time: "",       // 时间戳
    remark: ""
}
```

### 2.9 删除某项支出
url：/deleteOut GET

发送：
```
/deleteOut?id=1

id: 支出id
```

### 2.10 删除某项收入
url：/deleteIn GET

发送：
```
/deleteIn?id=1

id: 支出id
```

# 3. 用户中心相关

### 3.1 添加某用户的私有支出分类
url：/addSort GET

发送：
```
/addSort?sort=派对
```

### 3.2 删除支出分类
url：/deleteSort GET

发送：
```
/deleteSort?id=1

id: 分类id
```

### 3.3 添加还款日
url：/addRepayment POST

发送：
```js
{
    targetTime: "111111111111",  // 还款日期
    title: "花呗还款", // 还款标题
    money: "100" // 还款金额
}
```

### 3.4 获取某用户还款日列表
url: /getRepayment GET

发送：
```js
{
    code: 1,
    data: [
        {
            id: 1,
            targetTime: "111111111111",  
            title: "花呗还款", 
            money: "100" 
        }
    ]
}
```

### 3.5 删除某用户还款日
url: /deleteRepayment GET

发送：
```
deleteRepayment?id=1

id: 还款日id
```

# 3. TODO功能

### 3.1 获取上传截图识别到的信息
url: /getPicInfo POST

发送：
```js
{
    url: 'http://study.esunr.xyz/Fuy_mwVGEgsMO7d2vankdD0otgee' // 图片地址
}
```

![](http://study.esunr.xyz/Fuy_mwVGEgsMO7d2vankdD0otgee)

返回：
```js
// 读取成功
{
    code: 1,
    data: {
        
    }
}

// 读取失败
{
    code: 2,
    msg: "读取失败"
}
```

### 3.2 获取用户行为
url: /getUserRanking GET

返回：
```js
{
    code: 1,
    data: {
        totalCost: 100, // 消费总金额
        costRanking: 89, // 消费总金额大于89%的人
        mostWay: 1, // 最活跃的消费方式
        wayRanking: 80 // 最活跃的消费方式超过80%的人
    }
}
```






