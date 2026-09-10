import type { Product, ProductItineraryItem } from '@/types/domain'
import { emptyLocalizedText } from '@/types/common'
import { addMinutes } from '@/utils/time'
import { seedMaterials } from './materials'

const now = '2026-08-05T00:00:00.000Z'

function material(id: string) {
  const found = seedMaterials.find((m) => m.id === id)
  if (!found) throw new Error(`Unknown seed material: ${id}`)
  return found
}

function item(
  itemId: string,
  materialId: string,
  startTime: string,
  opts?: { transitMinutesBefore?: number; freeTimeNote?: string; remarks?: string },
): ProductItineraryItem {
  const snapshot = material(materialId)
  const transitMinutesBefore = opts?.transitMinutesBefore ?? 0
  const endTime = addMinutes(startTime, snapshot.durationMinutes)
  return {
    id: itemId,
    materialId,
    materialSnapshot: snapshot,
    startTime,
    endTime,
    transitMinutesBefore,
    freeTimeNote: opts?.freeTimeNote
      ? { zh: opts.freeTimeNote, en: opts.freeTimeNote, ko: opts.freeTimeNote }
      : emptyLocalizedText(),
    remarks: opts?.remarks ? { zh: opts.remarks, en: opts.remarks, ko: opts.remarks } : emptyLocalizedText(),
  }
}

const cover1 = 'https://images.unsplash.com/photo-1638964663550-e2123ac8900b?auto=format&fit=crop&w=1600&q=80'
const cover2 = 'https://images.unsplash.com/photo-1570191913384-7b4ff11716e7?auto=format&fit=crop&w=1600&q=80'
const cover3 = 'https://images.unsplash.com/photo-1780296269675-169390638617?auto=format&fit=crop&w=1600&q=80'
const cover4 = 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1600&q=80'

