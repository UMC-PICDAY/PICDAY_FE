import { useState } from 'react'
import type { ChangeEvent, FocusEventHandler } from 'react'

/**
 * useValidatedField 사용법
 *
 *   const id = useValidatedField((value) =>
 *     value === '' ? '아이디를 입력해 주세요' : ID_REGEX.test(value) ? undefined : '형식이 올바르지 않아요',
 *   )
 *
 *   <InputField label="아이디" placeholder="..." {...id.fieldProps} />
 *
 *   const canSubmit = id.isValid && password.isValid
 */
interface FieldProps {
  value: string
  error: string | undefined
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: FocusEventHandler<HTMLInputElement>
}

interface ValidatedField {
  isValid: boolean
  fieldProps: FieldProps
}

export const useValidatedField = (
  validate: (value: string) => string | undefined,
  initialValue = '',
): ValidatedField => {
  const [value, setValue] = useState(initialValue)
  const [touched, setTouched] = useState(false)

  const validationError = validate(value)

  return {
    isValid: validationError === undefined,
    fieldProps: {
      value,
      error: touched ? validationError : undefined,
      onChange: (event) => setValue(event.target.value),
      onBlur: () => setTouched(true),
    },
  }
}
