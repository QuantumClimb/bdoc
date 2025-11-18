/**
 * 404 Not Found Page
 */

import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        
        <Button
          onClick={() => navigate("/")}
          variant="primary"
          size="lg"
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
