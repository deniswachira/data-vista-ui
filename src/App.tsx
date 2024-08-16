import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import Login from './pages/Login';
import MyProfile from './components/dashboard/MyProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Gdp_Population from './components/dashboard/Gdp_Population';
import Exchange_rate from './components/dashboard/Exchange_rate';
import InflationPage from './components/dashboard/InflationPage';
import HistoricalInflationTrend from './components/dashboard/HistoricalInflationTrend';
import HistoricalSharePrices from './components/dashboard/HistoricalSharePrices';
import LockedContent from './components/dashboard/LockedContent';
import Checkout from './components/dashboard/Checkout';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />,
  },

  {
    path: 'register',
    element: <Register />,
    errorElement: <Error />,
  },
  {
    path: 'login',
    element: <Login />,
    errorElement: <Error />,
  },  
  {
    path: 'dashboard/me',
    element: (
      <ProtectedRoute requiredRoles={['user']}>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "",
        element: <MyProfile />,
      },
      {
        path: "gdp-population",
        element: <Gdp_Population />,
      },
      {
        path: "exchange-rate",
        element: <Exchange_rate />,
      },
      {
        path: "monthly-inflation",
        element: <InflationPage />,
      },
      {
        path: "historical-inflation",
        element: <HistoricalInflationTrend />,
      },
      {
        path: "share-prices",
        element: <HistoricalSharePrices />,
      },
      {
        path: "historical-prices",
        element: <LockedContent />,
      },
      {
        path: "upgrade",
        element: <Checkout />,
      },
       ]
  },
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
