const initialTeams = [
  { id: 1, name: "PRINCE SUPER KINGS", short: "PSK", color: "#1565C0", captain: "PRINCE PATEL", budget: 100000, spent: 0, players: [] },
  { id: 2, name: "DEV LEGENDS", short: "DVL", color: "#F9A825", captain: "DEV PATEL", budget: 100000, spent: 0, players: [] },
  { id: 3, name: "PRATIK KE PARAKRAMI", short: "PPK", color: "#B71C1C", captain: "PRATIK PATEL", budget: 100000, spent: 0, players: [] },
  { id: 4, name: "BHOLO NA BHAYANKAR", short: "BNB", color: "#4A148C", captain: "URVISH BHOLO", budget: 100000, spent: 0, players: [] },
  { id: 5, name: "BHOPA KA BHADAKA", short: "BNBD", color: "#0277BD", captain: "HARSHAD BHOPO", budget: 100000, spent: 0, players: [] },
  { id: 6, name: "DHAVAL KE DHURANDHAR", short: "DKD", color: "#E65100", captain: "DHAVAL PATEL", budget: 100000, spent: 0, players: [] },
  { id: 7, name: "RINKESH KE ROYAL", short: "RKR", color: "#C62828", captain: "RINKESH PATEL", budget: 100000, spent: 0, players: [] },
  { id: 8, name: "AK ROYALS", short: "AKR", color: "#AD1457", captain: "AKSHAY PATEL", budget: 100000, spent: 0, players: [] }
];

if (typeof window !== 'undefined') {
  window.initialTeams = initialTeams;
}
if (typeof module !== 'undefined') {
  module.exports = { initialTeams };
}
