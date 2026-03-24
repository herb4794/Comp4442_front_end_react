import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContextObj } from '../../store/Context'

const SignInModal = ({ open, handler }: any) => {

  const formRef = useRef<any>("")
  const { setAuth } = useContext(ContextObj)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault() // 🔥 防止 reload（你原本冇❗）

    const email = formRef.current[0].value
    const password = formRef.current[1].value

    try {
      setLoading(true)

      // 🔥 call backend
      const res = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      // 🔥 set login state（你原本 Context）
      setAuth({
        email: data.email,
        displayName: data.name
      })

      alert("Login success ✅")
      handler()

    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative z-10" role="dialog" aria-modal={open}>
      <div className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">

          <h2 className="text-2xl font-bold text-center mb-6">
            Login
          </h2>

          <form ref={formRef} onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full border rounded px-3 py-2"
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full border rounded px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>

          </form>

          <button
            onClick={handler}
            className="mt-4 w-full border py-2 rounded"
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  )
}

const Header = () => {
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = () => setOpen(!open)

  useEffect(() => {

  }, [open])


  return (

    <div>
      {open && <SignInModal open={open} handler={handleOpen} />}


      <nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-7" alt="Flowbite Logo" />
            <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Comp4442 Booking System</span>
          </a>
          <div className="inline-flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button onClick={handleOpen} type="button" className="text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none">Login</button>
            <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-9 h-9 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-cta" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5 7h14M5 12h14M5 17h14" /></svg>
            </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
              <li>
                <a href="#" className="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Home</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">About</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Services</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Header
