import { Router } from 'express'
import { callLumen } from '../lumenClient.js'
import { validateQuery, walletListQuery } from '../middleware/validateQuery.js'

const r = Router()

r.get('/Custodial', validateQuery(walletListQuery), async (req, res, next) => {
  try {
    const { data } = await callLumen({
      method: 'GET',
      url: '/wallets/Custodial',
      params: req.query,
    })
    res.json(data)
  } catch (e) {
    next(e)
  }
})

r.get('/Custodial/:id', async (req, res, next) => {
  try {
    const { data } = await callLumen({
      method: 'GET',
      url: `/wallets/Custodial/${encodeURIComponent(req.params.id)}`,
    })
    res.json(data)
  } catch (e) {
    next(e)
  }
})

r.get('/Custodial/:addr/files', validateQuery(walletListQuery), async (req, res, next) => {
  try {
    const { data } = await callLumen({
      method: 'GET',
      url: `/wallets/Custodial/${encodeURIComponent(req.params.addr)}/files`,
      params: req.query,
    })
    res.json(data)
  } catch (e) {
    next(e)
  }
})

r.get('/Custodial/:addr/transactions', validateQuery(walletListQuery), async (req, res, next) => {
  try {
    const { data } = await callLumen({
      method: 'GET',
      url: `/wallets/Custodial/${encodeURIComponent(req.params.addr)}/transactions`,
      params: req.query,
    })
    res.json(data)
  } catch (e) {
    next(e)
  }
})

export default r
