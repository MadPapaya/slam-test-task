import {useState} from "react";
import {Navigate} from 'react-router-dom';
import {useNavigate} from "react-router";
import {loadAuth, removeTokens, setTokens} from "../api/api";

function Login({setToken}) {
  const isTokenPresent = loadAuth()
  const [formData, setFormData] = useState({
    email: 'john@mail.com',
    password: 'changeme'
  })
  const [error, setError] = useState(false)
  const nav = useNavigate()

  if (isTokenPresent) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const response = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // body data type must match "Content-Type" header
    })

    if (response.ok) {
      const data = await response.json();
      setToken(data);
      setTokens(data)
      nav('/')
    } else {
      setError(true)
      removeTokens()
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={(e) => onSubmit(e)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prevState => {
                    return {password: prevState.password, email: e.target.value}
                  })}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prevState => {
                    return {password: e.target.value, email: prevState.email}
                  })}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Sign up
              </a>
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default Login