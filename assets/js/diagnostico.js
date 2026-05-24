/* CLEAR × TCE-ES — Diagnóstico iterativo de sistemas de M&A
   ---
   Persistência em localStorage, renderização do resultado e
   geração de pontos de atenção via regras simples baseadas no Guia.
*/

(function () {
  'use strict';

  const STORAGE_KEY = 'clear-cartilha-diagnostico-v1';
  const ETAPAS = [
    { id: 'et-1', num: 'I',   nome: 'Diagnóstico',          ref: 'Etapa I do Guia' },
    { id: 'et-2', num: 'II',  nome: 'Desenho',              ref: 'Etapa II do Guia' },
    { id: 'et-3', num: 'III', nome: 'Arranjo normativo',    ref: 'Etapa III do Guia' },
    { id: 'et-4', num: 'IV',  nome: 'Implementação',        ref: 'Etapa IV do Guia' },
    { id: 'et-5', num: 'V',   nome: 'Uso e consolidação',   ref: 'Etapa V do Guia' },
  ];

  // ---------- Estado ----------
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { answers: {}, notes: {}, general: '' };
      const parsed = JSON.parse(raw);
      return {
        answers: parsed.answers || {},
        notes: parsed.notes || {},
        general: parsed.general || '',
      };
    } catch (e) {
      console.warn('Não foi possível carregar respostas salvas:', e);
      return { answers: {}, notes: {}, general: '' };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      flashSaveIndicator();
    } catch (e) {
      console.warn('Não foi possível salvar:', e);
    }
  }

  let saveTimer;
  function flashSaveIndicator() {
    clearTimeout(saveTimer);
    const el = document.getElementById('save-indicator');
    if (!el) return;
    el.classList.add('is-visible');
    saveTimer = setTimeout(() => el.classList.remove('is-visible'), 1100);
  }

  // ---------- Inicialização ----------
  document.addEventListener('DOMContentLoaded', () => {
    initOptions();
    initNotes();
    initGeneralNotes();
    initActions();
    restoreUI();
    updateProgress();
  });

  function initOptions() {
    document.querySelectorAll('.dq-option').forEach(label => {
      const qid = label.dataset.qid;
      const state_ = label.dataset.state;
      label.addEventListener('click', (e) => {
        e.preventDefault();
        const current = state.answers[qid];
        if (current === state_) {
          delete state.answers[qid];
        } else {
          state.answers[qid] = state_;
        }
        refreshOptionsFor(qid);
        saveState();
        updateProgress();
      });
    });
  }

  function refreshOptionsFor(qid) {
    document.querySelectorAll(`.dq-option[data-qid="${qid}"]`).forEach(el => {
      el.classList.toggle('is-checked', el.dataset.state === state.answers[qid]);
    });
  }

  function initNotes() {
    document.querySelectorAll('.dq-note').forEach(ta => {
      const qid = ta.dataset.qid;
      ta.addEventListener('input', () => {
        if (ta.value.trim()) {
          state.notes[qid] = ta.value;
        } else {
          delete state.notes[qid];
        }
        debounceSave();
      });
    });
  }

  function initGeneralNotes() {
    const ta = document.getElementById('general-notes');
    if (!ta) return;
    ta.addEventListener('input', () => {
      state.general = ta.value;
      debounceSave();
    });
  }

  let saveDebounce;
  function debounceSave() {
    clearTimeout(saveDebounce);
    saveDebounce = setTimeout(saveState, 600);
  }

  function restoreUI() {
    // Restaura opções
    Object.entries(state.answers).forEach(([qid, st]) => {
      const el = document.querySelector(`.dq-option[data-qid="${qid}"][data-state="${st}"]`);
      if (el) el.classList.add('is-checked');
    });
    // Restaura notas
    Object.entries(state.notes).forEach(([qid, val]) => {
      const ta = document.querySelector(`.dq-note[data-qid="${qid}"]`);
      if (ta) ta.value = val;
    });
    // Restaura nota geral
    const gen = document.getElementById('general-notes');
    if (gen && state.general) gen.value = state.general;
    // Se já tem resultado, mostra
    if (Object.keys(state.answers).length >= getMinAnswered()) {
      // não renderiza automaticamente para não assustar o usuário;
      // só destrava o botão. Render acontece no clique.
    }
  }

  function getMinAnswered() {
    return 5; // diagnóstico precisa de pelo menos uma resposta em qualquer etapa
  }

  function totalQuestions() {
    return document.querySelectorAll('.diagnostico-question').length;
  }

  function answeredCount() {
    return Object.keys(state.answers).length;
  }

  function updateProgress() {
    const el = document.getElementById('progress-text');
    if (!el) return;
    const a = answeredCount();
    const t = totalQuestions();
    el.textContent = `${a} de ${t} perguntas respondidas`;

    const btn = document.getElementById('btn-gerar');
    if (btn) {
      const enough = a >= getMinAnswered();
      btn.disabled = !enough;
      btn.textContent = enough
        ? 'Gerar meu diagnóstico'
        : `Responda ao menos ${getMinAnswered()} perguntas`;
    }
  }

  // ---------- Cálculo de score ----------
  function scoreByEtapa() {
    const buckets = {};
    ETAPAS.forEach(et => { buckets[et.id] = { ok: 0, mid: 0, no: 0, na: 0, total: 0 }; });

    document.querySelectorAll('.diagnostico-question').forEach(q => {
      const qid = q.dataset.qid;
      const etapa = q.dataset.etapa;
      if (!buckets[etapa]) return;
      buckets[etapa].total += 1;
      const ans = state.answers[qid];
      if (ans && buckets[etapa][ans] !== undefined) {
        buckets[etapa][ans] += 1;
      }
    });

    // pontuação ponderada: ok=1.0, mid=0.5, no=0, na=ignorada (sai do denominador)
    Object.keys(buckets).forEach(k => {
      const b = buckets[k];
      const considered = b.total - b.na;
      const raw = b.ok * 1 + b.mid * 0.5;
      b.pct = considered > 0 ? Math.round((raw / considered) * 100) : null;
      b.considered = considered;
      b.answered = b.ok + b.mid + b.no + b.na;
    });

    return buckets;
  }

  // ---------- Regras de alerta ----------
  // As regras refletem orientações do Guia. Cada uma tem id, predicate, severity e render.
  const RULES = [
    {
      id: 'r-diag-vazio',
      severity: 'critical',
      predicate: (s) => s['et-1'].answered === 0 && (s['et-2'].answered > 0 || s['et-3'].answered > 0),
      title: 'Construindo sem ter diagnosticado',
      body: () => `Você respondeu perguntas das etapas de desenho ou normativo, mas não respondeu nada na etapa I (Diagnóstico). O Guia trata o diagnóstico como ponto de partida — sem ele, decisões de desenho podem responder a um problema que ainda não foi formulado.`,
      ref: 'Etapa I — Diagnóstico'
    },
    {
      id: 'r-implementa-sem-norma',
      severity: 'warn',
      predicate: (s) => s['et-4'].pct !== null && s['et-4'].pct >= 50 && s['et-3'].pct !== null && s['et-3'].pct < 30,
      title: 'Implementação rodando sem ancoragem normativa',
      body: () => `Sua implementação aparece em estágio avançado, mas o arranjo normativo está pouco consolidado. O Guia (cap. III) lembra que sistemas sem base legal são vulneráveis a descontinuidades políticas — a experiência sul-africana, por exemplo, formalizou o sistema só depois de 4 a 5 anos rodando, justamente quando se percebeu o risco.`,
      ref: 'Etapa III — Arranjo normativo'
    },
    {
      id: 'r-uso-fraco',
      severity: 'critical',
      predicate: (s) => s['et-5'].pct !== null && s['et-5'].pct < 30 && (s['et-2'].pct || 0) + (s['et-4'].pct || 0) > 80,
      title: 'Risco de sistema de fachada',
      body: () => `O sistema parece desenhado e em funcionamento, mas o uso das evidências aparece como fragilidade central. O Guia (cap. V) cita Mackay (2007) e Leeuw & Furubo (2008): um sistema sem demanda real por evidências tende a virar arranjo funcional no papel e irrelevante na prática. <strong>Resolver o uso é, possivelmente, sua prioridade nº 1.</strong>`,
      ref: 'Etapa V — Uso e consolidação'
    },
    {
      id: 'r-desenho-fraco',
      severity: 'warn',
      predicate: (s) => s['et-2'].pct !== null && s['et-2'].pct < 30 && s['et-1'].pct !== null && s['et-1'].pct >= 50,
      title: 'Diagnóstico feito, desenho ainda em aberto',
      body: () => `Há clareza sobre o ponto de partida, mas o desenho do sistema ainda não foi suficientemente definido. Esse é o momento de constituir um grupo de trabalho intersetorial, mapear stakeholders e fazer a análise de avaliabilidade dos primeiros programas candidatos a avaliação.`,
      ref: 'Etapa II — Desenho'
    },
    {
      id: 'r-tudo-baixo',
      severity: 'info',
      predicate: (s) => {
        const pcts = Object.values(s).map(b => b.pct).filter(p => p !== null);
        if (pcts.length === 0) return false;
        const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length;
        return avg < 25;
      },
      title: 'Você está no começo da jornada — e isso é bom',
      body: () => `A maioria das respostas indica que pouca coisa está consolidada ainda. O Guia é categórico: <em>não comece ambicioso</em>. Inicie com poucas avaliações, um grupo de coordenação ativo, e use os primeiros ciclos como pilotos para aprender. O caminho é gradual e não-linear.`,
      ref: 'Reflexões sobre o processo'
    },
    {
      id: 'r-tudo-alto',
      severity: 'good',
      predicate: (s) => {
        const pcts = Object.values(s).map(b => b.pct).filter(p => p !== null);
        if (pcts.length < 4) return false;
        return pcts.every(p => p >= 65);
      },
      title: 'Sistema com bom nível de consolidação',
      body: () => `Suas respostas indicam um sistema com elementos significativos em todas as etapas. O foco agora pode ser <strong>sustentar e aprofundar</strong>: capacidades técnicas, integração com orçamento, e mecanismos para que recomendações se traduzam em ação concreta.`,
      ref: 'Reflexões sobre o processo'
    },
    {
      id: 'r-buraco-uso-acompanhamento',
      severity: 'warn',
      predicate: (s) => {
        // Específica: uso e consolidação tem mais "no" do que "ok"
        const b = s['et-5'];
        return b.answered >= 3 && b.no > b.ok;
      },
      title: 'Recomendações sem acompanhamento de implementação',
      body: () => `Várias respostas em "Ainda não" na etapa de uso. O Guia destaca casos como o da Costa Rica e do Chile, onde planos de ação formais e acompanhamento das recomendações ao longo do tempo são o que transforma avaliação em mudança de política — sem isso, o uso fica simbólico.`,
      ref: 'Etapa V — Uso e consolidação'
    },
    {
      id: 'r-normativo-isolado',
      severity: 'info',
      predicate: (s) => s['et-3'].pct !== null && s['et-3'].pct >= 60 && s['et-4'].answered >= 2 && s['et-4'].pct < 30,
      title: 'Norma sem prática',
      body: () => `Há base normativa estabelecida, mas a implementação parece pouco avançada. O Guia alerta para o risco do <em>formalismo</em>: leis e decretos por si sós não geram avaliações. Vale verificar se o orçamento, as unidades técnicas e os fluxos previstos na norma estão de fato em operação.`,
      ref: 'Etapa III — Arranjo normativo'
    },
    {
      id: 'r-capacidades-implicito',
      severity: 'info',
      predicate: (s) => {
        // Se há muitos "Em construção" no geral (sinal de capacidades ainda crescendo)
        let mid = 0; let totalAnswered = 0;
        Object.values(s).forEach(b => {
          mid += b.mid;
          totalAnswered += b.ok + b.mid + b.no;
        });
        return totalAnswered >= 8 && mid / totalAnswered >= 0.5;
      },
      title: 'Muita coisa em construção ao mesmo tempo',
      body: () => `Mais da metade das suas respostas marca "Em construção". Isso é sinal de movimento — mas também de risco de dispersão. O Guia recomenda <strong>priorizar finalidades realistas</strong> e consolidar aprendizados antes de expandir escopo. Que um ou dois itens da sua lista virem prioridade real do próximo ciclo?`,
      ref: 'Reflexões sobre o processo'
    }
  ];

  function generateAlerts(scores) {
    return RULES
      .filter(r => {
        try { return r.predicate(scores); }
        catch (e) { return false; }
      })
      .map(r => ({
        id: r.id,
        severity: r.severity,
        title: r.title,
        body: r.body(scores),
        ref: r.ref,
      }));
  }

  // ---------- Render do resultado ----------
  function renderResultado() {
    const scores = scoreByEtapa();
    const alerts = generateAlerts(scores);

    // Cards
    const grid = document.getElementById('score-grid');
    if (grid) {
      grid.innerHTML = ETAPAS.map(et => {
        const b = scores[et.id];
        const pct = b.pct;
        const display = pct === null ? '—' : `${pct}%`;
        const subText = pct === null
          ? `${b.answered} de ${b.total} resp.`
          : `${b.answered} de ${b.total} resp.`;
        return `
          <div class="score-card ${et.id}">
            <div class="score-tag">Etapa ${et.num}</div>
            <div class="score-name">${et.nome}</div>
            <div class="score-bar"><div class="score-bar-fill" style="width: ${pct === null ? 0 : pct}%"></div></div>
            <div class="score-numbers"><span>${subText}</span><strong>${display}</strong></div>
          </div>
        `;
      }).join('');
    }

    // Alertas
    const alertsBox = document.getElementById('alerts-box');
    if (alertsBox) {
      if (alerts.length === 0) {
        alertsBox.innerHTML = `<div class="alerts-empty">Nenhum ponto de atenção identificado pelas regras automáticas. Releia suas anotações por etapa — elas costumam guardar as nuances mais importantes do diagnóstico.</div>`;
      } else {
        alertsBox.innerHTML = alerts.map(a => `
          <div class="alert alert-${a.severity}">
            <div class="alert-label">${labelFor(a.severity)}</div>
            <h4>${a.title}</h4>
            <p>${a.body}</p>
            <div class="alert-ref">${a.ref}</div>
          </div>
        `).join('');
      }
    }

    const wrap = document.getElementById('resultado');
    if (wrap) {
      wrap.classList.remove('hidden');
      // Scroll suave
      setTimeout(() => {
        wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  function labelFor(severity) {
    switch (severity) {
      case 'critical': return 'Atenção crítica';
      case 'warn':     return 'Ponto de atenção';
      case 'info':     return 'Para reflexão';
      case 'good':     return 'Está indo bem';
      default:         return 'Observação';
    }
  }

  // ---------- Ações (botões) ----------
  function initActions() {
    const btnGerar = document.getElementById('btn-gerar');
    if (btnGerar) btnGerar.addEventListener('click', renderResultado);

    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) btnPrint.addEventListener('click', () => window.print());

    const btnPrintTop = document.getElementById('btn-print-top');
    if (btnPrintTop) btnPrintTop.addEventListener('click', () => window.print());

    const btnClear = document.getElementById('btn-clear');
    if (btnClear) btnClear.addEventListener('click', () => {
      if (confirm('Apagar todas as respostas e anotações deste diagnóstico? Esta ação não pode ser desfeita.')) {
        clearAll();
      }
    });

    const btnExport = document.getElementById('btn-export');
    if (btnExport) btnExport.addEventListener('click', exportMarkdown);
  }

  function clearAll() {
    state = { answers: {}, notes: {}, general: '' };
    localStorage.removeItem(STORAGE_KEY);

    document.querySelectorAll('.dq-option.is-checked').forEach(el => el.classList.remove('is-checked'));
    document.querySelectorAll('.dq-note').forEach(ta => { ta.value = ''; });
    const gen = document.getElementById('general-notes');
    if (gen) gen.value = '';

    const wrap = document.getElementById('resultado');
    if (wrap) wrap.classList.add('hidden');

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------- Export Markdown ----------
  function exportMarkdown() {
    const scores = scoreByEtapa();
    const alerts = generateAlerts(scores);
    const today = new Date().toLocaleDateString('pt-BR');

    const lines = [];
    lines.push('# Diagnóstico do meu sistema de M&A');
    lines.push('');
    lines.push(`*Gerado em ${today} a partir do Checklist FGV CLEAR × TCE-ES.*`);
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('## Pontuação por etapa');
    lines.push('');

    ETAPAS.forEach(et => {
      const b = scores[et.id];
      const pct = b.pct === null ? '—' : `${b.pct}%`;
      lines.push(`- **${et.num}. ${et.nome}** — ${pct}  *(respostas: ${b.ok} consolidadas · ${b.mid} em construção · ${b.no} ausentes · ${b.na} não se aplicam · de ${b.total} totais)*`);
    });
    lines.push('');

    if (alerts.length > 0) {
      lines.push('## Pontos de atenção identificados');
      lines.push('');
      alerts.forEach(a => {
        lines.push(`### ${labelFor(a.severity)}: ${a.title}`);
        lines.push('');
        // remove HTML do body
        const bodyText = a.body.replace(/<[^>]+>/g, '');
        lines.push(bodyText);
        lines.push('');
        lines.push(`*Referência: ${a.ref}*`);
        lines.push('');
      });
    }

    // Anotações por pergunta
    const notedQs = Object.keys(state.notes);
    if (notedQs.length > 0) {
      lines.push('## Anotações por pergunta');
      lines.push('');
      notedQs.forEach(qid => {
        const el = document.querySelector(`.diagnostico-question[data-qid="${qid}"]`);
        const text = el ? (el.querySelector('.dq-text')?.textContent || qid) : qid;
        lines.push(`**${text.trim()}**`);
        lines.push('');
        lines.push(`> ${state.notes[qid].replace(/\n/g, '\n> ')}`);
        lines.push('');
      });
    }

    if (state.general && state.general.trim()) {
      lines.push('## Anotações gerais');
      lines.push('');
      lines.push(state.general);
      lines.push('');
    }

    lines.push('---');
    lines.push('');
    lines.push('*Checklist para construção de sistemas de M&A — FGV CLEAR × TCE-ES · Convênio nº 00017/2024-4C*');
    lines.push('');
    lines.push('*Derivado do Guia de construção de sistemas de monitoramento e avaliação de políticas públicas (FGV CLEAR, 2026).*');

    const md = lines.join('\n');
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-ma-${dateSlug()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function dateSlug() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
})();
