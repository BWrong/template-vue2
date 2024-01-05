<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <span class="fr">
        <a-input v-model="searchUsername" placeholder="用户名" allow-clear class="vertical-top" style="width: 200px" />
        <a-input
          v-model="searchEmail"
          placeholder="电子邮箱"
          allow-clear
          class="vertical-top"
          style="width: 200px; margin-left: 4px"
        />
        <a-button class="space" icon="search" type="primary">搜索</a-button>
        <a-button class="space" icon="reload" type="primary" ghost>重置</a-button>
      </span>
      <a-button class="" type="primary" ghost icon="plus" @click="handleAdd"> 新建 </a-button>
    </a-card>
    <a-card>
      <basis-table
        show-index
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        @change="handlePageChange"
      >
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(record)"> 编辑 </a-button>
            <delete-button :title="record.title" @confirm="handleDel(record)" />
            <a-dropdown placement="bottomRight">
              <a-button size="small" type="link" @click.prevent>
                更多
                <a-icon type="icon-down" />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item v-for="item in moreAction" :key="item.text" @click="item.click(record)">
                    <a-icon :type="item.icon" />{{ item.text }}
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </basis-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal
      v-model="showEditModal"
      :title="isAdd ? '新建' : '编辑'"
      :width="820"
      :keyboard="false"
      :mask-closable="false"
      :after-close="() => $refs.ruleForm.resetFields()"
      @ok="handleOk"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-model-item has-feedback label="用户名" prop="username">
              <a-input v-model="form.username" :disabled="!isAdd">
                <a-icon slot="suffix" type="user" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="姓名" prop="name">
              <a-input v-model="form.name">
                <a-icon slot="suffix" type="solution" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="昵称" prop="nickName">
              <a-input v-model="form.nickName">
                <a-icon slot="suffix" type="number" />
              </a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item has-feedback label="身份证号码" prop="idNumber">
              <a-input v-model="form.idNumber">
                <a-icon slot="suffix" type="idcard" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="联系电话" prop="telphone">
              <a-input v-model="form.telphone">
                <a-icon slot="suffix" type="phone" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="电子邮箱" prop="email">
              <a-input v-model="form.email">
                <a-icon slot="suffix" type="mail" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              has-feedback
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
              label="所属部门"
              prop="deptId"
            >
              <a-cascader
                v-model="selectDept"
                :options="deptList"
                :default-value="[form.deptCode]"
                :field-names="{ label: 'label', value: 'code', children: 'children' }"
                placeholder="请选择所属部门"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              has-feedback
              :label-col="{ span: 3 }"
              :wrapper-col="{ span: 21 }"
              label="描述"
              prop="remark"
            >
              <a-input v-model="form.remark" type="textarea" :rows="4" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <!-- 设置角色 -->
    <a-modal v-model="showRoleModal" title="设置角色" :keyboard="false" :mask-closable="false" @ok="handleOk">
      <a-select
        v-model="selectRole"
        mode="multiple"
        placeholder="请选择角色"
        style="width: 100%"
        @change="handleRoleChange"
      >
        <a-select-option v-for="item in roleList" :key="item.roleId" :value="item.roleId">
          {{ item.roleName }}
        </a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>

<script>
import { USER_STATUS } from '@/config/dictionary';
import userApi from '@/api/system/user';
import departmentApi from '@/api/system/department';
import roleApi from '@/api/system/role';
const initForm = {
  username: '',
  name: '',
  nickName: '',
  email: '',
  idNumber: '',
  deptId: '',
  telphone: '',
  remark: ''
};
export default {
  inject: ['$pagination'],
  data() {
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        ellipsis: true
      },
      {
        title: '姓名',
        dataIndex: 'name'
      },
      {
        title: '昵称',
        dataIndex: 'nickname'
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
        ellipsis: true
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        customRender: (text, record) => {
          if (record.delFlag === '1') {
            return <a-badge status="error" text="已删除" />;
          } else {
            return (
              <a-badge status={record.status === '0' ? 'processing' : 'warning'} text={USER_STATUS[record.status]} />
            );
          }
        },
        filters: Object.keys(USER_STATUS).map((value) => ({
          text: USER_STATUS[value],
          value
        })),
        align: 'center'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
        align: 'center'
      },
      {
        title: '操作',
        scopedSlots: { customRender: 'action' },
        align: 'center',
        width: 200
      }
    ];
    return {
      searchUsername: '',
      searchEmail: '',
      tableData: [],
      tableLoading: false,
      columns: Object.freeze(columns),
      pagination: {
        ...this.$pagination,
        pageSize: 20
      },
      moreAction: [
        {
          text: '锁定账号',
          icon: 'lock',
          click: this.handleLock
        },
        {
          text: '解锁账号',
          icon: 'unlock',
          click: this.handleLock
        },
        {
          text: '重置密码',
          icon: 'reload',
          click: this.handleResetPwd
        },
        {
          text: '设置角色',
          icon: 'user',
          click: this.handleSetRole
        }
      ],
      deptList: [],
      selectDept: [],
      showEditModal: false,
      isAdd: true,
      form: {},
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入用户名'
          }
        ],
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入姓名'
          }
        ]
      },
      showRoleModal: false,
      roleList: [],
      selectRole: []
    };
  },
  created() {
    this.getData(1);
    this.getDeptList();
    this.getRoleList();
  },
  methods: {
    getData(pageNow = 1) {
      this.tableLoading = true;
      userApi
        .list({
          pageSize: this.pagination.pageSize,
          pageNow
        })
        .then((res) => {
          this.pagination.current = res.current;
          this.pagination.total = res.total;
          this.tableData = res.list;
          this.tableLoading = false;
        });
    },
    getDeptList() {
      departmentApi
        .list({
          pageSize: 10000,
          pageNow: 1
        })
        .then((res) => {
          console.log(res);
          this.deptList = res.list;
        });
    },
    getRoleList() {
      roleApi
        .list({
          pageSize: 10000,
          pageNow: 1
        })
        .then((res) => {
          console.log(res);
          this.roleList = res.list;
        });
    },
    handleAdd() {
      this.isAdd = true;
      this.showEditModal = true;
      this.form = { ...initForm };
    },
    handleEdit(row) {
      console.log(row);
      this.isAdd = false;
      this.showEditModal = true;
      this.form = { ...row };
    },
    handleLock(row) {
      this.$modal.confirm({
        title: '提示',
        content: () => <span>您确定要锁定【{<span class="text-primary">{row.username}</span>}】用户吗？</span>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$message.success('操作成功');
        }
      });
    },
    handleResetPwd(row) {
      this.$modal.confirm({
        title: '提示',
        content: () => <span>您确定要重置【{<span class="text-primary">{row.username}</span>}】用户的密码吗？</span>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$message.success('操作成功');
        }
      });
    },
    handleSetRole() {
      this.showRoleModal = true;
    },
    handleDel() {
      this.$message.success('操作成功');
    },
    handlePageChange(pagination, filters, sorter) {
      this.pagination = pagination;
      console.log(pagination, filters, sorter);
    },
    handleOk() {
      this.$message.success('操作成功');
    },
    handleRoleChange() {
      this.$message.success('操作成功');
    }
  }
};
</script>
