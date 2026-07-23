document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

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
        contactForm.reset();
      } else {
        throw new Error(data.error || 'unknown');
      }
    } catch (err) {
      formStatus.textContent = 'לא הצלחנו לשלוח את הטופס. אפשר לשלוח בוואטסאפ במקום.';
      formStatus.classList.add('error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}
