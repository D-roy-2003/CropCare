import { NextRequest, NextResponse } from 'next/server'
import Profile from '@/models/Profile'
import dbConnect from '@/lib/mongodb'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  await dbConnect()
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const profile = await Profile.findOne({ userId: user._id })
      .populate('cropsScanned')
      .populate('cropsRecommended')
    return NextResponse.json({ profile })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  await dbConnect()
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const { fullName, phone, countryCode, city, email, username, profileImage, cropsScanned, cropsRecommended } = body
    let profile = await Profile.findOne({ userId: user._id })
    if (profile) {
      profile.fullName = fullName
      profile.phone = phone
      profile.countryCode = countryCode
      profile.city = city
      profile.email = email
      profile.username = username
      if (profileImage) profile.profileImage = profileImage
      if (cropsScanned) profile.cropsScanned = cropsScanned
      if (cropsRecommended) profile.cropsRecommended = cropsRecommended
      await profile.save()
    } else {
      profile = await Profile.create({
        userId: user._id,
        fullName,
        phone,
        countryCode,
        city,
        email,
        username,
        profileImage,
        cropsScanned: cropsScanned || [],
        cropsRecommended: cropsRecommended || []
      })
    }
    return NextResponse.json({ success: true, profile })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
} 