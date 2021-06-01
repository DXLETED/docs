import { AxiosError } from 'axios'
import { errors } from 'dictionary.json'
import { notify } from './notify'

export const apiError = (err: AxiosError): string => {
  throw err.response?.data?.err in errors ? errors[err.response?.data?.err as keyof typeof errors] : errors.unknown
}

export const notifyApiError = (err: AxiosError): void => {
  notify.error({
    content:
      err.response?.data?.err in errors ? errors[err.response?.data?.err as keyof typeof errors] : errors.unknown,
  })
  apiError(err)
}
