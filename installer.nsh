!macro customInstall
  # 创建日志文件
  LogSet on
  LogText "Starting backend service installation..."

  # 使用nssm注册服务
  ExecWait '"$INSTDIR\nssm.exe" install RoadDetectService "$INSTDIR\RoadDetect.exe"'

  # 设置服务开机自启
  ExecWait '"$INSTDIR\nssm.exe" set RoadDetectService Start SERVICE_AUTO_START'

  # 启动服务
  ExecWait '"$INSTDIR\nssm.exe" start RoadDetectService'

  # 记录安装结果
  LogText "Service installation completed with code: $0"
!macroend

!macro customUnInstall
  # 停止服务
  ExecWait '"$INSTDIR\nssm.exe" stop RoadDetectService'

  # 删除服务
  ExecWait '"$INSTDIR\nssm.exe" remove RoadDetectService confirm'

  # 删除残留文件
  Delete "$INSTDIR\RoadDetect.exe"
  Delete "$INSTDIR\nssm.exe"
!macroend
