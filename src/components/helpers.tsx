export async function restCallToBackendAsync(url:string, token:string, loggingMessage = "Generic Call")
{
    const options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: token // token.access
        },
    };

  let response = await fetch(url, options)
  let data = await response.json()
  return data;
}
