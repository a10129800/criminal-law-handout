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
  initVideoPlayer();
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

/* =========================================================
   10. 影音講解微課：互動播放器引擎 (Video Explainer Studio Engine)
   ========================================================= */
function initVideoPlayer() {
  const container = document.getElementById('videoPlayerContainer');
  if (!container) return;

  // 播放器資料庫：初級、中級、高級分鏡腳本
  const videoData = {
    beginner: {
      id: 'beginner',
      title: '🌱 初級生活情境版',
      totalSec: 225, // 03:45
      chapters: [
        {
          index: 1,
          title: '開場引言：做壞事一定是壞人嗎？',
          topic: '生活直觀與法律思考',
          durationSec: 45,
          durationText: '00:45',
          icon: '⚖️',
          box1Title: '直觀感覺：拿了沒付錢就是犯罪？',
          box1Desc: '日常生活中，我們直覺認定「犯罪就是一個壞人做了一件壞事」，把事情跟人直接劃上等號。',
          box2Title: '人性複雜：如果是生病或救人呢？',
          box2Desc: '如果有人推倒路人是為了擋開失控卡車？如果他是重度思覺失調分不清現實？我們能一概而論罵他「壞」嗎？',
          takeaway: '做了一件壞事 ＝ 這個人一定是壞人嗎？刑法發明了超聰明的兩步驟判斷！',
          subtitle: '哈囉大家好！在直覺裡，犯罪好像就是「壞人做壞事」，但法律真的能把做壞事的人全部一棒打死說他是壞人嗎？',
          voiceText: '哈囉大家好！如果有人在便利商店拿了東西沒付錢，我們會說：天啊，他犯罪了！在大家的直覺裡，犯罪好像就是「一個壞人做了一件壞事」對吧？但是，法律真的能直接把做壞事的人，全部一棒打死說他是壞人嗎？想像一下：如果一個人生病發高燒甚至思覺失調，他根本不知道自己在做什麼，我們能罵他是壞人嗎？今天這支影片，就帶大家用 3 分鐘，看懂刑法最厲害的兩步驟判斷魔法！',
          tags: ['生活情境', '直觀思考', '壞人vs壞事']
        },
        {
          index: 2,
          title: '兩步驟大解密：先看事情，再看人！',
          topic: '兩階段審查與反證推翻',
          durationSec: 60,
          durationText: '01:00',
          icon: '🔄',
          box1Title: '第一步：客觀壞事（不法性）',
          box1Desc: '打人、偷東西客觀上侵害他人法益，且無正當防衛等正當理由，客觀上確認這是一件「壞事」。',
          box2Title: '第二步：主觀壞人（罪責性與反證推翻）',
          box2Desc: '常理經驗推定做壞事者有非難性，但刑法保留「反證推翻」後門，允許被告提出事由證明自己不是法律應罰的壞人！',
          takeaway: '「雖然我做了一件壞事，但我並不是法律應予非難的壞人！」',
          subtitle: '法官要審案子，最難的是「人心隔肚皮」。所以刑法採取「先評價行為，後評價行為人」的兩階段判斷架構！',
          voiceText: '法官要審案子，最困難的一件事就是：人心隔肚皮，誰知道你心裡到底在想什麼？所以刑法發明了一套超聰明的兩階段思考法：第一步，先看這件事是不是壞事，這叫作具備不法性。第二步，既然你做了壞事，我們通常會先推論你可能是有問題的。但是！刑法留了一扇超重要的後門，叫作「反證推翻」！也就是說，法律允許你拿出證據向法官解釋：法官大人，這件事確實是壞事，但我真的有逼不得已的理由！',
          tags: ['兩階段判斷', '不法性', '反證推翻']
        },
        {
          index: 3,
          title: '常見抗辯劇場：法律的免死金牌有哪些？',
          topic: '常見阻卻罪責事由',
          durationSec: 75,
          durationText: '01:15',
          icon: '🛡️',
          box1Title: '生病了與年紀小（責任能力）',
          box1Desc: '刑法§19重度心智缺陷欠缺辨識能力者不罰（需要的是治療）；刑法§18未滿14歲心智未成熟不罰。',
          box2Title: '極限逼不得已（欠缺期待可能性）',
          box2Desc: '被刀抵著頭逼開保險箱，換成一般人都無法冷靜拒絕。當一般人都做不到時，法律不會強求你當聖人！',
          takeaway: '法律不只是冷酷懲罰，當一般正常人都無從克制時，法律不會強求人當正義超人！',
          subtitle: '法律承認哪些理由呢？生病重度思覺失調時他需要治療，未滿14歲心智未成熟不罰，被逼開保險箱更無從期待當聖人！',
          voiceText: '那麼，法律承認哪些理由可以幫你洗刷壞人的標籤呢？第一個最常見的，是生病了！像刑法第 19 條規定：如果一個人在行為時，因為嚴重的精神疾病，完全失去了辨識是非的能力，法律認為非難他毫無意義，他需要的是治療而不是單純坐牢！第二個是未滿 14 歲的小朋友，心智還在成長，第 18 條規定不罰。第三個，是極限情境下被拿刀逼著犯罪，當一般正常人都做不到時，法律也不會強求你當聖人，這就叫作欠缺期待可能性！',
          tags: ['§19精神障礙', '§18年齡', '期待可能性']
        },
        {
          index: 4,
          title: '總結：法律不只是懲罰，更充滿對人性的理解',
          topic: '全篇回顧與刑法價值',
          durationSec: 45,
          durationText: '00:45',
          icon: '💡',
          box1Title: '壞事歸壞事：客觀劃定法益界線',
          box1Desc: '嚴格評價行為是否合乎社會秩序，保護公民權利不受侵害。',
          box2Title: '人不能亂罰：主觀具備非難性才動刑',
          box2Desc: '唯有在行為人具備自主是非選擇能力時，國家的刑罰制裁才具有道德正當性。',
          takeaway: '這就是刑法總論最核心的基石——「不法推定罪責」！',
          subtitle: '刑法的世界不是冷冰冰的「做了就罰」，唯有具備自主控制能力時，國家的懲罰才具正當性。',
          voiceText: '所以你看，刑法的世界不是冷冰冰的做了就罰，而是非常精密地先分清壞事與壞人。做壞事代表侵害了秩序，但唯有你具備自主控制與是非判斷能力時，國家的懲罰才具有正當性。這就是刑法總論最核心的基石：不法推定罪責。歡迎點擊下方講義查看完整的 6 大案例與互動測驗喔！',
          tags: ['精華總結', '刑法價值', '法治精神']
        }
      ]
    },

    intermediate: {
      id: 'intermediate',
      title: '⚖️ 中級國考體系版',
      totalSec: 510, // 08:30
      chapters: [
        {
          index: 1,
          title: '犯罪審查體系綜述：三階層與不法推定罪責',
          topic: '德日三階論與評價二分',
          durationSec: 90,
          durationText: '01:30',
          icon: '🏛️',
          box1Title: '不法階層（Unrecht）',
          box1Desc: '「構成要件該當性 ＋ 違法性」。製造法所不容許風險，客觀確認該行為為法律所不容之「壞事」。',
          box2Title: '罪責階層（Schuld）',
          box2Desc: '轉向行為人之主觀非難評價。基於實證經驗，客觀不法該當即推定行為人具備罪責（可非難性）。',
          takeaway: '先評價行為之客觀不法，再評價行為人之主觀非難！',
          subtitle: '德日三階論中，構成要件與違法性合稱不法階層。不法該當即確認壞事，並經由經驗推定罪責。',
          voiceText: '各位同學大家好，歡迎來到刑法總論核心專題。現代刑法學的主流是德日三階層犯罪論體系。不法，是對行為本身的實體評價，行為人是否製造了法不容許風險且無阻卻違法事由？一旦通過不法審查，我們便客觀確認這是一件壞事。而罪責，則是轉向對行為人的個人非難評價。基於實證經驗，多數從事不法行為者具備正常歸責能力，故刑法採取不法推定罪責之運作邏輯，但嚴格保留反證推翻機制。',
          tags: ['三階層體系', '不法階層', '罪責可非難性']
        },
        {
          index: 2,
          title: '罪責本質與反證推翻：形式推定與防禦樞紐',
          topic: '舉證負擔與訴訟防禦',
          durationSec: 105,
          durationText: '01:45',
          icon: '🛡️',
          box1Title: '審查推論便宜之必要性',
          box1Desc: '若檢方一開始須主動鉅細靡遺舉證被告精神健全、成年、知法，審判體系將徹底癱瘓。',
          box2Title: '防禦方實質樞紐',
          box2Desc: '檢方證明不法後罪責即受形式推定；辯護人提出法定或超法定阻卻/減輕事由，推翻個人受非難之適格性。',
          takeaway: '不法推定罪責本質為推論便宜，防禦重心在於提出具體事由反證推翻！',
          subtitle: '「不法推定罪責」是審查上的推論便宜。防禦方的核心正是提出阻卻罪責事由，推翻非難適格性。',
          voiceText: '請大家特別注意，不法推定罪責並非不可推翻的法律擬制，它本質上是一種審查上的推論便宜。因為如果每一起刑事案件，檢察官一開始都必須主動舉證證明被告精神健全、成年、明知法令，刑事審判體系將徹底癱瘓。故訴訟實務上，只要證明客觀不法，罪責即受形式推定；此時被告與辯護人的防禦重心，正是提出法定的阻卻或減輕罪責事由，主張行為人個人欠缺受非難之實質適格性。',
          tags: ['形式推定', '推論便宜', '訴訟防禦']
        },
        {
          index: 3,
          title: '六大抗辯實務要件深度剖析（§16~§20 & 期待可能性）',
          topic: '法定與超法定抗辯要件',
          durationSec: 225,
          durationText: '03:45',
          icon: '📑',
          box1Title: '法定責任能力與不法意識',
          box1Desc: '§16禁止錯誤採責任說（無可避免不罰/可避免得減）；§18年齡三段式；§19精神障礙雙重判準與原因自由行為例外；§20瘖啞人得減。',
          box2Title: '過當但書與超法定期待可能性',
          box2Desc: '§23、§24但書防衛/避難過當得減除其刑；超法定阻卻罪責（期待可能性）於客觀通念無法期待適法行為時阻卻罪責。',
          takeaway: '逐一檢驗條文之生理原因與心理結果，落實罪責嚴格涵攝！',
          subtitle: '§16禁止錯誤採責任說；§19責任能力須兼具生理與心理要件；§20實務限縮自幼既聾且啞；§23、§24但書為得減免事由。',
          voiceText: '我們逐一盤點六大抗辯：刑法第 16 條禁止錯誤採責任說，無可避免者不罰，客觀可避免者僅得減輕其刑。第 18 條以 14 歲為絕對責任界線。第 19 條責任能力必須兼具生理原因與心理結果，若故意或過失自陷則落入第 3 項原因自由行為不得免責。第 20 條瘖啞人實務限縮出生或自幼既聾且啞方得減刑。第 23、24 條防衛與避難過當得減輕或免除其刑。最後超法定欠缺期待可能性，於極端壓迫下無適法期待時阻卻罪責。',
          tags: ['§16禁止錯誤', '§19責任能力', '§20瘖啞', '過當但書']
        },
        {
          index: 4,
          title: '國考試題實戰解題策略與答題三段論',
          topic: '實務案例題作答範式',
          durationSec: 90,
          durationText: '01:30',
          icon: '✍️',
          box1Title: '審查階層嚴格性',
          box1Desc: '切勿直接跳結論！先寫構成要件與阻卻違法，確認客觀不法後，再於罪責階層檢驗各項抗辯條文。',
          box2Title: '法律效果精準論述',
          box2Desc: '明確區分「不罰（不成立犯罪）」與「得減輕其刑」；注意精神障礙不罰時之後續保安處分（監護）宣告問題。',
          takeaway: '不法奠定基礎、罪責決定非難、抗辯推翻推定，貫徹作答三段論！',
          subtitle: '國考實例題切勿直接跳結論，務必遵循階層嚴格性，先確認不法，再行逐一涵攝抗辯構成要件。',
          voiceText: '在國考實例題寫作上，請大家務必遵循階層嚴格性：先寫構成要件與阻卻違法，確認客觀不法；進入罪責階層時，若題目交代精神障礙、年齡、瘖啞或誤信法令，切勿直接跳到結論，而應從條文要件逐一嚴格涵攝。掌握不法奠定基礎、罪責決定非難、抗辯推翻推定的核心架構，任何刑法總則的案例題，你都能迎刃而解！',
          tags: ['國考作答', '三段論法', '實例演練']
        }
      ]
    },

    advanced: {
      id: 'advanced',
      title: '🏛️ 高級法學深究版',
      totalSec: 840, // 14:00
      chapters: [
        {
          index: 1,
          title: '規範罪責論之歷史演進：從心理罪責到規範可非難性',
          topic: '法理溯源與哲學內核',
          durationSec: 165,
          durationText: '02:45',
          icon: '📜',
          box1Title: '心理罪責論之困境',
          box1Desc: '李斯特古典學派將罪責侷限於主觀心理連繫（故意/過失），無法合理合理解釋「無期待可能性」或「防衛過當」之免責。',
          box2Title: '弗蘭克規範罪責論確立',
          box2Desc: '1907年弗蘭克確立「可非難性 (Vorwerfbarkeit)」：在適法期待下具意志自由卻違反規範，方得加以非難。',
          takeaway: '罪責的實質不是單純心理聯繫，而是個人之規範可非難性！',
          subtitle: '李斯特心理罪責論無法解釋期待可能性免責。弗蘭克確立規範罪責論，奠定了現代罪責實質內核。',
          voiceText: '各位法學先進與研習者，歡迎進入刑法深究專題。19世紀李斯特古典學派的心理罪責論，曾將罪責界定為故意與過失之心理聯繫。然而這種劃分在面對無期待可能性等案件時徹底崩解：行為人具備故意，為何法律卻免除罪責？1907年弗蘭克確立了規範罪責論：罪責的實質是行為人在適法期待下，具備不法意識與意志自由，卻選擇違反規範的個人可非難性。這正是現代實質罪責論的哲學內核。',
          tags: ['心理罪責論', '規範罪責論', '可非難性']
        },
        {
          index: 2,
          title: '2022 年刑法第 87 條監護處分重大憲政革新',
          topic: '憲法審查與人身自由衡平',
          durationSec: 225,
          durationText: '03:45',
          icon: '⚖️',
          box1Title: '打破5年天花板上限',
          box1Desc: '修正後§87打破過往5年上限：首次延長3年以下，其後每次1年以下，未設延長次數上限。',
          box2Title: '嚴格法官保留與每年定期評估',
          box2Desc: '為避免侵害憲法§8人身自由淪為終身監禁，增設法院每年定期評估與多元社區門診處遇銜接機制。',
          takeaway: '打破5年上限並落實定期法官保留評估，兼顧社會防衛與人身自由！',
          subtitle: '2022年刑法§87打破5年天花板，增設每年定期評估與嚴格法官保留，避免變相實質終身監禁。',
          voiceText: '在 2018 原書講義中，刑法第 87 條明定監護處分不得逾 5 年。2022 年 2 月立法院通過劃時代修法：第一，正式打破 5 年天花板，首次延長 3 年以下，其後每次延長 1 年以下且未設次數上限。第二，為避免演變為實質終身監禁侵害憲法第 8 條人身自由，新法確立嚴格正當法律程序：法院每年均須定期評估再犯危險性，堅守法官保留與專業鑑定。第三，引入門診社區等多元處遇，為保安處分二十年來最重大質變！',
          tags: ['§87修法', '監護處分', '人身自由', '法官保留']
        },
        {
          index: 3,
          title: '民法 18 歲成年與少事法「曝險行政先行」法域連動',
          topic: '跨法域少年刑事政策轉向',
          durationSec: 180,
          durationText: '03:00',
          icon: '🌱',
          box1Title: '民法18歲成年（2023）',
          box1Desc: '民法第12條成年年齡由20歲下修為18歲，解決長久以來「刑法18歲完全責任 vs 民法20歲限制行為」之脫鉤。',
          box2Title: '少事法曝險少年與行政先行',
          box2Desc: '刪除虞犯改採曝險少年；2023年7月起少輔會輔導先行，落實兒少權利公約（CRC）司法最後手段性。',
          takeaway: '少年司法從司法矯治轉向保護優先與行政輔導先行！',
          subtitle: '民法下修18歲消弭責任年齡歧異；少事法以曝險少年取代虞犯，並全面落實行政輔導先行。',
          voiceText: '緊接著檢視刑法第 18 條的周邊連動。2023 年民法第 12 條成年年齡下修為 18 歲，徹底解決了刑法 18 歲完全責任與民法 20 歲限制行為能力的脫鉤怪象。更加關鍵的是少事法全面刪除具強烈標籤色彩的虞犯概念，改採曝險少年機制；並施行行政輔導先行制度，由少輔會先行介入輔導，落實兒少權利公約最後手段性原則，對少年司法形成了深刻的制度外溢。',
          tags: ['民法18歲', '少事法', '曝險行政先行', 'CRC公約']
        },
        {
          index: 4,
          title: '實質罪責論深水區：原因自由行為與期待可能性邊界',
          topic: '著手理論爭議與憲法罪責原則',
          durationSec: 180,
          durationText: '03:00',
          icon: '⚡',
          box1Title: '§19第3項原因自由行為爭端',
          box1Desc: '「構成要件模式」（自陷精神障礙即為著手）與「前置/例外模式」（間接正犯擬制）之學理重大分歧。',
          box2Title: '期待可能性之憲法位階',
          box2Desc: '司法實務對超法定事由高度節制，但憲法「無罪責即無刑罰」要求當法律義務迫使陷入無可忍受危難時，應肯定阻卻罪責。',
          takeaway: '在維護實定法秩序之剛性條文中，永遠保有對人性極限的最高敬意！',
          subtitle: '原因自由行為存在構成要件模式與例外模式之爭；期待可能性更彰顯憲法罪責原則對刑罰權之實質制約。',
          voiceText: '最後我們反思實質罪責論的兩個深水區爭點：首先是刑法第 19 條第 3 項的原因自由行為，究竟應採構成要件模式抑或例外前置模式，在罪刑法定原則的張力下爭辯不休。其次是期待可能性之適用界線，司法實務雖抱持節制態度，但憲法法庭歷來闡明無罪責即無刑罰具憲法位階。當法律義務必然導致無可忍受之危難時，實質罪責原則要求我們承認期待可能性的阻卻效力。',
          tags: ['原因自由行為', '著手模式', '期待可能性邊界']
        },
        {
          index: 5,
          title: '終極總結：不法推定罪責之跨時代生命力',
          topic: '全篇統整與法學展望',
          durationSec: 90,
          durationText: '01:30',
          icon: '💎',
          box1Title: '古典體系歷久彌新',
          box1Desc: '2018年原書講義兩階段架構在現代法學中依然是實質審查之基石，毫無過時。',
          box2Title: '結合現代憲政思維',
          box2Desc: '融入§87監護處分改革、民法18歲成年與實質規範罪責論，形成立體動態法學知識網。',
          takeaway: '歷經百年演進與現代修法檢驗，不法推定罪責體系歷久彌新！',
          subtitle: '不法推定罪責體系歷經修法與憲政考驗，其教義歷久彌新。感謝研習！',
          voiceText: '總結全篇，2018 年原書講義所揭櫫之不法推定罪責兩階段架構，歷經數載法律修訂與憲政檢驗，其本質教義屹立不搖。我們在現代法律科技輔助下，將實體法條文、歷史法理與最新憲政思維融會貫通。感謝大家的聆聽與研習，完整的條文比對表與三階層互動模型已在下方講義系統中完整呈現，歡迎各位深入研讀！',
          tags: ['全篇總結', '法理沉澱', '法治展望']
        }
      ]
    }
  };

  // 狀態變數
  let currentLevelKey = 'beginner';
  let currentChapterIndex = 0;
  let isPlaying = false;
  let currentSpeed = 1.0;
  let voiceEnabled = true;
  let timerInterval = null;
  let chapterElapsedSec = 0;

  // DOM 元素引用
  const levelTabs = document.querySelectorAll('.video-level-tabs .level-tab');
  const stageLevelBadge = document.getElementById('stageLevelBadge');
  const stageChapBadge = document.getElementById('stageChapBadge');
  const voiceIndicator = document.getElementById('voiceIndicator');
  const motionCard = document.getElementById('motionCard');
  const subtitleText = document.getElementById('subtitleText');
  const videoProgressBar = document.getElementById('videoProgressBar');
  const videoProgressContainer = document.getElementById('videoProgressContainer');
  const playToggleBtn = document.getElementById('playToggleBtn');
  const iconPlay = playToggleBtn ? playToggleBtn.querySelector('.icon-play') : null;
  const iconPause = playToggleBtn ? playToggleBtn.querySelector('.icon-pause') : null;
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const currentTimeDisplay = document.getElementById('currentTime');
  const totalTimeDisplay = document.getElementById('totalTime');
  const voiceToggleBtn = document.getElementById('voiceToggleBtn');
  const speedToggleBtn = document.getElementById('speedToggleBtn');
  const speedLabel = document.getElementById('speedLabel');
  const fullscreenToggleBtn = document.getElementById('fullscreenToggleBtn');
  const videoScreen = document.getElementById('videoScreen');
  const chaptersList = document.getElementById('chaptersList');
  const chapCountBadge = document.getElementById('chapCountBadge');
  const copyCurrentScriptBtn = document.getElementById('copyCurrentScriptBtn');
  const exportVideoBtn = document.getElementById('exportVideoBtn');
  const heroWatchVideoBtn = document.getElementById('heroWatchVideoBtn');
  const videoPosterOverlay = document.getElementById('videoPosterOverlay');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const posterBadge = document.getElementById('posterBadge');
  const posterTitle = document.getElementById('posterTitle');
  const posterSubtitle = document.getElementById('posterSubtitle');
  const videoCanvas = document.getElementById('videoCanvas');
  const liveStatusPill = document.getElementById('liveStatusPill');

  // 擬真人聲設定相關 DOM 元素
  const voiceSettingsBtn = document.getElementById('voiceSettingsBtn');
  const voiceSettingsModal = document.getElementById('voiceSettingsModal');
  const voiceModalCloseBtn = document.getElementById('voiceModalCloseBtn');
  const voicePersonaBtns = document.querySelectorAll('.voice-persona-btn');
  const voiceSelectDropdown = document.getElementById('voiceSelectDropdown');
  const currentVoiceBadge = document.getElementById('currentVoiceBadge');
  const voicePitchRange = document.getElementById('voicePitchRange');
  const voicePitchVal = document.getElementById('voicePitchVal');
  const voiceSpeedRange = document.getElementById('voiceSpeedRange');
  const voiceSpeedVal = document.getElementById('voiceSpeedVal');
  const voiceNaturalPauseCheckbox = document.getElementById('voiceNaturalPauseCheckbox');
  const voicePreviewBtn = document.getElementById('voicePreviewBtn');
  const voicePreviewBtnText = document.getElementById('voicePreviewBtnText');
  const voicePreviewStatus = document.getElementById('voicePreviewStatus');
  const voiceResetBtn = document.getElementById('voiceResetBtn');
  const voiceSaveBtn = document.getElementById('voiceSaveBtn');
  const voiceIndicatorText = document.getElementById('voiceIndicatorText');

  // 語音設定狀態
  const DEFAULT_VOICE_SETTINGS = {
    persona: 'auto',
    voiceURI: '',
    pitch: 1.0,
    rate: 1.0,
    naturalPauses: true
  };

  let voiceSettings = { ...DEFAULT_VOICE_SETTINGS };
  try {
    const savedVoiceConf = localStorage.getItem('criminal_law_voice_settings');
    if (savedVoiceConf) {
      voiceSettings = { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(savedVoiceConf) };
    }
  } catch (e) {
    console.warn('Failed to load voice settings from localStorage:', e);
  }

  // 隊列播放器狀態
  let speechQueue = [];
  let speechQueueIndex = 0;
  let isSpeakingQueue = false;
  let speechPauseTimer = null;
  let isPreviewMode = false;

  // 啟動 Canvas 動態視訊渲染引擎
  if (videoCanvas) {
    initCanvasMotion(videoCanvas);
  }

  // 初始化載入初級版
  loadLevel('beginner');
  initEventListeners();

  /* --- 載入指定級別 --- */
  function loadLevel(levelKey) {
    if (!videoData[levelKey]) return;
    pauseVideo();
    currentLevelKey = levelKey;
    currentChapterIndex = 0;
    chapterElapsedSec = 0;

    const currentLevelData = videoData[levelKey];

    // 更新選項卡 Active 狀態
    levelTabs.forEach(tab => {
      const isActive = tab.getAttribute('data-level') === levelKey;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 更新頂部標籤
    if (stageLevelBadge) stageLevelBadge.textContent = currentLevelData.title;
    if (chapCountBadge) chapCountBadge.textContent = `共 ${currentLevelData.chapters.length} 幕`;
    if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(currentLevelData.totalSec);

    // 更新封面大卡片文字
    if (posterBadge) {
      if (levelKey === 'beginner') posterBadge.textContent = '🌱 初級生活情境入門篇';
      else if (levelKey === 'intermediate') posterBadge.textContent = '⚖️ 中級國考體系精講篇';
      else if (levelKey === 'advanced') posterBadge.textContent = '🏛️ 高級法學深究憲判篇';
    }
    if (posterTitle) {
      if (levelKey === 'beginner') posterTitle.textContent = '做了一件壞事 ＝ 這個人一定是壞人嗎？';
      else if (levelKey === 'intermediate') posterTitle.textContent = '德日三階論與「不法推定罪責」兩階段架構';
      else if (levelKey === 'advanced') posterTitle.textContent = '規範罪責論演進與2022年刑法§87重大革新';
    }
    if (posterSubtitle) {
      if (levelKey === 'beginner') posterSubtitle.textContent = '生活實例劇場帶您看懂「不法推定罪責」兩階段判斷！';
      else if (levelKey === 'intermediate') posterSubtitle.textContent = '六大抗辯條文深度剖析與實務三段論答題！';
      else if (levelKey === 'advanced') posterSubtitle.textContent = '實質罪責原則、民法18歲成年與少事法曝險行政先行！';
    }
    if (videoPosterOverlay) {
      videoPosterOverlay.classList.remove('hidden');
    }
    if (liveStatusPill) {
      liveStatusPill.textContent = '⏸ 點擊播放';
      liveStatusPill.classList.remove('playing');
    }

    // 渲染右側章節目錄清單
    renderChaptersList();

    // 渲染第一分鏡
    renderCurrentSlide();
  }

  /* --- 渲染章節清單 --- */
  function renderChaptersList() {
    if (!chaptersList) return;
    const currentLevelData = videoData[currentLevelKey];
    chaptersList.innerHTML = '';

    currentLevelData.chapters.forEach((chap, idx) => {
      const item = document.createElement('div');
      item.className = `chapter-item ${idx === currentChapterIndex ? 'active' : ''}`;
      item.setAttribute('data-index', idx);
      item.setAttribute('role', 'listitem');

      const tagsHtml = chap.tags.map(t => `<span class="chap-tag">${t}</span>`).join('');

      item.innerHTML = `
        <div class="chap-top-row">
          <span class="chap-idx">第 ${chap.index} 幕</span>
          <span class="chap-duration">${chap.durationText}</span>
        </div>
        <div class="chap-name">${chap.title}</div>
        <div class="chap-tags">${tagsHtml}</div>
      `;

      item.addEventListener('click', () => {
        jumpToChapter(idx);
      });

      chaptersList.appendChild(item);
    });
  }

  /* --- 渲染當前動態分鏡投影片 --- */
  function renderCurrentSlide() {
    const currentLevelData = videoData[currentLevelKey];
    const chap = currentLevelData.chapters[currentChapterIndex];
    if (!chap || !motionCard) return;

    if (stageChapBadge) {
      stageChapBadge.textContent = `分鏡 ${chap.index} / ${currentLevelData.chapters.length}`;
    }

    // 重新觸發動畫
    motionCard.style.animation = 'none';
    motionCard.offsetHeight; // trigger reflow
    motionCard.style.animation = 'slideFadeIn 0.45s ease-out';

    motionCard.innerHTML = `
      <div class="motion-card-top">
        <div class="motion-chap-title">
          <span>${chap.icon}</span>
          <span>${chap.title}</span>
        </div>
        <span class="motion-topic-pill">${chap.topic}</span>
      </div>
      <div class="motion-visual-grid">
        <div class="motion-box">
          <div class="motion-box-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>${chap.box1Title}</span>
          </div>
          <p class="motion-box-desc">${chap.box1Desc}</p>
        </div>
        <div class="motion-box">
          <div class="motion-box-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>${chap.box2Title}</span>
          </div>
          <p class="motion-box-desc">${chap.box2Desc}</p>
        </div>
      </div>
      <div class="motion-takeaway">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        <span>${chap.takeaway}</span>
      </div>
    `;

    // 更新字幕
    if (subtitleText) {
      subtitleText.textContent = chap.subtitle;
    }

    // 更新右側選中高亮
    const items = chaptersList.querySelectorAll('.chapter-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === currentChapterIndex);
      if (i === currentChapterIndex) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    updateProgressUI();
  }

  /* --- 跳轉到指定章節 --- */
  function jumpToChapter(index) {
    const currentLevelData = videoData[currentLevelKey];
    if (index < 0 || index >= currentLevelData.chapters.length) return;
    currentChapterIndex = index;
    chapterElapsedSec = 0;
    renderCurrentSlide();

    if (isPlaying) {
      playSpeechForCurrentChapter();
    }
  }

  /* --- 播放控制 --- */
  function togglePlay() {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }

  function playVideo() {
    isPlaying = true;
    if (iconPlay) iconPlay.style.display = 'none';
    if (iconPause) iconPause.style.display = 'block';
    if (videoPosterOverlay) videoPosterOverlay.classList.add('hidden');
    if (liveStatusPill) {
      liveStatusPill.textContent = '● 播放中 (LIVE)';
      liveStatusPill.classList.add('playing');
    }

    playIntroChime();
    playSpeechForCurrentChapter();
    startProgressTimer();

    const currentLevelData = videoData[currentLevelKey];
    const chap = currentLevelData ? currentLevelData.chapters[currentChapterIndex] : null;
    if (chap) {
      showToast(`▶️ 正在播放：${chap.title}`);
    }
  }

  function pauseVideo() {
    isPlaying = false;
    if (iconPlay) iconPlay.style.display = 'block';
    if (iconPause) iconPause.style.display = 'none';
    if (liveStatusPill) {
      liveStatusPill.textContent = '⏸ 點擊播放';
      liveStatusPill.classList.remove('playing');
    }

    stopSpeech();
    stopProgressTimer();
    if (voiceIndicator) {
      voiceIndicator.classList.remove('speaking');
    }
  }

  /* --- 計時器與進度條更新 --- */
  function startProgressTimer() {
    stopProgressTimer();
    const intervalMs = 1000 / currentSpeed;
    timerInterval = setInterval(() => {
      chapterElapsedSec++;
      const currentLevelData = videoData[currentLevelKey];
      const chap = currentLevelData.chapters[currentChapterIndex];

      if (chapterElapsedSec >= chap.durationSec) {
        // 本分鏡結束，自動跳轉至下一幕
        if (currentChapterIndex < currentLevelData.chapters.length - 1) {
          jumpToChapter(currentChapterIndex + 1);
        } else {
          // 全部結束
          pauseVideo();
          chapterElapsedSec = 0;
          updateProgressUI();
          showToast('🎉 本級別講解影片已全部播放完畢！');
        }
      } else {
        updateProgressUI();
      }
    }, intervalMs);
  }

  function stopProgressTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateProgressUI() {
    const currentLevelData = videoData[currentLevelKey];
    const chap = currentLevelData.chapters[currentChapterIndex];

    // 計算累計秒數
    let cumulativeSec = 0;
    for (let i = 0; i < currentChapterIndex; i++) {
      cumulativeSec += currentLevelData.chapters[i].durationSec;
    }
    cumulativeSec += chapterElapsedSec;

    const percent = Math.min(100, (cumulativeSec / currentLevelData.totalSec) * 100);
    if (videoProgressBar) {
      videoProgressBar.style.width = `${percent}%`;
    }
    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatTime(cumulativeSec);
    }
  }

  /* ==========================================================================
     高擬真自然人聲系統 (Human-like Natural Speech & Prosody Engine)
     ========================================================================== */

  /* --- 數字轉國字發音輔助函式 --- */
  function numToChinese(num) {
    const n = parseInt(num, 10);
    if (isNaN(n)) return String(num);
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    if (n < 10) return digits[n];
    if (n < 20) return (n === 10 ? '十' : '十' + digits[n % 10]);
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const unit = n % 10;
      return digits[ten] + '十' + (unit !== 0 ? digits[unit] : '');
    }
    return String(n);
  }

  function yearToChinese(yearStr) {
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    return String(yearStr).split('').map(d => digits[parseInt(d, 10)] !== undefined ? digits[parseInt(d, 10)] : d).join('');
  }

  /* --- 法學口播文字前處理 (Spoken Law Text Converter) --- */
  function toSpokenLawText(rawText) {
    if (!rawText) return '';
    let s = rawText;

    // 1. 符號與 Emoji 清除（避免合成器卡頓或唸出亂碼）
    s = s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '');
    s = s.replace(/＝/g, ' 等於 ');
    s = s.replace(/\bvs\b/gi, ' 對比 ');
    s = s.replace(/[•｜]/g, '，');
    s = s.replace(/——+/g, '，');

    // 2. 刑法條號專有名詞轉化 (例：§19 -> 刑法第十九條)
    s = s.replace(/§\s*(\d+)/g, (_, n) => `刑法第${numToChinese(n)}條`);
    s = s.replace(/第\s*(\d+)\s*條第\s*(\d+)\s*項/g, (_, a, b) => `第${numToChinese(a)}條第${numToChinese(b)}項`);
    s = s.replace(/第\s*(\d+)[、及與](\d+)\s*條/g, (_, a, b) => `第${numToChinese(a)}條與第${numToChinese(b)}條`);
    s = s.replace(/第\s*(\d+)\s*條/g, (_, n) => `第${numToChinese(n)}條`);
    s = s.replace(/第\s*(\d+)\s*項/g, (_, n) => `第${numToChinese(n)}項`);

    // 3. 年份與世紀 (例：2022 年 -> 二零二二年)
    s = s.replace(/(\d{4})\s*年/g, (_, y) => `${yearToChinese(y)}年`);
    s = s.replace(/(\d{4})\s*原書/g, (_, y) => `${yearToChinese(y)}原書`);
    s = s.replace(/(\d+)\s*世紀/g, (_, c) => `${numToChinese(c)}世紀`);
    s = s.replace(/(\d+)\s*月/g, (_, m) => `${numToChinese(m)}月`);

    // 4. 年齡、年限與數量名詞口播化
    s = s.replace(/未滿\s*(\d+)\s*歲/g, (_, a) => `未滿${numToChinese(a)}歲`);
    s = s.replace(/(\d+)\s*歲/g, (_, a) => `${numToChinese(a)}歲`);
    s = s.replace(/(\d+)\s*年/g, (_, y) => `${numToChinese(y)}年`);
    s = s.replace(/(\d+)\s*分鐘/g, (_, m) => `${numToChinese(m)}分鐘`);
    s = s.replace(/(\d+)\s*大案例/g, (_, c) => `${numToChinese(c)}大案例`);
    s = s.replace(/(\d+)\s*步驟/g, (_, st) => `${numToChinese(st)}步驟`);
    s = s.replace(/(\d+)\s*階段/g, (_, st) => `${numToChinese(st)}階段`);
    s = s.replace(/(\d+)\s*幕/g, (_, st) => `${numToChinese(st)}幕`);

    // 5. 標點符號平滑化
    s = s.replace(/，+/g, '，');
    s = s.replace(/。+/g, '。');
    s = s.replace(/[！!]+/g, '！');
    s = s.replace(/[？?]+/g, '？');

    return s;
  }

  /* --- 語音品質加權評分演算法 --- */
  function scoreChineseVoice(voice) {
    let score = 0;
    const name = (voice.name || '').toLowerCase();
    const lang = (voice.lang || '').toLowerCase();

    // 語言基礎分 (臺灣繁體 > 香港 > 大陸普通話 > 一般中文)
    if (lang.includes('zh-tw') || lang.includes('cmn-tw')) {
      score += 65;
    } else if (lang.includes('zh-hk')) {
      score += 35;
    } else if (lang.includes('zh-cn') || lang.includes('cmn-cn')) {
      score += 30;
    } else if (lang.startsWith('zh')) {
      score += 20;
    } else {
      return -999; // 非中文語音
    }

    // 微軟神經網路自然人聲 (Azure Neural / Edge Natural)
    if (name.includes('natural') || name.includes('neural') || name.includes('online (natural)')) {
      score += 150;
    }

    // 明星自然人聲加權
    if (name.includes('hsiaochen') || name.includes('曉臻')) score += 95;
    if (name.includes('yunjhe') || name.includes('雲哲')) score += 95;
    if (name.includes('xiaoxiao') || name.includes('曉曉')) score += 75;
    if (name.includes('yunxi') || name.includes('雲希')) score += 75;
    if (name.includes('yunjian') || name.includes('雲健')) score += 75;

    // Google 自然雲端語音 (Chrome 內建)
    if (name.includes('google') && (lang.includes('zh-tw') || name.includes('臺灣') || name.includes('台灣'))) {
      score += 85;
    } else if (name.includes('google')) {
      score += 50;
    }

    // Apple 增強版語音 (macOS / iOS)
    if (name.includes('enhanced') || name.includes('premium')) score += 60;
    if (name.includes('mei-jia') || name.includes('sin-ji') || name.includes('ting-ting')) score += 40;

    // 扣分項：嚴重機械音（舊版 Windows SAPI 離線語音）
    if (name.includes('desktop') || name.includes('hanhan') || name.includes('huihui') || name.includes('espeak')) {
      score -= 80;
    }

    return score;
  }

  /* --- 取得依品質排序的中文語音清單 --- */
  function getSortedChineseVoices() {
    if (!('speechSynthesis' in window)) return [];
    const all = window.speechSynthesis.getVoices() || [];
    const chineseVoices = all.filter(v => {
      const l = (v.lang || '').toLowerCase();
      return l.startsWith('zh') || l.includes('cmn');
    });

    return chineseVoices.sort((a, b) => scoreChineseVoice(b) - scoreChineseVoice(a));
  }

  /* --- 依據使用者音色風格偏好選擇最佳語音 --- */
  function pickBestVoice() {
    const sorted = getSortedChineseVoices();
    if (sorted.length === 0) {
      const all = window.speechSynthesis.getVoices() || [];
      return all[0] || null;
    }

    // 若使用者指定了特定的 voiceURI，先嘗試精確比對
    if (voiceSettings.voiceURI) {
      const exact = sorted.find(v => v.voiceURI === voiceSettings.voiceURI || v.name === voiceSettings.voiceURI);
      if (exact) return exact;
    }

    const persona = voiceSettings.persona || 'auto';

    if (persona === 'female') {
      const femaleKeywords = ['hsiaochen', '曉臻', 'xiaoxiao', '曉曉', '國語', 'mei-jia', 'ting-ting', 'female', '女', 'hanhan'];
      const fVoice = sorted.find(v => {
        const n = v.name.toLowerCase();
        return femaleKeywords.some(k => n.includes(k));
      });
      if (fVoice) return fVoice;
    } else if (persona === 'male') {
      const maleKeywords = ['yunjhe', '雲哲', 'yunxi', '雲希', 'yunjian', '雲健', 'kangkang', 'danny', 'male', '男'];
      const mVoice = sorted.find(v => {
        const n = v.name.toLowerCase();
        return maleKeywords.some(k => n.includes(k));
      });
      if (mVoice) return mVoice;
    } else if (persona === 'anchor') {
      const anchorKeywords = ['xiaoxiao', '曉曉', 'yunjian', '雲健', 'google 國語', 'hsiaochen'];
      const aVoice = sorted.find(v => {
        const n = v.name.toLowerCase();
        return anchorKeywords.some(k => n.includes(k));
      });
      if (aVoice) return aVoice;
    }

    // 預設 (auto) 回傳評分最高的第一名自然語音
    return sorted[0];
  }

  /* --- 依人類呼吸節奏將長篇講稿切分為微語意塊 --- */
  function splitIntoProsodyChunks(text) {
    const regex = /([^。！？，；：\n]+[。！？，；：\n]*)/g;
    const matches = text.match(regex) || [text];
    const chunks = [];

    matches.forEach(m => {
      const trimmed = m.trim();
      if (!trimmed) return;

      let pauseMs = 120; // 預設逗號氣息微停頓 (ms)
      if (/[。！？\n]/.test(trimmed)) {
        pauseMs = 300; // 完整句號換氣停頓
      } else if (/[，、；：]/.test(trimmed)) {
        pauseMs = 130; // 短暫換氣微停頓
      }

      chunks.push({
        text: trimmed,
        pause: pauseMs
      });
    });

    return chunks;
  }

  /* --- 播放分鏡語音 (高擬真自然語流隊列) --- */
  function playSpeechForCurrentChapter() {
    stopSpeech();

    if (!voiceEnabled || !('speechSynthesis' in window)) {
      if (voiceIndicator) {
        voiceIndicator.classList.remove('speaking');
        voiceIndicator.classList.toggle('muted', !voiceEnabled);
      }
      return;
    }

    const chap = videoData[currentLevelKey].chapters[currentChapterIndex];
    if (!chap || !chap.voiceText) return;

    const spokenText = toSpokenLawText(chap.voiceText);
    const targetVoice = pickBestVoice();

    updateVoiceIndicatorLabel(targetVoice);

    speechQueue = splitIntoProsodyChunks(spokenText);
    speechQueueIndex = 0;
    isSpeakingQueue = true;
    isPreviewMode = false;

    speakNextQueueItem(targetVoice, false);
  }

  /* --- 隊列逐句朗讀控制 --- */
  function speakNextQueueItem(voice, isPreview = false) {
    if (!isSpeakingQueue || speechQueueIndex >= speechQueue.length) {
      isSpeakingQueue = false;
      if (voiceIndicator && !isPreview) {
        voiceIndicator.classList.remove('speaking');
      }
      if (isPreview && voicePreviewBtn) {
        voicePreviewBtn.classList.remove('speaking');
        if (voicePreviewBtnText) voicePreviewBtnText.textContent = '試聽人聲效果';
        if (voicePreviewStatus) voicePreviewStatus.textContent = '試聽播放完成';
      }
      return;
    }

    const item = speechQueue[speechQueueIndex];
    if (!item || !item.text) {
      speechQueueIndex++;
      speakNextQueueItem(voice, isPreview);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(item.text);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'zh-TW';
      } else {
        utterance.lang = 'zh-TW';
      }

      utterance.pitch = voiceSettings.pitch;
      const effectiveRate = Math.min(2.0, Math.max(0.6, voiceSettings.rate * currentSpeed));
      utterance.rate = effectiveRate;

      utterance.onstart = () => {
        if (!isPreview && voiceIndicator) {
          voiceIndicator.classList.add('speaking');
          voiceIndicator.classList.remove('muted');
        }
        if (isPreview && voicePreviewBtn) {
          voicePreviewBtn.classList.add('speaking');
          if (voicePreviewBtnText) voicePreviewBtnText.textContent = '停止試聽';
          if (voicePreviewStatus) voicePreviewStatus.textContent = '正在播放試聽語音...';
        }
      };

      utterance.onend = () => {
        if (!isSpeakingQueue) return;

        speechQueueIndex++;
        if (speechQueueIndex < speechQueue.length) {
          const pauseDuration = voiceSettings.naturalPauses ? (item.pause / effectiveRate) : 30;
          speechPauseTimer = setTimeout(() => {
            if (isSpeakingQueue) {
              speakNextQueueItem(voice, isPreview);
            }
          }, pauseDuration);
        } else {
          isSpeakingQueue = false;
          if (!isPreview && voiceIndicator) {
            voiceIndicator.classList.remove('speaking');
          }
          if (isPreview && voicePreviewBtn) {
            voicePreviewBtn.classList.remove('speaking');
            if (voicePreviewBtnText) voicePreviewBtnText.textContent = '試聽人聲效果';
            if (voicePreviewStatus) voicePreviewStatus.textContent = '試聽播放完畢';
          }
        }
      };

      utterance.onerror = (err) => {
        console.warn('Speech chunk error, skipping to next:', err);
        if (!isSpeakingQueue) return;
        speechQueueIndex++;
        speakNextQueueItem(voice, isPreview);
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      isSpeakingQueue = false;
    }
  }

  /* --- 停止朗讀與清除排程 --- */
  function stopSpeech() {
    if (speechPauseTimer) {
      clearTimeout(speechPauseTimer);
      speechPauseTimer = null;
    }
    speechQueue = [];
    speechQueueIndex = 0;
    isSpeakingQueue = false;

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    if (voiceIndicator) {
      voiceIndicator.classList.remove('speaking');
    }
    if (voicePreviewBtn) {
      voicePreviewBtn.classList.remove('speaking');
      if (voicePreviewBtnText) voicePreviewBtnText.textContent = '試聽人聲效果';
    }
  }

  /* --- 更新指示器上的語音名稱標籤 --- */
  function updateVoiceIndicatorLabel(voice) {
    if (!voiceIndicatorText) return;
    if (!voice) {
      voiceIndicatorText.textContent = '系統語音';
      return;
    }

    const n = voice.name;
    let label = '自然人聲';
    if (n.includes('HsiaoChen') || n.includes('曉臻')) {
      label = '微軟曉臻 (自然女聲)';
    } else if (n.includes('YunJhe') || n.includes('雲哲')) {
      label = '微軟雲哲 (自然男聲)';
    } else if (n.includes('Xiaoxiao') || n.includes('曉曉')) {
      label = '微軟曉曉 (主播女聲)';
    } else if (n.includes('Yunxi') || n.includes('雲希')) {
      label = '微軟雲希 (自然男聲)';
    } else if (n.includes('Google') && (n.includes('國語') || n.includes('臺灣'))) {
      label = 'Google 國語 (自然人聲)';
    } else if (n.includes('Natural') || n.includes('Online')) {
      label = n.split(' ')[0] + ' (自然人聲)';
    } else {
      label = n.length > 14 ? n.substring(0, 14) + '...' : n;
    }

    voiceIndicatorText.textContent = label;
  }

  /* --- 填充並更新聲音設定下拉選單 --- */
  function populateVoiceDropdown() {
    if (!voiceSelectDropdown) return;
    const sorted = getSortedChineseVoices();

    voiceSelectDropdown.innerHTML = '';

    if (sorted.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '系統未偵測到中文語音（將使用預設）';
      voiceSelectDropdown.appendChild(opt);
      if (currentVoiceBadge) currentVoiceBadge.textContent = '系統預設';
      return;
    }

    sorted.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI || v.name;

      const score = scoreChineseVoice(v);
      let qualityBadge = '';
      if (score >= 180) qualityBadge = '🌟【極致擬真】';
      else if (score >= 120) qualityBadge = '✨【自然人聲】';
      else if (score >= 70) qualityBadge = '💎【高質語音】';
      else if (score < 0) qualityBadge = '⚠️【早期機械音】';
      else qualityBadge = '標準';

      opt.textContent = `${qualityBadge} ${v.name} (${v.lang})`;
      voiceSelectDropdown.appendChild(opt);
    });

    const activeVoice = pickBestVoice();
    if (activeVoice) {
      voiceSelectDropdown.value = activeVoice.voiceURI || activeVoice.name;
      if (currentVoiceBadge) {
        const isNatural = (activeVoice.name || '').toLowerCase().includes('natural') || scoreChineseVoice(activeVoice) >= 120;
        currentVoiceBadge.textContent = isNatural ? `🌟 自然人聲：${activeVoice.name.split(' ')[0]}` : activeVoice.name.split(' ')[0];
      }
      updateVoiceIndicatorLabel(activeVoice);
    }
  }

  /* --- 試聽人聲效果 --- */
  function togglePreviewVoice() {
    if (isSpeakingQueue && isPreviewMode) {
      stopSpeech();
      if (voicePreviewStatus) voicePreviewStatus.textContent = '已停止試聽';
      return;
    }

    stopSpeech();

    const targetVoice = pickBestVoice();
    const previewText = "哈囉！我是刑法總論影音微課的 AI 導覽員。這是我現在說話的音色、語速與自然呼吸節奏。聽起來是不是非常像真人呢？";
    const spoken = toSpokenLawText(previewText);

    speechQueue = splitIntoProsodyChunks(spoken);
    speechQueueIndex = 0;
    isSpeakingQueue = true;
    isPreviewMode = true;

    speakNextQueueItem(targetVoice, true);
  }

  /* --- 打開聲音設定彈窗 --- */
  function openVoiceSettingsModal() {
    if (!voiceSettingsModal) return;
    populateVoiceDropdown();

    // 同步當前狀態至 UI
    if (voicePersonaBtns) {
      voicePersonaBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.persona === voiceSettings.persona);
      });
    }

    if (voicePitchRange) {
      voicePitchRange.value = voiceSettings.pitch;
      if (voicePitchVal) voicePitchVal.textContent = `${parseFloat(voiceSettings.pitch).toFixed(2)}x`;
    }

    if (voiceSpeedRange) {
      voiceSpeedRange.value = voiceSettings.rate;
      if (voiceSpeedVal) voiceSpeedVal.textContent = `${parseFloat(voiceSettings.rate).toFixed(2)}x`;
    }

    if (voiceNaturalPauseCheckbox) {
      voiceNaturalPauseCheckbox.checked = !!voiceSettings.naturalPauses;
    }

    voiceSettingsModal.style.display = 'flex';
    voiceSettingsModal.setAttribute('aria-hidden', 'false');
  }

  /* --- 關閉聲音設定彈窗 --- */
  function closeVoiceSettingsModal() {
    if (!voiceSettingsModal) return;
    if (isPreviewMode) stopSpeech();
    voiceSettingsModal.style.display = 'none';
    voiceSettingsModal.setAttribute('aria-hidden', 'true');
  }

  /* --- 儲存聲音設定到 LocalStorage --- */
  function saveVoiceSettings() {
    try {
      localStorage.setItem('criminal_law_voice_settings', JSON.stringify(voiceSettings));
      showToast('💾 聲音設定已成功儲存！');
    } catch (e) {
      console.warn('Cannot save to localStorage', e);
    }
    closeVoiceSettingsModal();

    const activeVoice = pickBestVoice();
    updateVoiceIndicatorLabel(activeVoice);

    if (isPlaying) {
      playSpeechForCurrentChapter();
    }
  }

  /* --- 重設為推薦設定 --- */
  function resetVoiceSettings() {
    voiceSettings = { ...DEFAULT_VOICE_SETTINGS };
    openVoiceSettingsModal();
    showToast('🔄 已恢復為推薦自然人聲預設');
  }

  /* --- 事件監聽註冊 --- */
  function initEventListeners() {
    // 級別標籤切換
    levelTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const levelKey = tab.getAttribute('data-level');
        if (levelKey !== currentLevelKey) {
          loadLevel(levelKey);
          showToast(`已切換為：${videoData[levelKey].title}`);
        }
      });
    });

    // 播放 / 暫停按鈕
    if (playToggleBtn) {
      playToggleBtn.addEventListener('click', togglePlay);
    }

    // 上一分鏡
    if (prevSlideBtn) {
      prevSlideBtn.addEventListener('click', () => {
        if (currentChapterIndex > 0) {
          jumpToChapter(currentChapterIndex - 1);
        } else {
          showToast('目前已經是第一幕');
        }
      });
    }

    // 下一分鏡
    if (nextSlideBtn) {
      nextSlideBtn.addEventListener('click', () => {
        const currentLevelData = videoData[currentLevelKey];
        if (currentChapterIndex < currentLevelData.chapters.length - 1) {
          jumpToChapter(currentChapterIndex + 1);
        } else {
          showToast('目前已經是最後一幕');
        }
      });
    }

    // 進度條點擊跳轉
    if (videoProgressContainer) {
      videoProgressContainer.addEventListener('click', (e) => {
        const rect = videoProgressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const ratio = Math.max(0, Math.min(1, clickX / width));

        const currentLevelData = videoData[currentLevelKey];
        const targetSec = ratio * currentLevelData.totalSec;

        // 計算該秒數落在哪一個章節
        let accumulated = 0;
        for (let i = 0; i < currentLevelData.chapters.length; i++) {
          const ch = currentLevelData.chapters[i];
          if (targetSec <= accumulated + ch.durationSec || i === currentLevelData.chapters.length - 1) {
            currentChapterIndex = i;
            chapterElapsedSec = Math.floor(targetSec - accumulated);
            renderCurrentSlide();
            if (isPlaying) {
              playSpeechForCurrentChapter();
              startProgressTimer();
            }
            break;
          }
          accumulated += ch.durationSec;
        }
      });
    }

    // 語音開關切換
    if (voiceToggleBtn) {
      voiceToggleBtn.addEventListener('click', () => {
        voiceEnabled = !voiceEnabled;
        voiceToggleBtn.classList.toggle('active', voiceEnabled);
        if (voiceIndicator) {
          voiceIndicator.classList.toggle('muted', !voiceEnabled);
          if (!voiceEnabled) voiceIndicator.classList.remove('speaking');
        }

        if (voiceEnabled) {
          showToast('🔊 語音旁白朗讀已開啟');
          if (isPlaying) playSpeechForCurrentChapter();
        } else {
          stopSpeech();
          showToast('🔇 語音旁白已靜音');
        }
      });
      // 預設高亮開啟
      voiceToggleBtn.classList.add('active');
    }

    // 擬真人聲設定面板互動
    if (voiceSettingsBtn) {
      voiceSettingsBtn.addEventListener('click', openVoiceSettingsModal);
    }
    if (voiceIndicator) {
      voiceIndicator.addEventListener('click', openVoiceSettingsModal);
    }
    if (voiceModalCloseBtn) {
      voiceModalCloseBtn.addEventListener('click', closeVoiceSettingsModal);
    }
    if (voiceSettingsModal) {
      voiceSettingsModal.addEventListener('click', (e) => {
        if (e.target === voiceSettingsModal) {
          closeVoiceSettingsModal();
        }
      });
    }

    // 人聲音色風格按鈕切換 (Persona)
    if (voicePersonaBtns) {
      voicePersonaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          voicePersonaBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          voiceSettings.persona = btn.dataset.persona;
          voiceSettings.voiceURI = ''; // 清除自選以套用 Persona 推薦
          populateVoiceDropdown();
        });
      });
    }

    // 詳細語音清單自選
    if (voiceSelectDropdown) {
      voiceSelectDropdown.addEventListener('change', () => {
        voiceSettings.voiceURI = voiceSelectDropdown.value;
        const sorted = getSortedChineseVoices();
        const selectedVoice = sorted.find(v => (v.voiceURI || v.name) === voiceSettings.voiceURI);
        if (selectedVoice && currentVoiceBadge) {
          const isNatural = (selectedVoice.name || '').toLowerCase().includes('natural') || scoreChineseVoice(selectedVoice) >= 120;
          currentVoiceBadge.textContent = isNatural ? `🌟 自然人聲：${selectedVoice.name.split(' ')[0]}` : selectedVoice.name.split(' ')[0];
        }
      });
    }

    // 音調與語速滑桿調節
    if (voicePitchRange) {
      voicePitchRange.addEventListener('input', () => {
        voiceSettings.pitch = parseFloat(voicePitchRange.value);
        if (voicePitchVal) voicePitchVal.textContent = `${voiceSettings.pitch.toFixed(2)}x`;
      });
    }
    if (voiceSpeedRange) {
      voiceSpeedRange.addEventListener('input', () => {
        voiceSettings.rate = parseFloat(voiceSpeedRange.value);
        if (voiceSpeedVal) voiceSpeedVal.textContent = `${voiceSettings.rate.toFixed(2)}x`;
      });
    }

    // 自然換氣與停頓切換
    if (voiceNaturalPauseCheckbox) {
      voiceNaturalPauseCheckbox.addEventListener('change', () => {
        voiceSettings.naturalPauses = voiceNaturalPauseCheckbox.checked;
      });
    }

    // 試聽按鈕
    if (voicePreviewBtn) {
      voicePreviewBtn.addEventListener('click', togglePreviewVoice);
    }

    // 恢復推薦預設按鈕
    if (voiceResetBtn) {
      voiceResetBtn.addEventListener('click', resetVoiceSettings);
    }

    // 確認儲存按鈕
    if (voiceSaveBtn) {
      voiceSaveBtn.addEventListener('click', saveVoiceSettings);
    }

    // 監聽 Web Speech API 語音異步加載完畢事件
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        populateVoiceDropdown();
      };
      // 多階段主動載入檢查
      setTimeout(populateVoiceDropdown, 150);
      setTimeout(populateVoiceDropdown, 800);
      setTimeout(populateVoiceDropdown, 2000);
    }

    // 倍速切換 (1.0x -> 1.25x -> 1.5x)
    if (speedToggleBtn && speedLabel) {
      const speeds = [1.0, 1.25, 1.5];
      speedToggleBtn.addEventListener('click', () => {
        const currentIdx = speeds.indexOf(currentSpeed);
        const nextIdx = (currentIdx + 1) % speeds.length;
        currentSpeed = speeds[nextIdx];
        speedLabel.textContent = `${currentSpeed.toFixed(1).replace('.0', '')}x`;
        showToast(`播放倍速：${speedLabel.textContent}`);

        if (isPlaying) {
          startProgressTimer();
          playSpeechForCurrentChapter();
        }
      });
    }

    // 全螢幕切換
    if (fullscreenToggleBtn && videoScreen) {
      fullscreenToggleBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (videoScreen.requestFullscreen) {
            videoScreen.requestFullscreen().catch(() => {
              videoScreen.classList.toggle('fullscreen-active');
            });
          } else {
            videoScreen.classList.toggle('fullscreen-active');
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
          videoScreen.classList.remove('fullscreen-active');
        }
      });
    }

    // 複製本幕逐字稿
    if (copyCurrentScriptBtn) {
      copyCurrentScriptBtn.addEventListener('click', () => {
        const chap = videoData[currentLevelKey].chapters[currentChapterIndex];
        if (chap && chap.voiceText) {
          navigator.clipboard.writeText(chap.voiceText).then(() => {
            showToast('📋 已複製本分鏡逐字口播台詞至剪貼簿！');
          }).catch(() => {
            showToast('台詞複製失敗，請手動選取');
          });
        }
      });
    }

    // 首頁快捷觀看按鈕 (直接同步觸發播放，避免 setTimeout 導致瀏覽器阻止語音)
    if (heroWatchVideoBtn) {
      heroWatchVideoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playVideo();
        const secVideo = document.getElementById('section-video') || document.getElementById('videoPlayerContainer');
        if (secVideo) {
          secVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    // 大封面播放鈕點擊播放 (直接同步觸發)
    if (videoPosterOverlay) {
      videoPosterOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        playVideo();
      });
    }

    if (bigPlayBtn) {
      bigPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playVideo();
      });
    }

    // 匯出/下載影片檔案
    if (exportVideoBtn) {
      exportVideoBtn.addEventListener('click', () => {
        recordAndDownloadVideo();
      });
    }

    // 鍵盤空白鍵與方向鍵操控
    document.addEventListener('keydown', (e) => {
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
        return;
      }
      if (e.code === 'Space') {
        const videoRect = container.getBoundingClientRect();
        if (videoRect.top < window.innerHeight && videoRect.bottom > 0) {
          e.preventDefault();
          togglePlay();
        }
      } else if (e.key === 'ArrowRight' && (e.ctrlKey || e.altKey)) {
        const currentLevelData = videoData[currentLevelKey];
        if (currentChapterIndex < currentLevelData.chapters.length - 1) {
          e.preventDefault();
          jumpToChapter(currentChapterIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' && (e.ctrlKey || e.altKey)) {
        if (currentChapterIndex > 0) {
          e.preventDefault();
          jumpToChapter(currentChapterIndex - 1);
        }
      }
    });
  }

  /* --- 影片視訊錄製與下載功能 (HTML5 MediaRecorder) --- */
  function recordAndDownloadVideo() {
    const canvas = document.getElementById('videoCanvas');
    if (!canvas || !window.MediaRecorder) {
      showToast('⚠️ 您的瀏覽器不支援直接匯出影片，建議直接點擊播放線上觀看！');
      return;
    }

    showToast('🎥 正在為您錄製並渲染視訊檔案（約 5 秒），請稍候...');

    try {
      const stream = canvas.captureStream(30);
      const recordedChunks = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const levelNames = { beginner: '初級生活劇', intermediate: '中級國考體系', advanced: '高級憲政深究' };
        a.download = `刑法總論講解影片_${levelNames[currentLevelKey] || currentLevelKey}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        showToast('✅ 影片檔下載成功！已存至您的電腦下載資料夾！');
      };

      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 5000);
    } catch (err) {
      console.warn('Record video error:', err);
      showToast('⚠️ 錄製視訊時遇到限制，建議直接於瀏覽器線上播放體驗！');
    }
  }

  /* --- 播放點擊立體聲提示音 (Web Audio API) --- */
  function playIntroChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  /* --- 動態 Canvas 60fps 視訊渲染引擎 --- */
  function initCanvasMotion(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    // 粒子系統
    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    function renderLoop() {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width;
      const H = canvas.height;
      const currentLevelData = videoData[currentLevelKey];
      const chap = currentLevelData ? currentLevelData.chapters[currentChapterIndex] : null;

      // 1. 深色劇院背景
      const grad = ctx.createRadialGradient(W / 2, H / 2, 30, W / 2, H / 2, W / 1.3);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.6, '#090d16');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 2. 律法透視格網線
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // 3. 浮動金色微粒
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. 左側動態黃金天秤 (Swaying Scales of Justice)
      const scaleX = W * 0.22;
      const scaleY = H * 0.52;
      const swayAngle = Math.sin(tick * 0.04) * 0.07;

      ctx.save();
      ctx.translate(scaleX, scaleY - 30);
      ctx.rotate(swayAngle);

      // 橫梁
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-75, 0);
      ctx.lineTo(75, 0);
      ctx.stroke();

      // 左右吊線與盤
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
      // 左
      ctx.beginPath();
      ctx.moveTo(-75, 0);
      ctx.lineTo(-75, 45);
      ctx.stroke();
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.beginPath();
      ctx.arc(-75, 45, 20, 0, Math.PI);
      ctx.fill();
      ctx.stroke();
      // 右
      ctx.beginPath();
      ctx.moveTo(75, 0);
      ctx.lineTo(75, 45);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(75, 45, 20, 0, Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // 中央立柱
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(scaleX, scaleY - 50);
      ctx.lineTo(scaleX, scaleY + 55);
      ctx.stroke();
      // 基座
      ctx.fillStyle = '#d97706';
      ctx.fillRect(scaleX - 30, scaleY + 55, 60, 10);

      // 5. 右側大字分鏡內容繪製 (直接繪製於視訊畫面上)
      if (chap) {
        ctx.save();
        // 級別與分鏡編號標籤
        ctx.font = 'bold 15px "Noto Sans TC", sans-serif';
        ctx.fillStyle = '#60a5fa';
        ctx.fillText(`【${currentLevelData.title}】 第 ${chap.index} 幕 / 共 ${currentLevelData.chapters.length} 幕`, W * 0.42, H * 0.28);

        // 主標題
        ctx.font = 'bold 26px "Noto Serif TC", serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(59, 130, 246, 0.6)';
        ctx.shadowBlur = 10;
        ctx.fillText(chap.title, W * 0.42, H * 0.38);
        ctx.shadowBlur = 0;

        // 核心法理小標
        ctx.font = '600 16px "Noto Sans TC", sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`✦ 核心焦點：${chap.topic}`, W * 0.42, H * 0.47);

        // 兩大要點卡 (繪製模擬視訊圖卡)
        // 卡片 1
        ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(W * 0.42, H * 0.53, W * 0.26, 90, 8);
        } else {
          ctx.rect(W * 0.42, H * 0.53, W * 0.26, 90);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 14px "Noto Sans TC", sans-serif';
        ctx.fillStyle = '#93c5fd';
        ctx.fillText(`① ${chap.box1Title.substring(0, 11)}`, W * 0.435, H * 0.59);
        ctx.font = '13px "Noto Sans TC", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(chap.box1Desc.substring(0, 16) + '...', W * 0.435, H * 0.66);

        // 卡片 2
        ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(W * 0.70, H * 0.53, W * 0.26, 90, 8);
        } else {
          ctx.rect(W * 0.70, H * 0.53, W * 0.26, 90);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 14px "Noto Sans TC", sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`② ${chap.box2Title.substring(0, 11)}`, W * 0.715, H * 0.59);
        ctx.font = '13px "Noto Sans TC", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(chap.box2Desc.substring(0, 16) + '...', W * 0.715, H * 0.66);

        // 核心金句 Takeaway 條
        ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(W * 0.42, H * 0.74, W * 0.54, 38, 6);
        } else {
          ctx.rect(W * 0.42, H * 0.74, W * 0.54, 38);
        }
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 13px "Noto Sans TC", sans-serif';
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText(`💡 核心精要：${chap.takeaway.substring(0, 30)}...`, W * 0.435, H * 0.79);
        ctx.restore();
      }

      // 6. 音波動畫 (Dancing Equalizer Bars at bottom)
      const eqX = W - 145;
      const eqY = H - 28;
      for (let i = 0; i < 10; i++) {
        const barH = isPlaying ? Math.sin(tick * 0.2 + i * 0.8) * 12 + 16 : 4;
        ctx.fillStyle = isPlaying ? '#10b981' : '#64748b';
        ctx.fillRect(eqX + i * 11, eqY - barH, 6, barH);
      }

      // 7. 頂部狀態列
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      if (isPlaying) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(30, 26, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('REC • 60FPS HD', 44, 30);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('⏸ STANDBY', 30, 30);
      }

      // 水印
      ctx.font = 'bold 13px "Noto Sans TC", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('⚖️ 刑法微課 • 4K LegalTech', W - 195, 30);

      requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }

  /* --- 時間格式化 helper (03:45) --- */
  function formatTime(totalSec) {
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    const mm = m < 10 ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;
    return `${mm}:${ss}`;
  }
}

