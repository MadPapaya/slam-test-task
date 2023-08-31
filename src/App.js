import {Route, Routes} from "react-router-dom";
import Catalog from "./pages/Catalog";
import Login from "./pages/Login";
import {useEffect, useState} from "react";
import {loadAuth, removeTokens, setTokens} from "./api/api";
import {useNavigate} from "react-router";
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => loadAuth())
  const nav = useNavigate()

  const getUser = async (token) => {
    const response = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
      headers: {
        "Authorization": `Bearer ${token.access_token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      setUser(data);
    } else if (token?.refresh_token) {
      const response = await fetch('https://api.escuelajs.co/api/v1/auth/refresh-token', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "refreshToken": token.refresh_token
        })
      })

      if (response.ok) {
        const data = await response.json()
        setTokens(data)
        setToken(data);
      } else {
        removeTokens()
      }
    } else {
      removeTokens()
    }
  }

  useEffect(() => {
    if (token?.access_token && !user) {
      getUser(token)
    }
  }, [token, user])

  const handleLogout = () => {
    removeTokens()
    setToken('')
    setUser(null)
  }

  const handleLogin = () => {
    nav('/login')
  }


  return (
    <>
      <Header user={user} onHandleLogout={handleLogout} onHandleLogin={handleLogin}/>

      <Routes>
        <Route index element={<Catalog/>}/>
        <Route path="/login" element={<Login setToken={setToken}/>}/>
        <Route path="*" element={<p>There's nothing here: 404!</p>}/>
      </Routes>
    </>
  );
}

export default App;
