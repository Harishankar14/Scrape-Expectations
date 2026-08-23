# 🔍 Scrape-Expectations

> A sleek, high-performance web scraper and price aggregator designed to search, compare, and organize product data seamlessly across multiple web sources.

---

## 🌟 Features

- **⚡ Real-Time Web Scraping:** Aggregate product prices and metadata from multiple online sources simultaneously using Bright Data.
- **🎯 Centered Search Interface:** Glassmorphic, modern UI powered by interactive loading states and glowing visual feedback.
- **📊 Dynamic Sorting & Filtering:** 
  - Sort products by **Price** (*Low to High* / *High to Low*).
  - Sort products by **Source** (*A to Z* / *Z to A*).
- **📋 Custom Product Lists:** Organize and save items into dedicated lists.
- **🎨 Modern Glassmorphism Design:** Dark-mode optimized theme featuring smooth CSS animations and responsive UI components.

---

## 🛠️ Tech Stack

- **Frontend:** React.js / Vite, CSS3 (Glassmorphism, Modern Flex/Grid Layouts)
- **Icons & Animation:** Lucide React, Custom CSS Animations
- **Data Scraping / Backend:** Bright Data, Node.js

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v16.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/RIP-Skillan/Scrape-Expectations.git](https://github.com/RIP-Skillan/Scrape-Expectations.git)
   cd Scrape-Expectations
2. **Install Dependencies:**
   ```bash
   npm install
3. **Start the Backend Server:**
   ```bash
   cd backend
   node server.js
4. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
5. **Open in Browser:**\
   Navigate to http://localhost:5173 (or the port specified in your terminal).

---
### 💻 Project Structure
```bash
  Scrape-Expectations/
  ├── backend/
  │   ├── server.js                       # Backend Server to Handle BRIGHT DATA API calls
  │   ├── package-lock.json
  │   └── package.json
  ├── frontend/
  │   ├── src/
  │   │   ├── components/
  │   │   │   ├── Dashboard.jsx           # The Search Result Dashboard where the Product Cards Appear
  │   │   │   ├── Navbar.jsx              # Navigation Bar to switch between the Search Page and MyLists Page
  │   │   │   ├── ProductCard.jsx         # Card component to display each product with price & links
  │   │   │   ├── NotFound.jsx            # Error Message Page in case of failures
  │   │   │   ├── SearchBar.jsx           # Search Bar for product search
  │   │   │   ├── SaveToListButton.jsx    # Button Component to save products to lists
  │   │   │   ├── SortDropdown.jsx        # Custom/Native product sorting menu
  │   │   │   └── CustomSortDropdown.css  # CSS styling for Sort Menu
  │   │   ├── pages/
  │   │   │   ├── ListsPage.jsx           # Page that contains all Lists and CRUD Operations for Lists
  │   │   │   └── ListDetailPage.jsx      # Page that shows a List's contents and CRUD operations for List items
  │   │   ├── hooks/
  │   │   │   ├── sortProducts.js         # Sorting Products logic
  │   │   │   └── useLists.js             # List CRUD and Storage Logic
  │   │   ├── App.jsx
  │   │   ├── App.css
  │   │   ├── index.css
  │   │   └── main.jsx
  │   ├── ...
  │   :
  │   └── README.md
  └── .gitignore
```
---
### 📝 Usage
1. **Search for Products**: Enter any product query into the main search bar and hit Search.
2. **Sort Results**: Use the Sort By dropdown on the right of the search bar to rearrange items by price or provider source.
3. **Manage Lists**: Save products into lists and sort items inside individual list views independently.

---
### 🤝 Contributing
Contributions, issues, and feature requests are welcome!

---