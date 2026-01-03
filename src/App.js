import { createHashRouter,
        createRoutesFromElements,
        Route,
        RouterProvider,
        Navigate, 
        Outlet} from 'react-router-dom'

import Home from './pages/Home'

function RootLayout() {
  return (
    <Outlet />
  )
}

const router = createHashRouter(createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
))

export default function App() {
  return (
    <RouterProvider router={router}/>
  )
}