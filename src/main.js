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
const itineraryStorageKey = 'miaoyou-itinerary-v2';

const savedExpenses = JSON.parse(localStorage.getItem('miaoyou-expenses') || 'null');
const savedItinerary = JSON.parse(localStorage.getItem(itineraryStorageKey) || 'null');
if (savedItinerary) {
  days.forEach((day) => {
    if (Array.isArray(savedItinerary[day.number])) day.items = savedItinerary[day.number];
  });
}
// This seed entry used an approximate pin and is known not to resolve reliably in Google Maps.
days.forEach((day) => day.items.forEach((item) => {
  if (item.name === 'Café Marly' && !item.address) item.locationStatus = 'missing';
}));
const state = {
  tab: location.hash.replace('#', '') || 'today',
  todayDay: 1,
  cityId: 'paris',
  dayFilter: 'all',
  category: 'all',
  selectedPlace: null,
  showTickets: false,
  showExpenseForm: false,
  showAddPlace: false,
  addPlaceMode: 'manual',
  addDayNumber: null,
  placeSearchQuery: '',
  placeSearchResults: [],
  placeSearchStatus: '',
  selectedSearchResult: null,
  repairPlace: null,
  deletePlaceArmed: false,
  aiImageFile: null,
  aiImageUrl: '',
  aiRecognizedText: '',
  aiStatus: '',
  aiResults: [],
  aiWorking: false,
  sheetExpanded: false,
  expenses: savedExpenses || expenseSeed
};

let map;
let mapLayer;
let searchTimer;
let searchController;

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

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function persistItinerary() {
  localStorage.setItem(itineraryStorageKey, JSON.stringify(Object.fromEntries(days.map((day) => [day.number, day.items]))));
}

function placeWithDay(place, dayNumber) {
  return { ...place, _dayNumber: Number(dayNumber) };
}

function resetAddPlace() {
  state.showAddPlace = false;
  state.placeSearchQuery = '';
  state.placeSearchResults = [];
  state.placeSearchStatus = '';
  state.selectedSearchResult = null;
  state.repairPlace = null;
  state.aiRecognizedText = '';
  state.aiStatus = '';
  state.aiResults = [];
  state.aiWorking = false;
  state.aiImageFile = null;
  if (state.aiImageUrl) URL.revokeObjectURL(state.aiImageUrl);
  state.aiImageUrl = '';
}

function samePlace(item, place) {
  if (!item || !place) return false;
  return place.id
    ? item.id === place.id
    : item.name === place.name && item.coords?.join(',') === place.coords?.join(',');
}

