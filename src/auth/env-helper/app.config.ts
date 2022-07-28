export default () => ({
  JWT_SECRET: process.env.JWT_SECRET,
}); // Simplesmente uma função para ir pegar o JWT_SECRET, se quisermos pegar outras variáveis de ambiente, podemos adicionar aqui.
