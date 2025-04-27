<template>
  <div class="scroll-table-index">
    <div class="title">报告列表</div>
    <el-table
      ref="scroll_Table"
      class="scroll-table"
      :highlight-current-row="false"
      :data="tableData"
      :cell-style="{ padding: '10px 0' }"
      :row-style="{ height: '50px' }"
    >
      <el-table-column width="185" prop="report" label="报告名称"></el-table-column>
      <el-table-column
        width="185"
        prop="date"
        label="生成日期"
        :formatter="formatDate"
      ></el-table-column>
      <el-table-column #default="scope" width="250" label="操作">
        <el-button type="primary" link @click="handleView(scope.row)">查看</el-button>
        <el-button type="primary" link @click="handleDownload(scope.row)">下载</el-button>
        <el-button
          v-if="shouldShowExtraExport(scope.row.report)"
          type="primary"
          link
          @click="handleExtraExport(scope.row)"
        >
          导出达标情况
        </el-button>
        <el-button type="danger" link style="color: #ff4d4f" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="查看报告内容" width="60%">
      <div class="markdown-content" v-html="renderedMarkdown"></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElMessage, ElMessageBox } from 'element-plus'
import { marked } from 'marked'
import service from '../../api/request'
import { on, off } from '../../utils/eventBus'

// --- 响应式状态 ---
const tableData = ref([])
const scroll_Table = ref(null)
const dialogVisible = ref(false) // 控制对话框的显示/隐藏
const markdownContent = ref('') // 存储从 API 获取的原始 markdown 内容

// --- 计算属性 ---
// 当 markdownContent 变化时安全地渲染它
const renderedMarkdown = computed(() => {
  if (!markdownContent.value) return ''
  marked.setOptions({
    gfm: true, // 启用 GFM
    breaks: true // 将换行符渲染为 <br>
  })
  return marked.parse(markdownContent.value)
})

// 判断是否显示"导出达标情况"按钮
const shouldShowExtraExport = (reportName) => {
  return reportName.includes('国省') || reportName.includes('高速') || reportName.includes('农村')
}

onMounted(() => {
  fetchReportList()
  on('refresh-report-list', fetchReportList)
})

onUnmounted(() => {
  off('refresh-report-list', fetchReportList)
})

// --- 方法 ---
const fetchReportList = async () => {
  try {
    const response = await service.get('/api/reports/list') // 调用列表 API
    const filenames = response.data // 假设返回的是字符串数组

    if (Array.isArray(filenames)) {
      tableData.value = filenames
        .map((fullFilename) => {
          const parts = fullFilename.match(/(.*)_(\d+)\.(docx|md)$/) // 正则匹配 文件名_时间戳.后缀
          if (parts && parts.length === 4) {
            const baseName = parts[1]
            const timestampSeconds = parseInt(parts[2], 10)
            const extension = parts[3]
            const reportName = `${baseName}.${extension}`
            const dateTimestamp = timestampSeconds * 1000

            return {
              report: reportName, // 解析出的报告名
              date: dateTimestamp, // 解析出的日期时间戳 (毫秒)
              originalFilename: fullFilename // 保存原始完整文件名，供后续操作使用
            }
          } else {
            console.warn(`无法解析文件名格式: ${fullFilename}`)
            return null
          }
        })
        .filter((item) => item !== null)
    } else {
      console.error('API /api/reports/list 未返回有效的数组')
      tableData.value = []
      ElMessage.error('获取报告列表失败：响应格式错误')
    }
  } catch (error) {
    console.error('获取报告列表失败:', error)
    tableData.value = []
    ElMessage.error('获取报告列表失败')
  }
}

