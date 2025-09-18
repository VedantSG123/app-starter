import type {
  PoolClient,
  QueryConfigValues,
  QueryResult,
  QueryResultRow,
} from 'pg'
import { Pool } from 'pg'

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  })
}

let pool: Pool | null = null

export function getPool() {
  if (!pool) {
    pool = createPool()
    pool.on('error', (err) => {
      console.error('Error with database pool idle client', err)
    })
    pool.on('connect', () => {
      console.debug('New client connected to database pool')
    })
    pool.on('remove', () => {
      console.debug('Client removed from database pool')
    })
  }
  return pool
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<R extends QueryResultRow, I = any[]>(
  sql: string,
  values?: QueryConfigValues<I>,
): Promise<QueryResult<R>> {
  const pool = getPool()
  return pool.query(sql, values)
}

export async function getClient() {
  const pool = getPool()
  const client: TrackedClient = await pool.connect()

  const originalQuery = client.query.bind(client)
  const originalRelease = client.release.bind(client)

  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    console.error(
      'The last executed query on this client was',
      client.lastQuery,
    )
  }, 5000)

  client.query = ((...args: Parameters<PoolClient['query']>) => {
    client.lastQuery = args
    return originalQuery(...args)
  }) as PoolClient['query']

  client.release = () => {
    clearTimeout(timeout)
    client.query = originalQuery
    client.release = originalRelease
    return originalRelease()
  }

  return client
}

type TrackedClient = PoolClient & {
  lastQuery?: Parameters<PoolClient['query']>
  query: PoolClient['query']
}
