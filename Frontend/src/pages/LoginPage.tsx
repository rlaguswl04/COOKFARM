import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface LoginForm {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  // 필요한 다른 필드들
}

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};
    if (!formData.email) newErrors.email = '이메일을 입력해주세요';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          alert(`${data.user.name}님 환영합니다!`);
          navigate('/');
        } else {
          alert('로그인 실패: ' + data.message);
        }
      } else {
        const errorText = await res.text();
        alert('로그인 실패: ' + errorText);
      }
    } catch (error) {
      console.error('서버 오류 발생:', error);
      alert('서버와의 통신 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(118,188,130)]">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1E1E1E]">로그인</h2>
          <p className="mt-2 text-[#6B7280]">COOKFARM에 오신 것을 환영합니다!</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="이메일"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="your@email.com"
            />
            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="******"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-[rgb(118,188,130)] border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                로그인 상태 유지
              </label>
            </div>
            <a href="#" className="text-sm text-[rgb(118,188,130)] hover:text-green-700">
              비밀번호를 잊으셨나요?
            </a>
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full bg-[rgb(118,188,130)] text-white font-semibold py-3 rounded-lg transition-colors hover:bg-green-600"
          >
            로그인
          </Button>
          <p className="mt-4 text-center text-sm text-gray-600">
            아직 계정이 없으신가요?{' '}
            <a href="/register" className="text-[rgb(118,188,130)] hover:text-green-700 font-medium">
              회원가입
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
