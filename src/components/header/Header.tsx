import playIcon from '../../assets/playIcon.png'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ContextObj } from '../../store/Context'
import SignUpModal from './SigUpModal'
import toast from 'react-hot-toast'

const SignInModal = ({ open, handler, goToSignUp }: any) => {

  const formRef = useRef<HTMLFormElement | null>(null);
  const { setAuth, loginStatus, api } = useContext(ContextObj);
  const [loading, setLoading] = useState(false);


  if (!open) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const form = formRef.current;
    const email = (form[0] as HTMLInputElement).value;
    const password = (form[1] as HTMLInputElement).value;

    try {

      setLoading(true);

      const res = await fetch(`${api}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setAuth({
        email: data.email,
        role: data.role,
      });

      toast.success("Login success");
      handler();
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10" role="dialog" aria-modal={open}>
      <div className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 flex flex-col items-center">

          <h2 className="text-2xl font-bold text-center mb-6">
            Login
          </h2>

          <div className="text-center w-full max-w-sm mx-auto bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs">
            <form ref={formRef} onSubmit={handleLogin}>
              <h5 className="text-xl font-semibold text-heading mb-6">Sign in to our platform</h5>
              <div className="mb-4">
                <label className="block mb-2.5 text-sm font-medium text-heading">Your email</label>
                <input type="email" id="email" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="example@company.com" required />
              </div>
              <div>
                <label className="block mb-2.5 text-sm font-medium text-heading">Your password</label>
                <input type="password" id="password" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="•••••••••" required />
              </div>
              <div className="flex items-start my-6">
                <div className="flex items-center">
                  <input id="checkbox-remember" type="checkbox" value="" className="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft" />
                  <label className="ms-2 text-sm font-medium text-heading">Remember me</label>
                </div>
                <Link to="forgot-password" onClick={handler} className="ms-auto text-sm font-medium text-fg-brand hover:underline">Lost Password?</Link>
              </div>
              <button type="submit" className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3">Login to your account</button>
              <div className="text-sm font-medium text-body">Not registered?
                <button
                  type="button"
                  onClick={goToSignUp}
                  className="text-fg-brand hover:underline"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>


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
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const { loginStatus, signOut } = useContext(ContextObj)

  useEffect(() => {

  }
    , [loginStatus])

  return (

    <div>
      {showSignIn && (
        <SignInModal
          open={showSignIn}
          handler={() => setShowSignIn(false)}
          goToSignUp={() => {
            setShowSignIn(false)
            setShowSignUp(true)
          }}
        />
      )}

      {showSignUp && (
        <SignUpModal
          open={showSignUp}
          handler={() => setShowSignUp(false)}
          goToSignIn={() => {
            setShowSignUp(false)
            setShowSignIn(true)
          }}
        />
      )}


      <nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
        <div className="relative max-w-screen-xl flex items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={playIcon} className="h-7" alt="Flowbite Logo" />
            <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Comp4442 Playroom System</span>
          </div>
          <div className="inline-flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

            {loginStatus === false ?
              <button onClick={() => setShowSignIn(true)} type="button" className="text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none">
                Login
              </button> :
              <button onClick={() => signOut()} type="button" className="text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none">
                SignOut
              </button>
            }

            <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-9 h-9 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-cta" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" /></svg>
            </button>
          </div>
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center"
            id="navbar-cta">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
              <li>
                <Link to="/" className="block py-2 px-3 text-white bg-brand rounded md:bg-transparent md:text-fg-brand md:p-0" aria-current="page">Home</Link>
              </li>
              {loginStatus === true ?
                <li>
                  <Link to="/booking" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">booking</Link>
                </li> : null
              }
              <li>
              </li>
              <li>
              </li>
            </ul>
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Header
