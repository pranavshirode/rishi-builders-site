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

  // Generic filter buttons (Projects listing / Gallery) - Functional filtering
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.textContent.trim().toLowerCase();
        const section = bar.closest('section');
        
        if (section) {
          const items = section.querySelectorAll('.gallery-tile, .proj-card');
          items.forEach(item => {
            // Check the specific tags for matching
            const tagEl = item.querySelector('.tag, .proj-status');
            const itemText = tagEl ? tagEl.textContent.toLowerCase() : item.textContent.toLowerCase();
            
            if (filterVal === 'all' || itemText.includes(filterVal)) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        }
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
    let imgContainer = tabs.nextElementSibling;
    let img = null;
    if (imgContainer) {
      if (imgContainer.tagName === 'IMG') {
        img = imgContainer;
      } else {
        img = imgContainer.querySelector('img');
      }
    }
    
    tabs.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (img && btn.dataset.img) img.src = btn.dataset.img;
      });
    });
  });

  // ── DV2 Hero Slider ──
  const dv2Slides = document.querySelectorAll('.dv2-hero-slide');
  const dv2Dots = document.querySelectorAll('.dv2-hero-dots span');
  if (dv2Slides.length) {
    let dv2Cur = 0;
    function showDv2Slide(i) {
      dv2Slides.forEach(s => s.classList.remove('active'));
      dv2Dots.forEach(d => d.classList.remove('active'));
      dv2Slides[i].classList.add('active');
      if (dv2Dots[i]) dv2Dots[i].classList.add('active');
      dv2Cur = i;
    }
    dv2Dots.forEach((d, i) => d.addEventListener('click', () => showDv2Slide(i)));
    setInterval(() => showDv2Slide((dv2Cur + 1) % dv2Slides.length), 5000);
  }

  // ── Section Nav Scroll Spy ──
  const secNav = document.getElementById('sectionNav');
  const secLinks = secNav ? secNav.querySelectorAll('a[href^="#sec-"]') : [];
  if (secNav && secLinks.length) {
    const sections = [];
    secLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) sections.push({ el, link });
    });

    function updateActiveSection() {
      const scrollY = window.scrollY + 200;
      let active = sections[0];
      sections.forEach(s => {
        if (s.el.offsetTop <= scrollY) active = s;
      });
      secLinks.forEach(l => l.classList.remove('active'));
      if (active) active.link.classList.add('active');

      // Add shadow when scrolled
      if (window.scrollY > 400) {
        secNav.classList.add('scrolled');
      } else {
        secNav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();

    // Smooth scroll on nav click
    secLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          const offset = secNav.offsetHeight + 100;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      });
    });
  }

  // ── Peek Gallery Carousel ──
  const peekGallery = document.getElementById('peekGallery');
  const galleryItems = peekGallery ? peekGallery.querySelectorAll('.peek-gallery-item') : [];
  if (galleryItems.length) {
    let galCur = 0;

    function showGalleryItem(i) {
      galleryItems.forEach(item => item.classList.remove('active'));
      galleryItems[i].classList.add('active');
      galleryItems[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      galCur = i;
    }

    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    if (prevBtn) prevBtn.addEventListener('click', () => showGalleryItem((galCur - 1 + galleryItems.length) % galleryItems.length));
    if (nextBtn) nextBtn.addEventListener('click', () => showGalleryItem((galCur + 1) % galleryItems.length));

    // Track scroll position to update active item
    if (peekGallery) {
      peekGallery.addEventListener('scroll', () => {
        const center = peekGallery.scrollLeft + peekGallery.offsetWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        galleryItems.forEach((item, i) => {
          const itemCenter = item.offsetLeft + item.offsetWidth / 2;
          const dist = Math.abs(center - itemCenter);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        if (closest !== galCur) {
          galleryItems.forEach(item => item.classList.remove('active'));
          galleryItems[closest].classList.add('active');
          galCur = closest;
        }
      }, { passive: true });
    }
  }

  // ── Floating Enquiry Button ──
  const floatBtn = document.getElementById('floatingEnquiry');
  if (floatBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        floatBtn.classList.add('visible');
      } else {
        floatBtn.classList.remove('visible');
      }
    }, { passive: true });
  }

});

