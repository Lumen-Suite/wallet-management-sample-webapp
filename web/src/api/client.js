import axios from 'axios'

const baseURL = `${import.meta.env.VITE_BFF_URL}/api`

export const api = axios.create({
  baseURL,
  timeout: 20000,
})

export function extractError(err) {
  return (
    err?.response?.data?.error ||
    err?.message ||
    'Something went wrong. Please try again.'
  )
}
