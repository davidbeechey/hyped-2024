export async function GET(request: Request) {
  const now = new Date().getTime();

  const displacement = [
    {
      timestamp: now - 5000,
      value: 1,
    },
    {
      timestamp: now - 4000,
      value: 2,
    },
    {
      timestamp: now - 3000,
      value: 3,
    },
    {
      timestamp: now - 2000,
      value: 4,
    },
    {
      timestamp: now - 1000,
      value: 5,
    },
  ];

  return new Response(JSON.stringify(displacement), {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
