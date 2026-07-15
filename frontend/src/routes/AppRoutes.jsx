import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/ReelFeed';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import Start from '../pages/general/Start';
import Dashboard from '../pages/general/Dashboard';
import Order from '../pages/general/Order';
import About from '../pages/NavbarPages/About';
import Cart from '../pages/NavbarPages/Cart';
import Help from '../pages/NavbarPages/Help';
import UserOrder from '../pages/food-partner/UserOrder';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path = "/about" element = {<About />}/>
                <Route path = "/cart" element = {<Cart />}/>
                <Route path = "/help" element = {<Help />}/>
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/reels" element={<><Home /><BottomNav /></>} />
                <Route path='/' element = {<Start />} />
                <Route path="/saved" element={<><Saved /><BottomNav /></>} />
                <Route path="/create-food" element={<CreateFood />} />
                <Route path={"/food-partner/:id"} element={<Profile />} />
                <Route path = "/order" element = {<Order />} />
                <Route path = "/userOrder/:id" element = {<UserOrder />} />
                <Route path = "*" element = {<h1 className='text-center text-3xl font-bold mt-10'>404 Not Found</h1>} />

            </Routes>
        </Router>
    )
}

export default AppRoutes