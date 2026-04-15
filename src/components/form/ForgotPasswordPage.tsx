import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../header/Header";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");

  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate reset token");
      }

      toast.success(data.message || "Reset token generated");

      if (data.resetToken) {
        setGeneratedToken(data.resetToken);
        setToken(data.resetToken);
      }

      setStep(2);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate reset token");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Password reset failed");
      }

      toast.success("Password reset successful");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 border">

          <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
          <p className="text-gray-600 mb-6">
            {step === 1
              ? "Enter your email to generate a reset token."
              : "Enter the token and your new password."}
          </p>

          {step === 1 && (
            <form onSubmit={handleGenerateToken} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Reset Token"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {generatedToken && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm">
                  <p className="font-semibold mb-1">Demo reset token</p>
                  <p className="break-all">{generatedToken}</p>
                </div>
              )}

              <div>
                <label className="block mb-2 font-medium">Reset Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Enter reset token"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-6 text-sm">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
