# 🍽️ Gen-AI Enhanced Smart Recipe Finder & Nutrition Recommendation System

## 📌 Overview
The **Gen-AI Enhanced Smart Recipe Finder** is a full-stack web application that helps users discover, analyze, and personalize recipes intelligently.  
It combines traditional recipe search functionality with **Generative AI (Gen-AI)** to provide context-aware, personalized, and natural language–based recipe recommendations.

The system retains reliable filter-based search while using Gen-AI as an **enhancement layer**, not a replacement.

---

## 🎯 Key Features

### ✅ Traditional Recipe Finder
- Search recipes by:
  - Recipe name
  - Ingredients
  - Category
- Filter recipes by:
  - Diet type (Vegan, High-Protein, Low-Sugar, Gluten-Free)
  - Cooking time
  - Difficulty level
- Allergy-based filtering (with / without ingredients)
- Trending & popular recipes
- Detailed nutrition information

---

### 🤖 Gen-AI Powered Recipe Recommendations
- Accepts natural language queries
- Understands user intent and constraints
- Combines multiple conditions intelligently

**Example queries:**
- “Suggest high-protein vegetarian dinner under 30 minutes”
- “Healthy snacks for kids without sugar”
- “Recipes using tomato and onion, no garlic”

---

### 🥗 Nutrition Analyzer
- Calories
- Protein
- Carbohydrates
- Fats
- Sugar
- Fiber
- AI-generated human-friendly nutrition explanation

---

### 👤 Personalization & Community
- Diet-based personalization
- Allergy-safe recipe suggestions
- Smart shopping list generation
- Recipe upload, rating & reviews
- Kids & age-group based recipes
- Food & health news with AI summarization

---

## 🧠 Core Concept
This project follows a **hybrid architecture**:

- **Structured searches** → Handled by Recipe APIs & Database  
- **Natural language searches** → Handled by Gen-AI  
- **Final results** → Fetched from APIs and displayed to users  

👉 Gen-AI enhances the system **without replacing traditional logic**.

---

## 🏗️ System Architecture

React Frontend

↓

ASP.NET Core Web API

↓

Traditional Recipe Flow → Recipe & Nutrition APIs

OR

Gen-AI Layer → OpenAI / Gemini / Azure OpenAI

↓

Microsoft SQL Server

---

## 🔁 Application Workflow
1. User logs into the system
2. User chooses:
   - Structured filters  
   - OR natural language query
3. Backend decides the flow:
   - Traditional Recipe Finder
   - OR Gen-AI Enhanced Flow
4. Recipes & nutrition data are fetched
5. Results and user activity are stored
6. Final output is displayed to the user

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Axios

### Backend
- ASP.NET Core Web API
- RESTful architecture

### Database
- Microsoft SQL Server

### Gen-AI
- OpenAI / Gemini / Azure OpenAI

### External APIs
- Edamam (Recipe & Nutrition)
- TheMealDB (Recipe Search)
- Open Food Facts (Nutrition Data)
- USDA FoodData Central (Nutrition Database)

### Deployment
- Azure
- Netlify
- AWS

---

## 🗄️ Database Design
- Users
- Recipes
- Ingredients
- Recipe_Ingredients (Junction Table)
- Nutrition_Info
- Reviews
- Favorites
- Shopping_List
- AI_Search_History

---

## 🚀 Future Enhancements
- Image-based ingredient detection
- Personalized meal planning
- Mobile application
- Health goal–based recommendations
- Voice-based cooking assistant

---

## 📝 Conclusion
The **Gen-AI Enhanced Smart Recipe Finder** demonstrates a real-world, scalable full-stack application that integrates modern AI capabilities with reliable traditional systems.  
It highlights strong skills in frontend development, backend APIs, database design, third-party API integration, and Generative AI.

---

