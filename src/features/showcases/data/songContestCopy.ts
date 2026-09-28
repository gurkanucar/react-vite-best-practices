const en = {
  tagline: 'Live singing contest',
  frame: {
    title: 'Song contest',
    description:
      'A live singing final for a big screen: simulated voting with turnout charts, an anonymous vote split, a masked voter feed and a results reveal from last place to first.',
  },
  nav: { home: 'The show', live: 'Live voting', results: 'Results' },
  stage: { enter: 'Stage mode (full screen)', exit: 'Leave stage mode' },
  wordmark: ['SESİN', 'RENGİ'],
  credit: (organiser: string) => `Presented with ${organiser} · Grand final, live`,
  photos: 'Photos: Unsplash',
  strip: {
    total: 'Total votes',
    finalists: 'Finalists',
    champion: 'Champion',
    lastMinute: 'Last minute',
    voters: 'People voting',
    turnout: 'Turnout',
    closesIn: 'Lines close in',
    opensIn: 'Next round in',
    rate: 'Share',
    votes: 'Total votes',
  },
  finalResults: 'Final results',
  common: {
    votingOpen: 'Voting open',
    votingClosed: 'Voting closed',
    closesIn: 'Lines close in',
    opensIn: 'Next round in',
    back: 'Back to the show',
    notFound: 'We couldn’t find that singer.',
    coach: 'Coach',
    years: 'years old',
    finalist: 'Finalist',
    wildcard: 'Jury wildcard',
  },
  home: {
    eyebrow: 'Season 4 · Grand final',
    title: 'Four voices. One night. One winner.',
    lead: 'The final is live. The audience votes throughout the round; the big screen shows the turnout as it happens, and when the lines close the places open from fourth to the winner.',
    toLive: 'Watch the live vote',
    toResults: 'See the results',
    finalistsTitle: 'Tonight’s finalists',
    howTitle: 'How the night works',
    how: [
      {
        title: 'Listen',
        body: 'Every finalist sings once; replays run during the round.',
      },
      {
        title: 'The audience votes',
        body: 'The screen shows turnout and an unnamed split, never who is ahead.',
      },
      {
        title: 'Reveal',
        body: 'When the lines close, places open from last to first.',
      },
    ],
    statusOpen: 'Voting is open right now',
    statusClosed: 'Lines are closed, results are in',
    votesSoFar: 'votes so far',
  },
  live: {
    heading: 'Live voting',
    title: 'The lines are open',
    closedTitle: 'The lines are closed',
    closedLead: 'Every vote is in. The results are ready.',
    secret: 'Nobody’s score is shown until the lines close',
    toResults: 'Open the results',
    round: 'Round',
    flow: 'Vote flow · last 6 min',
    perMinute: 'votes/min',
    rightNow: 'now',
    minute: 'Minute',
    split: 'The split so far',
    splitNote: 'Unnamed: slices are sorted by size and say nothing about who is who.',
    feed: 'Voting now',
    voted: (count: number) => (count === 1 ? 'voted' : `${count} votes`),
    secondsAgo: (seconds: number) =>
      seconds < 5
        ? 'just now'
        : seconds < 60
          ? `${seconds}s ago`
          : `${Math.floor(seconds / 60)} min ago`,
  },
  results: {
    heading: 'Final results',
    scenario: 'Result to show',
    next: 'Reveal next',
    all: 'Reveal all',
    reset: 'Start again',
    tapToReveal: 'Tap to reveal',
    waiting: 'Waiting',
    tie: 'Tie',
    champion: 'CHAMPION',
    place: (rank: number) => `${rank}${ordinal(rank)} place`,
    revealed: (rank: number, names: string) => `${names}: ${rank}${ordinal(rank)} place`,
    congrats: (names: string) => `Congratulations, ${names}!`,
    demo: 'Demo result',
  },
  contestant: {
    performance: 'The performance',
    song: 'Song',
    credit: 'Written by',
    genre: 'Style',
    key: 'Key',
    tempo: 'Tempo',
    length: 'Length',
    nowPlaying: 'Now playing',
    play: 'Play preview',
    pause: 'Pause',
    visualNote: 'A visual preview only; the show’s audio isn’t included.',
    about: 'About',
    others: 'The other finalists',
    bpm: 'BPM',
    photoNote: 'Stock photo from Unsplash, standing in for a made-up singer.',
  },
  footer: {
    about:
      'Sesin Rengi is a made-up singing contest built for this showcase. Singers, votes and results are simulated; the photos are stock images.',
    rights: 'All rights reserved.',
  },
}

function ordinal(rank: number) {
  const tens = rank % 100
  if (tens >= 11 && tens <= 13) return 'th'
  return ['th', 'st', 'nd', 'rd'][rank % 10] ?? 'th'
}

type Copy = typeof en

