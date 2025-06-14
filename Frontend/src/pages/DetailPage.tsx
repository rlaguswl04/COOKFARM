import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  category: string;
  addedDate: string;
  expiryDate: string;
  description: string;
}

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem('products');
    if (stored) {
      const list: Product[] = JSON.parse(stored);
      // id는 string이므로 타입 통일해서 비교
      const found = list.find(p => String(p.id) === String(id));
      setProduct(found);
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-[#4CAF50]">{product?.name}</h2>
        <p><strong>카테고리:</strong> {product?.category}</p>
        <p><strong>등록일:</strong> {product?.addedDate}</p>
        <p><strong>유통기한:</strong> {product?.expiryDate}</p>
        <p className="mt-4"><strong>메모:</strong> {product?.description}</p>
        <button
          className="mt-6 px-4 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#45a049]"
          onClick={() => navigate('/')}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};
