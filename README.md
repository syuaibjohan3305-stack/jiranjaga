# JiranJaga

**Jiran prihatin, warga emas selamat.** *(Caring neighbours, safe seniors.)*

### ▶ Try the live demo: https://syuaibjohan3305-stack.github.io/jiranjaga/

JiranJaga is a daily **"Saya OK"** check-in for seniors who live alone in a township. If a senior misses their check-in, help comes from a **neighbour first**, then the **township guardhouse**, then the **family**, all within an hour.

Built as a prototype for the Sime Darby Property University Hackathon 2026 ("Township of Tomorrow"), theme **People → Neighbourhood Connection**.

## The problem

More Malaysian seniors are living alone, and when one falls or falls ill at home, nobody may notice for hours or even days. Families often live far away, and neighbours may not know each other.

## How it works

| Time | What happens |
|---|---|
| 9:00 am | The senior gets a WhatsApp reminder and taps **"Saya OK"** |
| 10:00 am, no reply | A volunteer **neighbour buddy** is alerted and goes to check |
| 10:20 am, buddy hasn't responded | The **township guardhouse** is alerted and can send a guard |
| 10:40 am, still unresolved | The **family** is alerted, with one-tap calling |
| Any time | **SOS** (two taps to confirm) alerts everyone at once |

Anyone in the chain can confirm the senior is safe, which clears the alert for everyone.

## The five screens

| Screen | Who | What it shows |
|---|---|---|
| **Home** | Presenter | The idea, live status, the demo clock, and links to each screen |
| **Senior** | Mak Cik Rosnah, 74 | WhatsApp-style chat with big **Saya OK** and **SOS** buttons |
| **Neighbour buddy** | Kak Aina, two doors away | Alert card with **I'll check**, **She's safe** and **Call** |
| **Guardhouse** | Pondok Pengawal Utama | Alerts, **Dispatch guard**, **Mark safe**, and a residents table |
| **Family** | Farah, daughter in Penang | Today's status, a timeline of what happened, and call buttons |

## Running the demo

You need [Node.js](https://nodejs.org) installed.

```bash
npm install
npm run dev
```

Then open the address it prints (for example `http://localhost:5173`).

**Demo tips:**
1. Open the Senior, Neighbour, Guardhouse and Family screens in **separate browser tabs**. They update live together.
2. On the home page, use the **demo clock** (+5 min, +30 min) to move through the morning.
3. Don't tap "Saya OK" and fast-forward past 10:00, 10:20 and 10:40 to watch the alert move along the chain.
4. Use **Reset to 8:55 am** to start again.

## What's simulated

This is a prototype:
- WhatsApp messages are shown inside the app; a real pilot would use the WhatsApp Business API.
- The demo clock replaces real time so the whole morning can be shown in a minute.
- Data is saved in the browser (localStorage), not on a server, and syncs between tabs on the same device.
- All names, addresses and phone numbers are fictional.

## Project structure

```
src/
├── main.jsx            starts the app
├── App.jsx             picks which screen to show (#/senior, #/guard, ...)
├── index.css           loads Tailwind CSS
├── lib/store.js        shared data, the demo clock and the alert rules
├── components/
│   ├── PhoneFrame.jsx  phone-shaped frame for the mobile screens
│   └── DemoClock.jsx   presenter controls for the demo clock
└── screens/
    ├── Home.jsx
    ├── Senior.jsx
    ├── Neighbour.jsx
    ├── Guardhouse.jsx
    └── Family.jsx
```

## Built with

React, Vite and Tailwind CSS.
