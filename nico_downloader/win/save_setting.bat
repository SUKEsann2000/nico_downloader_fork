
@echo off
whoami /priv | find "SeDebugPrivilege" > nul
if %errorlevel% neq 0 (
    @powershell start-process "%~0" -verb runas
    echo �Ǘ��Ҍ����Ŏ��s�������܂�
    exit
)
reg add "HKEY_CLASSES_ROOT\nicodown" /v "URL Protocol" /t REG_SZ /d "nicodown:" /f 
reg add "HKEY_CLASSES_ROOT\nicodown" /v "ffmpeg" /t REG_SZ /d "ffmpeg" /f 
reg add "HKEY_CLASSES_ROOT\nicodown" /v "Folder" /t REG_SZ /d "C:\nicodown" /f 
reg add "HKEY_CLASSES_ROOT\nicodown\shell\open\command" /ve /t REG_SZ /d "C:\nicodown\dl.bat \"%%1\"" /f

echo ���W�X�g�����s�I��
pause