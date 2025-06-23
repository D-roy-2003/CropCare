"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  LogOut, 
  Edit, 
  Save,
  ChevronRight,
  Home,
  Leaf,
  TrendingUp,
  Shield,
  Camera
} from "lucide-react"

interface UserData {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  isEmailVerified: boolean
  createdAt?: string
}

const mockProfile = {
  fullName: 'Debangshu Roy',
  phone: '9876543210',
  countryCode: '+91',
  city: 'Kolkata',
  username: 'debu69',
  email: 'test@email.com',
  profileImage: '',
};
const mockStats = { scanned: 2, recommended: 0 };
const mockScanned = [
  { disease: 'Tomato Curl Virus', confidence: '94.87%', severity: 'Medium' },
  { disease: 'Apple Cedar Rust', confidence: '94.87%', severity: 'Medium' },
];
const mockRecommended = [
  { crop: 'jute', suitability: '4%', profit: 'Medium Profit', season: 'Kharif', yield: '2.0 tons/hectare', why: ['Sufficient rainfall', 'Adequate nitrogen levels'] },
  { crop: 'maize', suitability: '70%', profit: 'High Profit', season: 'Kharif', yield: '6.0 tons/hectare', why: ['High N requirement met', 'Warm temperature suitable', 'Sufficient rainfall'] },
  { crop: 'coffee', suitability: '63%', profit: 'High Profit', season: 'Annual', yield: '1.8 tons/hectare', why: ['High confidence prediction', 'Suitable temperature and humidity', 'Adaptable to soil pH'] },
];

