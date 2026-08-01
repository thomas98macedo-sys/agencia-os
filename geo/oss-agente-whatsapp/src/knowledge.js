// Base de conhecimento da empresa — o que o agente "sabe".
// Preencha com dados reais do seu negócio. Nunca deixe o agente chutar.
export const knowledge = {
  empresa: "Sua Empresa",
  tomDeVoz: "cordial, direto, próximo — usa o nome do cliente",
  politicas: {
    horario: "Seg a Sex, 9h-18h",
    pagamento: "Pix, cartão em até 12x",
    entrega: "Prazo e frete calculados no checkout",
    troca: "7 dias corridos após o recebimento",
  },
  faq: [
    { q: "Qual o prazo de entrega?", a: "Depende do CEP; calculamos no checkout." },
    { q: "Vocês parcelam?", a: "Sim, em até 12x no cartão." },
  ],
  // Gatilhos de passagem para humano:
  escalarParaHumano: ["reclamação", "negociação", "cancelamento", "falar com atendente"],
};
