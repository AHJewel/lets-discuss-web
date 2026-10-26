import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { isAxiosError } from 'axios'
import { Link, useNavigate } from 'react-router'
import { register, type RegisterPayload } from './api'
import { useAuthStore } from './store'

type FieldName = keyof RegisterPayload

interface ValidationErrorBody {
  message?: string
  errors?: Partial<Record<FieldName, string[]>>
}

export function RegisterPage() {
  const [form] = Form.useForm<RegisterPayload>()
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      setUser(user)
      void navigate('/dashboard')
    },
    onError: (error) => {
      if (isAxiosError<ValidationErrorBody>(error) && error.response?.status === 422) {
        const errors = error.response.data.errors ?? {}
        form.setFields(
          Object.entries(errors).map(([name, messages]) => ({
            name: name as FieldName,
            errors: messages,
          })),
        )
      }
    },
  })

  const formError = (() => {
    const error = mutation.error
    if (!error) return null
    if (isAxiosError(error) && error.response?.status === 422) return null
    if (isAxiosError(error) && error.response?.status === 429) {
      return 'Too many attempts. Please wait a minute and try again.'
    }
    return 'Something went wrong. Please try again.'
  })()

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card className="w-full">
        <Typography.Title level={3}>Create your account</Typography.Title>
        {formError && <Alert type="error" message={formError} showIcon className="mb-4" />}
        <Form<RegisterPayload>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => mutation.mutate(values)}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Enter your name' }]}
          >
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Enter your email' },
              { type: 'email', message: 'Enter a valid email address' },
            ]}
          >
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            extra="At least 8 characters with upper and lower case letters and a number."
            rules={[
              { required: true, message: 'Enter a password' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label="Confirm password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Confirm your password' },
              ({ getFieldValue }) => ({
                validator: (_, value: string | undefined) =>
                  !value || getFieldValue('password') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Passwords do not match')),
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
            Register
          </Button>
        </Form>
        <Typography.Paragraph className="mt-4 mb-0">
          Already have an account? <Link to="/login">Log in</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  )
}
