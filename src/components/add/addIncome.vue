<template>
  <div id="addIncome">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-position="top"
      :hide-required-asterisk="true"
      class="card"
    >
      <el-row :gutter="20">
        <el-col :md="12">
          <el-form-item label="收入金额" prop="money">
            <el-input v-model="form.money" placeholder="请填写"></el-input>
          </el-form-item>
        </el-col>
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
      </el-row>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" rows="3"></el-input>
      </el-form-item>
    </el-form>

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
        time: Date.parse(new Date()),
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
      }
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
        .post("/addIn", obj)
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success("添加成功");
            this.$router.push("/home/income");
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    }
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
#addIncome {
  label {
    padding-left: 2px;
  }
}
</style>