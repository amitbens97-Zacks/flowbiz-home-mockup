// The new FlowBiz home page: "דף העסק". One action on top (always in the same place), the business
// written as sentences with blanks in the middle (every journey step fills one), "השבוע שלי" as three
// notes beside it. From step 11 the month's numbers move up and the page shrinks.
// Menu: בית · השבוע · לקוחות · כספים. The journey map is a sub-page ("המסע המלא").
// Link params: ?scenario=new|mid|sell|run, ?user=m|f, ?embed = phone layout. Shift+D opens the notes.
import { html, render, useState, useEffect, useRef, Icon, PencilCheck, cx, money, confetti, confettiBurst } from './lib.js';
import { Logo, Mark, Button, Note, PartnerBubble, Toast } from './components.js';
import { Sheet } from './ui.js';
import { BusinessPage, MonthLine } from './page.js';
import { EXPLAIN, ExplainButton, SharkTalk } from './explain.js';
import { DevPanel } from './devnotes.js';
import { USER, CHAPTERS, STEPS, TOTAL, NUMBERS_STEP, LEADS_STEP, SCENARIOS, DEFAULT_SCENARIO, WEEK, FOCUS, PAGES, GENDER, g } from './data.js';
import { EMBED, IS_PHONE, readView, saveView, writeHandoff, takeHandoff, applyPhoneViewport, ViewToggle, PhonePreview } from './viewswitch.js';

const params = new URLSearchParams(location.search);
const NAV = [
  ['home', 'בית', 'house'],
  ['week', 'השבוע', 'calendar-range'],
  ['clients', 'לקוחות', 'users'],
  ['money', 'כספים', 'wallet'],
];
const lockOf = (current) => ({
  clients: current < LEADS_STEP ? 'נפתח בשלב 11, "לקוחות משלמים"' : null,
  money: current <= NUMBERS_STEP ? 'נפתח אחרי "העסק במספרים"' : null,
});
const savedOf = (current) => STEPS.slice(0, current).reduce((a, s) => a + s.save, 0);
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'בוקר טוב' : h < 17 ? 'צהריים טובים' : 'ערב טוב';
};

function TopNav({ tab, onTab, locks, saved, tools }) {
  return html`<header class="no-print z-20 shrink-0 border-b border-line bg-surface">
    <div class="flex h-16 items-center gap-3 px-3 md:gap-6 md:px-7">
      <${Logo} size="sm" />
      <nav class="hidden items-center gap-1 md:flex" aria-label="תפריט ראשי">
        ${NAV.map(
          ([id, label, icon]) => html`<button key=${id} type="button" aria-current=${tab === id ? 'page' : undefined} title=${locks[id] || undefined} onClick=${() => onTab(id)}
            class=${cx('flex h-10 items-center gap-2 rounded-xl px-3.5 text-[14px] font-semibold transition-colors cursor-pointer', tab === id ? 'bg-brand-100 text-brand-600' : locks[id] ? 'text-faint hover:bg-canvas' : 'text-ink hover:bg-brand-50')}>
            <${Icon} name=${locks[id] ? 'lock' : icon} size=${17} />${label}
          </button>`,
        )}
      </nav>
      <div class="ms-auto flex items-center gap-2">
        <span class="flex flex-col items-end leading-tight" title="מה שהיה עולה לבנות את זה אצל אנשי מקצוע">
          <small class="text-[12px] font-semibold text-muted">חסכת עד עכשיו</small>
          <b key=${saved} class="pop-in font-display text-[18px] font-extrabold tabular-nums text-money">${money(saved)}</b>
        </span>
        ${tools}
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 font-display text-[16px] font-bold text-white max-sm:hidden" title=${USER.fullName}>${USER.firstName[0]}</span>
      </div>
    </div>
  </header>`;
}

function MobileNav({ tab, onTab, locks }) {
  return html`<nav class="no-print pb-safe grid shrink-0 grid-cols-4 border-t border-line bg-surface md:hidden" aria-label="תפריט ראשי">
    ${NAV.map(
      ([id, label, icon]) => html`<button key=${id} type="button" aria-current=${tab === id ? 'page' : undefined} onClick=${() => onTab(id)}
        class=${cx('flex flex-col items-center gap-0.5 pt-2 text-[12px] font-semibold cursor-pointer', tab === id ? 'text-brand-600' : locks[id] ? 'text-faint' : 'text-ink')}>
        <${Icon} name=${locks[id] ? 'lock' : icon} size=${20} />${label}
      </button>`,
    )}
  </nav>`;
}

