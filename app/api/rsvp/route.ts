import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name } = body as { name: string }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Por favor ingresa tu nombre completo.' },
        { status: 400 },
      )
    }

    const client = await clientPromise
    const db = client.db('invitation')
    const collection = db.collection('rsvps')

    const result = await collection.insertOne({
      name: name.trim(),
      event: 'Defensa de Tesis – Steven Sagnay',
      confirmedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error('RSVP error:', error)
    return NextResponse.json(
      { error: 'Error al registrar. Intenta de nuevo.' },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('invitation')
    const count = await db.collection('rsvps').countDocuments()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Count error:', error)
    return NextResponse.json(
      { error: 'Error al obtener datos.' },
      { status: 500 },
    )
  }
}
