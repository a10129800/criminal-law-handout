/**
 * 刑法總論學習講義：核心前端邏輯 (Interactive App Logic)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initReadingProgress();
  initBackToTop();
  initCaseFilters();
  initTableFilter();
  initCopyButtons();
  initFlowchartInteraction();
  initQuiz();
  initShortcuts();
});

/* =========================================================
   1. 主題切換 (深色 / 淺色模式與 LocalStorage 持久化)
   ========================================================= */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // 取得使用者設定或偏好
  const savedTheme = localStorage.getItem('app-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('app-theme', newTheme);
      showToast(`已切換為${newTheme === 'dark' ? '深色' : '明亮'}主題模式`);
    });
  }
}

/* =========================================================
   2. 閱讀進度條
   ========================================================= */
function initReadingProgress() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* =========================================================
   3. 回到頂部按鈕與列印功能
   ========================================================= */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  const printBtn = document.getElementById('printBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* =========================================================
   4. 案例即時過濾與關鍵字搜尋
   ========================================================= */
function initCaseFilters() {
  const searchInput = document.getElementById('caseSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const chips = document.querySelectorAll('.filter-chips .chip');
  const caseCards = document.querySelectorAll('.cases-grid .case-card');

  let activeCategory = 'all';

  function filterCases() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    if (clearBtn) {
      clearBtn.style.display = query ? 'block' : 'none';
    }

    caseCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardText = card.textContent.toLowerCase();

      const matchCategory = (activeCategory === 'all') || (cardCategory === activeCategory);
      const matchSearch = !query || cardText.includes(query);

      if (matchCategory && matchSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCases);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterCases();
      searchInput.focus();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.filter;
      filterCases();
    });
  });
}

/* =========================================================
   5. 綜合速查表關鍵字篩選
   ========================================================= */
function initTableFilter() {
  const tableInput = document.getElementById('tableFilterInput');
  const table = document.getElementById('lawTable');
  const countBadge = document.getElementById('tableCount');
  if (!tableInput || !table) return;

  const rows = table.querySelectorAll('tbody tr');

  tableInput.addEventListener('input', () => {
    const filter = tableInput.value.trim().toLowerCase();
    let visibleCount = 0;

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (!filter || text.includes(filter)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (countBadge) {
      countBadge.textContent = visibleCount;
    }
  });
}

/* =========================================================
   6. 法條一鍵複製功能與 Toast 彈出視窗
   ========================================================= */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('📋 已複製法條內容至剪貼簿！');
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('📋 已複製法條內容至剪貼簿！');
      }
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* =========================================================
   7. 審查流程圖互動展示
   ========================================================= */
function initFlowchartInteraction() {
  const stepCards = document.querySelectorAll('.flow-card');
  const rebuttalBox = document.getElementById('rebuttalBox');

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  if (rebuttalBox) {
    rebuttalBox.addEventListener('click', () => {
      showToast('🛡️ 反證推翻：被告得提出責任能力、禁止錯誤或期待可能性等事由！');
    });
  }
}

/* =========================================================
   8. 法學互動速測題目
   ========================================================= */
const quizExplanations = {
  1: {
    correct: "恭喜答對！2022 年刑法第 87 條重大修正打破了以往最高 5 年的硬性上限，改為「首次延長 3 年，之後每次延長 1 年且不限次數（每年定期評估）」，兼顧社會安全維護與受處分人之醫療人權。",
    wrong: "答案不正確。現行刑法第 87 條已於 2022 年大幅修正，打破原本 5 年上限規定，改採首次延長 3 年、續延每次 1 年且不限次數並定期評估制度。"
  },
  2: {
    correct: "恭喜答對！在極端危難或恐慌處境下，法律不強人所難。客觀上無法期待一般人保持冷靜選擇更佳適法手段時，得以「超法定阻卻罪責事由（欠缺期待可能性）」阻卻罪責。",
    wrong: "答案不正確。此類因陷入極端困難無助情境而無法期待行為人從事合法舉動的抗辯，屬於刑法理論上著名的「超法定阻卻罪責事由（欠缺期待可能性）」。"
  },
  3: {
    correct: "恭喜答對！依司法實務一貫嚴格見解，刑法第 20 條得減輕其刑之瘖啞人，必須符合「出生或自幼（未滿 7 歲）即既聾且啞」之雙重嚴格要件，聾而不啞或啞而不聾均不該當。",
    wrong: "答案不正確。刑法第 20 條實務上見解極嚴格，必須是出生或自幼（未滿 7 歲）同時具備「既聾且啞」者方有適用。"
  }
};

function initQuiz() {
  const quizCards = document.querySelectorAll('.quiz-card');

  quizCards.forEach(card => {
    const quizId = card.dataset.quizId;
    const options = card.querySelectorAll('.quiz-opt');
    const feedbackBox = card.querySelector('.quiz-feedback');

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        // 點擊後鎖定題目選項
        options.forEach(opt => opt.disabled = true);

        const isCorrect = btn.dataset.correct === 'true';
        if (isCorrect) {
          btn.classList.add('selected-correct');
          feedbackBox.className = 'quiz-feedback success';
          feedbackBox.textContent = quizExplanations[quizId].correct;
        } else {
          btn.classList.add('selected-wrong');
          // 標記出正確答案
          options.forEach(opt => {
            if (opt.dataset.correct === 'true') {
              opt.classList.add('selected-correct');
            }
          });
          feedbackBox.className = 'quiz-feedback error';
          feedbackBox.textContent = quizExplanations[quizId].wrong;
        }

        feedbackBox.style.display = 'block';
      });
    });
  });
}

/* =========================================================
   9. 快捷鍵 (Ctrl+K / Cmd+K 搜尋)
   ========================================================= */
function initShortcuts() {
  const searchInput = document.getElementById('caseSearchInput');
  const searchTriggerBtn = document.getElementById('searchTriggerBtn');

  if (searchTriggerBtn && searchInput) {
    searchTriggerBtn.addEventListener('click', () => {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchInput.focus();
      }
    }
  });
}
