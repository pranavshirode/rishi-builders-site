document.addEventListener('DOMContentLoaded', function () {

  // 1. Mobile Nav Toggle
  document.querySelectorAll('.menu-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const header = btn.closest('header');
      const isOpen = header.classList.toggle('nav-open');
      btn.textContent = isOpen ? '✕' : '☰';
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

  // 3. Animated Counters (Legacy / Trust Block)
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

  // 4. Hero Slider (Home Page)
  const homeSlides = document.querySelectorAll('.hero .slide');
  const homeDots = document.querySelectorAll('.hero .hero-dots span');
  if (homeSlides.length) {
    let cur = 0;
    function showSlide(i) {
      homeSlides.forEach(s => s.classList.remove('active'));
      homeDots.forEach(d => d.classList.remove('active'));
      homeSlides[i].classList.add('active');
      if (homeDots[i]) homeDots[i].classList.add('active');
      cur = i;
    }
    const navButtons = document.querySelectorAll('.hero .hero-nav button');
    if (navButtons.length >= 2) {
      navButtons[0].addEventListener('click', () => showSlide((cur - 1 + homeSlides.length) % homeSlides.length));
      navButtons[1].addEventListener('click', () => showSlide((cur + 1) % homeSlides.length));
    }
    homeDots.forEach((d, i) => d.addEventListener('click', () => showSlide(i)));
    setInterval(() => showSlide((cur + 1) % homeSlides.length), 6000);
  }

  // 5. Hero Slider (Microsite / Detail Pages)
  const msSlides = document.querySelectorAll('.ms-hero-slide');
  const msDots = document.querySelectorAll('.ms-hero-dots span');
  if (msSlides.length) {
    let msCur = 0;
    function showMsSlide(i) {
      msSlides.forEach(s => s.classList.remove('active'));
      msDots.forEach(d => d.classList.remove('active'));
      msSlides[i].classList.add('active');
      if (msDots[i]) msDots[i].classList.add('active');
      msCur = i;
    }
    msDots.forEach((d, i) => d.addEventListener('click', () => showMsSlide(i)));
    setInterval(() => showMsSlide((msCur + 1) % msSlides.length), 5000);

    // Swipe support for mobile
    let startX = 0;
    const heroWrapper = document.querySelector('.microsite-hero');
    if(heroWrapper) {
      heroWrapper.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX, {passive: true});
      heroWrapper.addEventListener('touchend', e => {
        let endX = e.changedTouches[0].screenX;
        if (startX - endX > 50) showMsSlide((msCur + 1) % msSlides.length);
        if (endX - startX > 50) showMsSlide((msCur - 1 + msSlides.length) % msSlides.length);
      }, {passive: true});
    }
  }

  // 6. Section Nav Scroll Spy & Sticky Header
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

      // Smooth scroll on click
      navLinks.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const id = link.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (target) {
            const offset = secNav.offsetHeight + 60;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
          }
        });
      });
    }

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      // Shadow class for sticky elements
      if (scrollY > 150) {
        if(secNav) secNav.classList.add('scrolled');
        if(filterBarWrap) filterBarWrap.classList.add('is-stuck');
      } else {
        if(secNav) secNav.classList.remove('scrolled');
        if(filterBarWrap) filterBarWrap.classList.remove('is-stuck');
      }

      // Scrollspy
      if(secNav && sections.length) {
        const spyScroll = scrollY + secNav.offsetHeight + 150;
        let active = sections[0];
        sections.forEach(s => {
          if (s.el.offsetTop <= spyScroll) active = s;
        });
        navLinks.forEach(l => l.classList.remove('active'));
        if (active) active.link.classList.add('active');
      }
    }, { passive: true });
  }

  // 7. Filter Buttons (Cross-fade Animation)
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
            // Start exit animation
            grid.classList.add('filtering');
            
            setTimeout(() => {
              // Swap display states while invisible
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
              
              // Remove exit animation to fade back in
              grid.classList.remove('filtering');
            }, 400); // Matches CSS transition duration
          }
        }
      });
    });
  });

  // 8. Floor Plan Tabs (Cross-fade images)
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

  // 9. Lightbox Gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-close">×</div>
      <div class="lightbox-prev">‹</div>
      <img class="lightbox-img" src="" alt="Gallery Image">
      <div class="lightbox-next">›</div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');
    let currentIdx = 0;

    function openLightbox(index) {
      currentIdx = index;
      const imgUrl = galleryItems[index].querySelector('img').src;
      lbImg.src = imgUrl;
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

    lbPrev.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + galleryItems.length) % galleryItems.length;
      lbImg.src = galleryItems[currentIdx].querySelector('img').src;
    });

    lbNext.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % galleryItems.length;
      lbImg.src = galleryItems[currentIdx].querySelector('img').src;
    });
  }

  // 10. Video Modal
  const videoWrap = document.querySelector('.video-wrap');
  if (videoWrap) {
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
      <div class="video-modal-close">×</div>
      <div class="video-modal-content">
        <video width="100%" height="100%" controls>
          <source src="assets/videos/sample.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
    document.body.appendChild(videoModal);
    
    const vClose = videoModal.querySelector('.video-modal-close');
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

  // 11. FAQ Accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // 12. Sticky Mini CTA & Floating Mobile CTA
  const miniCta = document.querySelector('.mini-cta-bar');
  const floatingCta = document.querySelector('.floating-cta');
  if (miniCta || floatingCta) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 800) {
        if(miniCta) miniCta.classList.add('visible');
        if(floatingCta) floatingCta.classList.add('visible');
      } else {
        if(miniCta) miniCta.classList.remove('visible');
        if(floatingCta) floatingCta.classList.remove('visible');
      }
    }, { passive: true });
    
    if(floatingCta) {
      floatingCta.addEventListener('click', () => {
        const formTarget = document.getElementById('sec-enquire');
        if (formTarget) {
          formTarget.scrollIntoView({behavior: 'smooth'});
        }
      });
    }
  }

});
