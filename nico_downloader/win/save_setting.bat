
@echo off

echo ����������������������������������������������������
echo �@�@�@�@�@
echo �@nico downloader �Z�b�g�A�b�v�@v2.0.0
echo �@�@�@�@�@
echo ����������������������������������������������������


whoami /priv | find "SeDebugPrivilege" > nul
if %errorlevel% neq 0 (
    @powershell start-process "%~0" -verb runas
    echo �Ǘ��Ҍ����Ŏ��s�������܂�
    exit
)


@REM �t�@�C�����L��ꏊ�ɃJ�����g�f�B���N�g�����ړ�
cd /d %~dp0

@REM bin�t�H���_�쐬
mkdir bin
echo bin�t�H���_���쐬���܂���

@REM ffmpeg�_�E�����[�h
echo ffmpeg���_�E�����[�h���܂��c�c
call powershell -command "Start-BitsTransfer -Source https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip %CD%\temp.zip"


@REM ZIP��
echo ffmpeg���𓀂��܂��c�c
call powershell -command "Expand-Archive -Force temp.zip ffmpeg"


@REM ffmpeg.exe�̈ړ�
echo ffmpeg���R�s�[���܂��c�c
copy ffmpeg\ffmpeg-6.0-essentials_build\bin\ffmpeg.exe bin\ffmpeg.exe

@REM �㏈��
echo �㏈�����܂��c�c
rd /s /q ffmpeg
rd /s /q %CD%\temp.zip

@REM dl.bat�������Ă���
call powershell -command "Start-BitsTransfer -Source https://raw.githubusercontent.com/masteralice3104/nico_downloader/main/nico_downloader/win/dl.bat %CD%\bin\dl.bat"


@REM ���W�X�g���o�^
reg add "HKEY_CLASSES_ROOT\nicodown" /v "URL Protocol" /t REG_SZ /d "nicodown:" /f 
reg add "HKEY_CLASSES_ROOT\nicodown" /v "ffmpeg" /t REG_SZ /d %~dp0\bin\ffmpeg.exe /f 
reg add "HKEY_CLASSES_ROOT\nicodown" /v "Folder" /t REG_SZ /d %~dp0 /f 
reg add "HKEY_CLASSES_ROOT\nicodown\shell\open\command" /ve /t REG_SZ /d "%~dp0\bin\dl.bat \"%%1\"" /f

echo ���W�X�g�������������I�����܂���

echo �����nico downloader���g�p�\�ɂȂ�܂���
pause