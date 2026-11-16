// "דף העסק": the business written as a few plain sentences with blanks, straight on the notebook
// page (no cards). Every journey step fills one blank; a tap on an empty blank opens its step,
// a tap on a filled one opens what the step produced. Under it, the month in one line.
import { html, Icon, PencilCheck, cx, money } from './lib.js';
import { Typed } from './components.js';
import { CHAPTERS, STEPS, PAGE, USER, MONTH, LEADS_STEP, NUMBERS_STEP, GENDER } from './data.js';

function Blank({ i, current, fresh, onOpen }) {
  const st = STEPS[i];
  const state = i < current ? 'filled' : i === current ? 'next' : 'empty';
  const label = state === 'filled' ? `${st.text}. נכתב בשלב "${st.name}". לחיצה פותחת את התוצרים` : `${st.ph}. ${state === 'next' ? 'השלב הבא' : 'שלב'}: "${st.name}", כ-${st.min} דקות`;
  // A span, not a button: the text of a blank must be able to wrap to the next line like any other words.
  return html`<span role="button" tabindex="0" class=${cx('bz-blank', `is-${state}`, fresh && 'is-fresh')} aria-label=${label} title=${state === 'filled' ? `מהשלב "${st.name}"` : `"${st.name}" · כ-${st.min} דק׳`} onClick=${() => onOpen(i)} onKeyDown=${(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(i))}>${state === 'filled' ? (fresh ? html`<${Typed} id=${`fill-${i}`} text=${st.text} speed=${110} />` : st.text) : html`${state === 'next' && html`<${Icon} name="pencil" size=${16} class="bz-pen" />`}${st.ph}`}</span>`;
}

export function BusinessPage({ current, fresh, compact, onOpen }) {
  const curCh = current < STEPS.length ? STEPS[current].ch : 99;
  return html`<div class=${cx('bz-page', compact && 'is-compact')}>
    ${PAGE.map((row, ci) => {
      const ch = CHAPTERS[ci];
      const done = ci < curCh;
      return html`<div key=${ci} class=${cx('bz-row', done && 'is-done', ci === curCh && 'is-now', ci > curCh && 'is-later')}>
        <span class="bz-tag">${done && html`<${PencilCheck} size=${19} color="#0038b8" weight=${3.2} />`}${(GENDER === 'f' && ch.tagF) || ch.tag}</span>
        <p class="bz-text">
          ${row.map((part) =>
            typeof part === 'number'
              ? html`<${Blank} key=${part} i=${part} current=${current} fresh=${fresh === part} onOpen=${onOpen} />`
              : part === 'name'
                ? html`<b class="bz-name">${USER.firstName}</b>`
                : part,
          )}
        </p>
      </div>`;
    })}
  </div>`;
}

// The month in one line: פניות → שיחות → לקוחות → כסף מול היעד. Until step 11 only the goal is known.
export function MonthLine({ current, big }) {
  if (current <= NUMBERS_STEP) return null;
  const live = current > LEADS_STEP;
  const m = MONTH;
  const p = Math.min(100, Math.round((m.revenue / m.goal) * 100));
  const cell = (label, v) => html`<div class="bz-num"><small>${label}</small><b class=${cx(!live && 'is-off')}>${live ? v : '·'}</b></div>`;
  const arrow = html`<${Icon} name="arrow-left" size=${big ? 20 : 16} class="shrink-0 text-brand-300" />`;
  return html`<div class=${cx('bz-month', big && 'is-big')} aria-label="החודש שלך">
    ${cell('פניות', m.leads)}${arrow}${cell('שיחות', m.calls)}${arrow}${cell('לקוחות', m.clients)}${arrow}
    <div class="bz-num is-money">
      <small>נכנס החודש</small>
      <b class=${cx(!live && 'is-off')}>${live ? money(m.revenue) : money(0)}<i>מתוך ${money(m.goal)}</i></b>
      <span class="bz-bar" role="img" aria-label=${`${live ? p : 0}% מהיעד`}><i style=${{ width: `${live ? p : 0}%` }}></i></span>
    </div>
    ${!live && html`<span class="bz-month-note">המספרים מתחילים לזוז ב"לקוחות משלמים"</span>`}
  </div>`;
}