// 日期格式化函数
const formatDate = (cellValue) => {
  console.log(cellValue)
  if (!cellValue) return ''
  const date = new Date(cellValue.date)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 处理 "查看" 按钮点击事件
const handleView = async (row) => {
  try {
    markdownContent.value = '# 正在加载内容...'
    dialogVisible.value = true
    const originalFilename = row.originalFilename
    const lastDotIndex = originalFilename.lastIndexOf('.')
    const baseFilename =
      lastDotIndex === -1 ? originalFilename : originalFilename.substring(0, lastDotIndex)
    const filenameForView = `${baseFilename}.md`
    const encodedFilename = encodeURIComponent(filenameForView)
    const response = await service.get(`/api/reports/view/${encodedFilename}`)

    markdownContent.value = response.data
  } catch (error) {
    console.error('获取 markdown 内容时出错:', error)
    const errorMsgFromServer = error.response?.data?.message || error.response?.data?.error
    ElMessage.error(errorMsgFromServer || '加载报告内容失败')
    markdownContent.value = `加载内容时出错: ${errorMsgFromServer || error.message || '未知错误'}`
  }
}

// 处理 "下载" 按钮点击事件
const handleDownload = async (row) => {
  try {
    const response = await service({
      url: `/api/reports/download/${row.originalFilename}`,
      method: 'GET',
      responseType: 'blob'
    })

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream'
    })

    let filename = row.originalFilename
    const contentDisposition = response.headers['content-disposition']

    if (contentDisposition) {
      const utf8Filename = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i)
      if (utf8Filename && utf8Filename[1]) {
        filename = decodeURIComponent(utf8Filename[1])
      } else {
        const fallbackFilename = contentDisposition.match(/filename="?([^;"]+)/i)
        if (fallbackFilename && fallbackFilename[1]) {
          filename = fallbackFilename[1].replace(/^"(.*)"$/, '$1')
        }
      }
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success(`${filename} 下载成功`)
  } catch (error) {
    console.error('下载文件时出错:', error)
    ElMessage.error('下载文件失败: ' + (error.message || '未知错误'))
  }
}

// 处理 "导出达标情况" 按钮点击事件
const handleExtraExport = async (row) => {
  try {
    // 直接使用原始文件名调用API，不要修改文件名
    const originalFilename = row.originalFilename

    const response = await service({
      url: `/api/reports/extraExport/${originalFilename}`,
      method: 'GET',
      responseType: 'blob'
    })

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream'
    })

    // 从响应头获取文件名（后端会返回正确的带_extra的文件名）
    let downloadFilename = originalFilename
    const contentDisposition = response.headers['content-disposition']

    if (contentDisposition) {
      const utf8Filename = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i)
      if (utf8Filename && utf8Filename[1]) {
        downloadFilename = decodeURIComponent(utf8Filename[1])
      } else {
        const fallbackFilename = contentDisposition.match(/filename="?([^;"]+)/i)
        if (fallbackFilename && fallbackFilename[1]) {
          downloadFilename = fallbackFilename[1].replace(/^"(.*)"$/, '$1')
        }
      }
    }

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = downloadFilename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success(`达标情况导出成功`)
  } catch (error) {
    console.error('导出达标情况时出错:', error)
    ElMessage.error('导出达标情况失败: ' + (error.message || '未知错误'))
  }
}

// 处理 "删除" 按钮点击事件
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除报告 "${row.report}" 吗? 此操作不可恢复。`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await service.delete(`/api/reports/${row.originalFilename}`)
    ElMessage.success(response.data.message || '删除成功')
    fetchReportList() // 刷新列表
  } catch (error) {
    if (error !== 'cancel') {
      // 如果不是用户取消操作
      console.error('删除报告时出错:', error)
      const errorMsg = error.response?.data?.error || error.message || '删除失败'
      ElMessage.error(errorMsg)
    }
  }
}
</script>

<style lang="less">
.scroll-table-index {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: url('../../assets/images/kuang.png') no-repeat;
  background-size: 100% 100%;
  position: relative;

  .title {
    position: absolute;
    top: 10px;
    left: 2%;
    text-align: left;
    color: #2b8fff;
    font-size: 18px;
    z-index: 1;
    font-weight: bold;
    padding-left: 12px;
  }

  .scroll-table {
    width: 96%;
    height: calc(88% - 20px);
    scroll-behavior: smooth;
    position: absolute;
    top: 45px;
    left: 2%;
  }

  .el-table {
    background-color: rgba(255, 255, 255, 0);

    .el-table__header-wrapper {
      background-color: rgba(255, 255, 255, 0);

      .el-table__header {
        background-color: rgba(255, 255, 255, 0);

        thead tr {
          background-color: transparent !important;
        }

        th {
          background-color: rgba(255, 255, 255, 0) !important;
          color: #00a4ff;
          border-bottom: 1px solid rgba(0, 164, 255, 0.3);
        }
      }
    }

    .el-table__inner-wrapper {
      .el-table__row {
        background-color: rgba(255, 255, 255, 0);
        color: rgba(255, 255, 255, 0.8);

        td {
          background-color: rgba(255, 255, 255, 0);
          border-bottom: 1px solid rgba(0, 164, 255, 0.2);
        }

        &:hover > td {
          background-color: #063570 !important;
        }
      }

      &::before {
        display: none;
      }
    }
  }
}

.el-dialog {
  .el-dialog__body {
    .markdown-content {
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  pre {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;

    code {
      color: #333;
      font-family: 'Courier New', Courier, monospace;
    }
  }

  code:not(pre code) {
    background-color: #f0f0f0;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.9em;
  }
}
</style>
