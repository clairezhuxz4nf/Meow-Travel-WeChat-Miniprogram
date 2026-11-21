import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import { categories, days, expenseSeed, trip, typeLabels } from './data/trip.js';
import catReminder from './assets/visual/mascots/cat-reminder.png';
import catTraveler from './assets/visual/mascots/cat-traveler-map.png';
import catExpenses from './assets/visual/mascots/cat-expenses.png';
import catCamera from './assets/visual/mascots/cat-camera.png';
import catSuitcase from './assets/visual/mascots/cat-suitcase.png';
import iconTicket from './assets/visual/icons/utility/ticket.svg';
import iconMap from './assets/visual/icons/utility/map.svg';
import iconWallet from './assets/visual/icons/utility/wallet.svg';
import iconScenic from './assets/visual/icons/places/scenic.svg';
import iconFood from './assets/visual/icons/places/food.svg';
import iconShopping from './assets/visual/icons/places/shopping.svg';
import iconHotel from './assets/visual/icons/places/hotel.svg';
import iconTransport from './assets/visual/icons/places/transport.svg';
import pinOne from './assets/visual/pins/pin-1-coral.svg';
import pinTwo from './assets/visual/pins/pin-2-blue.svg';
import pinThree from './assets/visual/pins/pin-3-ochre.svg';
import pinHotel from './assets/visual/pins/pin-hotel.svg';
import pinTransport from './assets/visual/pins/pin-transport.svg';

const app = document.querySelector('#app');
const money = new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 });
const dayColors = ['#c86b4a', '#d99a51', '#c9a43d', '#789a78', '#5f948f'];
const typeIcons = { sight: '📍', food: '🍴', shopping: '🛍', hotel: 'M', transport: '✈' };
const tabCats = { today: catReminder, trip: catTraveler, expenses: catExpenses };
const placeIcons = { all: iconScenic, sight: iconScenic, food: iconFood, shopping: iconShopping, hotel: iconHotel, transport: iconTransport };
const numberedPins = [pinOne, pinTwo, pinThree];

const savedExpenses = JSON.parse(localStorage.getItem('miaoyou-expenses') || 'null');
const state = {
  tab: location.hash.replace('#', '') || 'today',
  todayDay: 1,
  cityId: 'paris',
  dayFilter: 'all',
  category: 'all',
  selectedPlace: null,
  showTickets: false,
  showExpenseForm: false,
  sheetExpanded: false,
  expenses: savedExpenses || expenseSeed
};

let map;
let mapLayer;

function cityById(id) {
  return trip.cities.find((city) => city.id === id);
}

function cityDays(id) {
  return days.filter((day) => day.cityId === id);
}

function getDay(number) {
  return days.find((day) => day.number === Number(number));
}

function fmtDate(value) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(`${value}T12:00:00`));
}

function googleMapsUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.coords.join(',')}`)}`;
}

function shell(content) {
  return `
    <div class="paper-noise"></div>
    <main class="app-shell">
      ${content}
    </main>
    <nav class="bottom-nav" aria-label="主要导航">
      ${[
        ['today', '今日'], ['trip', '行程'], ['expenses', '花费']
      ].map(([id, label]) => `
        <button class="nav-item ${state.tab === id ? 'active' : ''}" data-tab="${id}">
          <img class="nav-cat" src="${tabCats[id]}" alt="" /><span>${label}</span>
        </button>`).join('')}
    </nav>
    ${state.selectedPlace ? placeDrawer(state.selectedPlace) : ''}
    ${state.showTickets ? ticketWallet() : ''}
    ${state.showExpenseForm ? expenseForm() : ''}
  `;
}

function brandHeader({ eyebrow = trip.name, title, action = '' }) {
  return `
    <header class="brand-header">
      <div>
        <div class="brand-mark"><span class="cat-ear">⌃</span> 喵游 <small>MEOW TRIP</small></div>
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
      </div>
      ${action}
    </header>`;
}

