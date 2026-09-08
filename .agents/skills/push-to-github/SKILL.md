---
name: push-to-github
description: >-
  Automates the complete workflow for committing and pushing project changes to GitHub or deploying to GitHub Pages.
  Use this skill whenever the user asks to push changes to GitHub, commit and sync to remote repository, deploy to GitHub Pages, or publish updates (e.g., "推到 github", "推上遠端", "部署到 github", "git push", "提交變更").
---

# GitHub 自動推送與部署標準樣板 (Push to GitHub Skill)

本技能提供標準化、可靠且具備防呆機制的 Git 提交流程，確保程式碼安全、乾淨且語意化地推送到 GitHub 遠端儲存庫與 GitHub Pages。

---

## 🎯 觸發時機

當使用者提及以下指令或類似意圖時，啟動此技能：
- 「推到 github / 推上遠端 / git push」
- 「幫我提交並發布到 github」
- 「部署到 GitHub Pages」
- 「把剛剛的修改更新上雲端」

---

## 📋 執行標準作業程序 (SOP)

### 步驟 1：檢查工作區與敏感資訊防呆 (Pre-Check)
1. 檢視當前分支與檔案變更狀態：
   ```powershell
   git status -s
   ```
2. **安全防護檢查**：
   - 確保變更清單中**不包含**任何敏感私鑰、密碼檔、`.env`、暫存檔或 `node_modules`。
   - 若有未被忽略的暫存檔，先於 `.gitignore` 中加入排除。

### 步驟 2：智能分析變更並生成語意化 Commit 訊息
依據本次對話或最近修改的內容，自動提煉出符合 **Conventional Commits** 規範的繁體中文提交訊息。

規範格式：
`[Gitmoji] <類型>(範圍): <簡短摘要>`

常見類型參照：
- ✨ `feat`: 新增核心功能、新頁面或模組
- 🐛 `fix`: 修復錯誤、顯示問題、播放器或語音缺陷
- 🎨 `style`: 優化 UI 排版、CSS 樣式、動畫效果或字體
- 📝 `docs`: 更新講義文本、分鏡劇本或說明手冊
- ♻️ `refactor`: 重構程式碼架構、提升效能或清理無用組件
- 🚀 `deploy`: 部署相關設定或 GitHub Pages 更新

*若使用者有主動指定 Commit 訊息，則優先遵照使用者的訊息。*

### 步驟 3：暫存與安全提交 (Stage & Commit)
1. 加入所有目標變更檔案：
   ```powershell
   git add -A
   ```
2. 進行正式提交：
   ```powershell
   git commit -m "<生成的語意化 Commit 訊息>"
   ```

### 步驟 4：推送至 GitHub 遠端倉庫 (Push)
1. 確認目標遠端與分支（預設 `origin` 及 `main` / `master`）：
   ```powershell
   git push origin main
   ```
2. **衝突或遠端領先處理機制**：
   - 若遭遇遠端版本領先而遭拒（Rejected），應先以 rebase 模式拉取最新變更：
     ```powershell
     git pull --rebase origin main
     ```
   - 確認無衝突後再次執行 `git push origin main`。

### 步驟 5：推送結果回報與線上驗證 (Post-Verification)
推送完成後，向使用者輸出結構化的結果報告：
- 📌 **Commit 摘要**：顯示提交訊息與縮略 Commit Hash。
- 📦 **變更檔案統計**：修改/新增之檔案數。
- 🌐 **線上訪問位址**（若專案開啟 GitHub Pages）：
  - 格式：`https://<使用者名稱>.github.io/<倉庫名稱>/`
  - 提示使用者 GitHub Pages 雲端 Action 通常需 1~2 分鐘完成建置，重新整理即可查看最新線上版本。

---

## 🛠️ 輔助指令與腳本

本技能目錄下提供快捷指令腳本：
- Windows 一鍵部署批次檔：[git-push.bat](./scripts/git-push.bat)
- 語意化提交規範參考手冊：[conventional_commits.md](./references/conventional_commits.md)
