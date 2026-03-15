
const statusEl = document.getElementById('status');
const tableBody = document.querySelector('#ticketsTable tbody');
const reloadBtn = document.getElementById('reload');
const autoRefresh = document.getElementById('autoRefresh');
let timer = null;

async function loadTickets() {
  try {
    const url = `tickets.json?cacheBust=${Date.now()}`; // ensure latest file
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('JSON root must be an array');
    render(data);
    statusEl.textContent = `Loaded ${data.length} tickets · ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Failed to load: ${err.message}`;
  }
}

function esc(v){ return String(v ?? '').replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>'); }

function render(rows){
  tableBody.innerHTML = '';
  for (const r of rows) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${esc(r['Ticketid'])}</td>
      <td>${esc(r['Customername'])}</td>
      <td>${esc(r['ProjectName'])}</td>
      <td>${esc(r['CurrentStatus'])}</td>
      <td><span class="badge ${esc(r['NewgenSeverity'])}">${esc(r['NewgenSeverity'])}</span></td>
      <td>${esc(r['Subject'])}</td>
      <td>${esc(r['ReportingTime'])}</td>
    `;
    tableBody.appendChild(tr);
  }
}

reloadBtn.addEventListener('click', loadTickets);
autoRefresh.addEventListener('change', () => {
  if (autoRefresh.checked) startTimer(); else stopTimer();
});

function startTimer(){ stopTimer(); timer = setInterval(loadTickets, 30000); }
function stopTimer(){ if (timer) { clearInterval(timer); timer = null; } }

// initial load
loadTickets();
startTimer();
