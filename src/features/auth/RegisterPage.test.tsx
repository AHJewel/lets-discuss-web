import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { http } from '../../lib/http'
import { RegisterPage } from './RegisterPage'
import { useAuthStore } from './store'

vi.mock('../../lib/http', () => ({ http: { post: vi.fn() } }))

const post = http.post as unknown as Mock

function renderPage() {
  const router = createMemoryRouter(
    [
      { path: '/register', element: <RegisterPage /> },
      { path: '/dashboard', element: <h1>Dashboard</h1> },
    ],
    { initialEntries: ['/register'] },
  )
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

function httpError(status: number, data: unknown) {
  return new AxiosError('failed', undefined, undefined, undefined, {
    status,
    data,
  } as AxiosResponse)
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('Email'), 'ada@example.com')
  await user.type(screen.getByLabelText('Password'), 'Str0ng-Passw0rd!')
  await user.type(screen.getByLabelText('Confirm password'), 'Str0ng-Passw0rd!')
}

describe('RegisterPage', () => {
  beforeEach(() => {
    post.mockReset()
    useAuthStore.setState({ user: null, status: 'idle' })
  })

  it('shows validation messages and does not submit an empty form', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Enter your name')).toBeInTheDocument()
    expect(screen.getByText('Enter your email')).toBeInTheDocument()
    expect(screen.getByText('Enter a password')).toBeInTheDocument()
    expect(post).not.toHaveBeenCalled()
  })

  it('flags mismatched passwords', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText('Password'), 'Str0ng-Passw0rd!')
    await user.type(screen.getByLabelText('Confirm password'), 'Different1')
    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
    expect(post).not.toHaveBeenCalled()
  })

  it('registers, stores the user and redirects to the dashboard', async () => {
    const created = { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', role: 'user' }
    post.mockResolvedValue({ data: { data: created } })
    const user = userEvent.setup()
    renderPage()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(post).toHaveBeenCalledWith('/api/register', {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'Str0ng-Passw0rd!',
      password_confirmation: 'Str0ng-Passw0rd!',
    })
    expect(useAuthStore.getState()).toMatchObject({ user: created, status: 'authenticated' })
  })

  it('maps 422 errors under the matching fields', async () => {
    post.mockRejectedValue(
      httpError(422, {
        message: 'The email has already been taken.',
        errors: { email: ['The email has already been taken.'] },
      }),
    )
    const user = userEvent.setup()
    renderPage()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Register' }))

    expect(await screen.findByText('The email has already been taken.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).not.toBeInTheDocument()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('shows a form-level message when throttled', async () => {
    post.mockRejectedValue(httpError(429, { message: 'Too Many Attempts.' }))
    const user = userEvent.setup()
    renderPage()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Register' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Too many attempts'))
  })
})
