// helpers
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

/* ----------------------- DADOS DE EXEMPLO ----------------------- */
const STATUSES = [
  'Redação','Gravação','Edição de vídeo','Design','Revisão',
  'Fotografia','Aprovação','Aguardando Aprovação','Pronto pra Postar'
];

const DATA = [
  { titulo:'Reels - Promo FDS', tipo:'Reels', prioridade:'Alta',  resp:['ML','AS'], data:'2025-08-13', status:'Redação' },
  { titulo:'YouTube - Tutorial', tipo:'Vídeo', prioridade:'Média', resp:['MC'],     data:'2025-08-20', status:'Gravação' },
  { titulo:'Carrossel - Dicas Wi-Fi', tipo:'Carrossel', prioridade:'Baixa', resp:['IZ','ML'], data:'2025-08-25', status:'Design' },
  { titulo:'Fotos campanha Black', tipo:'Foto', prioridade:'Alta', resp:['SR'], data:'2025-08-22', status:'Fotografia' },
  { titulo:'Stories - Bastidores', tipo:'Stories', prioridade:'Média', resp:['RF'], data:'2025-08-19', status:'Aprovação' },
  { titulo:'Reels - Cliente X', tipo:'Reels', prioridade:'Alta', resp:['ML'], data:'2025-08-27', status:'Edição de vídeo' },
];

/* ----------------------- RENDER ----------------------- */
const groupsEl = $('#groups');

function render(){
  groupsEl.innerHTML = '';
  STATUSES.forEach(status=>{
    const items = filtered(DATA).filter(i=>i.status===status);
    groupsEl.appendChild(renderGroup(status, items));
  });
}

function renderGroup(status, items){
  const g = document.createElement('section');
  g.className = 'group';

  // head
  const head = document.createElement('div');
  head.className = 'group-head';
  head.innerHTML = `
    <span class="status-pill"><span class="dot"></span>${status}</span>
    <span class="group-count">${items.length}</span>
    <button class="group-add" type="button">+ Adicionar tarefa</button>
  `;
  g.appendChild(head);

  // rows
  if(items.length === 0){
    const empty = document.createElement('div');
    empty.className = 'row';
    empty.innerHTML = `<div class="c c-name"><div class="checkbox"></div><span class="title" style="color:#98a2b3">Nenhuma tarefa</span></div>`;
    g.appendChild(empty);
  } else {
    items.forEach(item => g.appendChild(renderRow(item)));
  }

  // evento add dentro do grupo
  head.querySelector('.group-add').addEventListener('click', ()=>{
    $('#formNovo').reset();
    $('#m-status').value = status;
    modal.showModal();
  });

  return g;
}

function renderRow(item){
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `
    <div class="c c-name cell-name">
      <div class="checkbox" role="checkbox" aria-checked="false"></div>
      <div class="title">${item.titulo}</div>
    </div>

    <div class="c c-resp">
      <div class="avatars">
        ${(item.resp||[]).map((ini,i)=>`<div class="av p${(i%4)+1}">${ini}</div>`).join('')}
      </div>
    </div>

    <div class="c c-date">
      <span class="date">${formatDate(item.data)}</span>
    </div>

    <div class="c c-pri">
      <span class="pri">
        <span class="flag ${priClass(item.prioridade)}"></span>${item.prioridade}
      </span>
    </div>

    <div class="c c-act">
      <button class="kebab" title="Ações">⋯</button>
    </div>
  `;
  return row;
}

function priClass(p){ return p==='Alta'?'alta':p==='Média'?'media':'baixa' }
function formatDate(iso){ try{ return new Date(iso).toLocaleDateString('pt-BR'); }catch{ return iso } }

/* ----------------------- FILTROS ----------------------- */
const fResp = $('#f-resp'), fPri = $('#f-pri'), fTipo = $('#f-tipo');
function populateFilters(){
  const resps = [...new Set(DATA.flatMap(i=>i.resp))].filter(Boolean).sort();
  resps.forEach(r => {
    const o = document.createElement('option'); o.value=o.textContent=r; fResp.appendChild(o);
  });
}
function filtered(list){
  const r = fResp.value, p = fPri.value, t = fTipo.value;
  return list.filter(i =>
    (!r || (i.resp||[]).includes(r)) &&
    (!p || i.prioridade===p) &&
    (!t || i.tipo===t)
  );
}
[fResp,fPri,fTipo].forEach(el => el.addEventListener('change', render));
$('#clearFilters').addEventListener('click', ()=>{ fResp.value=''; fPri.value=''; fTipo.value=''; render(); });

/* ----------------------- MODAL NOVO ----------------------- */
const modal = $('#modal');
$('#btnNovo').addEventListener('click', ()=>{ $('#formNovo').reset(); modal.showModal(); });
$('#m-cancel').addEventListener('click', ()=> modal.close());

$('#formNovo').addEventListener('submit', e=>{
  e.preventDefault();
  const item = {
    titulo: $('#m-titulo').value.trim(),
    tipo: $('#m-tipo').value,
    prioridade: $('#m-pri').value,
    resp: [$('#m-resp').value.trim()].filter(Boolean),
    data: $('#m-data').value,
    status: $('#m-status').value
  };
  DATA.push(item);
  // garantir responsável no filtro
  if (![...fResp.options].some(o=>o.value===item.resp[0])) {
    const o = document.createElement('option'); o.value=o.textContent=item.resp[0]; fResp.appendChild(o);
  }
  modal.close();
  render();
});

/* ----------------------- INIT ----------------------- */
populateFilters();
render();
