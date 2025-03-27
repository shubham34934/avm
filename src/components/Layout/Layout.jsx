import { Outlet, useLocation } from "react-router-dom";
import styles from "./Layout.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import { useLayout } from "../../context/LayoutContext";
import { routes } from "../../routes/routes";

const Layout = () => {
  const location = useLocation();
  const { isSidebarOpen, closeSidebar } = useLayout();

  // Find the current route configuration
  const currentRoute = routes.find(
    (route) =>
      route.path === location.pathname ||
      (route.path.includes(":") &&
        location.pathname.startsWith(route.path.replace("/:id", "")))
  );

  // Determine if footer should be hidden
  const shouldHideFooter = currentRoute?.config?.hideFooter || false;

  return (
    <div className={styles.layout}>
      {!shouldHideFooter && (
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <Footer />
        </>
      )}

      <main
        className={`${styles.main} ${
          shouldHideFooter ? styles.fullscreen : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
