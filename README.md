# ⚖️ 刑法總論學習講義：犯罪的概念與「不法推定罪責」體系

> 本專案為 4 頁刑法總論學習講義之**現代化互動網頁版**。純靜態網頁架構（HTML5 + Vanilla CSS3 + ES6 JS），**零依賴、零建置步驟**，專門為 **GitHub Pages 一鍵發布** 設計！

---

## 🌟 網頁特色

- **🏛️ 現代法律科技（LegalTech）視覺設計**：精緻深色／明亮專業模式隨心切換，支援行動裝置、平板與電腦全螢幕響應。
- **🔄 兩階段審查互動流程圖**：「先評價行為（客觀壞事）➔ 經驗推定 ➔ 評價行為人（主觀壞人）➔ 反證推翻阻卻罪責」。
- **💬 6 大典型抗辯案例卡片**：
  - 模擬被告真實現況口白與律師抗辯思維。
  - 對比 2018 原書與 2024–2026 現行法最新修訂狀態（如：刑法第 87 條監護處分改革、民法 18 歲成年與少事法連動）。
  - 提供核心法條**一鍵複製條文**與即時關鍵字過濾。
- **📊 綜合比較與重點速查表**：可即時搜尋法條、罪責事由與法律效果。
- **💡 刑法思維互動測驗**：內建 3 道經典實務爭點互動題目，即時反饋詳解。
- **🖨️ 列印與 PDF 匯出優化**：隨時按下 `Ctrl + P` 即可一鍵排版輸出為清晰整潔的紙本或電子書講義。

---

## 🚀 如何上傳到 GitHub 並開啟 GitHub Pages？（超簡單 3 步驟）

你可以選擇 **【方法一：用瀏覽器直接上傳（免裝指令）】** 或 **【方法二：使用 Git 指令】**：

### 【方法一】直接在 GitHub 網頁操作（最推薦）

1. **建立新的 GitHub 儲存庫（Repository）**：
   - 前往 [GitHub.com](https://github.com/) 並登入你的帳號。
   - 點擊右上角 `+` ➜ **New repository**。
   - 填寫 Repository name（例如：`criminal-law-notes`），設定為 **Public**（公開），勾選「Add a README file」或留空皆可，點擊 **Create repository**。
2. **上傳本資料夾內的所有檔案**：
   - 在剛建好的儲存庫頁面，點擊 **Add file** ➜ **Upload files**。
   - 將本資料夾裡的所有內容整包拖曳上傳：
     - `index.html`（必須放在根目錄）
     - `css/` 資料夾（內含 `style.css`）
     - `js/` 資料夾（內含 `app.js`）
     - `README.md`
   - 點擊下方綠色按鈕 **Commit changes**。
3. **開啟 GitHub Pages 網站發布**：
   - 進入儲存庫上方的 **Settings**（設定）分頁。
   - 點擊左側側邊欄的 **Pages**。
   - 在 **Build and deployment** 下方：
     - **Source** 選擇：`Deploy from a branch`
     - **Branch** 選擇：`main`（或 `master`），資料夾選擇 `/ (root)`
     - 點擊 **Save**（儲存）。
   - 等待約 30 秒至 1 分鐘重新整理頁面，最上方就會出現你的專屬網址：
     ```text
     https://<你的GitHub帳號>.github.io/criminal-law-notes/
     ```

---

### 【方法二】使用 Git 命令列上傳

在終端機（Terminal / PowerShell）切換至本專案目錄執行：

```bash
# 1. 初始化本地 Git 儲存庫
git init

# 2. 加入所有檔案並提交
git add .
git commit -m "feat: initial commit of criminal law handout page"

# 3. 命名主分支為 main
git branch -M main

# 4. 關聯到你的 GitHub 遠端儲存庫（請將 URL 換成你的倉庫網址）
git remote add origin https://github.com/<你的GitHub帳號>/<你的倉庫名稱>.git

# 5. 推送至 GitHub
git push -u origin main
```

推送完成後，同樣前往 GitHub 儲存庫的 **Settings > Pages** 依上述方式開啟即可！

---

## 📂 檔案目錄結構

```text
criminal-law-handout/
├── index.html       # 主網頁（涵蓋講義全部 4 頁核心條文、案例與速查表）
├── css/
│   └── style.css    # 現代化設計系統樣式、深淺色切換、流程圖與列印排版
├── js/
│   └── app.js       # 互動邏輯（案例即時篩選、法條複製、測驗驗證、深淺模式）
└── README.md        # 專案說明與 GitHub Pages 快速部署指南
```

---

## 💻 本機即時預覽方式

直接以滑鼠雙擊 `index.html` 即可在任一瀏覽器（Chrome, Edge, Safari, Firefox）中開啟預覽，所有互動功能與複製按鈕均可正常運作！
