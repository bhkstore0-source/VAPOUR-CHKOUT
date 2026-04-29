// ══════════════════════════════════════════
//  BHK STORE — script.js
// ══════════════════════════════════════════

const PRODUCT_PRICE      = 2900;
const PRODUCT_NAME       = 'جهاز تنظيف وترطيب البشرة بالبخار - Osenjie';
const SCRIPT_URL         = 'https://script.google.com/macros/s/AKfycby9k67Izvu5mXKwS10hhuiiKZy_yIY-okcPWM-URLC7m5yWGjicKr7XimKbd_X0evKtxQ/exec';
const WHATSAPP_NUM       = '213553096569';
const RESTRICTED_WILAYAS = ['52', '56', '57'];

const HOME_PRICES = {
  "1":1100,"2":700,"3":900,"4":800,"5":800,
  "6":700,"7":900,"8":1100,"9":500,"10":650,
  "11":1300,"12":800,"13":800,"14":800,"15":650,
  "16":400,"17":900,"18":700,"19":700,"20":800,
  "21":700,"22":700,"23":700,"24":800,"25":700,
  "26":600,"27":700,"28":800,"29":700,"30":1000,
  "31":700,"32":1000,"33":1300,"34":700,"35":600,
  "36":800,"37":1300,"38":800,"39":900,"40":800,
  "41":800,"42":600,"43":700,"44":600,"45":1000,
  "46":700,"47":1000,"48":700,"49":1300,
  "51":900,"52":1300,"53":1400,"55":900,
  "56":1400,"57":900,"58":1000
};

const OFFICE_PRICES = {
  "1":600,"2":400,"3":500,"4":400,"5":400,
  "6":400,"7":500,"8":600,"9":250,"10":400,
  "11":800,"12":500,"13":400,"14":400,"15":400,
  "16":200,"17":500,"18":400,"19":400,"20":400,
  "21":400,"22":400,"23":400,"24":400,"25":400,
  "26":400,"27":400,"28":500,"29":400,"30":500,
  "31":400,"32":500,"33":600,"34":400,"35":350,
  "36":400,"37":600,"38":400,"39":500,"40":500,
  "41":500,"42":350,"43":400,"44":400,"45":500,
  "46":400,"47":500,"48":400,"49":600,
  "51":500,"52":0,"53":600,"55":500,
  "56":0,"57":0,"58":500
};

let selectedDelivery = 'home';
let communeData      = {};

// ══════════════════════════════════════════
function loadCommunes(type) {
  const file = type === 'home' ? 'communes.json' : 'communes stopdesk.json';
  return fetch(file)
    .then(r => r.json())
    .then(data => { communeData = data; });
}

// ══════════════════════════════════════════
// تغيير نوع التوصيل — ما يصفرش الولاية ولا البلدية
function selectDelivery(type) {
  selectedDelivery = type;

  document.getElementById('homeBox').classList.toggle('active',   type === 'home');
  document.getElementById('officeBox').classList.toggle('active', type === 'office');

  const w = document.getElementById('wilayaSelect').value;

  if (w) {
    // عبّي البلديات من الملف الجديد بدون ما تمسح الولاية
    loadCommunes(type).then(() => {
      const currentCommune = document.getElementById('communeSelect').value;
      fillCommunes(w);
      // حاول تحافظ على البلدية المختارة إذا كانت متوفرة في النوع الجديد
      const cSelect = document.getElementById('communeSelect');
      if (currentCommune && [...cSelect.options].some(o => o.value === currentCommune)) {
        cSelect.value = currentCommune;
      }
      updateTotal();
    });
  } else {
    updateTotal();
  }
}

// ══════════════════════════════════════════
function fillCommunes(w) {
  const cSelect = document.getElementById('communeSelect');
  cSelect.innerHTML = '<option value="">اختر</option>';
  (communeData[w] || []).forEach(name => {
    const o = document.createElement('option');
    o.value = name; o.textContent = name;
    cSelect.appendChild(o);
  });
}

