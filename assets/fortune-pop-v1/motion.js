/* Five-element keychain motion. Attach to .art[data-element] containing .charm.
   Pointer/touch adds a damped pendulum impulse; the PNG itself remains unchanged. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const tuning = [
    { stiffness: 22, damping: 2.8, amplitude: 2.2, frequency: 1.20, kick: 21, pivot: '59% 7%' },
    { stiffness: 34, damping: 2.5, amplitude: 2.8, frequency: 1.55, kick: 26, pivot: '54% 7%' },
    { stiffness: 17, damping: 3.8, amplitude: 1.3, frequency: 0.88, kick: 16, pivot: '53% 7%' },
    { stiffness: 38, damping: 3.0, amplitude: 1.8, frequency: 1.40, kick: 23, pivot: '60% 7%' },
    { stiffness: 19, damping: 2.4, amplitude: 2.6, frequency: 1.02, kick: 20, pivot: '54% 7%' },
  ];
  const nodes = [...document.querySelectorAll('.art[data-element]')].map((area, i) => {
    const charm = area.querySelector('.charm');
    const config = tuning[Number(area.dataset.element)];
    charm.style.transformOrigin = config.pivot;
    const state = { area, charm, config, phase: i * 1.7, angle: 0, velocity: 0, dragging: false, visible: false, lastX: 0, lastT: 0 };
    const paint = () => { charm.style.transform = `rotate(${state.angle.toFixed(3)}deg)`; };
    state.reset = () => { state.angle = 0; state.velocity = 0; paint(); };
    state.kick = (direction = 1) => {
      if (!enabled || reduced.matches) return;
      state.velocity = Math.max(-65, Math.min(65, state.velocity + config.kick * direction));
      start();
    };
    area.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = area.getBoundingClientRect();
      state.kick(event.clientX < rect.left + rect.width / 2 ? -0.65 : 0.65);
    });
    area.addEventListener('pointerdown', event => {
      if (event.button !== 0 || !enabled || reduced.matches) return;
      state.dragging = true; state.lastX = event.clientX; state.lastT = performance.now();
      area.setPointerCapture(event.pointerId);
      state.kick(event.clientX < area.getBoundingClientRect().left + area.clientWidth / 2 ? -1 : 1);
      area.classList.add('dragging');
    });
    area.addEventListener('pointermove', event => {
      if (!state.dragging) return;
      const now = performance.now(), dx = event.clientX - state.lastX;
      const elapsed = Math.max(12, now - state.lastT);
      state.angle = Math.max(-14, Math.min(14, state.angle + dx * 0.09));
      state.velocity = Math.max(-65, Math.min(65, dx / elapsed * 95));
      state.lastX = event.clientX; state.lastT = now;
      paint();
    });
    const release = () => { state.dragging = false; area.classList.remove('dragging'); start(); };
    area.addEventListener('pointerup', release);
    area.addEventListener('pointercancel', release);
    area.addEventListener('lostpointercapture', release);
    area.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); state.kick(); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); state.kick(event.key === 'ArrowLeft' ? -1 : 1); }
    });
    return state;
  });
  let running = false, frame = 0, previous = 0, time = 0, enabled = true;
  function start() {
    if (running || !enabled || reduced.matches || document.hidden || !nodes.some(s => s.visible)) return;
    running = true; previous = 0; frame = requestAnimationFrame(tick);
  }
  function stop(reset = false) {
    cancelAnimationFrame(frame); running = false; previous = 0;
    if (reset) nodes.forEach(s => { s.dragging = false; s.area.classList.remove('dragging'); s.reset(); });
  }
  function tick(now) {
    if (!enabled || reduced.matches || document.hidden || !nodes.some(s => s.visible)) { stop(); return; }
    const dt = previous ? Math.min((now - previous) / 1000, 0.035) : 1 / 60;
    previous = now; time += dt;
    for (const s of nodes) {
      if (!s.visible || s.dragging) continue;
      const c = s.config;
      const target = Math.sin(time * c.frequency + s.phase) * c.amplitude;
      // Two integration steps keep quick pointer releases stable at low frame rates.
      for (let i = 0; i < 2; i++) {
        s.velocity += ((target - s.angle) * c.stiffness - s.velocity * c.damping) * dt / 2;
        s.angle = Math.max(-14, Math.min(14, s.angle + s.velocity * dt / 2));
      }
      s.charm.style.transform = `rotate(${s.angle.toFixed(3)}deg)`;
    }
    frame = requestAnimationFrame(tick);
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const s = nodes.find(n => n.area === entry.target);
      s.visible = entry.isIntersecting;
      s.charm.style.willChange = entry.isIntersecting ? 'transform' : 'auto';
    }
    if (nodes.some(s => s.visible)) start(); else stop();
  }, { threshold: 0.05 });
  nodes.forEach(s => observer.observe(s.area));
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  const toggle = document.getElementById('motionToggle');
  function sync() {
    const active = enabled && !reduced.matches;
    if (toggle) {
      toggle.disabled = reduced.matches;
      toggle.setAttribute('aria-pressed', String(active));
      toggle.textContent = reduced.matches ? '동작 줄이기 적용 중' : active ? '찰랑임 켜짐' : '찰랑임 꺼짐';
    }
    if (active) start(); else stop(true);
  }
  toggle?.addEventListener('click', () => { enabled = !enabled; sync(); });
  document.getElementById('shakeAll')?.addEventListener('click', () => {
    if (!enabled || reduced.matches) return;
    nodes.forEach((s, i) => s.kick(i % 2 ? -1.5 : 1.5));
  });
  reduced.addEventListener('change', sync);
  sync();
})();
