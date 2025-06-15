"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Eye, EyeOff, Check, X } from "lucide-react"
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const password = watch("password")

  useEffect(() => {
    if (token) {
      setValue("token", token)
    }
  }, [token, setValue])

  // Password strength validation
  const passwordRequirements = [
    { label: "At least 8 characters", test: (pwd: string) => pwd?.length >= 8 },
    { label: "One uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd || "") },
    { label: "One lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd || "") },
    { label: "One number", test: (pwd: string) => /\d/.test(pwd || "") },
    { label: "One special character", test: (pwd: string) => /[@$!%*?&]/.test(pwd || "") }
  ]

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setError("Invalid reset token")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, token }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Password reset failed")
      }

      setSuccess(result.message)
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push("/login")
      }, 3000)

    } catch (err: any) {
      setError(err.message || "An error occurred during password reset")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                This password reset link is invalid or has expired. Please request a new one.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button asChild>
                <Link href="/forgot-password">Request New Reset Link</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reset your password</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Enter your new password below
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">New Password</CardTitle>
            <CardDescription className="text-center">
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <input type="hidden" {...register("token")} />

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        {req.test(password) ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span className={req.test(password) ? "text-green-600" : "text-red-600"}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-green-600 hover:text-green-500 dark:text-green-400"
              >
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}