function todayView() {
  const day = getDay(state.todayDay);
  const city = cityById(day.cityId);
  const ticketCount = day.items.filter((item) => item.ticket).length;
  const nextItem = day.items[0];
  return shell(`
    ${brandHeader({
      eyebrow: `${trip.subtitle} · ${trip.startDate.slice(0, 4)}`,
      title: '今日行程',
      action: `<label class="date-switch"><span>切换日期</span><select id="today-day-select">${days.map((d) => `<option value="${d.number}" ${d.number === day.number ? 'selected' : ''}>D${d.number} · ${d.label.split(' · ')[0]}</option>`).join('')}</select></label>`
    })}
    <section class="today-hero" style="--city-color:${city.color}">
      <img class="hero-cat" src="${catTraveler}" alt="背着背包看地图的喵游猫" />
      <p class="today-date">${fmtDate(day.date)} · ${city.name}</p>
      <h2><span class="marker-swash">欧洲大冒险</span></h2>
      <div class="city-trail">${trip.cities.map((item) => `<span class="${item.id === city.id ? 'current' : ''}">${item.name}</span>`).join('<i>→</i>')}</div>
      <div class="day-highlight"><span>D${day.number}</span><div><strong>${day.icon} ${day.title}</strong><small>${day.weather}</small></div></div>
    </section>
    <section class="reminder-card">
      <img class="reminder-cat" src="${catReminder}" alt="提醒猫" />
      <div><span class="kicker">NEXT REMINDER</span><h3>${nextItem.time} · ${nextItem.shortName}</h3><p>${nextItem.note || day.transit}</p></div>
      <span class="reminder-bell">🔔</span>
    </section>
    <section class="trip-glance">
      <button class="glance-card ticket-glance" data-open-tickets><img src="${iconTicket}" alt="" /><div><small>今日票券</small><strong>${ticketCount} 张</strong></div></button>
      <button class="glance-card map-glance" data-open-trip="${day.cityId}" data-day="${day.number}"><img src="${iconMap}" alt="" /><div><small>今日路线</small><strong>${day.items.length} 站</strong></div></button>
      <div class="glance-card budget-glance"><img src="${iconWallet}" alt="" /><div><small>旅行预算</small><strong>€5,200</strong></div><i><b></b></i></div>
    </section>
    <section class="section-card today-map-card">
      <div class="section-title"><div><span class="kicker">TODAY MAP</span><h3>${city.name} · 今日路线</h3></div><button class="text-button" data-open-trip="${day.cityId}" data-day="${day.number}">查看全图</button></div>
      <div id="today-map" class="map map-mini"></div>
    </section>
    <section class="section-card route-card">
      <div class="section-title"><div><span class="kicker">${day.items.length} STOPS</span><h3>时间线</h3></div></div>
      <div class="timeline">
        ${day.items.map((item, index) => itineraryRow(item, index, day)).join('')}
      </div>
    </section>
  `);
}

function itineraryRow(item, index, day) {
  return `
    <button class="timeline-row" data-place-day="${day.number}" data-place-index="${index}">
      <span class="timeline-time">${item.time}</span>
      <span class="timeline-node" style="--node:${cityById(day.cityId).color}">${typeIcons[item.type]}</span>
      <span class="timeline-copy"><strong>${item.shortName}</strong><small>${item.note || typeLabels[item.type]}</small></span>
      ${item.ticket ? `<span class="status-pill ${item.ticket.status}">${item.ticket.status === 'confirmed' ? '已订' : '待买'}</span>` : '<span class="chevron">›</span>'}
    </button>`;
}

