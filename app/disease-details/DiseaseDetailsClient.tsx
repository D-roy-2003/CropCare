"use client";

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Shield, 
  Leaf, 
  Calendar,
  Thermometer,
  Droplets,
  Sun,
  Bug,
  Microscope,
  BookOpen,
  Download,
  Share2,
  Loader2,
  Copy,
  MessageCircle,
  Mail
} from "lucide-react"
import Image from "next/image"
import { generateDiseasePDF } from "@/lib/pdf-generator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DiseaseDetails {
  disease: string
  confidence: number
  severity: string
  treatment: string
  prevention: string
  imageUrl: string
}

// Disease class to user-friendly name mapping
const diseaseNameMap: Record<string, string> = {
  "Apple__Healthy": "Healthy Apple Leaf",
  "Apple___Apple_scab": "Apple Scab Disease",
  "Apple___Black_rot": "Apple Black Rot Disease",
  "Apple___Cedar_rust": "Apple Cedar Rust Disease",
  "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot": "Corn Gray Leaf Spot (Cercospora Leaf Spot) Disease",
  "Corn_(maize)___Common_rust_": "Corn Common Rust Disease",
  "Corn_(maize)___Northern_Leaf_Blight": "Corn Northern Leaf Blight Disease ",
  "Corn_(maize)___healthy": "Healthy Corn Leaf",
  "Grape_Black_rot": "Grape Black Rot Disease",
  "Grape__Healthy": "Healthy Grape Leaf",
  "Grape___Esca_(Black_Measles)": "Grape Esca (Black Measles) Disease",
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "Grape Leaf Blight (Isariopsis Leaf Spot) Disease",
  "Rice_Bacterialblight": "Rice Bacterial Blight Disease",
  "Rice_BrownSpot": "Rice Brown Spot Disease",
  "Rice_Healthy": "Healthy Rice Leaf",
  "Rice_LeafBlast": "Rice Leaf Blast Disease",
  "Rice__Tungro__disease": "Rice Tungro Disease",
  "Tomato___Bacterial_spot": "Tomato Bacterial Spot Disease",
  "Tomato___Early_blight": "Tomato Early Blight Disease",
  "Tomato___Late_blight": "Tomato Late Blight Disease",
  "Tomato___Leaf_Mold": "Tomato Leaf Mold Disease",
  "Tomato___Septoria_leaf_spot": "Tomato Septoria Leaf Spot Disease",
  "Tomato___Spider_mites Two-spotted_spider_mite": "Tomato Spider Mites (Two-Spotted Spider Mite) Disease",
  "Tomato___Target_Spot": "Tomato Target Spot Disease",
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "Tomato Yellow Leaf Curl Virus",
  "Tomato___Tomato_mosaic_virus": "Tomato Mosaic Virus",
  "Tomato___healthy": "Healthy Tomato Leaf"
};

export default function DiseaseDetailsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [diseaseData, setDiseaseData] = useState<DiseaseDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)
  const [geminiInfo, setGeminiInfo] = useState<any>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    // Get data from URL parameters
    const disease = searchParams.get('disease')
    const confidence = searchParams.get('confidence')
    const severity = searchParams.get('severity')
    const treatment = searchParams.get('treatment')
    const prevention = searchParams.get('prevention')
    const imageUrl = searchParams.get('imageUrl')

    if (disease && confidence && severity && treatment && prevention && imageUrl) {
      setDiseaseData({
        disease,
        confidence: parseFloat(confidence),
        severity,
        treatment,
        prevention,
        imageUrl
      })
    }
    setIsLoading(false)
  }, [searchParams])

  useEffect(() => {
    if (diseaseData?.disease) {
      setGeminiLoading(true);
      setGeminiError(null);
      fetch("/api/gemini-disease-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease: diseaseData.disease })
      })
        .then(res => res.json())
        .then(data => {
          setGeminiInfo(data);
          if (data.error) setGeminiError(data.error);
        })
        .catch(e => setGeminiError(e?.toString() || "Unknown error"))
        .finally(() => setGeminiLoading(false));
    }
  }, [diseaseData?.disease]);

  useEffect(() => {
    // Check authentication on mount
    if (typeof window !== 'undefined') {
      setIsAuthenticated(Boolean(localStorage.getItem('user')));
    }
  }, []);

  // Create shareable link when needed (not automatically)
  const createShareableLink = async () => {
    if (!diseaseData || shareUrl) return shareUrl

    try {
      const controller = new AbortController()
      // Increased timeout from 10 to 20 seconds to match server timeout
      const timeoutId = setTimeout(() => controller.abort(), 20000) // 20 second timeout

      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(diseaseData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        setShareUrl(data.shareUrl)
        return data.shareUrl
      } else {
        throw new Error('Failed to create shareable link')
      }
    } catch (error: any) {
      console.error('Failed to create shareable link:', error)
      setShareError('Failed to create shareable link')
      // Return current page URL as fallback
      const fallbackUrl = window.location.href
      setShareUrl(fallbackUrl)
      return fallbackUrl
    }
  }

  const getDetailedTreatment = (disease: string, basicTreatment: string) => {
    // Enhanced treatment recommendations based on disease type
    const treatments = {
      "Tomato Curl Virus": [
        "Remove and destroy infected plants immediately to prevent spread",
        "Apply systemic insecticides to control whitefly vectors (Imidacloprid 17.8% SL @ 0.3ml/L)",
        "Use reflective mulches (silver/aluminum) to repel whiteflies",
        "Spray neem oil (1500 ppm) every 7-10 days as organic treatment",
        "Install yellow sticky traps around the field perimeter",
        "Apply micronutrient spray containing Zinc and Boron",
        "Maintain proper plant spacing for better air circulation",
        "Use resistant varieties like Arka Vikas or Pusa Ruby for future planting"
      ],
      "Apple Cedar Rust": [
        "Apply fungicide sprays during wet spring weather (Myclobutanil @ 1ml/L)",
        "Remove nearby juniper trees within 2-mile radius if possible",
        "Prune infected branches 6 inches below visible symptoms",
        "Apply copper-based fungicides during dormant season",
        "Use systemic fungicides like Propiconazole during active growth",
        "Improve air circulation by proper pruning and spacing",
        "Apply lime sulfur spray during dormant season",
        "Consider resistant apple varieties for replanting"
      ],
      "Healthy": [
        "Continue current management practices",
        "Maintain regular monitoring schedule",
      ]
    }
    return treatments[disease as keyof typeof treatments] || [basicTreatment]
  }

  // ... rest of the component code ...
} 