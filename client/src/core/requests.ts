import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from 'store'
import { authActions } from 'store/auth'
import { api } from './api'

const Axios = axios.create()

interface IRequest extends AxiosRequestConfig {
  res: (res: AxiosResponse) => void
  rej: (res: AxiosError) => void
}

class Requests {
  queue: IRequest[] = []
  isAuthorized: boolean = false
  create(config: AxiosRequestConfig, { force = false } = {}) {
    return new Promise((res: (res: AxiosResponse) => void, rej: (res: AxiosError) => void) => {
      const req = { ...config, res, rej }
      force ? this.queue.unshift(req) : this.queue.push(req)
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
  private async makeRequest(req: IRequest) {
    const { res, rej, ...params } = req
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
    this.queue = this.queue.filter(rq => rq !== req)
    this.next()
  }
}

export const requests = new Requests()
