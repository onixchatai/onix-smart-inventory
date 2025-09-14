import Layout from "./Layout.jsx";

import Home from "./Home";

import Inventory from "./Inventory";

import Reports from "./Reports";

import Dashboard from "./Dashboard";

import Settings from "./Settings";

import Jobs from "./Jobs";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Inventory: Inventory,
    
    Reports: Reports,
    
    Dashboard: Dashboard,
    
    Settings: Settings,
    
    Jobs: Jobs,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Inventory" element={<Inventory />} />
                
                <Route path="/Reports" element={<Reports />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Jobs" element={<Jobs />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}