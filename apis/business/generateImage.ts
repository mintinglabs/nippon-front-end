export default async function generateImage(uuid: string) {
  const apiUrl = 'http://192.168.41.115:7002/api/generateImage';

  const response = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    method: 'POST',
    body: JSON.stringify({
      url: `http://192.168.41.129:3000/share?uuid=${uuid}`,
    }),
  });

  return response.json();
}
