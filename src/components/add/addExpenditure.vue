<template>
  <div id="addExpenditure">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-position="top"
      :hide-required-asterisk="true"
      class="card"
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
            pattern: /^[0-9]*(|.[0-9]+)$/,
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
      url: ""
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
    },
    getPicInfo(){
      // TODO: 上传图片
      this.axios
        .post('/getPicInfo',{
          url: this.url
        })
        .then(res => {
          if (res.data.code == 1) {
            let data = res.data.data;
            this.form.money = data.money;
            this.form.time = data.time;
            this.form.remark = data.remark;
            this.form.way = "3";
            this.$message.success('读取截图成功');
          }else{
            this.$message.error('读取失败，请重新上传');
          }
      })
      .catch(err => {
        console.log(err);
        this.$message('服务器无法连接');
      });
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
