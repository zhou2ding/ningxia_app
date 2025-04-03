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
      <el-table-column width="125" label="操作" #default="scope">
        <el-button type="primary" link @click="handleView(scope.row)">查看</el-button>
        <el-button type="primary" link @click="handleDownload(scope.row)">下载</el-button>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="查看报告内容" width="60%">
      <div v-html="renderedMarkdown"></div>
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
import { ElTable, ElTableColumn, ElButton, ElDialog, ElMessage } from 'element-plus'
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
  // 配置 marked (可选, 例如启用 GitHub Flavored Markdown, 自动换行)
  marked.setOptions({
    gfm: true, // 启用 GFM
    breaks: true // 将换行符渲染为 <br>
  })
  // 将 markdown 渲染为 HTML
  // 警告: 确保 markdown 源是可信的，以防止 XSS 攻击
  return marked.parse(markdownContent.value)
})

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
            // 如果文件名格式不符，可以返回一个默认对象或 null，然后过滤掉
            console.warn(`无法解析文件名格式: ${fullFilename}`)
            return null // 或者返回一个错误提示对象
          }
        })
        .filter((item) => item !== null) // 过滤掉解析失败的项
    } else {
      console.error('API /api/reports/list 未返回有效的数组')
      tableData.value = [] // 清空表格
      ElMessage.error('获取报告列表失败：响应格式错误')
    }
  } catch (error) {
    console.error('获取报告列表失败:', error)
    tableData.value = [] // 清空表格
    ElMessage.error('获取报告列表失败')
  }
}

// 2. 日期格式化函数
const formatDate = (cellValue) => {
  console.log(cellValue)
  if (!cellValue) return '' // 如果值不存在，返回空字符串
  const date = new Date(cellValue.date)
  const year = date.getFullYear()
  // getMonth() 返回 0-11，所以需要 +1；padStart 确保月份和日期是两位数
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` // 返回格式化后的字符串
}

// 4. 处理 "查看" 按钮点击事件
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
    const response = await service.get(`/api/reports/view/${encodedFilename}`) // 使用完整文件名调用新 API

    // 假设 API 直接返回 Markdown 文本
    markdownContent.value = response.data
  } catch (error) {
    console.error('获取 markdown 内容时出错:', error)
    // 尝试从 error response 获取更具体的信息
    const errorMsgFromServer = error.response?.data?.message || error.response?.data?.error
    ElMessage.error(errorMsgFromServer || '加载报告内容失败')
    markdownContent.value = `加载内容时出错: ${errorMsgFromServer || error.message || '未知错误'}`
  }
}

// 5. 处理 "下载" 按钮点击事件
const handleDownload = async (row) => {
  try {
    // 注意：这里不再编码文件名，因为后端会处理
    const response = await service({
      url: `/api/reports/download/${row.originalFilename}`,
      method: 'GET',
      responseType: 'blob'
    })

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream'
    })

    // 改进的文件名提取逻辑
    let filename = row.originalFilename
    const contentDisposition = response.headers['content-disposition']

    if (contentDisposition) {
      // 优先处理 RFC 5987 编码的文件名 (filename*=UTF-8'')
      const utf8Filename = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i)
      if (utf8Filename && utf8Filename[1]) {
        filename = decodeURIComponent(utf8Filename[1])
      } else {
        // 回退到普通 filename
        const fallbackFilename = contentDisposition.match(/filename="?([^;"]+)/i)
        if (fallbackFilename && fallbackFilename[1]) {
          filename = fallbackFilename[1].replace(/^"(.*)"$/, '$1')
        }
      }
    }

    // 创建下载链接
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
</script>

<style lang="less">
.scroll-table-index {
  width: 100%;
  height: 100%;
  overflow: auto; // 如果内容超出则显示滚动条
  background: url('../../assets/images/kuang.png') no-repeat; // 确保这个背景图片路径相对于当前文件是正确的
  background-size: 100% 100%; // 背景图片铺满容器
  position: relative; // 父容器设为相对定位，以便子元素绝对定位

  .title {
    position: absolute; // 绝对定位，相对于 .scroll-table-index
    top: 10px; // 距离顶部 10px (根据实际视觉效果调整)
    left: 2%; // 与表格左侧对齐
    text-align: left;
    color: #2b8fff;
    font-size: 18px;
    z-index: 1; // 确保标题在表格上方
    font-weight: bold; // 让标题更醒目
    padding-left: 12px; // 根据 kuang.png 的边框调整内边距
  }

  .scroll-table {
    width: 96%; // 表格宽度
    height: calc(88% - 20px); // 表格高度，减去标题占用的空间 (根据 .title 的 top 和自身 top 调整)
    scroll-behavior: smooth; // 平滑滚动 (如果表格内部有滚动的话)
    position: absolute; // 绝对定位
    top: 45px; // 距离顶部，留出标题空间 (根据 .title 的高度调整)
    left: 2%; // 距离左侧
  }

  // --- Element Plus 表格样式覆盖 ---
  .el-table {
    background-color: rgba(255, 255, 255, 0); // 表格整体背景透明
    // 样式化表头
    .el-table__header-wrapper {
      background-color: rgba(255, 255, 255, 0); // 表头容器背景透明

      .el-table__header {
        background-color: rgba(255, 255, 255, 0); // 表头背景透明

        thead tr {
          background-color: transparent !important; // 强制表头行 tr 透明
        }

        th {
          // 针对表头单元格 (th)
          background-color: rgba(255, 255, 255, 0) !important; // 强制表头单元格背景透明
          color: #00a4ff; // 表头文字颜色
          // 如果需要，也可以在这里调整字体大小或内边距
          border-bottom: 1px solid rgba(0, 164, 255, 0.3); // 可以给表头加一个底边框
        }
      }
    }

    // 样式化表体行
    .el-table__inner-wrapper {
      // Element Plus 内部包裹层
      .el-table__row {
        // 表格行
        background-color: rgba(255, 255, 255, 0); // 行背景透明
        color: rgba(255, 255, 255, 0.8); // 行文字颜色

        td {
          // 表体单元格 (td)
          background-color: rgba(255, 255, 255, 0); // 单元格背景透明
          border-bottom: 1px solid rgba(0, 164, 255, 0.2); // 给单元格添加细分隔线
        }

        // 鼠标悬停在行上时的效果
        &:hover > td {
          // 当鼠标悬停在 tr 上时，其下的 td 应用样式
          background-color: #063570 !important; // 悬停背景色，!important 确保覆盖默认样式
        }
      }

      &::before {
        display: none;
      }
    }
  }
}

// 为对话框内容添加一些可选样式
.el-dialog {
  // 为 markdown 渲染出的代码块设置样式
  pre {
    background-color: #f0f0f0; // 代码块背景色
    padding: 10px; // 内边距
    border-radius: 4px; // 圆角
    overflow-x: auto; // 如果代码过长，显示水平滚动条
    // 代码块内的 code 标签
    code {
      color: #333; // 代码文字颜色
      font-family: 'Courier New', Courier, monospace; // 等宽字体
    }
  }

  // 示例：普通 code 标签 (行内代码)
  code:not(pre code) {
    background-color: #f0f0f0;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.9em;
  }
}
</style>
