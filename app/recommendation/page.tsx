"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Leaf, MapPin, Thermometer, Droplets, Loader2 } from "lucide-react"

export default function RecommendationPage() {
  const [formData, setFormData] = useState({
    location: "",
    soilType: "",
    season: "",
    rainfall: "",
    temperature: "",
    farmSize: "",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateRecommendations = async () => {
    setIsAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setRecommendations([
        {
          crop: "Rice",
          suitability: 95,
          expectedYield: "4.5 tons/hectare",
          profitability: "High",
          season: "Kharif",
          reasons: ["Ideal soil pH", "Sufficient rainfall", "Optimal temperature"],
        },
        {
          crop: "Wheat",
          suitability: 88,
          expectedYield: "3.2 tons/hectare",
          profitability: "Medium",
          season: "Rabi",
          reasons: ["Good soil drainage", "Suitable climate", "Market demand"],
        },
        {
          crop: "Sugarcane",
          suitability: 82,
          expectedYield: "65 tons/hectare",
          profitability: "High",
          season: "Annual",
          reasons: ["Rich soil nutrients", "Adequate water supply"],
        },
      ])
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Crop Recommendation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get personalized crop recommendations based on your location, soil, and climate conditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Farm Details
                </CardTitle>
                <CardDescription>Provide information about your farm conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soil-type">Soil Type</Label>
                  <Select onValueChange={(value) => handleInputChange("soilType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                      <SelectItem value="loamy">Loamy</SelectItem>
                      <SelectItem value="silt">Silt</SelectItem>
                      <SelectItem value="peaty">Peaty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season">Season</Label>
                  <Select onValueChange={(value) => handleInputChange("season", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                      <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                      <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    placeholder="e.g., 1200"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange("rainfall", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Average Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange("temperature", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farm-size">Farm Size (hectares)</Label>
                  <Input
                    id="farm-size"
                    type="number"
                    placeholder="e.g., 2.5"
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange("farmSize", e.target.value)}
                  />
                </div>

                <Button onClick={generateRecommendations} disabled={isAnalyzing} className="w-full" size="lg">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Get Recommendations"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Recommended Crops
                </CardTitle>
                <CardDescription>AI-powered crop recommendations based on your farm conditions</CardDescription>
              </CardHeader>
              <CardContent>
                {!recommendations.length && !isAnalyzing && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Fill in your farm details to get personalized crop recommendations
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
                    <p className="text-gray-600 dark:text-gray-300">Analyzing your farm conditions...</p>
                  </div>
                )}

                {recommendations.length > 0 && (
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{rec.crop}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary">{rec.suitability}% Suitable</Badge>
                                <Badge variant={rec.profitability === "High" ? "default" : "outline"}>
                                  {rec.profitability} Profit
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-300">Expected Yield</p>
                              <p className="font-semibold">{rec.expectedYield}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Best Season:</p>
                              <Badge variant="outline">{rec.season}</Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Why Recommended:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {rec.reasons.map((reason: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Climate Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Our AI considers temperature, humidity, rainfall patterns, and seasonal variations to recommend the most
                suitable crops.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Soil Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Soil type, pH levels, nutrient content, and drainage capabilities are analyzed to match crops with
                optimal growing conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Recommendations include market demand, pricing trends, and profitability analysis to maximize your
                farming returns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
