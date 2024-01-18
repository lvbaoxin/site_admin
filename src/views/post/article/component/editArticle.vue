<template>
	<div class="system-edit-role-container">
		<el-dialog title="修改文章" v-model="isShowDialog" width="769px">
			<el-form :model="editForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="标题">
							<el-input v-model="editForm.title" placeholder="请输入标题" clearable></el-input>
						</el-form-item>
					</el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="分类">
              <el-select v-model="editForm.blogCategoryId"  placeholder="请选择文章分类"  class="w100">
                <el-option v-for="item in menuData" :label="item.title" :value="item.id"></el-option>

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序">
              <el-input-number v-model="editForm.sort" :min="0" :max="999" controls-position="right" placeholder="请输入排序" class="w100" />
            </el-form-item>
          </el-col>
<!--					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">-->
<!--						<el-form-item label="封面">-->
<!--							<el-input-number v-model="editForm.sort" :min="0" :max="999" controls-position="right" placeholder="请输入排序" class="w100" />-->
<!--						</el-form-item>-->
<!--					</el-col>-->
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="分类">
              <el-input-number v-model="editForm.type" :min="0" :max="999" controls-position="right" placeholder="请选择分类" class="w100" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="摘要">
              <el-input v-model="editForm.abstracts" type="textarea" placeholder="请输入摘要" maxlength="150"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="内容">
              <Editor v-model="editForm.description" />
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
import {reactive, toRefs, defineComponent, defineAsyncComponent} from 'vue';
import request from "/@/utils/manage";
import API from "/@/api/api";
import {ElMessage} from "element-plus";

// 定义接口来定义对象的类型
interface MenuDataTree {
	id: number;
	label: string;
	children?: MenuDataTree[];
}
interface DialogRow {
  title: string;
  description: string;
  type: number;
  abstracts: string;
  sort: number;
  createTime: string;
  pic: string;
}
interface RoleState {
	isShowDialog: boolean;
	editForm: DialogRow;
	menuData: Array<MenuDataTree>;
	menuProps: {
		children: string;
		label: string;
	};
}

export default defineComponent({
	name: 'systemEditRole',
  components: {
    Upload: defineAsyncComponent(() => import('/@/components/upload/index.vue')),
    Editor: defineAsyncComponent(() => import('/@/components/editor/index.vue')),
  },
	setup(props, {emit}) {
		const state = reactive<RoleState>({
			isShowDialog: false,
			editForm: {
        title: "",
        description: "",
        type: 0,
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
		const openDialog = (row: DialogRow) => {
      console.log(JSON.parse(JSON.stringify(row)))
			state.editForm = JSON.parse(JSON.stringify(row));
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
      console.log({...state.editForm},'editForm')
      request.postAction(API.blog.update,{...state.editForm},{}).then(res => {
        console.log(res,'res')
        if(res.data.code==500){
          ElMessage.warning(res.data.message);
        }
        else{
          ElMessage.success('修改成功');
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
.system-edit-role-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
