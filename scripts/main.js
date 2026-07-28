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
  if (link.href.includes('wa.me') && !/וואטסאפ|ווטסאפ/i.test(link.textContent)) {
    link.textContent = /התאמה/i.test(link.textContent)
      ? 'שליחת הודעה בוואטסאפ לבדיקת התאמה'
      : 'שליחת הודעה בוואטסאפ';
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

document.querySelectorAll('.hero-actions, .contact-actions, .final-actions, .landing-actions, .mobile-contact, .landing-mobile-cta').forEach((group) => {
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
