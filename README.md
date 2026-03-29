# 📉 AdilÖde (FairPay)
**Inflation-Adjusted Subscription Splitter for Fair Group Payments**

AdilÖde is a modern web application designed to solve the "fairness" problem in shared subscriptions (Spotify, YouTube Premium) during high-inflation periods. It calculates the real purchasing power of past payments based on inflation/exchange rate differences, ensuring that the person who paid the bill doesn't lose value over time.

[Live Demo](https://adilode.netlify.app/)

---

## 🚀 Key Features
* **Inflation Adjustment:** Automatically calculates the current "real" value of an old payment based on a specific date.
* **Fair Splitting:** Divides the adjusted total by the number of members to find the accurate per-person debt.
* **WhatsApp Integration:** Generates a ready-to-send message template including calculation details and payment info.
* **Optional IBAN Attachment:** Quickly include payment details in the shared report for seamless collection.

## 🛠️ Tech Stack
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Frontend:** [React.js](https://reactjs.org/) / [Next.js](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Hosting:** [Netlify](https://www.netlify.com/)

## 📖 How It Works
1.  **Input Data:** Enter the original subscription price and the date the payment was made.
2.  **Calculation:** The system fetches/calculates the inflation difference between the payment date and today.
3.  **Result:** View the adjusted "fair" total and the amount each friend owes.
4.  **Share:** Click "Send via WhatsApp" to notify your group with a professional summary.

## 🧠 Development Philosophy
This project was developed with an 'App-preneur' mindset, leveraging **Claude** and **Gemini** to efficiently architect the business logic and UI components. It serves as a capstone project for applying real-world financial calculations to a functional web product.

---
*Developed by **Zeynep Dursun** - 2026*
