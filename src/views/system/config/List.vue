<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <span class="fr">
        <a-input
          v-model="searchWord"
          placeholder="请输入系统配置项代码"
          allow-clear
          class="vertical-top"
          style="width: 400px"
        >
          <a-select slot="addonBefore" :default-value="groups[0].id" style="width: 150px">
            <a-select-option v-for="item in groups" :key="item.id" :value="item.id"> {{ item.value }} </a-select-option>
          </a-select>
        </a-input>
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
          <a-button type="link" size="small" @click="handleEdit(record)"> 编辑 </a-button>
          <a-divider type="vertical" class="divider-primary" />
          <delete-button type="icon" :title="record.title" @confirm="handleDel(record)" />
        </template>
      </basis-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal
      v-model="showEditModal"
      :title="isAdd ? '新建' : '编辑'"
      :keyboard="false"
      :mask-closable="false"
      :after-close="() => $refs.ruleForm.resetFields()"
      @ok="handleOk"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-model-item label="配置项代码" prop="code">
          <a-input v-model="form.code" :disabled="!isAdd" />
        </a-form-model-item>
        <a-form-model-item label="配置项名称" prop="title">
          <a-input v-model="form.title" />
        </a-form-model-item>
        <a-form-model-item label="配置值" prop="value">
          <a-input v-model="form.value" />
        </a-form-model-item>
        <a-form-model-item label="配置类型" prop="type">
          <a-select v-model="form.type">
            <a-select-option v-for="item in types" :key="item.value" :value="item.value">
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属分组" prop="groupId">
          <a-select v-model="form.groupId">
            <a-select-option v-for="item in groups" :key="item.id" :value="item.id">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="说明" prop="discription">
          <a-input v-model="form.discription" type="textarea" :rows="4" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { formatTime } from '@/utils';
import configApi from '@/api/system/config';
import configComponent from './components';
const initForm = {
  code: '',
  name: '',
  value: '',
  type: '',
  groupId: '',
  discription: ''
};
export default {
  inject: ['$pagination'],
  data() {
    const groups = [
      {
        value: '默认分组',
        id: 0
      },
      {
        value: '开关类型分组',
        id: 1
      },
      {
        value: '路径类型分组',
        id: 2
      },
      {
        value: '阈值类型分组',
        id: 3
      },
      {
        value: '分组配置',
        id: 4
      }
    ];
    const columns = [
      {
        title: '代码',
        dataIndex: 'code'
      },
      {
        title: '名称',
        dataIndex: 'title'
      },
      {
        title: '配置值',
        dataIndex: 'value',
        ellipsis: true,
        customRender: (text, row) => {
          const type = configComponent.find((item) => item.value === Number(row.type));
          return type?.component ? (
            <type.component value={String(text)} is-edit={false} title={text}></type.component>
          ) : (
            ''
          );
        }
      },
      {
        title: '说明',
        dataIndex: 'describe',
        ellipsis: true,
        customRender: (text) => (
          <a-tooltip>
            <template slot="title">{text}</template>
            <div class="text-nowrap">{text}</div>
          </a-tooltip>
        )
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        width: 170,
        align: 'center',
        customRender: (text) => formatTime(new Date(text), 'YYYY-MM-DD HH:mm:ss')
      },
      {
        title: '操作',
        scopedSlots: { customRender: 'action' },
        align: 'center',
        width: 200
      }
    ];
    return {
      searchWord: '',
      tableData: [],
      tableLoading: false,
      groups,
      types: configComponent,
      columns: Object.freeze(columns),
      pagination: {
        ...this.$pagination,
        pageSize: 20
      },
      showEditModal: false,
      isAdd: true,
      form: {},
      rules: {
        code: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入配置项代码'
          }
        ],
        title: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入配置项名称'
          }
        ],
        value: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入配置项值'
          }
        ],
        type: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择配置类型'
          }
        ],
        groupId: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择所属分组'
          }
        ]
      }
    };
  },
  created() {
    this.getData(1);
  },
  methods: {
    getData(pageNow = 1) {
      this.tableLoading = true;
      configApi
        .list({
          searchWord: this.searchWord,
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
    handleDel() {
      this.$message.success('操作成功');
    },
    handlePageChange(pagination, filters, sorter) {
      this.pagination = pagination;
      console.log(pagination, filters, sorter);
    },
    handleOk() {
      this.$message.success('操作成功');
    }
  }
};
</script>
