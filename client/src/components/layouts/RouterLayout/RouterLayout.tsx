import { Outlet } from "react-router-dom";
import { Header } from "../Header";

export default function RouterLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
