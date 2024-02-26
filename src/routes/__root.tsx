import { createRootRoute, Outlet } from "@tanstack/react-router";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

export const Route = createRootRoute({
  component: () => (
    <>
      <TopBar />
      <div className="relative" style={{ paddingBottom: "60px" }}>
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
      </div>
      <BottomNav />
    </>
  ),
});
