<template>
	<div class="system-add-role-container">
		<el-dialog title="新增文章分类" v-model="isShowDialog" width="769px">
			<el-form :model="addForm" size="default" label-width="90px">
			
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="分类标题">
                <el-input v-model="addForm.title" placeholder="请输入分类标题" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="排序">
                <el-input-number v-model="addForm.sort" :min="0" :max="999" controls-position="right" placeholder="请输入排序" class="w100" />
              </el-form-item>
            </el-col>
          </el-row>

			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">新 增</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">

// 定义接口来定义对象的类型
import {useRouter} from "vue-router";

interface TableData {
  title: string;
  sort: number;
}

import {reactive, toRefs, defineComponent, onMounted, onBeforeMount, defineAsyncComponent, ref} from 'vue';

import {useLoginApi} from "/@/api/login/index"
import request from "/@/utils/manage";
import API from "/@/api/api";
import {ElMessage} from "element-plus";
// 定义接口来定义对象的类型
interface MenuDataTree {
	id: number;
	label: string;
	children?: MenuDataTree[];
}
interface RoleState {
	isShowDialog: boolean;
	addForm: {
    title: string;
    sort: number;


	};
	menuData: Array<MenuDataTree>;
	menuProps: {
		children: string;
		label: string;
	};
}

export default defineComponent({
	name: 'AddArticle',
  components: {
    Upload: defineAsyncComponent(() => import('/@/components/upload/index.vue')),
  },
	setup(props, {emit}) {
    const UploadRef = ref();
    onBeforeMount(() => {
    })
    const router = useRouter();
		const state = reactive<RoleState>({
			isShowDialog: false,
			addForm: {
        title: "",
        sort: 0,
			},
			menuData: [],
			menuProps: {
				children: 'children',
				label: 'label',
			},

		});
		// 打开弹窗
		const openDialog = () => {
      state.addForm = {
        title: "",
        sort: 0,
      };
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
      request.postAction(API.blogcategory.add,{...state.addForm},{}).then(res => {
        console.log(res,'res')
       
          ElMessage.success('添加成功');
        emit('searchList');
        
      }).catch((e) => {
        ElMessage.warning(e);
      })
			closeDialog();
		};
	
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			...toRefs(state),
		};

	},

});
</script>

<style scoped lang="scss">
.system-add-role-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