export const seedProducts: Product[] = [
  {
    id: 'prod_3d2n_consult',
    name: {
      zh: '首尔 3 天 2 晚 · 医美咨询与轻松观光',
      en: 'Seoul 3 Days 2 Nights · Medical Consultation & Easy Sightseeing',
      ko: '서울 3일 2박 · 미용 상담 & 여유 관광',
    },
    summary: {
      zh: '短途行程，一次专业面诊配合首尔经典景点漫游，适合利用假期初步了解医美选项的旅客。',
      en: 'A short trip pairing one professional consultation with classic Seoul sightseeing — ideal for a first look at your options.',
      ko: '짧은 일정 안에 전문 상담과 서울 클래식 관광을 함께 즐기는, 첫 상담에 적합한 코스입니다.',
    },
    coverImage: cover1,
    days: 3,
    itinerary: [
      {
        day: 1,
        items: [item('i_3d_1_1', 'mat_airport_pickup', '15:00')],
      },
      {
        day: 2,
        items: [
          item('i_3d_2_1', 'mat_charter_9h', '09:00'),
          item('i_3d_2_2', 'mat_palace_hanbok', '09:30', { transitMinutesBefore: 20 }),
          item('i_3d_2_3', 'mat_market_food', '13:30', { transitMinutesBefore: 20 }),
          item('i_3d_2_4', 'mat_medical_consult', '15:30', { transitMinutesBefore: 30 }),
        ],
      },
      {
        day: 3,
        items: [item('i_3d_3_1', 'mat_airport_dropoff', '11:00', { freeTimeNote: '上午可在酒店周边自由活动' })],
      },
    ],
    targetAudience: {
      zh: '想利用短途行程先做一次面诊评估、同时轻松逛逛首尔的旅客',
      en: 'Travelers who want one consultation plus relaxed Seoul sightseeing on a short trip',
      ko: '짧은 일정으로 상담과 서울 관광을 함께 즐기고 싶은 여행객',
    },
    pricingInput: { paxCount: 2, vehicleCount: 1 },
    sellingPrice: 980000,
    discountAmount: 0,
    currency: 'KRW',
    priceNote: {
      zh: '演示价格，按 2 人 1 车计算，实际报价以咨询确认为准。',
      en: 'Demo price based on 2 travelers / 1 vehicle; final quote confirmed at consultation.',
      ko: '2인 1차량 기준 데모 가격이며, 최종 견적은 상담 시 확정됩니다.',
    },
    optionalAddons: [],
    includedSummary: [
      { zh: '机场接送、市内包车、景点门票与韩服体验', en: 'Airport transfers, city charter, admissions and hanbok experience', ko: '공항 픽업·샌딩, 시내 전세 차량, 입장료 및 한복 체험' },
      { zh: '医美机构面诊陪同与翻译', en: 'Clinic consultation escort and interpretation', ko: '의료 기관 상담 동행 및 통역' },
    ],
    excludedSummary: [
      { zh: '国际往返机票、酒店住宿', en: 'International airfare and hotel accommodation', ko: '국제 왕복 항공권 및 호텔 숙박' },
      { zh: '实际诊疗/检测费用', en: 'Actual consultation or test fees', ko: '실제 진료·검사 비용' },
    ],
    extraFeesNote: {
      zh: '超时包车、深夜接机等附加费用见各素材明细。',
      en: 'Overtime charter or late-night pickup surcharges are listed per material above.',
      ko: '초과 전세, 심야 픽업 등 추가 요금은 각 항목 상세에서 확인하세요.',
    },
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'prod_5d4n_custom',
    name: {
      zh: '首尔 5 天 4 晚 · 医美陪同与私人定制',
      en: 'Seoul 5 Days 4 Nights · Medical Escort & Private Custom',
      ko: '서울 5일 4박 · 미용 동행 & 프라이빗 맞춤',
    },
    summary: {
      zh: '前三天悠闲游览首尔经典景点，第四天专业面诊，第五天专注医美体验并预留休息时间，行程节奏与恢复安排充分考虑医美旅客需求。',
      en: 'Three unhurried days of classic Seoul sightseeing, a professional consultation on day four, and a full day set aside for the beauty programme with rest built in — paced for medical beauty travelers.',
      ko: '3일간 여유롭게 서울을 둘러보고, 4일차 전문 상담 후 5일차는 온전히 뷰티 프로그램과 휴식에 집중하는, 미용 의료 여행객을 위한 일정입니다.',
    },
    coverImage: cover2,
    days: 5,
    itinerary: [
      {
        day: 1,
        items: [item('i_5d_1_1', 'mat_airport_pickup', '15:00', { remarks: '抵达当天不安排观光，充分休息' })],
      },
      {
        day: 2,
        items: [
          item('i_5d_2_1', 'mat_charter_9h', '09:00'),
          item('i_5d_2_2', 'mat_palace_hanbok', '09:30', { transitMinutesBefore: 20 }),
          item('i_5d_2_3', 'mat_market_food', '13:30', { transitMinutesBefore: 20 }),
          item('i_5d_2_4', 'mat_namsan_tower', '16:00', { transitMinutesBefore: 30 }),
        ],
      },
      {
        day: 3,
        items: [
          item('i_5d_3_1', 'mat_charter_9h', '09:00'),
          item('i_5d_3_2', 'mat_gangnam_free', '10:00', { transitMinutesBefore: 30 }),
          item('i_5d_3_3', 'mat_medical_consult', '14:00', {
            transitMinutesBefore: 20,
            remarks: '面诊结论与后续安排以医生意见为准，是否进行及具体项目由客人自行决定',
          }),
        ],
      },
      {
        day: 4,
        items: [
          item('i_5d_4_1', 'mat_medical_treatment_day', '09:00', {
            remarks: '当天不安排观光行程，车辆与陪同人员全程待命',
          }),
        ],
      },
      {
        day: 5,
        items: [
          item('i_5d_5_1', 'mat_airport_dropoff', '13:00', {
            freeTimeNote: '上午视术后状态自由休息或在酒店周边活动',
          }),
        ],
      },
    ],
    targetAudience: {
      zh: '希望兼顾深度观光与完整医美流程（面诊+体验+恢复缓冲）的旅客',
      en: 'Travelers who want both in-depth sightseeing and a full medical beauty flow (consultation, programme, and a recovery buffer)',
      ko: '심도 있는 관광과 상담-프로그램-회복 여유까지 포함된 완전한 미용 의료 일정을 원하는 여행객',
    },
    pricingInput: { paxCount: 2, vehicleCount: 1 },
    sellingPrice: 2380000,
    discountAmount: 100000,
    currency: 'KRW',
    priceNote: {
      zh: '演示价格，按 2 人 1 车计算；实际医美项目费用由机构现场直接收取，不包含在本行程报价内。',
      en: 'Demo price based on 2 travelers / 1 vehicle; actual treatment fees are billed directly by the clinic and are not included in this quote.',
      ko: '2인 1차량 기준 데모 가격이며, 실제 시술 비용은 기관에서 직접 청구하며 본 견적에 포함되지 않습니다.',
    },
    optionalAddons: [
      { id: 'addon_english_driver', name: { zh: '全程英语司机', en: 'English-speaking driver throughout', ko: '전 일정 영어 기사' }, fee: 30000 },
    ],
    includedSummary: [
      { zh: '全程专属车辆与司机、机场接送', en: 'Private vehicle and driver throughout, airport transfers', ko: '전 일정 전용 차량·기사, 공항 픽업·샌딩' },
      { zh: '景点门票、韩服体验、传统市集美食体验', en: 'Admissions, hanbok experience and market food tasting', ko: '입장료, 한복 체험, 전통시장 먹거리 체험' },
      { zh: '医美机构面诊陪同、翻译及治疗日全程陪同', en: 'Clinic consultation escort/interpretation and treatment-day escort', ko: '의료 기관 상담 동행·통역 및 시술 당일 동행' },
    ],
    excludedSummary: [
      { zh: '国际往返机票、4 晚酒店住宿、三餐', en: 'International airfare, 4 nights’ hotel, all meals', ko: '국제 왕복 항공권, 4박 호텔, 전 식사' },
      { zh: '实际医美治疗费用、旅行及医疗保险', en: 'Actual treatment fees, travel and medical insurance', ko: '실제 시술 비용, 여행자·의료 보험' },
      { zh: '个人购物及行程未列明的项目', en: 'Personal shopping and anything not listed above', ko: '개인 쇼핑 및 일정에 명시되지 않은 항목' },
    ],
    extraFeesNote: {
      zh: '包车超过 9 小时按每小时 ₩30,000（演示价格）加收；具体医美项目、恢复期安排以医生面诊结论为准，可能对第 4-5 天行程做出调整。',
      en: 'Charter beyond 9 hours is billed at a demo rate of ₩30,000/hour; specific treatments and recovery scheduling follow the doctor’s in-person conclusion and may adjust Days 4–5.',
      ko: '9시간 초과 전세는 시간당 ₩30,000(데모 가격)이 추가되며, 구체적 시술과 회복 일정은 의사의 대면 소견에 따라 4~5일차 일정이 조정될 수 있습니다.',
    },
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'prod_transfer_charter',
    name: {
      zh: '机场接送与首尔一日包车',
      en: 'Airport Transfer & Seoul One-Day Charter',
      ko: '공항 픽업·샌딩 & 서울 시내 1일 전세',
    },
    summary: {
      zh: '适合行程紧凑的短途旅客，接机后直接开启一日经典景点包车游，次日送机。',
      en: 'For travelers on a tight schedule: pickup leads straight into a one-day classic-sights charter, with drop-off the next day.',
      ko: '일정이 빠듯한 여행객을 위해 픽업 후 바로 1일 클래식 투어를 진행하고, 다음날 샌딩합니다.',
    },
    coverImage: cover3,
    days: 2,
    itinerary: [
      {
        day: 1,
        items: [
          item('i_tc_1_1', 'mat_airport_pickup', '09:00'),
          item('i_tc_1_2', 'mat_charter_9h', '11:00', { transitMinutesBefore: 30 }),
          item('i_tc_1_3', 'mat_palace_hanbok', '11:30'),
          item('i_tc_1_4', 'mat_namsan_tower', '15:30', { transitMinutesBefore: 20 }),
        ],
      },
      {
        day: 2,
        items: [item('i_tc_2_1', 'mat_airport_dropoff', '12:00', { freeTimeNote: '上午自由活动' })],
      },
    ],
    targetAudience: {
      zh: '中转、短暂停留或只需要接送与一日游的旅客',
      en: 'Travelers on a layover or short stay who just need transfers and one day of sightseeing',
      ko: '경유 또는 짧은 체류로 픽업·샌딩과 1일 투어만 필요한 여행객',
    },
    pricingInput: { paxCount: 4, vehicleCount: 1 },
    sellingPrice: 780000,
    discountAmount: 0,
    currency: 'KRW',
    priceNote: {
      zh: '演示价格，按 4 人 1 车计算。',
      en: 'Demo price based on 4 travelers / 1 vehicle.',
      ko: '4인 1차량 기준 데모 가격입니다.',
    },
    optionalAddons: [],
    includedSummary: [
      { zh: '往返机场接送、市内包车 9 小时', en: 'Round-trip airport transfers, 9-hour city charter', ko: '왕복 공항 픽업·샌딩, 시내 9시간 전세' },
      { zh: '景福宫韩服体验、南山缆车及观景台门票', en: 'Gyeongbokgung hanbok experience, Namsan cable car and observatory admission', ko: '경복궁 한복 체험, 남산 케이블카 및 전망대 입장' },
    ],
    excludedSummary: [
      { zh: '酒店住宿、三餐', en: 'Hotel accommodation and meals', ko: '호텔 숙박 및 식사' },
    ],
    extraFeesNote: {
      zh: '包车超过 9 小时按每小时 ₩30,000（演示价格）加收。',
      en: 'Charter beyond 9 hours is billed at a demo rate of ₩30,000/hour.',
      ko: '9시간 초과 전세는 시간당 ₩30,000(데모 가격)이 추가됩니다.',
    },
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
  {
    id: 'prod_kpop_city',
    name: {
      zh: 'K-pop 与首尔城市体验',
      en: 'K-pop & Seoul City Experience',
      ko: 'K-pop & 서울 시티 체험',
    },
    summary: {
      zh: '经典观光结合舞蹈体验课与演唱会购票协助，专为追星旅客设计。',
      en: 'Classic sightseeing paired with a dance class and concert ticket assistance, designed for K-pop fans.',
      ko: '클래식 관광에 댄스 체험과 콘서트 티켓 구매 지원을 더한, 팬을 위한 일정입니다.',
    },
    coverImage: cover4,
    days: 3,
    itinerary: [
      {
        day: 1,
        items: [item('i_kp_1_1', 'mat_airport_pickup', '14:00')],
      },
      {
        day: 2,
        items: [
          item('i_kp_2_1', 'mat_charter_9h', '09:00'),
          item('i_kp_2_2', 'mat_palace_hanbok', '09:30', { transitMinutesBefore: 20 }),
          item('i_kp_2_3', 'mat_namsan_tower', '13:30', { transitMinutesBefore: 30 }),
          item('i_kp_2_4', 'mat_kpop_dance_class', '17:00', { transitMinutesBefore: 30 }),
        ],
      },
      {
        day: 3,
        items: [
          item('i_kp_3_1', 'mat_kpop_ticket_service', '10:00'),
          item('i_kp_3_2', 'mat_airport_dropoff', '15:00', { freeTimeNote: '午间自由活动，含演唱会（如已订票）' }),
        ],
      },
    ],
    targetAudience: {
      zh: 'K-pop 粉丝及希望结合追星与经典观光的旅客',
      en: 'K-pop fans who want to combine concerts with classic sightseeing',
      ko: '콘서트와 클래식 관광을 함께 즐기고 싶은 K-pop 팬',
    },
    pricingInput: { paxCount: 2, vehicleCount: 1 },
    sellingPrice: 890000,
    discountAmount: 40000,
    currency: 'KRW',
    priceNote: {
      zh: '演示价格，按 2 人 1 车计算，不含演唱会门票本身费用。',
      en: 'Demo price based on 2 travelers / 1 vehicle; does not include the concert ticket price itself.',
      ko: '2인 1차량 기준 데모 가격이며, 콘서트 티켓 금액 자체는 포함되지 않습니다.',
    },
    optionalAddons: [
      { id: 'addon_video_edit', name: { zh: '舞蹈视频专业剪辑', en: 'Professionally edited dance video', ko: '댄스 영상 전문 편집' }, fee: 25000 },
    ],
    includedSummary: [
      { zh: '机场接送、市内包车、景点门票', en: 'Airport transfers, city charter, admissions', ko: '공항 픽업·샌딩, 시내 전세, 입장료' },
      { zh: 'K-pop 舞蹈体验课、购票流程协助', en: 'K-pop dance class, ticket purchase assistance', ko: 'K-pop 댄스 체험, 티켓 구매 지원' },
    ],
    excludedSummary: [
      { zh: '演唱会门票本身、酒店住宿、三餐', en: 'The concert ticket itself, hotel accommodation, meals', ko: '콘서트 티켓 자체, 호텔 숙박, 식사' },
    ],
    extraFeesNote: {
      zh: '购票协助不保证抢票成功，具体场次以官方票务平台为准。',
      en: 'Ticket assistance does not guarantee a successful purchase; actual shows follow the official ticketing platform.',
      ko: '티켓 구매 지원은 예매 성공을 보장하지 않으며, 실제 공연은 공식 티켓 플랫폼 기준입니다.',
    },
    status: 'published',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  },
]
