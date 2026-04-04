import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO_EMAIL = process.env.RESEND_FROM_EMAIL || 'ilyas@saasoffers.tech'
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ilyas@saasoffers.tech'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, website, email, contact_name, category, deal, value, program_url, notes } = body

    if (!company || !website || !email || !contact_name || !category || !deal || !value) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Partner Application: ${company}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #7C3AED; margin-bottom: 20px;">New Partner Application</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 160px;">Company</td>
              <td style="padding: 10px 0; color: #111827;">${company}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151;">Website</td>
              <td style="padding: 10px 0;"><a href="${website}" style="color: #7C3AED;">${website}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151;">Contact Name</td>
              <td style="padding: 10px 0; color: #111827;">${contact_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151;">Contact Email</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #7C3AED;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151;">Category</td>
              <td style="padding: 10px 0; color: #111827;">${category}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151;">Deal Value</td>
              <td style="padding: 10px 0; color: #111827; font-weight: bold;">${value}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Deal Description</td>
              <td style="padding: 10px 0; color: #111827;">${deal}</td>
            </tr>
            ${program_url ? `<tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151;">Program URL</td>
              <td style="padding: 10px 0;"><a href="${program_url}" style="color: #7C3AED;">${program_url}</a></td>
            </tr>` : ''}
            ${notes ? `<tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Notes</td>
              <td style="padding: 10px 0; color: #111827;">${notes}</td>
            </tr>` : ''}
          </table>

          <p style="margin-top: 20px; color: #6B7280; font-size: 14px;">
            Reply directly to this email to respond to the applicant at <strong>${email}</strong>
          </p>
        </div>
      `,
      reply_to: email,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
