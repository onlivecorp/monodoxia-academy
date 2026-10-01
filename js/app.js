// Monodoxia Academy - Complete Digital Ecosystem Controller

class MonodoxiaApp {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('monodoxia_user')) || null;
    this.progress = JSON.parse(localStorage.getItem('monodoxia_progress')) || {
      'course-1': { completedLessons: ['l1-1', 'l1-2'], percent: 33 },
      'course-2': { completedLessons: [], percent: 0 },
      'course-3': { completedLessons: [], percent: 0 },
      'course-4': { completedLessons: [], percent: 0 }
    };
    this.certificates = JSON.parse(localStorage.getItem('monodoxia_certificates')) || [];
    this.bookings = JSON.parse(localStorage.getItem('monodoxia_bookings')) || [];
    this.userTier = localStorage.getItem('monodoxia_tier') || 'Free';
    this.activeCourse = null;
    this.activeLesson = null;

    this.init();
  }

  init() {
    window.I18N.applyTranslations();
    this.bindEvents();
    this.updateAuthUI();
    this.renderAcademyCourses('all');
    this.renderClubTiers();
    this.renderCoaches();
    this.renderCommunity();
    this.renderEvents();
    this.checkSafetyNotice();
  }

  // --- UI Notifications ---
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `px-5 py-3 rounded shadow-lg text-sm font-medium flex items-center gap-3 transition-all duration-300 border ${
      type === 'success' 
        ? 'bg-surface-bright text-primary border-secondary' 
        : type === 'error'
        ? 'bg-red-50 text-red-800 border-red-200'
        : 'bg-primary-container text-surface-bright border-secondary/40'
    }`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-secondary text-[20px]">${type === 'success' ? 'check_circle' : 'info'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- Auth & Session ---
  updateAuthUI() {
    const authActions = document.getElementById('header-auth-actions');
    const adminLink = document.getElementById('admin-quick-link');
    if (!authActions) return;

    if (this.currentUser) {
      authActions.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col text-right">
            <span class="text-xs font-semibold text-primary">${this.currentUser.firstName} ${this.currentUser.lastName}</span>
            <span class="text-[10px] text-secondary font-medium tracking-wide uppercase">${this.currentUser.role || 'Tələbə'} • ${this.userTier}</span>
          </div>
          <button id="user-menu-btn" class="w-9 h-9 rounded-full bg-secondary/10 border border-secondary text-secondary flex items-center justify-center font-bold text-xs uppercase" title="Hesabım">
            ${this.currentUser.firstName ? this.currentUser.firstName[0] : 'U'}
          </button>
          <button id="logout-btn" class="text-xs text-on-surface-variant hover:text-red-700 flex items-center gap-1 p-1 transition-colors" title="Çıxış">
            <span class="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      `;

      if (adminLink) {
        adminLink.classList.remove('hidden');
      }

      document.getElementById('logout-btn')?.addEventListener('click', () => this.logout());
      document.getElementById('user-menu-btn')?.addEventListener('click', () => this.openProfileModal());
    } else {
      authActions.innerHTML = `
        <button id="open-login-btn" class="text-on-surface hover:text-secondary font-label-md text-label-md transition-colors duration-200">
          Daxil ol
        </button>
        <button id="open-register-btn" class="bg-primary-container text-on-primary hover:bg-[#112240] px-5 py-2.5 rounded text-label-md font-label-md tracking-wider transition-all duration-200 shadow-sm flex items-center gap-1.5 border border-secondary/30">
          <span>Qoşul</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      `;

      if (adminLink) {
        adminLink.classList.remove('hidden'); // allow testing admin
      }

      document.getElementById('open-login-btn')?.addEventListener('click', () => this.openAuthModal('login'));
      document.getElementById('open-register-btn')?.addEventListener('click', () => this.openAuthModal('register'));
    }
  }

  openAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.switchAuthTab(mode);
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('hidden');
  }

  switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form-pane');
    const registerForm = document.getElementById('register-form-pane');
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');

    if (tab === 'login') {
      loginForm?.classList.remove('hidden');
      registerForm?.classList.add('hidden');
      tabLogin?.classList.add('border-b-2', 'border-secondary', 'text-primary', 'font-semibold');
      tabLogin?.classList.remove('text-on-surface-variant');
      tabRegister?.classList.remove('border-b-2', 'border-secondary', 'text-primary', 'font-semibold');
      tabRegister?.classList.add('text-on-surface-variant');
    } else {
      loginForm?.classList.add('hidden');
      registerForm?.classList.remove('hidden');
      tabRegister?.classList.add('border-b-2', 'border-secondary', 'text-primary', 'font-semibold');
      tabRegister?.classList.remove('text-on-surface-variant');
      tabLogin?.classList.remove('border-b-2', 'border-secondary', 'text-primary', 'font-semibold');
      tabLogin?.classList.add('text-on-surface-variant');
    }
  }

  handleRegister(formData) {
    const user = {
      id: 'usr_' + Date.now(),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      birthDate: formData.get('birthDate'),
      country: formData.get('country') || 'Azərbaycan',
      city: formData.get('city') || 'Bakı',
      role: 'Tələbə',
      joinedAt: new Date().toISOString(),
      focusAreas: []
    };

    this.currentUser = user;
    localStorage.setItem('monodoxia_user', JSON.stringify(user));
    this.closeAuthModal();
    this.updateAuthUI();
    this.toast(`Xoş gəldiniz, ${user.firstName}! Hesabınız yaradıldı.`, 'success');

    // Trigger Onboarding Flow
    setTimeout(() => {
      this.openOnboardingModal();
    }, 500);
  }

  handleLogin(email, password) {
    // Simulated credential check
    const mockUser = {
      id: 'usr_active',
      firstName: email.split('@')[0],
      lastName: 'Tələbə',
      email: email,
      role: email.includes('admin') ? 'Admin' : (email.includes('coach') ? 'Kouç' : 'Tələbə'),
      country: 'Azərbaycan',
      city: 'Bakı'
    };

    this.currentUser = mockUser;
    localStorage.setItem('monodoxia_user', JSON.stringify(mockUser));
    this.closeAuthModal();
    this.updateAuthUI();
    this.toast(`Daxil oldunuz: ${mockUser.firstName}`, 'success');
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('monodoxia_user');
    this.updateAuthUI();
    this.toast('Hesabdan çıxış edildi', 'info');
  }

  // --- Onboarding Flow (9 Focus Areas) ---
  openOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (!modal) return;

    const grid = document.getElementById('onboarding-grid');
    if (grid) {
      grid.innerHTML = MONODOXIA_DATA.onboardingQuestions.map(q => `
        <label class="cursor-pointer p-4 rounded border border-outline-variant/60 hover:border-secondary transition-all flex items-start gap-3 bg-surface-container-lowest">
          <input type="checkbox" name="focus_area" value="${q.id}" class="mt-1 rounded text-secondary focus:ring-secondary focus:ring-offset-0 border-outline">
          <div>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-[20px]">${q.icon}</span>
              <span class="font-semibold text-sm text-primary">${q.text}</span>
            </div>
            <p class="text-xs text-on-surface-variant mt-1">${q.desc}</p>
          </div>
        </label>
      `).join('');
    }

    modal.classList.remove('hidden');
  }

  closeOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) modal.classList.add('hidden');
  }

  saveOnboardingPreferences() {
    const selected = Array.from(document.querySelectorAll('input[name="focus_area"]:checked')).map(el => el.value);
    if (this.currentUser) {
      this.currentUser.focusAreas = selected;
      localStorage.setItem('monodoxia_user', JSON.stringify(this.currentUser));
    }
    this.closeOnboardingModal();
    this.toast('Fərdi inkişaf istiqamətləriniz qeyd edildi. Tövsiyələriniz hazırdır!', 'success');
  }

  // --- LMS Course Player & Progress Tracking ---
  renderAcademyCourses(filter = 'all') {
    const container = document.getElementById('courses-grid');
    if (!container) return;

    const filtered = filter === 'all' 
      ? MONODOXIA_DATA.courses 
      : MONODOXIA_DATA.courses.filter(c => c.category === filter);

    container.innerHTML = filtered.map(c => {
      const prog = this.progress[c.id] ? this.progress[c.id].percent : 0;
      return `
        <div class="bg-surface-container-lowest rounded ${c.featured ? 'border-t-2 border-t-secondary' : ''} border-x border-b border-outline-variant/60 p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-2.5 py-1 rounded ${c.badgeClass} font-label-sm text-label-sm font-semibold tracking-wider uppercase">${c.badge}</span>
              <span class="font-label-sm text-label-sm text-outline">${c.duration}</span>
            </div>
            <h3 class="font-headline-md text-headline-md text-primary font-serif mb-2">
              ${c.title}
            </h3>
            <p class="font-body-md text-body-md text-on-surface-variant mb-6">
              ${c.description}
            </p>
          </div>
          <div class="space-y-4 pt-4 border-t border-outline-variant/30">
            <div class="flex items-center justify-between text-xs">
              <span class="text-on-surface-variant">Aparıcı Kouç: <strong class="text-primary font-medium">${c.instructor}</strong></span>
              <span class="text-secondary font-semibold">${c.status}</span>
            </div>
            <div>
              <div class="flex justify-between text-[11px] text-outline mb-1">
                <span>Tələbə tərəqqisi</span>
                <span>${prog}% tamamlandı</span>
              </div>
              <div class="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                <div class="bg-secondary h-full rounded-full transition-all duration-500" style="width: ${prog}%"></div>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="font-headline-sm text-headline-sm text-primary font-serif">${c.price}</span>
              <button onclick="window.app.openCoursePlayer('${c.id}')" class="px-5 py-2 rounded bg-primary-container text-on-primary hover:bg-[#112240] text-label-md font-label-md transition-colors flex items-center gap-1.5">
                <span>${prog > 0 ? 'Davam et' : 'Proqrama qoşul'}</span>
                <span class="material-symbols-outlined text-[16px]">play_circle</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  openCoursePlayer(courseId) {
    const course = MONODOXIA_DATA.courses.find(c => c.id === courseId);
    if (!course) return;

    this.activeCourse = course;
    this.activeLesson = course.modules[0].lessons[0];

    const modal = document.getElementById('course-player-modal');
    if (!modal) return;

    document.getElementById('player-course-title').textContent = course.title;
    document.getElementById('player-instructor').textContent = course.instructor;

    this.renderPlayerCurriculum();
    this.loadLesson(this.activeLesson);

    modal.classList.remove('hidden');
  }

  closeCoursePlayer() {
    const modal = document.getElementById('course-player-modal');
    if (modal) modal.classList.add('hidden');
  }

  renderPlayerCurriculum() {
    const tree = document.getElementById('player-curriculum-tree');
    if (!tree || !this.activeCourse) return;

    const progData = this.progress[this.activeCourse.id] || { completedLessons: [], percent: 0 };

    tree.innerHTML = this.activeCourse.modules.map((m, mIdx) => `
      <div class="mb-4">
        <h5 class="text-xs font-semibold tracking-wider text-secondary uppercase mb-2">Modul ${mIdx + 1}: ${m.title}</h5>
        <div class="space-y-1">
          ${m.lessons.map(l => {
            const isCompleted = progData.completedLessons.includes(l.id);
            const isActive = this.activeLesson && this.activeLesson.id === l.id;
            return `
              <div onclick="window.app.selectLesson('${l.id}')" class="p-2.5 rounded cursor-pointer text-xs flex items-center justify-between transition-colors ${
                isActive ? 'bg-primary-container text-surface-bright' : 'hover:bg-surface-container text-on-surface'
              }">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[16px] ${isCompleted ? 'text-secondary' : 'text-outline'}">
                    ${isCompleted ? 'check_circle' : (l.type === 'video' ? 'play_arrow' : (l.type === 'audio' ? 'headphones' : 'assignment'))}
                  </span>
                  <span>${l.title}</span>
                </div>
                <span class="text-[10px] text-outline">${l.duration}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    // Update progress bar in player
    const progLabel = document.getElementById('player-progress-label');
    const progBar = document.getElementById('player-progress-bar');
    if (progLabel && progBar) {
      progLabel.textContent = `${progData.percent}% tamamlandı`;
      progBar.style.width = `${progData.percent}%`;
    }
  }

  selectLesson(lessonId) {
    if (!this.activeCourse) return;
    for (const m of this.activeCourse.modules) {
      const found = m.lessons.find(l => l.id === lessonId);
      if (found) {
        this.activeLesson = found;
        this.loadLesson(found);
        this.renderPlayerCurriculum();
        break;
      }
    }
  }

  loadLesson(lesson) {
    document.getElementById('lesson-title-display').textContent = lesson.title;
    document.getElementById('lesson-type-badge').textContent = lesson.type.toUpperCase();

    const videoContainer = document.getElementById('player-video-container');
    const contentArea = document.getElementById('player-text-content');

    if (lesson.type === 'video') {
      videoContainer.classList.remove('hidden');
      contentArea.classList.add('hidden');
      videoContainer.innerHTML = `
        <div class="aspect-video bg-black rounded overflow-hidden relative shadow-lg">
          <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/inpok4MKVLM?autoplay=0" title="Monodoxia Lesson" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
    } else {
      videoContainer.classList.add('hidden');
      contentArea.classList.remove('hidden');
      contentArea.innerHTML = `
        <div class="p-6 bg-surface-container-low rounded border border-outline-variant space-y-4">
          <h4 class="font-headline-sm text-primary font-serif">Məşğələ Təlimatı və Təcrübə</h4>
          <p class="font-body-md text-on-surface-variant leading-relaxed">
            Bu dərsdə qeyd olunan nəfəs və daxili dialoq auditini yerinə yetirərkən sakit bir mühit seçin. Özünüzə qarşı mühakiməsiz, müşahidəçi mövqeyindən yanaşın.
          </p>
          <div class="p-4 bg-surface-bright rounded border-l-4 border-secondary text-xs text-secondary italic">
            "Fərqindəlik qorxuların üzərindəki qaranlığı yox edən ilk işıqdır."
          </div>
        </div>
      `;
    }

    const progData = this.progress[this.activeCourse.id] || { completedLessons: [] };
    const isDone = progData.completedLessons.includes(lesson.id);
    const completeBtn = document.getElementById('btn-complete-lesson');
    if (completeBtn) {
      completeBtn.innerHTML = isDone 
        ? `<span class="material-symbols-outlined text-[18px]">verified</span> Tamamlandı`
        : `<span class="material-symbols-outlined text-[18px]">check</span> Dərsi tamamla`;
    }
  }

  toggleLessonComplete() {
    if (!this.activeCourse || !this.activeLesson) return;
    const courseId = this.activeCourse.id;
    if (!this.progress[courseId]) {
      this.progress[courseId] = { completedLessons: [], percent: 0 };
    }

    const list = this.progress[courseId].completedLessons;
    const idx = list.indexOf(this.activeLesson.id);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(this.activeLesson.id);
    }

    // calculate total lessons
    let total = 0;
    this.activeCourse.modules.forEach(m => total += m.lessons.length);
    const percent = Math.min(100, Math.round((list.length / total) * 100));
    this.progress[courseId].percent = percent;

    localStorage.setItem('monodoxia_progress', JSON.stringify(this.progress));
    this.renderPlayerCurriculum();
    this.renderAcademyCourses();

    if (percent === 100) {
      this.issueCertificate(this.activeCourse);
    } else {
      this.toast(`Tərəqqi: ${percent}%`, 'info');
    }

    this.loadLesson(this.activeLesson);
  }

  issueCertificate(course) {
    const cert = {
      id: 'MDX-' + Math.floor(100000 + Math.random() * 900000),
      courseTitle: course.title,
      studentName: this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : "Tələbə",
      date: new Date().toLocaleDateString('az-AZ'),
      instructor: course.instructor
    };

    this.certificates.push(cert);
    localStorage.setItem('monodoxia_certificates', JSON.stringify(this.certificates));

    this.openCertificateModal(cert);
  }

  openCertificateModal(cert) {
    const modal = document.getElementById('certificate-modal');
    if (!modal) return;

    document.getElementById('cert-id-val').textContent = cert.id;
    document.getElementById('cert-student-val').textContent = cert.studentName;
    document.getElementById('cert-course-val').textContent = cert.courseTitle;
    document.getElementById('cert-instructor-val').textContent = cert.instructor;
    document.getElementById('cert-date-val').textContent = cert.date;

    modal.classList.remove('hidden');
    this.toast('Təbriklər! Sertifikatınız uğurla generasiya edildi.', 'success');
  }

  closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.add('hidden');
  }

  // --- Coach Booking Flow ---
  renderCoaches() {
    const container = document.getElementById('coaches-grid');
    if (!container) return;

    container.innerHTML = MONODOXIA_DATA.coaches.map(c => `
      <div class="bg-surface-container-lowest rounded border border-outline-variant/60 overflow-hidden group hover:border-secondary transition-colors flex flex-col justify-between">
        <div>
          <div class="aspect-[4/4] bg-surface-container overflow-hidden">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${c.image}" alt="${c.name}"/>
          </div>
          <div class="p-6">
            <div class="font-label-sm text-label-sm text-secondary tracking-widest uppercase mb-1">${c.title}</div>
            <h3 class="font-headline-md text-headline-md font-serif text-primary">${c.name}</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-2 mb-4">
              ${c.bio}
            </p>
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${c.specialties.map(s => `<span class="px-2 py-0.5 rounded-full text-[10px] bg-secondary/10 text-secondary border border-secondary/20">${s}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="p-6 pt-0">
          <button onclick="window.app.openBookingModal('${c.id}')" class="w-full block py-2.5 text-center border border-secondary text-primary hover:bg-secondary hover:text-surface-bright rounded text-label-sm font-label-sm uppercase tracking-wider transition-colors">
            Fərdi Sessiya Təyin Et
          </button>
        </div>
      </div>
    `).join('');
  }

  openBookingModal(coachId) {
    const coach = MONODOXIA_DATA.coaches.find(c => c.id === coachId);
    if (!coach) return;

    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    document.getElementById('booking-coach-name').textContent = coach.name;
    document.getElementById('booking-coach-title').textContent = coach.title;
    document.getElementById('booking-coach-img').src = coach.image;

    const slotSelect = document.getElementById('booking-slot-select');
    if (slotSelect) {
      slotSelect.innerHTML = coach.availableSlots.map(s => `<option value="${s}">${s}</option>`).join('');
    }

    modal.classList.remove('hidden');
  }

  closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.add('hidden');
  }

  confirmBooking() {
    const coachName = document.getElementById('booking-coach-name')?.textContent;
    const slot = document.getElementById('booking-slot-select')?.value;
    const type = document.getElementById('booking-session-type')?.value;

    const booking = {
      id: 'BK-' + Date.now(),
      coachName,
      slot,
      type,
      date: new Date().toLocaleDateString('az-AZ')
    };

    this.bookings.push(booking);
    localStorage.setItem('monodoxia_bookings', JSON.stringify(this.bookings));
    this.closeBookingModal();
    this.toast(`Sessiya uğurla təyin edildi: ${coachName} (${slot})`, 'success');
  }

  // --- Coaching Club Tiers ---
  renderClubTiers() {
    // rendered directly in html or can be refreshed dynamically
  }

  joinClubTier(tierId) {
    this.userTier = tierId.toUpperCase();
    localStorage.setItem('monodoxia_tier', this.userTier);
    this.updateAuthUI();
    this.toast(`Təbriklər! Siz artıq Monodoxia Coaching Club "${this.userTier}" üzvüsünüz.`, 'success');
  }

  // --- Community Forum ---
  renderCommunity() {
    const container = document.getElementById('community-topics-list');
    if (!container) return;

    container.innerHTML = MONODOXIA_DATA.communityTopics.map(t => `
      <div class="bg-surface-container-lowest p-5 rounded border border-outline-variant/60 shadow-sm hover:border-secondary/50 transition-colors">
        <div class="flex items-center justify-between text-xs text-outline mb-2">
          <span class="${t.badgeClass}">${t.badge}</span>
          <span>${t.time}</span>
        </div>
        <h4 class="font-headline-sm text-headline-sm text-primary mb-1">
          "${t.title}"
        </h4>
        <p class="font-body-sm text-body-sm text-on-surface-variant mb-3">
          ${t.snippet}
        </p>
        <div class="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
          <span class="text-on-surface-variant font-medium">Müəllif: ${t.author}</span>
          <div class="flex items-center gap-4 text-outline">
            <button onclick="window.app.likeTopic('${t.id}')" class="flex items-center gap-1 hover:text-secondary">
              <span class="material-symbols-outlined text-[16px]">favorite</span>
              <span>${t.likes}</span>
            </button>
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">chat_bubble</span>
              <span>${t.repliesCount}</span>
            </span>
          </div>
        </div>
      </div>
    `).join('');
  }

  likeTopic(topicId) {
    const topic = MONODOXIA_DATA.communityTopics.find(t => t.id === topicId);
    if (topic) {
      topic.likes++;
      this.renderCommunity();
      this.toast('Bəyənmə qeydə alındı', 'info');
    }
  }

  openNewTopicModal() {
    const modal = document.getElementById('new-topic-modal');
    if (modal) modal.classList.remove('hidden');
  }

  closeNewTopicModal() {
    const modal = document.getElementById('new-topic-modal');
    if (modal) modal.classList.add('hidden');
  }

  submitNewTopic(title, content) {
    const newT = {
      id: 'topic-' + Date.now(),
      badge: "İcma Müzakirəsi",
      badgeClass: "text-secondary font-semibold",
      time: "İndicə",
      title: title,
      snippet: content,
      author: this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : "Rezident",
      likes: 1,
      repliesCount: 0
    };

    MONODOXIA_DATA.communityTopics.unshift(newT);
    this.closeNewTopicModal();
    this.renderCommunity();
    this.toast('Mövzunuz uğurla dərc edildi.', 'success');
  }

  // --- Events ---
  renderEvents() {
    const container = document.getElementById('events-grid');
    if (!container) return;

    container.innerHTML = MONODOXIA_DATA.events.map(e => `
      <div class="bg-surface-container-lowest p-6 rounded border border-outline-variant/60 hover:border-secondary transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <span class="px-2.5 py-0.5 rounded ${e.badgeClass} font-label-sm text-label-sm uppercase font-semibold">${e.typeBadge}</span>
            <span class="font-label-sm text-label-sm text-outline">${e.datetime}</span>
          </div>
          <h3 class="font-headline-sm text-headline-sm text-primary mb-2">
            "${e.title}"
          </h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-6">
            ${e.desc}
          </p>
        </div>
        <div class="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
          <span class="text-xs text-on-surface-variant font-medium">Spiker: ${e.speaker}</span>
          <button onclick="window.app.registerEvent('${e.id}')" class="text-secondary hover:underline text-xs font-semibold">
            Qeydiyyatdan keç (${e.registered}/${e.capacity})
          </button>
        </div>
      </div>
    `).join('');
  }

  registerEvent(eventId) {
    const ev = MONODOXIA_DATA.events.find(e => e.id === eventId);
    if (!ev) return;
    if (ev.registered >= ev.capacity) {
      this.toast('Təəssüf ki, bütün yerlər doludur.', 'error');
      return;
    }
    ev.registered++;
    this.renderEvents();
    this.toast(`Tədbirə qeydiyyatınız təsdiqləndi: ${ev.title}`, 'success');
  }

  // --- Admin Dashboard Modal ---
  openAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (!modal) return;
    this.renderAdminUsers();
    modal.classList.remove('hidden');
  }

  closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) modal.classList.add('hidden');
  }

  renderAdminUsers() {
    const tbody = document.getElementById('admin-users-table');
    if (!tbody) return;

    const mockUsers = [
      { id: 'u1', name: 'Dr. Leyla Əliyeva', email: 'leyla@monodoxia.academy', role: 'Kouç', tier: 'VIP' },
      { id: 'u2', name: 'Fərid Məmmədov', email: 'farid@monodoxia.academy', role: 'Kouç', tier: 'VIP' },
      { id: 'u3', name: 'Aysel Məcidova', email: 'aysel@gmail.com', role: 'Tələbə', tier: 'Premium' },
      { id: 'u4', name: 'Tural İsmayılov', email: 'tural@gmail.com', role: 'Tələbə', tier: 'Basic' },
      { id: 'u5', name: 'Admin Baş Koordinator', email: 'admin@monodoxia.academy', role: 'Admin', tier: 'VIP' }
    ];

    tbody.innerHTML = mockUsers.map(u => `
      <tr class="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors">
        <td class="p-3 text-sm font-medium text-primary">${u.name}</td>
        <td class="p-3 text-xs text-on-surface-variant">${u.email}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded text-[11px] font-semibold ${
            u.role === 'Admin' ? 'bg-primary text-surface-bright' : (u.role === 'Kouç' ? 'bg-secondary text-surface-bright' : 'bg-surface-container text-on-surface')
          }">${u.role}</span>
        </td>
        <td class="p-3 text-xs font-semibold text-secondary">${u.tier}</td>
        <td class="p-3 text-xs">
          <button onclick="window.app.toast('İstifadəçi hüququ yeniləndi', 'info')" class="text-secondary hover:underline mr-2">Düzəliş</button>
        </td>
      </tr>
    `).join('');
  }

  // --- Psychology Safety Banner ---
  checkSafetyNotice() {
    const acknowledged = localStorage.getItem('monodoxia_safety_ack');
    const banner = document.getElementById('safety-notice-banner');
    if (!acknowledged && banner) {
      banner.classList.remove('hidden');
    }
  }

  acknowledgeSafetyNotice() {
    localStorage.setItem('monodoxia_safety_ack', 'true');
    const banner = document.getElementById('safety-notice-banner');
    if (banner) banner.classList.add('hidden');
    this.toast('Etik məxfilik və təhlükəsizlik razılığı qəbul edildi.', 'info');
  }

  // --- Profile View ---
  openProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (!modal || !this.currentUser) return;

    document.getElementById('profile-name').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    document.getElementById('profile-email').textContent = this.currentUser.email;
    document.getElementById('profile-role').textContent = this.currentUser.role;
    document.getElementById('profile-tier').textContent = this.userTier;
    document.getElementById('profile-certs-count').textContent = this.certificates.length;
    document.getElementById('profile-bookings-count').textContent = this.bookings.length;

    modal.classList.remove('hidden');
  }

  closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.add('hidden');
  }

  // --- Bind Event Listeners ---
  bindEvents() {
    // Language dropdown triggers
    document.querySelectorAll('.lang-select-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = opt.getAttribute('data-lang');
        window.I18N.setLanguage(lang);
      });
    });

    // Course filters
    document.querySelectorAll('.course-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.course-filter-btn').forEach(b => {
          b.classList.remove('bg-primary-container', 'text-on-primary');
          b.classList.add('text-on-surface-variant');
        });
        btn.classList.add('bg-primary-container', 'text-on-primary');
        btn.classList.remove('text-on-surface-variant');
        const filter = btn.getAttribute('data-filter');
        this.renderAcademyCourses(filter);
      });
    });
  }
}

// Global instance initialization
document.addEventListener('DOMContentLoaded', () => {
  window.app = new MonodoxiaApp();
});
