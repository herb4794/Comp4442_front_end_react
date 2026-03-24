import React, { useRef, useState } from 'react'

const SignUpModal = ({ open, handler }: any) => {
  const formRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const email = formRef.current[0].value
    const password = formRef.current[1].value
    const name = formRef.current[2].value

    try {
      setLoading(true)

      // 🔥 call backend
      const res = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          name
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Signup failed")
      }

      alert("Signup success ✅")
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
            Join the Cult Mechanicus
          </h2>

          <form ref={formRef} onSubmit={handleSignUp} className="space-y-4">

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

            <input
              type="text"
              placeholder="Display Name"
              required
              className="w-full border rounded px-3 py-2"
            />

            {/* 🔥 暫時 remove image upload（之後可再加 backend） */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              {loading ? "Signing up..." : "Sign Up"}
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

export default SignUpModal
