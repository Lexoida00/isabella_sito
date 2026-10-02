/**
* Template Main JS - Versione Pro & Ultra-Ottimizzata
*/
(() => {
  "use strict";
  
  // -------------------------------------------------------------------
  // 1. Gestione Scroll Ottimizzata (Throttled con requestAnimationFrame)
  // -------------------------------------------------------------------
  let isScrolling = false;
  
  const handleScrollEvents = () => {
    const scrollY = window.scrollY;
    
    // Header Scrolled
    const header = document.querySelector('#header');
    if (header && (header.classList.contains('scroll-up-sticky') || 
    header.classList.contains('sticky-top') || 
    header.classList.contains('fixed-top'))) {
      document.body.classList.toggle('scrolled', scrollY > 100);
    }
    
    // Scroll Top Button
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      scrollTop.classList.toggle('active', scrollY > 100);
    }
    
    isScrolling = false;
  };
  
  const onScroll = () => {
    if (!isScrolling) {
      window.requestAnimationFrame(handleScrollEvents);
      isScrolling = true;
    }
  };
  
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', handleScrollEvents);
  
  // -------------------------------------------------------------------
  // 2. Inizializzazione Sicura al DOMReady
  // -------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Nav Toggle ---
    const mobileNavBtn = document.querySelector('.mobile-nav-toggle');
    const toggleMobileNav = () => {
      document.body.classList.toggle('mobile-nav-active');
      mobileNavBtn?.classList.toggle('bi-list');
      mobileNavBtn?.classList.toggle('bi-x');
    };
    
    mobileNavBtn?.addEventListener('click', toggleMobileNav);
    
    // Chiudi menu mobile al click sui link interni
    document.querySelectorAll('#navmenu a').forEach(link => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          toggleMobileNav();
        }
      });
    });
    
    // Dropdown Mobile Menu
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(dropdown => {
      dropdown.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode?.classList.toggle('active');
        this.parentNode?.nextElementSibling?.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });
    
    // --- Preloader ---
    const preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => preloader.remove());
    }
    
    // --- Scroll Top Click ---
    document.querySelector('.scroll-top')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // --- Skill Bars Avanzate ---
    initSkillBars();
    
    // --- Inizializzazione Librerie Esterne ---
    initAOS();
    initPureCounter();
    initSwiper();
    initGLightbox();
    initIsotope();
  });
  
  // -------------------------------------------------------------------
  // 3. Modulo Skill Bars (IntersectionObserver + Contatore % Animato)
  // -------------------------------------------------------------------
  function initSkillBars() {
    const skillsSections = document.querySelectorAll('.skills-animation');
    if (!skillsSections.length) return;
    
    const animateBarAndValue = (progressBar) => {
      const targetVal = parseInt(progressBar.getAttribute('aria-valuenow') || '0', 10);
      
      // 1. Anima l'espansione della barra
      progressBar.style.width = `${targetVal}%`;
      
      // 2. Anima il conteggio del testo (cerca elementi tipo <span class="val">0%</span>)
      const parentItem = progressBar.closest('.skill-item, .progress-item, li, div');
      const valLabel = parentItem?.querySelector('.val, .percentage, .value');
      
      if (valLabel) {
        const duration = 1200; // Durata in ms
        const startTime = performance.now();
        
        const updateCounter = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Curva di easing morbida (outQuad)
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          const currentVal = Math.floor(easeProgress * targetVal);
          
          valLabel.textContent = `${currentVal}%`;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };
        requestAnimationFrame(updateCounter);
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('.progress .progress-bar');
          progressBars.forEach(animateBarAndValue);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    skillsSections.forEach(section => observer.observe(section));
  }
  
  // -------------------------------------------------------------------
  // 4. Helper Librerie Esterne (Safe Load)
  // -------------------------------------------------------------------
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 600, easing: 'ease-in-out', once: true });
    }
  }
  
  function initPureCounter() {
    if (typeof PureCounter !== 'undefined') new PureCounter();
  }
  
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll('.init-swiper').forEach(el => {
      const configEl = el.querySelector('.swiper-config');
      if (!configEl) return;
      try {
        const config = JSON.parse(configEl.innerHTML.trim());
        if (el.classList.contains('swiper-tab') && typeof initSwiperWithCustomPagination === 'function') {
          initSwiperWithCustomPagination(el, config);
        } else {
          new Swiper(el, config);
        }
      } catch (err) {
        console.error('Errore parsing JSON configurazione Swiper:', err);
      }
    });
  }
  
  function initGLightbox() {
    if (typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });
  }
  
  function initIsotope() {
    if (typeof Isotope === 'undefined' || typeof imagesLoaded === 'undefined') return;
    
    document.querySelectorAll('.isotope-layout').forEach(isotopeItem => {
      const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      const filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
      const container = isotopeItem.querySelector('.isotope-container');
      
      if (!container) return;
      
      let iso;
      imagesLoaded(container, () => {
        iso = new Isotope(container, {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });
      
      isotopeItem.querySelectorAll('.isotope-filters li').forEach(btn => {
        btn.addEventListener('click', function() {
          isotopeItem.querySelector('.isotope-filters .filter-active')?.classList.remove('filter-active');
          this.classList.add('filter-active');
          iso?.arrange({ filter: this.getAttribute('data-filter') });
          if (typeof AOS !== 'undefined') AOS.init();
        });
      });
    });
  }
  function filterTalks(category) {
  // Gestione classe attiva sui bottoni
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Filtraggio elementi della griglia
  const items = document.querySelectorAll('.talk-item');
  items.forEach(item => {
    if (category === 'all' || item.classList.contains(category)) {
      item.style.display = 'block';
      item.classList.add('animate__animated', 'animate__fadeIn');
    } else {
      item.style.display = 'none';
    }
  });
}

function submitTelaioForm(e) {
      e.preventDefault();
      const feedback = document.getElementById('feedback-message');
      feedback.classList.remove('d-none');
      
      // Scroll smooth al messaggio
      feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Reset form
      setTimeout(() => {
        document.getElementById('form-telaio').reset();
      }, 1000);
    }
  
  
})();

