import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  category: string;
  addedDate: string;
  expiryDate: string;
  description: string;
}

const categories = ['전체', '채소', '과일', '육류', '유제품'];

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(''); // 추가: 검색창 상태
  const sidebarRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')!)
    : null;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!currentUser || !currentUser.id) {
        setProducts([]);
        localStorage.setItem('products', JSON.stringify([]));
        return;
      }
      try {
        const res = await fetch(`http://localhost:8080/api/ingredients/user/${currentUser.id}`);
        if (!res.ok) throw new Error('서버 응답 실패');
        const data = await res.json();
        // memo → description 변환!
        const mapped = data.map((item: any) => ({
          ...item,
          description: item.description ?? item.memo ?? "",
        }));
        setProducts(mapped);
        localStorage.setItem('products', JSON.stringify(mapped));
      } catch (err) {
        console.error('식재료 불러오기 실패:', err);
        setProducts([]);
        localStorage.setItem('products', JSON.stringify([]));
      }
    };

    fetchProducts();
  }, [location.key, currentUser]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/ingredients/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('서버 삭제 실패');
      }
      // 프론트 배열에서도 삭제
      setProducts(products => {
        const updated = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      alert('삭제 실패: ' + (err as Error).message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    alert('로그아웃 되었습니다.');
    navigate(0);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // ⭐️⭐️ "정확히 일치" 검색 적용한 상품 필터
  const filteredProducts = products.filter((p) => {
    if (search.trim() === '') {
      // 검색어 없으면 카테고리 필터만
      return selectedCategory === '전체' ? true : p.category === selectedCategory;
    }
    // 검색어 있으면, '정확히 일치'하는 이름만 (카테고리 무시)
    return p.name === search.trim();
  });

  return (
    <div className="min-h-screen bg-[#F8FAF7] relative">
      {/* 네비게이션 바 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-2xl font-bold text-[#4CAF50] focus:outline-none"
              >
                ☰
              </button>
              <Link to="/" className="text-2xl font-bold text-[#4CAF50]">
                COOKFARM
              </Link>
            </div>

            {/* 검색창 */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="식재료를 입력하세요"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="absolute right-3 top-2.5 text-gray-400 hover:text-[#4CAF50]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <span className="text-sm text-[#4CAF50] font-medium">
                    {currentUser.name}님
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-[#4CAF50] text-sm font-medium rounded-md text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-[#4CAF50] text-sm font-medium rounded-md text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 사이드바 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40">
          <div
            ref={sidebarRef}
            className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#4CAF50]">메뉴</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li>
                <button onClick={() => { navigate('/add'); setIsSidebarOpen(false); }} className="hover:text-[#4CAF50]">
                  식재료 추가
                </button>
              </li>
              <li>
                <button onClick={() => { navigate('/search'); setIsSidebarOpen(false); }} className="hover:text-[#4CAF50]">
                  식재료 찾기
                </button>
              </li>
              <li>
                <button onClick={() => { navigate('/calendar'); setIsSidebarOpen(false); }} className="hover:text-[#4CAF50]">
                  유통기한 달력 보기
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 카테고리 필터 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${selectedCategory === category
                  ? 'bg-[#4CAF50] text-white'
                  : 'bg-white text-gray-600 hover:bg-[#E8F5E9] hover:text-[#4CAF50]'}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 상품 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>

      {/* + 버튼 */}
      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#4CAF50] text-white text-3xl font-bold shadow-lg flex items-center justify-center hover:bg-[#45a049] transition-colors"
        aria-label="식재료 추가"
      >
        +
      </button>
    </div>
  );
};
