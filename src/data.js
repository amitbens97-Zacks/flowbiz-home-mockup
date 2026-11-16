// Mock data for the new home page ("דף העסק"). In production: the journey from
// src/features/journey/constants.jsx, the answers from business_plans.data, the week from
// "צייר לי שבוע מושלם", the month's numbers from the leads table and the finance center.

// ---------- who the user is (?user=m or ?user=f, or the developer panel) ----------
const PROFILES = {
  f: { gender: 'f', firstName: 'נועה', fullName: 'נועה שחר' },
  m: { gender: 'm', firstName: 'נועם', fullName: 'נועם שחר' },
};
const GENDER_KEY = 'flowbiz-home-gender';
function pickGender() {
  try {
    const q = new URLSearchParams(location.search).get('user');
    if (q === 'f' || q === 'm') {
      localStorage.setItem(GENDER_KEY, q);
      return q;
    }
    return localStorage.getItem(GENDER_KEY) === 'm' ? 'm' : 'f';
  } catch {
    return 'f';
  }
}
export const GENDER = pickGender();
export const g = (m, f) => (GENDER === 'f' ? f : m);
export function setDemoGender(v) {
  try {
    localStorage.setItem(GENDER_KEY, v);
  } catch {}
  const u = new URL(location.href);
  u.searchParams.set('user', v);
  location.href = u.toString();
}

export const USER = { ...PROFILES[GENDER], business: 'כיוון חדש' };
export const PARTNER = { name: 'הכריש', role: 'השותף העסקי' };

// The journey (November 2026): 6 chapters, 15 steps. `save` = what the step would cost at a professional.
export const CHAPTERS = [
  { title: 'אפיון', tag: 'מי אני', rank: ['הפרויקטור', 'הפרויקטורית'] },
  { title: 'שביל הכסף', tag: 'מה אני מוכר', tagF: 'מה אני מוכרת', rank: ['האסטרטג', 'האסטרטגית'] },
  { title: 'בניית מותג אישי', tag: 'המותג שלי', rank: ['הפרזנטור', 'הפרזנטורית'] },
  { title: 'מביאים לקוחות', tag: 'איך מגיעים אליי', rank: ['הקלוזר', 'הקלוזרית'] },
  { title: 'מגדילים מכירות', tag: 'איך אני מוכר', tagF: 'איך אני מוכרת', rank: ['הבר סמכא', 'בת סמכא'] },
  { title: 'העסק שתמיד רצית', tag: 'איך אני גדל', tagF: 'איך אני גדלה', rank: ['המאסטר', 'המאסטרית'] },
];

// Each step fills one blank on the business page. `ph` = what the empty blank says,
// `text` = what the step writes there, `out` = the step's outputs (they live on the blank,
// so there is no separate "קבצים" page).
export const STEPS = [
  { ch: 0, name: 'מציאת רעיון', min: 10, save: 400, optional: true, ph: 'הרעיון שלך', text: 'ללוות אנשים שתקועים בעבודה', out: ['שלושת הרעיונות שנבדקו'] },
  { ch: 0, name: 'אני והעסק', min: 20, save: 800, ph: 'מה הניסיון שלך', text: g('מאמן קריירה, 9 שנים בגיוס עובדים', 'מאמנת קריירה, 9 שנים בגיוס עובדים'), out: ['אפיון העסק (PDF)'] },
  { ch: 1, name: 'בניית סל מוצרים', min: 20, save: 800, ph: 'המוצר המרכזי והמחיר', text: 'ליווי של 6 מפגשים ב-2,800 ₪', out: ['תעודת זהות מוצרית (PDF)', 'סל המוצרים המלא'] },
  { ch: 1, name: 'צייד הלקוחות', min: 15, save: 600, ph: 'הלקוח המדויק', text: 'שכיר בן 30-45 שרוצה שינוי ולא יודע לאן', out: ['פרופיל הלקוח (PDF)'] },
  { ch: 1, name: 'העסק במספרים', min: 20, save: 1100, ph: 'היעד החודשי', text: '14,000 ₪ בחודש, 5 לקוחות', out: ['התוכנית העסקית שלך (PDF)'] },
  { ch: 2, name: 'שם ולוגו', min: 25, save: 1300, ph: 'שם העסק', text: 'כיוון חדש', out: ['לוגו (PNG, SVG)', 'צבעי המותג'] },
  { ch: 2, name: 'דף המסרים', min: 15, save: 500, ph: 'ההבטחה שלך', text: 'עבודה שרוצים לקום אליה בבוקר, תוך 3 חודשים', out: ['דף המסרים (PDF)'] },
  { ch: 2, name: 'בניית הצעה מנצחת', min: 20, save: 700, ph: 'ההצעה והאחריות', text: '6 מפגשים, ואם אין כיוון ברור, אין תשלום', out: ['ההצעה המנצחת (PDF)'] },
  { ch: 2, name: 'דף נחיתה בקליק', min: 25, save: 1500, ph: 'דף הנחיתה', text: 'דף הנחיתה של כיוון חדש', out: ['דף הנחיתה (קישור)', 'פלייר'] },
  { ch: 3, name: 'מכונת תוכן שיווקי', min: 25, save: 900, ph: 'התוכן השבועי', text: '3 פוסטים בשבוע', out: ['תוכנית התוכן', 'פלייר'] },
  { ch: 3, name: 'לקוחות משלמים', min: 25, save: 500, ph: 'הערוצים הראשונים', text: 'WhatsApp ו-3 קבוצות פייסבוק', out: ['הודעות הפנייה', 'הפוסטים לקבוצות'] },
  { ch: 4, name: 'חדר התרגול', min: 25, save: 800, ph: 'איך עונים על התנגדות', text: g('עונה בביטחון על "יקר לי"', 'עונה בביטחון על "יקר לי"'), out: ['סיכום התרגולים'] },
  { ch: 4, name: 'שירות לקוחות אוטומטי', min: 20, save: 1600, ph: 'מי עונה במקומך', text: 'הבוט עונה ב-WhatsApp', out: ['תסריט הבוט'] },
  { ch: 5, name: 'ניהול לקוחות', min: 15, save: 600, ph: 'רשימת הלקוחות', text: 'רשימה אחת', out: ['רשימת הלקוחות'] },
  { ch: 5, name: 'ליווי עסקי אנושי', min: 5, save: 0, ph: 'המלווה שלך', text: 'פגישת מיקוד עם FlowBiz', out: ['סיכום פגישת המיקוד'] },
];
export const TOTAL = STEPS.length;
export const NUMBERS_STEP = 4; // after it: the goal is known, "כספים" opens
export const LEADS_STEP = 10; // from it: "לקוחות" opens, the month's numbers are real

