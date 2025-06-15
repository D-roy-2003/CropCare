"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"

export default function DiseasePredictionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setResult({
        disease: "Leaf Blight",
        confidence: 92.5,
        severity: "Moderate",
        treatment: "Apply copper-based fungicide and improve drainage",
        prevention: "Ensure proper spacing between plants and avoid overhead watering",
      })
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Disease Prediction</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload an image of your crop to detect diseases using our AI-powered CNN model
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Upload Crop Image
              </CardTitle>
              <CardDescription>Take a clear photo of the affected plant or upload an existing image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                {selectedImage ? (
                  <div className="space-y-4">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Uploaded crop"
                      width={300}
                      height={200}
                      className="mx-auto rounded-lg object-cover"
                    />
                    <Button onClick={() => setSelectedImage(null)} variant="outline" size="sm">
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="text-sm text-gray-600 dark:text-gray-300">Click to upload or drag and drop</div>
                        <div className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</div>
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={analyzeImage} disabled={!selectedImage || isAnalyzing} className="w-full" size="lg">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  "Analyze for Diseases"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>AI-powered disease detection results</CardDescription>
            </CardHeader>
            <CardContent>
              {!result && !isAnalyzing && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Upload an image to see analysis results
                </div>
              )}

              {isAnalyzing && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
                  <p className="text-gray-600 dark:text-gray-300">Analyzing image with CNN model...</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Disease Detected:</span>
                    <Badge variant="destructive">{result.disease}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Confidence:</span>
                    <Badge variant="secondary">{result.confidence}%</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Severity:</span>
                    <Badge variant="outline">{result.severity}</Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Treatment Recommendation:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                      {result.treatment}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      Prevention Tips:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                      {result.prevention}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How it Works</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our CNN model analyzes crop images to identify diseases with 95% accuracy, trained on thousands of plant
                disease images.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Currently supports rice, wheat, corn, tomato, potato, and 20+ other major crops with continuous model
                updates.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                For best results, capture clear, well-lit images of affected leaves or plant parts from multiple angles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
