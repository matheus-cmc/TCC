// util
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

/* --------- Dados de exemplo (você pode puxar do Firestore depois) --------- */
const SEEDS = [
  { titulo:'Reels - Promo FDS', tipo:'Reels', prioridade:'Alta',  resp:'Mariana', data:'2025-10-25', status:'Redação' },
  { titulo:'Vídeo YouTube - Tutorial', tipo:'Vídeo', prioridade:'Média', resp:'Diego',   data:'2025-10-27', status:'Gravação' },
  { titulo:'Carrossel - Dicas Wi-Fi',  tipo:'Carrossel', prioridade:'Baixa', resp:'Iza', data:'2025-10-26', status:'Design' },
  { titulo:'Fotos campanha Black',     tipo:'Foto', prioridade:'Alta', resp:'Sara', data:'2025-10-28', status:'Fotografia' },
  { titulo:'Stories - Bastidores',     tipo:'Stories', prioridade:'Média', resp:'Rafa', data:'2025-10-24', status:'Aprovação' },
  { titulo:'Reels - Cliente X',        tipo:'Reels', prioridade:'Alta', resp:'Mariana', data:'2025-10-29', status:'Edição de vídeo' },
];

/* -------------------------- Renderização base ----------------------------- */
const lanes = {};
$$('.col').forEach(col => lanes[col.dataset.status] = $('.lane', col));

function cardEl(item){
  const el = document.createElement('article');
  el.className = 'card';
  el.draggable = true;
  el.dataset.tipo = item.tipo;
  el.dataset.prioridade = item.prioridade;
  el.dataset.resp = item.resp;
  el.dataset.status = item.status;

  el.innerHTML = `
    <h4 class="card-title">${item.titulo}</h4>
    <div class="meta">
      <span class="tag grad">${item.tipo}</span>
      <span class="tag"><span class="badge">${item.prioridade}</span></span>
      <span class="tag">Resp.: ${item.resp}</span>
      <span class="tag">${new Date(item.data).toLocaleDateString('pt-BR')}</span>
    </div>
  `;
  addDragHandlers(el);
  return el;
}

function renderBoard(items){
  Object.values(lanes).forEach(l => l.innerHTML = '');
  // preenche
  items.forEach(it => lanes[it.status]?.appendChild(cardEl(it)));
  // mostra placeholder se vazio
  Object.entries(lanes).forEach(([name, lane])=>{
    if(!lane.children.length){
      const em = document.createElement('div');
      em.className='empty';
      em.textContent='Arraste cards para cá';
      lane.appendChild(em);
    }
  });
}

/* ----------------------------- Drag & Drop -------------------------------- */
let dragging = null;

function addDragHandlers(card){
  card.addEventListener('dragstart', e=>{
    dragging = card;
    e.dataTransfer.setData('text/plain', 'drag'); // necessário em alguns browsers
    setTimeout(()=> card.style.opacity='.6', 0);
  });
  card.addEventListener('dragend', ()=>{
    card.style.opacity='1';
    dragging = null;
  });
}

$$('.lane').forEach(lane=>{
  lane.addEventListener('dragover', e=>{
    e.preventDefault();
    lane.classList.add('drag-over');
  });
  lane.addEventListener('dragleave', ()=> lane.classList.remove('drag-over'));
  lane.addEventListener('drop', ()=>{
    lane.classList.remove('drag-over');
    if(!dragging) return;
    // remove placeholder se existir
    const ph = $('.empty', lane); if(ph) ph.remove();
    lane.appendChild(dragging);
    dragging.dataset.status = lane.parentElement.dataset.status;
  });
});

/* ------------------------------- Filtros ---------------------------------- */
const fResp = $('#f-resp'), fPri = $('#f-pri'), fTipo = $('#f-tipo');
function populateFilters(items){
  const responsaveis = [...new Set(items.map(i=>i.resp))].sort();
  responsaveis.forEach(r=>{
    const o = document.createElement('option'); o.textContent=r; fResp.appendChild(o);
  });
}
function applyFilters(){
  const r = fResp.value.trim(), p = fPri.value.trim(), t = fTipo.value.trim();
  $$('.card').forEach(c=>{
    const ok = (!r || c.dataset.resp===r) &&
               (!p || c.dataset.prioridade===p) &&
               (!t || c.dataset.tipo===t);
    c.style.display = ok ? '' : 'none';
  });
}
[fResp, fPri, fTipo].forEach(sel=> sel.addEventListener('change', applyFilters));
$('#clearFilters').addEventListener('click', ()=>{
  fResp.value=''; fPri.value=''; fTipo.value=''; applyFilters();
});

/* ------------------------------ Novo Card --------------------------------- */
const modal = $('#modal');
$('#btnNovo').addEventListener('click', ()=>{
  $('#formNovo').reset();
  modal.showModal();
});
$('#m-cancel').addEventListener('click', ()=> modal.close());

$('#formNovo').addEventListener('submit', e=>{
  e.preventDefault();
  const item = {
    titulo: $('#m-titulo').value.trim(),
    tipo: $('#m-tipo').value,
    prioridade: $('#m-pri').value,
    resp: $('#m-resp').value.trim(),
    data: $('#m-data').value,
    status: $('#m-col').value
  };
  // cria card
  const lane = lanes[item.status];
  if($('.empty', lane)) $('.empty', lane).remove();
  lane.appendChild(cardEl(item));
  // atualizar filtros de responsável (se novo)
  if(![...fResp.options].some(o=>o.value===item.resp)){
    const o = document.createElement('option'); o.textContent=item.resp; fResp.appendChild(o);
  }
  modal.close();
  applyFilters();
});

/* ------------------------------- Init ------------------------------------- */
renderBoard(SEEDS);
populateFilters(SEEDS);
applyFilters();
