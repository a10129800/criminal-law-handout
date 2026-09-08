# Conventional Commits 語意化提交規範手冊

在將專案推送至 GitHub 時，清晰、一致且具備結構性的 Commit 紀錄能夠大幅提高版本追蹤與協作效率。

---

## 📌 基本格式

```text
<類型>(<範疇>): <簡潔主旨說明>

[可選 詳細說明，說明變更原因與影響]
```

---

## 🎨 常見類型與 Gitmoji 對照表

類型代碼 | Gitmoji | 中文說明 | 適用範例
:--- | :--- | :--- | :---
`feat` | ✨ | 新增功能 | `feat(video): 新增獨立影音放映廳全螢幕模式`
`fix` | 🐛 | 修復錯誤 | `fix(subtitles): 修復字幕未與口播語音即時同步問題`
`style` | 🎨 | 視覺與樣式 | `style(theater): 優化劇院級深色導覽列與高對比字體`
`docs` | 📝 | 文檔更新 | `docs(readme): 更新 GitHub Pages 一鍵部署與分鏡手冊說明`
`refactor` | ♻️ | 程式碼重構 | `refactor(speech): 簡化語音引擎為單一高音質自然繁中人聲`
`perf` | ⚡ | 效能提升 | `perf(canvas): 優化動態天秤渲染幀率至穩定 60fps`
`deploy` | 🚀 | 部署與發布 | `deploy(gh-pages): 發布最新版本至 GitHub Pages 靜態站點`
`chore` | 🔧 | 工具或依賴維護 | `chore(gitignore): 加入編輯器暫存檔與日誌過濾規則`

---

## 💡 撰寫範例參考

```bash
git commit -m "fix(subtitles): 升級即時句子同頻同步字幕與鎖定單一自然語音"
git commit -m "feat(video): 啟用初級、中級、高級三大分級微課與全螢幕大畫布"
git commit -m "docs: 完善分鏡腳本手冊與刑法最新憲判修法重點"
```
