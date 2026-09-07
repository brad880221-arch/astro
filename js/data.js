/**
 * 반도체 동향 및 한국 B2B PC 시장 데이터 저장소
 * Data Repository for Semiconductor Trends & Korea B2B PC Market Reports
 */

const SEMI_B2B_DATA = {
  // 최신 갱신 일자
  lastUpdated: "2026-09-07 09:00 KST",
  currentIssueId: "issue-2026-09-w1",

  // 1. 실시간/주간 반도체 시장 주요 지표
  semiconductorIndicators: [
    {
      id: "dram-ddr5",
      name: "DRAM DDR5 16Gb",
      type: "계약가(Contract)",
      currentPrice: "$4.68",
      unit: "USD/개",
      change: "+1.8%",
      changeType: "up",
      note: "HBM3E 생산 전환으로 레거시 Capa 축소 영향",
      sparkline: [4.15, 4.22, 4.30, 4.45, 4.52, 4.60, 4.68]
    },
    {
      id: "dram-lpddr5x",
      name: "LPDDR5X 16GB",
      type: "B2B 모바일/PC",
      currentPrice: "$33.20",
      unit: "USD/패키지",
      change: "+0.9%",
      changeType: "up",
      note: "온디바이스 AI 노트북 탑재율 급증으로 수급 타이트",
      sparkline: [30.5, 31.0, 31.8, 32.2, 32.7, 33.0, 33.2]
    },
    {
      id: "nand-tlc",
      name: "3D NAND TLC 512Gb",
      type: "현물가(Spot)",
      currentPrice: "$3.92",
      unit: "USD/개",
      change: "-0.4%",
      changeType: "down",
      note: "제조사 가동률 정상화로 단기 가격 보합세",
      sparkline: [4.10, 4.05, 3.98, 3.95, 3.96, 3.94, 3.92]
    },
    {
      id: "ssd-enterprise",
      name: "Enterprise SSD 1TB (Gen4)",
      type: "기업용 PC/워크스테이션",
      currentPrice: "$79.80",
      unit: "USD/개",
      change: "+1.2%",
      changeType: "up",
      note: "기업용 기본 사양이 512GB에서 1TB로 상향 추세",
      sparkline: [72.0, 73.5, 75.0, 76.8, 78.0, 79.0, 79.8]
    },
    {
      id: "npu-adoption",
      name: "AI NPU 칩셋 탑재율",
      type: "국내 B2B PC 신규 출하",
      currentPrice: "38.6%",
      unit: "출하 비중",
      change: "+4.8%p",
      changeType: "up",
      note: "Intel Lunar Lake / AMD Strix Point 보급 가속",
      sparkline: [18.2, 22.0, 26.5, 30.1, 33.8, 36.2, 38.6]
    },
    {
      id: "foundry-leadtime",
      name: "선단공정(3/4nm) Lead-time",
      type: "파운드리 수급",
      currentPrice: "14.4주",
      unit: "평균 소요일",
      change: "-0.8주",
      changeType: "neutral",
      note: "패키징(CoWoS 등) 병목 완화 조짐",
      sparkline: [17.0, 16.5, 16.0, 15.2, 14.8, 14.6, 14.4]
    }
  ],

  // 2. 한국 B2B PC 시장 핵심 지표
  koreaB2BMetrics: {
    q3ShipmentForecast: "786,000대",
    q3ShipmentChange: "+5.4% YoY",
    commercialASP: "1,348,000원",
    commercialASPChange: "+4.1% MoM",
    laptopRatio: "62.4%",
    desktopRatio: "37.6%",
    replacementUrgencyIndex: "84.2점 (매우 높음)",
    sectors: [
      { name: "대기업/엔터프라이즈", code: "enterprise", share: 35.2, color: "#6366F1", growth: "+6.8%" },
      { name: "금융권 (은행/증권/보험)", code: "finance", share: 24.8, color: "#06B6D4", growth: "+8.2%" },
      { name: "공공 및 교육기관", code: "public", share: 22.5, color: "#10B981", growth: "+3.1%" },
      { name: "중소기업(SME) & 스타트업", code: "sme", share: 17.5, color: "#F59E0B", growth: "+1.9%" }
    ]
  },

  // 3. 차트용 시계열 데이터 (최근 6분기 및 2026년 주차별 추이)
  chartData: {
    // 반도체 가격 지수 vs 한국 B2B PC 평균 판가(ASP) 추이
    trendTimeline: ["25Q1", "25Q2", "25Q3", "25Q4", "26Q1", "26Q2", "26Q3(E)"],
    semiIndex: [100, 107, 118, 126, 134, 141, 145], // 100 기준
    b2bPcASP: [118, 121, 125, 128, 131, 133, 135], // 1만원 단위 (118만 ~ 135만)
    
    // AI PC 분기별 국내 B2B 침투율 (%)
    aiPcPenetration: [
      { quarter: "25Q1", rate: 8.5 },
      { quarter: "25Q2", rate: 14.2 },
      { quarter: "25Q3", rate: 21.0 },
      { quarter: "25Q4", rate: 28.5 },
      { quarter: "26Q1", rate: 34.0 },
      { quarter: "26Q2", rate: 38.6 },
      { quarter: "26Q3(E)", rate: 45.2 },
      { quarter: "26Q4(E)", rate: 52.0 }
    ],

    // 주간 메모리 스팟 가격 변동 (최근 8주)
    weeklyMemorySpot: [
      { week: "07/20", ddr5: 4.45, nand: 3.96 },
      { week: "07/27", ddr5: 4.50, nand: 3.95 },
      { week: "08/03", ddr5: 4.55, nand: 3.94 },
      { week: "08/10", ddr5: 4.58, nand: 3.93 },
      { week: "08/17", ddr5: 4.60, nand: 3.92 },
      { week: "08/24", ddr5: 4.64, nand: 3.93 },
      { week: "08/31", ddr5: 4.66, nand: 3.92 },
      { week: "09/07", ddr5: 4.68, nand: 3.92 }
    ]
  },

  // 4. 주간 보고서 아카이브 (Weekly Reports)
  weeklyReports: [
    {
      id: "issue-2026-09-w1",
      issueNo: 36,
      date: "2026.09.07",
      title: "온디바이스 AI PC 전환 가속화와 메모리 가격 안정화가 국내 금융·공공 B2B 교체 수요에 미치는 영향",
      subtitle: "2026년 9월 1주차 한국 B2B PC 시장 & 반도체 수급 주간 전략 보고서",
      category: "핵심 전략 분석",
      badge: "최신호 (Latest)",
      readTime: "6분 완독",
      tags: ["AI PC", "금융 망분리", "DRAM 수급", "조달청 MAS", "Windows 10 EOS"],
      summary: "메모리 3사의 HBM 생산 편중에도 불구하고 PC용 DDR5 공급 라인이 탄력적으로 조정되며 가격 급등세가 진정 국면에 진입했습니다. 이에 따라 금융권 망분리 규제 완화와 맞물려 40+ TOPS 이상 온디바이스 AI PC 구매 계약이 전분기 대비 28% 증가하고 있으며, 공공 부문 조달청 다수공급자계약(MAS) 규격 개정으로 4분기 대규모 교체 발주가 가시화되고 있습니다.",
      
      executiveSummary: [
        "**반도체 원가 영향**: DDR5 계약가는 전월 대비 +1.8% 완만한 상승세로 전환되며 PC 세트업체의 원가 압박이 한숨 돌림. 다만 32GB 이상 고용량 LPDDR5X 수요 폭증으로 고성능 AI 노트북의 공급 리드타임은 평균 3.5주 유지.",
        "**한국 B2B 시장 모멘텀**: Windows 10 지원 종료(EOS) 실질 기한 경과에 따른 보안 취약점 해소를 위해 2026년 하반기 국내 기업의 잔여 교체 수요 45만 대가 본격 발주 사이클로 유입 중.",
        "**금융권 AI PC 도입 개화**: 금융보안 규제 완화 2차 가이드라인 배포 이후, 내부 데이터 외부 유출 방지를 위한 로컬 온디바이스 NPU 탑재 PC의 시범 도입(PoC)이 은행·보험사 중심으로 급물살을 탐.",
        "**구매 권고 액션**: 4분기 초 메모리 계약 가격의 2차 인상 가능성이 상존하므로, 2026년도 잔여 예산 집행은 9월 중순 이전 단가 고정 계약(Term-Contract)을 체결하는 것이 가장 유리함."
      ],

      semiconductorImpact: {
        headline: "DRAM 공급 안정화 속 LPDDR5X 프리미엄 지속",
        analysis: "삼성전자와 SK하이닉스가 HBM3E 및 HBM4 라인 증설에 집중하면서 범용 PC DRAM 공급 우려가 제기되었으나, 중국 창신메모리(CXMT)의 DDR4/DDR5 저가 공급 물량 확대로 레거시 시장 가격 완충 작용이 발생하고 있습니다. 반면, B2B 업무용 프리미엄 노트북에 탑재되는 LPDDR5X (7500~8533Mbps)는 국내 2개사 외에 대체재가 희박하여 모듈 단가가 전분기 대비 약 7% 프리미엄을 형성하고 있습니다. 이에 따라 슬림형 B2B 노트북의 납품 단가 하락은 제한적일 것으로 전망됩니다.",
        metrics: [
          { label: "PC 세트 내 반도체 BOM 비중", value: "34.2%", change: "+2.1%p" },
          { label: "DDR5 16GB 기준 모듈 원가", value: "$39.50", change: "+1.5%" },
          { label: "PCIe 5.0 SSD 프리미엄율", value: "+24.0%", change: "-1.8%p" }
        ]
      },

      sectorAnalysis: [
        {
          sector: "금융권 (은행/증권/카드/보험)",
          status: "적극 확대 (Strong Buy)",
          statusColor: "#06B6D4",
          trend: "망분리 완화 & 내부 생성형 AI 단말 구축",
          details: "금융위원회의 망분리 개선 로드맵에 맞춰 외부 클라우드 SaaS와 연계하면서도 내부 민감 데이터는 로컬 NPU에서 처리하는 '하이브리드 AI 단말' 규격이 확정되었습니다. 시중 4대 은행 기준 평균 3,500대 규모의 파일럿 교체 입찰이 개시되었으며, 16GB 메모리 기본 탑재에서 32GB 표준화로 상향 조정되었습니다."
        },
        {
          sector: "공공 및 교육기관",
          status: "수요 구체화 (Accumulate)",
          statusColor: "#10B981",
          trend: "조달청 나라장터 MAS 규격 개정 대응",
          details: "조달청이 2026 하반기 PC 공급 품목에 온디바이스 AI 단말 식별코드를 신설함에 따라 삼보컴퓨터, 대우루컴즈 등 국내 조달 PC 제조사들이 NPU 탑재 모델 등록을 완료했습니다. 4분기 불용 예산 집행과 맞물려 지자체 및 초·중·고 스마트 기기 교체 수요가 9월 말부터 집중 출회될 전망입니다."
        },
        {
          sector: "대기업 / 엔터프라이즈",
          status: "안정적 순환 (Steady)",
          statusColor: "#6366F1",
          trend: "DaaS(클라우드 PC)와 AI 노트북의 이원화",
          details: "삼성, 현대차, LG 등 주요 그룹사는 일반 사무직의 경우 DaaS 및 보급형 노트북 조합을 유지하되, 연구개발(R&D), 재무, 기획 등 고생산성 부서에는 45+ TOPS NPU 노트북(Intel Core Ultra 200V / AMD Strix Point)을 전면 지급하는 투트랙(Two-Track) 조달 전략을 고착화하고 있습니다."
        },
        {
          sector: "중소기업(SME) & 스타트업",
          status: "비용 보수적 (Neutral)",
          statusColor: "#F59E0B",
          trend: "단가 상승 부담에 따른 B2B PC 렌탈/구독 급증",
          details: "고금리 기조와 반도체 부품 단가 반영으로 신규 PC 구매에 대한 일시불 지출 부담이 지속되고 있습니다. 이에 따라 월정액 방식의 B2B PC 렌탈(DaaS) 서비스 이용률이 전년 동기 대비 42% 급증하였으며, 리퍼비시(Refurbished) 등급 B2B 단말 유통도 활기를 띠고 있습니다."
        }
      ],

      scenarios: [
        {
          type: "Bull (낙관적 시나리오)",
          probability: "25%",
          condition: "파운드리 수율 대폭 개선 & 메모리 가격 하향 안정",
          impact: "B2B PC ASP 3~5% 인하, 출하량 85만 대 돌파 (전체 기업 교체 시계 앞당겨짐)"
        },
        {
          type: "Base (기본 시나리오 - 유력)",
          probability: "60%",
          condition: "현행 반도체 가격 보합 유지 & AI PC 연착륙",
          impact: "B2B PC ASP 현행 유지(134만 원선), 3분기 출하량 78만 대 수준 안정적 달성"
        },
        {
          type: "Bear (비관적 시나리오)",
          probability: "15%",
          condition: "대만 지진/지정학적 리스크 또는 HBM 공급 병목 심화",
          impact: "DDR5 및 완제품 납기 6주 이상 지연, 기업 예산 동결로 교체 수요 2027년 이연"
        }
      ],

      playbook: [
        {
          target: "조달 수량 500대 이상 대기업/금융사",
          recommendation: "Q3 말(9월 20일 이전) 분할 발주 계약 체결 권고",
          reason: "4분기 초 PC 제조사의 가격 개정(Price Revision) 시 메모리 단가 인상분이 반영될 가능성 70% 이상. 연간 단가 보장 계약(Tier-1 OEM)을 통해 단가 리스크 헷지 필요."
        },
        {
          target: "조달청 공공기관 발주 담당관",
          recommendation: "신규 AI PC MAS 코드 등록 모델 사전 규격 검토",
          reason: "10월 이후 연말 물량 폭주 시 공급 리드타임이 2주에서 5주로 연장될 우려가 있으므로 조기 입찰 공고 집행이 핵심."
        },
        {
          target: "중소기업/스타트업 IT 관리자",
          recommendation: "3년 운용 리스(Operating Lease) 또는 DaaS 프로모션 활용",
          reason: "초기 CAPEX 투자 대신 OPEX로 회계 처리하고 감가상각 종료 시점(3년 차)에 최신 AI PC로 무상 교체하는 옵션이 총소유비용(TCO) 관점에서 18% 유리함."
        }
      ]
    },

    {
      id: "issue-2026-08-w5",
      issueNo: 35,
      date: "2026.08.31",
      title: "HBM3E 생산 비중 확대에 따른 일반 PC DRAM 공급 축소 우려와 하반기 조달 단가 리스크",
      subtitle: "2026년 8월 5주차 한국 B2B PC 시장 & 반도체 수급 주간 전략 보고서",
      category: "공급망 이슈 분석",
      badge: "지난호",
      readTime: "5분 완독",
      tags: ["HBM3E", "PC DRAM", "BOM 원가", "단가 리스크"],
      summary: "메모리 3사의 차세대 HBM3E 12단 양산 가동률이 90%를 돌파함에 따라 웨이퍼 Capa의 레거시 PC DRAM 잠식이 본격화되었습니다. 8월 말 완제품 PC 제조사들의 16GB DDR5 모듈 재고 일수가 4.2주에서 3.1주로 급감하며 단기 조달 리스크가 경고되고 있습니다.",
      executiveSummary: [
        "삼성전자와 SK하이닉스의 서버향 고부가 메모리 집중으로 PC 완제품용 16Gb DDR5 스팟가 주간 +2.4% 반등.",
        "레노버, 델, HP 등 주요 글로벌 OEM의 한국 지사 B2B 공급 납기가 평균 1주가량 연장되는 현상 발생.",
        "국내 대기업 구매팀을 중심으로 선제적 재고 확보를 위한 비딩(Bidding) 경쟁 조짐 관측."
      ],
      semiconductorImpact: {
        headline: "HBM Capa 잠식에 따른 PC DRAM 공급 긴장",
        analysis: "서버용 HBM3E의 다이 패널티(Die Penalty)가 일반 DRAM 대비 3배 수준에 달해 전체 비트 그로스(Bit Growth) 중 PC 배정 물량이 계획 대비 8% 축소되었습니다.",
        metrics: [
          { label: "글로벌 PC DRAM 재고 수준", value: "3.1주", change: "-1.1주" },
          { label: "DDR5 16Gb 스팟가", value: "$4.66", change: "+2.4%" }
        ]
      },
      sectorAnalysis: [],
      scenarios: [],
      playbook: []
    },

    {
      id: "issue-2026-08-w4",
      issueNo: 34,
      date: "2026.08.24",
      title: "Windows 10 EOS 1주년 전야: 국내 대기업 B2B 데스크톱 대규모 교체 주기 도래와 공급망 리드타임",
      subtitle: "2026년 8월 4주차 한국 B2B PC 시장 & 반도체 수급 주간 전략 보고서",
      category: "시장 사이클 분석",
      badge: "지난호",
      readTime: "5분 완독",
      tags: ["Win10 EOS", "B2B 데스크톱", "기업 보안", "교체 주기"],
      summary: "국내 대기업 100개사 조사 결과, 보안 패치 지원 종료에도 불구하고 여전히 구형 OS를 사용 중인 데스크톱 단말이 약 22%로 집계되었습니다. 망분리 내부망 단말의 집중 교체로 인해 9~10월 B2B 데스크톱 출하량이 전년비 12% 급증할 것으로 전망됩니다.",
      executiveSummary: [
        "국내 주요 제조·금융사 데스크톱 교체 대상 물량 약 32만 대 추산.",
        "인텔 코어 14세대 및 코어 울트라 기반 미니 PC / SFF(Small Form Factor) 폼팩터 발주 선호도 68% 기록."
      ],
      semiconductorImpact: {
        headline: "엔터프라이즈 데스크톱용 프로세서 및 NVMe SSD 수급 안정",
        analysis: "노트북 대비 데스크톱 부품은 수급 유연성이 높아 납기 차질 우려가 적으나, 기업 표준 모델로 지정된 1TB PCIe Gen4 SSD의 대량 일괄 발주 시 일시적 수급 병목 주의 필요.",
        metrics: [
          { label: "데스크톱 B2B 출하 비중", value: "37.8%", change: "+1.2%p" }
        ]
      },
      sectorAnalysis: [],
      scenarios: [],
      playbook: []
    },

    {
      id: "issue-2026-08-w3",
      issueNo: 33,
      date: "2026.08.17",
      title: "공공 조달(나라장터) 온디바이스 AI PC 표준 규격 고시와 국산 PC 제조사별 대응 현황",
      subtitle: "2026년 8월 3주차 한국 B2B PC 시장 & 반도체 수급 주간 전략 보고서",
      category: "정책 및 공공 조달",
      badge: "지난호",
      readTime: "4분 완독",
      tags: ["공공 조달", "나라장터", "조달청 MAS", "온디바이스 AI"],
      summary: "조달청이 공공기관 보급 PC의 성능 기준에 'NPU 연산 능력 40 TOPS 이상'을 권장 옵션으로 공식 채택했습니다. 이에 따라 하반기 학교 및 지자체 정보화 사업 예산이 차세대 AI PC 중심으로 재편되고 있습니다.",
      executiveSummary: [
        "조달 등록 국산 PC 제조사 12개사 중 9개사가 NPU 탑재 조달 등록 완료.",
        "공공 입찰 단가 평균 낙찰률 88.5% 형성."
      ],
      semiconductorImpact: {
        headline: "온디바이스 AI 프로세서의 정부 조달 표준화",
        analysis: "정부 및 공공기관의 AI 행정 도구 도입 활성화에 맞춰 국산 PC 업체들의 인텔/AMD 신규 플랫폼 조달 납품이 활성화되고 있습니다.",
        metrics: [
          { label: "조달청 AI PC 규격 등록 건수", value: "48개 모델", change: "+16개" }
        ]
      },
      sectorAnalysis: [],
      scenarios: [],
      playbook: []
    }
  ],

  // 5. 시뮬레이터 기본 설정 계수
  simulatorConfig: {
    baseASP: {
      enterprise: 1450000,
      finance: 1580000,
      public: 1220000,
      sme: 1150000
    },
    // 반도체 시나리오별 가격 변동 가중치
    semiScenarios: {
      crash: { label: "반도체 가격 급락 (-15%)", factor: -0.065, desc: "공급 과잉으로 메모리/SSD 가격 하락, 완제품 단가 약 6.5% 인하" },
      stable: { label: "현재 수준 유지 (안정)", factor: 0.0, desc: "현행 가격 보합, 정상 수준 예산 집행" },
      slight_up: { label: "메모리 완만한 상승 (+10%)", factor: 0.045, desc: "HBM Capa 전용 및 AI 수요로 완제품 단가 약 4.5% 인상" },
      surge: { label: "반도체 가격 급등 (+25%)", factor: 0.115, desc: "선단공정 병목 및 원가 급등으로 완제품 단가 약 11.5% 대폭 인상" }
    },
    // AI PC NPU 탑재 추가 프리미엄 (단말당 약 +180,000원 상당)
    aiPcPremiumPerUnit: 180000
  },

  // 6. 주간 구독 기본 설정 정보
  subscriptionPlans: {
    availableDays: ["월요일 08:00 (추천)", "수요일 09:00", "금요일 17:00"],
    reportTypes: [
      { id: "exec", name: "C-Level 경영진 브리핑 (1페이지 핵심 요약)" },
      { id: "procurement", name: "구매/조달 실무자 전략 리포트 (BOM & 단가 분석)" },
      { id: "deepdive", name: "심층 애널리스트 풀 리포트 (반도체 지표 원문 포함)" }
    ]
  }
};
