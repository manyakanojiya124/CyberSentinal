import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

  await connectDB()
  const user = await User.findOne({ email })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Count attack types from linkHistory
  const attackCounts: Record<string, number> = {}

  user.linkHistory?.forEach((entry: any) => {
    const status = entry.status
    if (status === 'Malicious' || status === 'Phishing') {
      attackCounts[status] = (attackCounts[status] || 0) + 1
    }
  })

  const attackTypes = Object.entries(attackCounts).map(([type, count]) => ({
    type,
    count,
  }))

  return NextResponse.json({
    linkVisits: user.linkVisits,
    linkHistory: user.linkHistory,
    attackTypes,
    quizHighScore: user.quizHighScore,
    username: user.username || user.name || user.email,})
}
