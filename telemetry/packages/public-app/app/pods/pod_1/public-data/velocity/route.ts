export async function GET(request: Request) {
  const now = new Date().getTime();

  const velocity = [
    {
      timestamp: now - 5000,
      value: 5,
    },
    {
      timestamp: now - 4000,
      value: 5.5,
    },
    {
      timestamp: now - 3000,
      value: 6,
    },
    {
      timestamp: now - 2000,
      value: 5,
    },
    {
      timestamp: now - 1000,
      value: 4.5,
    },
  ];

  return new Response(JSON.stringify(velocity), {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
