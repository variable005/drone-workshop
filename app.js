// Main Application Controller for Drone Workshop
// Coordinates navigation, search, slide presentation engine, and interactive quiz system

class DroneWorkshopApp {
  constructor() {
    this.currentTab = 'tab-overview';
    this.currentSlideDay = 'day1';
    this.currentSlideIndex = 0;
    this.quizScores = {};
    this.userProgress = {
      completedQuizzes: 0,
      totalQuizzes: 12,
      viewedSlides: new Set()
    };
  }

  init() {
    this.initNavigation();
    this.initSearch();
    this.initSlideDeck();
    this.initQuizHub();
    this.loadProgress();
    this.updateProgressBadge();
  }

  // Tab switching
  initNavigation() {
    const tabs = document.querySelectorAll('.nav-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTabId = e.currentTarget.getAttribute('data-tab');
        this.switchTab(targetTabId);
      });
    });

    // Quick jump buttons from hero / cards
    document.querySelectorAll('[data-jump-tab]').forEach(el => {
      el.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-jump-tab');
        this.switchTab(tab);
      });
    });

    // Quick jump to simulation
    document.querySelectorAll('[data-open-sim]').forEach(el => {
      el.addEventListener('click', (e) => {
        const simId = e.currentTarget.getAttribute('data-open-sim');
        this.switchTab('tab-simulations');
        if (window.droneSims) {
          window.droneSims.switchSimulation(simId);
        }
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If switching to simulations or slides, trigger resize
    if (tabId === 'tab-simulations' || tabId === 'tab-slides') {
      window.dispatchEvent(new Event('resize'));
    }
  }

  // Instant Search Engine
  initSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        // Remove highlights
        document.querySelectorAll('.hour-block').forEach(b => b.style.display = 'block');
        return;
      }

      // Search hour blocks
      document.querySelectorAll('.hour-block').forEach(block => {
        const text = block.textContent.toLowerCase();
        if (text.includes(query)) {
          block.style.display = 'block';
        } else {
          block.style.display = 'none';
        }
      });
    });
  }

  // Slide Deck Engine
  initSlideDeck() {
    const daySelect = document.getElementById('slide-day-select');
    const prevBtn = document.getElementById('slide-prev-btn');
    const nextBtn = document.getElementById('slide-next-btn');

    if (daySelect) {
      daySelect.addEventListener('change', (e) => {
        this.currentSlideDay = e.target.value;
        this.currentSlideIndex = 0;
        this.renderCurrentSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentSlideIndex > 0) {
          this.currentSlideIndex--;
          this.renderCurrentSlide();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const slides = SLIDES_DATA[this.currentSlideDay].slides;
        if (this.currentSlideIndex < slides.length - 1) {
          this.currentSlideIndex++;
          this.renderCurrentSlide();
        }
      });
    }

    // Keyboard shortcuts for slides
    window.addEventListener('keydown', (e) => {
      if (this.currentTab !== 'tab-slides') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        const slides = SLIDES_DATA[this.currentSlideDay].slides;
        if (this.currentSlideIndex < slides.length - 1) {
          this.currentSlideIndex++;
          this.renderCurrentSlide();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (this.currentSlideIndex > 0) {
          this.currentSlideIndex--;
          this.renderCurrentSlide();
        }
      }
    });

    this.renderCurrentSlide();
  }

  renderCurrentSlide() {
    const dayData = SLIDES_DATA[this.currentSlideDay];
    if (!dayData) return;
    const slides = dayData.slides;
    const slide = slides[this.currentSlideIndex];
    if (!slide) return;

    // Track viewed slides
    this.userProgress.viewedSlides.add(`${this.currentSlideDay}_${this.currentSlideIndex}`);
    this.saveProgress();
    this.updateProgressBadge();

    // DOM Elements
    const metaBadge = document.getElementById('slide-meta-badge');
    const heading = document.getElementById('slide-heading');
    const bulletsList = document.getElementById('slide-bullets-list');
    const takeawayText = document.getElementById('slide-takeaway-text');
    const imageEl = document.getElementById('slide-image');
    const captionEl = document.getElementById('slide-caption');
    const counterEl = document.getElementById('slide-counter-display');
    const simActionBtn = document.getElementById('slide-sim-action-btn');

    if (metaBadge) metaBadge.textContent = `Day ${slide.day} • ${slide.topic}`;
    if (heading) heading.textContent = slide.title;
    if (counterEl) counterEl.textContent = `Slide ${this.currentSlideIndex + 1} / ${slides.length}`;

    if (bulletsList) {
      bulletsList.innerHTML = slide.bullets.map(b => `<li>${b}</li>`).join('');
    }

    if (takeawayText) {
      takeawayText.textContent = slide.takeaway || "Essential foundation for real-world drone engineering.";
    }

    if (imageEl) {
      imageEl.src = slide.image;
      imageEl.alt = slide.title;
    }

    if (captionEl) {
      captionEl.textContent = slide.imageCaption || "Technical illustration";
    }

    // Direct simulation link
    if (simActionBtn) {
      if (slide.simulationRef) {
        simActionBtn.style.display = 'inline-flex';
        simActionBtn.onclick = () => {
          this.switchTab('tab-simulations');
          if (window.droneSims) {
            window.droneSims.switchSimulation(slide.simulationRef);
          }
        };
      } else {
        simActionBtn.style.display = 'none';
      }
    }

    // Disable/enable prev/next buttons
    const prevBtn = document.getElementById('slide-prev-btn');
    const nextBtn = document.getElementById('slide-next-btn');
    if (prevBtn) prevBtn.disabled = (this.currentSlideIndex === 0);
    if (nextBtn) nextBtn.disabled = (this.currentSlideIndex === slides.length - 1);
  }

  // Quiz Engine
  initQuizHub() {
    const quizContainer = document.getElementById('active-quiz-container');
    const quizTopicTitle = document.getElementById('quiz-active-title');
    const quizQuestionsWrapper = document.getElementById('quiz-questions-wrapper');

    // Bind topic quiz buttons
    document.querySelectorAll('[data-quiz-topic]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topicId = e.currentTarget.getAttribute('data-quiz-topic');
        this.openQuizTopic(topicId);
      });
    });
  }

  openQuizTopic(topicId) {
    // Locate quiz in QUIZ_DATA
    let foundTopic = null;
    let foundDay = null;

    for (const [dayKey, topics] of Object.entries(QUIZ_DATA)) {
      for (const t of topics) {
        if (t.topicId === topicId) {
          foundTopic = t;
          foundDay = dayKey;
          break;
        }
      }
      if (foundTopic) break;
    }

    if (!foundTopic) return;

    this.switchTab('tab-quizzes');

    const titleEl = document.getElementById('quiz-active-title');
    const wrapper = document.getElementById('quiz-questions-wrapper');
    const container = document.getElementById('active-quiz-container');

    if (titleEl) titleEl.textContent = foundTopic.topicTitle;
    if (container) container.style.display = 'block';

    if (wrapper) {
      wrapper.innerHTML = foundTopic.questions.map((q, idx) => {
        const optsHtml = q.options.map((opt, oIdx) => `
          <button class="quiz-opt-btn" data-q-id="${q.id}" data-opt-idx="${oIdx}">
            <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${opt}
          </button>
        `).join('');

        return `
          <div class="quiz-question-box" id="box_${q.id}">
            <div class="quiz-q-num">Question ${idx + 1} of ${foundTopic.questions.length}</div>
            <div class="quiz-q-text">${q.question}</div>
            <div class="quiz-options-list">${optsHtml}</div>
            <div class="quiz-explanation-box" id="exp_${q.id}" style="display:none;"></div>
          </div>
        `;
      }).join('');

      // Attach answer click events
      foundTopic.questions.forEach(q => {
        const box = document.getElementById(`box_${q.id}`);
        if (!box) return;
        const optButtons = box.querySelectorAll('.quiz-opt-btn');

        optButtons.forEach(btn => {
          btn.addEventListener('click', (e) => {
            const chosenIdx = parseInt(e.currentTarget.getAttribute('data-opt-idx'), 10);
            const expBox = document.getElementById(`exp_${q.id}`);

            // Disable further clicks
            optButtons.forEach(b => b.disabled = true);

            if (chosenIdx === q.correct) {
              e.currentTarget.classList.add('correct');
              this.quizScores[q.id] = 1;
              if (expBox) {
                expBox.style.display = 'block';
                expBox.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
              }
            } else {
              e.currentTarget.classList.add('incorrect');
              optButtons[q.correct].classList.add('correct');
              this.quizScores[q.id] = 0;
              if (expBox) {
                expBox.style.display = 'block';
                expBox.innerHTML = `<strong>Incorrect.</strong> ${q.explanation}`;
              }
            }

            this.updateTotalScore();
          });
        });
      });
    }

    container.scrollIntoView({ behavior: 'smooth' });
  }

  updateTotalScore() {
    let totalScore = 0;
    let answered = 0;

    for (const [qId, score] of Object.entries(this.quizScores)) {
      answered++;
      totalScore += score;
    }

    const badge = document.getElementById('quiz-score-badge');
    if (badge) {
      badge.textContent = `Score: ${totalScore} / ${answered} (${answered > 0 ? Math.round((totalScore / answered) * 100) : 0}%)`;
    }

    this.saveProgress();
    this.updateProgressBadge();
  }

  updateProgressBadge() {
    const badge = document.getElementById('header-progress-text');
    if (!badge) return;

    const totalSlides = 40;
    const viewed = this.userProgress.viewedSlides.size;
    const answered = Object.keys(this.quizScores).length;

    badge.textContent = `${viewed}/${totalSlides} Slides • ${answered}/36 Quizzes`;
  }

  saveProgress() {
    try {
      const data = {
        scores: this.quizScores,
        viewed: Array.from(this.userProgress.viewedSlides)
      };
      localStorage.setItem('drone_workshop_progress', JSON.stringify(data));
    } catch (e) {
      // Local storage fallback
    }
  }

  loadProgress() {
    try {
      const raw = localStorage.getItem('drone_workshop_progress');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.scores) this.quizScores = data.scores;
        if (data.viewed) this.userProgress.viewedSlides = new Set(data.viewed);
      }
    } catch (e) {}
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.droneApp = new DroneWorkshopApp();
  window.droneApp.init();
});
