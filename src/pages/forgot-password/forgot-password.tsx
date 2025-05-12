import { FC, useEffect, useState, SyntheticEvent, FocusEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  forgotPassword,
  resetErrorMessage,
  selectError,
  selectIsLoading
} from '@slices';

import { useInputForm } from '../../hooks/useInputForm';

const initialForm = { email: '' };
const initialErrors = { email: false };

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectError);

  const [formData, handleInputChange, handleSubmit, inputErrors, isValid] =
    useInputForm(initialForm);

  const [fieldErrors, setFieldErrors] = useState(initialErrors);

  useEffect(() => {
    dispatch(resetErrorMessage());
  }, [dispatch]);

  const onSubmit = async (e: SyntheticEvent) => {
    handleSubmit(e);
    setFieldErrors(inputErrors as typeof initialErrors);

    if (!isValid) return;

    const result = await dispatch(forgotPassword({ email: formData.email }));
    if (forgotPassword.fulfilled.match(result)) {
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  if (isLoading) return <Preloader />;

  return (
    <ForgotPasswordUI
      email={formData.email}
      errors={fieldErrors}
      errorText={isError ? 'Электронный адрес не существует или не найден' : ''}
      handleSubmit={onSubmit}
      handleInputChange={handleInputChange}
      onFocus={onFocus}
    />
  );
};
