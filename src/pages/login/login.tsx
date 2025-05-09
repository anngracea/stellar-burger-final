import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectError,
  selectIsLoading,
  loginUser,
  resetErrorMessage
} from '@slices';
import { Preloader } from '@ui';
import { useInputForm } from '../../hooks/useInputForm';
import { TLoginData } from '@api';

export const Login: FC = () => {
  const dispatch = useDispatch();

  // Хук для управления формой
  const [formData, handleInputChange, handleSubmit, inputErrors, isValid] =
    useInputForm({
      email: '',
      password: ''
    });

  // Ошибки инпутов
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    email: false,
    password: false
  });

  // Глобальные флаги
  const isError = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  // Очистка глобальной ошибки при монтировании
  useEffect(() => {
    dispatch(resetErrorMessage());
  }, [dispatch]);

  // Обработка сабмита формы
  const onSubmit = (e: SyntheticEvent) => {
    handleSubmit(e);
    setFieldErrors(inputErrors);
    if (isValid) {
      dispatch(loginUser(formData as TLoginData));
    }
  };

  // Очистка ошибки поля при фокусе
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      email={formData.email}
      password={formData.password}
      errors={fieldErrors}
      errorText={isError ? 'Электронный адрес или пароль введены неверно' : ''}
      handleInputChange={handleInputChange}
      handleSubmit={onSubmit}
      onFocus={onFocus}
    />
  );
};
