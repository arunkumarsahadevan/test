// ===== Runtime Error Banner =====
const errorBanner = document.getElementById('errorBanner');
function showError(msg){ errorBanner.textContent = msg; errorBanner.style.display='block'; }

// ===== Utilities =====
const uniq = arr => [...new Set(arr.filter(Boolean))];
const parseDate = v => { if(!v) return null; const d=new Date(v); return isNaN(d)?null:d; };

let DATA = [];

// ===== Load Data =====
async function loadData(){
  try{
    const res = await fetch('tickets.json?ts='+Date.now());
    if(!res.ok) throw new Error('Failed to load tickets.json');
    DATA = await res.json();
    DATA.forEach(r=>{
      r._created = parseDate(r.ReportingTime);
      r._closed = parseDate(r.ClosingDate);
    });
    initFilters();
    apply();
  }catch(e){ showError(e.message); }
}

// ===== Filters =====
function initFilters(){
  fill('severity', uniq(DATA.map(r=>r.NewgenSeverity)));
  fill('customer', uniq(DATA.map(r=>r.Customername)));
  fill('project', uniq(DATA.map(r=>r.ProjectName)));
}
function fill(id, vals){ const el=document.getElementById(id); el.innerHTML=''; vals.forEach(v=>el.add(new Option(v,v))); }

// ===== Apply & Render =====
function apply(){
  let rows=[...DATA];
  rows = filterMulti(rows,'severity','NewgenSeverity');
  rows = filterMulti(rows,'customer','Customername');
  rows = filterMulti(rows,'project','ProjectName');
  renderKPIs(rows);
  renderScorecard(rows);
  renderWeekly(rows);
  renderSLA(rows);
  renderTop(rows);
  renderVolume(rows);
}
function filterMulti(rows, selId, key){
  const sel=[...document.getElementById(selId).selectedOptions].map(o=>o.value);
  return sel.length? rows.filter(r=>sel.includes(r[key])): rows;
}

// ===== KPIs =====
function renderKPIs(rows){
  document.getElementById('kpiOpen').textContent = rows.filter(r=>!r._closed).length;
  const rBase = rows.filter(r=>r.Response_TicketSLAMet).length;
  const rYes = rows.filter(r=>String(r.Response_TicketSLAMet).toLowerCase()==='yes').length;
  const rsBase = rows.filter(r=>r.Resolution_TicketSLAMet).length;
  const rsYes = rows.filter(r=>String(r.Resolution_TicketSLAMet).toLowerCase()==='yes').length;
  document.getElementById('kpiResp').textContent = rBase? (100*rYes/rBase).toFixed(1)+'%':'—';
  document.getElementById('kpiReso').textContent = rsBase? (100*rsYes/rsBase).toFixed(1)+'%':'—';
}

// ===== Scorecard =====
function renderScorecard(rows){
  const map={};
  rows.forEach(r=>{
    const u=r.AssigntoUserName||'Unassigned';
    if(!map[u]) map[u]={u,t:0,o:0,c:0};
    map[u].t++; r._closed?map[u].c++:map[u].o++;
  });
  let html='<table border=1 width=100%><tr><th>Resource</th><th>Tickets</th><th>Open</th><th>Closed</th></tr>';
  Object.values(map).forEach(r=>{ html+=`<tr><td>${r.u}</td><td>${r.t}</td><td>${r.o}</td><td>${r.c}</td></tr>`; });
  html+='</table>';
  document.getElementById('scorecard').innerHTML=html;
}

// ===== Weekly =====
function renderWeekly(rows){
  const w={};
  rows.filter(r=>r._closed).forEach(r=>{
    const k=r._closed.toISOString().slice(0,10);
    w[k]=(w[k]||0)+1;
  });
  document.getElementById('weekly').innerHTML = JSON.stringify(w);
}

// ===== Charts =====
function renderSLA(rows){
  const y=rows.filter(r=>String(r.Response_TicketSLAMet).toLowerCase()==='yes').length;
  const n=rows.filter(r=>String(r.Response_TicketSLAMet).toLowerCase()==='no').length;
  Plotly.newPlot('chartSLA',[{values:[y,n],labels:['Met','Breach'],type:'pie'}]);
}
function renderTop(rows){
  const m={}; rows.forEach(r=>{const c=r.Customername||'Other'; m[c]=(m[c]||0)+1;});
  const e=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,5);
  Plotly.newPlot('chartTop',[{x:e.map(v=>v[0]),y:e.map(v=>v[1]),type:'bar'}]);
}
function renderVolume(rows){
  const m={}; rows.forEach(r=>{if(r._created){const k=r._created.toISOString().slice(0,10); m[k]=(m[k]||0)+1;}});
  Plotly.newPlot('chartVolume',[{x:Object.keys(m),y:Object.values(m),type:'scatter'}]);
}

// ===== Events =====
document.getElementById('reload').onclick=loadData;
document.querySelectorAll('select').forEach(s=>s.onchange=apply);
document.getElementById('exportCsv').onclick=()=>{ const h=Object.keys(DATA[0]); const rows=DATA.map(r=>h.map(k=>`"${(r[k]||'').toString().replace(/"/g,'""')}"`).join(',')); const csv=[h.join(','),...rows].join('
'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='export.csv'; a.click(); };

loadData();