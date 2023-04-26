import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react';

type ValidateValue = (
  str: string,
  event?: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>,
  input?: HTMLInputElement,
) => boolean;

type ReplaceOnChange = (str: string) => string;

export interface UseValidateParams {
  trimStart?: boolean;
  reflectTrimOnInput?: boolean;
  validateValueFn?: ValidateValue;
  replaceOnChangeFn?: ReplaceOnChange;
  delayTouched?: boolean;
  required?: boolean;
  defaultValue?: string;
  touched?: boolean;
  setTouchedWithEnter?: boolean;
}

const DEFAULT_DELAY = 200;

const useValidateInput = ({
  trimStart = true,
  reflectTrimOnInput = false,
  validateValueFn = (_str, _event) => true,
  replaceOnChangeFn,
  delayTouched,
  required = true,
  defaultValue = '',
  touched = false,
  setTouchedWithEnter = false,
}: UseValidateParams) => {
  const isMounted = useRef<boolean>(false);
  let timerTouched = useRef<NodeJS.Timeout | null>(null);

  const [inputValue, setInputValue] = useState(defaultValue);
  const [inputTouched, setInputTouched] = useState(touched);

  // Calculate if initially the value is valid or not
  const isValidDefaultValue = validateValueFn(defaultValue);
  const initialValidRequired = defaultValue !== '' && isValidDefaultValue;
  const initialValidNotRequired = isValidDefaultValue || defaultValue === '';
  const initIsValid = required ? initialValidRequired : initialValidNotRequired;
  const [isValidInput, setIsValidInput] = useState(initIsValid);

  const processValue = (value: string) => {
    return trimStart ? value.trimStart() : value;
  };

  const updateValidValue = (isValid: boolean, value: string) => {
    if (value === '') {
      setIsValidInput(!required);
      return;
    }
    setIsValidInput(isValid);
  };

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    validate(event);
  };

  /**
   * This function can be called from 3 different places.
   *
   * 1. onChangeHandler with an event.
   * 2. useEffect when default value changes, with the value.
   * 3. validateWithDOMInfo special case, with value and input HTMLInputElement.
   *
   * @param val - Value directly or Event
   * @param input - DOM element to retrieve information in special cases
   */
  const validate = (
    val: string | ChangeEvent<HTMLInputElement>,
    input?: HTMLInputElement,
  ) => {
    const isEvent = typeof val !== 'string';
    const event = isEvent ? val : undefined;
    const value = isEvent ? val.target.value : val;
    let finalValue = processValue(value);

    if (replaceOnChangeFn !== undefined) {
      finalValue = replaceOnChangeFn(finalValue);
    }

    const validationResult = validateValueFn(finalValue, event, input);
    setInputValue(finalValue);
    updateValidValue(validationResult, finalValue);
  };

  /**
   * Validate with information retrieved from DOM element. Necessary in some
   * special cases.
   *
   * @param value - Value to be validated.
   * @param input - input DOM element to retrieve special information. Example:
   * input.validity.typeMismatch for email.
   */
  const validateWithDOMInfo = (value: string, input: HTMLInputElement) => {
    validate(value, input);
  };

  const onBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    if (trimStart && reflectTrimOnInput) {
      event.target.value = processValue(event.target.value);
    }

    setTouchedInput();
  };

  const onKeyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (setTouchedWithEnter && event.key === 'Enter') {
      setTouchedInput();
    }
  };

  const setTouchedInput = () => {
    if (inputTouched) {
      return;
    }

    if (delayTouched) {
      timerTouched.current = setTimeout(setTouchedTrue, DEFAULT_DELAY);
      return;
    }
    setTouchedTrue();
  };

  const setTouchedTrue = () => {
    isMounted.current && setInputTouched(true);
  };

  // Each time defaultValue changes, we must validate it and update variables
  useEffect(() => {
    validate(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timerTouched.current !== null) {
        clearTimeout(timerTouched.current);
      }
    };
  }, []);

  return {
    onChangeHandler,
    onBlurHandler,
    onKeyPressHandler,
    inputValue,
    setInputValue,
    inputTouched,
    isValidInput,
    validateWithDOMInfo,
  };
};

export default useValidateInput;
