import { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

import { waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';

import useValidateInput, { UseValidateParams } from '../useValidateInput';

const validateMinLengthOfThree: UseValidateParams['validateValueFn'] = (
  str: string,
  event,
) => str.length > 2;

const getMockChangeEvent = (str: string): ChangeEvent<HTMLInputElement> => {
  const event = {
    target: { value: str },
  } as ChangeEvent<HTMLInputElement>;
  return event;
};

const getMockFocusEvent = (str: string): FocusEvent<HTMLInputElement> => {
  const event = {
    target: { value: str },
  } as FocusEvent<HTMLInputElement>;
  return event;
};

const getMockKeyboardEvent = (): KeyboardEvent<HTMLInputElement> => {
  const event = {
    key: 'Enter',
  } as KeyboardEvent<HTMLInputElement>;
  return event;
};

const initHook = (
  params: UseValidateParams = {
    validateValueFn: validateMinLengthOfThree,
  },
) => {
  return renderHook(() => useValidateInput(params));
};

describe('useValidateInput hook', () => {
  describe('with default params, just validateValueFn required', () => {
    test('should initialize correctly', () => {
      const { result } = initHook();

      expect(result.current.inputTouched).toBe(false);
      expect(result.current.isValidInput).toBe(false);
      expect(result.current.inputValue).toBe('');
    });

    test('should update correctly variables inputValue, isValidInput and inputTouched using validateValueFn when onChangeHandler is triggered', () => {
      const { result } = initHook();

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent('a'));
      });
      expect(result.current.inputValue).toBe('a');
      expect(result.current.isValidInput).toBe(false);
      expect(result.current.inputTouched).toBe(false);

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent('aa'));
      });
      expect(result.current.inputValue).toBe('aa');
      expect(result.current.isValidInput).toBe(false);
      expect(result.current.inputTouched).toBe(false);

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent('aaa'));
      });
      expect(result.current.inputValue).toBe('aaa');
      expect(result.current.isValidInput).toBe(true);
      expect(result.current.inputTouched).toBe(false);
    });

    test('should update correctly variable inputTouched when onBlurHandler is triggered', () => {
      const { result } = initHook();
      const value = 'aaa';
      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputTouched).toBe(true);
    });

    test('should update correctly variable isValidInput with true when value is "" (required by default)', () => {
      const { result } = initHook();
      const value = '';

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputTouched).toBe(true);
      expect(result.current.isValidInput).toBe(false);
    });

    test('should trim start value', () => {
      const { result } = initHook();
      const value = '     a';

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputValue).toBe('a');
    });
  });
  describe('with custom params', () => {
    test('should trim start value when trimStart=true', () => {
      const { result } = initHook({
        validateValueFn: validateMinLengthOfThree,
        trimStart: true,
      });
      const value = '     a';

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputValue).toBe('a');
    });

    test('should not trim start value when trimStart=false', () => {
      const { result } = initHook({
        validateValueFn: validateMinLengthOfThree,
        trimStart: false,
      });
      const value = '     a';

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputValue).toBe(value);
    });

    test('should replace value on change when replaceOnChangeFn is received', () => {
      const { result } = initHook({
        validateValueFn: validateMinLengthOfThree,
        trimStart: true,
        reflectTrimOnInput: true,
        replaceOnChangeFn: (str: string) => str.replaceAll('a', 'x'),
      });
      const value = 'abababab';

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputValue).toBe('xbxbxbxb');
    });

    test('should return valid value when value is "" and required=false', () => {
      const { result } = initHook({
        validateValueFn: validateMinLengthOfThree,
        required: false,
      });
      const value = '';

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputValue).toBe('');
      expect(result.current.isValidInput).toBe(true);
    });

    test('should delay setting touched to true when delayTouched=true with onBlur', async () => {
      const { result } = initHook({
        validateValueFn: validateMinLengthOfThree,
        delayTouched: true,
      });
      const value = '';

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputTouched).toBe(false);
      await waitFor(() => {
        expect(result.current.inputTouched).toBe(true);
      });

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onBlurHandler(getMockFocusEvent(value));
      });
      expect(result.current.inputTouched).toBe(true);
    });

    test('should delay setting touched to true when delayTouched=true with onKeyPress', async () => {
      const { result } = initHook({
        validateValueFn: validateMinLengthOfThree,
        delayTouched: true,
        setTouchedWithEnter: true,
      });
      const value = '';

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onKeyPressHandler(getMockKeyboardEvent());
      });
      expect(result.current.inputTouched).toBe(false);
      await waitFor(() => {
        expect(result.current.inputTouched).toBe(true);
      });

      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onKeyPressHandler(getMockKeyboardEvent());
      });
      expect(result.current.inputTouched).toBe(true);
    });

    test('should update inputValue when defaultValue is provided', () => {
      const { result } = initHook({
        validateValueFn: validateMinLengthOfThree,
        required: false,
        defaultValue: 'aa',
      });

      expect(result.current.inputValue).toBe('aa');
    });

    test('should update valid state when defaultValue is provided', () => {
      const { result: resultNotValid } = initHook({
        validateValueFn: validateMinLengthOfThree,
        required: false,
        defaultValue: 'aa',
      });

      expect(resultNotValid.current.isValidInput).toBe(false);

      const { result: resultValid } = initHook({
        validateValueFn: validateMinLengthOfThree,
        required: false,
        defaultValue: 'aaa',
      });

      expect(resultValid.current.isValidInput).toBe(true);
    });

    test('should update valid state when manually invoking validateWithDOMInfo', () => {
      const email = 'example@example.com';

      const { result } = initHook({
        validateValueFn: (val, input) => email === val,
        required: false,
        defaultValue: email,
      });
      const inputEmail = document.createElement('input');
      inputEmail.setAttribute('type', 'email');
      inputEmail.setAttribute('value', email);

      act(() => {
        result.current.validateWithDOMInfo(email, inputEmail);
      });
      expect(result.current.isValidInput).toBe(true);

      act(() => {
        result.current.validateWithDOMInfo('another', inputEmail);
      });
      expect(result.current.isValidInput).toBe(false);
    });

    test('should update correctly variable inputTouched when setTouchedWithEnter=true when onKeyPressHandler is triggered with Enter key', () => {
      const { result } = initHook({
        validateValueFn: validateMinLengthOfThree,
        setTouchedWithEnter: true,
      });
      const value = 'aaa';
      act(() => {
        result.current.onChangeHandler(getMockChangeEvent(value));
        result.current.onKeyPressHandler(getMockKeyboardEvent());
      });
      expect(result.current.inputTouched).toBe(true);
    });
  });
});
