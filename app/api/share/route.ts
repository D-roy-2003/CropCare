import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ShareableReport from '@/models/ShareableReport'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { disease, confidence, severity, treatment, prevention, imageUrl } = body
    
    if (!disease || !confidence || !severity || !treatment || !prevention || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Create a shareable report
    const shareableReport = new ShareableReport({
      disease,
      confidence,
      severity,
      treatment,
      prevention,
      imageUrl,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })
    
    await shareableReport.save()
    
    return NextResponse.json({ 
      shareId: shareableReport._id,
      shareUrl: `${process.env.NEXTAUTH_URL}/shared/${shareableReport._id}`
    })
    
  } catch (error: any) {
    console.error('Share creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}