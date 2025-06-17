import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';

function Login() {
  const { isInitialized } = useContext(AuthContext);
  
  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-surface-800 rounded-lg shadow-md">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark text-white text-2xl 2xl:text-3xl font-bold">
            T
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold text-white">
              Sign in to ThreatGuard
            </div>
            <div className="text-center text-sm text-gray-400">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;