/* eslint-disable no-undef */
const axios = jest.genMockFromModule('axios')
axios.create.mockReturnThis()
export default axios