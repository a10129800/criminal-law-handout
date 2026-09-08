@echo off
chcp 65001 >nul
title GitHub 快速安全推送工具

echo ========================================================
echo   🚀 GitHub 專案變更安全自動推送腳本
echo ========================================================
echo.

:: 步驟 1: 檢查是否有異動
git status -s
echo.

:: 步驟 2: 提示輸入 Commit 訊息（若直接按 Enter 則使用預設訊息）
set /p COMMIT_MSG="請輸入提交說明 (直接按 Enter 將使用預設更新訊息): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=feat: 更新專案檔案與最佳化系統功能

echo.
echo [1/3] 正在暫存變更 (git add -A)...
git add -A

echo.
echo [2/3] 正在提交版本 (git commit)...
git commit -m "%COMMIT_MSG%"

echo.
echo [3/3] 正在推送至 GitHub (git push origin main)...
git push origin main

echo.
echo ========================================================
echo   ✅ 推送程序完成！
echo ========================================================
echo.
pause
