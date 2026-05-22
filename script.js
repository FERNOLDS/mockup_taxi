/* ════════════════════════════════════════════
   NAVBAR — scroll effect
════════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ════════════════════════════════════════════
   SMOOTH SCROLL
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

/* ════════════════════════════════════════════
   HERO PARTICLES
════════════════════════════════════════════ */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  const resize = () => {
    canvas.width  = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 55;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.4 + 0.1,
  }));

  let mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,215,0,${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      // Mouse repel
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.vx += (dx / dist) * 0.08;
        p.vy += (dy / dist) * 0.08;
      }

      // Speed cap
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) { p.vx = (p.vx / speed) * 0.8; p.vy = (p.vy / speed) * 0.8; }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,215,0,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════════════════════════════════════
   HERO PARALLAX on mouse
════════════════════════════════════════════ */
const glow1 = document.querySelector('.hero-glow--1');
const glow2 = document.querySelector('.hero-glow--2');
window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  if (glow1) glow1.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
  if (glow2) glow2.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
}, { passive: true });

/* ════════════════════════════════════════════
   CHAT MESSAGES — stagger on scroll into view
════════════════════════════════════════════ */
const chatObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const msgs = e.target.querySelectorAll('.chat-msg');
      msgs.forEach((msg, i) => {
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(12px)';
        setTimeout(() => {
          msg.style.transition = 'opacity .4s ease, transform .4s ease';
          msg.style.opacity = '1';
          msg.style.transform = 'translateY(0)';
        }, 150 + i * 180);
      });
      chatObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.chat-body').forEach(el => chatObserver.observe(el));

/* ════════════════════════════════════════════
   FEATURE CARDS — tilt effect on hover
════════════════════════════════════════════ */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease';
    setTimeout(() => card.style.transition = '', 400);
  });
});

