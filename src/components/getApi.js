function getAPI(url) {
  return fetch(`${url}`).then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json();
  });
}

export default getAPI;
