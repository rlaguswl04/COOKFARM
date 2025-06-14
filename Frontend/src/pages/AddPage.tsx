import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AddProductForm {
  name: string;
  description: string;
  category: string;
  addedDate: string;
  expiryDate: string;
}

const categories = ['채소', '과일', '육류', '유제품'];

export const AddPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingProduct = location.state?.product; // 수정모드일 때만 값 있음

  // 로그인 유저 정보
  const currentUser = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')!)
    : null;

  // 폼 상태 (수정모드: product값, 등록모드: 빈값)
  const [form, setForm] = useState<AddProductForm>({
    name: editingProduct?.name ?? '',
    description: editingProduct?.description ?? '',
    category: editingProduct?.category ?? categories[0],
    addedDate: editingProduct?.addedDate ?? '',
    expiryDate: editingProduct?.expiryDate ?? ''
  });

  // location.state가 바뀌면(수정 진입) 폼 초기화
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category,
        addedDate: editingProduct.addedDate,
        expiryDate: editingProduct.expiryDate
      });
    }
  }, [editingProduct]);

  // 입력 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !currentUser.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      let res;
      if (editingProduct) {
        // **수정모드: PUT**
        res = await fetch(
          `http://localhost:8080/api/ingredients/${editingProduct.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          }
        );
      } else {
        // **등록모드: POST**
        res = await fetch(
          `http://localhost:8080/api/ingredients/add/${currentUser.id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          }
        );
      }

      if (res.ok) {
        alert(editingProduct ? '수정 성공!' : '식재료 등록 성공!');
        navigate('/');
      } else {
        const errorText = await res.text();
        alert((editingProduct ? '수정 실패: ' : '등록 실패: ') + errorText);
      }
    } catch (error) {
      console.error('서버 오류 발생:', error);
      alert('서버와의 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(118,188,130)] py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center font-['Pretendard',sans-serif] tracking-tight">
          {editingProduct ? '✏️ 식재료 수정' : '📝 식재료 등록'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              식재료명
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
              placeholder="식재료명을 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="addedDate" className="block text-sm font-medium text-gray-700 mb-2">
              등록일
            </label>
            <input
              type="date"
              id="addedDate"
              name="addedDate"
              value={form.addedDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              유통기한
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              메모
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none resize-none"
              placeholder="식재료에 대한 메모를 입력하세요"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
            >
              {editingProduct ? '수정하기' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
