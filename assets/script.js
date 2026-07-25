document.addEventListener('DOMContentLoaded', function () {

  // 1. Mobile Nav Drawer & Overlay
  const menuToggle = document.querySelector('.menu-toggle');
  const navClose = document.querySelector('.nav-close');
  const nav = document.querySelector('nav');
  let navOverlay = document.querySelector('.nav-overlay');
  
  if (menuToggle && nav) {
    if (!navOverlay) {
      navOverlay = document.createElement('div');
      navOverlay.className = 'nav-overlay';
      document.body.appendChild(navOverlay);
    }

    function openNav() {
      nav.classList.add('is-open');
      navOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      nav.classList.remove('is-open');
      navOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openNav);
    if(navClose) navClose.addEventListener('click', closeNav);
    navOverlay.addEventListener('click', closeNav);
  }

  // Nav Dropdown Accordion
  const navDropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
  navDropdownBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const drop = btn.nextElementSibling;
      const isOpen = drop.classList.contains('is-open');
      document.querySelectorAll('.drop').forEach(d => d.classList.remove('is-open'));
      document.querySelectorAll('.nav-dropdown-btn').forEach(b => b.textContent = b.textContent.replace('▴', '▾'));
      
      if (!isOpen) {
        drop.classList.add('is-open');
        btn.innerHTML = btn.innerHTML.replace('▾', '▴');
      }
    });
  });

  // 2. IntersectionObserver for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 3. Animated Counters
  const counters = document.querySelectorAll('.counter-num span');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-val'), 10);
          let startValue = 0;
          const duration = 2000;
          const frameRate = 1000 / 60;
          const totalFrames = Math.round(duration / frameRate);
          let frame = 0;

          const counterInterval = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentVal = Math.round(endValue * progress);
            target.textContent = currentVal;
            if (frame === totalFrames) {
              clearInterval(counterInterval);
              target.textContent = endValue;
            }
          }, frameRate);

          observer.unobserve(target);
        }
      });
    }, { rootMargin: '0px', threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // 4. Hero Sliders (Swipe & Auto-play)
  function initSlider(containerSelector, slideSelector, dotSelector, nextBtn, prevBtn) {
    const slides = document.querySelectorAll(slideSelector);
    const dots = document.querySelectorAll(dotSelector);
    if (!slides.length) return;
    
    let cur = 0;
    function showSlide(i) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      slides[i].classList.add('active');
      if (dots[i]) dots[i].classList.add('active');
      cur = i;
    }
    
    if (nextBtn && prevBtn) {
      document.querySelector(nextBtn)?.addEventListener('click', () => showSlide((cur + 1) % slides.length));
      document.querySelector(prevBtn)?.addEventListener('click', () => showSlide((cur - 1 + slides.length) % slides.length));
    }
    
    dots.forEach((d, i) => d.addEventListener('click', () => showSlide(i)));
    
    // Swipe support
    let startX = 0;
    const container = document.querySelector(containerSelector);
    if(container) {
      container.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, {passive: true});
      container.addEventListener('touchend', e => {
        let endX = e.changedTouches[0].screenX;
        if (startX - endX > 50) showSlide((cur + 1) % slides.length);
        if (endX - startX > 50) showSlide((cur - 1 + slides.length) % slides.length);
      }, {passive: true});
    }
    
    setInterval(() => showSlide((cur + 1) % slides.length), 6000);
  }
  
  initSlider('.hero', '.hero .slide', '.hero .hero-dots span', '.hero .hero-nav button:nth-child(2)', '.hero .hero-nav button:nth-child(1)');
  initSlider('.microsite-hero', '.ms-hero-slide', '.ms-hero-dots span', null, null);

  // 5. Section Nav Scroll Spy & Sticky Header
  const secNav = document.querySelector('.section-nav');
  const filterBarWrap = document.querySelector('.filter-bar-wrapper');
  
  if (secNav || filterBarWrap) {
    const targetNav = secNav || filterBarWrap;
    const navLinks = secNav ? secNav.querySelectorAll('a[href^="#sec-"]') : [];
    const sections = [];
    
    if(secNav && navLinks.length) {
      navLinks.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) sections.push({ el, link });
      });

      navLinks.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const id = link.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (target) {
            const offset = secNav.offsetHeight + (window.innerWidth < 641 ? 20 : 60);
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
          }
        });
      });
    }

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if(secNav && sections.length) {
        const spyScroll = scrollY + secNav.offsetHeight + 150;
        let active = sections[0];
        sections.forEach(s => {
          if (s.el.offsetTop <= spyScroll) active = s;
        });
        navLinks.forEach(l => l.classList.remove('active'));
        if (active) {
          active.link.classList.add('active');
          // Auto scroll the sticky nav horizontally on mobile so active is visible
          if(window.innerWidth < 641) {
            const navInner = secNav.querySelector('.section-nav-inner');
            const linkLeft = active.link.offsetLeft;
            navInner.scrollTo({ left: linkLeft - 20, behavior: 'smooth' });
          }
        }
      }
    }, { passive: true });
  }

  // 6. Filter Buttons (Cross-fade Animation)
  document.querySelectorAll('.filter-category-strip').forEach(bar => {
    bar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        if(btn.classList.contains('active')) return;

        bar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.getAttribute('data-filter') || btn.textContent.trim().toLowerCase();
        const section = bar.closest('section');
        
        if (section) {
          const grid = section.querySelector('.feat-grid, .proj-row');
          if(grid) {
            grid.classList.add('filtering');
            setTimeout(() => {
              const items = grid.querySelectorAll('.feat-card, .proj-card');
              items.forEach(item => {
                const tagEl = item.querySelector('.proj-type, .proj-status');
                const itemText = tagEl ? tagEl.textContent.toLowerCase() : item.textContent.toLowerCase();
                
                if (filterVal === 'all' || itemText.includes(filterVal)) {
                  item.style.display = '';
                } else {
                  item.style.display = 'none';
                }
              });
              grid.classList.remove('filtering');
            }, 400); 
          }
        }
      });
    });
  });

  // 7. Floor Plan Tabs
  const fpTabs = document.querySelectorAll('.fp-tabs button');
  const fpImages = document.querySelectorAll('.fp-img');
  if (fpTabs.length > 0 && fpImages.length > 0) {
    fpTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        fpTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        
        fpImages.forEach(img => {
          if (img.id === targetId) {
            img.classList.add('active');
          } else {
            img.classList.remove('active');
          }
        });
      });
    });
  }

  // 8. Lightbox Gallery & Video Modal
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="modal-close">✕</div>
      <div class="lightbox-prev">‹</div>
      <img class="lightbox-img" src="" alt="Gallery Image">
      <div class="lightbox-next">›</div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbClose = lightbox.querySelector('.modal-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');
    let currentIdx = 0;

    function openLightbox(index) {
      currentIdx = index;
      lbImg.src = galleryItems[index].querySelector('img').src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => lbImg.src = '', 300);
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    function lbNextImg() {
      currentIdx = (currentIdx + 1) % galleryItems.length;
      lbImg.src = galleryItems[currentIdx].querySelector('img').src;
    }
    function lbPrevImg() {
      currentIdx = (currentIdx - 1 + galleryItems.length) % galleryItems.length;
      lbImg.src = galleryItems[currentIdx].querySelector('img').src;
    }

    lbPrev.addEventListener('click', lbPrevImg);
    lbNext.addEventListener('click', lbNextImg);
    
    // Swipe
    let lbStartX = 0;
    lightbox.addEventListener('touchstart', e => lbStartX = e.changedTouches[0].screenX, {passive: true});
    lightbox.addEventListener('touchend', e => {
      let endX = e.changedTouches[0].screenX;
      if (lbStartX - endX > 50) lbNextImg();
      if (endX - lbStartX > 50) lbPrevImg();
    }, {passive: true});
  }

  // Video Modal
  const videoWrap = document.querySelector('.video-wrap');
  if (videoWrap) {
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
      <div class="modal-close">✕</div>
      <div class="video-modal-content">
        <video width="100%" height="100%" controls>
          <source src="assets/videos/sample.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
    document.body.appendChild(videoModal);
    
    const vClose = videoModal.querySelector('.modal-close');
    const vPlayer = videoModal.querySelector('video');

    videoWrap.addEventListener('click', () => {
      videoModal.classList.add('active');
      vPlayer.play();
      document.body.style.overflow = 'hidden';
    });

    function closeVideo() {
      videoModal.classList.remove('active');
      vPlayer.pause();
      document.body.style.overflow = '';
    }

    vClose.addEventListener('click', closeVideo);
    videoModal.addEventListener('click', (e) => {
      if(e.target === videoModal) closeVideo();
    });
  }

  // 9. Accordions (Location & FAQ)
  function setupAccordion(selector, parentSelector) {
    document.querySelectorAll(selector).forEach(q => {
      q.addEventListener('click', () => {
        // For Location, only act as accordion on mobile (<641px)
        if (selector === '.prox-header' && window.innerWidth > 640) return;
        
        const item = q.closest(parentSelector);
        const isOpen = item.classList.contains('open');
        document.querySelectorAll(parentSelector).forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }
  setupAccordion('.faq-q', '.faq-item');
  setupAccordion('.prox-header', '.prox-category');

  // 10. Bottom-Sheet Modal & Sticky CTA
  const miniCta = document.querySelector('.mini-cta-bar');
  const bottomCta = document.querySelector('.bottom-cta-bar');
  const bottomSheet = document.querySelector('.bottom-sheet');
  
  if (miniCta || bottomCta) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 600) {
        if(miniCta) miniCta.classList.add('visible');
        if(bottomCta) bottomCta.classList.add('visible');
      } else {
        if(miniCta) miniCta.classList.remove('visible');
        if(bottomCta) bottomCta.classList.remove('visible');
      }
    }, { passive: true });
  }
  
  if (bottomCta && bottomSheet) {
    const bsClose = bottomSheet.querySelector('.bs-close');
    const bsOverlay = bottomSheet.querySelector('.bs-overlay');
    
    function openBottomSheet() {
      bottomSheet.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    
    function closeBottomSheet() {
      bottomSheet.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    
    bottomCta.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', openBottomSheet);
    });
    
    if(bsClose) bsClose.addEventListener('click', closeBottomSheet);
    if(bsOverlay) bsOverlay.addEventListener('click', closeBottomSheet);
    
    // Swipe down to dismiss
    let bsStartY = 0;
    const bsContent = bottomSheet.querySelector('.bs-content');
    if(bsContent) {
      bsContent.addEventListener('touchstart', e => bsStartY = e.changedTouches[0].screenY, {passive: true});
      bsContent.addEventListener('touchend', e => {
        let endY = e.changedTouches[0].screenY;
        if (endY - bsStartY > 100) closeBottomSheet();
      }, {passive: true});
    }
  }

});
