import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { store } from 'store'
import { authActions } from 'store/auth'

const Axios = axios.create({ baseURL: 'http://localhost:3001' })

interface Req extends AxiosRequestConfig {
  res: (res: AxiosResponse) => void
  rej: (res: AxiosError) => void
}

class Request {
  queue: Req[] = []
  isRefreshing: boolean = false
  async withoutToken(config: AxiosRequestConfig) {
    return await this.create(config)
  }
  async withToken(config: AxiosRequestConfig) {
    const accessToken = store.getState().auth.accessToken as string | null
    try {
      return await this.create({
        ...config,
        headers: { authorization: accessToken && `Bearer ${accessToken}`, ...config.headers },
      })
    } catch (err) {
      if (err.status === 401) {
        await this.refreshTokens()
        return this.create(config)
      }
      if (err.status === 403) this.logout()
      throw err
    }
  }
  async refreshTokens() {
    this.isRefreshing = true
    await this.create({ data: { refreshToken: store.getState().auth.refreshToken } })
    this.isRefreshing = false
    this.queue.forEach(req => this.makeRequest(req))
  }
  private create(config: AxiosRequestConfig) {
    return new Promise((res: (res: AxiosResponse) => void, rej: (res: AxiosError) => void) => {
      const req = { ...config, res, rej }
      this.isRefreshing ? this.queue.push(req) : this.makeRequest(req)
    })
  }
  private async makeRequest(req: Req) {
    const { res, rej, ...config } = req
    try {
      res(await Axios.request(config))
    } catch (e) {
      alert(e)
      rej(e)
    }
    this.queue = this.queue.filter(rq => rq !== req)
  }
  private logout() {
    store.dispatch(authActions.reset())
  }
}

export const request = new Request()
