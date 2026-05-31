const initialPlayers = [
  // WICKET KEEPERS (1-8)
  { id: 1, name: "UPEN PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 2, name: "VED M PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 3, name: "RADHE PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 4, name: "BHARAT M PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 5, name: "HASMUKH LALO", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 6, name: "VED R PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 7, name: "YAGNIK PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 8, name: "NISH PATEL", role: "WICKET KEEPER", base: 2000, status: "available", soldTo: null, soldFor: null },

  // ALL ROUNDERS (9-69)
  { id: 9, name: "SUMANT PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 10, name: "JIGNESH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 11, name: "VRAJ R PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 12, name: "AYUSH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 13, name: "JATIN PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 14, name: "RINKAL PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 15, name: "JOY PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 16, name: "RUDRA A PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 17, name: "DHARMENDRA LALO", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 18, name: "MANTHAN PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 19, name: "ANSH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 20, name: "NITIN R PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 21, name: "MAHENDRA L PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 22, name: "MANAN PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 23, name: "MAHESH N PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 24, name: "JITENDRA N PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 25, name: "KRUNAL J PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 26, name: "PRANSHU J PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 27, name: "DHRUMIL PUPPY", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 28, name: "FENIL PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 29, name: "SUNIL D PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 30, name: "PURV S PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 31, name: "KULDIP PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 32, name: "RAHUL D PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 33, name: "GANGARAM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 34, name: "DAKSH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 35, name: "RAJ J PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 36, name: "VRAJ A PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 37, name: "DIVYANG S PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 38, name: "KRISH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 39, name: "YASH M PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 40, name: "OM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 41, name: "KRUNAL PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 42, name: "PURV P PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 43, name: "PARESH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 44, name: "NEVYA PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 45, name: "HIT LALO PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 46, name: "ARSH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 47, name: "RAJ PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 48, name: "SWAYAM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 49, name: "SHIV LALO PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 50, name: "ROSHAN PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 51, name: "VRAJ R PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 52, name: "ARAV PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 53, name: "URVISH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 54, name: "ASHISH PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 55, name: "SAURYA PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 56, name: "HARI PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 57, name: "SAHIL M PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 58, name: "JANSHU PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 59, name: "APURVA PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 60, name: "JOY D PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 61, name: "OM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 62, name: "HARSH V PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 63, name: "PATEL DAX", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 64, name: "NITIN DAYARAM PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 65, name: "PATEL SUNIL ISHWARBHAI", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 66, name: "PATEL JAKSH", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 67, name: "PARESH LYM", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 68, name: "HET PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null },
  { id: 69, name: "MANISH B PATEL", role: "ALL ROUNDER", base: 2000, status: "available", soldTo: null, soldFor: null }
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
