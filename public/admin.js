(() => {
  const API = window.location.origin + '/api/admin';
  const statusEl = () => document.getElementById('status');
  const keyInput = () => document.getElementById('adminKey');

  async function fetchJson(path) {
    const key = keyInput().value || '';
    const res = await fetch(API + path, { headers: { 'X-Admin-Key': key } });
    if (!res.ok) {
      const txt = await res.text().catch(() => 'Error');
      throw new Error(res.status + ' ' + txt);
    }
    return res.json();
  }

  function renderTable(containerId, rows) {
    const container = document.getElementById(containerId);
    if (!rows || rows.length === 0) {
      container.innerHTML = '<div class="small">(sin registros)</div>';
      return;
    }
    const keys = Object.keys(rows[0]);
    let html = '<table><thead><tr>' + keys.map(k => `<th>${k}</th>`).join('') + '</tr></thead><tbody>';
    html += rows.map(r => '<tr>' + keys.map(k => `<td>${(r[k]===null||r[k]===undefined)?'':String(r[k])}</td>`).join('') + '</tr>').join('');
    html += '</tbody></table>';
    container.innerHTML = html;
  }

  async function loadAll() {
    try {
      statusEl().textContent = 'Cargando...';
      const [overview, users, exams, certs, subs, boletin, contacts] = await Promise.all([
        fetchJson('/overview').catch(e=>({error:e.message})),
        fetchJson('/usuarios').catch(e=>({error:e.message})),
        fetchJson('/examenes').catch(e=>({error:e.message})),
        fetchJson('/certificados').catch(e=>({error:e.message})),
        fetchJson('/suscripciones').catch(e=>({error:e.message})),
        fetchJson('/boletin').catch(e=>({error:e.message})),
        fetchJson('/contactos').catch(e=>({error:e.message}))
      ]);

      document.getElementById('overview').textContent = overview.error ? overview.error : JSON.stringify(overview, null, 2);

      if (Array.isArray(users)) renderTable('users', users); else document.getElementById('users').textContent = users.error || String(users);
      if (Array.isArray(exams)) renderTable('exams', exams); else document.getElementById('exams').textContent = exams.error || String(exams);
      if (Array.isArray(certs)) renderTable('certs', certs); else document.getElementById('certs').textContent = certs.error || String(certs);

      // Merge suscripciones + boletin into subs
      const subsCombined = [];
      if (Array.isArray(subs)) subsCombined.push(...subs.map(s => ({type:'suscripcion', ...s}))); 
      if (Array.isArray(boletin)) subsCombined.push(...boletin.map(b => ({type:'boletin', ...b})));
      if (subsCombined.length) renderTable('subs', subsCombined); else document.getElementById('subs').textContent = 'No hay suscripciones';

      if (Array.isArray(contacts)) renderTable('contacts', contacts); else document.getElementById('contacts').textContent = contacts.error || String(contacts);

      statusEl().textContent = 'Última carga: ' + new Date().toLocaleTimeString();
    } catch (e) {
      statusEl().textContent = 'Error: ' + e.message;
    }
  }

  let intervalId = null;
  document.getElementById('loadBtn').addEventListener('click', loadAll);
  let es = null;
  function startSSE(key) {
    if (!key) return;
    if (es) return;
    try {
      const url = window.location.origin + '/api/admin/stream?admin_key=' + encodeURIComponent(key);
      es = new EventSource(url);
      es.onopen = () => { statusEl().textContent = 'SSE conectado'; };
      es.onerror = (e) => { statusEl().textContent = 'SSE error'; };
      const types = ['usuario','examen','certificado','suscripcion','boletin','contacto'];
      types.forEach(t => es.addEventListener(t, () => { statusEl().textContent = 'Evento: ' + t + ' ' + new Date().toLocaleTimeString(); loadAll(); }));
    } catch (e) {
      console.warn('SSE no disponible', e);
    }
  }
  function stopSSE() { if (es) { es.close(); es = null; statusEl().textContent = 'SSE desconectado'; } }

  document.getElementById('autoRefresh').addEventListener('change', (e) => {
    const key = keyInput().value || '';
    if (e.target.checked) {
      // Preferir SSE si hay admin key
      if (key) {
        startSSE(key);
      } else {
        intervalId = setInterval(loadAll, 5000);
        loadAll();
      }
    } else {
      clearInterval(intervalId);
      intervalId = null;
      stopSSE();
    }
  });

  // Allow pressing Enter in key input to load
  keyInput().addEventListener('keydown', (e) => { if (e.key === 'Enter') loadAll(); });

  // If admin key exists in query param, prefill and auto-load
  const qp = new URLSearchParams(window.location.search);
  if (qp.get('admin_key')) {
    keyInput().value = qp.get('admin_key');
    document.getElementById('autoRefresh').checked = true;
    // start SSE and initial load
    startSSE(qp.get('admin_key'));
    loadAll();
  }

  // If user presses load and provided an admin key, ensure SSE started
  document.getElementById('loadBtn').addEventListener('click', () => {
    const key = keyInput().value || '';
    if (key && !es) startSSE(key);
  });
})();
