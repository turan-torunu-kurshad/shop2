import React from "react";
import ProductPage from "./pages/ProductPage";
import AdminReports from "./pages/AdminReports";

export default function App() {
  const url = new URL(window.location.href);
  const path = url.searchParams.get("page") || "product";
  if (path === "admin") return <AdminReports />;
  return <ProductPage productId={1} userId={1} />;
}
