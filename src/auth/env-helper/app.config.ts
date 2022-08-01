export default () => ({
  JWT_SECRET: process.env.JWT_SECRET,
  baseURL: process.env.baseURL
}); // Simplesmente uma função para ir pegar o JWT_SECRET e o 
