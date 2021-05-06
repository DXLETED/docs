import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
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
  async withToken(config: AxiosRequestConfig, thunkApi: any) {
    const accessToken = thunkApi.getState().auth.accessToken
    try {
      return await this.create({
        ...config,
        headers: { authorization: accessToken && `Bearer ${accessToken}`, ...config.headers },
      })
    } catch (err) {
      if (err.status === 401) {
        !this.isRefreshing && await this.refreshTokens(thunkApi)
        return this.create(config)
      }
      if (err.status === 403) this.logout(thunkApi)
      throw err
    }
  }
  async refreshTokens(thunkApi: any) {
    this.isRefreshing = true
    await this.create({ data: { refreshToken: thunkApi.getState().auth.refreshToken } })
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
  private logout(thunkApi: any) {
    thunkApi.dispatch(authActions.reset())
  }
}

export const request = new Request()
