!macro customInstall
  # 使用nssm注册服务
  ExecWait '"$INSTDIR\resources\backend\nssm.exe" install RoadDetectService "$INSTDIR\resources\backend\RoadDetect.exe"'

  # 设置服务开机自启
  ExecWait '"$INSTDIR\resources\backend\nssm.exe" set RoadDetectService Start SERVICE_AUTO_START'

  # 启动服务
  ExecWait '"$INSTDIR\resources\backend\nssm.exe" start RoadDetectService'
!macroend

!macro customUnInstall
  # 停止服务
  ExecWait '"$INSTDIR\resources\backend\nssm.exe" stop RoadDetectService'

  # 删除服务
  ExecWait '"$INSTDIR\resources\backend\nssm.exe" remove RoadDetectService confirm'
!macroend
