<template>
  <div id="addRepayment">
    <div class="add e_card">
      <div class="title">添加还款</div>
      <hr>
      <div class="row">
        <div class="col-md-4">
          <el-input placeholder="还款项目" v-model="title"></el-input>
        </div>
        <div class="col-md-4">
          <el-input placeholder="还款金额" v-model="money"></el-input>
        </div>
        <div class="col-md-4">
          <el-date-picker
            style="width: 100%"
            v-model="targetTime"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
          ></el-date-picker>
        </div>
      </div>
      <div class="btn_box">
        <el-button type="primary" @click="addRepayment">添加</el-button>
      </div>
    </div>

    <div class="repaymentList_box">
      <div class="repaymentList e_card" v-for="item in repaymentList" @click="deleteRepayment(item.id)" :key="item.id">
        <div class="title">{{item.title}} - {{item.money}}元</div>
        <div class="time">截止日：{{$moment(Number(item.targetTime)).format('YYYY年MM月DD日')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      money: "",
      targetTime: "",
      repaymentList: [
        {
          id: 1,
          targetTime: "1554048000000",
          title: "花呗还款",
          money: "100"
        },
        {
          id: 2,
          targetTime: "1554048000000",
          title: "花呗还款",
          money: "100"
        }
      ]
    };
  },
  methods: {
    addRepayment() {
      if (this.title == "" || this.money == "" || this.targetTime == "") {
        this.$message.error("请完善信息");
      } else {
        this.axios
          .post("/addRepayment", {
            targetTime: this.targetTime,
            title: this.title.toString(),
            money: this.money
          })
          .then(res => {
            if (res.data.code == 1) {
              this.getRepaymentList();
            }
          })
          .catch(err => {
            console.log(err);
            this.$message("服务器无法连接");
          });
      }
    },
    getRepaymentList() {
      this.axios
        .get("/getRepayment")
        .then(res => {
          if (res.data.code == 1) {
            this.repaymentList = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
          this.$message("服务器无法连接");
        });
    },
    deleteRepayment(id){
      this.$confirm('您确定要删除该还款提醒吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios
          .get('/deleteRepayment?id='+id)
          .then(res => {
            if (res.data.code == 1) {
              this.$message.success('删除成功!');
            }
        })
        .catch(err => {
          console.log(err);
          this.$message('服务器无法连接');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作已取消'
        });
      });
    }
  },
  mounted() {
    this.getRepaymentList();
  }
};
</script>

<style lang='scss' scoped>
.btn_box {
  display: flex;
  flex-direction: row-reverse;
}
.col-md-4 {
  margin-bottom: 20px;
}
.repaymentList {
  cursor: pointer;
  background-color: #f56c6c;
  color: white;
  display: flex;
  justify-content: space-between;
  .title {
    color: white;
  }
}
</style>