function tripView() {
  const city = cityById(state.cityId);
  const localDays = cityDays(city.id);
  const selectedDay = state.dayFilter === 'all' ? null : getDay(state.dayFilter);
  const shownStops = selectedDay ? selectedDay.items : localDays.flatMap((day) => day.items);
  return shell(`
    <section class="map-page">
      <header class="map-topbar">
        <div class="city-dropdown-wrap">
          <span class="back-doodle">‹</span>
          <label><span class="sr-only">选择城市</span><select id="city-select">${trip.cities.map((c) => `<option value="${c.id}" ${c.id === city.id ? 'selected' : ''}>${c.name} · ${cityDays(c.id).length}天</option>`).join('')}</select></label>
        </div>
        <div class="map-actions"><label class="day-dropdown"><span class="sr-only">选择日期</span><select id="day-filter"><option value="all">全部日期</option>${localDays.map((d, i) => `<option value="${d.number}" ${String(d.number) === String(state.dayFilter) ? 'selected' : ''}>第 ${i + 1} 天 · ${d.label.split(' · ')[0]}</option>`).join('')}</select></label><span class="mini-program-pill">•••　◉</span></div>
      </header>
      <div class="category-strip" aria-label="地点分类">
        ${categories.map((category) => `<button class="category-chip ${state.category === category.id ? 'active' : ''}" data-category="${category.id}"><img src="${placeIcons[category.id]}" alt="" />${category.label}</button>`).join('')}
      </div>
      <div id="trip-map" class="map map-main"></div>
      <section class="route-sheet ${state.sheetExpanded ? 'expanded' : ''}">
        <button class="sheet-handle" data-toggle-sheet aria-label="展开或收起路线"><span></span></button>
        <div class="sheet-summary">
          <div><span class="kicker">${selectedDay ? `D${selectedDay.number} · ${selectedDay.label}` : city.dates}</span><h2>${selectedDay ? selectedDay.title : `${city.name}全段`}</h2></div>
          <button class="text-button" data-toggle-sheet>${state.sheetExpanded ? '收起' : '查看路线'}</button>
        </div>
        <div class="route-flow">
          ${shownStops.slice(0, state.sheetExpanded ? shownStops.length : 4).map((item, index) => `<button class="flow-stop" data-flow-place="${item.name}"><span class="flow-dot">${index + 1}</span><strong>${item.shortName}</strong><small>${item.time}</small></button>`).join('<span class="flow-arrow">→</span>')}
        </div>
        ${state.sheetExpanded ? `<div class="sheet-details">${localDays.map((day) => `<article class="day-block"><div class="day-block-head"><span>D${day.number}</span><div><strong>${day.title}</strong><small>${day.label} · ${day.items.length} 个地点</small></div></div>${day.items.map((item, index) => itineraryRow(item, index, day)).join('')}</article>`).join('')}</div>` : ''}
      </section>
    </section>
  `);
}

function expensesView() {
  const rates = { USD: 1, EUR: 1.08, CNY: 0.14 };
  const total = state.expenses.reduce((sum, item) => sum + item.amount * (rates[item.currency] || 1), 0);
  const grouped = state.expenses.reduce((result, item) => {
    (result[item.category] ||= []).push(item);
    return result;
  }, {});
  const categoryIcons = { 住宿: '🛏', 门票: '🎫', 餐饮: '🍴', 交通: '🚐', 购物: '🛍', 其他: '✦' };
  return shell(`
    ${brandHeader({ title: '团体花费', eyebrow: `${trip.name} · 共享账本`, action: '<button class="circle-action" data-add-expense aria-label="添加花费">＋</button>' })}
    <section class="expense-hero">
      <img class="expense-cat" src="${catExpenses}" alt="拿着计算器的喵游猫" />
      <span class="kicker">TRIP TOTAL · USD EST.</span>
      <div class="total-amount"><small>$</small>${money.format(total)}</div>
      <p>共 ${state.expenses.length} 笔 · 汇率为规划估算</p>
      <div class="balance-card"><span>Claire 先付</span><strong>$${money.format(total * .57)}</strong><i>Chase 应补约 $${money.format(total * .07)}</i></div>
    </section>
    <section class="category-grid">
      ${Object.entries(grouped).map(([category, items]) => {
        const subtotal = items.reduce((sum, item) => sum + item.amount * (rates[item.currency] || 1), 0);
        return `<article class="expense-category"><span>${categoryIcons[category] || '✦'}</span><small>${category}</small><strong>$${money.format(subtotal)}</strong><em>${items.length} 笔</em></article>`;
      }).join('')}
    </section>
    <section class="section-card expense-list-card">
      <div class="section-title"><div><span class="kicker">LEDGER</span><h3>记账明细</h3></div><button class="soft-button" data-add-expense>＋ 添加</button></div>
      <div class="expense-list">
        ${[...state.expenses].reverse().map((item) => `<article class="expense-row"><span class="expense-icon">${categoryIcons[item.category] || '✦'}</span><div><strong>${item.title}</strong><small>${item.payer} 支付 · ${item.split}</small></div><div class="expense-value"><strong>${item.currency === 'EUR' ? '€' : item.currency === 'CNY' ? '¥' : '$'}${money.format(item.amount)}</strong><small>${item.date.slice(5).replace('-', '/')}</small></div></article>`).join('')}
      </div>
    </section>
  `);
}

