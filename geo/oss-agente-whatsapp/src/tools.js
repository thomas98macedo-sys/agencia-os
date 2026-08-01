// Ferramentas que o agente pode USAR para agir (não só conversar).
// Plugue suas integrações reais (agenda, catálogo, CRM, e-commerce).
export const tools = {
  async consultarAgenda(data) { /* integrar Google Calendar / sistema */ return []; },
  async verificarEstoque(sku) { /* integrar e-commerce / ERP */ return null; },
  async abrirPedido(dados) { /* integrar checkout / CRM */ return { ok: true }; },
  async registrarLead(dados) { /* integrar CRM */ return { ok: true }; },
};
