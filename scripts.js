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
      <em>※旧サイトの表現を基にした暫定値です。最終見積は担当者よりご連絡します。</em>
    `;
  });

  document.getElementById('estimate-print')?.addEventListener('click', () => {
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
        const defaultAlt = 'Park Homes Okinawa トレーラーハウス写真';
        const safeAlt = alt && !/^Image\s*/i.test(alt) ? alt : defaultAlt;
        return `<figure><img src="${src}" alt="${safeAlt}" loading="lazy" /><figcaption>${safeAlt}</figcaption></figure>`;
      });
      if (html.includes('<figure')) {
        return html;
      }
      return `<p>${html}</p>`;
    })
    .join('');
}

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

function highlightKeywords(text = '', keywords = []) {
  return keywords.reduce((acc, keyword) => acc.replaceAll(keyword, `<strong>${keyword}</strong>`), text);
}

function renderCardGroup(targetId, entries = [], keywords = []) {
  const target = document.getElementById(targetId);
  if (!target || !entries.length) return;
  target.innerHTML = entries
    .map((entry) => {
      const body = highlightKeywords(entry.text || '', keywords);
      const image = entry.image
        ? `<figure><img src="${entry.image}" alt="${entry.imageAlt || ''}" loading="lazy" /></figure>`
        : '';
      return `
        <article class="content-card">
          ${image}
          <div>
            <h3>${entry.title || 'コンテンツ'}</h3>
            <p>${body || '詳細情報が準備中です。'}</p>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderFaq(targetId, entries = [], keywords = []) {
  const target = document.getElementById(targetId);
  if (!target || !entries.length) return;
  target.innerHTML = entries
    .map((entry) => {
      const question = entry.title || 'よくある質問';
      const answer = highlightKeywords(entry.text || '旧サイトの記載をご確認ください。', keywords);
      return `
        <details>
          <summary>${question}</summary>
          <p>${answer}</p>
        </details>
      `;
    })
    .join('');
}

function renderContact(targetId, entries = [], keywords = []) {
  const target = document.getElementById(targetId);
  if (!target || !entries.length) return;
  target.innerHTML = entries
    .map((entry) => {
      const body = highlightKeywords(entry.text || '', keywords);
      return `
        <article>
          <h4>${entry.title || 'お問い合わせ情報'}</h4>
          <p>${body}</p>
        </article>
      `;
    })
    .join('');
}

function renderGallery(entries = []) {
  const gallery = document.getElementById('gallery-grid');
  if (!gallery || !entries.length) return;
  gallery.innerHTML = entries
    .slice(0, 8)
    .map(
      (entry) => `
        <figure>
          <img src="${entry.image}" alt="${entry.imageAlt || entry.title}" loading="lazy" />
          <figcaption>${entry.title}</figcaption>
        </figure>
      `
    )
    .join('');
}

async function loadStructuredContent() {
  try {
    const response = await fetch('content/pairs.json', { cache: 'no-store' });
    const data = await response.json();
    const keywords = data.keywordHighlight || [];
    const groups = data.entries.reduce((acc, entry) => {
      if (!acc[entry.category]) acc[entry.category] = [];
      acc[entry.category].push(entry);
      return acc;
    }, {});

    renderGallery(data.entries.filter((entry) => entry.image));
    renderCardGroup('company-grid', groups.company || [], keywords);
    renderCardGroup('products-grid', groups.products || [], keywords);
    renderCardGroup('services-grid', groups.services || [], keywords);
    renderCardGroup('cases-grid', groups.cases || [], keywords);
    renderFaq('faq-list', groups.faq || [], keywords);
    renderContact('contact-grid', groups.contact || [], keywords);
  } catch (error) {
    console.error('コンテンツ生成に失敗しました', error);
  }
}

loadStructuredContent();
loadLegacyContent();
