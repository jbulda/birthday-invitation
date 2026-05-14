import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()

    // Validation: Ensure we have an email to send to
    if (!record?.email) {
      throw new Error('No email found in the webhook record.')
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        // IMPORTANT: Use 'onboarding@resend.dev' if domain isn't verified yet
        from: 'Fairy Garden <onboarding@resend.dev>', 
        to: [record.email],
        subject: "✨ Magic Confirmed: You're on the Guest List!",
        html: `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!-- Note: Google Fonts don't work in all email clients, so we provide websafe fallbacks -->
                <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel&display=swap" rel="stylesheet">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f8f0fb; font-family: 'Cinzel', 'Georgia', serif; color: #555;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f0fb; padding: 40px 0;">
                    <tr>
                        <td align="center">
                            <!-- Main Card -->
                            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 30px; overflow: hidden; box-shadow: 0 10px 30px rgba(131, 97, 151, 0.1);">
                                
                                <!-- Top Magic Icon -->
                                <tr>
                                    <td align="center" style="padding: 40px 40px 10px 40px;">
                                        <span style="font-size: 60px;">🪄</span>
                                    </td>
                                </tr>
                                
                                <!-- Header Text -->
                                <tr>
                                    <td align="center" style="padding: 0 40px 20px 40px;">
                                        <h1 style="font-family: 'Cinzel Decorative', cursive; color: #836197; font-size: 28px; margin: 0;">Magic Confirmed!</h1>
                                        <div style="width: 50px; height: 2px; background-color: #e1bee7; margin: 15px auto 0 auto;"></div>
                                    </td>
                                </tr>

                                <!-- Main Message -->
                                <tr>
                                    <td style="padding: 0 50px 30px 50px; line-height: 1.6; font-size: 16px; text-align: center;">
                                        <p>Thank you for RSVPing! Your name has been written in the fairy scrolls for our little one's 1st birthday celebration.</p>
                                        
                                        <!-- Information Box -->
                                        <div style="background-color: #fdf7ff; border: 1px solid #ede7f6; border-radius: 20px; padding: 25px; margin-top: 20px;">
                                            <h2 style="color: #836197; font-size: 18px; margin-top: 0; font-family: 'Cinzel', serif;">Current Details</h2>
                                            <p style="margin: 10px 0;"><strong>Date & Time:</strong> To be announced soon ✨</p>
                                            <p style="margin: 10px 0;"><strong>Location:</strong> A secret garden in Montreal</p>
                                            
                                            <!-- Add to Calendar Button -->
                                            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed #d4bce2;">
                                                <p style="font-size: 13px; color: #8f6fa1; margin-bottom: 15px;">Add a placeholder to your calendar:</p>
                                                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=🌸+Fairy+Garden+1st+Birthday&details=Save+the+date+for+our+little+fairy's+big+day!+Exact+time+and+location+to+follow+soon.&location=Montreal,+QC&dates=20260620T140000Z/20260620T150000Z&ctz=America/Toronto" 
                                                style="background-color: #ffffff; color: #836197; border: 2px solid #836197; padding: 10px 18px; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: bold; display: inline-block;">
                                                + Save the Date
                                                </a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Website Link -->
                                <tr>
                                    <td align="center" style="padding: 0 40px 40px 40px;">
                                        <p style="font-size: 14px; color: #888; margin-bottom: 15px;">Check back for updates at the portal:</p>
                                        <a href="https://your-magic-link.com" style="background: linear-gradient(45deg, #a389b3, #836197); color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 15px; font-weight: bold; font-family: 'Cinzel', serif; display: inline-block; box-shadow: 0 4px 15px rgba(131, 97, 151, 0.3);">Return to the Realm</a>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td align="center" style="background-color: #f3e5f5; padding: 25px; font-size: 12px; color: #a389b3; letter-spacing: 1px;">
                                        SENT WITH LOVE AND FAIRY DUST
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 11px; color: #c1a5d1; margin-top: 20px;">If you didn't mean to fly into our garden, please ignore this scroll.</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
          `,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(result)}`)
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// supabase secrets set RESEND_API_KEY=re_4AxBhPME_LJTWFFU1g3iCs7TmvAiTLmwY