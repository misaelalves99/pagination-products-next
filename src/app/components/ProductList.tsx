// app/components/ProductList.tsx

import React, { useEffect, useState } from "react";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";
import { useProduct } from "../context/ProductContext";
import Pagination from "./Pagination";
import styles from "./ProductList.module.css";

const ITEMS_PER_PAGE = 20;

const ProductList: React.FC = () => {
  const { products, setProducts } = useProduct();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

  const fetchProducts = async (): Promise<void> => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Erro ao buscar produtos");

      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedProducts(products.slice(startIndex, endIndex));
  }, [currentPage, products]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className={styles.loading}>Carregando produtos...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!products.length) return <p className={styles.noProductsMessage}>Nenhum produto encontrado.</p>;

  return (
    <div>
      <div className={styles.productGrid}>
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.paginationWrapper}>
        <Pagination
          totalPages={Math.ceil(products.length / ITEMS_PER_PAGE)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProductList;
