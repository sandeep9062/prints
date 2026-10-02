import { fetchProductsServer } from "@/services/productsApi";
import ProductsListClient from "./ProductsListClient";

export async function ProductsListServer() {
  const initialData = await fetchProductsServer();

  return <ProductsListClient initialProducts={initialData.products} />;
}
