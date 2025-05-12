import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { isValidForm, isValidInput } from '../utils/validation';

type FormState = Record<string, string>;
type ErrorState = Record<string, boolean>;

const getInitialErrors = (fields: FormState): ErrorState =>
  Object.keys(fields).reduce((acc, key) => ({ ...acc, [key]: false }), {});

export const useInputForm = (initialState: FormState) => {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [inputErrors, setInputErrors] = useState<ErrorState>(
    getInitialErrors(initialState)
  );

  const isValid = isValidForm(inputErrors);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    const updatedErrors = { ...inputErrors };

    if (name === 'repPassword') {
      updatedErrors.repPassword = value !== updatedForm.password;
    } else if (name === 'password') {
      updatedErrors.password = !isValidInput('password', value);
      if (updatedForm.repPassword !== undefined) {
        updatedErrors.repPassword = updatedForm.repPassword !== value;
      }
    } else {
      updatedErrors[name] = !isValidInput(name, value);
    }

    setInputErrors(updatedErrors);
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  return [
    formData,
    handleInputChange,
    handleSubmit,
    inputErrors,
    isValid
  ] as const;
};
