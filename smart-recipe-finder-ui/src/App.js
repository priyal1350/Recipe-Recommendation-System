import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RecipeSearch from "./pages/RecipeSearch";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import RecipeDetails from "./pages/RecipeDetails";
import NutritionAnalyzer from "./pages/NutritionAnalyzer";
import AIMealPlanner from "./pages/AIMealPlanner";
import ShoppingList from "./pages/ShoppingList";
import FilteredRecipes from "./pages/FilteredRecipes";
import Register from "./pages/Register";
import SearchRecipes from "./pages/SearchRecipes";
import FoodNews from "./pages/FoodNews";
import RecipesByIngredients from "./pages/RecipesByIngredients";
import AllergyPage from "./pages/AllergyPage";
import SafeRecipes from "./pages/SafeRecipes";
// ✅ JWT-based auth check (NOT userId)
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // true if token exists
};

// ✅ Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

        <Route path="/search" element={<PrivateRoute><RecipeSearch /></PrivateRoute>} />
        <Route path="/recipe/:id" element={<PrivateRoute><RecipeDetails /></PrivateRoute>} />
        <Route path="/ai-meal-planner" element={<PrivateRoute><AIMealPlanner /></PrivateRoute>} />
        <Route path="/shopping" element={<PrivateRoute><ShoppingList /></PrivateRoute>} />
        <Route path="/nutrition" element={<PrivateRoute><NutritionAnalyzer /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
        <Route path="/filtered-recipes" element={<PrivateRoute><FilteredRecipes /></PrivateRoute>} />
        <Route path="/search-recipes" element={<PrivateRoute><SearchRecipes /></PrivateRoute>} />
        <Route path="/cook-with-ingredients" element={<PrivateRoute><RecipesByIngredients /></PrivateRoute>} />
        <Route path="/food-news" element={<PrivateRoute><FoodNews /></PrivateRoute>} />
        <Route path="/allergies" element={<AllergyPage />} /> {/* ⭐ */}
<Route path="/safe-recipes" element={<SafeRecipes />} />
 
        {/* FALLBACK */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
