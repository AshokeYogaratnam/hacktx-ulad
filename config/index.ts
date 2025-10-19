export const config = {
  toyota: {
    apiUrl: process.env.TOYOTA_API_BASE_URL || 'https://api.toyota.com/v1',
    clientId: process.env.TOYOTA_API_CLIENT_ID,
    clientSecret: process.env.TOYOTA_API_CLIENT_SECRET,
  },
};