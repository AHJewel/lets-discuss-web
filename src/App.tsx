import { StyleProvider } from '@ant-design/cssinjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router'
import { router } from './routes/router'

const queryClient = new QueryClient()

export default function App() {
  return (
    <StyleProvider layer>
      <ConfigProvider>
        <AntApp>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  )
}
