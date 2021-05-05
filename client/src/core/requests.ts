import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from 'store'
import { authActions } from 'store/auth'
import { api } from './api'

const Axios = axios.create({ baseURL: process.env.BASE_URL })

interface IRequest extends AxiosRequestConfig {
  res: (res: AxiosResponse) => void
  rej: (res: AxiosError) => void
}

class Requests {
  queue: IRequest[] = []
  isAuthorized: boolean = false
  create(config: AxiosRequestConfig) {
    return new Promise((res: (res: AxiosResponse) => void, rej: (res: AxiosError) => void) => {
      this.queue.push({ ...config, res, rej })
      this.start()
    })
  }
  private start() {
    this.queue.length === 1 && this.next()
  }
  private next() {
    this.queue.length && this.makeRequest(this.queue[0])
  }
  private async handleError(e: AxiosError) {
    if (e.response?.status === 401) {
      if (e.response.data?.err === 'jwt_expired') return api.auth.refresh()
      return store.dispatch(authActions.reset())
    }
    // Error notification
    console.log(e)
  }
  private async makeRequest({ res, rej, ...params }: IRequest) {
    const accessToken = store.getState().auth.accessToken
    try {
      const result = await Axios.request({
        headers: { authorization: accessToken && `Bearer ${accessToken}` },
        ...params,
      })
      res(result)
    } catch (e) {
      await this.handleError(e)
      rej(e)
    }
    this.next()
  }
}

export const requests = new Requests()
