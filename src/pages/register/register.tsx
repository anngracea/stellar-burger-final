import { FC, SyntheticEvent, useEffect, useState, FocusEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectError,
  selectIsLoading,
  registerUser,
  resetErrorMessage
} from '@slices';

import { Preloader } from '@ui';
import { useInputForm } from '../../hooks/useInputForm';

const initialFormState = {
  name: '',
  email: '',
  password: '',
  repPassword: ''
};

const initialErrorsState = {
  name: false,
  email: false,
  password: false,
  repPassword: false
};

export const Register: FC = () => {
  const dispatch = useDispatch();
  const isError = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  const [formData, handleInputChange, handleSubmit, inputErrors, isValid] =
    useInputForm(initialFormState);

  const [fieldErrors, setFieldErrors] = useState(initialErrorsState);

  useEffect(() => {
    dispatch(resetErrorMessage());
  }, [dispatch]);

  const onSubmit = async (e: SyntheticEvent) => {
    handleSubmit(e);
    setFieldErrors(inputErrors as typeof initialErrorsState);

    if (!isValid) return;

    try {
      await dispatch(
        registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      );
    } catch (err) {
      console.error('Ошибка при регистрации', err);
    }
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  if (isLoading) return <Preloader />;

  return (
    <RegisterUI
      email={formData.email}
      userName={formData.name}
      password={formData.password}
      repPassword={formData.repPassword}
      errors={fieldErrors}
      onFocus={onFocus}
      handleInputChange={handleInputChange}
      handleSubmit={onSubmit}
      errorText={isError ? 'Пользователь с таким адресом уже существует' : ''}
    />
  );
};
