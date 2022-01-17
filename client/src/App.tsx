import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Register, Landing, Error, ProtectedRoute } from './pages';
import {
  AllExpenses,
  Profile,
  SharedLayout,
  Stats,
  AddExpense,
} from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-expenses" element={<AllExpenses />} />
          <Route path="add-expense" element={<AddExpense />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
