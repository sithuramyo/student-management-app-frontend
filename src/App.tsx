import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useErrorStore } from './store/errorStore';
import ApiNotFound from './pages/clients/ApiNotFound';

const queryClient = new QueryClient();

const App = () => {
  const { showNotFound, notFoundMessage, clearNotFound } = useErrorStore();

  return (
    <QueryClientProvider client={queryClient}>
      {showNotFound && (
        <ApiNotFound message={notFoundMessage} onClose={clearNotFound} />
      )}
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
