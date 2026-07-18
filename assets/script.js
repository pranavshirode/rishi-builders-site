// Hero slider (home page)
document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.hero-dots span');
  if (slides.length) {
    let cur = 0;
    function show(i) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[i].classList.add('active');
      if (dots[i]) dots[i].classList.add('active');
      cur = i;
    }
    const prevBtn = document.querySelectorAll('.hero-nav button')[0];
    const nextBtn = document.querySelectorAll('.hero-nav button')[1];
    if (prevBtn) prevBtn.onclick = () => show((cur - 1 + slides.length) % slides.length);
    if (nextBtn) nextBtn.onclick = () => show((cur + 1) % slides.length);
    dots.forEach((d, i) => d.onclick = () => show(i));
    setInterval(() => show((cur + 1) % slides.length), 6000);
  }

  // Generic filter buttons (Projects listing / Gallery) - purely visual toggle for the proof
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Mobile nav toggle
  document.querySelectorAll('.menu-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const header = btn.closest('header');
      const isOpen = header.classList.toggle('nav-open');
      btn.textContent = isOpen ? '✕' : '☰';
    });
  });

  // Floor plan tabs
  document.querySelectorAll('.floorplan-tabs').forEach(tabs => {
    const img = tabs.nextElementSibling;
    tabs.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (img && img.tagName === 'IMG' && btn.dataset.img) img.src = btn.dataset.img;
      });
    });
  });
});
