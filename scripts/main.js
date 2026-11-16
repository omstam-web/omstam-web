const GA_MEASUREMENT_ID = 'G-8GQR21S72Y';
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });

const analyticsScript = document.createElement('script');
analyticsScript.async = true;
analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
document.head.appendChild(analyticsScript);

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

const campaignParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid'];
const currentParams = new URLSearchParams(window.location.search);
const campaignData = {};
campaignParams.forEach((key) => {
  const value = currentParams.get(key) || sessionStorage.getItem(`omstam_${key}`) || '';
  if (value) {
    campaignData[key] = value;
    sessionStorage.setItem(`omstam_${key}`, value);
  }
});

function trackEvent(name, parameters = {}) {
  const payload = { ...campaignData, ...parameters };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...payload });
  if (typeof window.gtag === 'function') window.gtag('event', name, payload);
}

/* A single, persistent contact path on every page.
   The phone number stays visible; WhatsApp remains an understated icon. */
const contactDockStyles = document.createElement('link');
contactDockStyles.rel = 'stylesheet';
contactDockStyles.href = '/styles/contact-dock.css?v=20260728c';
document.head.appendChild(contactDockStyles);

const contactDock = document.createElement('aside');
contactDock.className = 'site-contact-dock';
contactDock.setAttribute('aria-label', 'דרכי יצירת קשר עם הרב יוחאי אוחיון');
contactDock.innerHTML = `
  <div class="site-contact-dock__inner">
    <span class="site-contact-dock__label">לבירור והתאמה לקורס:</span>
    <a class="site-contact-dock__phone" href="tel:0534177677">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1.3.5 2.7.8 4.1.8.7 0 1.3.6 1.3 1.3v3.5c0 .7-.6 1.3-1.3 1.3C10.4 21.9 2.1 13.6 2.1 3.3 2.1 2.6 2.7 2 3.4 2h3.5c.7 0 1.3.6 1.3 1.3 0 1.4.3 2.8.8 4.1.1.4.1.9-.2 1.2l-2.2 2.2Z"/></svg>
      <span>להתקשר</span>
      <bdi>053-4177677</bdi>
    </a>
    <a class="site-contact-dock__email" href="mailto:Y0548431060@gmail.com">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm9 7.1L20.2 7H3.8l8.2 5.1Zm0 2.3L3 8.8V17h18V8.8l-9 5.6Z"/></svg>
      <span>לשלוח מייל</span>
    </a>
    <a class="site-contact-dock__whatsapp" href="https://wa.me/972534177677" aria-label="שליחת הודעה בוואטסאפ" title="שליחת הודעה בוואטסאפ">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 4.5A11.4 11.4 0 0 0 6.2 21.66L4.7 27.5l5.98-1.45A11.4 11.4 0 1 0 16.04 4.5Zm0 20.73c-1.8 0-3.55-.52-5.05-1.5l-.36-.22-3.55.86.9-3.45-.24-.36A9.29 9.29 0 1 1 16.04 25.23Zm5.1-6.96c-.28-.14-1.66-.82-1.91-.91-.26-.1-.45-.14-.64.14-.18.28-.72.91-.88 1.1-.16.18-.33.2-.61.07-.28-.14-1.18-.44-2.25-1.39a8.43 8.43 0 0 1-1.56-1.94c-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.18.05-.35-.02-.49-.07-.14-.63-1.54-.87-2.1-.23-.55-.47-.48-.64-.49h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34 0 1.38 1 2.71 1.14 2.9.14.18 1.97 3 4.77 4.21.67.29 1.19.46 1.59.59.67.21 1.27.18 1.75.11.53-.08 1.66-.68 1.89-1.34.23-.65.23-1.21.16-1.33-.07-.12-.25-.19-.53-.33Z"/></svg>
    </a>
  </div>`;
document.body.appendChild(contactDock);
document.body.classList.add('has-site-contact-dock');

const contactLinks = document.querySelectorAll('a[href*="wa.me"], a[href^="tel:"], a[href^="mailto:"]');

