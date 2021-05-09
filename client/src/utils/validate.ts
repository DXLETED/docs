export type Validation = 'required' | 'notContainWhiteSpaces' | 'email' | 'phone' | 'notContainNumbers'
export type Validations = Validation[]

const NO_WHITESPACES_RE = /^[^\s]*$/
const EMAIL_RE = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/
const PHONE_RE = /^\+?[0-9]{3}-?[0-9]{6,12}$/
const NO_NUMBERS_RE = /^([^0-9]*)$/

const validateDict: { [key in Validation]: (val?: string) => string | false | null } = {
  required: val => !val && 'Required',
  notContainWhiteSpaces: val => !!val && !NO_WHITESPACES_RE.test(val) && 'The field must not contain whitespaces',
  email: val => !!val && !EMAIL_RE.test(val) && 'The field must contain email',
  phone: val => !!val && !PHONE_RE.test(val) && 'The field must contain a phone number',
  notContainNumbers: val => !!val && !NO_NUMBERS_RE.test(val) && 'The field must not contain numbers',
}

export const validate = (value?: string, validations?: Validations): string[] =>
  validations?.map(v => validateDict[v](value)).filter(Boolean) as string[]
