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
import { ref, computed } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDialog, ElMessage } from 'element-plus'
// 你可能需要一个 Markdown 渲染器，比如 'marked'
// 安装它: npm install marked
// 引入它:
import { marked } from 'marked' // 或者你偏好的 markdown 库
// 你可能需要 axios 或 fetch 来进行 API 调用
// 安装它: npm install axios
import axios from 'axios' // 或者使用 fetch

// --- 响应式状态 ---
const tableData = ref([])
const scroll_Table = ref(null)
const dialogVisible = ref(false) // 控制对话框的显示/隐藏
const markdownContent = ref('') // 存储从 API 获取的原始 markdown 内容

// --- 数据初始化 ---
// 为报告模拟唯一ID，用于API调用
for (let i = 1; i < 6; i++) {
  tableData.value.push({
    id: `report_id_${i}`, // 添加了一个 ID 用于演示
    report: '高速公路抽检路段公路技术状况监管分析报告',
    // 减去一个随机时间差，让日期看起来不同
    date: Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 5
  })
}

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

// --- 方法 ---

// 2. 日期格式化函数
// ElTableColumn 的 formatter prop 会接收 row, column, cellValue 四个参数
const formatDate = (row, column, cellValue) => {
  if (!cellValue) return '' // 如果值不存在，返回空字符串
  const date = new Date(cellValue)
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
  console.log('查看报告:', row) // 在控制台打印行数据，方便调试
  // **API 调用占位符:**
  // 用你实际的 API 端点和错误处理逻辑替换下面的代码
  try {
    // 如果需要，可以显示加载状态，例如改变按钮文本或显示加载指示器
    markdownContent.value = '# 正在加载内容...' // 设置一个临时的加载提示
    dialogVisible.value = true // 打开对话框

    // --- 模拟 API 调用 ---
    // const response = await axios.get(`/api/calculate/md?id=${row.id}`); // 示例 API 调用，传递报告 ID
    // markdownContent.value = response.data; // 将获取到的 markdown 数据赋值给 state
    // --- 结束模拟 ---

    // --- 用于演示的静态内容 ---
    // (用上面的真实 API 调用替换这部分)
    await new Promise((resolve) => setTimeout(resolve, 500)) // 模拟网络延迟 0.5 秒
    // 生成一些示例 Markdown 内容
    markdownContent.value = `
# ${row.report} - 内容预览

这是 **${row.report}** 的Markdown内容。

- 列表项 1
- 列表项 2

\`\`\`javascript
function greet(name) {
  console.log('你好, ' + name + '!');
}
greet('世界');
\`\`\`

[这是一个示例链接](https://example.com)

*生成日期: ${formatDate(null, null, row.date)}*
    `
    // --- 结束静态内容 ---
  } catch (error) {
    // 处理 API 调用过程中可能发生的错误
    console.error('获取 markdown 内容时出错:', error)
    ElMessage.error('加载报告内容失败') // 使用 Element Plus 的 Message 组件提示用户
    markdownContent.value = '加载内容时出错。' // 在对话框中显示错误信息
    // 可以选择保持对话框打开以显示错误，或者关闭它:
    // dialogVisible.value = false;
  }
}

// 5. 处理 "下载" 按钮点击事件
const handleDownload = async (row) => {
  console.log('下载报告:', row) // 控制台打印信息
  // **调用 API 下载文件:**
  try {
    // 如果需要，显示加载状态 (例如更改按钮文本/图标)
    ElMessage.info(`正在准备下载 ${row.report}...`) // 提示用户操作正在进行

    // 使用 axios 发起请求
    const response = await axios({
      url: `/api/calculate/docx`, // 你的实际后端 API 端点
      method: 'GET', // 或者根据你的 API 要求使用 'POST'
      params: {
        // 将报告标识符 (例如 id) 作为查询参数发送
        id: row.id
        // 如果使用 POST，则可能在 data 字段中发送: data: { id: row.id }
      },
      responseType: 'blob' // 重要：告诉 axios 期望接收二进制数据 (文件)
    })

    // 从响应数据创建一个 Blob 对象
    // response.headers['content-type'] 获取文件的 MIME 类型，如果响应头里有的话
    const blob = new Blob([response.data], {
      type:
        response.headers['content-type'] ||
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }) // docx 的 MIME 类型

    // 为 Blob 创建一个临时的 URL
    const url = window.URL.createObjectURL(blob)

    // 创建一个隐藏的 <a> 标签用于触发下载
    const link = document.createElement('a')
    link.href = url // 设置链接指向 Blob URL

    // 从 Content-Disposition 响应头中提取文件名（如果后端设置了的话）
    const contentDisposition = response.headers['content-disposition']
    let filename = `${row.report}.docx` // 设置默认文件名
    if (contentDisposition) {
      // 尝试从 header 中解析出 filename="xxx.docx"
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
      if (filenameMatch && filenameMatch.length === 2) {
        filename = filenameMatch[1] // 获取匹配到的文件名
      }
    }

    link.setAttribute('download', filename) // 设置 download 属性，浏览器会使用这个名字保存文件
    document.body.appendChild(link) // 将链接添加到页面中（虽然隐藏，但需要存在才能点击）
    link.click() // 用代码模拟点击链接，触发下载

    // 清理工作：移除添加到页面的链接，并释放之前创建的 Object URL
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success(`${filename} 下载成功`) // 提示用户下载成功
  } catch (error) {
    // 处理下载过程中可能发生的错误
    console.error('下载 docx 文件时出错:', error)
    ElMessage.error('下载文件失败') // 提示用户下载失败
    // 如果需要，可以根据 error.response.status 等信息处理特定错误 (例如 404 未找到, 500 服务器错误)
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