const tr: Copy = {
  tagline: 'Canlı şarkı yarışması',
  frame: {
    title: 'Şarkı yarışması',
    description:
      'Dev ekran için canlı bir şarkı finali: simüle oylama, katılım grafikleri, isimsiz oy dağılımı, maskelenmiş oy verenler akışı ve sondan başa açılan sonuç ekranı.',
  },
  nav: { home: 'Yarışma', live: 'Canlı oylama', results: 'Sonuçlar' },
  stage: { enter: 'Sahne modu (tam ekran)', exit: 'Sahne modundan çık' },
  wordmark: ['SESİN', 'RENGİ'],
  credit: (organiser: string) => `${organiser} katkılarıyla · Büyük final canlı yayını`,
  photos: 'Fotoğraflar: Unsplash',
  strip: {
    total: 'Toplam oy',
    finalists: 'Aday sayısı',
    champion: 'Şampiyon',
    lastMinute: 'Son 1 dakika',
    voters: 'Oy veren',
    turnout: 'Katılım',
    closesIn: 'Kapanışa',
    opensIn: 'Yeni tura',
    rate: 'Oran',
    votes: 'Toplam oy',
  },
  finalResults: 'Final sonuçları',
  common: {
    votingOpen: 'Oylama açık',
    votingClosed: 'Oylama kapandı',
    closesIn: 'Oylamanın kapanmasına',
    opensIn: 'Yeni tura',
    back: 'Yarışmaya dön',
    notFound: 'Bu yarışmacıyı bulamadık.',
    coach: 'Koç',
    years: 'yaşında',
    finalist: 'Finalist',
    wildcard: 'Jüri sürpriz kartı',
  },
  home: {
    eyebrow: '4. sezon · Büyük final',
    title: 'Dört ses. Tek gece. Tek kazanan.',
    lead: 'Final canlı yayında. İzleyiciler tur boyunca oy veriyor; dev ekranda katılım anbean görünüyor, hatlar kapanınca yerler dördüncülükten birinciliğe doğru açılıyor.',
    toLive: 'Canlı oylamayı izle',
    toResults: 'Sonuçları gör',
    finalistsTitle: 'Bu gecenin finalistleri',
    howTitle: 'Gece nasıl işliyor?',
    how: [
      {
        title: 'Dinle',
        body: 'Her finalist bir kez sahneye çıkıyor; tur boyunca tekrarlar yayınlanıyor.',
      },
      {
        title: 'İzleyici oy veriyor',
        body: 'Ekranda katılım ve isimsiz bir dağılım görünür, kimin önde olduğu asla.',
      },
      {
        title: 'Sonuç',
        body: 'Hatlar kapanınca yerler sondan başa doğru açılır.',
      },
    ],
    statusOpen: 'Oylama şu anda açık',
    statusClosed: 'Hatlar kapandı, sonuçlar hazır',
    votesSoFar: 'oy kullanıldı',
  },
  live: {
    heading: 'Canlı oylama',
    title: 'Hatlar açık',
    closedTitle: 'Hatlar kapandı',
    closedLead: 'Tüm oylar sayıldı. Sonuçlar hazır.',
    secret: 'Hatlar kapanana kadar kimsenin skoru gösterilmez',
    toResults: 'Sonuçları aç',
    round: 'Tur',
    flow: 'Oy akışı · son 6 dk',
    perMinute: 'oy/dk',
    rightNow: 'şu an',
    minute: 'Dakika',
    split: 'Şu ana kadarki dağılım',
    splitNote: 'İsimsiz: dilimler büyüklüğe göre sıralı, kimin hangisi olduğunu söylemez.',
    feed: 'Şu an oy verenler',
    voted: (count: number) => (count === 1 ? 'oy verdi' : `${count} oy verdi`),
    secondsAgo: (seconds: number) =>
      seconds < 5
        ? 'az önce'
        : seconds < 60
          ? `${seconds} sn önce`
          : `${Math.floor(seconds / 60)} dk önce`,
  },
  results: {
    heading: 'Final sonuçları',
    scenario: 'Gösterilecek sonuç',
    next: 'Sıradakini aç',
    all: 'Hepsini aç',
    reset: 'Baştan başla',
    tapToReveal: 'Açmak için dokun',
    waiting: 'Sırada',
    tie: 'Berabere',
    champion: 'ŞAMPİYON',
    place: (rank: number) => `${rank}. sıra`,
    revealed: (rank: number, names: string) => `${names}: ${rank}. sıra`,
    congrats: (names: string) => `Tebrikler, ${names}!`,
    demo: 'Demo sonuç',
  },
  contestant: {
    performance: 'Performans',
    song: 'Şarkı',
    credit: 'Söz ve müzik',
    genre: 'Tarz',
    key: 'Ton',
    tempo: 'Tempo',
    length: 'Süre',
    nowPlaying: 'Şimdi çalıyor',
    play: 'Önizlemeyi başlat',
    pause: 'Duraklat',
    visualNote: 'Yalnızca görsel bir önizleme; yayının sesi dahil değil.',
    about: 'Hakkında',
    others: 'Diğer finalistler',
    bpm: 'BPM',
    photoNote: 'Unsplash’ten temsili fotoğraf; kurgusal bir yarışmacıyı canlandırıyor.',
  },
  footer: {
    about:
      'Sesin Rengi, bu showcase için kurgulanmış bir şarkı yarışmasıdır. Yarışmacılar, oylar ve sonuçlar simülasyondur; fotoğraflar temsilidir.',
    rights: 'Tüm hakları saklıdır.',
  },
}

export const songContestCopy = { en, tr }
export type SongContestCopy = Copy
