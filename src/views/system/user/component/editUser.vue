<template>
  <div class="system-edit-user-container">
    <el-dialog title="修改用户" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" size="default" label-width="90px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="账户名称">
              <el-input v-model="ruleForm.userName" placeholder="请输入账户名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户昵称">
              <el-input v-model="ruleForm.userNickname" placeholder="请输入用户昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="关联角色">
              <el-select v-model="ruleForm.roleSign" placeholder="请选择" clearable class="w100">
                <el-option v-for="item in roleSignList" :label="item.roleName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="手机号">
              <el-input v-model="ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="邮箱">
              <el-input v-model="ruleForm.email" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="性别">
              <el-select v-model="ruleForm.sex" placeholder="请选择" clearable class="w100">
                <el-option label="男" :value= 1></el-option>
                <el-option label="女" :value= 0></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="账户密码">
              <el-input v-model="ruleForm.password" placeholder="请输入" type="password" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="账户过期">
              <el-date-picker v-model="ruleForm.overdueTime" type="date" placeholder="请选择"
                              class="w100"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="用户状态">
              <el-switch v-model="ruleForm.status" inline-prompt active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户描述">
              <el-input v-model="ruleForm.describe" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">修 改</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, onMounted, defineComponent} from 'vue';
import request from "/@/utils/manage";
import API from "/@/api/api";
import {ElMessage} from "element-plus";
import router from "/@/router";

// 定义接口来定义对象的类型
interface DeptData {
  deptName: string;
  createTime: string;
  status: boolean | number;
  sort: number | string;
  describe: string;
  id: number;
  children?: DeptData[];
}

interface RuleFormRow {
  userName: string;
  userNickname: string;
  roleSign: string;
  department: any;
  phone: string;
  email: string;
  sex: number;
  password: string;
  overdueTime: string;
  status: boolean | number;
  describe: string;
}

interface roleSignList {
  roleName: string;
  createTime: string;
  status: boolean | number;
  sort: number | string;
  describe: string;
  id: number;
  roleSign: string;
}

interface UserState {
  isShowDialog: boolean;
  ruleForm: RuleFormRow;
  deptData: Array<DeptData>;
  roleSignList: Array<roleSignList>;
}

export default defineComponent({
  name: 'systemEditUser',
  setup() {
    const state = reactive<UserState>({
      isShowDialog: false,
      ruleForm: {
        userName: '', // 账户名称
        userNickname: '', // 用户昵称
        roleSign: '', // 关联角色
        department: [], // 部门
        phone: '', // 手机号
        email: '', // 邮箱
        sex: 0, // 性别
        password: '', // 账户密码
        overdueTime: '', // 账户过期
        status: true, // 用户状态
        describe: '', // 用户描述
      },
      deptData: [], // 部门数据
      roleSignList: []
    });
    // 打开弹窗
    const openDialog = (row: RuleFormRow) => {
      initTableData();
      state.ruleForm = JSON.parse(JSON.stringify(row)); ;
      //state.ruleForm.sex = row.sex == '1' ? '男' : '女';
      state.ruleForm.status = JSON.parse(JSON.stringify(row)).status == 1 ? true : false;
      console.log(row, 'row')
      state.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    // 新增
    const onSubmit = () => {
      request.putAction(API.user,{...state.ruleForm},{}).then(res => {
        console.log(res,'res')
        if(res.data.code==0){
          ElMessage.warning(res.data.message);
        }
        else{
          ElMessage.success('修改成功');
          router.push('/system/user');
        }
      }).catch((e) => {
        ElMessage.warning(e);
      })
      closeDialog();
    };

    // 初始化部门数据
    const initTableData = () => {
      request.getAction(API.role, {
        search: '',
        pageNum: 1,
        pageSize: 100,
      }, {}).then(res => {
        state.roleSignList = res.data.data
      }).catch((e) => {
        ElMessage.warning(e);
      })

    };
    // 页面加载时
    onMounted(() => {
      //initTableData();
    });
    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      initTableData,
      ...toRefs(state),
    };
  },
});
</script>