contactLinks.forEach((link) => {
  if (link.href.includes('wa.me')) {
    const originalLabel = link.textContent.trim();
    link.classList.add('whatsapp-icon-link');
    link.setAttribute('aria-label', originalLabel || 'שליחת הודעה בוואטסאפ');
    link.setAttribute('title', 'שליחת הודעה בוואטסאפ');
    link.innerHTML = `
      <span class="sr-only">${originalLabel || 'שליחת הודעה בוואטסאפ'}</span>
      <svg class="whatsapp-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M16.04 4.5A11.4 11.4 0 0 0 6.2 21.66L4.7 27.5l5.98-1.45A11.4 11.4 0 1 0 16.04 4.5Zm0 20.73c-1.8 0-3.55-.52-5.05-1.5l-.36-.22-3.55.86.9-3.45-.24-.36A9.29 9.29 0 1 1 16.04 25.23Zm5.1-6.96c-.28-.14-1.66-.82-1.91-.91-.26-.1-.45-.14-.64.14-.18.28-.72.91-.88 1.1-.16.18-.33.2-.61.07-.28-.14-1.18-.44-2.25-1.39a8.43 8.43 0 0 1-1.56-1.94c-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.18.05-.35-.02-.49-.07-.14-.63-1.54-.87-2.1-.23-.55-.47-.48-.64-.49h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34 0 1.38 1 2.71 1.14 2.9.14.18 1.97 3 4.77 4.21.67.29 1.19.46 1.59.59.67.21 1.27.18 1.75.11.53-.08 1.66-.68 1.89-1.34.23-.65.23-1.21.16-1.33-.07-.12-.25-.19-.53-.33Z"/>
      </svg>`;
  }

  link.addEventListener('click', () => {
    const channel = link.href.includes('wa.me') ? 'whatsapp' : link.href.startsWith('tel:') ? 'phone' : 'email';
    const eventName = {
      whatsapp: 'whatsapp_click',
      phone: 'phone_click',
      email: 'email_click',
    }[channel];
    trackEvent(eventName, {
      contact_channel: channel,
      link_text: link.textContent.trim(),
      page_path: window.location.pathname,
    });
  });
});

document.querySelectorAll(
  'a.btn, button.btn, a.landing-btn, button.landing-btn, a.nav-cta, button.form-submit, .landing-mobile-cta a'
).forEach((button) => {
  button.classList.add('site-unified-button');
});

document.querySelectorAll('.hero-actions, .contact-actions, .final-actions, .landing-actions, .booking-actions, .mobile-contact, .landing-mobile-cta').forEach((group) => {
  const directContactLinks = [...group.children].filter((child) =>
    child.matches?.('a[href*="wa.me"], a[href^="tel:"], a[href^="mailto:"]')
  );
  if (directContactLinks.length < 2) return;

  const contactPriority = (link) => {
    if (link.href.startsWith('tel:')) return 1;
    if (link.href.startsWith('mailto:')) return 2;
    return 3;
  };
  directContactLinks.sort((a, b) => contactPriority(a) - contactPriority(b));
  directContactLinks.forEach((link) => group.appendChild(link));
});

document.querySelectorAll('form[data-campaign-form]').forEach((form) => {
  campaignParams.forEach((key) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = campaignData[key] || '';
  });
});

