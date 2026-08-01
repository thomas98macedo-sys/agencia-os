// Agente de IA para WhatsApp — laço principal (template).
// Fluxo: recebe mensagem -> monta contexto (conhecimento + histórico) ->
// pede resposta ao LLM -> decide agir (ferramenta) ou responder -> escala se preciso.
import { knowledge } from "./knowledge.js";
import { tools } from "./tools.js";

const SYSTEM = `Você é o atendente de IA da ${knowledge.empresa}.
Tom: ${knowledge.tomDeVoz}. Responda em linguagem natural, curto e útil.
NUNCA invente preço, prazo ou política — se não souber, use uma ferramenta ou escale para humano.
Base: ${JSON.stringify(knowledge.politicas)}.`;

// Substitua por sua chamada real ao LLM (Anthropic/OpenAI).
async function llm(messages) {
  throw new Error("Conecte seu provedor de LLM aqui (ANTHROPIC_API_KEY/OPENAI_API_KEY).");
}

export async function handleMessage(userText, history = []) {
  const messages = [
    { role: "system", content: SYSTEM },
    ...history,
    { role: "user", content: userText },
  ];
  // 1) Escalonamento explícito
  if (knowledge.escalarParaHumano?.some((k) => userText.toLowerCase().includes(k))) {
    return { action: "handoff", reply: "Vou te passar para um atendente com todo o contexto. Um instante!" };
  }
  // 2) Resposta do modelo (e possível uso de ferramenta)
  const reply = await llm(messages);
  return { action: "reply", reply };
}

// Webhook do WhatsApp Business Cloud API entra aqui (Express/serverless).
console.log("Template do agente pronto. Conecte o webhook do WhatsApp e o LLM. Ver README.");
