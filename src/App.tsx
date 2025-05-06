import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative">
        <RouterProvider router={router} />
      </div>
    </QueryClientProvider>
  );
};

export default App;
