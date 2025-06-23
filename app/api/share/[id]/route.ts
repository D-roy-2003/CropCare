import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ShareableReport from '@/models/ShareableReport'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const shareableReport = await ShareableReport.findById(params.id)
    
    if (!shareableReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }
    
    // Check if expired
    if (shareableReport.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Report has expired' }, { status: 410 })
    }
    
    return NextResponse.json(shareableReport)
    
  } catch (error: any) {
    console.error('Share retrieval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}