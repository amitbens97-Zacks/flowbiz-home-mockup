// Developer notes for the new home page, the demo situations (Shift+D).
import { html, Icon, cx } from './lib.js';
import { GENDER, setDemoGender, SCENARIOS } from './data.js';

const NOTES = [
  {
    title: 'מה זה',
    items: [
      'הצעה לדף בית חדש: במקום מפת שלבים או דשבורד, העסק כתוב בכמה משפטים עם חורים. כל שלב במסע ממלא חור אחד.',
      'לכל מסך אלמנט מרכזי אחד: בזמן הבנייה זה דף העסק. משלב 11 שורת החודש עולה למעלה והדף מתכווץ.',
      'כיוון לבדיקה, לא אפיון סגור. לפני עיצוב מלא: בדיקת 5 שניות מול 5 משתמשים מהנישה.',
    ],
  },
  {
    title: 'שלושה חומרים, שלוש משמעויות',
    items: [
      'נייר (כתוב ישר על המחברת): מה שנכון על העסק. המשפטים ושורת החודש.',
      'פתק: משהו שצריך לעשות. שלוש המשימות של השבוע.',
      'פאנל לבן: כלי שעובדים בתוכו. כאן רק בחלונות שנפתחים.',
    ],
  },
  {
    title: 'החורים',
    items: [
      'מלא (כחול, קו עיפרון): השלב הושלם. הטקסט נלקח מהתשובות של השלב (business_plans.data), לא נכתב מחדש.',
      'הבא (מרקר ועיפרון): השלב הבא במסע. לחיצה = אותו דבר כמו הכפתור הראשי.',
      'ריק (מקווקו): שלב שעוד לא נעשה. לחיצה פותחת חלון עם שם השלב, הזמן, ומה ייכתב. שלב נעול עובר דרך אותו דיאלוג דילוג שכבר הוגדר.',
      'לחיצה על חור מלא פותחת את התוצרים של השלב ו"עריכה בשלב". לכן אין עמוד "קבצים" נפרד.',
      'השם ידוע מההרשמה, כך שהדף אף פעם לא ריק לגמרי.',
      'ניסוח המשפטים: טקסט קבוע של FlowBiz (ניתן לעריכה בפאנל הניהול). רק תוכן החורים מגיע מהמשתמש.',
    ],
  },
  {
    title: 'הדבר הבא',
    items: [
      'תמיד פעולה אחת וכפתור ראשי אחד, באותו מקום.',
      'עד שלב 10: השלב הבא במסע. משלב 11: הפוקוס של השבוע מ"צייר לי שבוע מושלם", והשלב הבא במסע יורד לשורה קטנה.',
      'במוקאפ הכפתור מדמה שהשלב הסתיים: החור נכתב, קונפטי, והסכום עולה. במערכת הוא פותח את השלב.',
    ],
  },
  {
    title: 'התפריט',
    items: [
      'ארבעה מקומות במקום שישה: בית, השבוע (יומן + משימות), לקוחות (לידים), כספים. "קבצים" יושב על החורים.',
      '"לקוחות" נפתח בשלב 11, "כספים" אחרי "העסק במספרים". עד אז הם אפורים עם הסבר.',
      'תפריט עליון במחשב, פס תחתון בנייד, אותם ארבעה פריטים.',
      'המפה המלאה היא תת-עמוד: "המסע המלא".',
    ],
  },
  {
    title: 'מה לא במוקאפ',
    items: ['חומת התשלום, הדרגות והתגים, חגיגת סוף פרק: נשארים כפי שהוגדרו.', 'העמודים "השבוע", "לקוחות", "כספים": כאן רק מה נכנס לכל אחד.'],
  },
];

export function DevPanel({ open, onClose, scenario, onScenario, onReset }) {
  return html`<aside
    class=${cx('fixed inset-y-0 end-0 z-[70] flex w-full max-w-sm flex-col border-s border-slate-200 bg-white shadow-2xl transition-transform duration-200', open ? 'translate-x-0' : '-translate-x-full pointer-events-none invisible')}
    aria-hidden=${!open}
  >
    <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <h2 class="flex items-center gap-2 text-[16px] font-bold text-slate-900"><${Icon} name="code-xml" size=${17} /> הערות למפתחים</h2>
      <button type="button" onClick=${onClose} aria-label="סגירה" class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 cursor-pointer"><${Icon} name="x" size=${18} /></button>
    </div>
    <div class="thin-scroll flex-1 overflow-y-auto p-4 text-[14px] leading-relaxed text-slate-700">
      <section class="mb-4 rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-3">
        <h3 class="mb-2 font-bold text-brand-900">המצב לדוגמה</h3>
        <div class="flex flex-col gap-1.5" role="radiogroup" aria-label="המצב לדוגמה">
          ${Object.entries(SCENARIOS).map(
            ([id, sc]) => html`<button key=${id} type="button" role="radio" aria-checked=${scenario === id} onClick=${() => onScenario(id)} class=${cx('rounded-lg border px-3 py-1.5 text-start cursor-pointer', scenario === id ? 'border-brand-600 bg-brand-100 text-brand-600' : 'border-brand-200 bg-white text-brand-900')}><b class="block text-[14px]">${sc.label}</b><small class="text-[12px]">${sc.sub}</small></button>`,
          )}
        </div>
        <div class="mt-3 grid grid-cols-2 gap-1.5" role="radiogroup" aria-label="המשתמש לדוגמה">
          ${[
            ['f', 'נועה', 'פנייה בלשון נקבה'],
            ['m', 'נועם', 'פנייה בלשון זכר'],
          ].map(
            ([id, name, sub]) => html`<button key=${id} type="button" role="radio" aria-checked=${GENDER === id} onClick=${() => GENDER !== id && setDemoGender(id)} class=${cx('rounded-lg border px-3 py-1.5 text-start cursor-pointer', GENDER === id ? 'border-brand-600 bg-brand-100 text-brand-600' : 'border-brand-200 bg-white text-brand-900')}><b class="block text-[14px]">${name}</b><small class="text-[12px]">${sub}</small></button>`,
          )}
        </div>
        <button type="button" class="mt-2 text-[13px] font-bold text-brand-600 underline underline-offset-2 cursor-pointer" onClick=${onReset}>להתחיל מההתחלה</button>
      </section>
      ${NOTES.map(
        (n) => html`<section key=${n.title} class="mb-4 p-1">
          <h3 class="mb-1.5 font-bold text-slate-900">${n.title}</h3>
          <ul class="list-disc space-y-1 ps-4">${n.items.map((t) => html`<li>${t}</li>`)}</ul>
        </section>`,
      )}
    </div>
  </aside>`;
}
