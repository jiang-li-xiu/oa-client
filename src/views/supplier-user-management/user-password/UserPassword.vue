<template>
  <!-- <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading"> -->
  <a-card :bordered="false" class="assembly-container-col">
    <a-form :form="form">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="当前登录密码">
        <a-input
          type="password"
          placeholder="请输入当前登录密码"
          v-decorator="['oldpassword', validatorRules.oldpassword]"
        />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新密码">
        <a-input type="password" placeholder="请输入新密码" v-decorator="['password', validatorRules.password]" />
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="确认新密码">
        <a-input
          type="password"
          @blur="handleConfirmBlur"
          placeholder="请确认新密码"
          v-decorator="['confirmpassword', validatorRules.confirmpassword]"
        />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号码">
        <div>{{ formatNickname }}</div>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="验证码">
        <a-input v-model="model.captcha" size="large" type="text" placeholder="请输入验证码" style="width:700px">
          <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
        <a-button
          class="getCaptcha"
          tabindex="-1"
          :disabled="state.smsSendBtn"
          @click.stop.prevent="getCaptcha"
          v-text="(!state.smsSendBtn && '获取验证码') || state.time + ' s'"
        ></a-button>
      </a-form-item>

      <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="captcha">
        <a-input v-model="model.captcha" size="large" type="text" placeholder="请输入验证码">
          <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-button
        class="getCaptcha"
        tabindex="-1"
        :disabled="state.smsSendBtn"
        @click.stop.prevent="getCaptcha"
        v-text="(!state.smsSendBtn && '获取验证码') || state.time + ' s'"
      ></a-button> -->

      <!-- <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item required prop="mobile">
          <a-input v-model="model.mobile" size="large" type="text" placeholder="请输入手机号">
            <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-model-item>
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="16">
            <a-form-model-item required prop="captcha">
              <a-input v-model="model.captcha" size="large" type="text" placeholder="请输入验证码">
                <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-button
              class="getCaptcha"
              tabindex="-1"
              :disabled="state.smsSendBtn"
              @click.stop.prevent="getCaptcha"
              v-text="(!state.smsSendBtn && '获取验证码') || state.time + ' s'"
            ></a-button>
          </a-col>
        </a-row>
      </a-form-model> -->
    </a-form>

    <div class="bootom-button">
      <a-button @click="handleCancel" style="margin-right: 0.8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="confirmLoading">确认</a-button>
    </div>
  </a-card>
</template>

<script>
import { putAction, postAction } from '@/api/manage'
import { mapActions } from 'vuex'
export default {
  name: 'UserPassword',
  data() {
    return {
      model: {
        mobile: '',
        captcha: ''
      },
      //手机号登录用
      state: {
        time: 60,
        smsSendBtn: false
      },
      validatorRules: {
        mobile: [{ required: true, message: '请输入手机号码!' }, { validator: this.validateMobile }],
        captcha: [
          {
            required: true,
            message: '请输入验证码!'
          }
        ]
      },
      title: '修改密码',
      modalWidth: 800,
      visible: false,
      confirmLoading: false,
      validatorRules: {
        oldpassword: {
          rules: [
            {
              required: true,
              message: '请输入旧密码!'
            }
          ]
        },
        password: {
          rules: [
            {
              required: true,
              message: '请输入新密码!'
            },
            {
              validator: this.validateToNextPassword
            }
          ]
        },
        confirmpassword: {
          rules: [
            {
              required: true,
              message: '请确认新密码!'
            },
            {
              validator: this.compareToFirstPassword
            }
          ]
        }
      },
      confirmDirty: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      form: this.$form.createForm(this),
      url: 'sys/user/updatePassword',
      username: ''
    }
  },
  computed: {
    // 格式化手机号
    formatNickname() {
      //截取  其余*
      return this.$store.getters.userInfo.phone.substr(0, 3) + '****' + this.$store.getters.userInfo.phone.substr(-4)
    }
  },
  methods: {
    show(uname) {
      if (!uname) {
        this.$message.warning('当前系统无登录用户!')
        return
      } else {
        this.username = uname
        this.form.resetFields()
        this.visible = true
      }
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.selectedRole = []
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          that.confirmLoading = true
          let params = Object.assign({ username: this.username }, values)
          console.log('修改密码提交数据', params)
          putAction(this.url, params)
            .then(res => {
              if (res.success) {
                console.log(res)
                that.$message.success(res.message)
                that.close()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },

    ...mapActions(['PhoneLogin']),
    handleLogin(rememberMe) {
      this.validateFields(['mobile', 'captcha'], err => {
        if (!err) {
          let loginParams = {
            mobile: this.model.mobile,
            captcha: this.model.captcha,
            remember_me: rememberMe
          }
          console.log('登录参数', loginParams)
          this.PhoneLogin(loginParams)
            .then(res => {
              this.$emit('success', res.result)
            })
            .catch(err => {
              this.$emit('fail', err)
            })
        } else {
          this.$emit('validateFail')
        }
      })
    },
    // 校验手机号
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    //获取验证码
    getCaptcha(e) {
      e.preventDefault()
      let that = this
      that.validateFields(['mobile'], err => {
        if (!err) {
          that.state.smsSendBtn = true
          let interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = that.$message.loading('验证码发送中..', 0)
          let smsParams = {}
          smsParams.mobile = that.model.mobile
          smsParams.smsmode = '0'
          postAction('/sys/sms', smsParams)
            .then(res => {
              if (!res.success) {
                setTimeout(hide, 0)
                that.cmsFailed(res.message)
              }
              console.log(res)
              setTimeout(hide, 500)
            })
            .catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              that.state.time = 60
              that.state.smsSendBtn = false
              that.requestFailed(err)
            })
        }
      })
    },
    cmsFailed(err) {
      this.$notification['error']({
        message: '获取验证码失败',
        description: err,
        duration: 4
      })
    },
    /**
     * 验证字段
     * @param arr
     * @param callback
     */
    validateFields(arr, callback) {
      let promiseArray = []
      for (let item of arr) {
        let p = new Promise((resolve, reject) => {
          this.$refs['form'].validateField(item, err => {
            if (!err) {
              resolve()
            } else {
              reject(err)
            }
          })
        })
        promiseArray.push(p)
      }
      Promise.all(promiseArray)
        .then(() => {
          callback()
        })
        .catch(err => {
          callback(err)
        })
    }
  }
}
</script>

<style scoped>
.bootom-button {
  float: right;
}
</style>