// The business page: one row per chapter. A string is plain text, a number is the blank of that step,
// 'name' is the user's name (known from signup, so the page is never completely empty).
export const PAGE = [
  ['הרעיון שלי: ', 0, '. אני ', 'name', ', ', 1, '.'],
  [g('אני מוכר ', 'אני מוכרת '), 2, ' ל', 3, '. היעד שלי: ', 4, '.'],
  ['לעסק קוראים ', 5, '. ההבטחה: ', 6, '. ההצעה: ', 7, ', והיא מחכה ב', 8, '.'],
  ['שומעים עליי דרך ', 9, ', והלקוחות הראשונים מגיעים מ', 10, '.'],
  ['בשיחת מכירה אני ', 11, g(', וכשאני לא זמין ', ', וכשאני לא זמינה '), 12, '.'],
  ['כל הלקוחות שלי ב', 13, ', ומלווה אותי ', 14, '.'],
];

// The month: goal from "העסק במספרים", the rest from the leads table and the finance center.
export const MONTH = { goal: 14000, leads: 9, calls: 4, clients: 2, revenue: 5600 };

// Demo situations: `current` = index of the next step.
export const SCENARIOS = {
  new: { label: 'יום ראשון במערכת', sub: 'רק השם כתוב בדף', current: 0 },
  mid: { label: 'אמצע הבנייה', sub: 'פרקים 1-2 מלאים, עכשיו "שם ולוגו"', current: 5 },
  sell: { label: 'מוכרים', sub: 'שלב 12, החודש עולה למעלה והדף מתכווץ', current: 11 },
  run: { label: 'עסק שרץ', sub: 'המסע הושלם, הבית הוא השבוע והמספרים', current: 15 },
};
export const DEFAULT_SCENARIO = 'mid';

// "השבוע שלי": three tasks, from "צייר לי שבוע מושלם". While building, they come from the journey.
export const WEEK = {
  new: ['לסיים את "מציאת רעיון"', 'לספר על הרעיון לחבר אחד', 'לרשום 3 לקוחות אפשריים'],
  mid: ['לבחור שם לעסק', 'לשאול 2 חברים על השם', 'לצלם תמונה מקצועית'],
  sell: ['לחזור לדנה, מחכה 3 ימים', 'פוסט ליום שלישי', 'לשלוח 5 הודעות ב-WhatsApp'],
  run: ['לחזור לדנה, מחכה 3 ימים', 'פוסט ליום שלישי', 'שיחת תרגול בחדר התרגול'],
};

// From step 11 the first thing on the page is the week's focus, not the next journey step.
export const FOCUS = { title: ['לחזור ', 'לדנה', ''], meta: 'מחכה 3 ימים · ההודעה כבר מנוסחת', cta: 'לפתוח את ההודעה' };

// What each menu page holds (the pages themselves are not part of this mockup).
export const PAGES = {
  week: { title: ['השבוע ', 'שלי', ''], icon: 'calendar-range', from: 'יומן + משימות', items: ['לוח של שבעה ימים: פגישות, משימות, פוסטים ופולואפים', '"צייר לי שבוע מושלם" נפתח מכאן', 'גוררים כרטיס ליום אחר, והיומן מתעדכן'] },
  clients: { title: ['הלקוחות ', 'שלי', ''], icon: 'users', from: 'לידים', items: ['טבלה אחת, שתי תצוגות: פשוטה משלב 11, מלאה משלב 14', '"סגרתי!" פותח עסקה בכספים', 'לידים מהבוט ומהכריש נכנסים לכאן'] },
  money: { title: ['הכספים ', 'שלי', ''], icon: 'wallet', from: 'כספים', items: ['נפתח אחרי "העסק במספרים"', 'הכנסות מול היעד, תזרים ותחזית', 'רואה חשבון: בתוך העמוד הזה'] },
};
