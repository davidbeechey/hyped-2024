const launchTime = new Date().getTime() - 10000;

export async function GET(request: Request) {
   return new Response(JSON.stringify({ launchTime }), {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
