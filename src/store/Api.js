export default {
    get: (url) => fetch(url)
        .then((response) => {
            if (response.ok) { return response; }
            throw new Error(`Failed to fetch with code ${response.status}`);
        })
        .then((response) => response.json())
        .then((json) => {
            if (json.errors) {
                return Promise.reject(json.errors);
            }
            return json;
        })
        .catch((error) => {
            throw error;
        }),
};
