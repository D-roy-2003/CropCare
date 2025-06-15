"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CloudRain, Sun, Cloud, Wind, Droplets, Thermometer, Eye, MapPin, Search } from "lucide-react"

export default function WeatherPage() {
  const [location, setLocation] = useState("")
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [forecast, setForecast] = useState<any[]>([])

  // Simulate weather data
  useEffect(() => {
    // Default weather for demo
    setCurrentWeather({
      location: "New Delhi, India",
      temperature: 28,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      visibility: 8,
      uvIndex: 6,
      pressure: 1013,
    })

    setForecast([
      { day: "Today", high: 32, low: 24, condition: "Sunny", icon: "sun", precipitation: 0 },
      { day: "Tomorrow", high: 29, low: 22, condition: "Cloudy", icon: "cloud", precipitation: 20 },
      { day: "Wednesday", high: 26, low: 20, condition: "Rainy", icon: "rain", precipitation: 80 },
      { day: "Thursday", high: 28, low: 21, condition: "Partly Cloudy", icon: "cloud", precipitation: 10 },
      { day: "Friday", high: 31, low: 23, condition: "Sunny", icon: "sun", precipitation: 0 },
      { day: "Saturday", high: 30, low: 24, condition: "Cloudy", icon: "cloud", precipitation: 30 },
      { day: "Sunday", high: 27, low: 21, condition: "Rainy", icon: "rain", precipitation: 70 },
    ])
  }, [])

  const searchWeather = () => {
    // Simulate API call
    console.log("Searching weather for:", location)
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
      case "partly cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const getForecastIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloud":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rain":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Weather Forecasting</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get accurate weather predictions to plan your farming activities
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter location (city, state, country)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={searchWeather}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Weather */}
        {currentWeather && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Current Weather
              </CardTitle>
              <CardDescription>{currentWeather.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center space-x-4">
                  {getWeatherIcon(currentWeather.condition)}
                  <div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {currentWeather.temperature}°C
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-300">{currentWeather.condition}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Humidity</div>
                      <div className="font-semibold">{currentWeather.humidity}%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Wind Speed</div>
                      <div className="font-semibold">{currentWeather.windSpeed} km/h</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Visibility</div>
                      <div className="font-semibold">{currentWeather.visibility} km</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">UV Index</div>
                      <div className="font-semibold">{currentWeather.uvIndex}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 7-Day Forecast */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
            <CardDescription>Plan your farming activities with extended weather predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {forecast.map((day, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium text-sm mb-2">{day.day}</div>
                  <div className="flex justify-center mb-2">{getForecastIcon(day.icon)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{day.condition}</div>
                  <div className="text-sm">
                    <div className="font-semibold">{day.high}°</div>
                    <div className="text-gray-500">{day.low}°</div>
                  </div>
                  <div className="mt-2">
                    <Badge variant={day.precipitation > 50 ? "default" : "secondary"} className="text-xs">
                      {day.precipitation}% rain
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farming Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Farming Recommendations</CardTitle>
            <CardDescription>Weather-based suggestions for your farming activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-green-700 dark:text-green-400">Today's Activities</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Good day for irrigation - moderate temperature
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Suitable for pesticide application - low wind
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Monitor UV levels for worker safety
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-blue-700 dark:text-blue-400">This Week's Outlook</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Rain expected Wednesday - postpone harvesting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Good conditions for planting Thursday-Friday
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Weekend rain may affect field access
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
