// All client-side behaviour of the site. Content is never rendered here:
// every page arrives as finished HTML in its own language.

// --- Language picker: go to the same page in the chosen language
const select = document.querySelector<HTMLSelectElement>('#language-select');
select?.addEventListener('change', () => {
  const opt = select.selectedOptions[0];
  try { localStorage.setItem('otut-language', opt.dataset.lang || 'en'); } catch {}
  location.href = select.value;
});
try { localStorage.setItem('otut-language', document.documentElement.lang); } catch {}

// --- Logo parallax on the home page
const orbit = document.querySelector<HTMLElement>('.hero-orbit');
if (orbit && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const logo = orbit.querySelector<HTMLElement>('.hero-logo');
  const dot = orbit.querySelector<HTMLElement>('.accent-dot');
  orbit.addEventListener('pointermove', (e) => {
    const r = orbit.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    if (logo) logo.style.transform = `translate(${x * 18}px,${y * 18}px) rotate(${x * 2}deg)`;
    if (dot) dot.style.transform = `translate(${x * -35}px,${y * -35}px)`;
  });
  orbit.addEventListener('pointerleave', () => { if (logo) logo.style.transform = ''; if (dot) dot.style.transform = ''; });
}

// --- Google Analytics, loaded only after explicit consent (GA4: G-YLJZQ0LRZP)
const GA_ID = 'G-YLJZQ0LRZP';
const CHOICE_KEY = 'otut-analytics-consent';
declare global { interface Window { dataLayer: unknown[]; gtag: (...a: unknown[]) => void } }

function loadAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
}

function showConsent() {
  const c = document.querySelector<HTMLTemplateElement>('#cookie-copy')?.dataset;
  if (!c) return;
  const panel = document.createElement('div');
  panel.className = 'analytics-consent';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Cookie preferences');
  panel.innerHTML = '<p></p><div><button class="analytics-accept" type="button"></button><button class="analytics-decline" type="button"></button></div>';
  panel.querySelector('p')!.textContent = c.text || '';
  const accept = panel.querySelector<HTMLButtonElement>('.analytics-accept')!;
  const decline = panel.querySelector<HTMLButtonElement>('.analytics-decline')!;
  accept.textContent = c.accept || 'Allow';
  decline.textContent = c.decline || 'Necessary only';
  const choose = (v: string) => { try { localStorage.setItem(CHOICE_KEY, v); } catch {} if (v === 'granted') loadAnalytics(); panel.remove(); };
  accept.addEventListener('click', () => choose('granted'));
  decline.addEventListener('click', () => choose('denied'));
  document.body.appendChild(panel);
}

let choice: string | null = null;
try { choice = localStorage.getItem(CHOICE_KEY); } catch {}
if (choice === 'granted') loadAnalytics();
else if (choice !== 'denied') showConsent();
