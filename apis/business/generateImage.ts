export default async function generateImage(uuid: string) {
  const apiUrl = 'https://api.nipponpaint-color-id.com.hk/api/generateImage';

  const response = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    method: 'POST',
    body: JSON.stringify({
      url: `https://www.nipponpaint-color-id.com.hk/share?uuid=${uuid}`,
      uuid,
    }),
  });

  return response.json();
}