function findPlaceIndex(day, place) {
  return day?.items.findIndex((item) => samePlace(item, place)) ?? -1;
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
    ${state.showAddPlace ? addPlaceSheet() : ''}
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
        <div class="map-actions"><label class="day-dropdown"><span class="sr-only">选择日期</span><select id="day-filter"><option value="all">全部日期</option>${localDays.map((d, i) => `<option value="${d.number}" ${String(d.number) === String(state.dayFilter) ? 'selected' : ''}>第 ${i + 1} 天 · ${d.label.split(' · ')[0]}</option>`).join('')}</select></label><button class="add-place-button" data-add-place aria-label="添加地点">＋</button></div>
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
  const sourceDay = getDay(place._dayNumber);
  const movableDays = sourceDay ? cityDays(sourceDay.cityId) : [];
  const locationMissing = place.locationStatus === 'missing' || !Array.isArray(place.coords) || place.coords.length !== 2;
  return `
    <div class="overlay" data-close-overlay></div>
    <aside class="place-drawer">
      <button class="drawer-close" data-close-overlay>×</button>
      <div class="place-art ${place.type}"><img class="place-type-icon" src="${placeIcons[place.type]}" alt="" /><img class="place-mascot" src="${catCamera}" alt="拿相机的喵游猫" /><i></i><b></b></div>
      <span class="kicker">${typeLabels[place.type] || place.type}</span>
      <h2>${place.name}</h2>
      <p>${place.note || '已加入这次旅行的地点清单。'}</p>
      <div class="detail-meta"><span>🕒 ${place.time}</span>${place.ticket ? `<span>🎫 ${place.ticket.label} · ${place.ticket.price}</span>` : ''}</div>
      ${locationMissing ? `<div class="location-warning"><strong>⚠ 地址缺失</strong><span>当前坐标未通过地图搜索确认，请重新搜索后再导航。</span></div>` : place.address ? `<div class="verified-address"><span>✓ 已确认地址</span><strong>${escapeHtml(place.address)}</strong></div>` : ''}
      ${sourceDay ? `<label class="move-day-control"><span>调整到其他日期</span><select id="move-place-day">${movableDays.map((day, index) => `<option value="${day.number}" ${day.number === sourceDay.number ? 'selected' : ''}>第 ${index + 1} 天 · ${day.label.split(' · ')[0]}</option>`).join('')}</select></label>` : ''}
      <div class="place-edit-actions">
        <button class="secondary-button" data-repair-place>${locationMissing ? '重新搜索并确认地址' : '编辑地点与坐标'}</button>
        <button class="danger-button ${state.deletePlaceArmed ? 'armed' : ''}" data-delete-place>${state.deletePlaceArmed ? '再次点击确认删除' : '删除地点与坐标'}</button>
      </div>
      ${locationMissing ? '<button class="primary-button disabled-button" type="button" disabled>确认地址后开启导航</button>' : `<a class="primary-button" href="${googleMapsUrl(place)}" target="_blank" rel="noreferrer">在 Google Maps 打开</a>`}
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

function placeDetailsForm({ name = '', note = '' } = {}) {
  const targetDay = getDay(state.addDayNumber);
  return `
    <form id="add-place-form" class="place-details-form">
      <label>地点名称<input name="placeName" required value="${escapeHtml(name)}" placeholder="例如：锡耶纳大教堂" /></label>
      <div class="form-row">
        <label>类别<select name="type">${categories.filter((category) => category.id !== 'all').map((category) => `<option value="${category.id}" ${state.repairPlace?.type === category.id ? 'selected' : ''}>${category.label}</option>`).join('')}</select></label>
        <label>时间<input name="time" type="time" value="${state.repairPlace?.time || '12:00'}" required /></label>
      </div>
      <label>备注<input name="note" value="${escapeHtml(note)}" placeholder="预约信息、想看的重点……" /></label>
      <button class="primary-button" type="submit">${state.repairPlace ? '保存并确认正确坐标' : `加入${targetDay ? `第 ${cityDays(targetDay.cityId).findIndex((day) => day.number === targetDay.number) + 1} 天` : '当天'}行程`}</button>
    </form>`;
}

function aiImportPanel() {
  const matchedCount = state.aiResults.filter((result) => result.matched).length;
  return `
    <section class="ai-import-panel">
      <label class="ai-upload ${state.aiImageUrl ? 'has-image' : ''}">
        <input id="ai-image-input" type="file" accept="image/png,image/jpeg,image/webp" />
        ${state.aiImageUrl ? `<img src="${state.aiImageUrl}" alt="待识别的旅行截图" />` : '<span class="ai-upload-icon">▧</span><strong>上传旅行截图</strong><small>支持小红书、攻略笔记或聊天截图</small>'}
      </label>
      <p class="ai-privacy">图片仅在浏览器内识别；识别出的地点名称会发送到 OpenStreetMap 匹配坐标。</p>
      <button class="primary-button" type="button" data-run-ai ${!state.aiImageFile || state.aiWorking ? 'disabled' : ''}>${state.aiWorking ? '正在识别与匹配…' : '识别截图中的地点'}</button>
      <div class="ai-status" aria-live="polite">${escapeHtml(state.aiStatus)}</div>
      ${state.aiResults.length ? `
        <div class="ai-results-head"><div><strong>识别结果</strong><span>${matchedCount}/${state.aiResults.length} 个已匹配坐标</span></div><button type="button" data-ai-select-all>全选已匹配</button></div>
        <form id="ai-results-form" class="ai-results-list">
          ${state.aiResults.map((result, index) => `
            <article class="ai-result ${result.matched ? 'matched' : 'unmatched'}">
              <input class="ai-result-check" type="checkbox" name="selected-${index}" ${result.matched && result.selected ? 'checked' : ''} ${result.matched ? '' : 'disabled'} aria-label="选择 ${escapeHtml(result.name)}" />
              <div class="ai-result-copy"><strong>${escapeHtml(result.name)}</strong><small>${escapeHtml(result.matched ? result.address : '未找到坐标，请改用手动添加')}</small></div>
              <span class="ai-match-status">${result.matched ? '已匹配' : '待确认'}</span>
            </article>`).join('')}
          <button class="primary-button" type="submit" ${matchedCount ? '' : 'disabled'}>批量加入地图（${matchedCount}）</button>
        </form>` : ''}
    </section>`;
}

function addPlaceSheet() {
  const localDays = cityDays(state.cityId);
  const targetDayNumber = state.addDayNumber || (state.dayFilter === 'all' ? localDays[0]?.number : Number(state.dayFilter));
  state.addDayNumber = targetDayNumber;
  const selected = state.selectedSearchResult;
  return `
    <div class="overlay" data-close-overlay></div>
    <aside class="form-sheet add-place-sheet">
      <div class="sheet-handle"><span></span></div>
      <div class="section-title add-place-title"><div><span class="kicker">ADD A PLACE</span><h2>${state.repairPlace ? '修复地点' : '添加地点'}</h2></div><button class="drawer-close" data-close-overlay>×</button></div>
      ${state.repairPlace ? `<div class="repair-context"><span>正在修复</span><strong>${escapeHtml(state.repairPlace.name)}</strong><small>重新搜索并确认准确地点，原来的日期会保留。</small></div>` : `
        <div class="add-mode-tabs" role="tablist">
          <button class="${state.addPlaceMode === 'manual' ? 'active' : ''}" data-add-mode="manual">手动添加</button>
          <button class="${state.addPlaceMode === 'ai' ? 'active' : ''}" data-add-mode="ai">AI 识别</button>
        </div>`}
      <label class="add-day-select">${state.repairPlace ? '所在日期' : '加入哪一天'}<select id="add-place-day" ${state.repairPlace ? 'disabled' : ''}>${localDays.map((day, index) => `<option value="${day.number}" ${day.number === Number(targetDayNumber) ? 'selected' : ''}>第 ${index + 1} 天 · ${day.label.split(' · ')[0]}</option>`).join('')}</select></label>
      ${state.addPlaceMode === 'manual' || state.repairPlace ? `
        <div class="place-search-wrap">
          <label>搜索地点<input id="place-search-input" value="${escapeHtml(state.placeSearchQuery)}" placeholder="输入名称或关键词，如：锡耶纳大" autocomplete="off" /></label>
          <p class="search-helper">先搜索并选择真实地点，再补充类别、时间和备注。</p>
          <div class="search-status">${escapeHtml(state.placeSearchStatus)}</div>
          <div class="search-results">
            ${state.placeSearchResults.map((result, index) => `<button data-place-result="${index}"><img src="${placeIcons.sight}" alt="" /><span><strong>${escapeHtml(result.name)}</strong><small>${escapeHtml(result.address)}</small></span></button>`).join('')}
          </div>
        </div>
        ${selected ? `<div class="selected-search-place"><span>已选择真实地点</span><strong>${escapeHtml(selected.name)}</strong><small>${escapeHtml(selected.address)}</small></div>${placeDetailsForm({ name: selected.name, note: state.repairPlace?.note || '' })}` : ''}
      ` : aiImportPanel()}
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
  marker.on('click', () => { state.selectedPlace = placeWithDay(item, dayNumber); render(); });
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

function findPlaceInCity(name) {
  for (const day of cityDays(state.cityId)) {
    const place = day.items.find((item) => item.name === name);
    if (place) return placeWithDay(place, day.number);
  }
  return null;
}

function updateSearchStatus(message) {
  state.placeSearchStatus = message;
  const status = document.querySelector('.search-status');
  if (status) status.textContent = message;
}

async function searchPlaces(query) {
  const keyword = query.trim();
  state.placeSearchQuery = query;
  state.selectedSearchResult = null;
  if (keyword.length < 2) {
    state.placeSearchResults = [];
    updateSearchStatus('再输入一点关键词');
    return;
  }

  searchController?.abort();
  searchController = new AbortController();
  const normalizedKeyword = keyword.toLocaleLowerCase().replace(/\s+/g, '');
  const localResults = [];
  const seenLocal = new Set();
  days.forEach((day) => day.items.forEach((item) => {
    const searchableName = `${item.name}${item.shortName || ''}`.toLocaleLowerCase().replace(/\s+/g, '');
    const key = `${item.name}-${item.coords?.join(',')}`;
    if (item.locationStatus !== 'missing' && searchableName.includes(normalizedKeyword) && !seenLocal.has(key)) {
      seenLocal.add(key);
      localResults.push({ name: item.name, address: `喵游地点库 · D${day.number} ${day.label}${item.note ? ` · ${item.note}` : ''}`, coords: item.coords.map(Number) });
    }
  }));
  state.placeSearchResults = localResults.slice(0, 4);
  state.placeSearchStatus = localResults.length ? '已从行程地点库匹配，正在查找更多…' : '正在匹配地点…';
  render();
  try {
    const params = new URLSearchParams({ format: 'jsonv2', limit: '6', 'accept-language': 'zh-CN', countrycodes: 'it,fr,es', q: keyword });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal: searchController.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const results = await response.json();
    const onlineResults = results.map((result) => ({
      name: result.name || result.display_name.split(',')[0],
      address: result.display_name,
      coords: [Number(result.lat), Number(result.lon)]
    }));
    const merged = [...localResults, ...onlineResults].filter((result, index, array) => array.findIndex((item) => item.coords.join(',') === result.coords.join(',')) === index);
    state.placeSearchResults = merged.slice(0, 6);
    state.placeSearchStatus = state.placeSearchResults.length ? `找到 ${state.placeSearchResults.length} 个地点` : '没有找到，试试更完整的名称';
    render();
  } catch (error) {
    if (error.name === 'AbortError') return;
    state.placeSearchResults = localResults.slice(0, 4);
    state.placeSearchStatus = localResults.length ? '已显示行程地点库结果；在线搜索暂时不可用' : '在线地点搜索暂时不可用，请稍后重试';
    render();
  }
}

function updateAIStatus(message) {
  state.aiStatus = message;
  const status = document.querySelector('.ai-status');
  if (status) status.textContent = message;
}

function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-tesseract]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Tesseract), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.crossOrigin = 'anonymous';
    script.dataset.tesseract = 'true';
    script.onload = () => resolve(window.Tesseract);
    script.onerror = reject;
    document.head.append(script);
  });
}

