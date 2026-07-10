@echo off
chcp 65001 >nul
echo ====================================
echo  正在清除个人数据...
echo  执行后将清空笔记、照片、音乐、
echo  头像和评论，恢复为空白模板状态
echo ====================================
echo.
setlocal enabledelayedexpansion

:: 计算要删除的文件数
set count=0
for /r "..\backend\content\notes" %%f in (*.md) do set /a count+=1
for /r "..\backend\content\photos" %%f in (*.jpg *.jpeg *.png *.webp *.gif) do set /a count+=1
for /r "..\backend\content\music" %%f in (*.mp3*.json) do set /a count+=1
for /r "..\backend\content\blog_infos\avatars" %%f in (*.png *.jpg *.jpeg *.webp) do set /a count+=1

if %count% equ 0 (
    echo [√] 没有发现个人数据，已是干净状态
    goto end
)

echo 发现 %count% 个个人数据文件
set /p confirm="确认删除以上文件？(y/N): "
if /i not "!confirm!"=="y" (
    echo 已取消
    goto end
)

echo.
echo 正在删除...

:: 删除笔记
if exist "..\backend\content\notes" (
    del /s /q "..\backend\content\notes\*.md" 2>nul
    echo [√] 笔记已清空
)

:: 删除照片
if exist "..\backend\content\photos" (
    del /s /q "..\backend\content\photos\*.jpg" 2>nul
    del /s /q "..\backend\content\photos\*.jpeg" 2>nul
    del /s /q "..\backend\content\photos\*.png" 2>nul
    del /s /q "..\backend\content\photos\*.webp" 2>nul
    del /s /q "..\backend\content\photos\*.gif" 2>nul
    for /d %%i in ("..\backend\content\photos\*") do (
        if not "%%~nxi"==".gitkeep" (
            del /s /q "%%i\*.jpg" 2>nul
            del /s /q "%%i\*.jpeg" 2>nul
            del /s /q "%%i\*.png" 2>nul
            del /s /q "%%i\*.webp" 2>nul
            del /s /q "%%i\*.gif" 2>nul
        )
    )
    echo [√] 照片已清空
)

:: 删除音乐
if exist "..\backend\content\music" (
    del /s /q "..\backend\content\music\*.mp3" 2>nul
    del /s /q "..\backend\content\music\*.json" 2>nul
    echo [√] 音乐已清空
)

:: 删除头像
if exist "..\backend\content\blog_infos\avatars" (
    del /s /q "..\backend\content\blog_infos\avatars\*.png" 2>nul
    del /s /q "..\backend\content\blog_infos\avatars\*.jpg" 2>nul
    del /s /q "..\backend\content\blog_infos\avatars\*.jpeg" 2>nul
    del /s /q "..\backend\content\blog_infos\avatars\*.webp" 2>nul
    echo [√] 头像已清空
)

:: 删除用户配置
if exist "..\backend\content\blog_infos\user-config.json" (
    del /q "..\backend\content\blog_infos\user-config.json"
    echo [√] 用户配置已清空
)

:: 重置评论
echo {} > "..\backend\data\comments.json"
echo [√] 评论已重置

echo.
echo ====================================
echo  清空完成！
echo  项目已恢复为空白模板状态
echo  按 README.md 中的「新用户快速上手」
echo  即可配置你的个人内容
echo ====================================
pause
exit /b 0

:end
pause
