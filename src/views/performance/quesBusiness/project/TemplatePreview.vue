<!--
 * @Author: Yelucc
 * @Date: 2021-04-29 18:04:16
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-04-29 18:32:12
 * @Description: 
-->
<template>
    <div v-loading="createProjectLoading" class="template-preview-container">
        <div class="back-view">
            <el-button size="mini" round @click="$router.back(-1)">
                <i class="el-icon-arrow-left" />
                返回
            </el-button>
        </div>
        <div class="template-preview-content">
            <el-scrollbar style="height: 90vh;">
                <project-form
                    v-if="projectConfig.projectKey"
                    :project-config="projectConfig"
                    @submit="submitForm"
                />
            </el-scrollbar>
            <div style="margin: 20px;">
                <el-button
                    type="primary"
                    @click="createProjectByTemplate"
                >
                    使用该模板
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import ProjectForm from '@/views/performance/quesBusiness/form/ProjectForm'
import {createProjectByTemplate} from '@/api/performance/tduck'
export default {
    name: 'TemplatePreview',
    components: {
        ProjectForm
    },
    props: {},
    data() {
        return {
            createProjectLoading: false,
            projectConfig: {
                projectKey: '',
                preview: false,
                projectKind: 2,
                showBtns: true
            }
        }
    },
    mounted() {
        this.projectConfig.projectKey = this.$route.query.key
    },
    methods: {
        createProjectByTemplate() {
            // this.createProjectLoading = true
            // this.$api.post('/business/questionsRecord/project/template/create/', {'key': this.projectConfig.projectKey}).then(res => {
            //     this.createProjectLoading = false
            //     if (res.data) {
            //         this.$router.push({path: '/project/form', query: {key: res.data, active: 1}})
            //     }
            // }).catch(res => {
            //     console.log(res)
            //     this.createProjectLoading = false
            // })
            createProjectByTemplate({'key': this.projectConfig.projectKey}).then(res=>{
                this.createProjectLoading = false
                if (res.data) {
                    this.$router.push({path: '/project/form', query: {key: res.data, active: 1}})
                }
            }).catch(err=>{
                console.log(err)
                this.createProjectLoading = false
            })
        },
        submitForm() {

        }
    }
}
</script>

<style lang="scss" scoped>
.template-preview-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    align-content: center;
    overflow-y: hidden;
}
.back-view {
    display: flex;
    width: 80%;
    align-content: flex-start;
    margin: 10px;
}
.template-preview-content {
    display: flex;
}
</style>
