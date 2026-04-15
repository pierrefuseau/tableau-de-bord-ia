import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { ExportPage } from './pages/ExportPage';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