function placeDrawer(place) {
  return `
    <div class="overlay" data-close-overlay></div>
    <aside class="place-drawer">
      <button class="drawer-close" data-close-overlay>×</button>
      <div class="place-art ${place.type}"><img class="place-type-icon" src="${placeIcons[place.type]}" alt="" /><img class="place-mascot" src="${catCamera}" alt="拿相机的喵游猫" /><i></i><b></b></div>
      <span class="kicker">${typeLabels[place.type] || place.type}</span>
      <h2>${place.name}</h2>
      <p>${place.note || '已加入这次旅行的地点清单。'}</p>
      <div class="detail-meta"><span>🕒 ${place.time}</span>${place.ticket ? `<span>🎫 ${place.ticket.label} · ${place.ticket.price}</span>` : ''}</div>
      <a class="primary-button" href="${googleMapsUrl(place)}" target="_blank" rel="noreferrer">在 Google Maps 打开</a>
    </aside>`;
}

function ticketWallet() {
  const day = getDay(state.todayDay);
  const tickets = day.items.filter((item) => item.ticket);
  return `
    <div class="overlay" data-close-overlay></div>
    <aside class="full-panel">
      <header class="panel-header"><button data-close-overlay>‹</button><div><span class="kicker">TICKET WALLET</span><h2>今日票券</h2></div><span>${tickets.length} 张</span></header>
      <div class="ticket-stack">
        ${tickets.length ? tickets.map((item, index) => `<article class="ticket-card ${item.ticket.status}"><div class="ticket-top"><span>${item.ticket.status === 'confirmed' ? '✓ READY' : 'TO BUY'}</span><small>D${day.number} · ${item.time}</small></div><h3>${item.shortName}</h3><p>${item.ticket.label} · ${item.ticket.price}</p><div class="fake-code">${Array.from({ length: 28 }, (_, i) => `<i style="height:${10 + (i * 7) % 22}px"></i>`).join('')}</div></article>`).join('') : `<div class="empty-state"><img src="${catSuitcase}" alt="提着行李箱的喵游猫" /><h3>今天没有需要出示的票</h3><p>轻装上阵，去散步吧。</p></div>`}
      </div>
    </aside>`;
}

function expenseForm() {
  return `
    <div class="overlay" data-close-overlay></div>
    <aside class="form-sheet">
      <div class="sheet-handle"><span></span></div>
      <div class="section-title"><div><span class="kicker">NEW EXPENSE</span><h2>记一笔</h2></div><button class="drawer-close" data-close-overlay>×</button></div>
      <form id="expense-form">
        <label>花费名称<input name="title" required placeholder="例如：塞纳河游船" /></label>
        <div class="form-row"><label>金额<input name="amount" type="number" min="0" step="0.01" required placeholder="0" /></label><label>币种<select name="currency"><option>EUR</option><option>USD</option><option>CNY</option></select></label></div>
        <div class="form-row"><label>分类<select name="category"><option>餐饮</option><option>门票</option><option>交通</option><option>住宿</option><option>购物</option><option>其他</option></select></label><label>付款人<select name="payer"><option>Claire</option><option>Chase</option></select></label></div>
        <label>日期<input name="date" type="date" value="${trip.startDate}" /></label>
        <button class="primary-button" type="submit">保存到共享账本</button>
      </form>
    </aside>`;
}

function createMarkerIcon(item, dayNumber, active) {
  const day = getDay(dayNumber);
  const localNumber = cityDays(day.cityId).findIndex((itemDay) => itemDay.number === day.number) + 1;
  const color = active ? dayColors[(localNumber - 1) % dayColors.length] : '#a9aaa6';
  const asset = item.type === 'hotel' ? pinHotel : item.type === 'transport' ? pinTransport : numberedPins[localNumber - 1];
  const marker = asset
    ? `<img class="miaoyou-marker-asset ${active ? '' : 'muted'}" src="${asset}" alt="" />`
    : `<div class="miaoyou-marker ${active ? '' : 'muted'}" style="--pin:${color}"><span>${localNumber}</span></div>`;
  return L.divIcon({
    className: 'miaoyou-marker-wrap',
    html: `${marker}<div class="marker-label">${item.shortName}</div>`,
    iconAnchor: [18, 42]
  });
}

function initTodayMap() {
  const container = document.querySelector('#today-map');
  if (!container) return;
  const day = getDay(state.todayDay);
  setupMap(container, cityById(day.cityId), false);
  day.items.forEach((item) => addMarker(item, day.number, true));
  addRoute(day.items);
  fitItems(day.items);
}

