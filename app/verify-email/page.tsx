"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, CheckCircle, XCircle } from "lucide-react"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setError("Invalid verification link")
      setIsLoading(false)
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Verification failed")
      }

      setSuccess(result.message)
      
      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push("/login")
      }, 3000)

    } catch (err: any) {
      setError(err.message || "An error occurred during verification")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
            {isLoading ? (
              <Loader2 className="h-8 w-8 text-green-600 dark:text-green-400 animate-spin" />
            ) : success ? (
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "Verifying..." : success ? "Email Verified!" : "Verification Failed"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isLoading 
              ? "Please wait while we verify your email address"
              : success 
                ? "Your email has been successfully verified"
                : "There was a problem verifying your email"
            }
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              {isLoading 
                ? "Verifying your email address..."
                : success 
                  ? "You can now sign in to your account"
                  : "Please try again or contact support"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800 mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {success && (
                <Button asChild className="w-full">
                  <Link href="/login">Continue to Sign In</Link>
                </Button>
              )}

              {error && (
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/signup">Try Signing Up Again</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              )}

              {!error && !success && !isLoading && (
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Back to Login</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}