// One action, one primary button, always here.
function NextAction({ current, run, busy, onStart, onFocus, onJourney }) {
  const step = STEPS[current];
  const title = run ? FOCUS.title : step ? ['', step.name, ''] : ['הדף ', 'מלא', ''];
  const meta = run ? FOCUS.meta : step ? `כ-${step.min} דקות · ממלא בדף את "${step.ph}"` : 'המסע הושלם';
  return html`<section class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div class="fb-heading min-w-0">
      <span class="fb-eyebrow">${greeting()}, ${USER.firstName} · הדבר הבא</span>
      <h1 class="fb-h1 text-[28px] md:text-[36px]">${title[0]}<${Mark}>${title[1]}<//>${title[2]}</h1>
      <p>${meta}</p>
    </div>
    <div class="flex shrink-0 flex-col items-stretch gap-1.5 md:items-end">
      <span data-primary>
        <${Button} class="max-md:w-full" disabled=${busy} onClick=${run ? onFocus : onStart}>
          ${run ? FOCUS.cta : busy ? 'כותבים בדף...' : 'מתחילים'}<${Icon} name="arrow-left" size=${20} />
        <//>
      </span>
      ${run && step
        ? html`<button type="button" class="fb-btn fb-btn-text !h-8 !text-[14px]" disabled=${busy} onClick=${onStart}>השלב הבא במסע: ${step.name} · ${step.min} דק׳</button>`
        : html`<button type="button" class="fb-btn fb-btn-text !h-8 !text-[14px]" onClick=${onJourney}><${Icon} name="map" size=${15} />המסע המלא</button>`}
    </div>
  </section>`;
}

// "השבוע שלי": three notes. A note = something to do.
function WeekNotes({ tasks, done, onToggle, onAll }) {
  const left = tasks.filter((_, i) => !done[i]).length;
  return html`<aside class="flex min-w-0 flex-col">
    <div class="mb-4 flex items-center justify-between">
      <span class="fb-eyebrow">השבוע שלי</span>
      <button type="button" class="text-[14px] font-semibold text-brand-600 hover:underline cursor-pointer" onClick=${onAll}>לכל השבוע</button>
    </div>
    <div class="flex flex-col gap-5 max-lg:sm:flex-row">
      ${tasks.map(
        (t, i) => html`<${Note} key=${t} tone=${i === 1 ? 'white' : undefined} tilt=${[-1.2, 0.9, -0.6][i]} class="bz-task !pb-4 !pt-7 max-lg:sm:flex-1">
          <button type="button" role="checkbox" aria-checked=${!!done[i]} onClick=${(e) => onToggle(i, e.currentTarget)} class="flex w-full items-start gap-2.5 text-start cursor-pointer">
            <span class=${cx('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2', done[i] ? 'border-brand-600 bg-white' : 'border-ink/40 bg-white/60')}>${done[i] && html`<${PencilCheck} size=${17} color="#0038b8" weight=${3.2} />`}</span>
            <span class=${cx('text-[16px] font-semibold leading-snug', done[i] && 'text-muted line-through decoration-brand-400')}>${t}</span>
          </button>
        <//>`,
      )}
    </div>
    <p class="fb-meta mt-4">${left === 0 ? 'שלוש מתוך שלוש. שבוע מלא!' : `${3 - left} מתוך 3 בוצעו`}</p>
  </aside>`;
}

function BlankSheet({ i, current, onClose, onStart, notify }) {
  const st = STEPS[i];
  const filled = i < current;
  const next = i === current;
  return html`<${Sheet} title=${st.name} onClose=${onClose}
    footer=${filled
      ? html`<span class="fb-meta">נכתב בפרק "${CHAPTERS[st.ch].title}"</span><${Button} variant="secondary" onClick=${() => notify(`במערכת: "${st.name}" נפתח לעריכה`, 'pencil')}>עריכה בשלב<//>`
      : next
        ? html`<span class="fb-meta">כ-${st.min} דקות</span><${Button} onClick=${() => (onClose(), onStart())}>מתחילים<${Icon} name="arrow-left" size=${20} /><//>`
        : html`<button type="button" class="fb-btn fb-btn-text" onClick=${() => notify('במערכת: הכריש ממליץ על הסדר, ואפשר לדלג בכל זאת', 'info')}>לדלג לכאן</button><${Button} variant="secondary" onClick=${onClose}>להמשיך לפי הסדר<//>`}>
    ${filled
      ? html`<p class="mb-1 text-[14px] font-bold text-muted">כתוב בדף</p>
          <p class="mb-5 font-display text-[18px] font-bold text-brand-600">${st.text}</p>
          <p class="mb-2 text-[14px] font-bold text-muted">התוצרים של השלב</p>
          <div class="flex flex-col gap-2">
            ${st.out.map((o) => html`<button key=${o} type="button" class="lp-option" onClick=${() => notify(`במערכת: "${o}" נפתח`, 'file-text')}><${Icon} name="file-text" size=${20} class="text-brand-600" /><b class="flex-1 text-[16px] font-semibold">${o}</b><${Icon} name="arrow-up-left" size=${16} class="text-muted" /></button>`)}
          </div>`
      : html`<p class="mb-1 text-[14px] font-bold text-muted">השלב הזה כותב בדף</p>
          <p class="mb-4 font-display text-[18px] font-bold text-ink">${st.ph}</p>
          <p class="text-[16px] text-ink">${next ? `זה השלב הבא. כ-${st.min} דקות.` : `קודם: "${STEPS[current].name}". השלב הזה מחכה בפרק "${CHAPTERS[st.ch].title}".`}</p>
          ${st.save > 0 && html`<p class="mt-2 text-[14px] text-muted">אצל איש מקצוע זה עולה בערך <b class="text-money">${money(st.save)}</b>.</p>`}`}
  <//>`;
}

