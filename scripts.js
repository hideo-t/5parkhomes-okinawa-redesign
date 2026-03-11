const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.dataset.state === 'open';
    navLinks.dataset.state = isOpen ? 'closed' : 'open';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.dataset.state = 'closed';
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const estimateForm = document.getElementById('estimate-form');
const estimateResult = document.getElementById('estimate-result');

const modelPricing = {
  'Solar Haven 6M': 6800000,
  'Park Round 6M': 5200000,
  'Park Round 12M': 9800000,
  'Park Moving 6M': 3630000,
};

const finishMultiplier = {
  standard: 1,
  premium: 1.12,
  custom: 1.18,
};

const optionPricing = {
  offgrid: 1200000,
  furniture: 800000,
  transport: 600000,
};

if (estimateForm && estimateResult) {
  estimateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(estimateForm);
    const model = formData.get('model');
    const usage = formData.get('usage');
    const finish = formData.get('finish');
    const options = formData.getAll('option');

    let total = modelPricing[model] || 0;
    total *= finishMultiplier[finish] || 1;
    options.forEach((opt) => {
      total += optionPricing[opt] || 0;
    });

    const optionList = options.length
      ? options
          .map((opt) => ({
            offgrid: 'オフグリッド強化',
            furniture: '家具・家電',
            transport: '輸送・設置',
          })[opt])
          .filter(Boolean)
          .join('／')
      : '追加なし';

    estimateResult.innerHTML = `
      <strong>概算金額:</strong> ¥${total.toLocaleString()}（税別）<br />
      <strong>モデル:</strong> ${model} / 用途: ${usage}<br />
      <strong>仕上げ:</strong> ${finish} / オプション: ${optionList}<br />
      <em>※既存サイトの表現に基づく暫定値です。最終見積は担当者よりご連絡します。</em>
    `;
  });

  const printButton = document.getElementById('estimate-print');
  printButton?.addEventListener('click', () => {
    window.print();
  });
}

const chatFab = document.getElementById('chat-fab');
if (chatFab) {
  chatFab.addEventListener('click', () => {
    document.getElementById('chatbot')?.scrollIntoView({ behavior: 'smooth' });
  });
}

const legacyStatus = document.getElementById('legacy-status');
const legacyContent = document.getElementById('legacy-content');

async function loadLegacyContent() {
  if (!legacyContent || !legacyStatus) return;
  try {
    const response = await fetch('reference-site.md', { cache: 'no-store' });
    const markdown = await response.text();
    legacyContent.innerHTML = markdownToHtml(markdown);
    legacyStatus.textContent = '旧サイトの写真・説明文を全件表示しています。';
  } catch (error) {
    legacyStatus.textContent = 'アーカイブの読み込みに失敗しました。';
    legacyContent.innerHTML = `<p>${error.message}</p>`;
  }
}

function markdownToHtml(md) {
  const blocks = md.replace(/\r\n/g, '\n').split(/\n{2,}/);
  return blocks
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      let html = block;
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
      html = html.replace(/!\[(.*?)\]\((.*?)\)/g, (_match, alt, src) => {
        const safeAlt = alt || 'Park Homes Image';
        return `<figure><img src="${src}" alt="${safeAlt}" loading="lazy" /><figcaption>${safeAlt}</figcaption></figure>`;
      });
      if (html.includes('<figure')) {
        return html;
      }
      return `<p>${html}</p>`;
    })
    .join('');
}

loadLegacyContent();
