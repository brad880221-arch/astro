/**
 * 메인 애플리케이션 진입점 및 컨트롤러
 * Korea B2B PC & Semiconductor Intelligence Main Application
 */

const App = {
  currentTab: 'overview',

  init() {
    console.log('Semiconductor & Korea B2B PC Intelligence Platform Initialized');
    
    this.renderTicker();
    this.renderOverviewIndicators();
    this.setupTabNavigation();
    
    // 서브 모듈 초기화
    SemiReports.init();
    SemiSimulator.init();
    
    // 차트 초기화 (DOM 렌더링 후)
    setTimeout(() => {
      SemiCharts.initAll();
    }, 50);

    this.bindHeaderActions();
  },

  // 1. 상단 실시간 반도체 마켓 티커 렌더링 (무한 스크롤)
  renderTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const indicators = SEMI_B2B_DATA.semiconductorIndicators;
    // 부드러운 무한 롤링을 위해 데이터 2회 복제
    const items = [...indicators, ...indicators];

    track.innerHTML = items.map(ind => `
      <div class="ticker-item">
        <span class="ticker-name">${ind.name}:</span>
        <span class="ticker-val">${ind.currentPrice}</span>
        <span class="ticker-change ${ind.changeType}">${ind.change}</span>
      </div>
    `).join('');
  },

  // 2. 대시보드 상단 반도체 & B2B 핵심 지표 카드 렌더링
  renderOverviewIndicators() {
    const container = document.getElementById('overviewCardsGrid');
    if (!container) return;

    const indicators = SEMI_B2B_DATA.semiconductorIndicators;

    container.innerHTML = indicators.map(ind => {
      const isUp = ind.changeType === 'up';
      const changeClass = isUp ? 'up' : (ind.changeType === 'down' ? 'down' : 'neutral');
      const badgeIcon = isUp ? '▲' : (ind.changeType === 'down' ? '▼' : '―');

      return `
        <div class="card card-clickable" onclick="App.focusIndicator('${ind.id}')">
          <div class="card-header">
            <span class="card-title">${ind.type}</span>
            <span class="ticker-change ${changeClass}">${badgeIcon} ${ind.change}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <div>
              <div class="card-value">${ind.currentPrice}</div>
              <div style="font-size:0.85rem; font-weight:700; color:#FFFFFF; margin-top:2px;">${ind.name}</div>
            </div>
            <canvas id="sparkline-${ind.id}" class="sparkline-canvas"></canvas>
          </div>
          <div class="card-desc">${ind.note}</div>
        </div>
      `;
    }).join('');
  },

  // 3. 탭 네비게이션
  setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // 탭 버튼 활성화 스타일
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 탭 패널 표시
    const panels = document.querySelectorAll('.tab-pane');
    panels.forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // 대시보드 탭 진입 시 차트 크기 재조정
    if (tabId === 'overview') {
      setTimeout(() => {
        SemiCharts.initAll();
      }, 50);
    }
  },

  // 헤더 버튼 이벤트 바인딩
  bindHeaderActions() {
    const btnGoLatest = document.getElementById('btnGoLatest');
    if (btnGoLatest) {
      btnGoLatest.addEventListener('click', () => {
        SemiReports.renderCurrentReport(SEMI_B2B_DATA.currentIssueId);
        this.switchTab('report-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const btnHeaderSubscribe = document.getElementById('btnHeaderSubscribe');
    if (btnHeaderSubscribe) {
      btnHeaderSubscribe.addEventListener('click', () => {
        this.switchTab('subscribe');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  },

  focusIndicator(indicatorId) {
    // 특정 지표 클릭 시 관련 최신 주간 리포트로 안내
    this.switchTab('report-view');
    SemiReports.showToast(`🔍 ${indicatorId} 반도체 수급 분석 리포트로 이동합니다.`);
  }
};

window.App = App;

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
