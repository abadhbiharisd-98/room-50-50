# RoomMates – Expense Splitter App 🏠💸

**RoomMates** ek professional Android application hai jo do roommates ke beech shared monthly expenses ko track, calculate, split (50/50) aur settle karne ke liye banaya gaya hai.

---

## 🚀 Quick Start (Phase 1 Testing)

Aap apne Android phone me **Expo Go** app open karke is app ko turant live test kar sakte hain:

### Step 1: Terminal me frontend directory me jayein
```powershell
cd frontend
```

### Step 2: Expo Development Server start karein
```powershell
npx.cmd expo start
```
*(Windows PowerShell me hamesha `npx.cmd` use karein)*

### Step 3: Android Phone me run karein
1. Apne Android phone me Google Play Store se **Expo Go** install karein.
2. Ensure karein ki aapka laptop aur mobile same Wi-Fi se connected hain.
3. Expo Go app se terminal me aane wala **QR Code scan karein**.
4. App aapke phone me turant load ho jayegi!

---

## 📁 Project Architecture & Folder Structure

```
Room 50-50/
├── frontend/                     # React Native + Expo Mobile Application
│   ├── assets/                   # App Icons, Splash Screen, Images
│   ├── src/
│   │   ├── components/           # Reusable UI Components
│   │   │   ├── BalanceCard.js         # Settlement Card (Who Owes Whom)
│   │   │   ├── ContributionCard.js    # Roommate A vs B Split Comparison
│   │   │   ├── CategorySummary.js     # Category-wise Spending Bars
│   │   │   ├── ExpenseCard.js         # Individual Expense Item Card
│   │   │   ├── AddExpenseModal.js     # Add Expense Form with Validation
│   │   │   └── ExpenseDetailsModal.js # View/Delete Expense Details Modal
│   │   ├── constants/
│   │   │   ├── categories.js     # 11 Official Categories (Rent, Grocery, etc.)
│   │   │   └── theme.js          # Navy Blue, White, & Emerald Green Theme
│   │   ├── screens/
│   │   │   └── DashboardScreen.js # Main Professional Dashboard
│   │   └── utils/
│   │       ├── calculations.js   # Integer Paise Expense Calculation Engine
│   │       └── storage.js        # Offline Persistent Storage (AsyncStorage)
│   ├── App.js                    # Root Application Component
│   ├── app.json                  # Expo Android Configuration (com.roommates.expensesplitter)
│   └── package.json
│
├── backend/                      # Node.js + Express + MongoDB + Socket.IO (Phase 2)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   ├── server.js
│   └── .env.example
│
└── README.md
```

---

## 🧮 Expense Calculation System (Integer Paise Engine)

Hamara calculation engine `src/utils/calculations.js` floating-point rounding errors ko rokne ke liye sabhi calculations ko **Integer Paise** me karta hai (1 Rupee = 100 Paise).

### Example Test (Master Prompt Scenario):
- **Total Monthly Expenses**: ₹15,000
- **Roommate A Paid**: ₹10,000
- **Roommate B Paid**: ₹5,000
- **Each Person's Share (50%)**: ₹7,500
- **Net Calculation**:
  - Roommate A Net = ₹10,000 - ₹7,500 = **+₹2,500** (Creditor)
  - Roommate B Net = ₹5,000 - ₹7,500 = **-₹2,500** (Debtor)
- **Result**: `Roommate B owes Roommate A ₹2,500`

---

## 🗓️ Phase-wise Development Plan

- [x] **Phase 1: Frontend Professional Dashboard & Calculation Engine** (Completed)
- [ ] **Phase 2: Node.js + Express Backend & MongoDB Atlas Models**
- [ ] **Phase 3: JWT Authentication & 2-Member Room System**
- [ ] **Phase 4: Real-time Socket.IO Synchronization between 2 Phones**
- [ ] **Phase 5: Settlement Recording & Monthly History Reports**
- [ ] **Phase 6: Google Play Store EAS Build (.aab) & Production Release**

