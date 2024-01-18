<template>
	<div class="system-add-role-container">
		<el-dialog title="新增文章" v-model="isShowDialog" width="769px">
			<el-form :model="addForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="标题">
							<el-input v-model="addForm.title" placeholder="请输入标题" clearable></el-input>
						</el-form-item>
					</el-col>

<!--					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">-->
<!--						<el-form-item label="上传封面">-->
<!--							<Upload ref="UploadRef" v-model="addForm.pic" />-->
<!--						</el-form-item>-->
<!--					</el-col>-->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="分类">
              <el-select v-model="addForm.blogCategoryId"  placeholder="请选择文章分类"  class="w100">
                <el-option v-for="item in menuData" :label="item.title" :value="item.id"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序">
              <el-input-number v-model="addForm.sort" :min="0" :max="999" controls-position="right" placeholder="请输入排序" class="w100" />
            </el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="摘要">
							<el-input v-model="addForm.abstracts" type="textarea" placeholder="请输入摘要" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="内容">
              <Editor v-model="addForm.description" />
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
  description: string;
  blogCategoryId: string;
  abstracts: string;
  sort: number;
  createTime: string;
  pic: string;

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
    description: string;
    blogCategoryId: string;
    abstracts: string;
    sort: number;
    createTime: string;
    pic: string;

	};
	menuData: Array<MenuDataTree>;
	menuProps: {
		children: string;
		label: string;
	};
}

export default defineComponent({
	name: 'systemAddRole',
  components: {
    Upload: defineAsyncComponent(() => import('/@/components/upload/index.vue')),
    Editor: defineAsyncComponent(() => import('/@/components/editor/index.vue')),
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
        description: "",
        blogCategoryId:"",
        abstracts: "",
        sort: 0,
        createTime: "",
        pic: ""
			},
			menuData: [],
			menuProps: {
				children: 'children',
				label: 'label',
			},

		});
		// 打开弹窗
		const openDialog = () => {
			state.isShowDialog = true;
			getMenuData();
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
      request.postAction(API.blog.add,{...state.addForm},{}).then(res => {
        console.log(res,'res')
        if(res.data.code==500){
          ElMessage.warning(res.data.message);
        }
        else{
          ElMessage.success('添加成功');
          emit('searchList');

        }
      }).catch((e) => {
        ElMessage.warning(e);
      })
			closeDialog();
		};
		// 获取菜单结构数据
		const getMenuData = () => {

      request.getAction(API.blogcategory.list, {}, {}).then(res => {
        if(res.data.code==500){
          ElMessage.warning(res.data.message);
        }
        else{
          state.menuData = res.data.data;
        }

      }).catch((e) => {
        ElMessage.warning(e);
      })
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
