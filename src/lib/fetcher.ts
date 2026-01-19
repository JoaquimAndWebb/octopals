/**
 * SWR Fetcher utility
 * A typed fetch wrapper for use with SWR
 */

export class FetchError extends Error {
  status: number
  info: unknown

  constructor(message: string, status: number, info?: unknown) {
    super(message)
    this.name = 'FetchError'
    this.status = status
    this.info = info
  }
}

/**
 * Default fetcher for SWR
 * Handles JSON responses and error states
 */
export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url)

  if (!res.ok) {
    let errorInfo: unknown
    try {
      errorInfo = await res.json()
    } catch {
      errorInfo = await res.text()
    }

    throw new FetchError(
      `An error occurred while fetching the data.`,
      res.status,
      errorInfo
    )
  }

  return res.json()
}

/**
 * Fetcher with authentication
 * Includes credentials and common headers
 */
export async function authFetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    let errorInfo: unknown
    try {
      errorInfo = await res.json()
    } catch {
      errorInfo = await res.text()
    }

    throw new FetchError(
      `An error occurred while fetching the data.`,
      res.status,
      errorInfo
    )
  }

  return res.json()
}

/**
 * POST fetcher for mutations
 */
export async function postFetcher<T = unknown, D = unknown>(
  url: string,
  data: D
): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    let errorInfo: unknown
    try {
      errorInfo = await res.json()
    } catch {
      errorInfo = await res.text()
    }

    throw new FetchError(
      `An error occurred while posting the data.`,
      res.status,
      errorInfo
    )
  }

  return res.json()
}

/**
 * PATCH fetcher for updates
 */
export async function patchFetcher<T = unknown, D = unknown>(
  url: string,
  data: D
): Promise<T> {
  const res = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    let errorInfo: unknown
    try {
      errorInfo = await res.json()
    } catch {
      errorInfo = await res.text()
    }

    throw new FetchError(
      `An error occurred while updating the data.`,
      res.status,
      errorInfo
    )
  }

  return res.json()
}

/**
 * DELETE fetcher
 */
export async function deleteFetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    let errorInfo: unknown
    try {
      errorInfo = await res.json()
    } catch {
      errorInfo = await res.text()
    }

    throw new FetchError(
      `An error occurred while deleting the data.`,
      res.status,
      errorInfo
    )
  }

  return res.json()
}
