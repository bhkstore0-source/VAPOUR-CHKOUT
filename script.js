// ══════════════════════════════════════════
//  BHK STORE — script.js
// ══════════════════════════════════════════

const PRODUCT_PRICE      = 12000;
const PRODUCT_NAME       = 'جهاز IPL لإزالة الشعر — 1,000,000 ومضة';
const SCRIPT_URL         = 'https://script.google.com/macros/s/AKfycby_UTUdy5TboREqQHsXlkqb02mxZGpbeRkQ5wHG2ymBdcSSAdDNThy7X3mqND7KpKqF7g/exec';
const WHATSAPP_NUM       = '213553096569';
const RESTRICTED_WILAYAS = ['52', '56', '57'];

// ── أسعار التوصيل للمنزل (دج)
const HOME_PRICES = {
  "1":1200,"2":600,"3":800,"4":700,"5":700,
  "6":600,"7":800,"8":1200,"9":400,"10":600,
  "11":1500,"12":800,"13":700,"14":700,"15":600,
  "16":400,"17":800,"18":600,"19":700,"20":700,
  "21":600,"22":700,"23":600,"24":700,"25":600,
  "26":600,"27":600,"28":700,"29":700,"30":1000,
  "31":500,"32":900,"33":1400,"34":600,"35":500,
  "36":600,"37":1400,"38":700,"39":900,"40":800,
  "41":700,"42":500,"43":700,"44":600,"45":900,
  "46":600,"47":900,"48":700,"49":1300,
  "51":800,"52":1300,"53":1400,"55":900,
  "56":1400,"57":900,"58":1000
};

// ── أسعار التوصيل للمكتب (دج)
const OFFICE_PRICES = {
  "1":900,"2":400,"3":600,"4":500,"5":500,
  "6":400,"7":600,"8":1000,"9":250,"10":400,
  "11":1200,"12":600,"13":500,"14":500,"15":400,
  "16":250,"17":600,"18":400,"19":500,"20":500,
  "21":400,"22":500,"23":400,"24":500,"25":400,
  "26":400,"27":400,"28":500,"29":500,"30":800,
  "31":300,"32":700,"33":1200,"34":400,"35":300,
  "36":400,"37":1200,"38":500,"39":700,"40":600,
  "41":500,"42":300,"43":500,"44":400,"45":700,
  "46":400,"47":700,"48":500,"49":1100,
  "51":600,"52":1100,"53":1200,"55":700,
  "56":1200,"57":700,"58":800
};

let selectedDelivery = 'home';
let communeData      = {};

// تحميل البلديات
fetch('communes.json')
  .then(r => r.json())
  .then(data => { communeData = data; });

// ── اختيار نوع التوصيل
function selectDelivery(type) {
  selectedDelivery = type;
  document.getElementById('homeBox').classList.toggle('active',   type === 'home');
  document.getElementById('officeBox').classList.toggle('active', type === 'office');
  updateTotal();
}

// ── تحديث البلديات
function updateCommunes() {
  const w         = document.getElementById('wilayaSelect').value;
  const cSelect   = document.getElementById('communeSelect');
  const officeBox = document.getElementById('officeBox');

  cSelect.innerHTML = '<option value="">اختر البلدية</option>';
  (communeData[w] || []).forEach(name => {
    const o = document.createElement('option');
    o.value = name; o.textContent = name;
    cSelect.appendChild(o);
  });

  // إخفاء المكتب للولايات المقيدة
  if (RESTRICTED_WILAYAS.includes(w)) {
    officeBox.style.display = 'none';
    selectDelivery('home');
  } else {
    officeBox.style.display = 'flex';
  }
  updateTotal();
}

