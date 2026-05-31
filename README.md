# IPL Fantasy Auction Platform - Season 2025

A complete, premium, responsive web application for a multi-user IPL-style fantasy cricket auction, built using vanilla HTML, CSS, and Javascript.

## Features Included

- **Landing Page**: View total stats pills and overview cards of the 8 franchises with quick links.
- **Team Registration**: Pick franchises and assign names to the team owners.
- **Live Auction Room**:
  - **Live Bidding**: Search and load cricketers, start the timer, pause/resume, pass, and trigger SOLD/UNSOLD custom overlay screens.
  - **Interactive Bid Buttons**: Bid for teams with `+1K`, `+2K`, or `+5K` points with strict budget limits.
  - **Budget Tracker**: Progress indicators showing real-time budget balances.
  - **Bid Log**: Displays the list of last 10 bids in the auction.
  - **Squads View**: List of players bought by each franchise.
  - **Players Pool**: View all 62 cricketers with search and status filters.
- **Owner Dashboard**: Roster breakdown, statistics widgets, role counts, and custom CSS spending comparison charts.
- **Live Points Table**: Automated playoff highlighting, sorting, and manual updates.
- **Admin Panel**: Password protected editor (`admin123`) to update points, inspect statistics, and reset database states.

## How to Run & Test

1. Since the application is built using standard client-side technologies, you can open `index.html` directly in your browser.
2. For the best experience (loading styles, fonts, and states correctly), run a local web server in this directory:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000` in your web browser.

## Credentials

- **Admin Password**: `admin123`