document.querySelectorAll('.video-frame[data-youtube-id]').forEach(frame => {
  const play = frame.querySelector('.video-play');
  play.addEventListener('click', () => {
    const id = frame.dataset.youtubeId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = 'סרטון כתיבת סת״ם';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
  }, { once: true });
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.form-submit');
    submitBtn.disabled = true;
    formStatus.textContent = 'שולח...';
    formStatus.className = 'form-status';

    try {
      const res = await fetch('/contact-handler.php', {
        method: 'POST',
        body: new FormData(contactForm),
      });
      const data = await res.json();
      if (data.ok) {
        formStatus.textContent = 'הפנייה נשלחה בהצלחה! נחזור אליך בהקדם.';
        formStatus.classList.add('ok');
        trackEvent('generate_lead', {
          form_name: contactForm.dataset.formName || 'contact',
          page_path: window.location.pathname,
        });
        contactForm.reset();
      } else {
        throw new Error(data.error || 'unknown');
      }
    } catch (err) {
      formStatus.textContent = 'לא הצלחנו לשלוח את הטופס. אפשר להתקשר, לשלוח מייל או לשלוח הודעה בוואטסאפ.';
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}


/* Site-wide newsletter invitation for every visitor, on every day. */
(() => {
  const DISMISSED_KEY = 'omstam_newsletter_dismissed_at';
  const SUBSCRIBED_KEY = 'omstam_newsletter_subscribed';
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  if (localStorage.getItem(SUBSCRIBED_KEY) === '1') return;
  const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
  if (Date.now() - dismissedAt < WEEK_MS) return;

  const styles = document.createElement('style');
  styles.textContent = `
    .newsletter-modal[hidden]{display:none}
    .newsletter-modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:rgba(29,23,18,.7);direction:rtl}
    .newsletter-dialog{position:relative;width:min(100%,560px);max-height:calc(100vh - 36px);overflow:auto;padding:clamp(25px,5vw,42px);border:1px solid rgba(184,139,57,.55);border-radius:36px 36px 14px 14px;background:linear-gradient(145deg,#fffdf8,#f2e4cd);box-shadow:0 28px 80px rgba(0,0,0,.34);text-align:center;color:#35291f}
    .newsletter-close{position:absolute;top:12px;left:14px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;color:#493728;font-size:1.7rem;line-height:1;cursor:pointer}
    .newsletter-eyebrow{margin:0 0 7px;color:#8b6422;font-weight:700}
    .newsletter-dialog h2{margin:0 0 12px;font-family:"Frank Ruhl Libre",serif;font-size:clamp(2rem,6vw,3rem);line-height:1.05}
    .newsletter-dialog>p{margin:0 auto 22px;max-width:440px;line-height:1.7;color:#5b4c3e}
    .newsletter-form{display:grid;gap:12px;text-align:right}
    .newsletter-form label{font-weight:700}
    .newsletter-form input[type="text"],.newsletter-form input[type="email"]{width:100%;box-sizing:border-box;margin-top:5px;padding:13px 14px;border:1px solid #c9aa72;border-radius:12px;background:#fff;font:inherit}
    .newsletter-consent{display:flex;gap:9px;align-items:flex-start;font-size:.9rem;font-weight:500!important;line-height:1.45}
    .newsletter-consent input{margin-top:4px}
    .newsletter-submit{padding:14px 20px;border:0;border-radius:13px;background:#5a4330;color:#fffdf8;font:700 1rem Assistant,sans-serif;cursor:pointer}
    .newsletter-submit:disabled{opacity:.65;cursor:wait}
    .newsletter-status{min-height:24px;margin:2px 0 0;text-align:center;font-weight:700}
    .newsletter-status.ok{color:#27623c}.newsletter-status.error{color:#8a2f2f}
    body.newsletter-open{overflow:hidden}
    @media(max-width:520px){.newsletter-dialog{padding:30px 20px 24px;border-radius:26px 26px 12px 12px}.newsletter-dialog h2{padding-inline:20px}}
  `;
  document.head.appendChild(styles);

  const modal = document.createElement('div');
  modal.className = 'newsletter-modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'newsletter-title');
  modal.innerHTML = `
    <div class="newsletter-dialog">
      <button class="newsletter-close" type="button" aria-label="סגירת חלון ההרשמה">×</button>
      <p class="newsletter-eyebrow">מאמר חדש בכל מוצאי שבת</p>
      <h2 id="newsletter-title">המאמר השבועי מעולם הסת״ם</h2>
      <p>הלכה, מסורת וידיעות מעשיות מאת הרב יוחאי אוחיון. הצטרפו למאות הקוראים וקבלו את המאמר ישירות למייל.</p>
      <form class="newsletter-form">
        <label>שם <span aria-hidden="true">(לא חובה)</span><input type="text" name="name" autocomplete="name"></label>
        <label>כתובת מייל<input type="email" name="email" autocomplete="email" required></label>
        <label class="newsletter-consent"><input type="checkbox" name="consent" value="yes" required><span>אני מאשר לקבל למייל את המאמר השבועי ועדכונים ממכון אמנות הסת״ם.</span></label>
        <input type="hidden" name="form_type" value="newsletter">
        <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;right:-9999px" aria-hidden="true">
        <button class="newsletter-submit" type="submit">שלחו לי את המאמר השבועי</button>
        <p class="newsletter-status" aria-live="polite"></p>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const closeButton = modal.querySelector('.newsletter-close');
  const form = modal.querySelector('.newsletter-form');
  const submitButton = modal.querySelector('.newsletter-submit');
  const status = modal.querySelector('.newsletter-status');
  let shown = false;

  const close = (remember = true) => {
    modal.hidden = true;
    document.body.classList.remove('newsletter-open');
    if (remember) localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };
  const show = () => {
    if (shown) return;
    shown = true;
    modal.hidden = false;
    document.body.classList.add('newsletter-open');
    closeButton.focus();
    trackEvent('newsletter_popup_view', { page_path: window.location.pathname });
  };

  closeButton.addEventListener('click', () => close(true));
  modal.addEventListener('click', event => {
    if (event.target === modal) close(true);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) close(true);
  });

  const timer = window.setTimeout(show, 12000);
  const onScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable > 0 && window.scrollY / scrollable >= .25) {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      show();
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    submitButton.disabled = true;
    status.className = 'newsletter-status';
    status.textContent = 'רושם אותך...';
    try {
      const response = await fetch('/contact-handler.php', { method: 'POST', body: new FormData(form) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'signup_failed');
      localStorage.setItem(SUBSCRIBED_KEY, '1');
      status.classList.add('ok');
      status.textContent = 'נרשמת בהצלחה — המאמר החדש בדרך אליך.';
      trackEvent('newsletter_signup', { page_path: window.location.pathname });
      trackEvent('generate_lead', { form_name: 'newsletter', page_path: window.location.pathname });
      window.setTimeout(() => close(false), 2600);
    } catch (error) {
      status.classList.add('error');
      status.textContent = 'ההרשמה לא נשלחה. אפשר לנסות שוב בעוד רגע.';
    } finally {
      submitButton.disabled = false;
    }
  });
})();