// The journey map as a sub-page: the same progress, by chapters.
function JourneySheet({ current, onClose, onOpen }) {
  const curCh = current < TOTAL ? STEPS[current].ch : 99;
  const rank = curCh > 0 ? CHAPTERS[Math.min(curCh, CHAPTERS.length) - 1].rank[GENDER === 'f' ? 1 : 0] : g('מתחיל', 'מתחילה');
  return html`<${Sheet} title="המסע המלא" wide onClose=${onClose} footer=${html`<span class="fb-meta">${Math.min(current, TOTAL)} מתוך ${TOTAL} שלבים · הדרגה שלך: <b class="text-ink">${rank}</b></span><${Button} variant="secondary" onClick=${onClose}>חזרה לדף<//>`}>
    <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      ${CHAPTERS.map(
        (c, ci) => html`<section key=${ci}>
          <h3 class=${cx('mb-1.5 flex items-center gap-2 font-display text-[16px] font-bold', ci > curCh ? 'text-muted' : 'text-ink')}>${ci < curCh && html`<${PencilCheck} size=${16} color="#0038b8" weight=${3} />`}פרק ${ci + 1} · ${c.title}</h3>
          <ul class="flex flex-col gap-1">
            ${STEPS.map((s, i) => ({ s, i }))
              .filter(({ s }) => s.ch === ci)
              .map(
                ({ s, i }) => html`<li key=${i}><button type="button" onClick=${() => onOpen(i)} class=${cx('flex h-10 w-full items-center gap-2 rounded-lg px-2.5 text-start text-[14px] font-semibold cursor-pointer', i === current ? 'bg-brand-100 text-brand-600' : i < current ? 'text-ink hover:bg-white' : 'text-muted hover:bg-white')}>
                  <span class="grid h-5 w-5 shrink-0 place-items-center">${i < current ? html`<${PencilCheck} size=${15} color="#0038b8" weight=${3} />` : i === current ? html`<${Icon} name="pencil" size=${15} />` : html`<i class="h-3 w-3 rounded-full border-[1.5px] border-dashed border-faint"></i>`}</span>
                  <span class="flex-1 truncate">${i + 1}. ${s.name}</span><small class="text-[12px] font-semibold text-muted">${s.min} דק׳</small>
                </button></li>`,
              )}
          </ul>
        </section>`,
      )}
    </div>
  <//>`;
}

