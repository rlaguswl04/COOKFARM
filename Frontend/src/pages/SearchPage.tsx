import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';

const categories = ['채소', '과일', '육류', '유제품'];

interface Product {
  id: number;
  name: string;
  category: string;
  addedDate: string;
  expiryDate: string;
  description: string;
}

export const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'expiry-soon' | 'added-new' | 'added-old'>('name');
  const [products, setProducts] = useState<Product[]>([]);

  // currentUser 정보
  const currentUser = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')!)
    : null;

  // API에서 내 식재료 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser || !currentUser.id) {
        setProducts([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:8080/api/ingredients/user/${currentUser.id}`);
        if (!res.ok) throw new Error('서버 응답 실패');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, [currentUser]);

  // 필터 + 정렬 적용
  let filtered = products
    .filter(product => 
      (selectedCategory === '' || product.category === selectedCategory) &&
      (searchTerm.trim() === '' || product.name.includes(searchTerm.trim()))
    );

  // 정렬 로직
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'expiry-soon') {
      // 유통기한 임박순 (빠른 게 먼저)
      if (!a.expiryDate || !b.expiryDate) return 0;
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    }
    if (sortBy === 'added-new') {
      // 등록일 최신순 (내림차순)
      if (!a.addedDate || !b.addedDate) return 0;
      return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    }
    if (sortBy === 'added-old') {
      // 등록일 오래된 순 (오름차순)
      if (!a.addedDate || !b.addedDate) return 0;
      return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[rgb(248,250,247)] py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">식재료 찾기</h1>

        {/* 검색 및 필터 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="식재료 검색..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
          >
            <option value="">전체 카테고리</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'expiry-soon' | 'added-new' | 'added-old')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
          >
            <option value="name">이름순</option>
            <option value="expiry-soon">유통기한 임박순</option>
            <option value="added-new">등록일 최신 순</option>
            <option value="added-old">등록일 오래된 순</option>
          </select>
        </div>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              검색 조건에 맞는 식재료가 없습니다.
            </div>
          ) : (
            filtered.map(product => (
              <ProductCard key={product.id} product={product} onDelete={function (id: number): void {
                throw new Error('Function not implemented.');
              } } />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
