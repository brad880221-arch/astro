/**
 * 한국 B2B PC 조달 비용 & 최적 타이밍 시뮬레이터
 * Interactive Procurement & Cost Forecasting Engine
 */

const SemiSimulator = {
  // 상태 변수
  state: {
    sector: 'enterprise',
    quantity: 200,
    scenario: 'slight_up',
    aiRatio: 40,
    laptopRatio: 70
  },

  // 시뮬레이터 초기화 및 이벤트 리스너 바인딩
  init() {
    this.bindEvents();
    this.calculate();
  },

  bindEvents() {
    // 1. 업종 선택
    const sectorSelect = document.getElementById('simSectorSelect');
    if (sectorSelect) {
      sectorSelect.addEventListener('change', (e) => {
        this.state.sector = e.target.value;
        this.calculate();
      });
    }

    // 2. 조달 수량 슬라이더
    const qtySlider = document.getElementById('simQtySlider');
    const qtyValueDisplay = document.getElementById('simQtyValueDisplay');
    if (qtySlider && qtyValueDisplay) {
      qtySlider.addEventListener('input', (e) => {
        this.state.quantity = parseInt(e.target.value, 10);
        qtyValueDisplay.textContent = this.state.quantity.toLocaleString() + ' 대';
        this.calculate();
      });
    }

    // 3. 반도체 가격 시나리오 라디오 버튼
    const scenarioInputs = document.querySelectorAll('input[name="simScenario"]');
    scenarioInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.state.scenario = e.target.value;
          this.calculate();
        }
      });
    });

    // 4. AI PC 탑재 비율 슬라이더
    const aiSlider = document.getElementById('simAiRatioSlider');
    const aiValueDisplay = document.getElementById('simAiRatioDisplay');
    if (aiSlider && aiValueDisplay) {
      aiSlider.addEventListener('input', (e) => {
        this.state.aiRatio = parseInt(e.target.value, 10);
        aiValueDisplay.textContent = this.state.aiRatio + ' %';
        this.calculate();
      });
    }
  },

  // 계산 및 UI 반영
  calculate() {
    const config = SEMI_B2B_DATA.simulatorConfig;
    const baseASP = config.baseASP[this.state.sector] || 1350000;
    const scenarioData = config.semiScenarios[this.state.scenario] || config.semiScenarios.stable;

    // 반도체 가격 변동률 반영
    const semiFactor = scenarioData.factor; // 예: +0.045
    let adjustedASP = baseASP * (1 + semiFactor);

    // AI PC NPU 탑재 추가 프리미엄 반영 (가중치 계산)
    const aiPremium = config.aiPcPremiumPerUnit * (this.state.aiRatio / 100);
    adjustedASP += aiPremium;

    // 100원 단위 반올림
    const finalASP = Math.round(adjustedASP / 1000) * 1000;
    const totalBudget = finalASP * this.state.quantity;

    // 기준 가격 대비 변동율
    const totalVarianceRate = ((finalASP - baseASP) / baseASP) * 100;
    const totalDiffAmount = (finalASP - baseASP) * this.state.quantity;

    // 화면 업데이트
    this.updateUI({
      finalASP,
      totalBudget,
      totalVarianceRate,
      totalDiffAmount,
      scenarioData
    });
  },

  updateUI(results) {
    const { finalASP, totalBudget, totalVarianceRate, totalDiffAmount, scenarioData } = results;

    const aspDisplay = document.getElementById('simResultASP');
    const budgetDisplay = document.getElementById('simResultBudget');
    const varianceDisplay = document.getElementById('simResultVariance');
    const diffDisplay = document.getElementById('simResultDiff');
    const adviceTitle = document.getElementById('simAdviceTitle');
    const adviceText = document.getElementById('simAdviceText');

    if (aspDisplay) aspDisplay.textContent = finalASP.toLocaleString() + ' 원';
    if (budgetDisplay) budgetDisplay.textContent = (totalBudget / 100000000).toFixed(2) + ' 억 원 (' + totalBudget.toLocaleString() + '원)';

    if (varianceDisplay) {
      const isPlus = totalVarianceRate > 0;
      varianceDisplay.textContent = (isPlus ? '+' : '') + totalVarianceRate.toFixed(1) + '%';
      varianceDisplay.className = isPlus ? 'ticker-change up' : (totalVarianceRate < 0 ? 'ticker-change down' : 'ticker-change neutral');
    }

    if (diffDisplay) {
      const isPlus = totalDiffAmount > 0;
      diffDisplay.textContent = (isPlus ? '+' : '') + (totalDiffAmount / 10000).toLocaleString() + '만 원';
    }

    // 최적 조달 전략 어드바이저 코멘트 생성
    let recTitle = '';
    let recText = '';

    if (this.state.scenario === 'surge' || this.state.scenario === 'slight_up') {
      recTitle = '⚡ [조기 발주 권고] 9월 중순 이전 단가 고정 계약 체결 필요';
      recText = `선택하신 반도체 상승 국면에서는 완제품 제조사의 4분기 공급단가 인상이 임박했습니다. 현재 시점에서 계약을 확정할 경우 예상 예산 대비 약 ${Math.abs(Math.round(totalDiffAmount / 10000)).toLocaleString()}만 원의 원가 상승 리스크를 선제적으로 회피할 수 있습니다.`;
    } else if (this.state.scenario === 'crash') {
      recTitle = '⏳ [분할 조달 권고] 10월 초 메모리 가격 반영 시점까지 대기';
      recText = `반도체 재고 증가 및 가격 하락세가 관측되므로 즉각적인 대량 발주보다는 긴급분(30%)만 우선 조달하고, 잔여 물량은 제조사의 4분기 프로모션 단가 인하가 고시되는 10월 중순 이후 계약하는 것이 약 ${Math.abs(Math.round(totalDiffAmount / 10000)).toLocaleString()}만 원의 예산 절감에 유리합니다.`;
    } else {
      recTitle = '🎯 [정상 조달 권고] 표준 교체 사이클 준수 및 분할 납품 협의';
      recText = `현재 시장 단가는 안정적 보합세입니다. ${this.state.quantity}대 규모 조달 시 연말 리드타임 지연을 방지하기 위해 9월 말까지 입찰 규격을 확정하고 분할 납품 계약을 추천합니다.`;
    }

    if (adviceTitle) adviceTitle.textContent = recTitle;
    if (adviceText) adviceText.textContent = recText;
  }
};
