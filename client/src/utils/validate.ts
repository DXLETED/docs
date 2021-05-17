export type Validation = 'required' | 'notContainWhiteSpaces' | 'email' | 'phone' | 'notContainNumbers'
export type Validations = Validation[]

const NO_WHITESPACES_RE = /^[^\s]*$/
const EMAIL_RE = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/
const PHONE_RE = /^\+?[0-9]{3}-?[0-9]{6,12}$/
const NO_NUMBERS_RE = /^([^0-9]*)$/

const validateDict: { [key in Validation]: (val?: string) => string | false | null } = {
  required: val => !val && 'Поле обязательно для заполнения',
  notContainWhiteSpaces: val => !!val && !NO_WHITESPACES_RE.test(val) && 'Поле не должно содержать пробелов.',
  email: val => !!val && !EMAIL_RE.test(val) && 'Поле должно содержать email',
  phone: val => !!val && !PHONE_RE.test(val) && 'Поле должно содержать номер телефона',
  notContainNumbers: val => !!val && !NO_NUMBERS_RE.test(val) && 'Поле не должно содержать цифр',
}

export const validate = (value?: string, validations?: Validations): { required: boolean; errors: string[] } => ({
  required: !!validations?.includes('required'),
  errors: validations?.map(v => validateDict[v](value)).filter((v): v is string => !!v) || [],
})
