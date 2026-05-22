import { z } from 'zod'

const SORT_FIELDS = new Set([
  'WalletAddress',
  'Provider.AccountName',
  'Provider.Email',
  'Name',
  'FileExtension',
  'OwnerAddress',
  'CreatedAt',
  'UpdatedAt',
])

const numericString = (min, max, fallback) =>
  z
    .preprocess((v) => (v === undefined || v === '' ? fallback : Number(v)), z.number().int().min(min).max(max))

const sortFieldSchema = z
  .string()
  .optional()
  .refine((v) => v === undefined || SORT_FIELDS.has(v), {
    message: 'Unsupported sort field',
  })

export const walletListQuery = z
  .object({
    pageNumber: numericString(1, 10000, 1),
    pageSize: numericString(1, 100, 10),
    search: z.string().max(200).optional(),
    'sort[0][field]': sortFieldSchema,
    'sort[0][order]': z.enum(['asc', 'desc']).optional(),
  })
  .passthrough()

export function validateQuery(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      const err = new Error(result.error.issues.map((i) => i.path.join('.') + ': ' + i.message).join('; '))
      err.status = 400
      return next(err)
    }
    req.query = result.data
    next()
  }
}
