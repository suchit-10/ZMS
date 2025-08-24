import { api } from '../lib/http-client'

// Onboard API service — send the assembled payload to the backend onboard endpoint
export const onboardApi = {
  create: async (payload: unknown) => {
    // use shared api client which already sets baseURL and auth headers
    if (payload instanceof FormData) {
      return api.post('/v1/onboard', payload, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    return api.post('/v1/onboard', payload)
  }
}

export default onboardApi
