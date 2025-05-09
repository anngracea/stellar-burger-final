import { FC, useEffect, useState, SyntheticEvent, FocusEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  selectIsLoading,
  selectError,
  resetErrorMessage,
  resetPassword
} from '@slices';

import { useInputForm } from '../../hooks/useInputForm';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectError);

  const [formData, handleInputChange, handleSubmit, inputErrors, isValid] =
    useInputForm({ password: '', token: '' });

  const [fieldErrors, setFieldErrors] = useState({
    password: false,
    token: false
  });

  // Проверка доступа и сброс ошибок при монтировании
  useEffect(() => {
    dispatch(resetErrorMessage());
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [dispatch, navigate]);

  const onSubmit = async (e: SyntheticEvent) => {
    handleSubmit(e);
    setFieldErrors(inputErrors as { password: boolean; token: boolean });

    if (!isValid) return;

    try {
      const result = await dispatch(
        resetPassword({ password: formData.password, token: formData.token })
      );

      if (resetPassword.fulfilled.match(result)) {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка сброса пароля', error);
    }
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  if (isLoading) return <Preloader />;

  return (
    <ResetPasswordUI
      password={formData.password}
      token={formData.token}
      handleInputChange={handleInputChange}
      handleSubmit={onSubmit}
      onFocus={onFocus}
      errors={fieldErrors}
      errorText={isError ? 'Указан неверный код подтверждения' : ''}
    />
  );
};