function initTripMap() {
  const container = document.querySelector('#trip-map');
  if (!container) return;
  const city = cityById(state.cityId);
  setupMap(container, city, true);
  const localDays = cityDays(city.id);
  localDays.forEach((day) => {
    day.items.filter((item) => state.category === 'all' || item.type === state.category).forEach((item) => {
      const active = state.dayFilter === 'all' || Number(state.dayFilter) === day.number;
      addMarker(item, day.number, active);
    });
  });
  if (state.dayFilter !== 'all') addRoute(getDay(state.dayFilter).items);
}

function setupMap(container, city, controls) {
  if (map) { map.remove(); map = null; }
  map = L.map(container, { zoomControl: controls, attributionControl: true, dragging: true, scrollWheelZoom: false }).setView(city.center, city.zoom);
  mapLayer = L.layerGroup().addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
}

function addMarker(item, dayNumber, active) {
  const marker = L.marker(item.coords, { icon: createMarkerIcon(item, dayNumber, active), opacity: active ? 1 : .72 }).addTo(mapLayer);
  marker.on('click', () => { state.selectedPlace = item; render(); });
}

function addRoute(items) {
  if (items.length < 2) return;
  L.polyline(items.map((item) => item.coords), { color: '#c86b4a', weight: 3, opacity: .75, dashArray: '7 8', lineCap: 'round' }).addTo(mapLayer);
}

function fitItems(items) {
  if (items.length > 1) map.fitBounds(L.latLngBounds(items.map((item) => item.coords)), { padding: [36, 36] });
}

function resolvePlace(dayNumber, index) {
  return getDay(dayNumber)?.items[Number(index)];
}

function bindEvents() {
  document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => {
    state.tab = button.dataset.tab;
    location.hash = state.tab;
    render();
  }));
  document.querySelector('#today-day-select')?.addEventListener('change', (event) => { state.todayDay = Number(event.target.value); render(); });
  document.querySelector('#city-select')?.addEventListener('change', (event) => { state.cityId = event.target.value; state.dayFilter = 'all'; render(); });
  document.querySelector('#day-filter')?.addEventListener('change', (event) => { state.dayFilter = event.target.value; render(); });
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { state.category = button.dataset.category; render(); }));
  document.querySelectorAll('[data-place-day]').forEach((button) => button.addEventListener('click', () => { state.selectedPlace = resolvePlace(button.dataset.placeDay, button.dataset.placeIndex); render(); }));
  document.querySelectorAll('[data-open-trip]').forEach((button) => button.addEventListener('click', () => { state.tab = 'trip'; state.cityId = button.dataset.openTrip; state.dayFilter = button.dataset.day || 'all'; location.hash = 'trip'; render(); }));
  document.querySelectorAll('[data-open-tickets]').forEach((button) => button.addEventListener('click', () => { state.showTickets = true; render(); }));
  document.querySelectorAll('[data-close-overlay]').forEach((button) => button.addEventListener('click', () => { state.selectedPlace = null; state.showTickets = false; state.showExpenseForm = false; render(); }));
  document.querySelectorAll('[data-toggle-sheet]').forEach((button) => button.addEventListener('click', () => { state.sheetExpanded = !state.sheetExpanded; render(); }));
  document.querySelectorAll('[data-flow-place]').forEach((button) => button.addEventListener('click', () => {
    const item = cityDays(state.cityId).flatMap((day) => day.items).find((place) => place.name === button.dataset.flowPlace);
    state.selectedPlace = item; render();
  }));
  document.querySelectorAll('[data-add-expense]').forEach((button) => button.addEventListener('click', () => { state.showExpenseForm = true; render(); }));
  document.querySelector('#expense-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state.expenses.push({ id: Date.now(), title: form.get('title'), amount: Number(form.get('amount')), currency: form.get('currency'), category: form.get('category'), payer: form.get('payer'), split: '均分', date: form.get('date') });
    localStorage.setItem('miaoyou-expenses', JSON.stringify(state.expenses));
    state.showExpenseForm = false;
    render();
  });
}

function render() {
  const views = { today: todayView, trip: tripView, expenses: expensesView };
  app.innerHTML = (views[state.tab] || todayView)();
  bindEvents();
  requestAnimationFrame(() => {
    if (state.tab === 'today') initTodayMap();
    if (state.tab === 'trip') initTripMap();
  });
}

window.addEventListener('hashchange', () => {
  const tab = location.hash.replace('#', '');
  if (['today', 'trip', 'expenses'].includes(tab) && tab !== state.tab) { state.tab = tab; render(); }
});

if ('serviceWorker' in navigator && import.meta.env.PROD && location.hostname !== 'htmlpreview.github.io') {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
}

render();
