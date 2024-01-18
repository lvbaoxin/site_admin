<template>
  <div class="system-role-container layout-padding">
    <div class="system-role-padding layout-padding-auto layout-padding-view">
      <div class="system-user-search mb15">
        <el-input v-model="tableData.param.search" size="default" placeholder="请输入文章分类名称"
                  style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="searchList">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddArticle">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增文章分类
        </el-button>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="title" label="分类标题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createAt" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenEditArticle(scope.row)"
            >修改
            </el-button
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
    <AddArticle ref="addArticleRef" @searchList="searchList"/>
    <EditArticle ref="editArticleRef" @searchList="searchList"/>
  </div>
</template>

<script lang="ts">
import {defineAsyncComponent, toRefs, reactive, onMounted, ref, defineComponent} from 'vue';
import {ElMessageBox, ElMessage} from 'element-plus';
import request from '/@/utils/manage';
import API from "/@/api/api";
import mitt from 'mitt'

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
  name: 'articleType',
  components: {
    AddArticle: defineAsyncComponent(() => import('/@/views/post/articleType/component/addArticleType.vue')),
    EditArticle: defineAsyncComponent(() => import('/@/views/post/articleType/component/editArticleType.vue')),
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
          pageSize: 10,
        },
      },
    });
    // 初始化表格数据
    const initTableData = (val: any) => {
      request.postAction(API.blogcategory.listPage, {...state.tableData.param}, {}).then(res => {
        console.log(res, 'res')
        state.tableData.data = res.data.data;
        state.tableData.total = res.data.total;
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
      initTableData({...state.tableData.param})
    };

    // 打开修改角色弹窗
    const onOpenEditArticle = (row: Object) => {
      editArticleRef.value.openDialog(row);
    };
    // 删除角色
    const onRowDel = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除分类标题：“${row.title}”，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            request.getAction(API.blogcategory.delete, {"id": row.id}, {}).then(res => {
              ElMessage.success('删除成功');
              initTableData({...state.tableData.param});
            }).catch((e) => {
              ElMessage.warning(e);
            })
          })
          .catch(() => {
          });
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
