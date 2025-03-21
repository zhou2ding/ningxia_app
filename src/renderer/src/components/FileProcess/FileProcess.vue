<template>
  <div class="file-processor">
    <!-- 四个边框角 -->
    <div class="rect lt"></div>
    <div class="rect rt"></div>
    <div class="rect lb"></div>
    <div class="rect rb"></div>

    <!-- 上传区域 -->
    <div class="upload-section">
      <el-button
          type="primary"
          icon="el-icon-upload"
          :disabled="isUploading"
          :loading="isUploading"
          @click="$refs.fileInput.click()"
      >
        {{ isUploading ? '上传中 ...' : '上传zip文件' }}
      </el-button>
      <input
          type="file"
          ref="fileInput"
          accept=".zip"
          @change="handleFileUpload"
          hidden
      />

      <el-tooltip
          content="仅支持.zip格式文件"
          placement="right"
          effect="light"
      >
        <i class="el-icon-question hint-icon"></i>
      </el-tooltip>
    </div>

    <!-- 文件列表 -->
    <div class="file-list">
      <div v-if="files.length" class="check-all">
        <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAll"
        >
          全选
        </el-checkbox>
      </div>

      <el-checkbox-group v-model="selectedFiles">
        <div v-for="file in files" :key="file" class="file-item">
          <el-checkbox :label="file">{{ getFileName(file) }}</el-checkbox>
        </div>
      </el-checkbox-group>
    </div>

    <!-- 计算按钮 -->
    <el-button
        type="success"
        :disabled="!selectedFiles.length || isCalculating"
        :loading="isCalculating"
        @click="handleCalculate"
    >
      {{ isCalculating ? '计算中 ...' : '开始计算' }}
    </el-button>

    <!-- 进度条遮罩 -->
    <div v-if="isUploading || isCalculating" class="progress-mask">
      <el-progress
          type="circle"
          :percentage="progress"
          :width="80"
          color="#5fbfff"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "FileProcess",
  data() {
    return {
      files: [],
      selectedFiles: [],
      isCalculating: false,
      isUploading: false,
      progress: 0
    }
  },
  mounted() {
    this.$forceUpdate();
  },
  computed: {
    checkAll: {
      get() {
        return this.selectedFiles.length === this.files.length
      },
      set(value) {
        this.selectedFiles = value ? this.files.slice() : []
      }
    },
    isIndeterminate() {
      return this.selectedFiles.length > 0 &&
          this.selectedFiles.length < this.files.length
    }
  },
  methods: {
    async handleFileUpload(e) {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)

      this.isUploading = true
      this.progress = 0

      const timer = setInterval(() => {
        if (this.progress < 90) {
          const increment = Math.floor(Math.random() * 10 + 5);
          this.progress = Math.min(this.progress + increment, 99);
        }
      }, 300);

      try {
        const res = await this.$axios.post('/api/unzip', formData)
        this.files = res.data.files

        this.progress = 100;
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        this.$message.error('文件解压失败，请检查文件格式')
      } finally {
        clearInterval(timer);
        this.isUploading = false
        e.target.value = null
      }
    },

    async handleCalculate() {
      this.isCalculating = true
      this.progress = 0

      const timer = setInterval(() => {
        if (this.progress < 90) {
          const increment = Math.floor(Math.random() * 10 + 5);
          this.progress = Math.min(this.progress + increment, 99);
        }
      }, 300);

      try {
        const res = await this.$axios.post('/api/calculate', {
          files: this.selectedFiles
        }, {
          responseType: 'blob'
        })

        this.progress = 100;
        await new Promise(resolve => setTimeout(resolve, 300));

        // 下载Word文件
        const link = document.createElement('a')
        link.href = URL.createObjectURL(
            new Blob([res.data], {type: 'application/msword'})
        )
        link.download = 'result.docx'
        link.click()

        this.$message.success('文件生成成功')
      } catch (error) {
        this.$message.error('计算过程发生错误')
      } finally {
        clearInterval(timer);
        this.isCalculating = false
      }
    },
    getFileName(path) {
      // 使用正则表达式处理Windows和Linux路径分隔符
      return path.split(/[\\/]/).pop();
    },

    handleCheckAll(value) {
      this.selectedFiles = value ? this.files.slice() : []
    }
  }
}
</script>

<style scoped>
.check-all {
  padding: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

.file-processor {
  width: 100%;
  height: 100%;
  padding: 20px;
  position: relative;
  border: 1px solid #0079fe;
}

.rect {
  width: 20px;
  height: 20px;
  position: absolute;
  z-index: 1;
  border-top: 2px solid #5fbfff;
  border-left: 2px solid #5fbfff;
}

.rect.lt {
  left: -1px;
  top: -1px;
}

.rect.rt {
  top: -1px;
  right: -1px;
  transform: rotate(90deg);
}

.rect.lb {
  bottom: -1px;
  left: -1px;
  transform: rotate(-90deg);
}

.rect.rb {
  bottom: -1px;
  right: -1px;
  transform: rotate(180deg);
}

.upload-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hint-icon {
  color: #5fbfff;
  cursor: help;
  font-size: 18px;
}

.file-list {
  margin: 15px 0;
  height: 325px;
  overflow-y: auto;
}

.file-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.progress-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>