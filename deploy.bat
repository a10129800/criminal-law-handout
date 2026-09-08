@echo off
chcp 65001 >nul
title 部署刑法總論學習講義至 GitHub Pages

echo ========================================================
echo   ⚖️ 刑法總論學習講義 • 一鍵推送到 GitHub Pages
echo ========================================================
echo.

echo [1/3] 正在暫存最新修改檔案 (git add)...
git add -A

echo.
echo [2/3] 正在提交最新版本 (git commit)...
git commit -m "修復影片播放器語法與全面啟用初中高分級影音微課系統"

echo.
echo [3/3] 正在推送更新至 GitHub 遠端倉庫 (git push)...
git push origin main

echo.
echo ========================================================
echo   🎉 推送成功！GitHub Pages 將在 1~2 分鐘內自動完成雲端部署！
echo   請稍後重新整理線上網址：
echo   👉 https://a10129800.github.io/criminal-law-handout/
echo ========================================================
echo.
pause
