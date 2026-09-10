import type { KpopEvent } from '@/types/domain'

// All entries below are fictional placeholders for demo purposes only.
// They do not represent real shows, dates, or ticket availability.
export const seedKpopEvents: KpopEvent[] = [
  {
    id: 'kpop_demo_1',
    name: '[演示] SEOUL WAVE 演唱会',
    artist: '示例艺人 A',
    date: '2026-11-14',
    venue: '首尔奥林匹克体操竞技场（演示场馆）',
    poster: 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=800&q=80',
    officialTicketUrl: 'https://www.interpark.com',
    isDemo: true,
  },
  {
    id: 'kpop_demo_2',
    name: '[演示] K-Culture Festival',
    artist: '示例组合 B',
    date: '2026-11-28',
    venue: 'KSPO DOME（演示场馆）',
    poster: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=800&q=80',
    officialTicketUrl: 'https://ticket.yes24.com',
    isDemo: true,
  },
  {
    id: 'kpop_demo_3',
    name: '[演示] 音乐节目录制观众应援',
    artist: '示例多组合合演',
    date: '2026-12-06',
    venue: 'CJ ENM 上岩制作中心（演示场馆）',
    poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    officialTicketUrl: 'https://www.melon.com',
    isDemo: true,
  },
  {
    id: 'kpop_demo_4',
    name: '[演示] 跨年倒数演唱会',
    artist: '示例阵容',
    date: '2026-12-31',
    venue: '首尔广场（演示场馆）',
    poster: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80',
    officialTicketUrl: 'https://ticket.interpark.com',
    isDemo: true,
  },
]
