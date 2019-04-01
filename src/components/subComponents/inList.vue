<template>
  <div id="list">
    <div class="empty card" v-if="this.inList.length == 0">（暂无收入项）</div>
    <div class="day card" v-for="(item,index) in inList" :key="index">
      <div class="title">
        {{$moment(Number(item[0].time)).format('LL')}}
        <span
          v-if="$moment().format('LL') == $moment(Number(item[0].time)).format('LL')"
          style="background:#409EFF; padding: 2px 8px; color: white; border-radius: 5px; margin-left: 10px;"
        >今天</span>
      </div>
      <hr>
      <div
        class="dayList"
        v-for="subItem in item"
        :key="subItem.id"
        @click="showAlterModel(subItem.id)"
      >
        <div class="remark">
          <span v-if="subItem.remark == ''">收入</span>
          {{subItem.remark}}
        </div>
        <div class="money">+{{subItem.money | money}}元</div>
      </div>
    </div>

    <el-dialog title="修改支出" :visible.sync="dialogFormVisible">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="top"
        :hide-required-asterisk="true"
      >
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="支出金额" prop="money">
              <el-input v-model="form.money" placeholder="请填写"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :md="24">
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
        <!-- 第三行 -->
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" rows="3" v-model="form.remark"></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteIn()" type="danger" style="float: left">删除</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterIn()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inList: [],
      form: {
        id: "",
        money: "",
        time: "",
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
      dialogFormVisible: false
    };
  },
  props: ["time1", "time2"],
  methods: {
    getInList() {
      this.axios
        .get("/getInList", {
          params: {
            time1: this.time1.toString(),
            time2: this.time2.toString()
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.inList = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    showAlterModel(id) {
      let selected_data = {};
      this.dialogFormVisible = true;
      this.inList.some(arrList => {
        arrList.some(subArrList => {
          if (subArrList.id == id) {
            selected_data = subArrList;
            return true;
          }
        });
      });
      this.form.money = selected_data.money.toString();
      this.form.time = selected_data.time;
      this.form.remark = selected_data.remark;
      this.form.id = selected_data.id.toString();
    },
    alterIn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let obj = this.form;
          obj.money = this.form.money.toString();
          obj.time = this.form.time.toString();
          this.axios
            .post("/alterIn", this.form)
            .then(res => {
              if (res.data.code == 1) {
                this.$message.success("修改成功");
                this.getInList();
              }
            })
            .catch(err => {
              console.log(err);
              this.$message("服务器无法连接");
            });
          this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    deleteIn() {
      this.axios
        .get("/deleteIn?id=" + this.form.id)
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success("删除成功");
            this.getInList();
            this.dialogFormVisible = false;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    }
  },
  mounted() {
    this.getInList();
  }
};
</script>

<style lang='scss' scoped>
#list {
  .empty {
    text-align: center;
    color: #909399;
    text-align: center;
    margin-bottom: 40px;
  }
  .day {
    .title {
      font-size: 14px;
      color: #909399;
    }
    hr {
      margin-bottom: 0;
    }

    .dayList {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 20px;
      align-items: center;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
      @media screen and (max-width: 575px) {
        padding: 20px 0 !important;
      }
      .money {
        color: #67c23a;
        font-size: 1.5rem;
      }
    }
  }
}
</style>

<style lang="scss">
</style>
