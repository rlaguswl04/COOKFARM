import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};
    if (!formData.email) newErrors.email = '이메일을 입력해주세요';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요';
    else if (formData.password.length < 6)
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다';
    if (!formData.confirmPassword)
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    if (!formData.name) newErrors.name = '이름을 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      if (res.ok) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        window.location.href = '/login';
      } else {
        const errorText = await res.text();
        alert('회원가입 실패: ' + errorText);
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('서버와 통신 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(118,188,130)]">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1E1E1E]">회원가입</h2>
          <p className="mt-2 text-[#6B7280]">COOKFARM과 함께 시작해보세요!</p>
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
            <Input
              label="비밀번호 확인"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="******"
            />
            <Input
              label="이름"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="홍길동"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full bg-[rgb(118,188,130)] text-white font-semibold py-3 rounded-lg transition-colors hover:bg-green-600"
          >
            가입하기
          </Button>
        </form>
      </div>
    </div>
  );
};
