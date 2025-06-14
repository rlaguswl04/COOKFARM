import React, { useEffect, useState } from 'react';

interface ExpiryProduct {
  id: number;
  name: string;
  expiryDate: string;  // API에서 받아올 때는 문자열(ISO)로 받음
  category: string;
  quantity: number;
  image?: string;
}

const categories = ['전체', '채소', '과일', '육류', '유제품'];

export const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [products, setProducts] = useState<ExpiryProduct[]>([]);

  // 로그인 유저 정보 가져오기
  const currentUser = localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')!)
    : null;

  // API에서 데이터 받아오기
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
        console.error('식재료 불러오기 실패:', err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [selectedDate, selectedCategory, currentUser]);

  // 달력 생성 함수
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // 0-indexed
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendar = [];
    let day = 1;

    // 달력 헤더 (요일)
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    calendar.push(
      <div key="weekdays" className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map(weekday => (
          <div key={weekday} className="text-center font-semibold text-gray-600">
            {weekday}
          </div>
        ))}
      </div>
    );

    // 날짜 그리기
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          week.push(<div key={`empty-${j}`} className="h-24"></div>);
        } else if (day > daysInMonth) {
          week.push(<div key={`empty-end-${j}`} className="h-24"></div>);
        } else {
          // **이 날짜에 해당하는 상품만 필터**
          const dayProducts = products.filter(product => {
            const exp = new Date(product.expiryDate);
            const isSameDate =
              exp.getFullYear() === year &&
              exp.getMonth() === month &&
              exp.getDate() === day;
            const matchCategory =
              selectedCategory === '전체' || product.category === selectedCategory;
            return isSameDate && matchCategory;
          });

          const today = new Date();
          const currentDate = new Date(year, month, day);


          week.push(
  <div
    key={day}
    className={[
      "h-24 p-1 border rounded-lg",
      dayProducts.length > 0 ? "bg-red-50" : "",
      // 오늘 날짜면 회색 배경
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getDate() === today.getDate()
        ? "bg-gray-200"
        : "",
    ].join(" ")}
  >
    <div className="text-sm font-medium mb-1">{day}</div>
    {dayProducts.map(product => (
      <div
        key={product.id}
        className="text-xs p-1 bg-white rounded shadow-sm mb-1 truncate"
      >
        {product.name}
      </div>
    ))}
  </div>
);
          day++;
        }
      }
      calendar.push(
        <div key={`week-${i}`} className="grid grid-cols-7 gap-1">
          {week}
        </div>
      );
    }
    return calendar;
  };

  // 이전/다음 달로 이동
  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };
  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">유통기한 달력</h1>
        {/* 필터 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold">
                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* 달력 */}
          <div className="bg-white rounded-lg">
            {generateCalendar()}
          </div>
        </div>
        
    
      </div>
    </div>
  );
};
