export const requestError = (err: any) =>
  alert(err.response ? `${err.response?.status} | ${err.response?.statusText}` : err)