// ══════════════════════════════════════════
// تغيير الولاية — يعبّي البلديات ويحدث الأسعار
function updateCommunes() {
  const w         = document.getElementById('wilayaSelect').value;
  const officeBox = document.getElementById('officeBox');

  const isRestricted = RESTRICTED_WILAYAS.includes(w);
  if (isRestricted) {
    officeBox.style.display = 'none';
    if (selectedDelivery === 'office') {
      selectedDelivery = 'home';
      document.getElementById('homeBox').classList.add('active');
      document.getElementById('officeBox').classList.remove('active');
    }
  } else {
    officeBox.style.display = '';
  }

  loadCommunes(selectedDelivery).then(() => {
    fillCommunes(w);
    updateTotal();
  });
}

// ══════════════════════════════════════════
function updateTotal() {
  const w           = document.getElementById('wilayaSelect').value;
  const homePrice   = (w !== '' && HOME_PRICES[w]   !== undefined) ? HOME_PRICES[w]   : null;
  const officePrice = (w !== '' && OFFICE_PRICES[w] !== undefined) ? OFFICE_PRICES[w] : null;

  const prices   = selectedDelivery === 'home' ? HOME_PRICES : OFFICE_PRICES;
  const delivery = (w !== '' && prices[w] !== undefined) ? prices[w] : null;
  const total    = delivery !== null ? PRODUCT_PRICE + delivery : null;

  // labels الكارتات
  const homeLbl   = document.getElementById('homePriceLabel');
  const officeLbl = document.getElementById('officePriceLabel');

  if (homeLbl) {
    if (homePrice === null)   homeLbl.textContent = 'اختر الولاية';
    else if (homePrice === 0) homeLbl.textContent = 'مجانا 🎁';
    else                      homeLbl.textContent = homePrice.toLocaleString() + ' دج';
  }
  if (officeLbl) {
    if (officePrice === null)   officeLbl.textContent = 'اختر الولاية';
    else if (officePrice === 0) officeLbl.textContent = 'مجانا 🎁';
    else                        officeLbl.textContent = officePrice.toLocaleString() + ' دج';
  }

  // ملخص الطلبية
  const pp   = document.getElementById('productPrice');
  const dp   = document.getElementById('deliveryPrice');
  const tp   = document.getElementById('totalPrice');
  const hint = document.getElementById('deliveryHint');

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
      if (hint) hint.classList.remove('visible');
    }
  }

  if (tp) tp.textContent = total !== null ? total.toLocaleString() + ' دج' : '—';
}

// ══════════════════════════════════════════
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

  const fullWilaya = wilayaSel.options[wilayaSel.selectedIndex].text;
  const wParts     = fullWilaya.split('-');
  const wilayaNum  = wParts[0] ? String(parseInt(wParts[0].trim(), 10)) : w;
  const wilayaName = wParts[1] ? wParts[1].trim() : fullWilaya;

  const btn = document.getElementById('submitBtn');
  btn.disabled      = true;
  btn.innerText     = '⏳ جاري إرسال الطلب...';
  btn.style.opacity = '0.6';

  const payload = JSON.stringify({
    product:        PRODUCT_NAME,
    name:           name,
    phone:          phone,
    wilaya_num:     wilayaNum,
    wilaya_name:    wilayaName,
    commune:        commune,
    delivery_type:  selectedDelivery === 'home' ? 'توصيل للمنزل' : 'توصيل للمكتب',
    delivery_price: String(delivery),
    total:          String(total)
  });

  const xhr = new XMLHttpRequest();
  xhr.open('POST', SCRIPT_URL, true);
  xhr.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');

  const onSuccess = () => {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Purchase', { value: total, currency: 'DZD', content_name: PRODUCT_NAME });
    }
    const modal = document.getElementById('successModal');
    if (modal) { modal.classList.add('show'); modal.style.display = 'flex'; }
    btn.disabled      = false;
    btn.innerText     = 'تأكيد الطلب 🛒';
    btn.style.opacity = '1';
  };

  xhr.onload  = onSuccess;
  xhr.onerror = onSuccess;
  xhr.send(payload);
}

// ══════════════════════════════════════════
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) { modal.classList.remove('show'); modal.style.display = 'none'; }
  const msg = 'شكراً على تعاملكم معنا. يرجى التواصل معنا من أجل أي استفسار بخصوص طلبك الأخير.';
  window.open('https://wa.me/' + WHATSAPP_NUM + '?text=' + encodeURIComponent(msg), '_blank');
  setTimeout(() => location.reload(), 1000);
}

// ══════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  loadCommunes('home');
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
