'use client'; // Клиентский компонент

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { loginValidateAction } from '@/features/auth/server-actions/login'; // Импорт server action
import { registerAction } from '@/features/auth/server-actions/register'; // Импорт server action
import { Button } from '@/shared/ui/shadcnComponents/button';
import { Input } from '@/shared/ui/shadcnComponents/input';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register' && password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    let result;
    if (mode === 'register') {
      result = await registerAction({ name, email, password });
    } else {
      result = await loginValidateAction({ email, password });
    }

    if (!result.success) {
      setError(result.error || 'Неизвестная ошибка');
      setLoading(false);
      return;
    }

    // Вызов signIn на клиенте для создания сессии
    const signInRes = await signIn('credentials', {
      redirect: false,
      email: result.email,
      password,
    });

    if (signInRes?.error) {
      setError('Ошибка создания сессии');
      setLoading(false);
      return;
    }

    router.push('/profile');
    setLoading(false);
  };

  return (
    <div className="py-24 flex items-center justify-center bg-muted">
      <div className="bg-background p-8 rounded-lg shadow-md w-full max-w-96 border border-border">
        <h1 className="text-2xl font-bold mb-6 text-center text-foreground">
          {mode === 'login' ? 'Вход' : 'Регистрация'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Имя (опционально)"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={error.includes('Email') ? 'border-red-500' : ''}
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={error.includes('Пароль') ? 'border-red-500' : ''}
            />
          </div>
          {mode === 'register' && (
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className={error.includes('Пароли не совпадают') ? 'border-red-500' : ''}
              />
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mb-4 bg-primary text-primary-foreground hover:bg-primary-600"
          >
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>
        <Button
          variant="outline"
          onClick={() => signIn('google', { callbackUrl: '/profile' })}
          className="w-full mb-4 border-secondary text-secondary hover:bg-secondary-50"
        >
          Войти через Google
        </Button>
        <p className="text-center text-foreground">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже зарегистрированы?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-primary hover:underline"
          >
            {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}
