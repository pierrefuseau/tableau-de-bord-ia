import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage').then(m => ({ default: m.ServiceDetailPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const InvoicesPage = lazy(() => import('./pages/InvoicesPage').then(m => ({ default: m.InvoicesPage })));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage').then(m => ({ default: m.BudgetsPage })));
const ExportPage = lazy(() => import('./pages/ExportPage').then(m => ({ default: m.ExportPage })));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><LoadingSpinner /></div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/factures" element={<InvoicesPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
