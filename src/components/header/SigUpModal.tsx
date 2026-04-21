import React, { useContext, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { ContextObj } from '../../store/Context'

const SignUpModal = ({ open, handler, goToSignIn }: any) => {
  const formRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const { api } = useContext(ContextObj)


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const email = formRef.current[0].value
    const password = formRef.current[1].value
    const role: number = 1

    try {
      setLoading(true)

      // 🔥 call backend
      const res = await fetch(`${api}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          role
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Signup failed")
      }

      toast.success("Signup success")
      handler()

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative z-10" role="dialog" aria-modal={open}>
      <div className="fixed inset-0 bg-gray-500/75" />

      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 flex flex-col items-center">

          <h2 className="text-2xl font-bold text-center mb-6">
            Sign Up you Account
          </h2>

          <div className="text-center w-full max-w-sm mx-auto bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs">
            <form ref={formRef} onSubmit={handleSignUp}>
              <h5 className="text-xl font-semibold text-heading mb-6">Sign up to our platform</h5>
              <div className="mb-4">
                <label className="block mb-2.5 text-sm font-medium text-heading">Your email</label>
                <input type="email" id="email" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="example@company.com" required />
              </div>
              <div>
                <label className="block mb-2.5 text-sm font-medium text-heading">Your password</label>
                <input type="password" id="password" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="•••••••••" required />
              </div>
              <div className="flex items-start my-6">
              </div>
              <button type="submit" className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3">Sign up to your account</button>
              <div className="text-sm font-medium text-body">
                <button
                  onClick={goToSignIn}
                  type="button"
                  className="text-fg-brand hover:underline"
                >
                  Back to Login
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

export default SignUpModal
