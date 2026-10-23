```markdown
# Playwright & TypeScript Automated Testing Suite (Assignment 3)

ชุดทดสอบอัตโนมัติ (Automated Test Suite) ด้วย **Playwright** และ **TypeScript** รองรับการทำงานแบบ Cross-Browser (Chromium, Firefox, WebKit) บนเว็บแอปพลิเคชัน 2 ระบบหลัก: **Coffee Cart** และ **SauceDemo**

---

## 🎯 Target Applications & Test Cases Summary

### 1. Coffee Cart (`https://seleniumbase.io/coffee/`)
เน้นการทดสอบฟังก์ชันการคำนวณราคารวม (Price Calculation):
* **`Coffee_001`**: Verify the total price once buy one coffee
  * สั่งซื้อ Cafe Latte 1 แก้ว และตรวจสอบยอดรวมราคาสินค้า ($16.00)
* **`Coffee_002`**: Verify the total price once buy three coffee
  * สั่งซื้อ Mocha, Flat White และ Cappuccino
  * จัดการ **Promo Modal** ป๊อปอัพโปรโมชั่นที่เด้งขัดจังหวะอัตโนมัติเมื่อสั่งซื้อครบ 3 แก้ว
  * ตรวจสอบยอดราคารวมสุทธิหลังระบบหักส่วนลดโปรโมชั่น ($45.00)
* **`Coffee_003`**: Verify the total price once buy the same kind of coffee 2 units
  * สั่งซื้อ Americano 1 แก้ว แล้วกดเพิ่มจำนวน (+) ในหน้า Cart เป็น 2 แก้ว
  * จัดการปัญหาราคารวมสุทธิ ($14.00) พร้อมแก้ปัญหา Strict Mode Violation และ Hidden Elements

### 2. SauceDemo (`https://www.saucedemo.com/`)
เน้นการทดสอบฟังก์ชันกระบวนการสั่งซื้อ (Checkout Flow):
* **Checkout Valid Input**: ทดสอบกรอกข้อมูลชื่อ-นามสกุล และรหัสไปรษณีย์ถูกต้องเพื่อไปยังหน้าสรุปยอด
* **Mandatory Field Validation**: ทดสอบเปิดแจ้งเตือนความผิดพลาดเมื่อเว้นช่องข้อมูลสำคัญไว้
* **Total Price Verification**: ตรวจสอบการคำนวณราคารวมราคาสินค้าและภาษี (Item Total + Tax)

---

## 🛠️ Key Technical Solved Issues
* **Promo Modal Interception**: ใช้ `waitFor` และ `try-catch` จัดการกดปิดป๊อปอัพ "It's your lucky day!" เมื่อสั่งสินค้าครบ 3 ชิ้นโดยไม่กระทบ Test Flow
* **Strict Mode Violation & Element Visibility**: แก้ปัญหา Selector ของปุ่มเพิ่มสินค้า (`+`) ที่ซ้ำกันใน DOM ด้วยการระบุ Pseudo-class `:visible` เลือกเฉพาะ Element ที่แสดงผลจริงบนหน้าจอ
* **Timing & Navigation Latency**: เพิ่ม `toHaveURL(/.*cart/)` เพื่อรอให้เปลี่ยนหน้าสมบูรณ์ ลดปัญหาทดสอบพังบน Firefox และ WebKit
* **Dynamic Price Mismatch**: ปรับค่า Assertion ให้ตรงกับตรรกะคำนวณส่วนลดจริงของระบบเว็บ ($45.00)

---

## 📁 Project Structure

```text
Assignment-3/
├── tests/
│   ├── coffeeshop.spec.ts      # Automated Test Script สำหรับ Coffee Cart
│   └── saucedemo.spec.ts       # Automated Test Script สำหรับ SauceDemo
├── coffeetest/                 # โฟลเดอร์จัดเก็บภาพ Screenshot ผลการทดสอบ
├── playwright.config.ts        # ไฟล์ตั้งค่าการรัน Playwright (Timeout, Browsers, Screenshot)
├── package.json                # Dependencies และ Scripts
└── README.md                   # เอกสารอธิบายโปรเจกต์

```

---

## 🚀 Getting Started

### 1. Prerequisites

* [Node.js](https://nodejs.org/) (Version 18.0 หรือสูงกว่า)

### 2. Installation

ติดตั้ง Dependencies และเบราว์เซอร์สำหรับ Playwright:

```bash
# ติดตั้ง Packages ที่จำเป็น
npm install

# ติดตั้ง Playwright Browsers (Chromium, Firefox, WebKit)
npx playwright install

```

---

## 🏃 Execution Commands

### รันการทดสอบทั้งหมด (Headless Mode)

```bash
npx playwright test

```

### รันการทดสอบแบบเปิดหน้าจอเบราว์เซอร์ (Headed Mode)

```bash
npx playwright test --headed

```

### รันการทดสอบเฉพาะไฟล์ Coffee Shop

```bash
npx playwright test tests/coffeeshop.spec.ts --headed

```

### เปิดดูรายงานผลการทดสอบ (HTML Test Report)

```bash
npx playwright show-report

```

```

---

### คำสั่งสำหรับบันทึกและส่งขึ้น GitHub ในครั้งเดียว

เปิด Terminal ใน VS Code แล้ววางคำสั่งนี้เพื่อบันทึกและดันขึ้น GitHub ทันที:

```bash
git add README.md
git commit -m "docs: add comprehensive README.md"
git push origin main

```
