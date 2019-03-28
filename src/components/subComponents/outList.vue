<template>
  <div id="list">
    <div class="empty card" v-if="this.outList.length == 0">（暂无支出项）</div>
    <div class="day card" v-for="(item,index) in outList" :key="index">
      <div class="title">{{$moment(Number(item[0].time)).format('LL')}}</div>
      <hr>
      <div
        class="dayList"
        v-for="subItem in item"
        :key="subItem.id"
        @click="showAlterModel(subItem.id)"
      >
        <div class="left">
          <div class="icon">
            <span
              :class="{
                  'mdi':true, 
                  'mdi-cash-multiple': subItem.way == 1, 
                  'mdi-wallet': subItem.way == 2,
                  'mdi-wechat': subItem.way == 3,
                  'mdi-dots-horizontal': subItem.way == 4
                }"
            ></span>
          </div>
          <div class="text_box">
            <div class="remark">{{subItem.sort}}-{{subItem.remark}}</div>
            <div class="way">{{subItem.way | way}}</div>
          </div>
        </div>
        <div class="right">
          <div class="money">{{subItem.money | money}} 元</div>
          <div class="time">{{$moment(Number(subItem.time)).format('dddd HH:mm')}}</div>
        </div>
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
        <!-- 第三行 -->
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" rows="3" v-model="form.remark"></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteOut()" type="danger" style="float: left">删除</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="alterOut()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      outList: [],
      form: {
        id: "",
        money: "",
        sort: "",
        time: "",
        way: "",
        remark: ""
      },
      rules: {
        money: [{ required: true, message: "请输入金额", trigger: "blur" }]
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
      dialogFormVisible: false
    };
  },
  props: ["time1", "time2"],
  methods: {
    getOutList() {
      this.axios
        .get("/getOutList", {
          params: {
            time1: this.time1.toString(),
            time2: this.time2.toString()
          }
        })
        .then(res => {
          if (res.data.code == 1) {
            this.outList = res.data.data;
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
      this.outList.some(arrList => {
        arrList.some(subArrList => {
          if (subArrList.id == id) {
            selected_data = subArrList;
            return true;
          }
        });
      });
      this.form.money = selected_data.money.toString();
      this.form.sort = selected_data.sortId;
      this.form.time = selected_data.time;
      this.form.way = selected_data.way.toString();
      this.form.remark = selected_data.remark;
      this.form.id = selected_data.id.toString();
    },
    alterOut() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let obj = this.form;
          obj.money = this.form.money.toString();
          obj.sort = this.form.sort.toString();
          obj.time = this.form.time.toString();
          this.axios
            .post("/alterOut", this.form)
            .then(res => {
              if (res.data.code == 1) {
                this.$message.success("修改成功");
                this.getOutList();
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
    deleteOut() {
      this.axios
        .get("/deleteOut?id=" + this.form.id)
        .then(res => {
          if (res.data.code == 1) {
            this.$message.success("删除成功");
            this.getOutList();
            this.dialogFormVisible = false;
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
    }
  },
  mounted() {
    this.getOutList();
    this.getSort();
  }
};
</script>

<style lang='scss' scoped>
#list {
  .empty {
    text-align: center;
    color: #909399;
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
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
      @media screen and (max-width: 575px) {
        padding: 20px 0 !important;
      }
      .left {
        display: flex;
        align-items: center;
        .icon {
          font-size: 1.2rem;
          margin-right: 10px;
          .mdi {
            display: block;
            line-height: 45px;
            width: 45px;
            text-align: center;
            color: white;
            border-radius: 40px;
          }
          .mdi-cash-multiple {
            background-color: #ff9800;
            &::before {
              top: -2px;
            }
          }
          .mdi-wallet {
            background-color: #409eff;
          }
          .mdi-wechat {
            background-color: #67c23a;
          }
          .mdi-dots-horizontal {
            background-color: #909399;
          }
          .mdi::before {
            position: relative;
            left: 1px;
          }
        }
        .text_box {
          .way {
            font-size: 14px;
            color: #909399;
          }
        }
      }
      .right {
        text-align: right;
        .time {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}
</style>

<style lang="scss">
</style>
