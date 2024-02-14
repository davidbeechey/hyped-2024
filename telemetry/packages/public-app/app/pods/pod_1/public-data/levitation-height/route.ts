export async function GET(request: Request) {
  const levitation = {
    levitation_height_1: [
      {
        value: 21,
      },
    ],
    levitation_height_2: [
      {
        value: 20,
      },
    ],
    levitation_height_3: [
      {
        value: 21,
      },
    ],
    levitation_height_4: [
      {
        value: 20,
      },
    ],
    levitation_height_lateral_1: [
      {
        value: 21,
      },
    ],
    levitation_height_lateral_2: [
      {
        value: 22,
      },
    ],
  };

  return new Response(JSON.stringify(levitation), {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
