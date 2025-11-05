//
// This is not used for this project, my teammates and I decided to use fetch directly instead of AXIOS.
//

const API_URL = 'http://localhost:9999/api'

export default {
  async getBookById(id) {
    const response = await fetch(`${API_URL}/books/${id}`, {
      headers: {
        Authorization: localStorage.getItem('token') || '',
      },
    })
    return response.json()
  },
}
