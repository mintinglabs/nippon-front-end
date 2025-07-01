export default async function generateImage(uuid: string) {
  const apiUrl = 'http://api.nipponpaint-color-id.com.hk/api/generateImage';

  const response = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    method: 'POST',
    body: JSON.stringify({
      url: `https://www.nipponpaint-color-id.com.hk/share?uuid=${uuid}`,
    }),
  });

  return response.json();
}
