/**
 * 주간 보고서 렌더러, 아카이브 관리 및 주간 받아보기(구독) 모듈
 * Weekly Report Viewer, Archive Manager & Virtual Dispatch System
 */

const SemiReports = {
  currentReportId: SEMI_B2B_DATA.currentIssueId,

  init() {
    this.renderCurrentReport(this.currentReportId);
    this.renderArchiveList();
    this.bindSubscriptionEvents();
    this.bindToolbarEvents();
    this.loadSubscriptionSettings();
  },

  // 1. 특정 ID의 주간 보고서 렌더링
  renderCurrentReport(reportId) {
    const report = SEMI_B2B_DATA.weeklyReports.find(r => r.id === reportId) || SEMI_B2B_DATA.weeklyReports[0];
    this.currentReportId = report.id;

    // 헤더 영역
    const issuePill = document.getElementById('reportIssuePill');
    const reportDate = document.getElementById('reportDate');
    const reportCategory = document.getElementById('reportCategory');
    const reportTitle = document.getElementById('reportTitle');
    const reportSubtitle = document.getElementById('reportSubtitle');
    const reportTags = document.getElementById('reportTags');

    if (issuePill) issuePill.textContent = `Issue #${report.issueNo} (${report.badge})`;
    if (reportDate) reportDate.textContent = `발행일: ${report.date} | ${report.readTime}`;
    if (reportCategory) reportCategory.textContent = report.category;
    if (reportTitle) reportTitle.textContent = report.title;
    if (reportSubtitle) reportSubtitle.textContent = report.subtitle;

    // 태그 목록
    if (reportTags) {
      reportTags.innerHTML = report.tags.map(tag => `<span class="tag-badge">#${tag}</span>`).join('');
    }

    // 1) Executive Summary
    const execList = document.getElementById('reportExecSummaryList');
    if (execList && report.executiveSummary) {
      execList.innerHTML = report.executiveSummary.map(item => {
        // **볼드** 문법 파싱
        const formatted = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `<li>${formatted}</li>`;
      }).join('');
    }

    // 2) 반도체 공급망 영향 분석
    const semiHeadline = document.getElementById('reportSemiHeadline');
    const semiAnalysis = document.getElementById('reportSemiAnalysis');
    const semiMetricsGrid = document.getElementById('reportSemiMetricsGrid');

    if (semiHeadline) semiHeadline.textContent = report.semiconductorImpact.headline;
    if (semiAnalysis) semiAnalysis.textContent = report.semiconductorImpact.analysis;
    if (semiMetricsGrid && report.semiconductorImpact.metrics) {
      semiMetricsGrid.innerHTML = report.semiconductorImpact.metrics.map(m => `
        <div class="semi-impact-item">
          <div class="semi-impact-label">${m.label}</div>
          <div class="semi-impact-val">${m.value}</div>
          <div class="semi-impact-diff">${m.change}</div>
        </div>
      `).join('');
    }

    // 3) 한국 4대 B2B 섹터별 영향도
    const sectorGrid = document.getElementById('reportSectorGrid');
    const sectorSection = document.getElementById('reportSectorSection');
    if (sectorGrid && sectorSection) {
      if (report.sectorAnalysis && report.sectorAnalysis.length > 0) {
        sectorSection.style.display = 'block';
        sectorGrid.innerHTML = report.sectorAnalysis.map(s => `
          <div class="sector-card-box" style="border-left-color: ${s.statusColor}">
            <div class="sector-card-head">
              <span class="sector-card-title">${s.sector}</span>
              <span class="sector-badge" style="color:${s.statusColor}; background:rgba(255,255,255,0.06);">${s.status}</span>
            </div>
            <div class="sector-card-trend">${s.trend}</div>
            <div class="sector-card-desc">${s.details}</div>
          </div>
        `).join('');
      } else {
        sectorSection.style.display = 'none';
      }
    }

    // 4) 시나리오 예측 매트릭스
    const scenarioTableBody = document.getElementById('reportScenarioTableBody');
    const scenarioSection = document.getElementById('reportScenarioSection');
    if (scenarioTableBody && scenarioSection) {
      if (report.scenarios && report.scenarios.length > 0) {
        scenarioSection.style.display = 'block';
        scenarioTableBody.innerHTML = report.scenarios.map(sc => {
          let pillClass = 'scenario-base';
          if (sc.type.includes('Bull')) pillClass = 'scenario-bull';
          if (sc.type.includes('Bear')) pillClass = 'scenario-bear';

          return `
            <tr>
              <td><span class="scenario-pill ${pillClass}">${sc.type}</span></td>
              <td style="font-weight:700; color:#fff;">${sc.probability}</td>
              <td>${sc.condition}</td>
              <td>${sc.impact}</td>
            </tr>
          `;
        }).join('');
      } else {
        scenarioSection.style.display = 'none';
      }
    }

    // 5) 구매 의사결정자를 위한 주간 액션 플레이북
    const playbookList = document.getElementById('reportPlaybookList');
    const playbookSection = document.getElementById('reportPlaybookSection');
    if (playbookList && playbookSection) {
      if (report.playbook && report.playbook.length > 0) {
        playbookSection.style.display = 'block';
        playbookList.innerHTML = report.playbook.map((pb, idx) => `
          <div class="playbook-item">
            <div class="playbook-icon">0${idx + 1}</div>
            <div>
              <div class="playbook-target">${pb.target}</div>
              <div class="playbook-action">${pb.recommendation}</div>
              <div class="playbook-reason">${pb.reason}</div>
            </div>
          </div>
        `).join('');
      } else {
        playbookSection.style.display = 'none';
      }
    }
  },

  // 2. 아카이브 리스트 렌더링
  renderArchiveList(searchKeyword = '') {
    const archiveContainer = document.getElementById('archiveListContainer');
    if (!archiveContainer) return;

    const filtered = SEMI_B2B_DATA.weeklyReports.filter(r => {
      if (!searchKeyword) return true;
      const kw = searchKeyword.toLowerCase();
      return r.title.toLowerCase().includes(kw) ||
             r.summary.toLowerCase().includes(kw) ||
             r.tags.some(t => t.toLowerCase().includes(kw));
    });

    if (filtered.length === 0) {
      archiveContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 20px; color: #64748B;">
          검색된 주간 보고서가 없습니다.
        </div>
      `;
      return;
    }

    archiveContainer.innerHTML = filtered.map(r => `
      <div class="archive-item" data-id="${r.id}">
        <div class="archive-info">
          <div class="archive-meta">
            <span class="issue-pill" style="font-size:0.7rem; padding:2px 8px;">Issue #${r.issueNo}</span>
            <span style="color:#64748B;">${r.date}</span>
            <span style="color:var(--accent-cyan); font-weight:600;">${r.category}</span>
          </div>
          <div class="archive-title">${r.title}</div>
          <div class="archive-summary">${r.summary}</div>
        </div>
        <div>
          <button class="btn btn-outline" style="font-size:0.8rem; white-space:nowrap;">
            보고서 열람 →
          </button>
        </div>
      </div>
    `).join('');

    // 클릭 시 해당 보고서로 전환 및 보고서 뷰어 탭 활성화
    const items = archiveContainer.querySelectorAll('.archive-item');
    items.forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        this.renderCurrentReport(id);
        // 탭 전환
        if (window.App && window.App.switchTab) {
          window.App.switchTab('report-view');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  },

  // 3. 리포트 상단 툴바 이벤트 (인쇄, 마크다운 복사, 공유)
  bindToolbarEvents() {
    // 인쇄 / PDF 저장
    const printBtn = document.getElementById('btnPrintReport');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // 마크다운 복사
    const copyMdBtn = document.getElementById('btnCopyMarkdown');
    if (copyMdBtn) {
      copyMdBtn.addEventListener('click', () => {
        const report = SEMI_B2B_DATA.weeklyReports.find(r => r.id === this.currentReportId);
        if (!report) return;

        let md = `# [Weekly Report #${report.issueNo}] ${report.title}\n`;
        md += `> ${report.subtitle}\n`;
        md += `> 발행일: ${report.date} | 분류: ${report.category}\n\n`;
        md += `## 1. Executive Summary\n`;
        if (report.executiveSummary) {
          report.executiveSummary.forEach(item => {
            md += `- ${item}\n`;
          });
        }
        md += `\n## 2. 반도체 공급망 인텔리전스 분석\n`;
        md += `### ${report.semiconductorImpact.headline}\n`;
        md += `${report.semiconductorImpact.analysis}\n\n`;
        if (report.sectorAnalysis && report.sectorAnalysis.length > 0) {
          md += `## 3. 한국 4대 B2B 섹터별 영향도\n`;
          report.sectorAnalysis.forEach(s => {
            md += `### [${s.sector}] ${s.status} - ${s.trend}\n${s.details}\n\n`;
          });
        }

        navigator.clipboard.writeText(md).then(() => {
          this.showToast('📄 마크다운 형식으로 클립보드에 복사되었습니다.');
        }).catch(() => {
          this.showToast('클립보드 복사 권한이 필요합니다.');
        });
      });
    }

    // 아카이브 검색 인풋
    const searchInput = document.getElementById('archiveSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderArchiveList(e.target.value.trim());
      });
    }
  },

  // 4. 주간 구독 신청 및 가상 발송 모달
  bindSubscriptionEvents() {
    const form = document.getElementById('subscriptionForm');
    const btnDispatchNow = document.getElementById('btnDispatchNow');
    const modal = document.getElementById('virtualEmailModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');

    // 구독 정보 저장
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('subEmailInput').value.trim();
        const sector = document.getElementById('subSectorSelect').value;
        const day = document.getElementById('subDaySelect').value;
        const reportType = document.getElementById('subTypeSelect').value;

        const subData = { email, sector, day, reportType, subscribedAt: new Date().toISOString() };
        localStorage.setItem('semi_b2b_subscription', JSON.stringify(subData));

        this.showToast(`✅ [${email}] 주간 보고서 정기 구독이 설정되었습니다!`);
        this.updateSubscriptionBadge(true, email);
      });
    }

    // 금주 리포트 지금 받아보기 (가상 발송 시뮬레이션)
    if (btnDispatchNow) {
      btnDispatchNow.addEventListener('click', () => {
        const emailInput = document.getElementById('subEmailInput');
        const email = (emailInput && emailInput.value.trim()) || 'executive@company.co.kr';

        // 발송 로딩 효과 시뮬레이션
        btnDispatchNow.disabled = true;
        btnDispatchNow.innerHTML = '📬 이메일 생성 및 발송 중...';

        setTimeout(() => {
          btnDispatchNow.disabled = false;
          btnDispatchNow.innerHTML = '⚡ 금주 최신호 지금 즉시 받아보기 (테스트 발송)';
          this.openVirtualEmailModal(email);
          this.showToast(`📩 ${email} 주소로 최신 보고서가 가상 발송되었습니다.`);
        }, 600);
      });
    }

    // 모달 닫기 이벤트
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
    if (modalConfirmBtn) {
      modalConfirmBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }
  },

  openVirtualEmailModal(recipientEmail) {
    const modal = document.getElementById('virtualEmailModal');
    const emailRecipient = document.getElementById('emailRecipientDisplay');
    const emailSubject = document.getElementById('emailSubjectDisplay');
    const emailBodyBriefing = document.getElementById('emailBodyBriefing');

    const report = SEMI_B2B_DATA.weeklyReports[0];

    if (emailRecipient) emailRecipient.textContent = `${recipientEmail} (귀하의 수신함)`;
    if (emailSubject) emailSubject.textContent = `[Weekly Briefing #${report.issueNo}] ${report.title}`;

    if (emailBodyBriefing) {
      const execPoints = report.executiveSummary.map(pt => {
        const clean = pt.replace(/\*\*(.*?)\*\*/g, '$1');
        return `• ${clean}`;
      }).join('<br><br>');

      emailBodyBriefing.innerHTML = `
        <p>안녕하십니까, 반도체 및 한국 B2B PC 시장 주간 인텔리전스 데스크입니다.</p>
        <p>귀하께서 신청하신 <strong>2026년 9월 1주차 주간 전략 브리핑</strong>을 전달해 드립니다.</p>
        
        <div class="email-highlight-box">
          <strong>📌 금주의 핵심 시사점 (Executive Points):</strong><br><br>
          ${execPoints}
        </div>

        <p><strong>주요 반도체 지표 요약:</strong><br>
        - DDR5 16Gb 계약가: $4.68 (+1.8%)<br>
        - Enterprise SSD 1TB: $79.80 (+1.2%)<br>
        - 한국 B2B 온디바이스 AI PC 신규 탑재율: 38.6% (가속화)</p>

        <p>상세 분석, 4대 섹터별(금융/공공/엔터프라이즈/SME) 전망 및 예산 시뮬레이션은 본 웹앱에서 상시 확인하실 수 있습니다.</p>
      `;
    }

    if (modal) modal.classList.add('open');
  },

  closeModal() {
    const modal = document.getElementById('virtualEmailModal');
    if (modal) modal.classList.remove('open');
  },

  loadSubscriptionSettings() {
    try {
      const saved = localStorage.getItem('semi_b2b_subscription');
      if (saved) {
        const data = JSON.parse(saved);
        const emailInput = document.getElementById('subEmailInput');
        const sectorSelect = document.getElementById('subSectorSelect');
        const daySelect = document.getElementById('subDaySelect');
        const typeSelect = document.getElementById('subTypeSelect');

        if (emailInput && data.email) emailInput.value = data.email;
        if (sectorSelect && data.sector) sectorSelect.value = data.sector;
        if (daySelect && data.day) daySelect.value = data.day;
        if (typeSelect && data.reportType) typeSelect.value = data.reportType;

        this.updateSubscriptionBadge(true, data.email);
      }
    } catch (e) {
      console.error('Subscription load error:', e);
    }
  },

  updateSubscriptionBadge(isSubscribed, email) {
    const badge = document.getElementById('headerSubBadge');
    if (badge) {
      if (isSubscribed) {
        badge.innerHTML = `📬 주간 구독 중 (${email})`;
        badge.style.display = 'inline-flex';
      }
    }
  },

  // 토스트 알림 메시지
  showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
};
