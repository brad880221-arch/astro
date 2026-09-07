/**
 * 순수 HTML5 Canvas 기반 인터랙티브 차트 모듈
 * Dependency-Free Custom Chart Engine for Semiconductor & B2B PC Intelligence
 */

const SemiCharts = {
  // 고해상도(Retina Display) 대응 캔버스 리셋 유틸리티
  initCanvas(canvas) {
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // 부모 컨테이너 크기 확인
    const width = rect.width || canvas.clientWidth || 300;
    const height = rect.height || canvas.clientHeight || 150;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width, height };
  },

  // 1. 미니 스파크라인 차트 (지표 카드 내부)
  drawSparkline(canvasId, data, strokeColor = '#06B6D4', isUp = true) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const res = this.initCanvas(canvas);
    if (!res) return;
    const { ctx, width, height } = res;

    if (!data || data.length < 2) return;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = (max - min) || 1;
    const padding = 4;

    const points = data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return { x, y };
    });

    // 그라디언트 영역 채우기
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isUp) {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    } else {
      gradient.addColorStop(0, 'rgba(244, 63, 94, 0.28)');
      gradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.lineTo(points[0].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 선 그리기
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 마지막 지점 포인트
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();
  },

  // 2. 반도체 가격 지수 vs 한국 B2B PC ASP 이중 추이 차트
  renderTrendChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const res = this.initCanvas(canvas);
    if (!res) return;
    const { ctx, width, height } = res;

    const labels = SEMI_B2B_DATA.chartData.trendTimeline;
    const semi = SEMI_B2B_DATA.chartData.semiIndex;
    const asp = SEMI_B2B_DATA.chartData.b2bPcASP;

    const padLeft = 45;
    const padRight = 55;
    const padTop = 25;
    const padBottom = 35;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    ctx.clearRect(0, 0, width, height);

    // 배경 그리드 라인
    const gridRows = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748B';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridRows; i++) {
      const y = padTop + (chartH / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartW, y);
      ctx.stroke();

      // 좌측 Y축: 반도체 지수 (100 ~ 160)
      const semiVal = Math.round(160 - (60 / gridRows) * i);
      ctx.fillText(semiVal + 'pt', padLeft - 8, y + 4);
    }

    // 우측 Y축: B2B PC ASP (115 ~ 140만원)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94A3B8';
    for (let i = 0; i <= gridRows; i++) {
      const y = padTop + (chartH / gridRows) * i;
      const aspVal = Math.round(140 - (25 / gridRows) * i);
      ctx.fillText(aspVal + '만', padLeft + chartW + 8, y + 4);
    }

    // X축 레이블
    const stepX = chartW / (labels.length - 1);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94A3B8';
    labels.forEach((label, idx) => {
      const x = padLeft + stepX * idx;
      ctx.fillText(label, x, height - 12);
    });

    // 1) 반도체 지수 곡선 (Cyan)
    const semiMin = 100;
    const semiMax = 160;
    const getSemiY = (val) => padTop + (1 - (val - semiMin) / (semiMax - semiMin)) * chartH;

    // 그라디언트 영역
    const semiGrad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    semiGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    semiGrad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    ctx.beginPath();
    ctx.moveTo(padLeft, getSemiY(semi[0]));
    semi.forEach((val, idx) => {
      ctx.lineTo(padLeft + stepX * idx, getSemiY(val));
    });
    ctx.lineTo(padLeft + chartW, padTop + chartH);
    ctx.lineTo(padLeft, padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = semiGrad;
    ctx.fill();

    // 선 그리기
    ctx.beginPath();
    ctx.moveTo(padLeft, getSemiY(semi[0]));
    semi.forEach((val, idx) => {
      ctx.lineTo(padLeft + stepX * idx, getSemiY(val));
    });
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 포인트 그리기
    semi.forEach((val, idx) => {
      const x = padLeft + stepX * idx;
      const y = getSemiY(val);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06B6D4';
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 2) B2B PC ASP 곡선 (Indigo)
    const aspMin = 115;
    const aspMax = 140;
    const getAspY = (val) => padTop + (1 - (val - aspMin) / (aspMax - aspMin)) * chartH;

    ctx.beginPath();
    ctx.moveTo(padLeft, getAspY(asp[0]));
    asp.forEach((val, idx) => {
      ctx.lineTo(padLeft + stepX * idx, getAspY(val));
    });
    ctx.strokeStyle = '#818CF8';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]); // 복원

    // ASP 포인트 그리기
    asp.forEach((val, idx) => {
      const x = padLeft + stepX * idx;
      const y = getAspY(val);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#818CF8';
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  },

  // 3. 국내 4대 B2B 섹터 점유율 도넛 차트
  renderSectorDoughnut(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const res = this.initCanvas(canvas);
    if (!res) return;
    const { ctx, width, height } = res;

    const sectors = SEMI_B2B_DATA.koreaB2BMetrics.sectors;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 16;
    const innerRadius = radius * 0.62;

    ctx.clearRect(0, 0, width, height);

    let startAngle = -Math.PI / 2;

    sectors.forEach(sector => {
      const sliceAngle = (sector.share / 100) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      // 도넛 섹터 그리기
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = sector.color;
      ctx.fill();

      // 경계선
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3;
      ctx.stroke();

      startAngle = endAngle;
    });

    // 중앙 텍스트
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('78.6만대', centerX, centerY - 8);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Q3 총 출하 전망', centerX, centerY + 12);
  },

  // 4. AI PC 침투율 분기별 바 차트
  renderAiPenetrationBarChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const res = this.initCanvas(canvas);
    if (!res) return;
    const { ctx, width, height } = res;

    const data = SEMI_B2B_DATA.chartData.aiPcPenetration;
    const padLeft = 35;
    const padRight = 20;
    const padTop = 25;
    const padBottom = 35;

    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    ctx.clearRect(0, 0, width, height);

    // 배경 그리드
    const maxVal = 60;
    const gridRows = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748B';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridRows; i++) {
      const y = padTop + (chartH / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartW, y);
      ctx.stroke();

      const rateVal = Math.round(maxVal - (maxVal / gridRows) * i);
      ctx.fillText(rateVal + '%', padLeft - 6, y + 3);
    }

    const barWidth = Math.min(32, (chartW / data.length) * 0.65);
    const stepX = chartW / data.length;

    data.forEach((item, idx) => {
      const barHeight = (item.rate / maxVal) * chartH;
      const x = padLeft + stepX * idx + (stepX - barWidth) / 2;
      const y = padTop + chartH - barHeight;

      // 바 그라디언트
      const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
      if (item.quarter.includes('(E)')) {
        grad.addColorStop(0, '#06B6D4');
        grad.addColorStop(1, '#0284C7');
      } else {
        grad.addColorStop(0, '#6366F1');
        grad.addColorStop(1, '#4338CA');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      // 상단 둥근 바
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      // 수치 텍스트
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.rate + '%', x + barWidth / 2, y - 6);

      // X축 레이블
      ctx.fillStyle = item.quarter.includes('(E)') ? '#38BDF8' : '#94A3B8';
      ctx.font = '10px sans-serif';
      ctx.fillText(item.quarter, x + barWidth / 2, height - 10);
    });
  },

  // 전체 차트 초기화
  initAll() {
    this.renderTrendChart('trendChartCanvas');
    this.renderSectorDoughnut('sectorDoughnutCanvas');
    this.renderAiPenetrationBarChart('aiPenetrationCanvas');

    // 스파크라인 렌더링
    SEMI_B2B_DATA.semiconductorIndicators.forEach(ind => {
      const canvasId = `sparkline-${ind.id}`;
      const isUp = ind.changeType === 'up';
      const color = isUp ? '#10B981' : (ind.changeType === 'down' ? '#F43F5E' : '#94A3B8');
      this.drawSparkline(canvasId, ind.sparkline, color, isUp);
    });
  }
};

// 윈도우 리사이즈 시 차트 재렌더링
window.addEventListener('resize', () => {
  if (window._chartResizeTimer) clearTimeout(window._chartResizeTimer);
  window._chartResizeTimer = setTimeout(() => {
    SemiCharts.initAll();
  }, 200);
});
