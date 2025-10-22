# 🍽️ Bengal Bay Restaurant - Frequently Asked Questions (FAQ)

## Table of Contents
1. [General Questions](#general-questions)
2. [Account & Authentication](#account--authentication)
3. [Menu & Ordering](#menu--ordering)
4. [Cart & Checkout](#cart--checkout)
5. [Payment Methods](#payment-methods)
6. [Cash on Delivery (COD)](#cash-on-delivery-cod)
7. [Order Tracking](#order-tracking)
8. [Delivery & Verification](#delivery--verification)
9. [Admin Dashboard](#admin-dashboard)
10. [Technical & Development](#technical--development)
11. [Troubleshooting](#troubleshooting)

---

## General Questions

### What is Bengal Bay Restaurant?
Bengal Bay is a full-stack e-commerce restaurant platform offering authentic Indian cuisine with features like online ordering, multiple payment options, real-time order tracking, and secure delivery verification.

### What technologies power Bengal Bay?
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Express.js, Node.js
- **Database**: Firebase Firestore, Google Sheets integration
- **Payment**: Razorpay integration
- **Authentication**: Firebase Authentication
- **Deployment**: Vercel (Frontend), Render (Backend)

### Is Bengal Bay mobile-friendly?
Yes! The entire platform is fully responsive and optimized for mobile devices with touch-friendly interfaces and mobile-specific UI enhancements.

### What are the main features?
- Browse menu with 50+ dishes across multiple categories
- User authentication (login/register)
- Shopping cart with real-time updates
- Multiple payment options (Razorpay & Cash on Delivery)
- Order tracking with live status updates
- COD OTP verification system
- Admin dashboard for order/menu management
- Email confirmations with detailed billing
- Google Sheets order logging

---

## Account & Authentication

### Do I need an account to order?
No, you can browse the menu and place orders as a guest. However, creating an account allows you to:
- Track your order history
- Save delivery addresses
- Receive personalized recommendations
- Access faster checkout

### How do I create an account?
1. Click "Login" in the navigation bar
2. Select "Register" or "Sign Up"
3. Enter your email and password
4. Verify your email (if required)
5. Complete your profile

### What authentication methods are supported?
- Email/Password authentication via Firebase
- Guest checkout (no account required)

### How do I reset my password?
1. Go to the login page
2. Click "Forgot Password"
3. Enter your registered email
4. Check your email for reset instructions
5. Follow the link to create a new password

### Is my personal information secure?
Yes! We use Firebase Authentication with industry-standard encryption. Your payment information is processed securely through Razorpay's PCI-DSS compliant gateway.

---

## Menu & Ordering

### What types of dishes are available?
Our menu includes:
- **Vegetarian**: Paneer Tikka Masala, Dal Makhani, Palak Paneer, Malai Kofta
- **Non-Vegetarian**: Butter Chicken, Tandoori Chicken, Lamb Rogan Josh, Fish Curry
- **Biryani**: Chicken, Mutton, Hyderabadi, Prawn, Egg, Lucknowi
- **Breads**: Garlic Naan, Butter Naan, Cheese Naan, Laccha Paratha
- **Starters**: Paneer Tikka, Samosa, Onion Bhaji, Chicken Pakora
- **Drinks**: Mango Lassi, Masala Chai, Fresh Lime Soda, Rose Milk
- **Desserts**: Gulab Jamun, Rasmalai, Kheer, Kulfi, Jalebi

### How do I filter menu items?
Use the category filters at the top of the menu page:
- All Items
- Vegetarian
- Non-Vegetarian
- Biryani
- Breads
- Starters
- Drinks
- Desserts

### Can I see dish ratings?
Yes! Each dish displays a star rating (out of 5) based on customer reviews.

### What does "Special" mean?
Dishes marked as "Special" are chef's recommendations or signature items with exceptional ratings.

### Are prices inclusive of taxes?
No, prices shown are base prices. A 5% tax and ₹9 protect fee are added at checkout.

---

## Cart & Checkout

### How do I add items to my cart?
1. Browse the menu
2. Click "Add to Cart" on any dish
3. Adjust quantity using +/- buttons
4. View cart summary in the top-right corner

### Can I modify my cart?
Yes! You can:
- Increase/decrease quantities
- Remove items completely
- Clear entire cart
- Continue shopping and add more items

### What is the "Buy Now" feature?
"Buy Now" allows you to purchase a single item immediately, bypassing the cart and going straight to checkout.

### How long do items stay in my cart?
Cart items are stored in your browser's local storage and persist until you clear them or complete the order.

### What is the minimum order value?
There is no minimum order value. You can order as little or as much as you want.

### Are there delivery charges?
No! We offer **FREE delivery** on all orders.

---

## Payment Methods

### What payment methods are accepted?
1. **Online Payment (Razorpay)**:
   - Credit/Debit Cards (Visa, Mastercard, Amex, RuPay)
   - UPI (Google Pay, PhonePe, Paytm)
   - Net Banking (all major banks)
   - Digital Wallets (Paytm, Mobikwik, etc.)

2. **Cash on Delivery (COD)**:
   - Pay with cash when your order arrives
   - Secure OTP verification system

### Is online payment secure?
Absolutely! We use Razorpay, a PCI-DSS Level 1 certified payment gateway with:
- End-to-end encryption
- 3D Secure authentication
- Fraud detection systems
- No storage of card details

### What happens if my payment fails?
If your online payment fails:
1. You'll receive an error message
2. No amount will be deducted
3. You can retry the payment
4. Or switch to Cash on Delivery

### Can I get a refund?
Refund policies depend on the payment method:
- **Online Payment**: Refunds processed within 5-7 business days
- **COD**: No refund needed as payment is made on delivery

### Do you store my payment information?
No! Payment details are processed directly by Razorpay. We never store or have access to your card/bank information.

---

## Cash on Delivery (COD)

### How does Cash on Delivery work?
1. Select "Cash on Delivery" at checkout
2. Confirm your order
3. Receive a unique 7-digit OTP
4. Keep exact cash ready
5. Show OTP to delivery person
6. Delivery person verifies OTP
7. Payment completed!

### What is the COD OTP system?
The OTP (One-Time Password) is a security feature that:
- Ensures order authenticity
- Prevents fraud
- Confirms delivery to the right person
- Protects both customer and restaurant

### Where do I find my COD OTP?
Your OTP is displayed:
1. On the order confirmation screen (take a screenshot!)
2. In your confirmation email
3. On the order tracking page

### What if I lose my OTP?
If you lose your OTP:
1. Check your confirmation email
2. Visit the order tracking page with your Order ID
3. Contact customer support with your Order ID

### Do I need exact change for COD?
Yes, please keep exact cash ready for the total amount shown on your order confirmation.

### Can the delivery person verify my OTP?
Yes! Delivery personnel have access to a verification portal where they can:
1. Enter your Order ID
2. View order details
3. Enter the OTP you provide
4. Complete the payment verification

### What happens after OTP verification?
Once verified:
- Order status changes to "Delivered & Paid"
- Payment marked as "Completed"
- Delivery timestamp recorded
- You receive a completion notification

---

## Order Tracking

### How do I track my order?
1. After placing an order, you'll receive an Order ID
2. Visit the "Track Order" page
3. Enter your Order ID
4. View real-time order status

### What order statuses are there?
- **Order Placed**: Order confirmed and logged
- **Preparing**: Kitchen is preparing your food
- **Out for Delivery**: Order is on the way
- **Delivered**: Order successfully delivered

### How long does delivery take?
Estimated delivery time: **30-45 minutes** from order confirmation.

### Can I track my order in real-time?
Yes! The tracking page auto-refreshes every 30 seconds to show the latest status.

### Will I receive order notifications?
Yes! You'll receive:
- Order confirmation email with full details
- Order ID for tracking
- COD OTP (if applicable)
- Delivery updates

### What if my order is delayed?
If your order is delayed:
1. Check the tracking page for updates
2. Contact customer support with your Order ID
3. We'll investigate and provide an update

---

## Delivery & Verification

### What is the Delivery Verification Portal?
A dedicated portal for delivery personnel to:
- Look up orders by Order ID
- View customer details and delivery address
- Verify COD OTP
- Complete payment confirmation

### How does the delivery person access my order?
Delivery personnel:
1. Enter your Order ID in their portal
2. View order details (name, address, amount)
3. Request your OTP
4. Enter OTP for verification
5. Complete delivery

### What information does the delivery person see?
They can see:
- Order ID
- Customer name and phone
- Delivery address
- Total amount
- Order items
- Payment status

### Is the OTP verification mandatory for COD?
Yes! OTP verification is mandatory for all COD orders to ensure:
- Secure delivery
- Payment confirmation
- Order authenticity
- Customer protection

### What if the delivery person doesn't ask for OTP?
Always insist on OTP verification! If they don't ask:
1. Show your OTP proactively
2. Ensure they verify it in their system
3. Don't hand over payment until verified

---

## Admin Dashboard

### What is the Admin Dashboard?
A comprehensive management portal for restaurant staff to:
- View all orders in real-time
- Manage menu items
- Track order status
- Monitor payments
- Access Google Sheets logs

### What features are in the Admin Dashboard?
1. **Order Management**:
   - View all orders
   - Filter by status/payment method
   - Update order status
   - View customer details

2. **Menu Management**:
   - Add new dishes
   - Edit existing items
   - Update prices
   - Manage categories
   - Toggle special items

3. **Analytics**:
   - Total orders
   - Revenue tracking
   - Popular items
   - Payment method distribution

### How do I access the Admin Dashboard?
Admin access is restricted to authorized personnel only. Contact the system administrator for credentials.

### Is order data backed up?
Yes! All orders are:
- Stored in Firebase Firestore
- Logged to Google Sheets
- Backed up in local storage
- Synced across systems

---

## Technical & Development

### What is the project structure?
```
nil-s-kitchen/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── lib/            # Utilities & services
│   ├── hooks/          # Custom hooks
│   └── utils/          # Helper functions
├── backend/
│   └── server/         # Express.js backend
├── public/             # Static assets
└── dist/               # Production build
```

### How is the backend structured?
The Express.js backend provides:
- `/api/create-razorpay-order` - Create payment orders
- `/api/verify-payment` - Verify Razorpay payments
- `/api/log-order` - Log orders to Google Sheets
- `/api/verify-cod-otp` - Verify COD OTP
- `/api/order/:orderId` - Get order details
- `/api/track-order/:orderId` - Track order status
- `/api/orders` - Get all orders (admin)

### What environment variables are needed?
**Frontend (.env)**:
```
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_BACKEND_URL=your_backend_url
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

**Backend (.env)**:
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_SHEETS_PRIVATE_KEY=your_sheets_key
GOOGLE_SHEETS_CLIENT_EMAIL=your_sheets_email
GOOGLE_SHEET_ID=your_sheet_id
PORT=5000
```

### How do I run the project locally?
**Frontend**:
```bash
npm install
npm run dev
```

**Backend**:
```bash
cd backend/server
npm install
node server.js
```

### How do I build for production?
```bash
npm run build
```
This creates an optimized production build in the `dist/` folder.

### What is the Google Sheets integration?
Orders are automatically logged to Google Sheets with:
- Order ID, customer details
- Items ordered, quantities, prices
- Payment method and status
- Delivery address
- COD OTP (if applicable)
- Timestamps and verification status

### How do I deploy the application?
**Frontend (Vercel)**:
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

**Backend (Render)**:
1. Create new Web Service
2. Connect repository
3. Set environment variables
4. Deploy

---

## Troubleshooting

### My cart is empty after refresh
Cart data is stored in browser local storage. If it's empty:
- Check if browser storage is enabled
- Ensure cookies are not blocked
- Try adding items again

### Payment gateway not loading
If Razorpay doesn't load:
1. Check your internet connection
2. Disable ad blockers
3. Try a different browser
4. Clear browser cache
5. Refresh the page

### Order confirmation email not received
If you don't receive confirmation:
1. Check spam/junk folder
2. Verify email address is correct
3. Wait 5-10 minutes for delivery
4. Check order tracking page with Order ID

### OTP not showing for COD order
If OTP is missing:
1. Check the order confirmation screen
2. Look in your confirmation email
3. Visit order tracking page
4. Contact support with Order ID

### Order tracking not working
If tracking fails:
1. Verify Order ID is correct
2. Check internet connection
3. Wait a few minutes and retry
4. Clear browser cache

### Backend API not responding
If API calls fail:
1. Check backend server status
2. Verify BACKEND_URL environment variable
3. Check network connectivity
4. Review browser console for errors

### Google Sheets not logging orders
If orders aren't logged:
1. Verify Google Sheets credentials
2. Check API permissions
3. Review backend logs
4. Ensure sheet structure is correct

### Admin dashboard not accessible
If you can't access admin:
1. Verify you have admin credentials
2. Check authentication status
3. Clear browser cache
4. Contact system administrator

### Mobile UI issues
If mobile interface has problems:
1. Update to latest browser version
2. Clear browser cache
3. Check screen orientation
4. Try different mobile browser

### Performance issues
If the app is slow:
1. Clear browser cache
2. Check internet speed
3. Close unnecessary tabs
4. Disable browser extensions
5. Try incognito mode

---

## Contact & Support

### How do I contact customer support?
- **Email**: support@bengalbay.com
- **Phone**: +91 82505 65455
- **Hours**: 9 AM - 11 PM (IST)

### Where can I report bugs?
Report technical issues:
1. GitHub Issues (for developers)
2. Email: support@bengalbay.com
3. Include: Order ID, browser, error message

### How do I provide feedback?
We welcome feedback! Contact us via:
- Email with subject "Feedback"
- Social media channels
- In-app feedback form (coming soon)

### Are there any social media channels?
Follow us for updates:
- Facebook: @BengalBayRestaurant
- Instagram: @bengalbay_official
- Twitter: @BengalBayFood

---

## Privacy & Security

### How is my data protected?
- End-to-end encryption for payments
- Secure Firebase authentication
- HTTPS/SSL for all connections
- No storage of sensitive payment data
- Regular security audits

### What data do you collect?
We collect:
- Name, email, phone (for orders)
- Delivery address
- Order history
- Payment method preference
- Device/browser information (analytics)

### Do you share my data?
No! Your data is:
- Never sold to third parties
- Only used for order processing
- Shared with payment gateway (Razorpay) securely
- Protected under privacy policy

### Can I delete my account?
Yes! Contact support to:
- Delete your account
- Remove personal data
- Export order history

### Where can I read the Privacy Policy?
Visit: `/privacy-policy` on our website

---

## Additional Resources

### Documentation
- [README.md](README.md) - Project overview
- [SETUP.md](SETUP.md) - Setup instructions
- [COD_ENHANCEMENT_COMPLETE.md](COD_ENHANCEMENT_COMPLETE.md) - COD feature details

### Developer Resources
- [GitHub Repository](https://github.com/nil1902/nil-s-kitchen)
- [API Documentation](backend/server/server.js)
- [Component Library](src/components/)

### Deployment Guides
- [Vercel Deployment](VERCEL_DEPLOYMENT.md)
- [Render Backend Setup](MARKET_READY_DEPLOYMENT.md)

---

## Version History

### Current Version: 1.0.0
- Full e-commerce functionality
- Razorpay & COD payment integration
- OTP verification system
- Order tracking
- Admin dashboard
- Google Sheets logging
- Email confirmations
- Mobile optimization

### Upcoming Features
- User reviews and ratings
- Loyalty program
- Promo codes and discounts
- Multiple delivery addresses
- Order scheduling
- Live chat support
- Push notifications

---

**Last Updated**: January 2025  
**Maintained By**: Bengal Bay Development Team  
**License**: MIT

---

*For more information, visit our website or contact support.*