const countryCodes = [
  { code: '+1', name: 'US', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+91', name: 'IN', flag: '🇮🇳' },
  { code: '+33', name: 'FR', flag: '🇫🇷' },
  { code: '+49', name: 'DE', flag: '🇩🇪' },
  { code: '+81', name: 'JP', flag: '🇯🇵' },
  { code: '+86', name: 'CN', flag: '🇨🇳' },
  { code: '+234', name: 'NG', flag: '🇳🇬' },
  { code: '+27', name: 'ZA', flag: '🇿🇦' },
  { code: '+20', name: 'EG', flag: '🇪🇬' },
];

export default function ProfilePage() {
  const [activePanel, setActivePanel] = useState<'settings' | 'scanned' | 'recommended'>('settings');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<{ fullName: string; phone: string; countryCode: string; city: string; username: string; email: string; profileImage: string; }>(mockProfile);
  const [profileImage, setProfileImage] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: ""
  })
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setEditForm({
          firstName: parsedUser.firstName || "",
          lastName: parsedUser.lastName || "",
          username: parsedUser.username || "",
          email: parsedUser.email || ""
        })
      } else {
        // Redirect to login if no user data
        router.push("/login")
      }
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include'
      })
      
      if (response.ok) {
        localStorage.removeItem("user")
        setUser(null)
        router.push("/")
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Still clear local state even if API call fails
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    // Update user data in localStorage
    if (user) {
      const updatedUser = {
        ...user,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        username: editForm.username,
        email: editForm.email
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      window.dispatchEvent(new Event("user-updated"))
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || ""
      })
    }
    setIsEditing(false)
  }

  const getUserInitials = (userData: UserData) => {
    if (!userData.firstName || !userData.lastName) return "U"
    return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                You need to be logged in to view this page.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button asChild>
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-3 flex flex-col gap-0">
            <Card className="p-0">
              <CardContent className="flex flex-col items-center pt-8 pb-4">
                <div className="relative mb-2">
                  <Avatar className="h-20 w-20">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="rounded-full object-cover h-20 w-20" />
                    ) : (
                      <AvatarFallback className="bg-green-100 text-green-700 text-2xl">DR</AvatarFallback>
                    )}
                  </Avatar>
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer border border-gray-200">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={() => setShowSave(true)} />
                  </label>
                </div>
                <div className="font-semibold text-lg">{profile.fullName}</div>
                <div className="text-gray-500 text-sm">@{profile.username}</div>
                <div className="text-gray-400 text-xs mt-1 flex items-center"><Mail className="h-3 w-3 mr-1" />{profile.email}</div>
                <div className="text-gray-400 text-xs mt-1">Joined {formatDate(user.createdAt)}</div>
              </CardContent>
            </Card>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
              <div className="font-semibold text-gray-700 mb-2 ml-2">Accounts</div>
              <div className="flex flex-col gap-1">
                <button
                  className={`flex items-center px-4 py-2 rounded-l-lg text-left transition-all ${activePanel === 'settings' ? 'font-bold border-l-4 border-green-500 bg-green-50 text-green-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => setActivePanel('settings')}
                >
                  <Home className="h-4 w-4 mr-2" />Settings
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-l-lg text-left transition-all ${activePanel === 'scanned' ? 'font-bold border-l-4 border-green-500 bg-green-50 text-green-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => setActivePanel('scanned')}
                >
                  <span className="mr-2">🌱</span>Crops Scanned
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-l-lg text-left transition-all ${activePanel === 'recommended' ? 'font-bold border-l-4 border-green-500 bg-green-50 text-green-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => setActivePanel('recommended')}
                >
                  <span className="mr-2">📋</span>Crops Recommended
                </button>
              </div>
            </div>
            <div className="mt-0">
              <div className="font-semibold text-gray-700 mb-2 ml-2">Quick Stats</div>
              <div className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-green-700">🌱 Scans Performed</span>
                  <span className="font-bold">{mockStats.scanned}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-blue-700">📋 Recommendations</span>
                  <span className="font-bold">{mockStats.recommended}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-9 flex flex-col gap-8">
            {/* Profile Information Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and account details</CardDescription>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                      {showSave && <Button>Save</Button>}
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing((v) => !v)}>Edit</Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={profile.fullName} disabled={!isEditing} onChange={e => { setProfile(p => ({ ...p, fullName: e.target.value })); setShowSave(true); }} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <select
                        disabled={!isEditing}
                        className="border rounded px-2 py-1 text-sm bg-white"
                        value={profile.countryCode || '+91'}
                        onChange={e => { setProfile(p => ({ ...p, countryCode: e.target.value })); setShowSave(true); }}
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <Input
                        id="phone"
                        value={profile.phone}
                        disabled={!isEditing}
                        onChange={e => { setProfile(p => ({ ...p, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })); setShowSave(true); }}
                        className="flex-1"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <select id="city" disabled={!isEditing} className="border rounded px-2 py-1 text-sm w-full bg-white" value={profile.city} onChange={e => { setProfile(p => ({ ...p, city: e.target.value })); setShowSave(true); }}>
                      <option value="">Select City</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      {/* Add more cities as needed */}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={profile.username} disabled={!isEditing} onChange={e => { setProfile(p => ({ ...p, username: e.target.value })); setShowSave(true); }} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={profile.email} disabled={!isEditing} onChange={e => { setProfile(p => ({ ...p, email: e.target.value })); setShowSave(true); }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Content Area */}
            {activePanel === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and security settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Download Data</h4>
                        <p className="text-sm text-gray-600">Download a copy of your account data</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {activePanel === 'scanned' && (
              <Card>
                <CardHeader>
                  <CardTitle>Crops / Plants Scanned So far</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    {mockScanned.map((scan, idx) => (
                      <div key={idx} className="flex items-center gap-6 bg-gray-50 rounded-lg p-4">
                        <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-4xl">🖼️</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg mb-1">{scan.disease}</div>
                          <div className="flex gap-4 text-sm mb-1">
                            <span>Confidence <span className="font-bold ml-1">{scan.confidence}</span></span>
                            <span>Severity <span className="font-bold ml-1">{scan.severity}</span></span>
                          </div>
                          <div className="flex gap-4">
                            <span className="bg-green-100 px-2 py-1 rounded text-green-700 text-xs">@ Treatment</span>
                            <span className="bg-green-100 px-2 py-1 rounded text-green-700 text-xs">@ Prevention Tips:</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {activePanel === 'recommended' && (
              <Card>
                <CardHeader>
                  <CardTitle>Crops / Plants Recommended</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    {mockRecommended.map((rec, idx) => (
                      <div key={idx} className="border-l-4 border-green-500 bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold capitalize text-lg">{rec.crop}</div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">Expected Yield</span>
                            <div className="font-bold">{rec.yield}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{rec.suitability} Suitable</span>
                          <span className={`px-2 py-1 rounded text-xs ${rec.profit === 'High Profit' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{rec.profit}</span>
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{rec.season}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {rec.why.map((reason, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">{reason}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}