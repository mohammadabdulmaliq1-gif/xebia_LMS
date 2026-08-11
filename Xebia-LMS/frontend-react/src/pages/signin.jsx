
import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card, { CardBody } from "../../components/common/Card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const errorParam = searchParams.get("error");
  const routeAuthError = errorParam === "CredentialsSignin"
    ? "Invalid username or password credentials. Please try again."
    : errorParam
      ? "An error occurred during authentication."
      : "";

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setAuthError("Invalid email or password. Use the demo credentials below.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setAuthError("Connection error. Ensure your NextAuth parameters are correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
    setAuthError("");
  };

  return (
    <div className="max-w-md w-full space-y-6">
      {/* Branding header */}
      <div className="flex flex-col items-center text-center gap-4">
        <img
          src="/xebia-logo.png"
          alt="Xebia Logo"
          width={120}
          height={60}
          className="object-contain"
          style={{ width: "120px", height: "auto" }}
          priority
        />
        <h1 className="text-xl font-bold text-primary tracking-tight">Academy LMS Portal</h1>
      </div>

      {/* Login Card */}
      <Card className="shadow-lg border border-border">
        <CardBody className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">Sign In</h2>
            <p className="text-xs text-text-muted">Enter your organizational SSO credentials below</p>
          </div>

          {(authError || routeAuthError) && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-lg text-xs font-semibold text-rose-700 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{authError || routeAuthError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@xebia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                disabled={loading}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Helper Section */}
          <div className="border-t border-border pt-4 space-y-3 bg-gray-50/50 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              SSO Demo Credentials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("learner@xebia.com", "learner123")}
                className="p-2 border border-border bg-white text-left rounded-lg text-xs hover:border-primary hover:text-primary transition-all duration-150"
              >
                <span className="font-bold block">Learner Account</span>
                <span className="text-text-muted block mt-0.5 truncate">learner@xebia.com / learner123</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("admin@xebia.com", "admin123")}
                className="p-2 border border-border bg-white text-left rounded-lg text-xs hover:border-primary hover:text-primary transition-all duration-150"
              >
                <span className="font-bold block">Admin Account</span>
                <span className="text-text-muted block mt-0.5 truncate">admin@xebia.com / admin123</span>
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Technical Footer */}
      <p className="text-center text-xs text-text-muted font-medium">
        Secured with NextAuth JSON Web Tokens & SSO authorization callbacks.
      </p>
    </div>
  );
}

export default function SigninPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-text-muted font-bold uppercase tracking-wider animate-pulse">Loading SSO Gateway...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
