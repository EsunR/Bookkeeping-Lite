<template>
  <div id="addExpenditure" v-loading.fullscreen.lock="loading">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-position="top"
      :hide-required-asterisk="true"
      class="card"
      element-loading-text="正在解析上传图片"
    >
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="支出金额" prop="money">
            <el-input v-model="form.money" placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="支出类型" prop="sort">
            <el-select v-model="form.sort" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in sort" :key="item.id" :label="item.sort" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :md="12">
          <el-form-item label="时间" prop="time">
            <el-date-picker
              style="width: 100%"
              v-model="form.time"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy年MM月dd日 HH:mm"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="方式" prop="way">
            <el-select v-model="form.way" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in way" :key="item.id" :label="item.way" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" rows="3" v-model="form.remark"></el-input>
        </el-form-item>
      </el-row>
    </el-form>

    <div class="e_card">
      <el-upload
        action="http://upload.qiniup.com"
        :on-success="uploadSuccess"
        :limit="1"
        list-type="picture"
        :data="postData"
        accept=".png, .jpg"
      >
        <el-button size="small" type="primary">上传微信截图</el-button>
        <div slot="tip" class="el-upload__tip">提示：提取截图信息后会覆盖已填的信息</div>
      </el-upload>
    </div>

    <div class="btn_box">
      <el-button type="primary" @click="submit">确定添加</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        money: "",
        sort: 1,
        time: Date.parse(new Date()),
        way: "1",
        remark: ""
      },
      rules: {
        money: [
          {
            required: true,
            message: "请输入金额",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[0-9]*(|[.][0-9]+)$/,
            message: "请输入数字",
            trigger: ["blur", "change"]
          }
        ]
      },
      sort: [],
      way: [
        {
          way: "现金",
          id: "1"
        },
        {
          way: "支付宝",
          id: "2"
        },
        {
          way: "微信",
          id: "3"
        },
        {
          way: "其他",
          id: "4"
        }
      ],
      postData: {
        // 测试token
        token:
          "noucWTUuRY84Z0DSDJyJiszjO7OtRY3Vtj4yAWT1:1D6bk4yfCW51XqjgG-igP_Bi6dc=:eyJzY29wZSI6Im5vdmVsLXN5c3RlbSIsImRlYWRsaW5lIjoxNTc1MTI5NjAwfQ=="
      },
      url: "",
      words: []
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          this.postForm();
        } else {
          return false;
        }
      });
    },
    postForm() {
      let obj = this.form;
      obj.time = this.form.time.toString();
      obj.money = Number(this.form.money)
        .toFixed(2)
        .toString();
      this.axios
        .post("/addOut", obj)
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success("添加成功");
            this.$router.push("/home");
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    getSort() {
      this.axios
        .get("/getSort")
        .then(res => {
          if (res.data.code == 1) {
            this.sort = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接，获取消费类型失败");
        });
    },
    uploadSuccess(res) {
      this.url = "http://study.esunr.xyz/" + res.key;
      this.getPicInfo();
      this.loading = true;
    },
    getPicInfo() {
      this.axios
        .post("/getPicInfo", {
          url: this.url
        })
        .then(res => {
          if (res.data.code == 1) {
            for (let i in res.data.data) {
              this.words.push(res.data.data[i].words);
            }
            this.getKeywords();
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    getKeywords() {
      let words = this.words;
      for (let i in words) {
        let moneyReg = /^[-]*[0-9]+[.][0-9]+$/;
        let timeReg = /支付时间/;
        let remarkReg = /商户全称/;
        if (moneyReg.test(words[i])) {
          if (Number(words[i]) < 0) {
            this.form.money = (-Number(words[i])).toString();
          } else {
            this.form.money = words[i];
          }
          this.form.remark = words[i - 1];
        }
        if (timeReg.test(words[i])) {
          let time = words[i].replace(timeReg, "");
          time = time.slice(0, 10) + " " + time.slice(10);
          this.form.time = this.$moment(time).valueOf();
        }
        if (remarkReg.test(words[i])) {
          this.form.remark = words[i].replace(remarkReg, "");
        }
      }
      this.form.way = "3";
      this.loading = false;
    }
  },
  mounted() {
    this.getSort();
  }
};
</script>

<style lang='scss' scoped>
.btn_box {
  display: flex;
  justify-content: center;
  .el-button {
    width: 100%;
  }
}
</style>

<style lang="scss">
#addExpenditure {
  label {
    padding-left: 2px;
  }
}
</style>