function extractPlaceCandidates(text) {
  const candidates = [];
  const seen = new Set();
  const add = (name, query = name) => {
    const cleanedName = String(name).replace(/^[\d\s.、·:：-]+|[\s:：,，。；;]+$/g, '').trim();
    const cleanedQuery = String(query).replace(/[（(][^）)]*[）)]/g, '').trim();
    if (cleanedName.length < 2 || cleanedName.length > 48 || /^(行程|时间|路线|出发|回程|午餐|晚餐|景点|安排|亮点)/.test(cleanedName)) return;
    const key = cleanedName.toLocaleLowerCase().replace(/\s+/g, '');
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({ name: cleanedName, query: cleanedQuery || cleanedName });
  };

  const bilingual = /([\u3400-\u9fff]{2,16})\s*[（(]([A-Za-z][A-Za-z\s.'’\-]{2,48})[）)]/g;
  for (const match of text.matchAll(bilingual)) add(match[1], match[2]);

  text.split(/\n+/).forEach((line) => {
    const normalized = line.replace(/[🏡🏰🌹🌾🌳⏰🕰️👉👇❤️🍕🍷]/gu, ' ').trim();
    const numbered = normalized.match(/^\s*\d+[.、]\s*(.+)$/);
    if (!numbered) return;
    numbered[1].split(/\s*[-→]\s*/).forEach((segment) => {
      const candidate = segment
        .replace(/[（(][^）)]*[）)]/g, '')
        .split(/路程|游玩|拍照|打卡|时间|约\s*\d/)[0]
        .trim();
      if (/教堂|广场|宫|馆|公园|农庄|Farmhouse|Poggio|Siena|Pienza|Firenze/i.test(candidate)) add(candidate);
    });
  });
  return candidates.slice(0, 8);
}

async function geocodeAIPlace(candidate) {
  try {
    const params = new URLSearchParams({ format: 'jsonv2', limit: '1', 'accept-language': 'zh-CN', countrycodes: 'it,fr,es', q: candidate.query });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const [result] = await response.json();
    if (!result) return { ...candidate, matched: false, selected: false };
    return {
      ...candidate,
      name: candidate.name || result.name || result.display_name.split(',')[0],
      address: result.display_name,
      coords: [Number(result.lat), Number(result.lon)],
      matched: true,
      selected: true
    };
  } catch {
    return { ...candidate, matched: false, selected: false };
  }
}

async function recognizeAIImage() {
  if (!state.aiImageFile || state.aiWorking) return;
  state.aiWorking = true;
  state.aiResults = [];
  updateAIStatus('正在载入本地文字识别模型…');
  render();
  let worker;
  try {
    const Tesseract = await loadTesseract();
    worker = await Tesseract.createWorker('chi_sim+eng', 1, {
      logger: (progress) => {
        if (progress.status === 'recognizing text') updateAIStatus(`正在识别截图文字 ${Math.round((progress.progress || 0) * 100)}%`);
      }
    });
    const result = await worker.recognize(state.aiImageFile);
    state.aiRecognizedText = result.data.text || '';
    const candidates = extractPlaceCandidates(state.aiRecognizedText);
    if (!candidates.length) {
      state.aiStatus = '没有识别到明确地点，请换一张文字更清晰的截图';
      return;
    }
    const matched = [];
    for (let index = 0; index < candidates.length; index += 1) {
      updateAIStatus(`正在匹配地图坐标 ${index + 1}/${candidates.length}`);
      matched.push(await geocodeAIPlace(candidates[index]));
    }
    state.aiResults = matched;
    state.aiStatus = `识别到 ${matched.length} 个地点，请确认后批量添加`;
  } catch (error) {
    state.aiStatus = 'AI 识别模型加载失败，请检查网络后重试';
  } finally {
    await worker?.terminate();
    state.aiWorking = false;
    render();
  }
}

function addPlaceFromForm(formElement) {
  const form = new FormData(formElement);
  const repairPlace = state.repairPlace;
  const targetDay = getDay(repairPlace?._dayNumber || state.addDayNumber);
  if (!targetDay) return;
  const coords = state.selectedSearchResult?.coords;
  if (!coords) return;
  const name = String(form.get('placeName')).trim();
  const updatedFields = {
    name,
    shortName: name,
    type: form.get('type'),
    coords: coords.map(Number),
    time: form.get('time'),
    note: String(form.get('note') || '').trim(),
    address: state.selectedSearchResult.address,
    locationStatus: 'verified'
  };
  if (repairPlace) {
    const index = findPlaceIndex(targetDay, repairPlace);
    if (index < 0) return;
    targetDay.items[index] = { ...targetDay.items[index], ...updatedFields };
    const repaired = placeWithDay(targetDay.items[index], targetDay.number);
    persistItinerary();
    resetAddPlace();
    state.selectedPlace = repaired;
    render();
    return;
  }
  targetDay.items.push({ id: `user-place-${Date.now()}`, ...updatedFields, userAdded: true });
  persistItinerary();
  state.dayFilter = String(targetDay.number);
  state.category = 'all';
  resetAddPlace();
  render();
}

function importAIResults(formElement) {
  const targetDay = getDay(state.addDayNumber);
  if (!targetDay) return;
  const form = new FormData(formElement);
  const selected = state.aiResults.filter((result, index) => result.matched && form.has(`selected-${index}`));
  selected.forEach((result, index) => targetDay.items.push({
    id: `ai-place-${Date.now()}-${index}`,
    name: result.name,
    shortName: result.name,
    type: 'sight',
    coords: result.coords.map(Number),
    time: `${String(12 + Math.floor(index / 2)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`,
    note: 'AI 从旅行截图识别 · 请确认开放时间',
    address: result.address,
    locationStatus: 'verified',
    userAdded: true,
    aiImported: true
  }));
  if (!selected.length) return;
  persistItinerary();
  state.dayFilter = String(targetDay.number);
  state.category = 'all';
  resetAddPlace();
  render();
}

function moveSelectedPlace(targetDayNumber) {
  const place = state.selectedPlace;
  const sourceDay = getDay(place?._dayNumber);
  const targetDay = getDay(targetDayNumber);
  if (!place || !sourceDay || !targetDay || sourceDay.number === targetDay.number) return;
  const index = findPlaceIndex(sourceDay, place);
  if (index < 0) return;
  const [movedPlace] = sourceDay.items.splice(index, 1);
  targetDay.items.push(movedPlace);
  persistItinerary();
  state.dayFilter = String(targetDay.number);
  state.selectedPlace = placeWithDay(movedPlace, targetDay.number);
  render();
}

function beginRepairSelectedPlace() {
  const place = state.selectedPlace;
  if (!place) return;
  state.repairPlace = place;
  state.addDayNumber = place._dayNumber;
  state.addPlaceMode = 'manual';
  state.placeSearchQuery = place.name;
  state.placeSearchResults = [];
  state.placeSearchStatus = '正在查找原地点…';
  state.selectedSearchResult = null;
  state.selectedPlace = null;
  state.deletePlaceArmed = false;
  state.showAddPlace = true;
  render();
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => searchPlaces(place.name), 60);
}

