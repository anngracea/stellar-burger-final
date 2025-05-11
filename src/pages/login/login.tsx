import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || { pathname: '/profile' };

  const [formData, handleInputChange, handleSubmit, inputErrors, isValid] =
    useInputForm({
      email: '',
      password: ''
    });

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({
    email: false,
    password: false
  });

  const isError = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(resetErrorMessage());
  }, [dispatch]);

  const onSubmit = async (e: SyntheticEvent) => {
    handleSubmit(e);
    setFieldErrors(inputErrors);

    if (isValid) {
      const result = await dispatch(loginUser(formData as TLoginData));

      if (loginUser.fulfilled.match(result)) {
        navigate(from, {
          replace: true,
          state: {
            backgroundLocation: from?.state?.backgroundLocation
          }
        });
      }
    }
  };

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
