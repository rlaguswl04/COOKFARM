import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  category: string;
  addedDate: string;
  expiryDate: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const navigate = useNavigate();

  // 상세페이지 이동
  const handleCardClick = () => {
    navigate(`/detail/${product.id}`);
  };

  // 삭제 클릭시
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(product.id);
  };

  // 수정 클릭시
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/add', { state: { product } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[rgb(118,188,130)] rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
      <p className="text-sm text-white">카테고리: {product.category}</p>
      <p className="text-sm text-white">등록일: {product.addedDate}</p>
      <p className="text-sm text-white">유통기한: {product.expiryDate}</p>
      <p className="text-sm text-white mb-2">{product.description}</p>
      <div className="flex justify-end mt-2 gap-2">
        <button
          onClick={handleEditClick}
          className="px-3 py-1 bg-white text-[rgb(118,188,130)] font-semibold rounded-lg text-sm hover:bg-gray-100"
        >
          수정
        </button>
        <button
          onClick={handleDeleteClick}
          className="px-3 py-1 bg-white text-[rgb(118,188,130)] font-semibold rounded-lg text-sm hover:bg-gray-100"
        >
          삭제
        </button>
      </div>
    </div>
  );
};