/* ════════════════════════════════════════════
   MOBILE NAV
════════════════════════════════════════════ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    if (open) {
      navLinks.style.display = 'none';
    } else {
      Object.assign(navLinks.style, {
        display: 'flex', flexDirection: 'column',
        position: 'absolute', top: '72px', left: '0', right: '0',
        background: 'rgba(8,8,8,.97)', padding: '20px 24px', gap: '16px',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      });
    }
  });
}

/* ════════════════════════════════════════════
   FLOWCHART — animated lines & packets
════════════════════════════════════════════ */
(function initFlowchart() {
  const diagram = document.getElementById('fcDiagram');
  const svg     = document.getElementById('fcSvg');
  if (!diagram || !svg) return;

  /* ─── Logo image fallback ─── */
  document.querySelectorAll('.fc-logo-img').forEach(img => {
    function onErr() {
      const wb = img.dataset.webfb;
      if (wb && img.src.indexOf('icons/') !== -1) {
        img.src = wb;
      } else {
        img.style.display = 'none';
        const fb = img.nextElementSibling;
        if (fb) fb.style.display = 'flex';
      }
    }
    img.addEventListener('error', onErr);
  });

  /* ─── SVG helpers ─── */
  const NS = 'http://www.w3.org/2000/svg';
  function ns(tag) { return document.createElementNS(NS, tag); }

  function rel(el) {
    const er = el.getBoundingClientRect();
    const dr = diagram.getBoundingClientRect();
    return {
      x:  er.left   - dr.left,
      y:  er.top    - dr.top,
      w:  er.width,
      h:  er.height,
      cx: er.left   - dr.left + er.width  / 2,
      cy: er.top    - dr.top  + er.height / 2,
      r:  er.right  - dr.left,
      b:  er.bottom - dr.top,
    };
  }

  function makePath(x1, y1, x2, y2, stroke, width, dash) {
    const mx = (x1 + x2) / 2;
    const p  = ns('path');
    p.setAttribute('d', `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', stroke);
    p.setAttribute('stroke-width', String(width));
    if (dash) p.setAttribute('stroke-dasharray', dash);
    return p;
  }

  /* ─── SVG defs: glow filters ─── */
  function addDefs() {
    const defs = ns('defs');
    defs.innerHTML = `
      <filter id="fc-glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="fc-glow-lg" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>`;
    svg.appendChild(defs);
  }

  /* ─── Animate packets with trail ─── */
  const packets = [];
  let raf;

  /*
   * addPacket — crea un punto con cola de 1 trazo fantasma.
   * totalLen se cachea para no recalcular en cada frame.
   * trailOffset: fracción del recorrido que va el tail atrás (0.05 = 5%).
   */
  function addPacket(path, totalLen, offset, speed, color, r, trailOffset) {
    const col = color || '#ffd700';
    const rad = r || 4;

    // Punto líder con glow
    const dot = ns('circle');
    dot.setAttribute('r', String(rad));
    dot.setAttribute('fill', col);
    dot.setAttribute('filter', 'url(#fc-glow)');
    svg.appendChild(dot);

    // Cola (sin filter, más chica y transparente)
    const tail = ns('circle');
    tail.setAttribute('r', String(rad * 0.55));
    tail.setAttribute('fill', col);
    svg.appendChild(tail);

    packets.push({ path, dot, tail, t: offset % 1, speed, totalLen, trailOffset: trailOffset || 0.055 });
  }

  function tick() {
    packets.forEach(p => {
      p.t = (p.t + p.speed) % 1;
      const len  = p.totalLen;
      const tTail = ((p.t - p.trailOffset) + 1) % 1;  // wrap correcto

      const pt  = p.path.getPointAtLength(p.t    * len);
      const pt2 = p.path.getPointAtLength(tTail  * len);

      const baseOpacity = Math.sin(p.t * Math.PI);

      p.dot.setAttribute('cx', pt.x.toFixed(1));
      p.dot.setAttribute('cy', pt.y.toFixed(1));
      p.dot.setAttribute('opacity', (baseOpacity * 0.95).toFixed(2));

      p.tail.setAttribute('cx', pt2.x.toFixed(1));
      p.tail.setAttribute('cy', pt2.y.toFixed(1));
      p.tail.setAttribute('opacity', (baseOpacity * 0.3).toFixed(2));
    });
    raf = requestAnimationFrame(tick);
  }

  /* ─── Draw paths: sources → taxi → renata → user ─── */
  function drawLines() {
    if (raf) cancelAnimationFrame(raf);
    svg.innerHTML = '';
    packets.length = 0;

    addDefs();

    const taxiEl   = document.getElementById('fcTaxiBox');
    const renataEl = document.getElementById('fcRenata');
    const userEl   = document.getElementById('fcUser');
    const srcEls   = Array.from(document.querySelectorAll('.fc-src-icon'));
    if (!taxiEl || !renataEl || !userEl || !srcEls.length) return;

    const tR  = rel(taxiEl);
    const rnR = rel(renataEl);
    const uR  = rel(userEl);
    const n   = srcEls.length;

    /* Sources → Taxi (fan: entradas distribuidas verticalmente en el borde izq) */
    srcEls.forEach((src, i) => {
      const sR  = rel(src);
      // Distribuir puntos de entrada a lo largo del borde izquierdo del Taxi box
      const fanY = tR.y + tR.h * (0.15 + (i / Math.max(n - 1, 1)) * 0.70);

      // Línea de fondo (más ancha, muy tenue) para sensación de canal
      const bg = makePath(sR.r, sR.cy, tR.x, fanY, 'rgba(255,215,0,.07)', 5, null);
      svg.insertBefore(bg, svg.firstChild);

      // Línea punteada principal
      const path = makePath(sR.r, sR.cy, tR.x, fanY, 'rgba(255,215,0,.28)', 1.3, '4 5');
      svg.insertBefore(path, svg.firstChild);

      const len   = path.getTotalLength();
      const speed = 0.0045 + Math.random() * 0.002;
      // 2 paquetes por fuente, desfasados
      addPacket(path, len, i * 0.17,        speed, '#ffd700', 3.5, 0.06);
      addPacket(path, len, i * 0.17 + 0.5,  speed, '#ffd700', 3.5, 0.06);
    });

    /* Taxi → Renata */
    {
      const bg   = makePath(tR.r, tR.cy, rnR.cx - 32, rnR.cy, 'rgba(255,215,0,.09)', 8, null);
      svg.insertBefore(bg, svg.firstChild);
      const path = makePath(tR.r, tR.cy, rnR.cx - 32, rnR.cy, 'rgba(255,215,0,.5)', 1.8, '5 4');
      svg.insertBefore(path, svg.firstChild);
      const len = path.getTotalLength();
      addPacket(path, len, 0,    0.007, '#ffd700', 4.5, 0.07);
      addPacket(path, len, 0.33, 0.007, '#ffd700', 4.5, 0.07);
      addPacket(path, len, 0.66, 0.007, '#ffd700', 4.5, 0.07);
    }

    /* Renata → User */
    {
      const bg   = makePath(rnR.cx + 32, rnR.cy, uR.cx, uR.y, 'rgba(255,215,0,.10)', 8, null);
      svg.insertBefore(bg, svg.firstChild);
      const path = makePath(rnR.cx + 32, rnR.cy, uR.cx, uR.y, 'rgba(255,215,0,.60)', 1.8, '5 4');
      svg.insertBefore(path, svg.firstChild);
      const len = path.getTotalLength();
      addPacket(path, len, 0,   0.008, '#ffe84d', 5, 0.06);
      addPacket(path, len, 0.5, 0.008, '#ffe84d', 5, 0.06);
    }

    tick();
  }

  /* Dibujar cuando el diagrama entra en vista */
  const visObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { setTimeout(drawLines, 1100); visObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  visObs.observe(diagram);

  /* Redibujar en resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawLines, 260);
  }, { passive: true });
})();
