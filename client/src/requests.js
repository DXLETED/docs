import axios from 'axios'
import { store } from 'store'

const Axios = axios.create({ baseURL: process.env.API_URL })

class Requests {
  constructor() {
    this.queue = []
    this.isAuthorized = false
  }
  create(params) {
    return new Promise((res, rej) => {
      this.queue.push({ ...params, onSuccessful: res, onError: rej })
      this._start()
    })
  }
  _start() {
    this.queue.length === 1 && this._next()
  }
  _next() {
    this.queue.length && this._makeRequest(this.queue[0])
  }
  async refresh() {
    if (!store.getState().auth.refreshToken) store.dispatch({ type: 'auth/reset' })
    this.queue.unshift({
      method: 'POST',
      url: '/refresh',
      body: { refreshToken: store.getState().auth.refreshToken },
      onSuccessful: ({ data }) => store.dispatch({ type: 'auth/set/tokens', data }),
    })
  }
  async _handleError(e) {
    if (e.status === 401) {
      if (e.data?.err === 'expired') return this.refresh()
    }
    // Notification
    console.log(e)
  }
  async _makeRequest({ onSuccessful, onError, ...params }) {
    const accessToken = store.getState().auth.accessToken
    try {
      const res = await Axios.request({ headers: { authorozation: accessToken && `Bearer ${accessToken}` }, ...params })
      onSuccessful?.(res)
    } catch (e) {
      await this._handleError(e)
      onError?.(e)
    }
    this._next()
  }
}

export const requests = new Requests()
