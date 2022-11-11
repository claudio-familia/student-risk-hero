const HttpService = {
    post: async function post(url = '', data = {}) {
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
    },
    responseHandler: (response, callback) => {
      switch(response.status) {
        case 200:
        case 201:
          callback(response.json());
          break;
        case 400:
        case 401:
          alert(response.json())
          break;
        default:
          alert(response.json())
          break;
      }
    }
}

export default HttpService;