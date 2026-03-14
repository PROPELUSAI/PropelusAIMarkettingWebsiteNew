/**
 * Layout
 *
 * Main authenticated layout shell. Renders the sidebar, header, page
 * content (via <Outlet />), and footer. All protected routes are
 * rendered inside this layout via React Router's nested routes.
 */
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};
