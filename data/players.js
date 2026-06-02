const initialPlayers = [
  // WICKET KEEPERS (1-8)
  { id: 1, name: "VED M PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 2, name: "RADHE PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 3, name: "BHARAT M PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 4, name: "HASMUKH LALO", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 5, name: "YAGNIK PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 6, name: "NISH PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 7, name: "JIGNESH PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 8, name: "AYUSH PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },

  // ALL ROUNDERS (9-62)
  { id: 9, name: "VRAJ R PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 10, name: "JATIN PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 11, name: "JOY PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 12, name: "RUDRA A PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 13, name: "DHARMENDRA LALO", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 14, name: "MANTHAN PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 15, name: "ANSH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 16, name: "NITIN R PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 17, name: "MAHENDRA L PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 18, name: "MANAN PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 19, name: "MAHESH N PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 20, name: "JITENDRA N PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 21, name: "KRUNAL J PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 22, name: "PRANSHU J PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 23, name: "DHRUMIL PUPPY", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 24, name: "FENIL PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 25, name: "SUNIL D PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 26, name: "PURV S PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 27, name: "KULDIP PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 28, name: "GANGARAM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 29, name: "DAKSH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 30, name: "RAJ J PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 31, name: "DIVYANG S PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 32, name: "KRISH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 33, name: "YASH M PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 34, name: "OM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 35, name: "KRUNAL PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 36, name: "PURV P PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 37, name: "PARESH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 38, name: "NEVYA PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 39, name: "HIT LALO PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 40, name: "RAJ PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 41, name: "SWAYAM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 42, name: "SHIV LALO PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 43, name: "ROSHAN PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 44, name: "VRAJ R PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 45, name: "ARAV PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 46, name: "URVISH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 47, name: "ASHISH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 48, name: "SAURYA PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 49, name: "HARI PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 50, name: "SAHIL M PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 51, name: "JANSHU PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 52, name: "APURVA PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 53, name: "JOY D PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 54, name: "OM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 55, name: "PATEL DAX", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 56, name: "NITIN DAYARAM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 57, name: "PATEL SUNIL ISHWARBHAI", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 58, name: "PATEL JAKSH", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 59, name: "PARESH LYM", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 60, name: "HET PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 61, name: "MANISH B PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 62, name: "BHARAT L PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null }
];

// Helper to compute initials avatar dynamically: first letters of each word, max 3 chars
initialPlayers.forEach(p => {
  p.avatar = p.name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
});

if (typeof window !== 'undefined') {
  window.initialPlayers = initialPlayers;
}
if (typeof module !== 'undefined') {
  module.exports = initialPlayers;
}
