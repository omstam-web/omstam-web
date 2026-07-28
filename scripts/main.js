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
    trackEvent('omstam_contact_click', {
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
