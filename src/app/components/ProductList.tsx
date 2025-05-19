// app/components/ProductList.tsx

import React, { useEffect, useState } from "react";
import { Product } from "../types/product";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import styles from "./ProductList.module.css";

type ProductListProps = {
  products: Product[];
};

const ITEMS_PER_PAGE = 20;

const ProductList = ({ products }: ProductListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedProducts(products.slice(startIndex, endIndex));
  }, [currentPage, products]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!products.length) {
    return <p className={styles.noProductsMessage}>Nenhum produto encontrado.</p>;
  }

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
