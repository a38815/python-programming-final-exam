import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import viVN from 'antd/locale/vi_VN';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { StyleProvider } from '@ant-design/cssinjs';
import './index.css';

import {
  Admin,
  Home,
  PageNotFound,
  ProductDetails,
  ProductManagement,
  CategoryManagement
} from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/admin/products',
    element: <ProductManagement />,
  },
  {
    path: '/admin/categories',
    element: <CategoryManagement />,
  },
  {
    path: '/:slug',
    element: <ProductDetails />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyleProvider hashPriority="high">
      <ConfigProvider locale={viVN}>
        <ApolloProvider client={client}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </ConfigProvider>
    </StyleProvider>
  </React.StrictMode>,
);
