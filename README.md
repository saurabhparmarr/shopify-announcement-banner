# Shopify Announcement Banner App

A Shopify app built with MERN stack that allows merchants to display a custom announcement banner on their storefront.

## 🚀 Features

- **Admin Dashboard** — Type custom announcement text (e.g., "Sale 50% Off") and save it
- **MongoDB** — Stores announcement text with timestamp for audit history
- **Shopify Metafields** — Syncs text to Shopify via Admin API
- **Theme App Extension** — Displays live banner on storefront using Liquid

## 🛠️ Tech Stack

- **Frontend:** React.js, Shopify Polaris
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Platform:** Shopify App + Theme App Extension

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Shopify Partner account
- Shopify CLI installed

```bash
npm install -g @shopify/cli
```

### 1. Clone the Repository

```bash
git clone https://github.com/saurabhparmarr/shopify-announcement-banner.git
cd shopify-announcement-banner
```

### 2. Install Dependencies

```bash
cd announcement-banner-app
npm install
```

### 3. Environment Variables

Create a `.env` file in `announcement-banner-app/`:

```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the App

```bash
shopify app dev
```

Then press `p` to open the app preview in your Shopify store.

## 📁 Project Structure

```
shopify-task/
├── announcement-banner-app/     # Main Shopify app (React + Node)
│   ├── app/                     # React frontend (Polaris UI)
│   ├── extensions/              # Theme App Extension (Liquid)
│   └── server/                  # Express backend + MongoDB
└── stable-customer-app/         # Storefront preview
```

## 🔄 How It Works

```
Admin types text → Clicks Save
        ↓
Backend saves to MongoDB (with timestamp)
        ↓
Backend syncs to Shopify Metafield (my_app.announcement)
        ↓
Theme Extension reads metafield via Liquid
        ↓
Banner displays live on Storefront
```

## 📬 Contact

**Saurabh Singh**  
saurabhsinpar@gmail.com  
[GitHub](https://github.com/saurabhparmarr)