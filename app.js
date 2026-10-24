(() => {
  const cfg = window.GAME_CONFIG;
  const directiveScreen = document.getElementById('directiveScreen');
  const terminalScreen = document.getElementById('terminalScreen');
  const main = document.getElementById('mainContent');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  const bgm = document.getElementById('bgm');
  const sfxVerified = document.getElementById('sfxVerified');
  const sfxRejected = document.getElementById('sfxRejected');
  const sfxBirthday = document.getElementById('sfxBirthday');
  const audioBtn = document.getElementById('audioBtn');
  const isDev = new URLSearchParams(location.search).get('dev') === '1';

  document.querySelectorAll('[data-cadet]').forEach(el => el.textContent = cfg.cadetName);
  bgm.src = cfg.audio.ambient;
  sfxVerified.src = cfg.audio.verified;
  sfxRejected.src = cfg.audio.rejected;
  sfxBirthday.src = cfg.audio.birthday;

  const state = loadState();
  let activeMission = null;
  let hintIndex = 0;
  let audioEnabled = state.audioEnabled ?? true;

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem('scoutDecoderState')) || { completed: [] };
    } catch { return { completed: [] }; }
  }
  function saveState() {
    state.audioEnabled = audioEnabled;
    localStorage.setItem('scoutDecoderState', JSON.stringify(state));
  }
  function safePlay(audio) {
    if (!audioEnabled) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
  function beginAudio() {
    if (!audioEnabled) return;
    bgm.volume = .26;
    bgm.play().catch(() => {});
  }
  function setAudioLabel() {
    audioBtn.textContent = audioEnabled ? '♫ AUDIO' : '× MUTED';
  }

  document.getElementById('beginBtn').addEventListener('click', () => {
    directiveScreen.classList.remove('active');
    terminalScreen.classList.add('active');
    beginAudio();
    renderDashboard();
  });
  document.getElementById('homeBtn').addEventListener('click', renderDashboard);
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Reset all progress and restart from the beginning?')) return;
    localStorage.removeItem('scoutDecoderState');
    location.reload();
  });
  audioBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    saveState(); setAudioLabel();
    if (audioEnabled) beginAudio(); else bgm.pause();
  });
  setAudioLabel();
  document.getElementById('modalClose').addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  function unlockedMissionIds() {
    const maxCompleted = state.completed.length ? Math.max(...state.completed) : 0;
    return new Set(cfg.missions.filter(m => m.id <= Math.min(5, maxCompleted + 1)).map(m => m.id));
  }

  function renderDashboard() {
    activeMission = null;
    const unlocked = unlockedMissionIds();
    const completed = state.completed.length;
    main.innerHTML = `
      <section class="dashboard">
        <div class="dashboard-hero">
          <div class="parchment-panel">
            <div class="eyebrow" style="color:#72582f">HEADQUARTERS OPERATION LOG</div>
            <h2>FIVE MISSIONS.<br><span>ONE FINAL MESSAGE.</span></h2>
            <p>Complete each directive in order. Enter the recovered code into the Secure Terminal to receive authorization for the next mission.</p>
          </div>
          <div class="progress-panel">
            <div class="progress-label">VERIFIED DIRECTIVES</div>
            <div class="progress-num">${completed}/5</div>
            <div class="progress-track"><div class="progress-fill" style="width:${completed/5*100}%"></div></div>
          </div>
        </div>
        <div class="mission-grid">
          ${cfg.missions.map(m => missionCard(m, unlocked.has(m.id), state.completed.includes(m.id))).join('')}
        </div>
        ${isDev ? devPanel() : ''}
      </section>`;

    main.querySelectorAll('[data-mission]').forEach(card => {
      card.addEventListener('click', () => {
        const id = Number(card.dataset.mission);
        if (!unlocked.has(id) && !isDev) return;
        renderMission(id);
      });
    });
    bindDev();
  }

  function missionCard(m, unlocked, complete) {
    return `<article class="mission-card ${unlocked || isDev ? '' : 'locked'}" data-mission="${m.id}">
      <div class="mission-card-bg" style="background-image:url('${m.image}')"></div>
      ${complete ? '<div class="verified-stamp">TRANSMISSION VERIFIED</div>' : ''}
      <div class="mission-card-content">
        <div class="mission-card-num">0${m.id}</div>
        <h3>${m.title}</h3>
        <p>${m.subtitle}</p>
      </div>
    </article>`;
  }

  function renderMission(id) {
    const m = cfg.missions.find(x => x.id === id);
    if (!m) return;
    activeMission = m;
    hintIndex = 0;
    const length = m.id === 5 ? 5 : 4;
    main.innerHTML = `
      <section class="mission-view">
        <button class="back-link" id="backToMissions">← OPERATIONS INDEX</button>
        <div class="mission-layout">
          <div class="mission-art" style="background-image:url('${m.image}')"></div>
          <div class="mission-copy">
            <div class="mission-kicker">DIRECTIVE 0${m.id} // ${m.subtitle.toUpperCase()}</div>
            <h2>MISSION <span>0${m.id}</span></h2>
            <div class="mission-title">${m.title}</div>
            <p class="transmission">${m.transmission}</p>
            <div class="terminal-box">
              <div class="terminal-label">${m.id === 5 ? 'FINAL VALIDATION' : 'SECURE TERMINAL // ENTER CODE'}</div>
              <div class="code-row" id="codeRow">
                ${Array.from({length},(_,i)=>`<input class="code-input" maxlength="1" inputmode="${m.inputType==='numeric'?'numeric':'text'}" aria-label="Code position ${i+1}">`).join('')}
              </div>
              <div class="mission-actions">
                <button class="primary-btn" id="submitCode">TRANSMIT</button>
                <button class="hint-btn" id="hintBtn">REQUEST INTELLIGENCE</button>
              </div>
              <div class="hint-area" id="hintArea">No intelligence requested.</div>
              ${m.code === null ? '<div class="config-warning">This mission code has not been configured yet.</div>' : ''}
            </div>
          </div>
        </div>
      </section>`;

    document.getElementById('backToMissions').addEventListener('click', renderDashboard);
    bindInputs(m);
    document.getElementById('submitCode').addEventListener('click', submitCode);
    document.getElementById('hintBtn').addEventListener('click', revealHint);
  }

  function bindInputs(m) {
    const inputs = [...document.querySelectorAll('.code-input')];
    inputs.forEach((input, idx) => {
      input.addEventListener('input', e => {
        let v = e.target.value.toUpperCase().slice(-1);
        if (m.inputType === 'numeric') v = v.replace(/\D/g,'');
        else v = v.replace(/[^A-Z]/g,'');
        e.target.value = v;
        if (v && inputs[idx+1]) inputs[idx+1].focus();
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !input.value && inputs[idx-1]) inputs[idx-1].focus();
        if (e.key === 'Enter') submitCode();
      });
    });
    setTimeout(()=>inputs[0]?.focus(),100);
  }

  function enteredCode() {
    return [...document.querySelectorAll('.code-input')].map(i=>i.value).join('').toUpperCase();
  }

  function submitCode() {
    const m = activeMission;
    if (!m) return;
    if (m.code === null && !isDev) {
      showModal('CODE NOT CONFIGURED', 'Headquarters has not yet loaded the final validation key for this directive.');
      return;
    }
    const entered = enteredCode();
    const correct = isDev && entered === 'DEV' ? true : entered === String(m.code || '').toUpperCase();
    if (!correct) {
      safePlay(sfxRejected);
      const row = document.getElementById('codeRow');
      row.animate([{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:260});
      showModal('TRANSMISSION REJECTED', 'The code does not match Headquarters records. Recheck the recovered intelligence and try again.', true);
      return;
    }
    verifyMission(m);
  }

  function verifyMission(m) {
    if (!state.completed.includes(m.id)) state.completed.push(m.id);
    state.completed.sort((a,b)=>a-b);
    saveState();
    if (m.specialSuccess === 'finale') {
      bgm.pause(); safePlay(sfxBirthday); renderFinale(); return;
    }
    safePlay(sfxVerified);
    if (m.specialSuccess === 'recoveredHeadings') showRecoveredHeadingsSuccess(m);
    else showSuccess(m);
  }

  function showSuccess(m) {
    modalBody.innerHTML = `
      <div class="eyebrow" style="color:#7b6240">HEADQUARTERS CONFIRMATION</div>
      <div class="modal-heading">TRANSMISSION<br><span style="color:#8d2527">VERIFIED</span></div>
      <h3>${m.successTitle}</h3>
      <p class="modal-copy">${m.successText}</p>
      <button class="primary-btn" id="continueBtn">CONTINUE OPERATION</button>`;
    openModal();
    document.getElementById('continueBtn').addEventListener('click',()=>{ closeModal(); renderDashboard(); });
  }

  function showRecoveredHeadingsSuccess(m) {
    modalBody.innerHTML = `
      <div class="eyebrow" style="color:#7b6240">INTELLIGENCE DIVISION // VERIFIED</div>
      <div class="modal-heading">TRANSMISSION<br><span style="color:#8d2527">VERIFIED</span></div>
      <h3>${m.successTitle}</h3>
      <p class="modal-copy"><strong>During verification, Intelligence Division recovered four unidentified directional readings from the patrol data. Their purpose is currently unknown.</strong></p>
      <p class="modal-copy"><strong>RECORD THEM. DO NOT DISCARD THEM.</strong></p>
      <div class="heading-list">${cfg.mission2RecoveredHeadings.map(h=>`<div>${h}</div>`).join('')}</div>
      <p>${m.successText}</p>
      <button class="primary-btn" id="continueBtn">CONTINUE OPERATION</button>`;
    openModal();
    document.getElementById('continueBtn').addEventListener('click',()=>{ closeModal(); renderDashboard(); });
  }

  function revealHint() {
    if (!activeMission) return;
    const area = document.getElementById('hintArea');
    const hints = activeMission.hints;
    const idx = Math.min(hintIndex, hints.length-1);
    area.innerHTML = `<strong>INTELLIGENCE ${String(idx+1).padStart(2,'0')}</strong><br>${hints[idx]}`;
    if (hintIndex < hints.length-1) hintIndex++;
    else document.getElementById('hintBtn').textContent = 'MAXIMUM INTELLIGENCE';
  }

  function renderFinale() {
    main.innerHTML = `
      <section class="final-screen">
        <div class="final-card">
          <div class="final-bg"></div><div class="final-overlay"></div>
          <div class="final-copy">
            <div class="eyebrow">SCOUT REGIMENT // FINAL CONFIRMATION</div>
            <h2>OPERATION<br><span>COMPLETE</span></h2>
            <p>All five directives have been verified. Headquarters confirms that the operation was a success. Your presents are where cars are supposed to be !</p>
            <h3 style="font-size:clamp(2rem,5vw,4rem);margin:1.4rem 0 .4rem">HAPPY BIRTHDAY, ${cfg.cadetName}!</h3>
            <p class="final-motto">FOR THE GLORY OF HUMANITY.</p>
            <button class="secondary-btn" id="returnBtn">VIEW OPERATIONS LOG</button>
          </div>
        </div>
      </section>`;
    document.getElementById('returnBtn').addEventListener('click',()=>{ beginAudio(); renderDashboard(); });
  }

  function showModal(title, copy, rejected=false) {
    modalBody.innerHTML = `<div class="eyebrow" style="color:#7b6240">SECURE TERMINAL</div><div class="modal-heading ${rejected?'red':''}">${title}</div><p class="modal-copy">${copy}</p>`;
    openModal();
  }
  function openModal(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
  function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }

  function devPanel() {
    return `<div class="dev-panel"><strong>DEVELOPER MODE</strong><br>
      <button data-dev="reset">Reset progress</button>
      ${cfg.missions.map(m=>`<button data-dev="complete" data-id="${m.id}">Complete ${m.id}</button>`).join('')}
      <button data-dev="finale">Preview finale</button>
      <p>For a mission whose code is not configured, developer mode can mark it complete from here.</p></div>`;
  }
  function bindDev() {
    if (!isDev) return;
    main.querySelectorAll('[data-dev="reset"]').forEach(b=>b.onclick=()=>{state.completed=[];saveState();renderDashboard();});
    main.querySelectorAll('[data-dev="complete"]').forEach(b=>b.onclick=()=>{const id=+b.dataset.id;if(!state.completed.includes(id))state.completed.push(id);state.completed.sort((a,c)=>a-c);saveState();renderDashboard();});
    main.querySelectorAll('[data-dev="finale"]').forEach(b=>b.onclick=renderFinale);
  }
})();
