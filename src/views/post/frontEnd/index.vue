<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
			<div class="system-user-search mb15">
				<el-input v-model="tableData.param.search" size="default" placeholder="请输入角色名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10" @click="searchList">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddRole">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增角色
				</el-button>
			</div>
			<el-table :data="tableData.data" style="width: 100%">
<!--				<el-table-column type="index" label="序号" width="60" />-->
				<el-table-column prop="roleName" label="角色名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleSign" label="角色标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="角色状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="describe" label="角色描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.roleName === '超级管理员'" size="small" text type="primary" @click="onOpenEditRole(scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.roleName === '超级管理员'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="tableData.param.pageNum"
				background
				v-model:page-size="tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableData.total"
			>
			</el-pagination>
		</div>
		<AddRole ref="addRoleRef" />
		<EditRole ref="editRoleRef" />
	</div>
</template>

<script lang="ts">
import { defineAsyncComponent, toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import request from '/@/utils/manage';
import API from "/@/api/api";


// 定义接口来定义对象的类型
interface TableData {
	roleName: string;
	roleSign: string;
	describe: string;
	sort: number;
	status: boolean;
	createTime: string;
}
interface TableDataState {
	tableData: {
		data: Array<TableData>;
		total: number;
		loading: boolean;
		param: {
			search: string;
			pageNum: number;
			pageSize: number;
		};
	};
}

export default defineComponent({
	name: 'systemRole',
	components: {
		AddRole: defineAsyncComponent(() => import('/@/views/system/role/component/addRole.vue')),
		EditRole: defineAsyncComponent(() => import('/@/views/system/role/component/editRole.vue')),
	},
	setup() {
		const addRoleRef = ref();
		const editRoleRef = ref();
		const state = reactive<TableDataState>({
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					search: '',
					pageNum: 1,
					pageSize:10,
				},
			},
		});
		// 初始化表格数据
		const initTableData = (val:any) => {
      request.getAction(API.role, {...state.tableData.param},{}).then(res => {
        console.log(res,'res')
        state.tableData.data = res.data.data;
        state.tableData.total = res.data.cont;
      }).catch((e) => {
        ElMessage.warning(e);
      })
		};
		// 打开新增角色弹窗
		const onOpenAddRole = () => {
			addRoleRef.value.openDialog();
		};
    // 查询
    const searchList = () => {
      //initTableData(state.tableData.param.search)

      initTableData({...state.tableData.param})
      console.log({...state.tableData.param},'...state.tableData.param')
    };

		// 打开修改角色弹窗
		const onOpenEditRole = (row: Object) => {
			editRoleRef.value.openDialog(row);
		};
		// 删除角色
		const onRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.roleName}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
          request.deleteAction(API.role,{"id":row.id},{}).then(res => {
            if(res.data.code==0){
              ElMessage.warning(res.data.message);
            }
            else{
              ElMessage.success('删除成功');
            }
          }).catch((e) => {
            ElMessage.warning(e);
          })
				})
				.catch(() => {});
		};
		// 分页改变
		const onHandleSizeChange = (val: number) => {
			state.tableData.param.pageSize = val;
      initTableData({...state.tableData.param})
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.tableData.param.pageNum = val;
      initTableData({...state.tableData.param})
		};
		// 页面加载时
		onMounted(() => {
			initTableData("");


		});
		return {
			addRoleRef,
			editRoleRef,
			onOpenAddRole,
			onOpenEditRole,
      searchList,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
		.el-table {
			flex: 1;
		}
	}
}
</style>