// ── تحديث ملخص السعر
function updateTotal() {
  const w        = document.getElementById('wilayaSelect').value;
  const prices   = selectedDelivery === 'home' ? HOME_PRICES : OFFICE_PRICES;
  const delivery = w !== '' && prices[w] !== undefined ? prices[w] : null;
  const total    = delivery !== null ? PRODUCT_PRICE + delivery : null;

  const pp    = document.getElementById('productPrice');
  const dp    = document.getElementById('deliveryPrice');
  const tp    = document.getElementById('totalPrice');
  const hint  = document.getElementById('deliveryHint');

  if (pp) pp.textContent = PRODUCT_PRICE.toLocaleString();

  if (dp) {
    if (delivery === null) {
      dp.textContent = 'اختر الولاية';
      dp.style.color = '#aaa';
      if (hint) { hint.textContent = 'اختر الولاية لمعرفة سعر التوصيل'; hint.classList.add('visible'); }
    } else if (delivery === 0) {
      dp.innerHTML   = 'مجانا 🎁';
      dp.style.color = '#27ae60';
      if (hint) hint.classList.remove('visible');
    } else {
      dp.textContent = delivery.toLocaleString() + ' دج';
      dp.style.color = '#e74c3c';
      if (hint) { hint.textContent = '🏠 منزل: ' + (HOME_PRICES[w]||0).toLocaleString() + ' دج   |   📦 مكتب: ' + (OFFICE_PRICES[w]||0).toLocaleString() + ' دج'; hint.classList.add('visible'); }
    }
  }

  if (tp) tp.textContent = total !== null ? total.toLocaleString() + ' دج' : '—';
}

// ── إرسال الطلب
function finalSubmit() {
  const name      = document.getElementById('cust_name').value.trim();
  const phone     = document.getElementById('phoneInput').value.trim();
  const wilayaSel = document.getElementById('wilayaSelect');
  const commune   = document.getElementById('communeSelect').value;
  const regex     = /^0[567][0-9]{8}$/;

  if (!name)              return alert('اكتب الاسم من فضلك');
  if (!regex.test(phone)) return alert('رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 05 أو 06 أو 07');
  if (!wilayaSel.value)   return alert('إختر الولاية من فضلك');
  if (!commune)           return alert('إختر البلدية من فضلك');

  const w        = wilayaSel.value;
  const prices   = selectedDelivery === 'home' ? HOME_PRICES : OFFICE_PRICES;
  const delivery = prices[w] !== undefined ? prices[w] : 0;
  const total    = PRODUCT_PRICE + delivery;

  const btn = document.getElementById('submitBtn');
  btn.disabled      = true;
  btn.innerText     = '⏳ جاري إرسال الطلب...';
  btn.style.opacity = '0.6';

  const formData = {
    product:        PRODUCT_NAME,
    name,
    phone,
    wilaya:         wilayaSel.options[wilayaSel.selectedIndex].text,
    commune,
    delivery_type:  selectedDelivery === 'home' ? 'توصيل للمنزل' : 'توصيل للمكتب',
    delivery_price: delivery > 0 ? delivery.toLocaleString() + ' دج' : 'مجانا',
    total:          total.toLocaleString() + ' دج'
  };

  fetch(SCRIPT_URL, {
    method:  'POST',
    mode:    'no-cors',
    cache:   'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(formData)
  })
  .then(() => {
    const modal = document.getElementById('successModal');
    if (modal) { modal.classList.add('show'); modal.style.display = 'flex'; }
    btn.disabled      = false;
    btn.innerText     = 'تأكيد الطلب';
    btn.style.opacity = '1';
  })
  .catch(() => {
    alert('حدث خطأ، حاول مرة أخرى');
    btn.disabled      = false;
    btn.innerText     = 'تأكيد الطلب';
    btn.style.opacity = '1';
  });
}

// ── إغلاق مودال النجاح + واتساب
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) { modal.classList.remove('show'); modal.style.display = 'none'; }
  const msg = 'شكراً على تعاملكم معنا. يرجى التواصل معنا من أجل أي استفسار بخصوص طلبك الأخير.';
  window.open('https://wa.me/' + WHATSAPP_NUM + '?text=' + encodeURIComponent(msg), '_blank');
  setTimeout(() => location.reload(), 1000);
}

// ── تهيئة عند التحميل
window.addEventListener('DOMContentLoaded', () => {
  updateTotal();

  const ph = document.getElementById('phoneInput');
  if (ph) {
    ph.addEventListener('keypress', e => { if (!/[0-9]/.test(e.key)) e.preventDefault(); });
    ph.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '').substring(0, 10);
    });
  }

  document.getElementById('wilayaSelect').addEventListener('change', updateCommunes);
});
