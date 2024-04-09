import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { useRootStore } from '@hooks/useRootStore';

const LoginForm = observer(function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoggining, setIsLoggining] = useState(false);

  const {
    authStore: { login, errors, isLoggedIn, setErrors, hasErrors },
  } = useRootStore();

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoggining(true);
    await login(username, password);
    setIsLoggining(false);
  };

  useEffect(() => {
    document.title = 'Login | Alivebe';
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/anticheeter');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    setErrors({});
  }, [username, password, setErrors]);

  const inputClasses = 'border rounded-lg p-2 w-full';

  return (
    <form
      className="m-auto mt-5 is-invalid p-5"
      style={{ maxWidth: 500 }}
      onSubmit={e => {
        handleSubmit(e);
      }}
    >
      <h1 className="text-3xl font-bold mb-4">Admin login</h1>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Почта</label>
        <input
          type="email"
          className={cn(inputClasses, { 'is-invalid': !!errors.email })}
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        {errors.email?.map(item => (
          <div key={item} className="text-red-400">
            {item}
          </div>
        ))}
      </div>
      <div className="form-group mt-3">
        <label htmlFor="exampleInputPassword1">Пароль</label>
        <input
          type="password"
          className={cn(inputClasses, { 'is-invalid': !!errors.password })}
          id="exampleInputPassword1"
          placeholder="Password"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        {errors.password?.map(item => (
          <div key={item} className="text-red-400">
            {item}
          </div>
        ))}
      </div>
      <div className="w-full">
        <button
          disabled={!(username && password) || isLoggining || hasErrors}
          type="submit"
          className="mt-4 block bg-amber-400 rounded-lg px-10 py-2 disabled:opacity-70 mx-auto"
        >
          Войти
        </button>
      </div>
    </form>
  );
});

export { LoginForm };
