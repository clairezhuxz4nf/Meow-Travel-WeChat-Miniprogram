const plans = {
  '2027-05-02': {
    label: '5月2日 周日',
    city: '巴黎',
    events: [
      ['09:00', '12:00', '◇', '卢浮宫', '步行 12 分钟 · 已购票'],
      ['12:30', '14:00', '☕', '花神咖啡馆', '地铁 15 分钟 · 已预订'],
      ['15:00', '17:00', '⌁', '塞纳河游船', '步行 8 分钟 · 已购票'],
      ['19:00', '21:00', '♨', 'Le Relais 餐厅', '地铁 18 分钟 · 已预订']
    ]
  },
  '2027-05-03': {
    label: '5月3日 周一',
    city: '巴黎',
    events: [
      ['09:30', '11:30', '△', '蒙马特高地', '地铁 22 分钟 · 自由活动'],
      ['12:00', '13:30', '☕', '街角午餐', '步行 6 分钟 · 待决定'],
      ['14:30', '17:30', '◇', '奥赛博物馆', '地铁 20 分钟 · 已购票']
    ]
  }
}

const cities = [
  ['巴黎','法国','5月2日–5月4日 · 2 晚','#d6a6a0'],
  ['布鲁塞尔','比利时','5月5日–5月6日 · 1 晚','#c9a65b'],
  ['阿姆斯特丹','荷兰','5月7日–5月9日 · 2 晚','#a9bcc8'],
  ['柏林','德国','5月10日–5月12日 · 2 晚','#a8b39b'],
  ['布拉格','捷克','5月13日–5月15日 · 2 晚','#d6a6a0'],
  ['维也纳','奥地利','5月16日–5月18日 · 2 晚','#a9bcc8']
]

let expenses = [
  ['🚇','巴黎地铁','3 人 · Claire 支付','€12.60','5月2日'],
  ['☕','花神咖啡馆午餐','3 人 · Mia 支付','€48.00','5月2日'],
  ['🏨','巴黎花园酒店','3 晚 · Claire 支付','€720.00','5月1日']
]
let total = 3860

const timeline = document.querySelector('#timeline')
const cityList = document.querySelector('#cityList')
const expenseList = document.querySelector('#expenseList')
const toast = document.querySelector('#toast')

function renderTimeline(plan) {
  timeline.innerHTML = plan.events.map((event) => `
    <article class="timeline-item">
      <div class="time"><b>${event[0]}</b><span>${event[1]}</span></div>
      <div class="rail"><i></i></div>
      <div class="event"><span class="event-icon">${event[2]}</span><div class="event-main"><b>${event[3]}</b><small>${event[4]}</small></div><em>›</em></div>
    </article>`).join('')
}

function renderCities() {
  cityList.innerHTML = cities.map((city,index) => `
    <article class="city card" style="--city-color:${city[3]}">
      <span class="city-index">${index + 1}</span>
      <div><h4>${city[0]} <span>${city[1]}</span></h4><p>${city[2]}</p></div><em>›</em>
    </article>`).join('')
}

function renderExpenses() {
  expenseList.innerHTML = expenses.map((item) => `
    <article class="expense"><span class="expense-icon">${item[0]}</span><div><b>${item[1]}</b><small>${item[2]}</small></div><div class="expense-amount"><b>${item[3]}</b><small>${item[4]}</small></div></article>`).join('')
  document.querySelector('#expenseTotal').textContent = total.toLocaleString('en-US', { maximumFractionDigits: 2 })
  const percent = Math.round(total / 5200 * 100)
  document.querySelector('#budgetFill').style.width = `${Math.min(percent,100)}%`
  document.querySelector('#budgetText').textContent = `预算已使用 ${percent}%`
}

function switchScreen(name) {
  document.querySelectorAll('.screen').forEach((screen) => screen.classList.toggle('is-active', screen.dataset.screen === name))
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.tab === name))
  document.querySelector('.screen-stack').scrollTop = 0
}

function showToast(message) {
  toast.textContent = message
  toast.classList.add('show')
  window.setTimeout(() => toast.classList.remove('show'), 1500)
}

document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => switchScreen(tab.dataset.tab)))
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => switchScreen(button.dataset.go)))
document.querySelector('#datePicker').addEventListener('change', (event) => {
  const plan = plans[event.target.value]
  if (plan) {
    document.querySelector('#dateLabel').textContent = plan.label
    renderTimeline(plan)
    showToast(`已切换到 ${plan.label}`)
  } else {
    showToast('这一天还没有安排')
  }
})

const modal = document.querySelector('#expenseModal')
document.querySelector('#addExpenseButton').addEventListener('click', () => {
  modal.classList.add('is-open')
  modal.setAttribute('aria-hidden','false')
})
document.querySelector('#closeModal').addEventListener('click', () => {
  modal.classList.remove('is-open')
  modal.setAttribute('aria-hidden','true')
})
modal.addEventListener('click', (event) => {
  if (event.target === modal) document.querySelector('#closeModal').click()
})
document.querySelector('#expenseForm').addEventListener('submit', (event) => {
  event.preventDefault()
  const form = new FormData(event.currentTarget)
  const amount = Number(form.get('amount'))
  expenses.unshift(['◌',form.get('title'),`${form.get('category')} · Claire 支付`,`€${amount.toFixed(2)}`,'今天'])
  total += amount
  renderExpenses()
  event.currentTarget.reset()
  document.querySelector('#closeModal').click()
  showToast('已记一笔')
})

renderTimeline(plans['2027-05-02'])
renderCities()
renderExpenses()

