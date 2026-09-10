import type { Lang, LocalizedText } from '@/types/common'
import type { AttractionCategoryKey, AttractionInfo } from '@/types/domain'

// Fallback content shown only when the Seoul Tourism Organization API key is
// missing or a live request fails. Clearly flagged via isDemo so the UI can
// label it accordingly rather than passing it off as live data. Modeled in
// all three languages so the fallback still respects the site's language
// switch, the same way the real API returns content per requested language.
interface RawDemoAttraction {
  id: string
  category: AttractionCategoryKey
  name: LocalizedText
  summary: LocalizedText
  description: LocalizedText
  address: LocalizedText
  openHours: LocalizedText
  images: string[]
  phone: string | null
  website: string | null
  region: string
}

const RAW: RawDemoAttraction[] = [
  {
    id: 'demo_attraction_1',
    category: 'history',
    name: { zh: '景福宫', en: 'Gyeongbokgung Palace', ko: '경복궁' },
    summary: {
      zh: '朝鲜王朝的正宫，首尔最具代表性的古建筑群。',
      en: "The main palace of the Joseon dynasty, and Seoul's most iconic historic complex.",
      ko: '조선 왕조의 정궁으로, 서울을 대표하는 고건축군입니다.',
    },
    description: {
      zh: '景福宫始建于1395年，是朝鲜王朝的法宫，正殿勤政殿与庆会楼是核心看点，穿韩服可免费入场。周二为例行闭宫日。',
      en: 'Built in 1395 as the primary royal palace of the Joseon dynasty, its highlights are the Geunjeongjeon throne hall and Gyeonghoeru pavilion. Admission is free when wearing hanbok. Closed on Tuesdays.',
      ko: '1395년에 창건된 조선 왕조의 법궁으로, 근정전과 경회루가 핵심 볼거리입니다. 한복을 착용하면 무료로 입장할 수 있으며, 매주 화요일은 휴궁입니다.',
    },
    address: {
      zh: '首尔特别市钟路区社稷路 161',
      en: '161 Sajik-ro, Jongno-gu, Seoul',
      ko: '서울특별시 종로구 사직로 161',
    },
    openHours: {
      zh: '09:00-18:00（季节调整，周二休宫）',
      en: '09:00-18:00 (seasonal hours, closed Tuesdays)',
      ko: '09:00-18:00 (계절별 변동, 화요일 휴궁)',
    },
    images: ['https://images.unsplash.com/photo-1638964663550-e2123ac8900b?auto=format&fit=crop&w=1200&q=80'],
    phone: '+82-2-3700-3900',
    website: 'https://www.royalpalace.go.kr',
    region: '종로구',
  },
  {
    id: 'demo_attraction_2',
    category: 'culture',
    name: { zh: '南山首尔塔', en: 'N Seoul Tower', ko: 'N서울타워' },
    summary: {
      zh: '俯瞰首尔全景的地标观景塔。',
      en: "A landmark observation tower with a panoramic view of Seoul.",
      ko: '서울 전경을 한눈에 담을 수 있는 랜드마크 전망탑입니다.',
    },
    description: {
      zh: '乘坐缆车登上南山，可远眺汉江与市区天际线，夜景与日落时段尤其受欢迎，是情侣同游的热门景点。',
      en: 'A cable car ride up Namsan Mountain offers views of the Han River and city skyline — sunset and night views are especially popular, and it is a well-known spot for couples.',
      ko: '케이블카를 타고 남산에 오르면 한강과 도심 스카이라인을 조망할 수 있으며, 노을과 야경 시간대에 특히 인기가 많아 연인들의 데이트 명소로 알려져 있습니다.',
    },
    address: {
      zh: '首尔特别市龙山区南山公园街 105',
      en: '105 Namsangongwon-gil, Yongsan-gu, Seoul',
      ko: '서울특별시 용산구 남산공원길 105',
    },
    openHours: { zh: '10:00-23:00', en: '10:00-23:00', ko: '10:00-23:00' },
    images: ['https://images.unsplash.com/photo-1570191913384-7b4ff11716e7?auto=format&fit=crop&w=1200&q=80'],
    phone: '+82-2-3455-9277',
    website: 'https://www.nseoultower.com',
    region: '용산구',
  },
  {
    id: 'demo_attraction_3',
    category: 'history',
    name: { zh: '北村韩屋村', en: 'Bukchon Hanok Village', ko: '북촌한옥마을' },
    summary: {
      zh: '保存完好的传统韩屋街区，感受首尔的老城韵味。',
      en: 'A well-preserved traditional hanok neighborhood that captures old Seoul.',
      ko: '전통 한옥이 잘 보존된 마을로, 서울의 옛 정취를 느낄 수 있습니다.',
    },
    description: {
      zh: '位于景福宫与昌德宫之间的传统居住区，至今仍有居民生活，参观时请保持安静，开放时间集中在白天。',
      en: 'Located between Gyeongbokgung and Changdeokgung palaces, this is a still-inhabited residential area — please keep noise down while visiting. Best visited during the day.',
      ko: '경복궁과 창덕궁 사이에 위치한, 실제 주민이 거주하는 지역입니다. 방문 시 정숙을 유지해 주시고, 낮 시간대 방문을 권장합니다.',
    },
    address: {
      zh: '首尔特别市钟路区桂洞街 37',
      en: '37 Gyedong-gil, Jongno-gu, Seoul',
      ko: '서울특별시 종로구 계동길 37',
    },
    openHours: {
      zh: '10:00-17:00（居民区，建议白天参观）',
      en: '10:00-17:00 (a residential area — daytime visits recommended)',
      ko: '10:00-17:00 (주거 지역, 낮 시간 방문 권장)',
    },
    images: ['https://images.unsplash.com/photo-1703825864792-5880081beaaf?auto=format&fit=crop&w=1200&q=80'],
    phone: null,
    website: null,
    region: '종로구',
  },
  {
    id: 'demo_attraction_4',
    category: 'food',
    name: { zh: '广藏市场', en: 'Gwangjang Market', ko: '광장시장' },
    summary: {
      zh: '有百年历史的传统市场，韩国街头美食的聚集地。',
      en: "A century-old traditional market and a hub for Korean street food.",
      ko: '100년 역사를 지닌 전통 시장으로, 한국 길거리 음식의 성지입니다.',
    },
    description: {
      zh: '以绿豆煎饼、生牛肉刺身等传统小吃闻名，同时也是购买韩服面料的老字号市场。',
      en: 'Known for traditional snacks like bindaetteok (mung bean pancake) and yukhoe (beef tartare), and also a long-standing market for hanbok fabric.',
      ko: '빈대떡, 육회 등 전통 먹거리로 유명하며, 한복 원단을 취급하는 오래된 상점들도 있습니다.',
    },
    address: {
      zh: '首尔特别市钟路区昌庆宫路 88',
      en: '88 Changgyeonggung-ro, Jongno-gu, Seoul',
      ko: '서울특별시 종로구 창경궁로 88',
    },
    openHours: {
      zh: '09:00-18:00（餐饮摊位至22:00，部分周日休息）',
      en: '09:00-18:00 (food stalls until 22:00, some closed on Sundays)',
      ko: '09:00-18:00 (먹거리 골목은 22:00까지, 일부 점포 일요일 휴무)',
    },
    images: ['https://images.unsplash.com/photo-1628532429788-c35922b5e6c1?auto=format&fit=crop&w=1200&q=80'],
    phone: '+82-2-2267-0291',
    website: 'https://www.gwangjangmarket.co.kr',
    region: '종로구',
  },
  {
    id: 'demo_attraction_5',
    category: 'shopping',
    name: { zh: 'COEX 星空图书馆', en: 'Starfield Library, COEX', ko: 'COEX 별마당도서관' },
    summary: {
      zh: '13米高书架构成的免费开放图书馆，江南地标打卡点。',
      en: 'A free public library with 13-metre-high bookshelves — a Gangnam landmark photo spot.',
      ko: '13m 높이의 서가로 이루어진 무료 개방 도서관으로, 강남의 대표 포토 스팟입니다.',
    },
    description: {
      zh: '位于COEX购物中心内的公共阅读空间，高耸书架极具视觉冲击力，是首尔最热门的免费拍照地之一。',
      en: 'A public reading space inside the COEX mall, with towering bookshelves that make it one of the most popular free photo spots in Seoul.',
      ko: 'COEX 몰 내부의 공공 열람 공간으로, 높이 솟은 서가가 인상적이며 서울에서 가장 인기 있는 무료 포토 스팟 중 하나입니다.',
    },
    address: {
      zh: '首尔特别市江南区永东大路 513',
      en: '513 Yeongdong-daero, Gangnam-gu, Seoul',
      ko: '서울특별시 강남구 영동대로 513',
    },
    openHours: { zh: '10:30-22:00', en: '10:30-22:00', ko: '10:30-22:00' },
    images: ['https://images.unsplash.com/photo-1742743920246-dfa5cce0982e?auto=format&fit=crop&w=1200&q=80'],
    phone: '+82-2-6002-3300',
    website: 'https://www.starfield.co.kr',
    region: '강남구',
  },
  {
    id: 'demo_attraction_6',
    category: 'nature',
    name: { zh: '南怡岛', en: 'Nami Island', ko: '남이섬' },
    summary: {
      zh: '首尔近郊的知名度假岛屿，四季景色各异。',
      en: 'A well-known resort island near Seoul, with a different look each season.',
      ko: '서울 근교의 유명 휴양 섬으로, 계절마다 색다른 풍경을 자랑합니다.',
    },
    description: {
      zh: '以水杉大道闻名的度假小岛，需搭乘渡轮往返，秋季枫叶季是最热门的时节。',
      en: 'A small resort island famous for its metasequoia tree-lined avenue, reachable only by ferry — autumn foliage season is the most popular time to visit.',
      ko: '메타세쿼이아 길로 유명한 휴양 섬으로, 페리로만 왕래할 수 있으며 가을 단풍철에 가장 인기가 많습니다.',
    },
    address: {
      zh: '江原道春川市南山面南怡岛街 1',
      en: '1 Namisum-gil, Namsan-myeon, Chuncheon, Gangwon-do',
      ko: '강원도 춘천시 남산면 남이섬길 1',
    },
    openHours: {
      zh: '07:30-21:30（渡轮末班视季节调整）',
      en: '07:30-21:30 (last ferry time varies by season)',
      ko: '07:30-21:30 (막배 시간은 계절에 따라 변동)',
    },
    images: ['https://images.unsplash.com/photo-1644765662414-19212b854c64?auto=format&fit=crop&w=1200&q=80'],
    phone: '+82-31-580-8114',
    website: 'https://www.namisum.com',
    region: '강원도',
  },
]

function toAttractionInfo(raw: RawDemoAttraction, lang: Lang): AttractionInfo {
  return {
    id: raw.id,
    name: raw.name[lang] || raw.name.en,
    summary: raw.summary[lang] || raw.summary.en,
    description: raw.description[lang] || raw.description.en,
    address: raw.address[lang] || raw.address.en,
    images: raw.images,
    phone: raw.phone,
    website: raw.website,
    openHours: raw.openHours[lang] || raw.openHours.en,
    region: raw.region,
    isDemo: true,
    category: raw.category,
  }
}

export function getSeedAttractions(lang: Lang): AttractionInfo[] {
  return RAW.map((raw) => toAttractionInfo(raw, lang))
}

export function getSeedAttractionById(id: string, lang: Lang): AttractionInfo | null {
  const raw = RAW.find((r) => r.id === id)
  return raw ? toAttractionInfo(raw, lang) : null
}
