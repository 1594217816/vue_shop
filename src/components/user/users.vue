<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航栏结束 -->

    <!-- Card 卡片视图区 -->
    <el-card class="box-card">
      <!-- 头部搜索  添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @input="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 头部搜索  添加区域结束 -->

      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>

            <!-- 分配角色按钮 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 用户列表区域结束 -->

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 分页区域结束 -->
    </el-card>
    <!-- Card 卡片视图区结束 -->

    <!-- 添加用户对话框开始 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm('addUserForm')"
    >
      <!-- 添加用户表单开始 -->
      <el-form
        :model="addUserForm"
        :rules="addFormRules"
        ref="addUserForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加用户表单结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框结束 -->

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogUpdateVisible"
      width="50%"
    >
      <!-- 修改用户表单 -->
      <el-form
        ref="updataUserForm"
        :model="updataUserForm"
        :rules="updataUserFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updataUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updataUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="updataUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改用户表单结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 定义邮箱验证规则
    // rule 验证规则  value 要验证的值
    var validateEmail = (rule, value, callback) => {
      const RegExpEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (RegExpEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error('请输入合法的邮箱'));
    };

    // 定义手机号验证规则
    // rule 验证规则  value 要验证的值
    var validateMobile = (rule, value, callback) => {
      const RegExpMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (RegExpMobile.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error('请输入合法的手机号'));
    };

    return {
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加表单验证规则

      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
      // 查询到的用户表单
      updataUserForm: {},
      // 更新用户表单验证规则
      updataUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 10,
            message: '长度在 5 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5,
      },
      // 用户数据集合
      userList: [],
      // 总页数
      total: 0,
      // 添加用户对话框的显示与隐藏
      dialogVisible: false,
      // 更新用户对话框的显示与隐藏
      dialogUpdateVisible: false,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 发送ajax请求获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '请求用户列表失败！',
          type: 'error',
        });
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(res);
    },
    // 改变每页显示的条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    // 换页操作
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList();
    },
    // 更新用户状态
    async userStateChanged(userMsg) {
      const { data: res } = await this.$http.put(
        `users/${userMsg.id}/state/${userMsg.mg_state}`
      );
      if (res.meta.status !== 200) {
        userMsg.mg_state = !userMsg.mg_state;
        return this.$message({
          showClose: true,
          message: '更新失败！',
          type: 'error',
        });
      }
      this.$message({
        showClose: true,
        message: '更新成功！',
        type: 'success',
      });
    },
    // 关闭添加表单提示框重置表单
    resetForm(addUserForm) {
      // resetFields是element ui 组件中的表单重置方法
      this.$refs[addUserForm].resetFields();
    },
    // 点击按钮   添加用户表单
    adduser() {
      this.$refs.addUserForm.validate(async (valid) => {
        // 验证失败直接返回
        if (!valid) return;

        // 验证成功发送ajax请求
        const { data: res } = await this.$http.post('users', this.addUserForm);
        console.log(res);
        // 提交服务器失败
        if (res.meta.status !== 201) {
          return this.$message({
            showClose: true,
            message: '添加用户失败！',
            type: 'error',
          });
        }
        // 提交服务器成功
        this.$message({
          showClose: true,
          message: '添加用户成功！',
          type: 'success',
        });
        // 提交成功后隐藏对话框
        this.dialogVisible = false;
        // 重新获取用户列表数据
        this.getUserList();
      });
    },
    // 显示修改用户表单
    async showEditDialog(id) {
      // 发送ajax请求  查询用户信息
      const { data: res } = await this.$http.get('users/' + id);
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '查询用户失败！',
          type: 'error',
        });
      }
      this.updataUserForm = res.data;
      // console.log(this.updataUserForm);
      this.dialogUpdateVisible = true;
    },
    // 更新用户数据
    editUserInfo() {
      this.$refs.updataUserForm.validate(async (valid) => {
        // 预校验不通过
        if (!valid) return false;
        // 预校验通过
        // 1. 发送ajax请求更新用户数据
        // console.log(this.updataUserForm);
        const { data: res } = await this.$http.put(
          'users/' + this.updataUserForm.id,
          {
            email: this.updataUserForm.email,
            mobile: this.updataUserForm.mobile,
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message({
            showClose: true,
            message: '更新用户失败！',
            type: 'error',
          });
        }
        this.$message({
          showClose: true,
          message: '更新用户成功！',
          type: 'success',
        });
        // 2. 更新页面信息
        this.getUserList();
        // 关闭对话框
        this.dialogUpdateVisible = false;
      });
    },
    // 删除用户数据
    async removeUserById(id) {
      // 弹出消息盒子  让用户确认是否需要删除
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err);
      // res = confirm  确认删除
      // res = cancel   取消删除

      // 取消删除
      if (res !== 'confirm') {
        return this.$message({
          showClose: true,
          message: '已取消删除！',
          type: 'info',
        });
      }

      // 确认删除
      // 1. 发送ajax请求
      const { data: delResult } = await this.$http.delete('users/' + id);
      console.log(delResult);

      // 删除失败
      if (delResult.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: delResult.meta.msg,
          type: 'error',
        });
      }

      // 删除成功
      this.$message({
        showClose: true,
        message: delResult.meta.msg,
        type: 'success',
      });

      // 更新页面
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>
