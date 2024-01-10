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
				<el-button size="default" type="success" class="ml10" @click="onOpenAddArticle">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增文章
				</el-button>
			</div>
			<el-table :data="tableData.data" style="width: 100%">
				<el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
				<el-table-column prop="pic" label="封面" >
          <template #default="scope">
          <el-image style="width: 100px; height: 100px; border-radius: 5px" :src="scope.row.pic"  :title="scope.row.title"> </el-image>
          </template>
        </el-table-column>
				<el-table-column prop="is_del" label="展示" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.is_del">是</el-tag>
						<el-tag type="info" v-else>否</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="description" label="角色描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="create_at" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button  size="small" text type="primary" @click="onOpenEditArticle(scope.row)"
							>修改</el-button
						>
						<el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
		<AddArticle ref="addArticleRef" />
		<EditArticle ref="editArticleRef" />
	</div>
</template>

<script lang="ts">
import { defineAsyncComponent, toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import request from '/@/utils/manage';
import API from "/@/api/api";


// 定义接口来定义对象的类型
interface TableData {
  title: string;
  pic: string;
  is_del: string;
  description: number;
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
		AddArticle: defineAsyncComponent(() => import('/@/views/post/article/component/addArticle.vue')),
		EditArticle: defineAsyncComponent(() => import('/@/views/post/article/component/editArticle.vue')),
	},
	setup() {
		const addArticleRef = ref();
		const editArticleRef = ref();
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
      request.getAction(API.blog, {...state.tableData.param},{}).then(res => {
        console.log(res,'res')

        state.tableData.data = res.data.data.map((item:any) =>{
          item.pic = 'http://localhost:8000'+ item.pic
          return item
        });
        state.tableData.total = res.data.cont;
      }).catch((e) => {
        ElMessage.warning(e);
      })
		};
		// 打开新增角色弹窗
		const onOpenAddArticle = () => {
			addArticleRef.value.openDialog();
		};
    // 查询
    const searchList = () => {
      //initTableData(state.tableData.param.search)

      initTableData({...state.tableData.param})
      console.log({...state.tableData.param},'...state.tableData.param')
    };

		// 打开修改角色弹窗
		const onOpenEditArticle = (row: Object) => {
			editArticleRef.value.openDialog(row);
		};
		// 删除角色
		const onRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.roleName}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
          request.deleteAction(API.blog,{"id":row.id},{}).then(res => {
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
			addArticleRef,
			editArticleRef,
      onOpenAddArticle,
			onOpenEditArticle,
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
