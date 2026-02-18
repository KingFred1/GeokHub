export async function GET() {
    const body = 'google-site-verification: google8b2ffdb20a3ec2be.html'
    return new Response(body, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
  