// The other menu pages are not part of this mockup: one line on what moved into each.
function Placeholder({ id, onHome }) {
  const p = PAGES[id];
  return html`<div class="mx-auto flex h-full max-w-[720px] flex-col justify-center px-5 py-8 md:px-10">
    <div class="fb-heading mb-5">
      <span class="fb-eyebrow">במקום: ${p.from}</span>
      <h1 class="fb-h1 text-[28px] md:text-[36px]">${p.title[0]}<${Mark}>${p.title[1]}<//>${p.title[2]}</h1>
    </div>
    <ul class="flex flex-col gap-3 text-[18px]">
      ${p.items.map((t) => html`<li key=${t} class="flex items-start gap-3"><${Icon} name=${p.icon} size=${20} class="mt-1 text-brand-600" />${t}</li>`)}
    </ul>
    <p class="fb-meta mt-6">העמוד עצמו לא חלק מהמוקאפ הזה.</p>
    <div class="mt-4"><${Button} variant="secondary" onClick=${onHome}>חזרה לבית<//></div>
  </div>`;
}

function App({ view, onViewChange }) {
  const handoff = useRef(takeHandoff()).current;
  const startSc = SCENARIOS[params.get('scenario')] ? params.get('scenario') : DEFAULT_SCENARIO;
  const fresh0 = (id) => ({ scId: id, current: SCENARIOS[id].current, fresh: null, done: {}, bonus: 0 });
  const [s, setS] = useState(handoff?.state || fresh0(startSc));
  const [tab, setTab] = useState('home');
  const [sheet, setSheet] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [dev, setDev] = useState(false);
  const [unread, setUnread] = useState(true);
  const [explain, setExplain] = useState(0);
  const timers = useRef({});

  useEffect(() => {
    const open = () => (setTab('home'), setExplain((n) => n + 1));
    const k = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      if (e.key === 'D' && e.shiftKey && !typing) setDev((d) => !d);
    };
    window.addEventListener('fb:explain', open);
    window.addEventListener('keydown', k);
    return () => (window.removeEventListener('fb:explain', open), window.removeEventListener('keydown', k));
  }, []);
  useEffect(() => {
    window.__flowbizSnapshot = () => ({ state: s });
  });
  useEffect(() => {
    const q = new URLSearchParams();
    if (s.scId !== DEFAULT_SCENARIO) q.set('scenario', s.scId);
    if (EMBED) q.set('embed', '1');
    if (params.get('user')) q.set('user', params.get('user'));
    const qs = q.toString();
    history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : ''));
  }, [s.scId]);

  const notify = (text, icon = 'info', undo) => {
    setToast({ id: Date.now(), text, icon, undo });
    clearTimeout(timers.current.toast);
    timers.current.toast = setTimeout(() => setToast(null), undo ? 5000 : 2800);
  };
  const undoToast = () => (toast?.undo?.(), setToast(null));

  const { current } = s;
  const run = current > LEADS_STEP;
  const locks = lockOf(current);
  const tasks = WEEK[s.scId];

  // The mockup skips the step itself: the blank writes itself, as it would on the way back from a finished step.
  const startStep = () => {
    if (busy || current >= TOTAL) return;
    const i = current;
    const st = STEPS[i];
    setBusy(true);
    timers.current.step = setTimeout(() => {
      setBusy(false);
      setS((x) => ({ ...x, current: i + 1, fresh: i }));
      const chapterEnd = !STEPS[i + 1] || STEPS[i + 1].ch !== st.ch;
      confetti(chapterEnd ? 'chapter' : 'step');
      notify(`"${st.name}" הושלם${st.save ? ` · +${money(st.save)}` : ''}${chapterEnd ? ` · סוף פרק ${st.ch + 1}` : ''}`, 'party-popper', () => setS((x) => ({ ...x, current: i, fresh: null })));
    }, 900);
  };
  const toggleTask = (i, el) => {
    const on = !s.done[i];
    setS((x) => ({ ...x, done: { ...x.done, [i]: on } }));
    if (on) confettiBurst(el);
  };
  const goTab = (id) => {
    if (locks[id]) return notify(locks[id], 'lock');
    setTab(id);
  };
  const changeScenario = (id) => {
    clearTimeout(timers.current.step);
    setBusy(false);
    setS(fresh0(id));
    setTab('home');
    setSheet(null);
    setDev(false);
    notify(`מצב: ${SCENARIOS[id].label}`, 'repeat');
  };

  const sharkLine =
    current === 0
      ? 'כל עסק מתחיל בדף ריק. ממלאים חור אחד בכל פעם.'
      : current >= TOTAL
        ? 'הדף מלא. מכאן העבודה היא השבוע והמספרים.'
        : run
          ? 'רוב הכסף נמצא בפולואפ. דנה מחכה כבר שלושה ימים.'
          : `${current} חורים כבר מלאים. הבא בתור: ${STEPS[current].ph}.`;

  const tools = html`${!EMBED && html`<${ViewToggle} view=${view} onChange=${onViewChange} class="max-md:hidden" />`}
    <button type="button" onClick=${() => setDev((d) => !d)} title="הערות למפתחים (Shift+D)" aria-label="הערות למפתחים" class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-brand-50 hover:text-brand-600 cursor-pointer"><${Icon} name="code-xml" size=${18} /></button>
    <${ExplainButton} />`;

  const count = html`<span class="fb-meta">${Math.min(current, TOTAL)} מתוך ${TOTAL} כתובים</span>`;
  const home = html`<div class="mx-auto flex min-h-full max-w-[1280px] flex-col gap-6 px-5 pb-24 pt-6 md:px-10 lg:h-full lg:gap-7 lg:pb-6 lg:pt-7">
    <${NextAction} current=${current} run=${run} busy=${busy} onStart=${startStep} onFocus=${() => notify('במערכת: ההודעה לדנה נפתחת ב"לקוחות"', 'message-circle')} onJourney=${() => setSheet({ type: 'journey' })} />
    <div class="grid min-h-0 flex-1 gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
      <section class="min-w-0">
        ${run &&
        html`<div class="mb-2 flex items-center justify-between"><span class="fb-eyebrow">החודש שלך</span><button type="button" class="text-[14px] font-semibold text-brand-600 hover:underline cursor-pointer" onClick=${() => goTab('money')}>לכספים</button></div>
          <${MonthLine} current=${current} big />`}
        <div class=${cx('mb-2 flex items-center justify-between', run && 'mt-6')}>
          <span class="fb-eyebrow">העסק שלך, בדף אחד</span>
          ${run ? html`<button type="button" class="text-[14px] font-semibold text-brand-600 hover:underline cursor-pointer" onClick=${() => setSheet({ type: 'journey' })}>המסע המלא</button>` : count}
        </div>
        <${BusinessPage} current=${current} fresh=${s.fresh} compact=${run} onOpen=${(i) => setSheet({ type: 'blank', i })} />
        ${!run && html`<${MonthLine} current=${current} />`}
      </section>
      <${WeekNotes} tasks=${tasks} done=${s.done} onToggle=${toggleTask} onAll=${() => goTab('week')} />
    </div>
  </div>`;

  return html`<div class="fb-notebook fb-margin flex h-dvh flex-col text-ink" dir="rtl">
    <${TopNav} tab=${tab} onTab=${goTab} locks=${locks} saved=${savedOf(current)} tools=${tools} />
    <main class="thin-scroll relative min-h-0 flex-1 overflow-y-auto">
      ${tab === 'home' ? home : html`<${Placeholder} id=${tab} onHome=${() => setTab('home')} />`}
      <${PartnerBubble} key=${sharkLine} message=${sharkLine} unread=${unread} onRead=${() => setUnread(false)} mood=${busy ? 'thinking' : s.fresh != null ? 'happy' : 'calm'} openKey=${explain} body=${explain > 0 && html`<${SharkTalk} key=${explain} />`} onClose=${() => setExplain(0)} />
    </main>
    <${MobileNav} tab=${tab} onTab=${goTab} locks=${locks} />
    ${sheet?.type === 'blank' && html`<${BlankSheet} i=${sheet.i} current=${current} onClose=${() => setSheet(null)} onStart=${startStep} notify=${notify} />`}
    ${sheet?.type === 'journey' && html`<${JourneySheet} current=${current} onClose=${() => setSheet(null)} onOpen=${(i) => setSheet({ type: 'blank', i })} />`}
    <${Toast} toast=${toast} onUndo=${undoToast} />
    <${DevPanel} open=${dev} onClose=${() => setDev(false)} scenario=${s.scId} onScenario=${changeScenario} onReset=${() => changeScenario(s.scId)} />
  </div>`;
}

function Root() {
  const [view, setView] = useState(readView);
  useEffect(() => applyPhoneViewport(view), [view]);
  const change = (v) => {
    if (v === 'mobile') {
      try {
        writeHandoff(window.__flowbizSnapshot?.());
      } catch {}
    }
    saveView(v);
    setView(v);
  };
  if (!EMBED && !IS_PHONE && view === 'mobile') return html`<${PhonePreview} onSwitch=${change} title="דף הבית החדש" />`;
  return html`<${App} view=${view} onViewChange=${change} />`;
}

applyPhoneViewport(readView());
render(html`<${Root} />`, document.getElementById('app'));