function deleteSelectedPlace() {
  const place = state.selectedPlace;
  const sourceDay = getDay(place?._dayNumber);
  const index = findPlaceIndex(sourceDay, place);
  if (!place || !sourceDay || index < 0) return;
  sourceDay.items.splice(index, 1);
  persistItinerary();
  state.selectedPlace = null;
  state.deletePlaceArmed = false;
  render();
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
  document.querySelectorAll('[data-place-day]').forEach((button) => button.addEventListener('click', () => { state.selectedPlace = placeWithDay(resolvePlace(button.dataset.placeDay, button.dataset.placeIndex), button.dataset.placeDay); render(); }));
  document.querySelectorAll('[data-open-trip]').forEach((button) => button.addEventListener('click', () => { state.tab = 'trip'; state.cityId = button.dataset.openTrip; state.dayFilter = button.dataset.day || 'all'; location.hash = 'trip'; render(); }));
  document.querySelectorAll('[data-open-tickets]').forEach((button) => button.addEventListener('click', () => { state.showTickets = true; render(); }));
  document.querySelectorAll('[data-close-overlay]').forEach((button) => button.addEventListener('click', () => {
    state.selectedPlace = null;
    state.deletePlaceArmed = false;
    state.showTickets = false;
    state.showExpenseForm = false;
    searchController?.abort();
    resetAddPlace();
    render();
  }));
  document.querySelectorAll('[data-toggle-sheet]').forEach((button) => button.addEventListener('click', () => { state.sheetExpanded = !state.sheetExpanded; render(); }));
  document.querySelectorAll('[data-flow-place]').forEach((button) => button.addEventListener('click', () => {
    state.selectedPlace = findPlaceInCity(button.dataset.flowPlace); render();
  }));
  document.querySelectorAll('[data-add-place]').forEach((button) => button.addEventListener('click', () => {
    const localDays = cityDays(state.cityId);
    state.addDayNumber = state.dayFilter === 'all' ? localDays[0].number : Number(state.dayFilter);
    state.addPlaceMode = 'manual';
    state.showAddPlace = true;
    render();
  }));
  document.querySelectorAll('[data-add-mode]').forEach((button) => button.addEventListener('click', () => {
    state.addPlaceMode = button.dataset.addMode;
    state.selectedSearchResult = null;
    state.placeSearchResults = [];
    state.placeSearchStatus = '';
    render();
  }));
  document.querySelector('[data-repair-place]')?.addEventListener('click', beginRepairSelectedPlace);
  document.querySelector('[data-delete-place]')?.addEventListener('click', () => {
    if (state.deletePlaceArmed) deleteSelectedPlace();
    else { state.deletePlaceArmed = true; render(); }
  });
  document.querySelector('#add-place-day')?.addEventListener('change', (event) => { state.addDayNumber = Number(event.target.value); render(); });
  document.querySelector('#place-search-input')?.addEventListener('input', (event) => {
    state.placeSearchQuery = event.target.value;
    clearTimeout(searchTimer);
    updateSearchStatus(event.target.value.trim().length < 2 ? '再输入一点关键词' : '等待搜索…');
    searchTimer = setTimeout(() => searchPlaces(event.target.value), 850);
  });
  document.querySelectorAll('[data-place-result]').forEach((button) => button.addEventListener('click', () => {
    state.selectedSearchResult = state.placeSearchResults[Number(button.dataset.placeResult)];
    state.placeSearchStatus = '';
    render();
  }));
  document.querySelector('#add-place-form')?.addEventListener('submit', (event) => { event.preventDefault(); addPlaceFromForm(event.currentTarget); });
  document.querySelector('#ai-image-input')?.addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (!file) return;
    if (state.aiImageUrl) URL.revokeObjectURL(state.aiImageUrl);
    state.aiImageFile = file;
    state.aiImageUrl = URL.createObjectURL(file);
    state.aiResults = [];
    state.aiStatus = '截图已就绪，可以开始识别';
    render();
  });
  document.querySelector('[data-run-ai]')?.addEventListener('click', recognizeAIImage);
  document.querySelector('[data-ai-select-all]')?.addEventListener('click', () => {
    state.aiResults = state.aiResults.map((result) => ({ ...result, selected: result.matched }));
    render();
  });
  document.querySelector('#ai-results-form')?.addEventListener('submit', (event) => { event.preventDefault(); importAIResults(event.currentTarget); });
  document.querySelector('#move-place-day')?.addEventListener('change', (event) => moveSelectedPlace(Number(event.target.value)));
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
