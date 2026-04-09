import React, { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from "react";
import {
  LayoutDashboard, Users, Kanban, ListTodo, Calendar, BarChart3, Settings, Bell,
  Search, Plus, ChevronDown, ChevronRight, ChevronLeft, X, Check, Clock, AlertTriangle,
  FileText, MessageSquare, Paperclip, GripVertical, Filter, ArrowRight, Eye,
  Building2, Phone, Mail, Globe, DollarSign, Target, Zap, Palette, Video,
  CheckCircle2, Circle, AlertCircle, Timer, TrendingUp, Activity, UserCheck,
  CalendarDays, MoreHorizontal, Edit3, Trash2, Star, Flag, Tag, Link2,
  PlayCircle, PauseCircle, RotateCcw, Send, Upload, Download, ExternalLink,
  Megaphone, Image, Film, PenTool, Briefcase, UserPlus, LogOut, Menu, Home,
  ClipboardList, PieChart, BarChart2, LineChart, ArrowUpRight, ArrowDownRight,
  CheckSquare, Square, Hash, Layers, ChevronsRight, Workflow, RefreshCw, Loader2, Wifi, WifiOff,
  Lock, Shield, UserCog, Send as SendIcon, LogIn, Key
} from "lucide-react";

// ═══════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════
const ROLES = {
  DIRECTOR: { id: "director", label: "Diretor", color: "#6366f1" },
  ADMIN: { id: "admin", label: "Administrador", color: "#6366f1" },
  CS: { id: "cs", label: "Customer Success", color: "#06b6d4" },
  TRAFFIC: { id: "traffic", label: "Gestor de Tráfego", color: "#f59e0b" },
  SOCIAL: { id: "social", label: "Social Media", color: "#ec4899" },
  DESIGNER: { id: "designer", label: "Designer", color: "#8b5cf6" },
  FILMMAKER: { id: "filmmaker", label: "Filmmaker", color: "#ef4444" },
  COMMERCIAL: { id: "commercial", label: "Comercial", color: "#10b981" },
  SDR: { id: "sdr", label: "SDR (Pré-Vendas)", color: "#14b8a6" },
  CLOSER: { id: "closer", label: "Closer", color: "#0ea5e9" },
  HEAD_TRAFFIC: { id: "head_traffic", label: "Head de Tráfego", color: "#f97316" },
  CREATION_LEAD: { id: "creation_lead", label: "Líder de Criação", color: "#f97316" },
  STORE_CREATOR: { id: "store_creator", label: "Criação de Lojas", color: "#d946ef" },
};

const KANBAN_COLUMNS = [
  { id: "venda_fechada", label: "Venda Fechada", color: "#6366f1", icon: "💼", responsible: "cs", responsibleLabel: "CS" },
  { id: "cs_inicial", label: "CS Inicial", color: "#06b6d4", icon: "📋", responsible: "cs", responsibleLabel: "CS" },
  { id: "cobranca_enviada", label: "Cobrança Enviada", color: "#f59e0b", icon: "💳", responsible: "cs", responsibleLabel: "CS" },
  { id: "pagamento_confirmado", label: "Pagamento Confirmado", color: "#10b981", icon: "✅", responsible: "cs", responsibleLabel: "CS" },
  { id: "onboarding_agendado", label: "Onboarding Agendado", color: "#8b5cf6", icon: "📅", responsible: "cs", responsibleLabel: "CS" },
  { id: "onboarding_concluido", label: "Onboarding Concluído", color: "#3b82f6", icon: "🎯", responsible: "cs", responsibleLabel: "CS", slaNextDays: 3, slaNextLabel: "3 dias úteis para Setup Tráfego" },
  { id: "alinhamento_visual", label: "Alinhamento Visual", color: "#ec4899", icon: "🎨", responsible: "creation_lead", responsibleLabel: "Líder Criação (Henrique)" },
  { id: "servico_avulso", label: "Serviço Avulso / Sem Tráfego", color: "#d946ef", icon: "🎯", responsible: "creation_lead", responsibleLabel: "Líder Criação + Equipe" },
  { id: "setup_trafego", label: "Setup Tráfego", color: "#f97316", icon: "⚡", responsible: "traffic", responsibleLabel: "Gestores de Tráfego", slaHours: 72, slaLabel: "3 dias para setup geral" },
  { id: "trafego_ativo", label: "Tráfego Ativo", color: "#22c55e", icon: "🚀", responsible: "traffic", responsibleLabel: "Gestores de Tráfego" },
  { id: "producao_andamento", label: "Produção", color: "#14b8a6", icon: "🔄", responsible: "creation_lead", responsibleLabel: "Líder Criação + Equipe Criação do GC" },
  { id: "buscando_aprovacao", label: "Buscando Aprovação do Cliente", color: "#64748b", icon: "📤", responsible: "cs", responsibleLabel: "CS" },
  { id: "aprovacao_concluida", label: "Aprovação Concluída", color: "#eab308", icon: "✅", responsible: "traffic", responsibleLabel: "Tráfego + Social Media", dualApproval: true, dualRoles: ["traffic", "social"], dualLabels: ["Gestores subir campanhas", "Social Media agendar postagem"] },
  { id: "concluido", label: "Concluído", color: "#059669", icon: "🏆" },
];

const PRIORITIES = {
  urgent: { label: "Urgente", color: "#ef4444", bg: "#fef2f2" },
  high: { label: "Alta", color: "#f97316", bg: "#fff7ed" },
  medium: { label: "Média", color: "#eab308", bg: "#fefce8" },
  low: { label: "Baixa", color: "#22c55e", bg: "#f0fdf4" },
};

const SERVICES = ["Tráfego Pago","Social Media","Criativos","Loja Virtual","Pacote Completo"];

// ═══ PRODUCT CATALOG ═══
const TRAFFIC_PLATFORMS = [
  {id:"meta", label:"Meta Ads (Facebook/Instagram)"},
  {id:"google", label:"Google Ads"},
  {id:"tiktok", label:"TikTok Shop"},
  {id:"mercadolivre", label:"Mercado Livre"},
  {id:"shopee", label:"Shopee"},
];
const CREATIVE_OPTIONS = [
  {id:"8criativos", label:"8 Criativos p/ Anúncios / mês"},
  {id:"16criativos", label:"16 Criativos p/ Anúncios / mês"},
];
const SOCIAL_OPTIONS = [
  {id:"social_2x", label:"Social Media — 2 postagens/semana"},
  {id:"social_none", label:"Sem Social Media"},
];
const STORE_PLATFORMS = [
  {id:"shopify", label:"Shopify"},
  {id:"ml_store", label:"Mercado Livre"},
  {id:"shopee_store", label:"Shopee"},
  {id:"tiktok_store", label:"TikTok Shop"},
  {id:"lp_lovable", label:"LP Lovable"},
  {id:"site_lovable", label:"Site Institucional Lovable"},
];

// ═══ GC SYSTEM (Grupos de Combate) ═══
const GC_TEAMS = {
  GC1: { id: "GC1", name: "Máquina de Guerra", color: "#ef4444", icon: "🔥" },
  GC2: { id: "GC2", name: "Tropa de Elite", color: "#6366f1", icon: "⚡" },
};

const SEED_USERS = [
  // ═══ EQUIPE REAL LINCE PERFORMANCE ═══
  { id: "u1", name: "Thomas Macedo", email: "thomas98macedo@gmail.com", role: "director", avatar: "TM", gc: null },
  // ═══ COMPARTILHADOS (atuam nos dois GCs) ═══
  { id: "u2", name: "Amanda Ferreira", email: "aferreira@linceperformance.com", role: "cs", avatar: "AF", gc: "BOTH" },
  { id: "u6", name: "Henrique", email: "hteixeira@linceperformance.com", role: "creation_lead", avatar: "HE", gc: "BOTH" },
  // ═══ GC1 🔥 MÁQUINA DE GUERRA ═══
  { id: "u3", name: "Fernando Garcia", email: "fernandogb.ads@gmail.com", role: "head_traffic", avatar: "FG", gc: "GC1" },
  { id: "u4", name: "Gabriela", email: "gabrielassoaress13@gmail.com", role: "social", avatar: "GA", gc: "GC1" },
  // Lucas (designer GC1) desligado — Renan é o único designer agora
  { id: "u6b", name: "Vincenzo", email: "vneto@linceperformance.com", role: "filmmaker", avatar: "VI", gc: "GC1" },
  { id: "u7", name: "Felipe Dantas", email: "filipexaxa65@gmail.com", role: "closer", avatar: "FD", gc: "GC1" },
  { id: "u14", name: "Lucas SDR", email: "suporteeolp@gmail.com", role: "sdr", avatar: "LS", gc: "GC1" },
  // ═══ GC2 ⚡ TROPA DE ELITE ═══
  { id: "u8", name: "Leonardo", email: "lfernandes@linceperformance.com", role: "head_traffic", avatar: "LE", gc: "GC2" },
  { id: "u9", name: "Gabriel", email: "gfreire@linceperformance.com", role: "traffic", avatar: "GB", gc: "GC2" },
  { id: "u10", name: "Allan", email: "avieira@linceperformance.com", role: "traffic", avatar: "AL", gc: "GC2" },
  { id: "u11", name: "Fábio", email: "fcorrea@linceperformance.com", role: "sdr", avatar: "FA", gc: "GC2" },
  { id: "u13", name: "Mateus Bueno", email: "matheusbuenobsb@gmail.com", role: "sdr", avatar: "MB", gc: "GC2" },
  { id: "u12", name: "Mateus Paixão", email: "mpaixao@linceperformance.com", role: "store_creator", avatar: "MP", gc: "GC2" },
  // ═══ VAGAS ABERTAS — preencher quando entrarem ═══
  { id: "u20", name: "Renan", email: "renan.andrade02@outlook.com", role: "designer", avatar: "RE", gc: "BOTH" },
  { id: "u21", name: "Allana", email: "alannabela@gmail.com", role: "social", avatar: "AL", gc: "GC1" },
  { id: "u22", name: "Beatriz", email: "beatrizmarques1224@gmail.com", role: "social", avatar: "BE", gc: "GC1" },
  { id: "u23", name: "Isabelle", email: "isabelle.cds11@gmail.com", role: "social", avatar: "IS", gc: "GC2" },
  { id: "u24", name: "Luiza", email: "lguimaraes@linceperformance.com", role: "social", avatar: "LG", gc: "BOTH" },
];

const mkChecklist = (items) => items.map((text, i) => ({ id: `ck${i}`, text, done: false }));
const CS_CK = ["Contato criado","Cobrança gerada","Cobrança enviada","Pagamento confirmado","Grupo WhatsApp criado","Formulário enviado","Formulário respondido","Dados conferidos","Onboarding agendado"];
const OB_CK = ["Chamada agendada","Time apresentado","Pré-estratégia apresentada","Objetivos documentados","Referências visuais","Dores registradas","Diferenciais registrados","Ofertas prioritárias","Metas documentadas"];
const TR_CK = ["Acesso conta anúncios","Acesso página/Instagram","Pagamento validado","Ativos conectados","Estratégia definida","Campanha criada","Campanha publicada","Tráfego ativo"];
const CR_CK = ["Referências visuais","Estilo comunicação","Paleta analisada","Concorrentes analisados","Tipos criativos","Entregáveis mapeados","Calendário planejado"];
const SM_BRIEFING = ["Identidade visual definida","Paleta de cores coletada","Tom de voz definido","Público-alvo mapeado","Referências de conteúdo (3+)","Concorrentes analisados (feed)","Bio e destaques revisados","Calendário editorial do mês","Pautas da semana 1 criadas","Formatos definidos (carrossel/reels/stories)","Hashtags pesquisadas","Horários de postagem definidos"];

const now = Date.now();
const DAY = 86400000;
const uid = () => Math.random().toString(36).slice(2, 10);

// Helper to build client objects from real data
const mkClient = (id,company,service,value,status,priority,payDay,payStatus,contractEnd,notes,month) => {
  const monthMap = {DEZEMBRO:11,JANEIRO:0,FEVEREIRO:1,"MARÇO":2,ABRIL:3,MAIO:4,JUNHO:5};
  const mIdx = monthMap[(month||"").toUpperCase()] ?? 2;
  const entryDate = new Date(2026, mIdx, Math.floor(Math.random()*20)+1);
  const paid = payStatus === "PAGO";
  const isChurning = status === "CHURNING";
  const isEncerrado = status === "ENCERRADO";
  const kanban = isChurning ? "concluido" : isEncerrado ? "concluido" : paid ? "trafego_ativo" : "cobranca_enviada";
  // Auto-assign GC: first half active → GC1, second half → GC2
  const num = parseInt(id.replace(/\D/g,"")) || 0;
  const autoGC = (isChurning || isEncerrado) ? null : (num <= 17 ? "GC1" : "GC2");
  return {
    id, company, contact:"", phone:"", email:"", segment:"",
    service, contractValue:value,
    closedDate: entryDate.toISOString(),
    paymentDate: paid ? new Date(entryDate.getTime()+2*DAY).toISOString() : null,
    status: kanban,
    priority: priority || (value >= 3000 ? "high" : "medium"),
    csId:"u2", trafficId:"u3", socialId: service.toLowerCase().includes("social") || service.toLowerCase().includes("tudo") ? "u4" : null,
    designerId:"u20", filmmakerId: service.toLowerCase().includes("video") || service.toLowerCase().includes("v/e") || service.toLowerCase().includes("e/v") || service.toLowerCase().includes("criativo") || service.toLowerCase().includes("tudo") ? "u6b" : null,
    commercialId:"u7", soldBy: null,
    whatsappGroup:"", formStatus: paid ? "responded" : "not_sent",
    onboardingDate: paid ? new Date(entryDate.getTime()+4*DAY).toISOString() : null,
    trafficActivationDate: paid && !isChurning && service.toLowerCase().includes("tráfego") || service.toLowerCase().includes("trafego") || service.toLowerCase().includes("tudo") ? new Date(entryDate.getTime()+5*DAY).toISOString() : null,
    notes: `${notes||""} ${payDay ? `Dia pgto: ${payDay}` : ""} ${contractEnd ? `Contrato: ${contractEnd}` : ""} ${isChurning ? "⚠️ CHURNING" : ""} ${isEncerrado ? "📦 ENCERRADO" : ""}`.trim(),
    payDay: payDay || null,
    contractEnd: contractEnd || null,
    churning: isChurning,
    encerrado: isEncerrado,
    gcTeam: autoGC,
    csChecklist: mkChecklist(CS_CK).map((i,idx)=>({...i,done:paid?true:idx<3})),
    onboardingChecklist: mkChecklist(OB_CK).map(i=>({...i,done:!!paid})),
    trafficChecklist: mkChecklist(TR_CK).map(i=>({...i,done:!!paid && !isChurning})),
    creationChecklist: mkChecklist(CR_CK).map((i,idx)=>({...i,done:!!paid && idx<4})),
    socialBriefing: mkChecklist(SM_BRIEFING),
    timeline: [
      {date:entryDate.toISOString(), event:"Venda fechada", user:"Comercial"},
      ...(paid ? [{date:new Date(entryDate.getTime()+2*DAY).toISOString(), event:"Pagamento confirmado", user:"Sistema"}] : []),
      ...(isChurning ? [{date:new Date(entryDate.getTime()+30*DAY).toISOString(), event:"Cliente cancelou (churning)", user:"CS"}] : []),
      ...(isEncerrado ? [{date:new Date(entryDate.getTime()+20*DAY).toISOString(), event:"Projeto encerrado / contrato finalizado", user:"CS"}] : []),
    ],
    meetings:[], reports:[],
  };
};

const DEFAULT_CLIENTS = [
  // ══════════════════════════════════════════════════════════
  // CLIENTES ATIVOS (~31) — cruzamento Financeiro + Aquisição
  // ══════════════════════════════════════════════════════════
  // --- Financeiro (contratos recorrentes ativos) ---
  mkClient("c01","Auto Peças Fama","Tráfego Pago, Social Media, Criativo (V/E)",1900,"ATIVO","high","01","PAGO","março (renovação automática)","Weekly ativa","DEZEMBRO"),
  mkClient("c02","Casa Souza Guedes","Tráfego, Criativo (Vídeo)",1200,"ATIVO","medium","09","PAGO","fevereiro (renovação automática)","Weekly ativa","DEZEMBRO"),
  mkClient("c03","Dra. Gabriela Fordelone","Tráfego Pago",800,"ATIVO","medium","16","PAGO","renovação","Boleto","MARÇO"),
  mkClient("c04","Ferragens Vieira","Tráfego, Criativo (E/V), Site",1891,"ATIVO","medium","16","PAGO","janeiro (renovação automática)","Boleto. Weekly ativa","DEZEMBRO"),
  mkClient("c05","HQ Quero","Tráfego, Site",1500,"ATIVO","medium","01","PAGO","fevereiro (renovação automática)","","DEZEMBRO"),
  mkClient("c06","Megatrucks","Tráfego, Criativo (E/V)",1500,"ATIVO","medium","10","PAGO","janeiro (renovação automática)","Cartão. Weekly ativa","DEZEMBRO"),
  mkClient("c07","Phiware","Tráfego, Social Media, Criativo (E/V), Site MKT",4250,"ATIVO","high","03","PAGO","só começará a contar site pronto","","DEZEMBRO"),
  mkClient("c08","Renan Youssef","Tráfego, Criativo e Site",1500,"ATIVO","medium","28","PAGO","só começará a contar site pronto","","DEZEMBRO"),
  mkClient("c09","Derma House","Tráfego, Criativo (E/V), Social Media, Site",3000,"ATIVO","high","09","PAGO","março","Weekly ativa","DEZEMBRO"),
  mkClient("c10","Lira-Sat","Tráfego, LP, Criativo (E/V)",1800,"ATIVO","medium","19","PAGO","março","Weekly ativa","DEZEMBRO"),
  mkClient("c11","Diego Valle","Tudo",6000,"ATIVO","high","","PAGO","junho","","JANEIRO"),
  mkClient("c12","Doce Amor Alianças","Site",500,"ATIVO","low","","PAGO","abril","Cartão","JANEIRO"),
  // --- Aquisição (novos negócios recorrentes, sem duplicata) ---
  mkClient("c13","AC Soares Auto Peças","Tráfego Pago",1500,"ATIVO","medium","","PAGO","","Entrada Março","MARÇO"),
  mkClient("c14","Amici","Tudo",2500,"ATIVO","high","","PAGO","","Entrada Janeiro","JANEIRO"),
  mkClient("c15","Aportte Estruturas","Tráfego Pago",1200,"ATIVO","medium","","PAGO","","Entrada Março","MARÇO"),
  mkClient("c16","Fábrica de Velas","Tudo",2300,"ATIVO","medium","","PAGO","","Entrada Fevereiro","FEVEREIRO"),
  mkClient("c17","Gabrielle Estética","Tráfego Pago",2000,"ATIVO","medium","","PAGO","","Entrada Fevereiro. Weekly ativa","FEVEREIRO"),
  mkClient("c18","Levix","Tráfego Pago",2500,"ATIVO","high","","PAGO","","Entrada Fevereiro. Alinhamento geral ativo","FEVEREIRO"),
  mkClient("c19","Life Gain","Tudo",2400,"ATIVO","medium","","PAGO","","Entrada Fevereiro","FEVEREIRO"),
  mkClient("c20","Marcos Paulo Heleno","Tudo",2400,"ATIVO","medium","","PAGO","","Entrada Janeiro","JANEIRO"),
  mkClient("c21","Misterpane","Tudo",2500,"ATIVO","medium","","PAGO","","Entrada Janeiro","JANEIRO"),
  mkClient("c22","Ótica Evox","Tudo",2000,"ATIVO","medium","","PAGO","","Entrada Março","MARÇO"),
  mkClient("c23","Película Inteligente","Tudo",2000,"ATIVO","medium","","PAGO","","Entrada Fevereiro","FEVEREIRO"),
  mkClient("c24","Produban","Social Media",2500,"ATIVO","medium","","PAGO","","Entrada Fevereiro","FEVEREIRO"),
  mkClient("c25","Renovare Tintas","Tráfego Pago",2000,"ATIVO","medium","","PAGO","","Entrada Janeiro","JANEIRO"),
  mkClient("c26","Sérgio Amim","Tudo",3000,"ATIVO","high","","PAGO","","Entrada Fevereiro","FEVEREIRO"),
  mkClient("c27","SPA Almare","Naming, Logo, Social Media, Arte e Tráfego",3000,"ATIVO","high","","PAGO","","Entrada Fevereiro","FEVEREIRO"),
  mkClient("c28","Super Shape","Tráfego Pago",3000,"ATIVO","high","","PAGO","","Entrada Janeiro","JANEIRO"),
  mkClient("c29","Samuel Medgood","Tráfego Pago Meta e Google",2000,"ATIVO","medium","","PAGO","","Entrada Março","MARÇO"),
  mkClient("c30","Chinalink","Tráfego Pago",15000,"ATIVO","urgent","","PAGO","","Maior conta. Entrada Março. Weeklys ativas","MARÇO"),
  mkClient("c31","Se Conecta","Tráfego Pago",2000,"ATIVO","medium","","PAGO","","Entrada Março","MARÇO"),
  mkClient("c32","Amerinexa","Tráfego Pago",1000,"ATIVO","low","","PAGO","","Entrada Março","MARÇO"),
  mkClient("c33","Wallace","Tráfego Pago",2000,"ATIVO","medium","","PAGO","","Entrada Março","MARÇO"),
  mkClient("c34","Josivaldo","Tráfego, Site, Social Media",4000,"ATIVO","high","","PAGO","","Entrada Março","MARÇO"),
  {...mkClient("c35","LINCE PERFORMANCE","Social Media — Perfil Institucional",0,"ATIVO","high","","","","Perfil da agência — Luiza responsável","ABRIL"), socialId:"u24", gcTeam:"BOTH", status:"trafego_ativo"},
  {...mkClient("c36","THOMAS MACEDO","Social Media — Perfil Pessoal",0,"ATIVO","high","","","","Perfil pessoal Thomas — Luiza responsável","ABRIL"), socialId:"u24", gcTeam:"BOTH", status:"trafego_ativo"},
  // ══════════════════════════════════════════════════════════
  // CHURNING (15) — Clientes que cancelaram
  // ══════════════════════════════════════════════════════════
  mkClient("c40","Atlas Academia","Tráfego Pago, Site",4000,"CHURNING","high","","PAGO","","Entrou Jan R$3000, saiu Mar R$4000","MARÇO"),
  mkClient("c41","Bike Cajueiro","Tráfego Pago, Criativo (V/E), Site",2500,"CHURNING","high","19","PAGO","fevereiro","Churning Fevereiro","FEVEREIRO"),
  mkClient("c42","Eurotrucks","Tráfego, Social Media, Criativo (E/V)",2500,"CHURNING","high","26","PAGO","março","Churning Janeiro","JANEIRO"),
  mkClient("c43","Gymee","Tráfego, Criativo (E/V)",2365,"CHURNING","high","11","PAGO","março","Churning Março","MARÇO"),
  mkClient("c44","Hangar 67","Tráfego, Criativo (E/V)",1500,"CHURNING","medium","25","NÃO PAGO","cancelou","Cancelou. Não pagou","DEZEMBRO"),
  mkClient("c45","Heilen Pharma","Tráfego Pago, Criativo (E/V), Social Media",3500,"CHURNING","high","25","PAGO","janeiro","Churning Fevereiro","FEVEREIRO"),
  mkClient("c46","Infantiks","Tráfego, Criativo (E/V), CRM",2500,"CHURNING","high","26","PAGO","dezembro","Churning Dezembro","DEZEMBRO"),
  mkClient("c47","Lua de Prata","Tráfego, Criativo (E/V)",2000,"CHURNING","medium","30","NÃO PAGO","dezembro","Churning Dez. Não pagou","DEZEMBRO"),
  mkClient("c48","Mafra","LP, Tráfego Pago, Criativo (E/V)",1800,"CHURNING","medium","17","PAGO","março","Boleto. Churning Março","MARÇO"),
  mkClient("c49","Ponto do Diesel","Tráfego, CRM",1789,"CHURNING","medium","30","NÃO PAGO","dezembro","Churning Dez. Não pagou","DEZEMBRO"),
  mkClient("c50","Scarf","Tráfego, Social Media, Criativo (E/V), Site",2500,"CHURNING","high","28","PAGO","março","Churning Fevereiro","FEVEREIRO"),
  mkClient("c51","Second Love","Tráfego, Criativo (E/V)",1500,"CHURNING","medium","16","PAGO","dezembro","Churning Dezembro","DEZEMBRO"),
  mkClient("c52","Solodimix","Tráfego, Criativo (E/V)",1500,"CHURNING","medium","09","NÃO PAGO","dezembro","Churning Jan. Não pagou","JANEIRO"),
  mkClient("c53","Torque","Tráfego, Social Media, Criativo (E/V)",3000,"CHURNING","high","30","PAGO","janeiro","Boleto. Churning Janeiro","JANEIRO"),
  mkClient("c54","Vieira Shop","Tráfego",1250,"CHURNING","medium","20","PAGO","venceu novembro","Cartão. Churning Dezembro","DEZEMBRO"),
  // ══════════════════════════════════════════════════════════
  // PROJETOS AVULSOS / ENCERRADOS (não recorrentes)
  // ══════════════════════════════════════════════════════════
  mkClient("c60","Albérico","Site",833,"ENCERRADO","low","27","PAGO","janeiro 2026","Projeto encerrado","DEZEMBRO"),
  mkClient("c61","Casephone","Tráfego, Criativo (E/V), Site",2500,"ENCERRADO","medium","27","PAGO","janeiro","Contrato encerrado Jan","DEZEMBRO"),
  mkClient("c62","Kyroto","Tráfego, Portfólio, LP",1500,"ENCERRADO","medium","27","PAGO","janeiro","Boleto. Contrato encerrado Jan","DEZEMBRO"),
  mkClient("c63","MF Serviços","Embalagem",1500,"ENCERRADO","low","09","PAGO","dezembro","Boleto. Projeto avulso encerrado","DEZEMBRO"),
  mkClient("c64","Cereal Sul","Transcrição do manual",1300,"ENCERRADO","low","16","PAGO","março","Boleto. Projeto avulso","DEZEMBRO"),
  mkClient("c65","Contcommerce","Site, LP, Mídia Kit",2000,"ENCERRADO","medium","19","PAGO","avulso","Pix. Projeto avulso","DEZEMBRO"),
  mkClient("c66","Pedro Scarillo","Identidade Visual E-commerce",1752,"ENCERRADO","low","19","PAGO","avulso","Projeto avulso encerrado","DEZEMBRO"),
  mkClient("c67","Econfisc","Landing Page",1000,"ENCERRADO","low","","PAGO","","Projeto avulso Jan","JANEIRO"),
  mkClient("c68","Vertil","Site",1300,"ENCERRADO","low","","PAGO","","Projeto avulso Mar","MARÇO"),
  mkClient("c69","Atacarejo Imperatriz","Site",1500,"ENCERRADO","low","","PAGO","","Projeto avulso Mar","MARÇO"),
];

const DEFAULT_TASKS = [
  { id:"t1", title:"Weekly - Auto Peças Fama", clientId:"c01", assigneeId:"u3", sector:"traffic", priority:"medium", status:"in_progress", dueDate:new Date(now+2*DAY).toISOString(), subtasks:[] },
  { id:"t2", title:"Setup tráfego - Chinalink", clientId:"c30", assigneeId:"u3", sector:"traffic", priority:"urgent", status:"in_progress", dueDate:new Date(now).toISOString(), subtasks:[{id:"s1",text:"Conectar BM",done:true},{id:"s2",text:"Configurar campanhas",done:false},{id:"s3",text:"Ativar tráfego",done:false}] },
  { id:"t3", title:"Captação Gabrielle - Vincenzo", clientId:"c17", assigneeId:"u6", sector:"filmmaker", priority:"high", status:"pending", dueDate:new Date(now+1*DAY).toISOString(), subtasks:[] },
  { id:"t4", title:"Weekly - Derma House", clientId:"c09", assigneeId:"u3", sector:"traffic", priority:"medium", status:"pending", dueDate:new Date(now+1*DAY).toISOString(), subtasks:[] },
  { id:"t5", title:"Weekly - Megatrucks", clientId:"c06", assigneeId:"u3", sector:"traffic", priority:"medium", status:"pending", dueDate:new Date(now+1*DAY).toISOString(), subtasks:[] },
  { id:"t6", title:"Alinhamento geral - Levix", clientId:"c18", assigneeId:"u3", sector:"traffic", priority:"medium", status:"pending", dueDate:new Date(now).toISOString(), subtasks:[] },
  { id:"t7", title:"Onboarding - Josivaldo", clientId:"c34", assigneeId:"u2", sector:"cs", priority:"high", status:"pending", dueDate:new Date(now+1*DAY).toISOString(), subtasks:[] },
  { id:"t8", title:"Criar peças - Ótica Evox", clientId:"c22", assigneeId:"u20", sector:"designer", priority:"medium", status:"pending", dueDate:new Date(now+3*DAY).toISOString(), subtasks:[] },
  { id:"t9", title:"Weekly - Lira Sat", clientId:"c10", assigneeId:"u3", sector:"traffic", priority:"medium", status:"pending", dueDate:new Date(now+5*DAY).toISOString(), subtasks:[] },
  { id:"t10", title:"Weekly - Casa Souza Guedes", clientId:"c02", assigneeId:"u3", sector:"traffic", priority:"medium", status:"pending", dueDate:new Date(now+4*DAY).toISOString(), subtasks:[] },
];

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
const fmt = d => { if(!d) return "—"; return new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}); };
const fmtTime = d => { if(!d) return "—"; return new Date(d).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}); };
const ago = d => { const h=Math.floor((now-new Date(d).getTime())/3600000); if(h<1) return "Agora"; if(h<24) return `${h}h`; return `${Math.floor(h/24)}d`; };
const getSLA = (p,a) => { if(!p) return null; if(a) return {status:"done",label:"Ativado",color:"#22c55e"}; const h=(now-new Date(p).getTime())/3600000; if(h<=24) return {status:"ok",label:`${Math.round(48-h)}h restantes`,color:"#22c55e",pct:(h/48)*100}; if(h<=48) return {status:"warning",label:`${Math.round(48-h)}h restantes`,color:"#f59e0b",pct:(h/48)*100}; return {status:"critical",label:`${Math.round(h-48)}h atrasado`,color:"#ef4444",pct:100}; };

// ═══════════════════════════════════════════
// REAL GOOGLE CALENDAR DATA — cores exatas do Google Calendar
// Google colorId: 1=#7986cb 2=#33b679 3=#8e24aa 4=#e67c73 5=#f6bf26 6=#f4511e 7=#039be5 8=#616161 9=#3f51b5 10=#0b8043 11=#d50000 default=#4285f4
// ═══════════════════════════════════════════
const GCAL_COLORS = {1:"#7986cb",2:"#33b679",3:"#8e24aa",4:"#e67c73",5:"#f6bf26",6:"#f4511e",7:"#039be5",8:"#616161",9:"#3f51b5",10:"#0b8043",11:"#d50000"};
const GCAL_COLOR_NAMES = {1:"Lavanda",2:"Sálvia",3:"Uva",4:"Flamingo",5:"Banana",6:"Tangerine",7:"Pavão",8:"Grafite",9:"Mirtilo",10:"Manjericão",11:"Tomate"};
const DEFAULT_CAL_COLOR = "#4285f4"; // azul padrão google
const AGENCY_CAL_COLOR = "#d06b64"; // vermelho agência

const REAL_PERSONAL_EVENTS = [
  { id:"gp1", summary:"Thomas barbearia", start:"2026-03-30T17:00:00-03:00", end:"2026-03-30T18:45:00-03:00", calendar:"pessoal", color:DEFAULT_CAL_COLOR },
  { id:"gp2", summary:"Thomas e ale moby", start:"2026-03-31T16:00:00-03:00", end:"2026-03-31T18:00:00-03:00", calendar:"pessoal", color:GCAL_COLORS[10] },
  { id:"gp3", summary:"REUNIÃO TRITON", start:"2026-03-31T19:00:00-03:00", end:"2026-03-31T22:00:00-03:00", calendar:"pessoal", color:GCAL_COLORS[10] },
  { id:"gp4", summary:"CANTON FAIR 12 ABR — 06 MAI", start:"2026-04-12T01:30:00-03:00", end:"2026-05-06T02:30:00-03:00", calendar:"pessoal", color:DEFAULT_CAL_COLOR, allDay:true },
];

const REAL_AGENCY_EVENTS = [
  // 30/mar
  { id:"ga01", summary:"Visita cliente FRIGA — Thomas, Dantas, Paixão", start:"2026-03-30T09:00:00-03:00", end:"2026-03-30T15:00:00-03:00", calendar:"agência", color:GCAL_COLORS[10], description:"Av. Santo Antônio 2641, Bela Vista, Osasco", location:"Osasco" },
  { id:"ga02", summary:"Weekly - Parrilo (META ADS)", start:"2026-03-30T14:00:00-03:00", end:"2026-03-30T15:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga03", summary:"Weekly - Mazzi (GOOGLE ADS)", start:"2026-03-30T15:00:00-03:00", end:"2026-03-30T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga04", summary:"Weekly - Time Comercial (ChinaLink)", start:"2026-03-30T16:00:00-03:00", end:"2026-03-30T17:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  // 31/mar
  { id:"ga05", summary:"Thomas - Consultoria Elaine / Renata", start:"2026-03-31T10:00:00-03:00", end:"2026-03-31T11:00:00-03:00", calendar:"agência", color:GCAL_COLORS[10], description:"Elaine +55 43 9145-2110" },
  { id:"ga06", summary:"Weekly - Casa Souza Guedes", start:"2026-03-31T10:00:00-03:00", end:"2026-03-31T11:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga07", summary:"Weekly - Gabrielle", start:"2026-03-31T11:00:00-03:00", end:"2026-03-31T12:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga08", summary:"Weekly - Scarf", start:"2026-03-31T14:00:00-03:00", end:"2026-03-31T15:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga09", summary:"Weekly - Leads Lincoln", start:"2026-03-31T15:00:00-03:00", end:"2026-03-31T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga10", summary:"GENE ALINHAMENTO - NANDO", start:"2026-03-31T17:00:00-03:00", end:"2026-03-31T17:30:00-03:00", calendar:"agência", color:GCAL_COLORS[8], recurring:true },
  // 01/abr
  { id:"ga11", summary:"Weekly - Ferragens Vieira", start:"2026-04-01T10:00:00-03:00", end:"2026-04-01T11:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga12", summary:"ID visual - Guru do RH", start:"2026-04-01T15:00:00-03:00", end:"2026-04-01T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[1] },
  { id:"ga13", summary:"Weekly - Negocios com a China", start:"2026-04-01T16:00:00-03:00", end:"2026-04-01T17:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  // 02/abr
  { id:"ga14", summary:"Weekly - Bike Cajueiro", start:"2026-04-02T15:00:00-03:00", end:"2026-04-02T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga15", summary:"Weekly - Gymee", start:"2026-04-02T16:00:00-03:00", end:"2026-04-02T17:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga16", summary:"Weekly - Mafra", start:"2026-04-02T17:30:00-03:00", end:"2026-04-02T18:30:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  // 03/abr
  { id:"ga17", summary:"Weekly - Vagner Acessórios", start:"2026-04-03T14:00:00-03:00", end:"2026-04-03T15:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga18", summary:"Alinhamento Comercial [ChinaLink SUL]", start:"2026-04-03T15:00:00-03:00", end:"2026-04-03T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga19", summary:"Weekly - EG Beauty", start:"2026-04-03T15:00:00-03:00", end:"2026-04-03T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga20", summary:"Weekly - João Januário (alinhamento geral)", start:"2026-04-03T16:00:00-03:00", end:"2026-04-03T17:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  // 06/abr
  { id:"ga21", summary:"Weekly - Parrilo (META ADS)", start:"2026-04-06T14:00:00-03:00", end:"2026-04-06T15:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga22", summary:"Weekly - Mazzi (GOOGLE ADS)", start:"2026-04-06T15:00:00-03:00", end:"2026-04-06T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga23", summary:"Weekly - Time Comercial (ChinaLink)", start:"2026-04-06T16:00:00-03:00", end:"2026-04-06T17:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  // 07/abr
  { id:"ga24", summary:"Weekly - Lira Sat", start:"2026-04-07T14:00:00-03:00", end:"2026-04-07T15:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga25", summary:"Weekly - Leads Lincoln", start:"2026-04-07T15:00:00-03:00", end:"2026-04-07T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga26", summary:"GENE ALINHAMENTO - NANDO", start:"2026-04-07T17:00:00-03:00", end:"2026-04-07T17:30:00-03:00", calendar:"agência", color:GCAL_COLORS[8], recurring:true },
  // 08/abr
  { id:"ga27", summary:"Weekly - Auto Peças Fama", start:"2026-04-08T15:00:00-03:00", end:"2026-04-08T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga28", summary:"Weekly - Negocios com a China", start:"2026-04-08T16:00:00-03:00", end:"2026-04-08T17:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  // 09/abr
  { id:"ga29", summary:"Weekly - Megatrucks", start:"2026-04-09T15:00:00-03:00", end:"2026-04-09T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga30", summary:"Weekly - Derma House", start:"2026-04-09T15:00:00-03:00", end:"2026-04-09T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  // 10/abr
  { id:"ga31", summary:"Alinhamento Comercial [ChinaLink SUL]", start:"2026-04-10T15:00:00-03:00", end:"2026-04-10T16:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
  { id:"ga32", summary:"Weekly - João Januário (alinhamento geral)", start:"2026-04-10T16:00:00-03:00", end:"2026-04-10T17:00:00-03:00", calendar:"agência", color:GCAL_COLORS[6], recurring:true },
];

const ALL_GCAL_EVENTS = [...REAL_PERSONAL_EVENTS, ...REAL_AGENCY_EVENTS].sort((a,b) => new Date(a.start) - new Date(b.start));

// ═══════════════════════════════════════════
// FIREBASE REALTIME DATABASE — REST API + SSE (real-time)
// ═══════════════════════════════════════════
const FIREBASE_URL = "https://agencia-os-default-rtdb.firebaseio.com";

async function firebasePut(path, data) {
  try {
    const res = await fetch(`${FIREBASE_URL}/${path}.json`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Firebase PUT ${path}: ${res.status}`);
    return true;
  } catch (e) { console.error("Firebase write error:", e); return false; }
}

async function firebaseGet(path) {
  try {
    const res = await fetch(`${FIREBASE_URL}/${path}.json`);
    if (!res.ok) throw new Error(`Firebase GET ${path}: ${res.status}`);
    return await res.json();
  } catch (e) { console.error("Firebase read error:", e); return null; }
}

function firebaseListen(path, callback) {
  const evtSource = new EventSource(`${FIREBASE_URL}/${path}.json`);
  evtSource.addEventListener("put", (event) => {
    try {
      const parsed = JSON.parse(event.data);
      if (parsed.path === "/") { callback(parsed.data); }
      else { firebaseGet(path).then(d => { if (d !== null) callback(d); }); }
    } catch (e) { console.warn("SSE parse error:", e); }
  });
  evtSource.addEventListener("patch", () => {
    firebaseGet(path).then(d => { if (d !== null) callback(d); });
  });
  evtSource.onerror = () => { console.warn(`Firebase SSE reconnecting ${path}`); };
  return evtSource;
}

const _fbTimers = {};
function firebasePutDebounced(path, data, delay = 800) {
  clearTimeout(_fbTimers[path]);
  _fbTimers[path] = setTimeout(() => firebasePut(path, data), delay);
  try { localStorage.setItem(`agos-${path}`, JSON.stringify(data)); } catch(e) {}
}

async function loadData(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
async function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) {}
}

// ═══════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════
const Av = ({i,c="#6366f1",s=32}) => <div style={{width:s,height:s,borderRadius:"50%",background:`linear-gradient(135deg,${c},${c}dd)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:s*.38,fontWeight:700,flexShrink:0}}>{i}</div>;
const Bg = ({children,color="#6366f1",small}) => <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:small?"1px 6px":"2px 10px",borderRadius:20,fontSize:small?10:11,fontWeight:600,color,background:`${color}18`,whiteSpace:"nowrap"}}>{children}</span>;
const SLABg = ({sla}) => { if(!sla) return null; const ic={done:<CheckCircle2 size={11}/>,ok:<Clock size={11}/>,warning:<AlertTriangle size={11}/>,critical:<AlertCircle size={11}/>}; return <Bg color={sla.color} small>{ic[sla.status]} {sla.label}</Bg>; };
const PB = ({v,m,c="#6366f1",h=6}) => <div style={{width:"100%",height:h,borderRadius:h,background:"#1e293b",overflow:"hidden"}}><div style={{width:`${Math.min((v/m)*100,100)}%`,height:"100%",borderRadius:h,background:c,transition:"width .5s"}}/></div>;
const CkItem = ({item,onToggle}) => <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",cursor:"pointer",fontSize:13,color:item.done?"#64748b":"#e2e8f0",textDecoration:item.done?"line-through":"none"}}>{item.done?<CheckCircle2 size={15} color="#22c55e"/>:<Circle size={15} color="#475569"/>}{item.text}</div>;

const StatC = ({label,value,icon:Icon,color="#6366f1",sub}) => <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:"16px 18px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,color:"#94a3b8",fontWeight:500,letterSpacing:".04em",textTransform:"uppercase"}}>{label}</span>{Icon&&<div style={{width:30,height:30,borderRadius:8,background:`${color}20`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={15} color={color}/></div>}</div><div style={{fontSize:26,fontWeight:800,color:"#f1f5f9",marginTop:6}}>{value}</div>{sub&&<span style={{fontSize:11,color:"#64748b"}}>{sub}</span>}</div>;

const Tab = ({active,children,onClick}) => <button onClick={onClick} style={{padding:"7px 14px",fontSize:12,fontWeight:active?600:500,color:active?"#e2e8f0":"#64748b",background:active?"#1e293b":"transparent",border:"none",borderRadius:8,cursor:"pointer",whiteSpace:"nowrap"}}>{children}</button>;
const Btn = ({children,onClick,variant="primary",icon:Icon,small,disabled,style:s}) => {
  const st={primary:{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none"},secondary:{background:"#1e293b",color:"#e2e8f0",border:"1px solid #334155"},ghost:{background:"transparent",color:"#94a3b8",border:"none"},danger:{background:"#ef4444",color:"#fff",border:"none"},success:{background:"#22c55e",color:"#fff",border:"none"}};
  return <button onClick={onClick} disabled={disabled} style={{...st[variant],display:"inline-flex",alignItems:"center",gap:5,padding:small?"5px 10px":"8px 14px",borderRadius:8,fontSize:small?11:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,...s}}>{Icon&&<Icon size={small?12:14}/>}{children}</button>;
};
const Modal = ({open,onClose,title,children,wide}) => { if(!open) return null; return <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:40,zIndex:1000,overflowY:"auto"}}><div onClick={e=>e.stopPropagation()} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,width:wide?880:540,maxWidth:"95vw",maxHeight:"90vh",overflow:"auto",margin:"0 0 40px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:"1px solid #1e293b",position:"sticky",top:0,background:"#0f172a",zIndex:1,borderRadius:"16px 16px 0 0"}}><h3 style={{margin:0,fontSize:15,fontWeight:700,color:"#f1f5f9"}}>{title}</h3><button onClick={onClose} style={{background:"#1e293b",border:"none",borderRadius:8,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#94a3b8"}}><X size={15}/></button></div><div style={{padding:18}}>{children}</div></div></div>; };
const Inp = ({label,value,onChange,type="text",placeholder,textarea}) => <div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em"}}>{label}</label>}{textarea?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",minHeight:70,outline:"none",fontFamily:"inherit"}}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit"}}/>}</div>;
const Sel = ({label,value,onChange,options}) => <div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em"}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit"}}>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;

// ═══════════════════════════════════════════
// ERROR BOUNDARY — prevents white screen crashes
// ═══════════════════════════════════════════
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("AgênciaOS Error:", error, info); }
  render() {
    if (this.state.hasError) {
      return React.createElement("div", {style:{background:"#0f172a",color:"#e2e8f0",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui",padding:40}},
        React.createElement("h1", {style:{fontSize:24,fontWeight:800,marginBottom:12,color:"#ef4444"}}, "⚠️ AgênciaOS — Erro"),
        React.createElement("p", {style:{color:"#94a3b8",marginBottom:8,textAlign:"center"}}, "Algo deu errado. Clique no botão abaixo para resetar os dados e recarregar."),
        React.createElement("p", {style:{color:"#64748b",fontSize:12,marginBottom:20,maxWidth:500,textAlign:"center"}}, String(this.state.error?.message || this.state.error || "")),
        React.createElement("button", {onClick:()=>{try{Object.keys(localStorage).filter(k=>k.startsWith("agos")).forEach(k=>localStorage.removeItem(k));}catch(e){}window.location.reload();},style:{background:"#6366f1",color:"#fff",border:"none",borderRadius:10,padding:"12px 24px",fontSize:14,fontWeight:700,cursor:"pointer"}}, "🔄 Resetar e Recarregar"),
        React.createElement("p", {style:{color:"#475569",fontSize:10,marginTop:16}}, "Se o erro persistir, limpe os dados do navegador (Config → Resetar Dados)")
      );
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
function AgenciaOSApp() {
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState(DEFAULT_CLIENTS);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const kanbanRef = useRef(null);
  const kanbanScrollPos = useRef(0);
  const [kanbanFilter, setKanbanFilter] = useState("all");

  // Save scroll on every scroll event
  useEffect(() => {
    const handler = () => { if (kanbanRef.current) kanbanScrollPos.current = kanbanRef.current.scrollLeft; };
    const el = kanbanRef.current;
    if (el) { el.addEventListener("scroll", handler, { passive: true }); return () => el.removeEventListener("scroll", handler); }
  });
  // Restore scroll BEFORE paint using useLayoutEffect
  useLayoutEffect(() => {
    if (kanbanRef.current && kanbanScrollPos.current > 0) {
      kanbanRef.current.scrollLeft = kanbanScrollPos.current;
    }
  });
  const [notifications, setNotifications] = useState([
    {id:"n1",type:"alert",message:"SLA em risco: Chinalink — Setup tráfego urgente (R$15.000)",time:new Date(now-2*3600000).toISOString(),read:false,clientId:"c30"},
    {id:"n2",type:"info",message:"Novo cliente: Josivaldo — R$4.000 (Tráfego+Site+Social)",time:new Date(now-6*3600000).toISOString(),read:false,clientId:"c34"},
    {id:"n3",type:"payment",message:"Meta financeira Dez: R$60.640 de R$67.000 (90,51%)",time:new Date(now-1*DAY).toISOString(),read:true},
  ]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientTab, setClientTab] = useState("overview");
  const [showNotif, setShowNotif] = useState(false);
  const [showNewClient, setShowNewClient] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [draggedId, setDraggedId] = useState(null);
  const [taskFilter, setTaskFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);
  const [calEvents, setCalEvents] = useState(ALL_GCAL_EVENTS);
  const [calSynced, setCalSynced] = useState(false);
  const [calLastFetch, setCalLastFetch] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState(null);

  // ═══════════════════════════════════════════
  // GOOGLE CALENDAR LIVE SYNC
  // ═══════════════════════════════════════════
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
  const CALENDAR_IDS = ["thomas98macedo@gmail.com", "cltmkt2@gmail.com"];
  const CALENDAR_LABELS = {"thomas98macedo@gmail.com":"pessoal","cltmkt2@gmail.com":"agência"};

  const fetchGoogleCalendarEvents = useCallback(async (token) => {
    if (!token) return;
    try {
      const today = new Date();
      const timeMin = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const timeMax = new Date(today.getTime() + 21 * DAY).toISOString(); // 3 weeks ahead

      const allEvts = [];
      for (const calId of CALENDAR_IDS) {
        try {
          const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=100&timeZone=America/Sao_Paulo`;
          const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) continue;
          const data = await res.json();
          const calLabel = CALENDAR_LABELS[calId] || "outro";
          (data.items || []).forEach(ev => {
            if (ev.status === "cancelled") return;
            const colorHex = ev.colorId ? (GCAL_COLORS[ev.colorId] || DEFAULT_CAL_COLOR) : (calLabel === "agência" ? GCAL_COLORS[6] : DEFAULT_CAL_COLOR);
            allEvts.push({
              id: ev.id,
              summary: ev.summary || "(Sem título)",
              start: ev.start?.dateTime || ev.start?.date || "",
              end: ev.end?.dateTime || ev.end?.date || "",
              color: colorHex,
              colorId: ev.colorId,
              colorName: ev.colorId ? GCAL_COLOR_NAMES[ev.colorId] : null,
              calendar: calLabel,
              location: ev.location || "",
              description: ev.description || "",
              recurring: !!ev.recurringEventId,
              allDay: !!ev.start?.date && !ev.start?.dateTime,
              htmlLink: ev.htmlLink || "",
              attendees: ev.attendees?.map(a => a.email) || [],
            });
          });
        } catch (e) { console.warn(`Erro ao buscar ${calId}:`, e); }
      }
      allEvts.sort((a, b) => new Date(a.start) - new Date(b.start));
      setCalEvents(allEvts);
      setCalSynced(true);
      setCalLastFetch(new Date().toISOString());
    } catch (e) { console.error("Calendar fetch error:", e); }
  }, []);

  // Poll Google Calendar every 30 seconds
  useEffect(() => {
    if (!googleAccessToken) return;
    fetchGoogleCalendarEvents(googleAccessToken);
    const interval = setInterval(() => fetchGoogleCalendarEvents(googleAccessToken), 30000);
    return () => clearInterval(interval);
  }, [googleAccessToken, fetchGoogleCalendarEvents]);

  // Check for OAuth2 token in URL hash (redirect flow)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        setGoogleAccessToken(token);
        localStorage.setItem("agos-gcal-token", token);
        // Clean URL
        window.history.replaceState(null, "", window.location.pathname);
        // Extract user info from token
        fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json())
          .then(info => { if (info.email) processLogin(info.email, info.name, info.picture); })
          .catch(() => {});
      }
    } else {
      // Try stored token
      const stored = localStorage.getItem("agos-gcal-token");
      if (stored) {
        // Validate token
        fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + stored)
          .then(r => { if (r.ok) { setGoogleAccessToken(stored); } else { localStorage.removeItem("agos-gcal-token"); } })
          .catch(() => localStorage.removeItem("agos-gcal-token"));
      }
    }
  }, []);

  // ═══════════════════════════════════════════
  // AUTH SYSTEM
  // ═══════════════════════════════════════════
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("cs");
  const [inviteName, setInviteName] = useState("");
  const [inviteGC, setInviteGC] = useState("GC1");
  const [inviteSent, setInviteSent] = useState(false);
  const [authorizedUsers, setAuthorizedUsers] = useState([
    { email: "thomas98macedo@gmail.com", name: "Thomas Macedo", role: "director", avatar: "TM", gc: null, status: "active", invitedAt: new Date().toISOString() },
    { email: "cltmkt2@gmail.com", name: "CLT MKT", role: "director", avatar: "CM", gc: null, status: "active", invitedAt: new Date().toISOString() },
    { email: "fernandogb.ads@gmail.com", name: "Fernando Garcia", role: "head_traffic", avatar: "FG", gc: "GC1", status: "invited", invitedAt: new Date().toISOString() },
    { email: "aferreira@linceperformance.com", name: "Amanda Ferreira", role: "cs", avatar: "AF", gc: "BOTH", status: "invited", invitedAt: new Date().toISOString() },
    { email: "gabrielassoaress13@gmail.com", name: "Gabriela", role: "social", avatar: "GA", gc: "GC1", status: "invited", invitedAt: new Date().toISOString() },
    // Lucas designer desligado
    { email: "hteixeira@linceperformance.com", name: "Henrique", role: "creation_lead", avatar: "HE", gc: "BOTH", status: "invited", invitedAt: new Date().toISOString() },
    { email: "vneto@linceperformance.com", name: "Vincenzo", role: "filmmaker", avatar: "VI", gc: "GC1", status: "invited", invitedAt: new Date().toISOString() },
    { email: "filipexaxa65@gmail.com", name: "Felipe Dantas", role: "closer", avatar: "FD", gc: "GC1", status: "invited", invitedAt: new Date().toISOString() },
    { email: "suporteeolp@gmail.com", name: "Lucas SDR", role: "sdr", avatar: "LS", gc: "GC1", status: "invited", invitedAt: new Date().toISOString() },
    { email: "lfernandes@linceperformance.com", name: "Leonardo", role: "head_traffic", avatar: "LE", gc: "GC2", status: "invited", invitedAt: new Date().toISOString() },
    { email: "gfreire@linceperformance.com", name: "Gabriel", role: "traffic", avatar: "GB", gc: "GC2", status: "invited", invitedAt: new Date().toISOString() },
    { email: "avieira@linceperformance.com", name: "Allan", role: "traffic", avatar: "AL", gc: "GC2", status: "invited", invitedAt: new Date().toISOString() },
    { email: "fcorrea@linceperformance.com", name: "Fábio", role: "sdr", avatar: "FA", gc: "GC2", status: "invited", invitedAt: new Date().toISOString() },
    { email: "matheusbuenobsb@gmail.com", name: "Mateus Bueno", role: "sdr", avatar: "MB", gc: "GC2", status: "invited", invitedAt: new Date().toISOString() },
    { email: "mpaixao@linceperformance.com", name: "Mateus Paixão", role: "store_creator", avatar: "MP", gc: "GC2", status: "invited", invitedAt: new Date().toISOString() },
    { email: "alannabela@gmail.com", name: "Allana", role: "social", avatar: "AL", gc: "GC1", status: "invited", invitedAt: new Date().toISOString() },
    { email: "beatrizmarques1224@gmail.com", name: "Beatriz", role: "social", avatar: "BE", gc: "GC1", status: "invited", invitedAt: new Date().toISOString() },
    { email: "isabelle.cds11@gmail.com", name: "Isabelle", role: "social", avatar: "IS", gc: "GC2", status: "invited", invitedAt: new Date().toISOString() },
    { email: "lguimaraes@linceperformance.com", name: "Luiza", role: "social", avatar: "LG", gc: "BOTH", status: "invited", invitedAt: new Date().toISOString() },
    { email: "renan.andrade02@outlook.com", name: "Renan", role: "designer", avatar: "RE", gc: "GC2", status: "invited", invitedAt: new Date().toISOString() },
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Load auth data from persistent storage
  useEffect(() => {
    (async () => {
      try {
        const session = await loadData("agos-session", null);
        const users = await loadData("agos-authorized-users", null);
        if (users) setAuthorizedUsers(users);
        if (session && session.email) {
          const allUsers = users || authorizedUsers;
          const found = allUsers.find(u => u.email === session.email);
          if (found) setAuthUser({ ...found, lastLogin: session.lastLogin });
        }
      } catch (e) { console.error(e); }
      setAuthLoading(false);
    })();
  }, []);

  // Save authorized users (Firebase + localStorage)
  useEffect(() => {
    if (!authLoading) {
      saveData("agos-authorized-users", authorizedUsers);
      firebasePutDebounced("authorizedUsers", authorizedUsers, 1500);
    }
  }, [authorizedUsers, authLoading]);

  // Google Sign-In handler — OAuth2 implicit flow with Calendar scope
  const handleGoogleSignIn = useCallback(() => {
    const redirectUri = window.location.origin + window.location.pathname;
    const scope = "email profile https://www.googleapis.com/auth/calendar.readonly";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&prompt=select_account`;

    if (GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
      // No client ID configured — use manual email login
      setAuthError("google_fallback");
    } else {
      window.location.href = authUrl;
    }
  }, []);

  // Process login (from Google callback or manual entry for demo)
  const processLogin = useCallback(async (email, name, picture) => {
    const normalizedEmail = email.toLowerCase().trim();
    const found = authorizedUsers.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!found) {
      setAuthError("Acesso negado. Seu email não está autorizado. Peça ao administrador para convidar você.");
      return;
    }

    const user = {
      ...found,
      name: name || found.name,
      picture,
      lastLogin: new Date().toISOString(),
      status: "active",
    };

    // Update user in authorized list
    setAuthorizedUsers(prev => prev.map(u => u.email.toLowerCase() === normalizedEmail ? { ...u, name: user.name, status: "active", lastLogin: user.lastLogin } : u));
    setAuthUser(user);
    setAuthError("");
    await saveData("agos-session", { email: user.email, lastLogin: user.lastLogin });
  }, [authorizedUsers]);

  // Logout
  const handleLogout = useCallback(async () => {
    setAuthUser(null);
    setGoogleAccessToken(null);
    setCalSynced(false);
    setCalEvents(ALL_GCAL_EVENTS); // fallback to static
    try { localStorage.removeItem("agos-session"); localStorage.removeItem("agos-gcal-token"); } catch(e) {}
  }, []);

  // Invite collaborator
  const handleInvite = useCallback(async () => {
    if (!inviteEmail || !inviteName) return;
    const normalized = inviteEmail.toLowerCase().trim();
    if (authorizedUsers.some(u => u.email.toLowerCase() === normalized)) {
      setAuthError("Este email já está cadastrado.");
      return;
    }
    const initials = inviteName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const newUser = {
      email: normalized,
      name: inviteName,
      role: inviteRole,
      avatar: initials,
      gc: inviteGC,
      status: "invited",
      invitedAt: new Date().toISOString(),
    };
    setAuthorizedUsers(prev => [...prev, newUser]);
    const gcInfo = GC_TEAMS[inviteGC];
    setNotifications(prev => [{ id: `n${uid()}`, type: "info", message: `${gcInfo?.icon} Convite enviado: ${inviteName} — ${ROLES[inviteRole.toUpperCase()]?.label} | ${gcInfo?.name}`, time: new Date().toISOString(), read: false }, ...prev]);

    SEED_USERS.push({ id: `u${uid()}`, name: inviteName, email: normalized, role: inviteRole, avatar: initials, gc: inviteGC });

    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("cs");
    setInviteGC("GC1");
  }, [inviteEmail, inviteName, inviteRole, inviteGC, authorizedUsers]);

  // Remove collaborator
  const handleRemoveUser = useCallback((email) => {
    if (email === "thomas98macedo@gmail.com") return;
    setAuthorizedUsers(prev => prev.filter(u => u.email !== email));
  }, []);

  // Edit collaborator (name, role, GC, email)
  const saveEditUser = useCallback(() => {
    if (!editingUser) return;
    const oldEmail = editingUser._origEmail || editingUser.email;
    setAuthorizedUsers(prev => prev.map(u => {
      if (u.email !== oldEmail) return u;
      const initials = editingUser.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
      return { ...u, name: editingUser.name, email: editingUser.email, role: editingUser.role, gc: editingUser.gc, avatar: initials };
    }));
    // Also update SEED_USERS
    const idx = SEED_USERS.findIndex(u => u.email === oldEmail || u.id === editingUser.id);
    if (idx >= 0) {
      const initials = editingUser.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
      SEED_USERS[idx] = { ...SEED_USERS[idx], name: editingUser.name, email: editingUser.email, role: editingUser.role, gc: editingUser.gc, avatar: initials };
    }
    setShowEditUser(false);
    setEditingUser(null);
  }, [editingUser]);

  // Google Sign-In uses OAuth2 redirect flow (see handleGoogleSignIn)
  // No script initialization needed — auth happens via redirect

  // New forms
  const emptyNC = {company:"",contact:"",phone:"",email:"",segment:"",contractValue:"",priority:"high",notes:"",
    trafficPlatforms:[],creativeOption:"",socialOption:"social_none",storePlatforms:[],gcTeam:"GC1",
    pickCs:"",pickTraffic:"",pickSocial:"",pickDesigner:"",pickFilmmaker:"",pickCommercial:"",soldBy:""};
  const [nC, setNC] = useState({...emptyNC});
  const [nT, setNT] = useState({title:"",clientId:"",assigneeId:"",sector:"cs",priority:"medium",dueDate:"",description:"",requestedBy:""});
  const [expandedTask, setExpandedTask] = useState(null);
  const [nM, setNM] = useState({clientId:"",title:"",date:"",time:"10:00",duration:"60",notes:""});
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [editTeamData, setEditTeamData] = useState({csId:"",trafficId:"",socialId:"",designerId:"",filmmakerId:"",commercialId:""});
  const [toasts, setToasts] = useState([]);
  const [telegramConfig, setTelegramConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem("agos-telegram") || "null") || { botToken: "8700103821:AAEDJX4N3Ov-JH0p8HxqEMNMgju_xmeVVIA", chatId: "-5220667203", enabled: true }; } catch(e) { return { botToken: "8700103821:AAEDJX4N3Ov-JH0p8HxqEMNMgju_xmeVVIA", chatId: "-5220667203", enabled: true }; }
  });

  // Toggle array helper for checkboxes
  const toggleArr = (arr, val) => arr.includes(val) ? arr.filter(x=>x!==val) : [...arr, val];

  // Build service description from products
  const buildServiceDesc = (nc) => {
    const parts = [];
    if(nc.trafficPlatforms.length) parts.push(`Tráfego Pago (${nc.trafficPlatforms.map(p=>TRAFFIC_PLATFORMS.find(x=>x.id===p)?.label?.split(" ")[0]||p).join(", ")})`);
    if(nc.creativeOption) parts.push(CREATIVE_OPTIONS.find(x=>x.id===nc.creativeOption)?.label||nc.creativeOption);
    if(nc.socialOption==="social_2x") parts.push("Social Media 2x/semana");
    if(nc.storePlatforms.length) parts.push(`Loja (${nc.storePlatforms.map(p=>STORE_PLATFORMS.find(x=>x.id===p)?.label||p).join(", ")})`);
    return parts.join(" + ") || "A definir";
  };

  // ═══ GOOGLE SHEETS SYNC — planilha em tempo real ═══
  const SHEET_ID = "1PMZF4UMeW41GELJmlopr3ok14xO8_-21wBRqaD6yuIY";
  const [sheetSyncStatus, setSheetSyncStatus] = useState("idle"); // idle | syncing | synced | error
  const [lastSheetSync, setLastSheetSync] = useState(null);

  // ═══ TOAST POPUP SYSTEM (must be before syncFromSheet) ═══
  const showToast = useCallback((msg, type="info") => {
    const id = `toast_${uid()}`;
    setToasts(prev => [...prev, { id, message: msg, type, time: Date.now() }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("AgênciaOS", { body: msg.replace(/[🔄✅🚀📋⏰👥🆕⛔💣🚨]/g, "").trim(), icon: "/icon.svg" });
    }
  }, []);

  // ═══ TELEGRAM BOT (must be before syncFromSheet) ═══
  const sendTelegram = useCallback(async (msg) => {
    if (!telegramConfig.enabled || !telegramConfig.botToken || !telegramConfig.chatId) return;
    try {
      const text = msg.replace(/[<>]/g, "");
      await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: telegramConfig.chatId, text: `📊 *AgênciaOS*\n\n${text}`, parse_mode: "Markdown", disable_web_page_preview: true }),
      });
    } catch (e) { console.warn("Telegram send failed:", e); }
  }, [telegramConfig]);

  useEffect(() => { try { localStorage.setItem("agos-telegram", JSON.stringify(telegramConfig)); } catch(e) {} }, [telegramConfig]);

  const syncFromSheet = useCallback(async () => {
    if (!loaded) return; // don't sync before app loads
    setSheetSyncStatus("syncing");
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=BASE_2026`;
      const resp = await fetch(url).catch(() => null);
      if (!resp || !resp.ok) { setSheetSyncStatus("error"); return; }
      const text = await resp.text().catch(() => "");
      if (!text) { setSheetSyncStatus("error"); return; }
      // gviz returns JSONP-like: google.visualization.Query.setResponse({...})
      const jsonStr = text.match(/\{.*\}/s)?.[0];
      if (!jsonStr) { setSheetSyncStatus("error"); return; }
      const data = JSON.parse(jsonStr);
      const rows = data.table?.rows || [];
      const cols = data.table?.cols || [];

      // Parse rows (skip header row if present)
      const sheetClients = [];
      rows.forEach((row, idx) => {
        const cells = row.c || [];
        const name = cells[0]?.v?.toString().trim();
        const service = cells[1]?.v?.toString().trim() || "";
        const valueRaw = cells[2]?.v;
        const value = typeof valueRaw === "number" ? valueRaw : parseFloat(String(valueRaw||"0").replace(/[R$\s.]/g,"").replace(",",".")) || 0;
        const status = cells[3]?.v?.toString().trim().toUpperCase() || "";
        const month = cells[4]?.v?.toString().trim().toUpperCase() || "";
        const obs = cells[5]?.v?.toString().trim() || "";

        if (!name || name === "CLIENTE") return; // skip header

        const isChurning = status.includes("CHURN");
        const isActive = status.includes("NOVO") || status.includes("ATIVO");

        sheetClients.push({
          sheetName: name,
          nameNorm: name.toLowerCase().replace(/[^a-záàâãéêíóôõúüç0-9\s]/gi,"").trim(),
          service, value, isChurning, isActive, month, obs,
        });
      });

      // Compare with existing clients
      let added = 0, updated = 0, churned = 0;
      setClients(prev => {
        let updated_list = [...prev];

        sheetClients.forEach(sc => {
          // Find matching client by name similarity
          const existingIdx = updated_list.findIndex(c => {
            const cNorm = c.company.toLowerCase().replace(/[^a-záàâãéêíóôõúüç0-9\s]/gi,"").trim();
            return cNorm === sc.nameNorm || cNorm.includes(sc.nameNorm) || sc.nameNorm.includes(cNorm);
          });

          if (existingIdx >= 0) {
            const existing = updated_list[existingIdx];
            let changed = false;
            let updatedClient = {...existing};
            // Update status if changed (e.g. client churned in sheet)
            if (sc.isChurning && !existing.churning) {
              updatedClient = {...updatedClient, churning: true, status: "concluido",
                notes: `${existing.notes} ⚠️ CHURNING (sync planilha)`.trim(),
                timeline: [...existing.timeline, { date: new Date().toISOString(), event: "Cliente marcado como CHURNING (sync planilha)", user: "Planilha" }]
              };
              churned++;
              changed = true;
            }
            // Update value if different
            if (sc.value && sc.value !== existing.contractValue) {
              updatedClient = {...updatedClient, contractValue: sc.value};
              updated++;
              changed = true;
            }
            if (changed) updated_list[existingIdx] = updatedClient;
          } else if (sc.isActive) {
            // New client from sheet — add to app
            const monthMap = {DEZEMBRO:11,JANEIRO:0,FEVEREIRO:1,"MARÇO":2,ABRIL:3,MAIO:4,JUNHO:5};
            const mIdx = monthMap[sc.month] ?? 2;
            const num = updated_list.length;
            const autoGC = num % 2 === 0 ? "GC1" : "GC2";
            const newClient = {
              id: `cs${uid()}`,
              company: sc.sheetName,
              contact: "", phone: "", email: "", segment: "",
              service: sc.service,
              contractValue: sc.value,
              closedDate: new Date(2026, mIdx, 15).toISOString(),
              paymentDate: null, status: "venda_fechada",
              priority: sc.value >= 3000 ? "high" : "medium",
              csId: "u2", trafficId: "u3", socialId: null, designerId: "u20", filmmakerId: null, commercialId: "u7", soldBy: null,
              whatsappGroup: "", formStatus: "not_sent",
              onboardingDate: null, trafficActivationDate: null,
              notes: `${sc.obs} Importado da planilha | Mês: ${sc.month}`.trim(),
              payDay: null, contractEnd: null,
              churning: false, encerrado: false, gcTeam: autoGC,
              csChecklist: mkChecklist(CS_CK), onboardingChecklist: mkChecklist(OB_CK),
              trafficChecklist: mkChecklist(TR_CK), creationChecklist: mkChecklist(CR_CK), socialBriefing: mkChecklist(SM_BRIEFING),
              timeline: [{ date: new Date().toISOString(), event: `Importado da planilha — ${sc.service} | R$${sc.value}`, user: "Planilha" }],
              meetings: [], reports: [],
              fromSheet: true,
            };
            updated_list.push(newClient);
            added++;
          }
        });

        return (added > 0 || churned > 0 || updated > 0) ? updated_list : prev;
      });

      setSheetSyncStatus("synced");
      setLastSheetSync(new Date().toISOString());
      if (added > 0 || churned > 0) {
        const msg = `📊 Sync Planilha: ${added} novos clientes, ${churned} churns detectados, ${updated} valores atualizados`;
        showToast(msg);
        sendTelegram(msg);
        setNotifications(prev => [{ id: `n${uid()}`, type: "info", message: msg, time: new Date().toISOString(), read: false }, ...prev]);
      } else {
        showToast("✅ Planilha sincronizada — sem alterações");
      }
    } catch (e) {
      console.error("Sheet sync error:", e);
      setSheetSyncStatus("error");
      showToast("❌ Erro ao sincronizar planilha: " + e.message);
    }
  }, [loaded, showToast, sendTelegram]);

  // Auto-sync every 5 minutes (NOT on initial load — use button in Config)
  useEffect(() => {
    if (!loaded) return; // wait for app to fully load first
    const interval = setInterval(() => {
      try { syncFromSheet(); } catch(e) { console.warn("Sheet sync error:", e); }
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loaded]);

  // ═══ FIREBASE REAL-TIME SYNC — todos os 18 usuários veem mudanças na hora ═══
  const firebaseListeners = useRef([]);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  useEffect(() => {
    const toArr = (d) => { if (!d) return null; if (Array.isArray(d)) return d; return Object.values(d); };
    (async () => {
      try {
        const c = await loadData("agos-clients", null);
        const t = await loadData("agos-tasks", null);
        const n = await loadData("agos-notifs", null);
        if(c && Array.isArray(c)) {
          setClients(function(prev) {
            if(!prev || !Array.isArray(prev) || prev.length === 0) return c;
            return c.map(function(incoming) {
              var local = prev.find(function(p) { return p.id === incoming.id; });
              if(!local) return incoming;
              var KO = (typeof KANBAN_ORDER_MAP !== 'undefined') ? KANBAN_ORDER_MAP : {};
              var localOrder = KO[local.status] !== undefined ? KO[local.status] : -1;
              var incomingOrder = KO[incoming.status] !== undefined ? KO[incoming.status] : -1;
              if(incomingOrder < localOrder && localOrder >= 0) {
                console.warn('[KANBAN-PROTECT]', incoming.co, incoming.status, '->', local.status);
                return Object.assign({}, incoming, { status: local.status, statusChangedAt: local.statusChangedAt || incoming.statusChangedAt });
              }
              return incoming;
            });
          });
        }
        if(t && Array.isArray(t)) setTasks(t);
        if(n && Array.isArray(n)) setNotifications(n);
      } catch(e) { console.warn("Load data error:", e); }
      setLoaded(true);

      try {
        const [fbC,fbT,fbN] = await Promise.all([
          firebaseGet("clients"), firebaseGet("tasks"), firebaseGet("notifications"),
        ]);
        const fc=toArr(fbC),ft=toArr(fbT),fn=toArr(fbN);
        if(fc&&fc.length>0) setClients(fc);
        if(ft&&ft.length>0) setTasks(ft);
        if(fn&&fn.length>0) setNotifications(fn);
        setFirebaseConnected(true);
      } catch(e) { console.warn("Firebase load failed:", e); }

      try {
        const l1=firebaseListen("clients",(d)=>{const a=toArr(d);if(a&&a.length>0)setClients(a);});
        const l2=firebaseListen("tasks",(d)=>{const a=toArr(d);if(a&&a.length>0)setTasks(a);});
        const l3=firebaseListen("notifications",(d)=>{const a=toArr(d);if(a)setNotifications(a);});
        firebaseListeners.current=[l1,l2,l3];
        setFirebaseConnected(true);
        console.log("✅ Firebase SSE active");
      } catch(e) { console.warn("SSE failed:", e); }
    })();
    return()=>{firebaseListeners.current.forEach(l=>{try{l.close();}catch(e){}});};
  }, []);

  useEffect(()=>{if(!loaded)return;saveData("agos-clients",clients);firebasePut("clients",clients); // IMMEDIATE — prevents race condition/card revert},[clients,loaded]);
  useEffect(()=>{if(!loaded)return;saveData("agos-tasks",tasks);firebasePutDebounced("tasks",tasks,1000);},[tasks,loaded]);
  useEffect(()=>{if(!loaded)return;saveData("agos-notifs",notifications);firebasePutDebounced("notifications",notifications,1500);},[notifications,loaded]);

  // ═══ NOTIFICATION TIMER — 10 min before each event ═══
  useEffect(() => {
    const notifiedRef = new Set();
    const checkNotifications = () => {
      const nowMs = Date.now();
      const TEN_MIN = 10 * 60 * 1000;
      calEvents.forEach(ev => {
        if (!ev.start || ev.allDay) return;
        const evStart = new Date(ev.start).getTime();
        const diff = evStart - nowMs;
        // Between 0 and 10 minutes from now
        if (diff > 0 && diff <= TEN_MIN && !notifiedRef.has(ev.id)) {
          notifiedRef.add(ev.id);
          const mins = Math.round(diff / 60000);
          setNotifications(prev => [{
            id: `notif_${ev.id}`,
            type: "meeting",
            message: `⏰ Em ${mins} min: ${ev.summary}${ev.location ? ` — ${ev.location}` : ""}`,
            time: new Date().toISOString(),
            read: false,
          }, ...prev]);
          // Browser notification
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification(`⏰ Em ${mins} min`, { body: ev.summary, icon: "/icon.svg" });
          }
        }
      });
    };
    // Request browser notification permission
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000); // check every 30s
    return () => clearInterval(interval);
  }, [calEvents]);

  const handleCreateMeeting = useCallback(async () => {
    if(!nM.clientId || !nM.date || !nM.time) return;
    setCreatingEvent(true);
    const cl = clients.find(c => c.id === nM.clientId);
    const title = nM.title || `Reunião Agência × ${cl?.company}`;
    setClients(prev => prev.map(c => {
      if(c.id !== nM.clientId) return c;
      return { ...c,
        meetings: [...(c.meetings||[]), { id:`m${uid()}`, date:`${nM.date}T${nM.time}:00-03:00`, time:nM.time, status:"scheduled", notes:nM.notes, title, gcalSynced:false }],
        timeline: [...c.timeline, { date:new Date().toISOString(), event:`Reunião agendada: ${nM.date} ${nM.time}`, user:"Thomas" }]
      };
    }));
    setNotifications(prev => [{ id:`n${uid()}`, type:"meeting", message:`Reunião agendada: ${cl?.company} — ${nM.date} ${nM.time}`, time:new Date().toISOString(), read:false, clientId:nM.clientId }, ...prev]);
    setCreatingEvent(false);
    setShowNewMeeting(false);
    setNM({clientId:"",title:"",date:"",time:"10:00",duration:"60",notes:""});
  }, [nM, clients]);

  const openClient = id => { setSelectedClient(id); setClientTab("overview"); setPage("client_detail"); };
  const getUser = id => SEED_USERS.find(u => u.id === id);
  const client = selectedClient ? clients.find(c => c.id === selectedClient) : null;
  const unread = notifications.filter(n => !n.read).length;

  const toggleCk = (cid,key,iid) => setClients(p=>p.map(c=>c.id!==cid?c:{...c,[key]:c[key].map(i=>i.id===iid?{...i,done:!i.done}:i)}));

  // ═══ DAILY SUMMARY — resumo automático no Telegram ═══
  const sendDailySummary = useCallback(() => {
    if (!telegramConfig.enabled) return;
    const today = new Date().toLocaleDateString("pt-BR", { weekday:"long", day:"2-digit", month:"2-digit", year:"numeric" });
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);

    // Tarefas atribuídas hoje
    const todayTasks = tasks.filter(t => t.autoCreated && new Date(t.dueDate||0) >= todayStart);
    
    // Tarefas por pessoa
    const tasksByUser = {};
    tasks.forEach(t => {
      if (!t.assigneeId) return;
      const u = getUser(t.assigneeId);
      if (!u) return;
      if (!tasksByUser[u.id]) tasksByUser[u.id] = { name: u.name, role: ROLES[u.role?.toUpperCase()]?.label||u.role, pending: 0, done: 0, overdue: 0, tasks: [] };
      if (t.status === "done") tasksByUser[u.id].done++;
      else {
        tasksByUser[u.id].pending++;
        if (t.dueDate && new Date(t.dueDate) < new Date()) tasksByUser[u.id].overdue++;
      }
      tasksByUser[u.id].tasks.push(t);
    });

    // Tarefas concluídas hoje
    const completedToday = tasks.filter(t => t.status === "done");

    // Tarefas atrasadas
    const overdueTasks = tasks.filter(t => t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date());

    // Montar mensagem
    let msg = `📋 *RESUMO DO DIA*\n${today}\n\n`;

    // Tarefas por pessoa
    msg += `👥 *TAREFAS POR COLABORADOR:*\n`;
    const sortedUsers = Object.values(tasksByUser).sort((a,b) => (b.pending+b.done) - (a.pending+a.done));
    sortedUsers.forEach(u => {
      const status = u.overdue > 0 ? "🔴" : u.pending > 0 ? "🟡" : "🟢";
      msg += `${status} *${u.name}* (${u.role})\n`;
      msg += `   📌 ${u.pending} pendentes | ✅ ${u.done} concluídas`;
      if (u.overdue > 0) msg += ` | ⚠️ ${u.overdue} atrasadas`;
      msg += `\n`;
    });

    // Concluídas
    if (completedToday.length > 0) {
      msg += `\n✅ *TAREFAS CONCLUÍDAS (${completedToday.length}):*\n`;
      completedToday.slice(0, 15).forEach(t => {
        const u = getUser(t.assigneeId);
        const cl = clients.find(c => c.id === t.clientId);
        msg += `• ${t.title}${cl ? ` (${cl.company})` : ""} — por ${u?.name||"?"}\n`;
      });
      if (completedToday.length > 15) msg += `... e mais ${completedToday.length - 15}\n`;
    }

    // Atrasadas
    if (overdueTasks.length > 0) {
      msg += `\n🚨 *TAREFAS ATRASADAS (${overdueTasks.length}):*\n`;
      overdueTasks.slice(0, 15).forEach(t => {
        const u = getUser(t.assigneeId);
        const cl = clients.find(c => c.id === t.clientId);
        const daysLate = Math.ceil((Date.now() - new Date(t.dueDate).getTime()) / 86400000);
        msg += `• ${t.title}${cl ? ` (${cl.company})` : ""} — ${u?.name||"?"} — ${daysLate}d atrasada\n`;
      });
      if (overdueTasks.length > 15) msg += `... e mais ${overdueTasks.length - 15}\n`;
    }

    // Resumo geral
    const totalActive = clients.filter(c => !c.churning && !c.encerrado && c.status !== "concluido").length;
    msg += `\n📊 *RESUMO GERAL:*\n`;
    msg += `• ${totalActive} clientes ativos\n`;
    msg += `• ${tasks.filter(t=>t.status!=="done").length} tarefas pendentes\n`;
    msg += `• ${overdueTasks.length} tarefas atrasadas\n`;
    msg += `• ${completedToday.length} concluídas hoje\n`;
    msg += `\n💪 _Bora Lince!_`;

    sendTelegram(msg);
    showToast("📋 Resumo diário enviado no Telegram");
  }, [telegramConfig, tasks, clients, sendTelegram, showToast]);

  // Timer automático — verifica a cada minuto se é hora de enviar
  useEffect(() => {
    if (!telegramConfig.enabled) return;
    const summaryHour = telegramConfig.summaryHour || 18; // padrão 18h
    const summaryMin = telegramConfig.summaryMin || 0;
    const todayKey = new Date().toDateString();

    const checkTime = () => {
      const now = new Date();
      const sentToday = localStorage.getItem("agos-summary-sent");
      if (now.getHours() === summaryHour && now.getMinutes() === summaryMin && sentToday !== todayKey) {
        localStorage.setItem("agos-summary-sent", todayKey);
        sendDailySummary();
      }
    };
    const interval = setInterval(checkTime, 60000); // check every minute
    return () => clearInterval(interval);
  }, [telegramConfig, sendDailySummary]);

  // ═══ TIME FORMATTING HELPER ═══
  const formatDuration = (ms) => {
    if (!ms || ms < 0) return "agora";
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return "< 1 min";
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs < 24) return remMins > 0 ? `${hrs}h ${remMins}min` : `${hrs}h`;
    const days = Math.floor(hrs / 24);
    const remHrs = hrs % 24;
    return remHrs > 0 ? `${days}d ${remHrs}h` : `${days}d`;
  };

  // KANBAN ORDER — prevents backward movement
  const KANBAN_ORDER_MAP = {};
  KANBAN_COLUMNS.forEach((col, i) => { KANBAN_ORDER_MAP[col.id] = i; });

  const moveClient = (cid,newSt) => {
    // IMMEDIATE save flag
    window.__moveClientPending = true;
    setClients(p => p.map(c => {
      if(c.id !== cid) return c;
      // BLOCK backward movement (unless user explicitly moved it)
      const oldI = KANBAN_ORDER_MAP[c.status] || 0;
      const newI = KANBAN_ORDER_MAP[newSt] || 0;
      if(newI < oldI) { console.warn("BLOCKED backward: "+c.company+" "+c.status+"->"+newSt); }
      if(c.id!==cid) return c;

      // ═══ DUAL APPROVAL BLOCK — can't move to Concluído unless both done ═══
      if(c.status==="aprovacao_concluida" && newSt==="concluido" && (!c.trafficDone || !c.socialDone)) {
        const missing = [];
        if(!c.trafficDone) missing.push("Tráfego (campanhas)");
        if(!c.socialDone) missing.push("Social Media (postagens)");
        showToast(`⛔ ${c.company}: Não pode concluir — falta: ${missing.join(" e ")}`, "error");
        return c; // Don't move
      }

      // ═══ CALCULATE TIME IN PREVIOUS STATUS ═══
      const prevCol = KANBAN_COLUMNS.find(k=>k.id===c.status);
      const newCol = KANBAN_COLUMNS.find(k=>k.id===newSt);
      const prevLabel = prevCol?.label || c.status;
      const newLabel = newCol?.label || newSt;
      const lastMove = c.statusChangedAt || c.closedDate || new Date().toISOString();
      const timeInStatus = Date.now() - new Date(lastMove).getTime();
      const timeStr = formatDuration(timeInStatus);
      const moverName = authUser?.name || "Thomas";

      const u = {
        ...c,
        status: newSt,
        statusChangedAt: new Date().toISOString(),
        timeline:[...c.timeline,{
          date: new Date().toISOString(),
          event: `${prevLabel} → ${newLabel} — ${timeStr} — por ${moverName}`,
          user: moverName,
        }],
      };

      if(newSt==="pagamento_confirmado"&&!c.paymentDate) {
        u.paymentDate=new Date().toISOString();
        u.timeline.push({date:new Date().toISOString(),event:"Pagamento confirmado — SLA 48h",user:"Sistema"});
      }
      if(newSt==="trafego_ativo"&&!c.trafficActivationDate) {
        u.trafficActivationDate=new Date().toISOString();
        u.timeline.push({date:new Date().toISOString(),event:"Tráfego ativado!",user:moverName});
      }
      if(newSt==="onboarding_concluido"&&!c.onboardingDate) u.onboardingDate=new Date().toISOString();

      // ═══ NOTIFY ALL — toast + notification history ═══
      const notifMsg = `🔄 ${c.company}: ${prevLabel} → ${newLabel} — ${timeStr} — por ${moverName}`;
      setTimeout(() => {
        // Save to notification history (bell icon)
        setNotifications(prev => [{
          id:`n${uid()}`,
          type: newSt==="concluido" ? "success" : "kanban",
          message: notifMsg,
          time: new Date().toISOString(),
          read: false,
          clientId: c.id,
        }, ...prev]);
        // Show toast popup (top-right corner)
        showToast(notifMsg, newSt==="concluido"?"success":"info");
        // Send to Telegram group
        sendTelegram(notifMsg);
      }, 100);

      // Extra notification for onboarding
      if(newSt==="onboarding_agendado"||newSt==="onboarding_concluido") {
        const prodList = c.service || "serviços contratados";
        const gcLabel = c.gcTeam ? GC_TEAMS[c.gcTeam]?.name : "";
        setTimeout(() => {
          setNotifications(prev => [{
            id:`n${uid()}`, type:"alert",
            message:`🚀 ONBOARDING: ${c.company} → ${newLabel}! Produtos: ${prodList}${gcLabel ? ` | ${gcLabel}` : ""}`,
            time:new Date().toISOString(), read:false, clientId:c.id
          }, ...prev]);
        }, 200);
      }

      // ═══ AUTO-CREATE TASKS — templates por status ═══
      const autoTasks = [];
      const DAY_MS = 86400000;
      const nowISO = new Date().toISOString();

      if (newSt === "alinhamento_visual") {
        autoTasks.push(
          { title: `Alinhamento Visual — ${c.company}`, sector: "creation_lead", assigneeId: c.designerId || SEED_USERS.find(u=>u.role==="creation_lead")?.id, priority: "high", dueDate: new Date(Date.now()+2*DAY_MS).toISOString() },
          { title: `Referências visuais e paleta — ${c.company}`, sector: "designer", assigneeId: c.designerId, priority: "medium", dueDate: new Date(Date.now()+2*DAY_MS).toISOString() },
        );
      }
      if (newSt === "setup_trafego") {
        autoTasks.push(
          { title: `Conectar BM/conta de anúncios — ${c.company}`, sector: "traffic", assigneeId: c.trafficId, priority: "urgent", dueDate: new Date(Date.now()+1*DAY_MS).toISOString() },
          { title: `Configurar campanhas — ${c.company}`, sector: "traffic", assigneeId: c.trafficId, priority: "urgent", dueDate: new Date(Date.now()+1*DAY_MS).toISOString() },
          { title: `Ativar tráfego (SLA 24h) — ${c.company}`, sector: "traffic", assigneeId: c.trafficId, priority: "urgent", dueDate: new Date(Date.now()+1*DAY_MS).toISOString() },
        );
      }
      if (newSt === "trafego_ativo") {
        autoTasks.push(
          { title: `Weekly semanal — ${c.company}`, sector: "traffic", assigneeId: c.trafficId, priority: "medium", dueDate: new Date(Date.now()+7*DAY_MS).toISOString() },
          { title: `Relatório mensal — ${c.company}`, sector: "traffic", assigneeId: c.trafficId, priority: "medium", dueDate: new Date(Date.now()+30*DAY_MS).toISOString() },
        );
      }
      if (newSt === "producao_andamento") {
        const creationLead = SEED_USERS.find(u=>u.role==="creation_lead");
        autoTasks.push(
          { title: `Criar peças criativas — ${c.company}`, sector: "designer", assigneeId: c.designerId, priority: "high", dueDate: new Date(Date.now()+5*DAY_MS).toISOString() },
          { title: `Gravar/editar vídeos — ${c.company}`, sector: "filmmaker", assigneeId: c.filmmakerId, priority: "high", dueDate: new Date(Date.now()+5*DAY_MS).toISOString() },
          { title: `Planejamento conteúdo social — ${c.company}`, sector: "social", assigneeId: c.socialId, priority: "medium", dueDate: new Date(Date.now()+3*DAY_MS).toISOString() },
          { title: `Revisar entregáveis criação — ${c.company}`, sector: "creation_lead", assigneeId: creationLead?.id, priority: "high", dueDate: new Date(Date.now()+6*DAY_MS).toISOString() },
        );
      }
      if (newSt === "aprovacao_concluida") {
        autoTasks.push(
          { title: `Subir campanhas aprovadas — ${c.company}`, sector: "traffic", assigneeId: c.trafficId, priority: "urgent", dueDate: new Date(Date.now()+1*DAY_MS).toISOString() },
          { title: `Agendar postagens aprovadas — ${c.company}`, sector: "social", assigneeId: c.socialId, priority: "urgent", dueDate: new Date(Date.now()+1*DAY_MS).toISOString() },
        );
      }

      if (autoTasks.length > 0) {
        setTimeout(() => {
          const newTasks = autoTasks.filter(at => at.assigneeId).map(at => ({
            id: `t${uid()}`,
            title: at.title,
            clientId: c.id,
            assigneeId: at.assigneeId,
            sector: at.sector,
            priority: at.priority,
            status: "pending",
            dueDate: at.dueDate,
            subtasks: [],
            autoCreated: true,
          }));
          setTasks(prev => [...prev, ...newTasks]);

          // Notify each task via toast + telegram
          const taskSummary = newTasks.map(t => {
            const user = getUser(t.assigneeId);
            return `• ${t.title} → ${user?.name||"?"} (prazo ${new Date(t.dueDate).toLocaleDateString("pt-BR")})`;
          }).join("\n");
          const telegramMsg = `📋 *Tarefas automáticas criadas*\n${c.company} → ${newLabel}\n\n${taskSummary}`;
          sendTelegram(telegramMsg);
          showToast(`📋 ${newTasks.length} tarefas criadas para ${c.company}`);
          setNotifications(prev => [{
            id:`n${uid()}`, type:"info",
            message:`📋 ${newTasks.length} tarefas automáticas: ${c.company} → ${newLabel}`,
            time: nowISO, read: false, clientId: c.id,
          }, ...prev]);
        }, 300);
      }

      return u;
    }));
  };

  const createClient = () => {
    const serviceDesc = buildServiceDesc(nC);
    const hasTraffic = nC.trafficPlatforms.length > 0;
    const hasSocial = nC.socialOption === "social_2x";
    const hasCreative = !!nC.creativeOption;
    const hasStore = nC.storePlatforms.length > 0;

    // Manual picks first, then auto-assign by GC as fallback
    const gcUsers = SEED_USERS.filter(u => u.gc === nC.gcTeam || u.gc === "BOTH");
    const findByRole = (role) => gcUsers.find(u => u.role === role)?.id || gcUsers.find(u => u.role === "head_traffic")?.id || SEED_USERS.find(u => u.role === role)?.id || null;

    const c = {
      id:`c${uid()}`, company:nC.company, contact:nC.contact, phone:nC.phone, email:nC.email,
      segment:nC.segment, service:serviceDesc, contractValue:Number(nC.contractValue)||0,
      closedDate:new Date().toISOString(), paymentDate:null, status:"venda_fechada",
      priority:nC.priority,
      // Manual pick > auto-assign
      csId: nC.pickCs || findByRole("cs"),
      trafficId: hasTraffic ? (nC.pickTraffic || findByRole("traffic")) : null,
      socialId: hasSocial ? (nC.pickSocial || findByRole("social")) : null,
      designerId: hasCreative ? (nC.pickDesigner || findByRole("designer")) : null,
      filmmakerId: hasCreative ? (nC.pickFilmmaker || findByRole("filmmaker")) : null,
      commercialId: nC.pickCommercial || findByRole("commercial"),
      soldBy: nC.soldBy || null,
      // Products detail
      products: {
        trafficPlatforms: nC.trafficPlatforms,
        creativeOption: nC.creativeOption,
        socialOption: nC.socialOption,
        storePlatforms: nC.storePlatforms,
      },
      gcTeam: nC.gcTeam,
      whatsappGroup:"", formStatus:"not_sent", onboardingDate:null, trafficActivationDate:null,
      notes:nC.notes,
      csChecklist:mkChecklist(CS_CK), onboardingChecklist:mkChecklist(OB_CK),
      trafficChecklist:mkChecklist(TR_CK), creationChecklist:mkChecklist(CR_CK), socialBriefing:mkChecklist(SM_BRIEFING),
      timeline:[{date:new Date().toISOString(),event:`Venda fechada — ${serviceDesc} | ${GC_TEAMS[nC.gcTeam]?.name||""}${nC.soldBy ? ` | Vendido por: ${getUser(nC.soldBy)?.name||""}` : ""}`,user:authUser?.name||"Thomas"}],
      meetings:[], reports:[],
    };
    setClients(p=>[c,...p]);
    // Notify all collaborators
    const prodSummary = [
      hasTraffic ? `Tráfego (${nC.trafficPlatforms.length} plataforma${nC.trafficPlatforms.length>1?"s":""})` : "",
      hasCreative ? (nC.creativeOption==="16criativos"?"16 criativos/mês":"8 criativos/mês") : "",
      hasSocial ? "Social Media" : "",
      hasStore ? `Loja (${nC.storePlatforms.length})` : "",
    ].filter(Boolean).join(", ");
    const sellerName = nC.soldBy ? getUser(nC.soldBy)?.name : null;
    const newClientMsg = `🆕 Nova venda: ${c.company} — R$${c.contractValue?.toLocaleString("pt-BR")} | ${prodSummary} | ${GC_TEAMS[nC.gcTeam]?.icon} ${GC_TEAMS[nC.gcTeam]?.name}${sellerName ? ` | Vendido por: ${sellerName}` : ""}`;
    setNotifications(p=>[{id:`n${uid()}`,type:"info",message:newClientMsg,time:new Date().toISOString(),read:false,clientId:c.id},...p]);
    sendTelegram(newClientMsg);
    showToast(newClientMsg);
    setShowNewClient(false);
    setNC({...emptyNC});
  };

  // ═══ EDIT TEAM — swap collaborators on any client ═══
  const openEditTeam = (cid) => {
    const c = clients.find(x => x.id === cid);
    if (!c) return;
    setEditTeamData({ csId:c.csId||"", trafficId:c.trafficId||"", socialId:c.socialId||"", designerId:c.designerId||"", filmmakerId:c.filmmakerId||"", commercialId:c.commercialId||"" });
    setShowEditTeam(true);
  };
  const saveEditTeam = () => {
    if (!selectedClient) return;
    setClients(p => p.map(c => {
      if (c.id !== selectedClient) return c;
      const changes = [];
      if (editTeamData.csId !== (c.csId||"")) changes.push(`CS: ${getUser(editTeamData.csId)?.name||"removido"}`);
      if (editTeamData.trafficId !== (c.trafficId||"")) changes.push(`Tráfego: ${getUser(editTeamData.trafficId)?.name||"removido"}`);
      if (editTeamData.socialId !== (c.socialId||"")) changes.push(`Social: ${getUser(editTeamData.socialId)?.name||"removido"}`);
      if (editTeamData.designerId !== (c.designerId||"")) changes.push(`Design: ${getUser(editTeamData.designerId)?.name||"removido"}`);
      if (editTeamData.filmmakerId !== (c.filmmakerId||"")) changes.push(`Filmmaker: ${getUser(editTeamData.filmmakerId)?.name||"removido"}`);
      if (editTeamData.commercialId !== (c.commercialId||"")) changes.push(`Comercial: ${getUser(editTeamData.commercialId)?.name||"removido"}`);
      return {
        ...c,
        csId: editTeamData.csId || null,
        trafficId: editTeamData.trafficId || null,
        socialId: editTeamData.socialId || null,
        designerId: editTeamData.designerId || null,
        filmmakerId: editTeamData.filmmakerId || null,
        commercialId: editTeamData.commercialId || null,
        timeline: [...c.timeline, ...(changes.length ? [{ date:new Date().toISOString(), event:`Equipe alterada: ${changes.join(", ")}`, user:"Thomas" }] : [])],
      };
    }));
    if (editTeamData.csId || editTeamData.trafficId || editTeamData.socialId || editTeamData.designerId || editTeamData.filmmakerId) {
      const cl = clients.find(c => c.id === selectedClient);
      setNotifications(prev => [{ id:`n${uid()}`, type:"info", message:`👥 Equipe atualizada: ${cl?.company}`, time:new Date().toISOString(), read:false, clientId:selectedClient }, ...prev]);
    }
    setShowEditTeam(false);
  };

  // Helper: build user options for role selector
  const userOptionsForRole = (role) => {
    const opts = [{value:"", label:"— Nenhum —"}];
    SEED_USERS.filter(u => !role || u.role === role || u.role === "admin" || u.role === "director" || (role==="traffic" && u.role==="head_traffic")).forEach(u => {
      const gc = GC_TEAMS[u.gc];
      opts.push({ value: u.id, label: `${u.name}${gc ? ` (${gc.icon} ${gc.id})` : ""}` });
    });
    return opts;
  };
  const allUserOptions = () => {
    const opts = [{value:"", label:"— Nenhum —"}];
    SEED_USERS.forEach(u => {
      const role = ROLES[u.role?.toUpperCase()];
      const gc = GC_TEAMS[u.gc];
      opts.push({ value: u.id, label: `${u.name} — ${role?.label||u.role}${gc ? ` (${gc.icon})` : ""}` });
    });
    return opts;
  };

  const createTask = () => {
    setTasks(p=>[{id:`t${uid()}`,...nT,status:"pending",subtasks:[],createdAt:new Date().toISOString(),requestedByName:getUser(nT.requestedBy)?.name||nT.requestedBy||authUser?.name||"Thomas"},...p]);
    // Auto-move: se o cliente está em tráfego_ativo e criou tarefa de criação/social/designer/filmmaker → mover pra Produção
    if(nT.clientId){
      const cl=clients.find(c=>c.id===nT.clientId);
      if(cl&&cl.status==="trafego_ativo"&&["designer","social","filmmaker","creation_lead"].includes(nT.sector)){
        moveClient(nT.clientId,"producao_andamento");
        showToast(`🔄 ${cl.company} movido para Produção automaticamente`);
      }
    }
    setShowNewTask(false);
    setNT({title:"",clientId:"",assigneeId:"",sector:"cs",priority:"medium",dueDate:"",description:"",requestedBy:""});
  };

  // Derived
  const active = clients.filter(c=>c.status!=="concluido");
  const onboarding = clients.filter(c=>["cs_inicial","cobranca_enviada","pagamento_confirmado","onboarding_agendado","onboarding_concluido"].includes(c.status));
  const awaitPay = clients.filter(c=>["cs_inicial","cobranca_enviada"].includes(c.status));
  const trafficOn = clients.filter(c=>c.trafficActivationDate);
  const overdueC = clients.filter(c=>{ const s=getSLA(c.paymentDate,c.trafficActivationDate); return s&&s.status==="critical"; });
  const overdueT = tasks.filter(t=>t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date());
  const filtered = search ? clients.filter(c=>{
    if(c.archived) return false;
    const s = search.toLowerCase();
    // Search by client name/contact
    if((c.company||"").toLowerCase().includes(s)) return true;
    if((c.contact||"").toLowerCase().includes(s)) return true;
    if((c.service||"").toLowerCase().includes(s)) return true;
    // Search by assigned team member names
    const teamIds = [c.csId,c.trafficId,c.socialId,c.designerId,c.filmmakerId,c.commercialId].filter(Boolean);
    for(const tid of teamIds){
      const u = getUser(tid);
      if(u && u.name.toLowerCase().includes(s)) return true;
    }
    return false;
  }) : clients.filter(c=>!c.archived);

  const navItems = [
    {id:"dashboard",icon:LayoutDashboard,label:"Dashboard"},
    {id:"kanban",icon:Kanban,label:"Kanban"},
    {id:"clients",icon:Building2,label:"Clientes"},
    {id:"tasks",icon:ListTodo,label:"Tarefas"},
    {id:"gc",icon:Zap,label:"Grupos de Combate"},
    {id:"warday",icon:Target,label:"War Day / Vendas"},
    {id:"calendar",icon:CalendarDays,label:"Reuniões"},
    {id:"lince",icon:LineChart,label:"Lince"},
    {id:"reports",icon:BarChart3,label:"Relatórios"},
    {id:"team",icon:Users,label:"Equipe"},
    {id:"multiverso",icon:Target,label:"Multiverso"},
    ...((authUser?.role==="director"||authUser?.role==="admin")?[{id:"settings",icon:Settings,label:"Config"}]:[]),
  ];

  // ═══════════════════════════════════════════
  // PAGES
  // ═══════════════════════════════════════════

  const Dashboard = () => (
    <div style={{padding:20,maxWidth:1400,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h1 style={{fontSize:22,fontWeight:800,color:"#f1f5f9",margin:0}}>Dashboard</h1><p style={{color:"#64748b",fontSize:12,margin:"2px 0 0"}}>Visão geral • Google Calendar sincronizado</p></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {firebaseConnected?<Bg color="#22c55e" small><Wifi size={9}/> Firebase Live</Bg>:<Bg color="#f59e0b" small><WifiOff size={9}/> Offline</Bg>}
          <Btn icon={CheckCircle2} small variant="success" disabled>
            Google Calendar Conectado
          </Btn>
        </div>
      </div>

      {overdueC.length>0&&<div style={{background:"linear-gradient(135deg,#ef444420,#dc262620)",border:"1px solid #ef444440",borderRadius:12,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
        <AlertCircle size={18} color="#ef4444"/>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#fca5a5"}}>SLA em risco!</div><div style={{fontSize:11,color:"#fca5a5cc"}}>{overdueC.map(c=>c.company).join(", ")} — tráfego não ativado em 48h</div></div>
        <Btn variant="danger" small onClick={()=>setPage("kanban")}>Ver Kanban</Btn>
      </div>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10,marginBottom:20}}>
        <StatC label="Clientes Ativos" value={active.length} icon={Building2} color="#6366f1"/>
        <StatC label="Em Onboarding" value={onboarding.length} icon={UserPlus} color="#06b6d4"/>
        <StatC label="Aguardando Pgto" value={awaitPay.length} icon={DollarSign} color="#f59e0b"/>
        <StatC label="Tráfego Ativo" value={trafficOn.length} icon={Zap} color="#22c55e"/>
        <StatC label="SLA Risco" value={overdueC.length} icon={AlertCircle} color="#ef4444"/>
        <StatC label="Tarefas Atrasadas" value={overdueT.length} icon={Clock} color="#f97316"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:13,fontWeight:700,color:"#f1f5f9"}}>Clientes</h3>
            <Btn variant="ghost" small onClick={()=>setPage("clients")}>Ver todos</Btn>
          </div>
          {clients.slice(0,5).map(c=>{const col=KANBAN_COLUMNS.find(k=>k.id===c.status);const sla=getSLA(c.paymentDate,c.trafficActivationDate);return(
            <div key={c.id} onClick={()=>openClient(c.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #1e293b30",cursor:"pointer"}}>
              <Av i={(c.company||"??").slice(0,2).toUpperCase()} c={col?.color} s={32}/>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.company}</div><div style={{fontSize:10,color:"#64748b"}}>{c.service}</div></div>
              <Bg color={col?.color} small>{col?.icon}</Bg>
              <SLABg sla={sla}/>
            </div>
          );})}
        </div>

        {/* Google Calendar Events */}
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:13,fontWeight:700,color:"#f1f5f9",display:"flex",alignItems:"center",gap:6}}>
              <CalendarDays size={14} color="#6366f1"/> Google Calendar
              {calSynced&&<Bg color="#22c55e" small><Wifi size={10}/> Live</Bg>}
              {!calSynced&&googleAccessToken&&<Bg color="#f59e0b" small><Loader2 size={10}/> Sync...</Bg>}
              {!googleAccessToken&&<Bg color="#64748b" small>Offline</Bg>}
            </h3>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {calLastFetch&&<span style={{fontSize:9,color:"#475569"}}>Atualizado {new Date(calLastFetch).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>}
              {googleAccessToken&&<Btn variant="ghost" small onClick={()=>fetchGoogleCalendarEvents(googleAccessToken)} icon={RefreshCw}>Sync</Btn>}
            </div>
          </div>
          {false && (
            <div style={{textAlign:"center",padding:20}}>
              <CalendarDays size={32} color="#334155" style={{marginBottom:8}}/>
              <p style={{color:"#64748b",fontSize:12,margin:0}}>Clique em "Sincronizar Google Calendar" para conectar</p>
            </div>
          )}
          {false && <div style={{textAlign:"center",padding:20,color:"#64748b",fontSize:12}}><Loader2 size={20} style={{animation:"spin 1s linear infinite"}}/><br/>Buscando eventos...</div>}
          {calEvents.filter(ev => {
            const d = new Date(ev.start);
            const today = new Date();
            const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const weekEnd = new Date(dayStart.getTime() + 7*DAY);
            return d >= dayStart && d <= weekEnd;
          }).slice(0,8).map((ev,i)=>(
            <div key={ev.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #1e293b30"}}>
              <div style={{width:32,height:32,borderRadius:8,background:`${ev.color || "#6366f1"}20`,display:"flex",alignItems:"center",justifyContent:"center"}}><CalendarDays size={14} color={ev.color || "#6366f1"}/></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.summary}</div>
                <div style={{fontSize:10,color:"#64748b"}}>{new Date(ev.start).toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"2-digit"})} {new Date(ev.start).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} - {new Date(ev.end).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}{ev.location ? ` • ${ev.location}` : ""}</div>
              </div>
              <Bg color={ev.calendar==="agência"?"#f97316":"#22c55e"} small>{ev.calendar==="agência"?"Agência":"Pessoal"}</Bg>
              {ev.recurring&&<Bg color="#6366f1" small>Weekly</Bg>}
            </div>
          ))}
          {calSynced&&calEvents.length===0&&<p style={{color:"#64748b",fontSize:12}}>Nenhum evento nos próximos 7 dias</p>}
        </div>
      </div>

      {/* Urgent Tasks */}
      <div style={{marginTop:16,background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
        <h3 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:"#f1f5f9"}}>Tarefas Urgentes</h3>
        {tasks.filter(t=>t.priority==="urgent"&&t.status!=="done").slice(0,5).map(t=>{const cl=clients.find(c=>c.id===t.clientId);const u=getUser(t.assigneeId);return(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid #1e293b30"}}>
            <div style={{width:3,height:24,borderRadius:3,background:PRIORITIES[t.priority]?.color||"#64748b"}}/>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{t.title}</div><div style={{fontSize:10,color:"#64748b"}}>{cl?.company} • {u?.name}</div></div>
            <span style={{fontSize:10,color:new Date(t.dueDate)<new Date()?"#ef4444":"#64748b"}}>{fmt(t.dueDate)}</span>
          </div>
        );})}
      </div>
    </div>
  );

  const KanbanPage = () => {
    // Filter clients by collaborator
    const kanbanClients = kanbanFilter === "all" ? filtered : filtered.filter(c =>
      [c.csId, c.trafficId, c.socialId, c.designerId, c.filmmakerId, c.commercialId].includes(kanbanFilter)
    );
    // Split concluido into churn and project done
    const DISPLAY_COLUMNS = [...KANBAN_COLUMNS.filter(k=>k.id!=="concluido"),
      {id:"concluido_churn",label:"Churn ⚠️",icon:"⚠️",color:"#ef4444"},
      {id:"concluido_ok",label:"Projeto Concluído ✅",icon:"✅",color:"#22c55e"},
    ];
    const getDisplayStatus = (c) => {
      if (c.status === "concluido") return c.churning ? "concluido_churn" : "concluido_ok";
      return c.status;
    };
    return (
    <div style={{padding:"16px 0 16px 16px",height:"calc(100vh - 56px)",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingRight:16,gap:8}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:0}}>Kanban</h1>
        <div style={{display:"flex",gap:4,alignItems:"center",flex:1,justifyContent:"center",overflowX:"auto",paddingBottom:2}}>
          <button onClick={()=>setKanbanFilter("all")}
            style={{padding:"4px 10px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",border:kanbanFilter==="all"?"2px solid #6366f1":"2px solid transparent",background:kanbanFilter==="all"?"#6366f120":"#1e293b",color:kanbanFilter==="all"?"#6366f1":"#94a3b8",whiteSpace:"nowrap"}}>
            👥 Todos
          </button>
          {SEED_USERS.filter(u=>!u.pending).map(u=>{
            const isActive = kanbanFilter===u.id;
            const role = ROLES[u.role?.toUpperCase()];
            const clientCount = filtered.filter(c=>[c.csId,c.trafficId,c.socialId,c.designerId,c.filmmakerId,c.commercialId].includes(u.id)).length;
            return <button key={u.id} onClick={()=>setKanbanFilter(isActive?"all":u.id)} title={`${u.name} — ${role?.label||u.role} (${clientCount} clientes)`}
              style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:8,cursor:"pointer",border:isActive?`2px solid ${role?.color||"#6366f1"}`:"2px solid transparent",background:isActive?`${role?.color||"#6366f1"}20`:"#1e293b",transition:"all .2s",flexShrink:0}}>
              <Av i={u.avatar} c={isActive?role?.color:"#475569"} s={20}/>
              <span style={{fontSize:10,fontWeight:600,color:isActive?"#e2e8f0":"#64748b",whiteSpace:"nowrap"}}>{u.name.split(" ")[0]}</span>
              <span style={{fontSize:9,fontWeight:700,color:role?.color||"#64748b",background:`${role?.color||"#64748b"}20`,padding:"0 4px",borderRadius:6}}>{clientCount}</span>
            </button>;
          })}
        </div>
        <Btn onClick={()=>setShowNewClient(true)} icon={Plus} small>Novo Cliente</Btn>
      </div>
      <div ref={kanbanRef} style={{flex:1,display:"flex",gap:10,overflowX:"auto",overflowY:"hidden",paddingBottom:8,paddingRight:16}}>
        {DISPLAY_COLUMNS.map(col=>{
          const colId = col.id;
          const cc = colId === "concluido_churn" ? kanbanClients.filter(c=>c.status==="concluido"&&c.churning)
                   : colId === "concluido_ok" ? kanbanClients.filter(c=>c.status==="concluido"&&!c.churning)
                   : kanbanClients.filter(c=>c.status===colId);
          const colValue = cc.reduce((s,c)=>s+(Number(c.contractValue)||0),0);
          const dropTarget = colId.startsWith("concluido_") ? "concluido" : colId;
          return <div key={colId} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(draggedId){
            if(colId==="concluido_churn"){setClients(p=>p.map(c=>c.id!==draggedId?c:{...c,churning:true}));}
            moveClient(draggedId,dropTarget);setDraggedId(null);}}}
            style={{minWidth:270,width:270,background:"#0f172a",borderRadius:12,border:`1px solid ${colId==="concluido_churn"?"#ef444430":"#1e293b"}`,display:"flex",flexDirection:"column",flexShrink:0,maxHeight:"100%"}}>
            <div style={{padding:"10px 12px",borderBottom:"1px solid #1e293b"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:13}}>{col.icon}</span>
                <span style={{fontSize:11,fontWeight:700,color:"#e2e8f0",flex:1}}>{col.label}</span>
                <span style={{fontSize:10,fontWeight:700,color:col.color,background:`${col.color}20`,padding:"1px 7px",borderRadius:10}}>{cc.length}</span>
              </div>
              {colValue>0&&<div style={{fontSize:9,fontWeight:700,color:"#22c55e",marginTop:3}}>R${colValue.toLocaleString("pt-BR")}</div>}
              {col.responsibleLabel&&<div style={{fontSize:9,color:"#64748b",marginTop:3,display:"flex",alignItems:"center",gap:3}}>
                <Users size={8}/> {col.responsibleLabel}
              </div>}
              {col.slaHours&&<div style={{fontSize:9,color:"#f59e0b",marginTop:2,display:"flex",alignItems:"center",gap:3}}>
                <Clock size={8}/> SLA: {col.slaLabel}
              </div>}
              {col.slaNextDays&&<div style={{fontSize:9,color:"#3b82f6",marginTop:2,display:"flex",alignItems:"center",gap:3}}>
                <Clock size={8}/> Meta: {col.slaNextLabel}
              </div>}
              {col.dualApproval&&<div style={{fontSize:9,color:"#eab308",marginTop:2,display:"flex",alignItems:"center",gap:3}}>
                <AlertCircle size={8}/> Ambos devem concluir para avançar
              </div>}
            </div>
            <div style={{flex:1,overflowY:"auto",padding:6,display:"flex",flexDirection:"column",gap:6}}>
              {cc.map(c=>{const sla=getSLA(c.paymentDate,c.trafficActivationDate);return(
                <div key={c.id} draggable onDragStart={()=>setDraggedId(c.id)} onDragEnd={()=>setDraggedId(null)} onClick={()=>openClient(c.id)}
                  style={{background:"#020617",border:`1px solid ${draggedId===c.id?col.color:"#1e293b"}`,borderRadius:10,padding:10,cursor:"grab",opacity:draggedId===c.id?.5:1,position:"relative"}}>
                  {/* ═══ TIME BUBBLE + SLA RISK SIREN ═══ */}
                  {(()=>{
                    const trackCols = ["alinhamento_visual","setup_trafego","producao_andamento","buscando_aprovacao","aprovacao_concluida","onboarding_agendado","onboarding_concluido"];
                    if (!trackCols.includes(colId)) return null;
                    const changedAt = c.statusChangedAt || c.closedDate;
                    if (!changedAt) return null;
                    const hoursInCol = (Date.now() - new Date(changedAt).getTime()) / 3600000;
                    const daysInCol = hoursInCol / 24;
                    const timeLabel = daysInCol >= 1 ? `${Math.floor(daysInCol)}d ${Math.floor(hoursInCol%24)}h` : `${Math.floor(hoursInCol)}h`;
                    const isWarning = daysInCol >= 3 && daysInCol < 5;
                    const isCritical = daysInCol >= 5;
                    const bgColor = isCritical ? "#ef4444" : isWarning ? "#f59e0b" : "#334155";
                    const icon = isCritical ? "💣" : isWarning ? "🚨" : "⏱️";
                    return <>
                      <div style={{position:"absolute",top:-8,right:-4,display:"flex",alignItems:"center",gap:2,background:bgColor,padding:"2px 7px",borderRadius:10,fontSize:10,fontWeight:700,color:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,.4)",zIndex:2}}>
                        <span>{icon}</span> {timeLabel}
                      </div>
                      {isCritical&&<div style={{background:"linear-gradient(90deg,#ef4444,#dc2626)",borderRadius:6,padding:"4px 8px",marginBottom:6,display:"flex",alignItems:"center",gap:4,animation:"pulse 1.5s infinite"}}>
                        <span style={{fontSize:12}}>🚨</span>
                        <span style={{fontSize:9,fontWeight:800,color:"#fff",letterSpacing:".5px"}}>EM RISCO — {Math.floor(daysInCol)} DIAS PARADO</span>
                      </div>}
                    </>;
                  })()}
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9"}}>{c.company}</div>
                    <Bg color={PRIORITIES[c.priority]?.color||"#64748b"} small>{PRIORITIES[c.priority]?.label||""}</Bg>
                  </div>
                  <div style={{fontSize:10,color:"#94a3b8",marginBottom:6}}>{c.contact} • {c.service}</div>
                  {sla&&sla.status!=="done"&&<div style={{marginBottom:6}}><SLABg sla={sla}/>{sla.pct!==undefined&&<div style={{marginTop:3}}><PB v={sla.pct} m={100} c={sla.color} h={3}/></div>}</div>}
                  {/* ═══ DRIVE LINKS — 3 categorias no card ═══ */}
                  {(colId==="producao_andamento"||colId==="buscando_aprovacao"||colId==="aprovacao_concluida") && (
                    <div style={{marginBottom:6,background:"#1e293b",borderRadius:8,padding:6}} onClick={e=>e.stopPropagation()}>
                      <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",marginBottom:4,display:"flex",alignItems:"center",gap:3}}>
                        <ExternalLink size={9}/> Drive do Projeto
                      </div>
                      {[
                        {key:"driveBrutos",label:"Brutos",color:"#f59e0b",icon:"📂"},
                        {key:"driveAprovacao",label:"Em Aprovação",color:"#8b5cf6",icon:"📋"},
                        {key:"driveAprovados",label:"Aprovados → Tráfego",color:"#22c55e",icon:"✅"},
                      ].map(d=>(
                        <div key={d.key} style={{display:"flex",alignItems:"center",gap:3,marginBottom:2}}>
                          <span style={{fontSize:8}}>{d.icon}</span>
                          {c[d.key] ? (
                            <a href={c[d.key]} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:9,color:d.color,fontWeight:600,textDecoration:"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.label} ↗</a>
                          ) : (
                            <input type="text" placeholder={`${d.label}...`} onFocus={e=>e.stopPropagation()}
                              onChange={e=>{const v=e.target.value;setClients(p=>p.map(x=>x.id!==c.id?x:{...x,[d.key]:v}));}}
                              style={{flex:1,background:"#020617",border:"1px solid #33415540",borderRadius:4,padding:"2px 4px",color:"#e2e8f0",fontSize:8,outline:"none",fontFamily:"inherit",minWidth:0}}/>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* DUAL APPROVAL STATUS for Aprovação Concluída */}
                  {col.dualApproval&&<div style={{marginBottom:6,background:"#1e293b",borderRadius:8,padding:6}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",marginBottom:4}}>Checklist p/ Concluir:</div>
                    <div onClick={e=>{e.stopPropagation();setClients(p=>p.map(x=>x.id!==c.id?x:{...x,trafficDone:!x.trafficDone}));}} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",marginBottom:2}}>
                      {c.trafficDone?<CheckCircle2 size={12} color="#22c55e"/>:<Circle size={12} color="#475569"/>}
                      <span style={{fontSize:10,color:c.trafficDone?"#22c55e":"#94a3b8"}}>Tráfego: Campanhas subidas</span>
                    </div>
                    <div onClick={e=>{e.stopPropagation();setClients(p=>p.map(x=>x.id!==c.id?x:{...x,socialDone:!x.socialDone}));}} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
                      {c.socialDone?<CheckCircle2 size={12} color="#22c55e"/>:<Circle size={12} color="#475569"/>}
                      <span style={{fontSize:10,color:c.socialDone?"#22c55e":"#94a3b8"}}>Social: Postagens agendadas</span>
                    </div>
                  </div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:2}}>
                      {getUser(c.csId)&&<Av i={getUser(c.csId).avatar} c={ROLES.CS.color} s={20}/>}
                      {getUser(c.trafficId)&&<Av i={getUser(c.trafficId).avatar} c={ROLES.TRAFFIC.color} s={20}/>}
                      {getUser(c.socialId)&&<Av i={getUser(c.socialId).avatar} c={ROLES.SOCIAL.color} s={20}/>}
                      {getUser(c.designerId)&&<Av i={getUser(c.designerId).avatar} c={ROLES.DESIGNER?.color||"#8b5cf6"} s={20}/>}
                      <button onClick={e=>{e.stopPropagation();openEditTeam(c.id);setSelectedClient(c.id);}} style={{width:20,height:20,borderRadius:"50%",background:"#1e293b",border:"1px solid #334155",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#64748b",flexShrink:0}}><Edit3 size={9}/></button>
                      {c.status!=="concluido"&&<button onClick={e=>{e.stopPropagation();if(confirm(`Mover "${c.company}" para Concluído?`)){moveClient(c.id,"concluido");}}} style={{width:20,height:20,borderRadius:"50%",background:"#05966920",border:"1px solid #05966940",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#059669",flexShrink:0}} title="Concluir projeto"><CheckCircle2 size={9}/></button>}
                    </div>
                    <span style={{fontSize:10,color:"#64748b"}}>R${c.contractValue?.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              );})}
              {cc.length===0&&<div style={{padding:16,textAlign:"center",color:"#334155",fontSize:11}}>Vazio</div>}
            </div>
          </div>;
        })}
      </div>
    </div>
  );};

  const ClientsPage = () => (
    <div style={{padding:20,maxWidth:1400,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:0}}>Clientes ({filtered.length})</h1>
        <Btn onClick={()=>setShowNewClient(true)} icon={Plus} small>Novo</Btn>
      </div>
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{borderBottom:"1px solid #1e293b"}}>
              {["Empresa","Contato","Serviço","Valor","Status","CS","SLA","Prio"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:"#64748b",fontWeight:600,fontSize:10,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map(c=>{if(!c||!c.company)return null;const col=KANBAN_COLUMNS.find(k=>k.id===c.status);const sla=getSLA(c.paymentDate,c.trafficActivationDate);const cs=getUser(c.csId);return(
                <tr key={c.id} onClick={()=>openClient(c.id)} style={{borderBottom:"1px solid #1e293b30",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#1e293b30"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"8px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av i={(c.company||"??").slice(0,2).toUpperCase()} c={col?.color||"#64748b"} s={28}/><span style={{fontWeight:600,color:"#f1f5f9"}}>{c.company}</span></div></td>
                  <td style={{padding:"8px 12px",color:"#94a3b8"}}>{c.contact||""}</td>
                  <td style={{padding:"8px 12px",color:"#94a3b8"}}>{c.service||""}</td>
                  <td style={{padding:"8px 12px",color:"#e2e8f0",fontWeight:600}}>R${(Number(c.contractValue)||0).toLocaleString("pt-BR")}</td>
                  <td style={{padding:"8px 12px"}}><Bg color={col?.color||"#64748b"} small>{col?.icon||""} {col?.label||c.status}</Bg></td>
                  <td style={{padding:"8px 12px"}}>{cs&&<Av i={cs.avatar} c={ROLES?.CS?.color||"#06b6d4"} s={22}/>}</td>
                  <td style={{padding:"8px 12px"}}>{sla&&<SLABg sla={sla}/>}</td>
                  <td style={{padding:"8px 12px"}}><Bg color={PRIORITIES[c.priority]?.color||"#64748b"} small>{PRIORITIES[c.priority]?.label||""}</Bg></td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ClientDetail = () => {
    if(!client) return null;
    const col=KANBAN_COLUMNS.find(k=>k.id===client.status);
    const sla=getSLA(client.paymentDate,client.trafficActivationDate);
    const cTasks=tasks.filter(t=>t.clientId===client.id);
    const pr=(list)=>list.filter(i=>i.done).length;

    const tabs=[{id:"overview",label:"Geral",icon:Eye},{id:"onboarding",label:"Onboarding",icon:ClipboardList},{id:"traffic",label:"Tráfego",icon:Zap},{id:"creation",label:"Criação",icon:Palette},{id:"meetings",label:"Reuniões",icon:CalendarDays},{id:"timeline",label:"Timeline",icon:Activity}];

    return <div style={{padding:20,maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12}}>
        <button onClick={()=>{setPage("clients");setSelectedClient(null);}} style={{background:"#1e293b",border:"none",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#94a3b8"}}><ChevronLeft size={16}/></button>
        <span style={{color:"#64748b",fontSize:12}}>Clientes / </span><span style={{color:"#e2e8f0",fontSize:12,fontWeight:600}}>{client.company}</span>
      </div>

      {/* Header */}
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:14,padding:20,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <Av i={client.company.slice(0,2).toUpperCase()} c={col?.color} s={48}/>
            <div>
              <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#f1f5f9"}}>{client.company}</h2>
              <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                <Bg color={col?.color}>{col?.icon} {col?.label}</Bg>
                <Bg color={PRIORITIES[client.priority]?.color||"#64748b"}><Flag size={9}/> {PRIORITIES[client.priority]?.label||""}</Bg>
                <SLABg sla={sla}/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <Btn onClick={()=>{setNM({...nM,clientId:client.id,title:`Reunião × ${client.company}`});setShowNewMeeting(true);}} icon={CalendarDays} small variant="secondary">Agendar no Google Cal</Btn>
            {client.status!=="concluido"&&<Btn onClick={()=>{if(confirm(`Mover "${client.company}" para Concluído?`)){moveClient(client.id,"concluido");}}} icon={CheckCircle2} small variant="success">Concluir</Btn>}
            <Btn onClick={()=>{if(confirm(`Arquivar "${client.company}"? Você pode reativar depois em Config.`)){setClients(p=>p.map(c=>c.id!==client.id?c:{...c,archived:true,status:"concluido",timeline:[...c.timeline,{date:new Date().toISOString(),event:"Cliente arquivado",user:authUser?.name||"Thomas"}]}));setPage("kanban");showToast(`📦 ${client.company} arquivado`);}}} icon={Download} small variant="secondary">Arquivar</Btn>
            <select value={client.status} onChange={e=>moveClient(client.id,e.target.value)} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"5px 8px",color:"#e2e8f0",fontSize:11,fontFamily:"inherit"}}>
              {KANBAN_COLUMNS.map(k=><option key={k.id} value={k.id}>{k.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginTop:16,paddingTop:16,borderTop:"1px solid #1e293b"}}>
          <div><span style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Contato</span><div style={{fontSize:12,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{client.contact}</div></div>
          <div><span style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Email</span><div style={{fontSize:12,color:"#e2e8f0",marginTop:2}}>{client.email}</div></div>
          <div><span style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Serviço</span><div style={{fontSize:12,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{client.service}</div></div>
          <div><span style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Valor</span><div style={{fontSize:12,color:"#22c55e",fontWeight:700,marginTop:2}}>R$ {client.contractValue?.toLocaleString("pt-BR")}</div></div>
          <div><span style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Fechamento</span><div style={{fontSize:12,color:"#e2e8f0",marginTop:2}}>{fmt(client.closedDate)}</div></div>
          <div><span style={{fontSize:10,color:"#64748b",textTransform:"uppercase"}}>Telefone</span><div style={{fontSize:12,color:"#e2e8f0",marginTop:2}}>{client.phone}</div></div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:12,paddingTop:12,borderTop:"1px solid #1e293b",flexWrap:"wrap"}}>
          {[{u:getUser(client.csId),r:"CS"},{u:getUser(client.trafficId),r:"Tráfego"},{u:getUser(client.socialId),r:"Social"},{u:getUser(client.designerId),r:"Design"},{u:getUser(client.filmmakerId),r:"Vídeo"},{u:getUser(client.commercialId),r:"SDR"}].map(({u,r})=>u&&<div key={r+u.id} style={{display:"flex",alignItems:"center",gap:4,background:"#020617",padding:"3px 8px 3px 3px",borderRadius:16}}><Av i={u.avatar} c={ROLES[u.role.toUpperCase()]?.color||"#64748b"} s={18}/><span style={{fontSize:10,color:"#94a3b8"}}>{r}: <strong style={{color:"#e2e8f0"}}>{u.name.split(" ")[0]}</strong></span></div>)}
          <button onClick={()=>openEditTeam(client.id)} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:16,padding:"3px 10px",fontSize:10,color:"#94a3b8",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><Edit3 size={10}/> Editar</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:3,marginBottom:16,overflowX:"auto"}}>
        {tabs.map(t=><Tab key={t.id} active={clientTab===t.id} onClick={()=>setClientTab(t.id)}><t.icon size={12} style={{marginRight:3,verticalAlign:"-2px"}}/>{t.label}</Tab>)}
      </div>

      {/* Overview */}
      {clientTab==="overview"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{t:"CS",p:pr(client.csChecklist),m:client.csChecklist.length,c:ROLES.CS.color},{t:"Onboarding",p:pr(client.onboardingChecklist),m:client.onboardingChecklist.length,c:"#8b5cf6"},{t:"Tráfego",p:pr(client.trafficChecklist),m:client.trafficChecklist.length,c:ROLES.TRAFFIC.color},{t:"Criação",p:pr(client.creationChecklist),m:client.creationChecklist.length,c:ROLES.DESIGNER.color}].map(x=>
          <div key={x.t} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{x.t}</span><span style={{fontSize:11,fontWeight:700,color:x.c}}>{x.p}/{x.m}</span></div>
            <PB v={x.p} m={x.m} c={x.c}/>
          </div>
        )}
        {sla&&<div style={{gridColumn:"1/-1",background:`${sla.color}08`,border:`1px solid ${sla.color}30`,borderRadius:12,padding:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Timer size={18} color={sla.color}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>SLA Tráfego — 48h</div><div style={{fontSize:11,color:"#94a3b8"}}>Pgto: {fmtTime(client.paymentDate)} • Ativação: {client.trafficActivationDate?fmtTime(client.trafficActivationDate):"Pendente"}</div></div><SLABg sla={sla}/></div>
          {sla.pct!==undefined&&<div style={{marginTop:8}}><PB v={sla.pct} m={100} c={sla.color} h={6}/></div>}
        </div>}
        <div style={{gridColumn:"1/-1",background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Tarefas ({cTasks.length})</h4>
          {cTasks.map(t=>{const u=getUser(t.assigneeId);return <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #1e293b30"}}>
            <button onClick={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,status:x.status==="done"?"pending":"done"}:x))} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>{t.status==="done"?<CheckCircle2 size={16} color="#22c55e"/>:<Circle size={16} color="#475569"/>}</button>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:t.status==="done"?"#64748b":"#e2e8f0",textDecoration:t.status==="done"?"line-through":"none"}}>{t.title}</div></div>
            {u&&<Av i={u.avatar} c={ROLES[u.role.toUpperCase()]?.color} s={20}/>}
            <Bg color={PRIORITIES[t.priority]?.color||"#64748b"} small>{PRIORITIES[t.priority]?.label||""}</Bg>
          </div>;})}
        </div>
      </div>}

      {/* Onboarding */}
      {clientTab==="onboarding"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>CS / Entrada</h4>
          <PB v={pr(client.csChecklist)} m={client.csChecklist.length} c={ROLES.CS.color}/>
          <div style={{marginTop:8}}>{client.csChecklist.map(i=><CkItem key={i.id} item={i} onToggle={()=>toggleCk(client.id,"csChecklist",i.id)}/>)}</div>
        </div>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Onboarding</h4>
          <PB v={pr(client.onboardingChecklist)} m={client.onboardingChecklist.length} c="#8b5cf6"/>
          <div style={{marginTop:8}}>{client.onboardingChecklist.map(i=><CkItem key={i.id} item={i} onToggle={()=>toggleCk(client.id,"onboardingChecklist",i.id)}/>)}</div>
        </div>
      </div>}

      {/* Traffic */}
      {clientTab==="traffic"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Checklist Tráfego</h4>
          <PB v={pr(client.trafficChecklist)} m={client.trafficChecklist.length} c="#f59e0b"/>
          <div style={{marginTop:8}}>{client.trafficChecklist.map(i=><CkItem key={i.id} item={i} onToggle={()=>toggleCk(client.id,"trafficChecklist",i.id)}/>)}</div>
        </div>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>SLA 48h</h4>
          {sla?<div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><Timer size={22} color={sla.color}/><span style={{fontSize:18,fontWeight:800,color:sla.color}}>{sla.label}</span></div>{sla.pct!==undefined&&<PB v={sla.pct} m={100} c={sla.color} h={7}/>}<div style={{marginTop:10,fontSize:11,color:"#64748b"}}><div>Pagamento: {fmtTime(client.paymentDate)}</div>{client.trafficActivationDate&&<div>Ativação: {fmtTime(client.trafficActivationDate)}</div>}</div></div>:<p style={{color:"#64748b",fontSize:12}}>Pagamento não confirmado</p>}
        </div>
        {client.reports.length>0&&<div style={{gridColumn:"1/-1",background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Relatórios</h4>
          <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{borderBottom:"1px solid #1e293b"}}>{["Data","Invest","Leads","CPL","CTR","CPC","Conv","Vendas","ROAS"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left",color:"#64748b",fontWeight:600,fontSize:9,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
            <tbody>{client.reports.map(r=><tr key={r.id} style={{borderBottom:"1px solid #1e293b30"}}><td style={{padding:"6px 8px",color:"#e2e8f0"}}>{fmt(r.date)}</td><td style={{padding:"6px 8px",color:"#e2e8f0"}}>R${r.investment}</td><td style={{padding:"6px 8px",color:"#22c55e",fontWeight:700}}>{r.leads}</td><td style={{padding:"6px 8px",color:"#e2e8f0"}}>R${r.cpl?.toFixed(2)}</td><td style={{padding:"6px 8px",color:"#e2e8f0"}}>{r.ctr}%</td><td style={{padding:"6px 8px",color:"#e2e8f0"}}>R${r.cpc?.toFixed(2)}</td><td style={{padding:"6px 8px",color:"#e2e8f0"}}>{r.conversations}</td><td style={{padding:"6px 8px",color:"#22c55e",fontWeight:700}}>{r.sales}</td><td style={{padding:"6px 8px",color:r.roas>=3?"#22c55e":"#f59e0b",fontWeight:700}}>{r.roas}x</td></tr>)}</tbody>
          </table></div>
        </div>}
      </div>}

      {/* Creation */}
      {clientTab==="creation"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {/* DRIVE LINKS — 3 categorias */}
        <div style={{gridColumn:"1/-1",background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}>
            <ExternalLink size={14} color="#3b82f6"/> Links do Google Drive
          </h4>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {/* Brutos */}
            <div style={{background:"#020617",border:"1px solid #f59e0b30",borderRadius:10,padding:10}}>
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#f59e0b"}}/>
                <span style={{fontSize:11,fontWeight:700,color:"#f59e0b"}}>Arquivos Brutos</span>
              </div>
              <div style={{fontSize:9,color:"#64748b",marginBottom:6}}>Para o time de criação editar</div>
              <input type="text" value={client.driveBrutos||""} onChange={e=>setClients(p=>p.map(x=>x.id!==client.id?x:{...x,driveBrutos:e.target.value}))}
                placeholder="Cole o link do Drive..." style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"6px 8px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              {client.driveBrutos&&<a href={client.driveBrutos} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,marginTop:6,padding:"5px 8px",background:"#f59e0b15",border:"1px solid #f59e0b30",borderRadius:6,color:"#f59e0b",fontSize:10,fontWeight:600,textDecoration:"none"}}><ExternalLink size={10}/> Abrir pasta brutos</a>}
            </div>
            {/* Em aprovação */}
            <div style={{background:"#020617",border:"1px solid #8b5cf630",borderRadius:10,padding:10}}>
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#8b5cf6"}}/>
                <span style={{fontSize:11,fontWeight:700,color:"#8b5cf6"}}>Editados em Aprovação</span>
              </div>
              <div style={{fontSize:9,color:"#64748b",marginBottom:6}}>Aguardando aprovação do cliente</div>
              <input type="text" value={client.driveAprovacao||""} onChange={e=>setClients(p=>p.map(x=>x.id!==client.id?x:{...x,driveAprovacao:e.target.value}))}
                placeholder="Cole o link do Drive..." style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"6px 8px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              {client.driveAprovacao&&<a href={client.driveAprovacao} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,marginTop:6,padding:"5px 8px",background:"#8b5cf615",border:"1px solid #8b5cf630",borderRadius:6,color:"#8b5cf6",fontSize:10,fontWeight:600,textDecoration:"none"}}><ExternalLink size={10}/> Abrir pasta aprovação</a>}
            </div>
            {/* Aprovados */}
            <div style={{background:"#020617",border:"1px solid #22c55e30",borderRadius:10,padding:10}}>
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e"}}/>
                <span style={{fontSize:11,fontWeight:700,color:"#22c55e"}}>Aprovados p/ Tráfego</span>
              </div>
              <div style={{fontSize:9,color:"#64748b",marginBottom:6}}>Gestor de tráfego baixar e subir</div>
              <input type="text" value={client.driveAprovados||""} onChange={e=>setClients(p=>p.map(x=>x.id!==client.id?x:{...x,driveAprovados:e.target.value}))}
                placeholder="Cole o link do Drive..." style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"6px 8px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              {client.driveAprovados&&<a href={client.driveAprovados} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:4,marginTop:6,padding:"5px 8px",background:"#22c55e15",border:"1px solid #22c55e30",borderRadius:6,color:"#22c55e",fontSize:10,fontWeight:600,textDecoration:"none"}}><Download size={10}/> Abrir — baixar para campanhas</a>}
            </div>
          </div>
        </div>

        <div style={{background:"#0f172a",border:"1px solid #ec489930",borderRadius:12,padding:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h4 style={{margin:0,fontSize:13,fontWeight:700,color:"#ec4899",display:"flex",alignItems:"center",gap:6}}>
              <Image size={14}/> Briefing Social Media
            </h4>
            {client.socialBriefing&&<span style={{fontSize:10,fontWeight:700,color:pr(client.socialBriefing)===client.socialBriefing.length?"#22c55e":"#f59e0b"}}>
              {pr(client.socialBriefing||[])}/{(client.socialBriefing||[]).length}
            </span>}
          </div>
          {client.socialBriefing&&<>
            <PB v={pr(client.socialBriefing)} m={client.socialBriefing.length} c="#ec4899"/>
            <div style={{marginTop:8}}>{client.socialBriefing.map(i=><CkItem key={i.id} item={i} onToggle={()=>toggleCk(client.id,"socialBriefing",i.id)}/>)}</div>
          </>}
          {!client.socialBriefing&&<div style={{fontSize:11,color:"#64748b",padding:8}}>Briefing não disponível — resete os dados para ativar</div>}
          {/* Campos extras do briefing */}
          <div style={{marginTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <label style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600}}>Tom de voz</label>
              <input type="text" value={client.tomDeVoz||""} onChange={e=>setClients(p=>p.map(x=>x.id!==client.id?x:{...x,tomDeVoz:e.target.value}))}
                placeholder="Ex: Profissional, descontraído, técnico..." style={{width:"100%",background:"#020617",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:3}}/>
            </div>
            <div>
              <label style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600}}>Público-alvo</label>
              <input type="text" value={client.publicoAlvo||""} onChange={e=>setClients(p=>p.map(x=>x.id!==client.id?x:{...x,publicoAlvo:e.target.value}))}
                placeholder="Ex: Mulheres 25-45 classe B..." style={{width:"100%",background:"#020617",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:3}}/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600}}>Referências de conteúdo (perfis/links)</label>
              <input type="text" value={client.referencias||""} onChange={e=>setClients(p=>p.map(x=>x.id!==client.id?x:{...x,referencias:e.target.value}))}
                placeholder="@perfil1, @perfil2, link..." style={{width:"100%",background:"#020617",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:3}}/>
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600}}>Observações do briefing</label>
              <textarea value={client.briefingNotes||""} onChange={e=>setClients(p=>p.map(x=>x.id!==client.id?x:{...x,briefingNotes:e.target.value}))}
                placeholder="Informações importantes para a social media..." style={{width:"100%",background:"#020617",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:3,minHeight:50,resize:"vertical"}}/>
            </div>
          </div>
        </div>

        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Checklist Criação</h4>
          <PB v={pr(client.creationChecklist)} m={client.creationChecklist.length} c="#8b5cf6"/>
          <div style={{marginTop:8}}>{client.creationChecklist.map(i=><CkItem key={i.id} item={i} onToggle={()=>toggleCk(client.id,"creationChecklist",i.id)}/>)}</div>
        </div>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
          <h4 style={{margin:"0 0 8px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Setores de Criação</h4>
          {[{ic:<Image size={15} color="#ec4899"/>,t:"Social Media",d:"Feed, calendário, pautas",p:getUser(client.socialId)},{ic:<PenTool size={15} color="#8b5cf6"/>,t:"Design",d:"Peças feed, anúncios, loja",p:getUser(client.designerId)},{ic:<Film size={15} color="#ef4444"/>,t:"Filmmaker",d:"Vídeos, roteiros",p:getUser(client.filmmakerId)}].map(a=>
            <div key={a.t} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #1e293b30"}}>
              <div style={{width:32,height:32,borderRadius:8,background:"#1e293b",display:"flex",alignItems:"center",justifyContent:"center"}}>{a.ic}</div>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{a.t}</div><div style={{fontSize:10,color:"#64748b"}}>{a.d}</div></div>
              {a.p&&<Av i={a.p.avatar} c={ROLES[a.p.role.toUpperCase()]?.color} s={22}/>}
            </div>
          )}
        </div>
      </div>}

      {/* Meetings */}
      {clientTab==="meetings"&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h4 style={{margin:0,fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Reuniões</h4>
          <Btn onClick={()=>{setNM({...nM,clientId:client.id,title:`Reunião × ${client.company}`});setShowNewMeeting(true);}} icon={Plus} small>Agendar no Google Calendar</Btn>
        </div>
        {(!client.meetings||client.meetings.length===0)&&<div style={{textAlign:"center",padding:20}}><CalendarDays size={28} color="#334155" style={{marginBottom:6}}/><p style={{color:"#64748b",fontSize:12}}>Nenhuma reunião. Clique em "Agendar" para criar direto no Google Calendar.</p></div>}
        {client.meetings?.map(m=><div key={m.id} style={{border:"1px solid #1e293b",borderRadius:10,padding:12,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><CalendarDays size={14} color="#6366f1"/><span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{m.title || `Reunião ${fmt(m.date)}`}</span></div>
            <div style={{display:"flex",gap:4}}>{m.gcalSynced&&<Bg color="#22c55e" small><Wifi size={9}/> GCal</Bg>}<Bg color={m.status==="done"?"#22c55e":"#6366f1"} small>{m.status==="done"?"Realizada":"Agendada"}</Bg></div>
          </div>
          <div style={{fontSize:11,color:"#64748b"}}>{fmtTime(m.date)} às {m.time}</div>
          {m.notes&&<div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{m.notes}</div>}
        </div>)}
      </div>}

      {/* Timeline */}
      {clientTab==="timeline"&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
        <h4 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Timeline</h4>
        <div style={{position:"relative",paddingLeft:22}}>
          <div style={{position:"absolute",left:6,top:4,bottom:4,width:2,background:"#1e293b"}}/>
          {[...client.timeline].reverse().map((ev,i)=><div key={i} style={{position:"relative",paddingBottom:16,paddingLeft:14}}>
            <div style={{position:"absolute",left:-18,top:3,width:10,height:10,borderRadius:"50%",background:i===0?"#6366f1":"#1e293b",border:"2px solid #0f172a"}}/>
            <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{ev.event}</div>
            <div style={{fontSize:10,color:"#64748b",marginTop:1}}>{fmtTime(ev.date)} • {ev.user}</div>
          </div>)}
        </div>
      </div>}
    </div>;
  };

  const [taskView, setTaskView] = useState("list"); // list | weekly

  const TasksPage = () => {
    const sectors=["all","cs","traffic","social","designer","filmmaker","store_creator"];
    const sLabels={all:"Todos",cs:"CS",traffic:"Tráfego",social:"Social",designer:"Design",filmmaker:"Vídeo",store_creator:"Sites/Lojas"};
    const f=taskFilter==="all"?tasks:tasks.filter(t=>t.sector===taskFilter);

    // Weekly grouping
    const getWeekKey = (dateStr) => {
      if(!dateStr) return "sem_data";
      const d = new Date(dateStr);
      const start = new Date(d); start.setDate(start.getDate() - start.getDay());
      return start.toISOString().split("T")[0];
    };
    const getWeekLabel = (key) => {
      if(key==="sem_data") return "Sem data";
      const start = new Date(key+"T12:00:00");
      const end = new Date(start); end.setDate(end.getDate()+6);
      const fmt2 = d => d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
      const now = new Date();
      const thisWeekStart = new Date(now); thisWeekStart.setDate(thisWeekStart.getDate()-thisWeekStart.getDay());
      if(start.toDateString()===thisWeekStart.toDateString()) return `Esta Semana (${fmt2(start)} — ${fmt2(end)})`;
      return `${fmt2(start)} — ${fmt2(end)}`;
    };
    const weeks = {};
    f.forEach(t => { const wk = getWeekKey(t.dueDate); if(!weeks[wk]) weeks[wk]=[]; weeks[wk].push(t); });
    const sortedWeeks = Object.keys(weeks).sort((a,b) => a==="sem_data"?1:b==="sem_data"?-1:a.localeCompare(b));

    const TASK_STATUSES = [
      {id:"pending",label:"A Criar",icon:"📝",color:"#64748b"},
      {id:"in_progress",label:"Criando",icon:"🎨",color:"#6366f1"},
      {id:"review",label:"Em Aprovação",icon:"👀",color:"#f59e0b"},
      {id:"approved",label:"Aprovado",icon:"✅",color:"#22c55e"},
      {id:"done",label:"Entregue/Postado",icon:"🚀",color:"#14b8a6"},
    ];

    return <div style={{padding:20,maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:0}}>Tarefas</h1>
        <div style={{display:"flex",gap:6}}>
          <div style={{display:"flex",background:"#1e293b",borderRadius:8,overflow:"hidden",border:"1px solid #334155"}}>
            <button onClick={()=>setTaskView("list")} style={{padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer",border:"none",background:taskView==="list"?"#6366f1":"transparent",color:taskView==="list"?"#fff":"#94a3b8"}}>Lista</button>
            <button onClick={()=>setTaskView("weekly")} style={{padding:"5px 10px",fontSize:10,fontWeight:700,cursor:"pointer",border:"none",background:taskView==="weekly"?"#6366f1":"transparent",color:taskView==="weekly"?"#fff":"#94a3b8"}}>Semanal</button>
          </div>
          <Btn onClick={()=>setShowNewTask(true)} icon={Plus} small>Nova</Btn>
        </div>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:12}}>{sectors.map(s=><Tab key={s} active={taskFilter===s} onClick={()=>setTaskFilter(s)}>{sLabels[s]}</Tab>)}</div>

      {/* ═══ WEEKLY CARD VIEW ═══ */}
      {taskView==="weekly"&&<div style={{display:"flex",flexDirection:"column",gap:16}}>
        {sortedWeeks.map(wk => {
          const weekTasks = weeks[wk];
          const byStatus = {};
          TASK_STATUSES.forEach(s=>{byStatus[s.id]=weekTasks.filter(t=>t.status===s.id);});
          return <div key={wk} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"10px 14px",borderBottom:"1px solid #1e293b",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0f172a"}}>
              <div style={{fontSize:13,fontWeight:800,color:"#e2e8f0"}}>📅 {getWeekLabel(wk)}</div>
              <span style={{fontSize:10,color:"#64748b"}}>{weekTasks.length} demandas</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:`repeat(${TASK_STATUSES.length},1fr)`,gap:0}}>
              {TASK_STATUSES.map(st => {
                const stTasks = byStatus[st.id]||[];
                return <div key={st.id} style={{borderRight:"1px solid #1e293b20",padding:8,minHeight:100}}>
                  <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8,paddingBottom:6,borderBottom:`2px solid ${st.color}`}}>
                    <span style={{fontSize:11}}>{st.icon}</span>
                    <span style={{fontSize:10,fontWeight:700,color:st.color}}>{st.label}</span>
                    <span style={{fontSize:9,color:"#475569",marginLeft:"auto"}}>{stTasks.length}</span>
                  </div>
                  {stTasks.map(t => {
                    const cl = clients.find(c=>c.id===t.clientId);
                    const u = getUser(t.assigneeId);
                    const req = getUser(t.requestedBy);
                    const createdAgo = t.createdAt ? Math.floor((Date.now()-new Date(t.createdAt).getTime())/86400000) : null;
                    return <div key={t.id} onClick={()=>setExpandedTask(expandedTask===t.id?null:t.id)}
                      style={{background:"#020617",border:`1px solid ${expandedTask===t.id?st.color+"60":"#1e293b"}`,borderRadius:8,padding:8,marginBottom:6,cursor:"pointer",transition:"border-color .2s"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{t.title}</div>
                      <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>{cl?.company||""}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style={{display:"flex",gap:3,alignItems:"center"}}>
                          {u&&<Av i={u.avatar} c={ROLES[u.role?.toUpperCase()]?.color||"#64748b"} s={16}/>}
                          <span style={{fontSize:8,color:"#64748b"}}>{u?.name?.split(" ")[0]||""}</span>
                        </div>
                        {createdAgo!==null&&<span style={{fontSize:8,padding:"1px 4px",borderRadius:4,background:createdAgo>=5?"#ef444420":createdAgo>=3?"#f59e0b20":"#1e293b",color:createdAgo>=5?"#ef4444":createdAgo>=3?"#f59e0b":"#64748b",fontWeight:600}}>{createdAgo}d</span>}
                      </div>
                      {/* Expanded inline */}
                      {expandedTask===t.id&&<div style={{marginTop:6,paddingTop:6,borderTop:"1px solid #1e293b"}} onClick={e=>e.stopPropagation()}>
                        {req&&<div style={{fontSize:8,color:"#94a3b8",marginBottom:4}}>Solicitado por: <strong>{req.name}</strong></div>}
                        {t.description&&<div style={{fontSize:9,color:"#94a3b8",background:"#1e293b",borderRadius:4,padding:4,marginBottom:4,lineHeight:1.4}}>{t.description}</div>}
                        {t.dueDate&&<div style={{fontSize:8,color:"#64748b"}}>Prazo: {new Date(t.dueDate).toLocaleDateString("pt-BR")}</div>}
                        <div style={{display:"flex",gap:3,marginTop:4,flexWrap:"wrap"}}>
                          {TASK_STATUSES.filter(s2=>s2.id!==t.status).map(s2=>
                            <button key={s2.id} onClick={()=>setTasks(p=>p.map(x=>x.id!==t.id?x:{...x,status:s2.id}))}
                              style={{background:`${s2.color}15`,border:`1px solid ${s2.color}40`,borderRadius:4,padding:"2px 6px",fontSize:8,fontWeight:700,color:s2.color,cursor:"pointer"}}>{s2.icon} {s2.label}</button>
                          )}
                        </div>
                      </div>}
                    </div>;
                  })}
                  {stTasks.length===0&&<div style={{textAlign:"center",padding:12,color:"#334155",fontSize:9}}>—</div>}
                </div>;
              })}
            </div>
          </div>;
        })}
        {sortedWeeks.length===0&&<div style={{textAlign:"center",padding:40,color:"#475569"}}><div style={{fontSize:14}}>Nenhuma tarefa encontrada</div></div>}
      </div>}

      {/* ═══ LIST VIEW ═══ */}
      {taskView==="list"&&<div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12}}>
        {f.map(t=>{const cl=clients.find(c=>c.id===t.clientId);const u=getUser(t.assigneeId);const requester=getUser(t.requestedBy)||null;const ov=t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date();
          const isExpanded = expandedTask === t.id;
          const createdAgo = t.createdAt ? Math.floor((Date.now()-new Date(t.createdAt).getTime())/86400000) : null;
          return(
          <div key={t.id} style={{borderBottom:"1px solid #1e293b30"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer"}} onClick={()=>setExpandedTask(isExpanded?null:t.id)}>
              <button onClick={e=>{e.stopPropagation();const order=["pending","in_progress","review","approved","done"];const idx=order.indexOf(t.status||"pending");setTasks(p=>p.map(x=>x.id===t.id?{...x,status:order[(idx+1)%order.length]}:x));}} style={{background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>{t.status==="done"?<CheckCircle2 size={18} color="#14b8a6"/>:t.status==="approved"?<CheckCircle2 size={18} color="#22c55e"/>:t.status==="review"?<Eye size={18} color="#f59e0b"/>:t.status==="in_progress"?<PlayCircle size={18} color="#6366f1"/>:<Circle size={18} color="#475569"/>}</button>
              <div style={{width:3,height:28,borderRadius:3,background:PRIORITIES[t.priority]?.color||"#64748b",flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:t.status==="done"?"#64748b":"#e2e8f0",textDecoration:t.status==="done"?"line-through":"none"}}>{t.title}</div>
                <div style={{fontSize:10,color:"#64748b"}}>{cl?.company}{t.subtasks?.length>0&&` • ${t.subtasks.filter(s=>s.done).length}/${t.subtasks.length}`}{t.description?" • 📝":""}</div>
              </div>
              {createdAgo!==null&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:6,background:createdAgo>=5?"#ef444420":createdAgo>=3?"#f59e0b20":"#1e293b",color:createdAgo>=5?"#ef4444":createdAgo>=3?"#f59e0b":"#64748b",fontWeight:600}}>{createdAgo}d</span>}
              {u&&<Av i={u.avatar} c={ROLES[u.role?.toUpperCase()]?.color||"#64748b"} s={24}/>}
              <Bg color={PRIORITIES[t.priority]?.color||"#64748b"} small>{PRIORITIES[t.priority]?.label||""}</Bg>
              {t.dueDate&&<span style={{fontSize:10,color:ov?"#ef4444":"#64748b",fontWeight:ov?700:400}}>{fmt(t.dueDate)}</span>}
              <ChevronRight size={14} color="#475569" style={{transform:isExpanded?"rotate(90deg)":"none",transition:"transform .2s"}}/>
            </div>
            {/* EXPANDED DETAILS */}
            {isExpanded&&<div style={{padding:"0 14px 14px 48px",display:"flex",flexDirection:"column",gap:10}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                <div style={{background:"#020617",borderRadius:8,padding:8}}>
                  <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600,marginBottom:2}}>Solicitado por</div>
                  <div style={{fontSize:12,color:"#e2e8f0",fontWeight:600}}>{t.requestedByName||requester?.name||"—"}</div>
                </div>
                <div style={{background:"#020617",borderRadius:8,padding:8}}>
                  <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600,marginBottom:2}}>Responsável</div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    {u&&<Av i={u.avatar} c={ROLES[u.role?.toUpperCase()]?.color||"#64748b"} s={18}/>}
                    <span style={{fontSize:12,color:"#e2e8f0",fontWeight:600}}>{u?.name||"—"}</span>
                  </div>
                </div>
                <div style={{background:"#020617",borderRadius:8,padding:8}}>
                  <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600,marginBottom:2}}>Tempo na tarefa</div>
                  <div style={{fontSize:12,fontWeight:700,color:createdAgo>=5?"#ef4444":createdAgo>=3?"#f59e0b":"#22c55e"}}>{createdAgo!==null?`${createdAgo} dia${createdAgo!==1?"s":""}`:t.createdAt?formatDuration(Date.now()-new Date(t.createdAt).getTime()):"—"}</div>
                </div>
              </div>
              {/* Description block */}
              <div>
                <label style={{fontSize:9,color:"#64748b",textTransform:"uppercase",fontWeight:600}}>Descrição / Briefing da demanda</label>
                <textarea defaultValue={t.description||""} onBlur={e=>setTasks(p=>p.map(x=>x.id!==t.id?x:{...x,description:e.target.value}))}
                  placeholder="Descreva o que precisa ser criado, referências, formato, cores, textos... Quanto mais detalhes, melhor para o designer/criador."
                  style={{width:"100%",background:"#020617",border:"1px solid #334155",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:11,lineHeight:1.5,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:4,minHeight:80,resize:"vertical"}}/>
              </div>
              {/* Quick actions */}
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <select value={t.status} onChange={e=>setTasks(p=>p.map(x=>x.id!==t.id?x:{...x,status:e.target.value}))}
                  style={{background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"4px 8px",color:"#e2e8f0",fontSize:10,fontFamily:"inherit"}}>
                  <option value="pending">📝 A Criar</option>
                  <option value="in_progress">🎨 Criando</option>
                  <option value="review">👀 Em Aprovação</option>
                  <option value="approved">✅ Aprovado</option>
                  <option value="done">🚀 Entregue/Postado</option>
                </select>
                <select value={t.assigneeId||""} onChange={e=>setTasks(p=>p.map(x=>x.id!==t.id?x:{...x,assigneeId:e.target.value}))}
                  style={{background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"4px 8px",color:"#e2e8f0",fontSize:10,fontFamily:"inherit"}}>
                  <option value="">Atribuir para...</option>
                  {SEED_USERS.filter(u=>!u.pending).map(u=><option key={u.id} value={u.id}>{u.name} ({ROLES[u.role?.toUpperCase()]?.label||u.role})</option>)}
                </select>
                <select value={t.priority||"medium"} onChange={e=>setTasks(p=>p.map(x=>x.id!==t.id?x:{...x,priority:e.target.value}))}
                  style={{background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"4px 8px",color:PRIORITIES[t.priority]?.color||"#e2e8f0",fontSize:10,fontWeight:700,fontFamily:"inherit"}}>
                  {Object.entries(PRIORITIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
                <button onClick={()=>{if(confirm("Excluir tarefa?")){setTasks(p=>p.filter(x=>x.id!==t.id));setExpandedTask(null);}}}
                  style={{background:"#ef444420",border:"1px solid #ef444440",borderRadius:6,padding:"4px 8px",color:"#ef4444",fontSize:10,fontWeight:600,cursor:"pointer"}}>Excluir</button>
              </div>
            </div>}
          </div>
        );})}
      </div>}
    </div>;
  };

  const CalendarPage = () => {
    const [calWeekOffset, setCalWeekOffset] = useState(0);
    const [calView, setCalView] = useState("week"); // week | day | list
    const [calDaySelected, setCalDaySelected] = useState(new Date());
    const [hoveredEvent, setHoveredEvent] = useState(null);

    // Calculate week dates
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + calWeekOffset * 7);
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    const weekDays = Array.from({length:7}, (_,i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });

    const today = new Date();
    const todayStr = today.toDateString();
    const HOURS = Array.from({length:16}, (_,i) => i + 6); // 6am to 9pm
    const HOUR_H = 60; // px per hour

    // Merge all events
    const allMeetings = clients.flatMap(c => (c.meetings||[]).map(m => ({
      ...m, clientName: c.company, type: "meeting", color: "#6366f1"
    })));
    const allEvents = [
      ...calEvents.map(ev => ({...ev, type: "gcal"})),
      ...allMeetings.map(m => ({
        id: m.id, summary: m.title || `Reunião ${m.clientName}`,
        start: m.date, end: m.date ? new Date(new Date(m.date).getTime() + 3600000).toISOString() : m.date,
        color: "#6366f1", type: "meeting", clientName: m.clientName,
        calendar: "agência"
      }))
    ];

    // Get events for a specific day
    const getEventsForDay = (date) => {
      const dayStr = date.toDateString();
      return allEvents.filter(ev => {
        if (!ev.start) return false;
        const evDate = new Date(ev.start);
        return evDate.toDateString() === dayStr && !ev.allDay;
      }).sort((a,b) => new Date(a.start) - new Date(b.start));
    };

    const getAllDayEvents = (date) => {
      const dayStr = date.toDateString();
      return allEvents.filter(ev => ev.allDay && new Date(ev.start) <= date && new Date(ev.end) > date);
    };

    // Position an event in the time grid
    const getEventStyle = (ev) => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      const startHour = start.getHours() + start.getMinutes() / 60;
      const endHour = end.getHours() + end.getMinutes() / 60;
      const top = (startHour - 6) * HOUR_H;
      const height = Math.max((endHour - startHour) * HOUR_H, 20);
      const baseColor = ev.color || (ev.calendar === "agência" ? "#f97316" : "#22c55e");
      return { top, height, color: baseColor };
    };

    // Month name for header
    const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    const weekMonth = weekDays[3]; // mid-week for month name
    const headerText = `${monthNames[weekMonth.getMonth()]} ${weekMonth.getFullYear()}`;

    // Mini calendar month
    const miniMonth = new Date(weekMonth.getFullYear(), weekMonth.getMonth(), 1);
    const miniDaysInMonth = new Date(miniMonth.getFullYear(), miniMonth.getMonth() + 1, 0).getDate();
    const miniFirstDay = miniMonth.getDay();
    const miniDays = Array.from({length:42}, (_,i) => {
      const d = i - miniFirstDay + 1;
      if (d < 1 || d > miniDaysInMonth) return null;
      return new Date(miniMonth.getFullYear(), miniMonth.getMonth(), d);
    });

    const dayNames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
    const dayNamesFull = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

    // Count events per day for mini calendar dots
    const countEventsForDay = (date) => {
      if (!date) return 0;
      return allEvents.filter(ev => ev.start && new Date(ev.start).toDateString() === date.toDateString()).length;
    };

    // ─── WEEK VIEW ───
    const WeekView = () => (
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* All-day events row */}
        {(() => {
          const hasAllDay = weekDays.some(d => getAllDayEvents(d).length > 0);
          if (!hasAllDay) return null;
          return (
            <div style={{display:"flex",borderBottom:"1px solid #1e293b",background:"#0a0f1a"}}>
              <div style={{width:56,flexShrink:0,padding:"4px 8px",fontSize:9,color:"#64748b",textAlign:"right"}}>DIA<br/>TODO</div>
              {weekDays.map((day,i) => {
                const adEvents = getAllDayEvents(day);
                return (
                  <div key={i} style={{flex:1,borderLeft:"1px solid #1e293b15",padding:2,minHeight:24}}>
                    {adEvents.map(ev => (
                      <div key={ev.id} style={{background:`${ev.color || "#22c55e"}30`,color:ev.color || "#22c55e",borderLeft:`3px solid ${ev.color || "#22c55e"}`,borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:600,marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.summary}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Time grid */}
        <div style={{flex:1,overflowY:"auto",position:"relative"}}>
          <div style={{display:"flex",minHeight:HOURS.length * HOUR_H}}>
            {/* Time labels */}
            <div style={{width:56,flexShrink:0,position:"relative"}}>
              {HOURS.map(h => (
                <div key={h} style={{position:"absolute",top:(h-6)*HOUR_H,height:HOUR_H,width:"100%",display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:8,paddingTop:0}}>
                  <span style={{fontSize:10,color:"#475569",fontWeight:500,lineHeight:1,transform:"translateY(-5px)"}}>{h===0?"00:00":h<10?`0${h}:00`:`${h}:00`}</span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day,dayIdx) => {
              const isToday = day.toDateString() === todayStr;
              const dayEvents = getEventsForDay(day);

              // Simple overlap detection
              const positioned = [];
              dayEvents.forEach(ev => {
                const es = getEventStyle(ev);
                let col = 0;
                for (const p of positioned) {
                  if (es.top < p.top + p.height && es.top + es.height > p.top && p.col === col) col++;
                }
                positioned.push({...ev, ...es, col});
              });
              const maxCol = positioned.length > 0 ? Math.max(...positioned.map(p=>p.col)) + 1 : 1;

              // Current time indicator
              const nowHour = today.getHours() + today.getMinutes() / 60;
              const nowTop = (nowHour - 6) * HOUR_H;

              return (
                <div key={dayIdx} style={{flex:1,position:"relative",borderLeft:"1px solid #1e293b20",background:isToday?"#1e293b10":"transparent"}}>
                  {/* Hour lines */}
                  {HOURS.map(h => (
                    <div key={h} style={{position:"absolute",top:(h-6)*HOUR_H,width:"100%",height:1,background:"#1e293b40"}}/>
                  ))}
                  {/* Half-hour lines */}
                  {HOURS.map(h => (
                    <div key={`h${h}`} style={{position:"absolute",top:(h-6)*HOUR_H + HOUR_H/2,width:"100%",height:1,background:"#1e293b20"}}/>
                  ))}

                  {/* Current time line */}
                  {isToday && nowTop > 0 && nowTop < HOURS.length * HOUR_H && (
                    <div style={{position:"absolute",top:nowTop,left:0,right:0,zIndex:20,display:"flex",alignItems:"center"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",marginLeft:-4}}/>
                      <div style={{flex:1,height:2,background:"#ef4444"}}/>
                    </div>
                  )}

                  {/* Events */}
                  {positioned.map(ev => {
                    const startTime = new Date(ev.start);
                    const endTime = new Date(ev.end);
                    const isHovered = hoveredEvent === ev.id;
                    const colWidth = `calc((100% - 4px) / ${maxCol})`;

                    return (
                      <div key={ev.id}
                        onMouseEnter={() => setHoveredEvent(ev.id)}
                        onMouseLeave={() => setHoveredEvent(null)}
                        style={{
                          position:"absolute",
                          top: ev.top + 1,
                          left: `calc(${ev.col} * (100% - 4px) / ${maxCol} + 2px)`,
                          width: colWidth,
                          height: ev.height - 2,
                          background: isHovered ? `${ev.color}40` : `${ev.color}25`,
                          borderLeft: `3px solid ${ev.color}`,
                          borderRadius: 6,
                          padding: "3px 6px",
                          overflow: "hidden",
                          cursor: "pointer",
                          zIndex: isHovered ? 15 : 10,
                          transition: "all .15s ease",
                          boxShadow: isHovered ? `0 4px 12px ${ev.color}30` : "none",
                        }}>
                        <div style={{fontSize:10,fontWeight:700,color:ev.color,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.summary}</div>
                        {ev.height > 30 && (
                          <div style={{fontSize:9,color:`${ev.color}bb`,marginTop:1}}>
                            {startTime.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} - {endTime.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}
                          </div>
                        )}
                        {ev.height > 50 && ev.location && (
                          <div style={{fontSize:8,color:`${ev.color}88`,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.location}</div>
                        )}
                        {ev.height > 50 && ev.clientName && (
                          <div style={{fontSize:8,color:`${ev.color}88`,marginTop:1}}>{ev.clientName}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );

    // ─── DAY VIEW ───
    const DayView = () => {
      const dayEvents = getEventsForDay(calDaySelected).sort((a,b) => new Date(a.start) - new Date(b.start));
      const isToday = calDaySelected.toDateString() === todayStr;
      return (
        <div style={{flex:1,overflowY:"auto",padding:16}}>
          <h3 style={{fontSize:16,fontWeight:800,color:"#f1f5f9",margin:"0 0 16px"}}>
            {dayNamesFull[calDaySelected.getDay()]}, {calDaySelected.getDate()} de {monthNames[calDaySelected.getMonth()]}
            {isToday && <Bg color="#6366f1" small style={{marginLeft:8}}>Hoje</Bg>}
          </h3>
          {dayEvents.length === 0 && <div style={{padding:40,textAlign:"center",color:"#475569"}}><CalendarDays size={32} style={{marginBottom:8}}/><p style={{fontSize:13}}>Nenhum evento neste dia</p></div>}
          {dayEvents.map(ev => {
            const start = new Date(ev.start);
            const end = new Date(ev.end);
            const baseColor = ev.color || (ev.calendar === "agência" ? "#f97316" : "#22c55e");
            return (
              <div key={ev.id} style={{display:"flex",gap:12,marginBottom:10,padding:14,background:`${baseColor}08`,border:`1px solid ${baseColor}20`,borderLeft:`4px solid ${baseColor}`,borderRadius:10,cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>e.currentTarget.style.background=`${baseColor}15`}
                onMouseLeave={e=>e.currentTarget.style.background=`${baseColor}08`}>
                <div style={{width:52,flexShrink:0,textAlign:"center"}}>
                  <div style={{fontSize:14,fontWeight:800,color:baseColor}}>{start.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{end.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{ev.summary}</div>
                  <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                    <Bg color={ev.calendar==="agência"?"#f97316":"#22c55e"} small>{ev.calendar==="agência"?"Agência":"Pessoal"}</Bg>
                    {ev.recurring && <Bg color="#6366f1" small>Recorrente</Bg>}
                    {ev.location && <Bg color="#64748b" small>{ev.location}</Bg>}
                  </div>
                  {ev.description && <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>{ev.description}</div>}
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div style={{height:"calc(100vh - 56px)",display:"flex",flexDirection:"column",background:"#020617"}}>
        {/* Top bar */}
        <div style={{display:"flex",alignItems:"center",padding:"10px 16px",borderBottom:"1px solid #1e293b",background:"#0a0f1a",gap:10,flexShrink:0}}>
          {/* Navigation */}
          <Btn onClick={()=>{setCalWeekOffset(0);setCalDaySelected(new Date());}} variant="secondary" small>Hoje</Btn>
          <button onClick={()=>{setCalWeekOffset(p=>p-1);}} style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",padding:4}}><ChevronLeft size={18}/></button>
          <button onClick={()=>{setCalWeekOffset(p=>p+1);}} style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",padding:4}}><ChevronRight size={18}/></button>
          <h2 style={{fontSize:18,fontWeight:800,color:"#f1f5f9",margin:0,flex:1}}>{headerText}</h2>

          {/* View toggles */}
          <div style={{display:"flex",background:"#1e293b",borderRadius:8,padding:2}}>
            {[{id:"day",label:"Dia"},{id:"week",label:"Semana"},{id:"list",label:"Lista"}].map(v => (
              <button key={v.id} onClick={()=>setCalView(v.id)} style={{padding:"5px 12px",fontSize:11,fontWeight:calView===v.id?700:500,color:calView===v.id?"#e2e8f0":"#64748b",background:calView===v.id?"#334155":"transparent",border:"none",borderRadius:6,cursor:"pointer"}}>{v.label}</button>
            ))}
          </div>

          <Bg color={calSynced?"#22c55e":"#f59e0b"} small><Wifi size={9}/> {calSynced?`Live — ${calEvents.length} eventos`:"Estático"}</Bg>
          <Btn onClick={()=>setShowNewMeeting(true)} icon={Plus} small>Novo Evento</Btn>
        </div>

        {/* Main content */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          {/* Sidebar - Mini calendar + upcoming */}
          <div style={{width:220,borderRight:"1px solid #1e293b",background:"#0a0f1a",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
            {/* Mini Calendar */}
            <div style={{padding:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{monthNames[miniMonth.getMonth()]} {miniMonth.getFullYear()}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:0}}>
                {dayNames.map(d => <div key={d} style={{textAlign:"center",fontSize:9,fontWeight:600,color:"#64748b",padding:"2px 0"}}>{d[0]}</div>)}
                {miniDays.map((d,i) => {
                  if (!d) return <div key={i}/>;
                  const isT = d.toDateString() === todayStr;
                  const isSel = d.toDateString() === calDaySelected.toDateString();
                  const evCount = countEventsForDay(d);
                  const inWeek = weekDays.some(wd => wd.toDateString() === d.toDateString());
                  return (
                    <div key={i} onClick={() => {setCalDaySelected(d); setCalView("day");}}
                      style={{textAlign:"center",padding:"3px 0",cursor:"pointer",borderRadius:isT?"50%":4,
                        background:isT?"#6366f1":isSel?"#334155":inWeek?"#1e293b30":"transparent",
                        color:isT?"#fff":isSel?"#e2e8f0":"#94a3b8",fontSize:11,fontWeight:isT?800:500,position:"relative"}}>
                      {d.getDate()}
                      {evCount > 0 && !isT && <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:4,height:4,borderRadius:"50%",background:evCount > 3 ? "#ef4444" : "#6366f1"}}/>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendars legend */}
            <div style={{padding:"0 12px 12px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Calendários</div>
              {[
                {color:"#22c55e",label:"thomas98macedo@gmail.com",sub:"Pessoal"},
                {color:"#f97316",label:"cltmkt2@gmail.com",sub:"Agência"},
                {color:"#6366f1",label:"Reuniões AgênciaOS",sub:"Interno"},
              ].map(c => (
                <div key={c.label} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0"}}>
                  <div style={{width:10,height:10,borderRadius:3,background:c.color,flexShrink:0}}/>
                  <div><div style={{fontSize:10,color:"#e2e8f0",fontWeight:600}}>{c.sub}</div><div style={{fontSize:8,color:"#64748b",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{c.label}</div></div>
                </div>
              ))}
            </div>

            {/* Upcoming events */}
            <div style={{padding:"0 12px 12px",borderTop:"1px solid #1e293b",paddingTop:10}}>
              <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Próximos Eventos</div>
              {calEvents.filter(ev => new Date(ev.start) >= new Date()).slice(0,6).map(ev => {
                const d = new Date(ev.start);
                return (
                  <div key={ev.id} onClick={()=>{setCalDaySelected(d);setCalView("day");}} style={{padding:"5px 0",borderBottom:"1px solid #1e293b20",cursor:"pointer"}}>
                    <div style={{fontSize:10,fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.summary}</div>
                    <div style={{fontSize:9,color:"#64748b"}}>{d.toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"2-digit"})} {d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main calendar area */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {calView === "week" && (
              <>
                {/* Day headers */}
                <div style={{display:"flex",borderBottom:"1px solid #1e293b",background:"#0a0f1a",flexShrink:0}}>
                  <div style={{width:56,flexShrink:0}}/>
                  {weekDays.map((day,i) => {
                    const isToday = day.toDateString() === todayStr;
                    const evCount = getEventsForDay(day).length;
                    return (
                      <div key={i} onClick={()=>{setCalDaySelected(day);setCalView("day");}}
                        style={{flex:1,borderLeft:"1px solid #1e293b20",padding:"8px 6px",textAlign:"center",cursor:"pointer",background:isToday?"#1e293b20":"transparent"}}>
                        <div style={{fontSize:10,fontWeight:600,color:isToday?"#6366f1":"#64748b",textTransform:"uppercase"}}>{dayNames[i]}</div>
                        <div style={{fontSize:22,fontWeight:800,color:isToday?"#6366f1":"#e2e8f0",lineHeight:1.2,
                          ...(isToday ? {background:"#6366f1",color:"#fff",width:32,height:32,borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center"} : {})
                        }}>{day.getDate()}</div>
                        {evCount > 0 && <div style={{fontSize:9,color:"#64748b",marginTop:1}}>{evCount} evento{evCount>1?"s":""}</div>}
                      </div>
                    );
                  })}
                </div>
                <WeekView />
              </>
            )}
            {calView === "day" && <DayView />}
            {calView === "list" && (
              <div style={{flex:1,overflowY:"auto",padding:16}}>
                <h3 style={{fontSize:14,fontWeight:700,color:"#f1f5f9",margin:"0 0 12px"}}>Todos os Eventos ({calEvents.length})</h3>
                {calEvents.map(ev => {
                  const d = new Date(ev.start);
                  const baseColor = ev.color || (ev.calendar === "agência" ? "#f97316" : "#22c55e");
                  return (
                    <div key={ev.id} onClick={()=>{setCalDaySelected(d);setCalView("day");}}
                      style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",marginBottom:4,borderRadius:8,cursor:"pointer",background:"#0f172a",border:"1px solid #1e293b",transition:"all .2s"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=baseColor}
                      onMouseLeave={e=>e.currentTarget.style.borderColor="#1e293b"}>
                      <div style={{width:4,height:32,borderRadius:4,background:baseColor,flexShrink:0}}/>
                      <div style={{width:70,flexShrink:0}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0"}}>{d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}</div>
                        <div style={{fontSize:10,color:"#64748b"}}>{d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.summary}</div>
                        {ev.location && <div style={{fontSize:10,color:"#64748b"}}>{ev.location}</div>}
                      </div>
                      <Bg color={ev.calendar==="agência"?"#f97316":"#22c55e"} small>{ev.calendar==="agência"?"Agência":"Pessoal"}</Bg>
                      {ev.recurring && <Bg color="#6366f1" small>Weekly</Bg>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ═══ WAR DAY — painel temático de vendas ═══
  const WAR_GOAL = 12000;
  const SDR_CALL_GOAL = 70;
  const WAR_CLOSERS = ["u1","u8","u3","u7","u13"]; // Thomas, Leo, Nando, Dantas, Bueno
  const WAR_SDRS = ["u14","u11"]; // Lucas SDR, Fábio
  const WAR_ALL = [...WAR_CLOSERS, ...WAR_SDRS];

  const [warDeals, setWarDeals] = useState(() => {
    try { return JSON.parse(localStorage.getItem("agos-warday")||"null") || []; } catch(e) { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem("agos-warday", JSON.stringify(warDeals)); } catch(e) {}
    if(loaded) firebasePutDebounced("warDeals",warDeals,1000);
  }, [warDeals,loaded]);
  useEffect(() => {
    const toArr=(d)=>{if(!d)return null;if(Array.isArray(d))return d;return Object.values(d);};
    firebaseGet("warDeals").then(d=>{const a=toArr(d);if(a&&a.length>0)setWarDeals(a);}).catch(()=>{});
    const listener=firebaseListen("warDeals",(d)=>{const a=toArr(d);if(a)setWarDeals(a);});
    return()=>{try{listener.close();}catch(e){}};
  }, []);

  // Consultoria pipeline — Firebase synced
  const [consultorias, setConsultorias] = useState(() => {
    try { return JSON.parse(localStorage.getItem("agos-consultorias")||"null") || []; } catch(e) { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem("agos-consultorias", JSON.stringify(consultorias)); } catch(e) {}
    if(loaded) firebasePutDebounced("consultorias",consultorias,1000);
  }, [consultorias,loaded]);
  useEffect(() => {
    const toArr=(d)=>{if(!d)return null;if(Array.isArray(d))return d;return Object.values(d);};
    firebaseGet("consultorias").then(d=>{const a=toArr(d);if(a&&a.length>0)setConsultorias(a);}).catch(()=>{});
    const listener=firebaseListen("consultorias",(d)=>{const a=toArr(d);if(a)setConsultorias(a);});
    return()=>{try{listener.close();}catch(e){}};
  }, []);

  // Auto-detect "consultoria" events from calendar → register as calls
  useEffect(() => {
    if (!calEvents || calEvents.length === 0) return;
    const consultoriaEvents = calEvents.filter(ev =>
      ev.summary && ev.summary.toLowerCase().includes("consultoria")
    );
    consultoriaEvents.forEach(ev => {
      const evId = ev.id || ev.summary + ev.start;
      // Check if already registered
      if (consultorias.some(c => c.calEventId === evId)) return;
      if (warDeals.some(d => d.calEventId === evId)) return;
      const newConsultoria = {
        id: `cs${uid()}`, calEventId: evId,
        client: ev.summary.replace(/consultoria/gi,"").replace(/[-–—]/g,"").trim() || ev.summary,
        date: ev.start, time: ev.start ? new Date(ev.start).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) : "",
        phone: "", briefing: "", proposalValue: "", status: "scheduled", // scheduled | done | proposal | closed | lost
        closer: "", sdr: "", notes: ev.description || "",
        createdAt: new Date().toISOString(),
      };
      setConsultorias(prev => [...prev, newConsultoria]);
      // Also add to war day as meeting if war day active
      setWarDeals(prev => [...prev, {
        id: `wd${uid()}`, calEventId: evId,
        client: newConsultoria.client, value: 0, package: "pack1",
        closer: "", sdr: "", status: "meeting", notes: `Auto: Consultoria da agenda — ${ev.summary}`,
        time: new Date().toISOString(),
      }]);
      showToast(`📞 Consultoria detectada: ${newConsultoria.client}`);
    });
  }, [calEvents]);

  const [showWarDeal, setShowWarDeal] = useState(false);
  const [warDeal, setWarDeal] = useState({client:"",value:"",package:"pack1",closer:"",sdr:"",status:"proposal",notes:""});
  const [showScheduleCall, setShowScheduleCall] = useState(false);
  const [newCall, setNewCall] = useState({client:"",phone:"",date:"",time:"10:00",duration:"60",closer:"",sdr:"",briefing:"",proposalValue:"",source:""});

  const addWarDeal = () => {
    if (!warDeal.client) return;
    const deal = { ...warDeal, id: `wd${uid()}`, value: Number(warDeal.value)||0, time: new Date().toISOString() };
    setWarDeals(p => [...p, deal]);
    if (deal.status === "closed") {
      const msg = `🎯 *WAR DAY — VENDA FECHADA!*\n💰 ${deal.client} — R$${deal.value.toLocaleString("pt-BR")}\n👤 Closer: ${getUser(deal.closer)?.name||"?"}\n📞 SDR: ${getUser(deal.sdr)?.name||"?"}`;
      sendTelegram(msg);
      showToast(`🎯 VENDA! ${deal.client} — R$${deal.value.toLocaleString("pt-BR")}`);
    }
    setShowWarDeal(false);
    setWarDeal({client:"",value:"",package:"pack1",closer:"",sdr:"",status:"proposal",notes:""});
  };

  const warClosed = warDeals.filter(d=>d.status==="closed");
  const warProposals = warDeals.filter(d=>d.status==="proposal");
  const warTotal = warClosed.reduce((s,d)=>s+d.value,0);
  const warProposalTotal = warProposals.reduce((s,d)=>s+d.value,0);
  const warPct = Math.min((warTotal/WAR_GOAL)*100,100);

  const WarDayPage = () => <div style={{padding:20,maxWidth:1200,margin:"0 auto"}}>
    {/* HEADER */}
    <div style={{background:"linear-gradient(135deg,#ef4444,#dc2626)",borderRadius:16,padding:24,marginBottom:16,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",right:20,top:10,fontSize:80,opacity:.1}}>🎯</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{margin:0,fontSize:28,fontWeight:900,color:"#fff"}}>WAR DAY</h1>
          <div style={{fontSize:13,color:"#fca5a5",marginTop:4}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:14,color:"#fca5a5"}}>META DO DIA</div>
          <div style={{fontSize:36,fontWeight:900,color:"#fff"}}>R${WAR_GOAL.toLocaleString("pt-BR")}</div>
        </div>
      </div>
      <div style={{marginTop:16}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#fca5a5",marginBottom:4}}>
          <span>R${warTotal.toLocaleString("pt-BR")} vendidos</span>
          <span>{Math.round(warPct)}%</span>
        </div>
        <div style={{background:"#ffffff30",borderRadius:8,height:12,overflow:"hidden"}}>
          <div style={{height:"100%",background:warPct>=100?"#22c55e":"#fff",borderRadius:8,transition:"width .5s",width:`${warPct}%`}}/>
        </div>
        <div style={{fontSize:11,color:"#fca5a5",marginTop:4}}>Faltam R${Math.max(WAR_GOAL-warTotal,0).toLocaleString("pt-BR")} para bater a meta</div>
      </div>
    </div>

    {/* METRICS */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
      <div style={{background:"#0f172a",border:"1px solid #22c55e30",borderRadius:12,padding:16,textAlign:"center"}}>
        <div style={{fontSize:28,fontWeight:900,color:"#22c55e"}}>R${warTotal.toLocaleString("pt-BR")}</div>
        <div style={{fontSize:10,color:"#64748b"}}>Vendas Fechadas</div>
      </div>
      <div style={{background:"#0f172a",border:"1px solid #f59e0b30",borderRadius:12,padding:16,textAlign:"center"}}>
        <div style={{fontSize:28,fontWeight:900,color:"#f59e0b"}}>R${warProposalTotal.toLocaleString("pt-BR")}</div>
        <div style={{fontSize:10,color:"#64748b"}}>Propostas na Mesa</div>
      </div>
      <div style={{background:"#0f172a",border:"1px solid #6366f130",borderRadius:12,padding:16,textAlign:"center"}}>
        <div style={{fontSize:28,fontWeight:900,color:"#6366f1"}}>{warDeals.filter(d=>d.status==="meeting").length}</div>
        <div style={{fontSize:10,color:"#64748b"}}>Reuniões Marcadas</div>
      </div>
      <div style={{background:"#0f172a",border:"1px solid #ec489930",borderRadius:12,padding:16,textAlign:"center"}}>
        <div style={{fontSize:28,fontWeight:900,color:"#ec4899"}}>{warClosed.length}</div>
        <div style={{fontSize:10,color:"#64748b"}}>Contratos Fechados</div>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      {/* CLOSERS */}
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#ef4444",display:"flex",alignItems:"center",gap:6}}><Target size={16}/> Closers</h3>
          <Btn small icon={Plus} onClick={()=>setShowWarDeal(true)}>Registrar</Btn>
        </div>
        {WAR_CLOSERS.map(uid=>{const u=getUser(uid);if(!u)return null;const deals=warClosed.filter(d=>d.closer===uid);const total=deals.reduce((s,d)=>s+d.value,0);const proposals=warProposals.filter(d=>d.closer===uid);const meetings=warDeals.filter(d=>d.closer===uid&&d.status==="meeting");
          return <div key={uid} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #1e293b20"}}>
            <Av i={u.avatar} c={ROLES[u.role?.toUpperCase()]?.color||"#6366f1"} s={36}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{u.name}</div>
              <div style={{fontSize:10,color:"#64748b"}}>{ROLES[u.role?.toUpperCase()]?.label}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:800,color:"#22c55e"}}>R${total.toLocaleString("pt-BR")}</div><div style={{fontSize:8,color:"#64748b"}}>{deals.length} vendas</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:"#f59e0b"}}>{proposals.length}</div><div style={{fontSize:8,color:"#64748b"}}>propostas</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:"#6366f1"}}>{meetings.length}</div><div style={{fontSize:8,color:"#64748b"}}>calls</div></div>
            </div>
          </div>;
        })}
      </div>

      {/* SDRs with neon progress */}
      <div style={{background:"#0f172a",border:"1px solid #14b8a630",borderRadius:12,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#14b8a6",display:"flex",alignItems:"center",gap:6}}><Megaphone size={16}/> SDRs — Meta {SDR_CALL_GOAL} Calls/mês</h3>
          <Btn small icon={Phone} onClick={()=>setShowScheduleCall(true)}>Agendar Call</Btn>
        </div>
        {WAR_SDRS.map(uid=>{const u=getUser(uid);if(!u)return null;
          const allCalls = warDeals.filter(d=>d.sdr===uid&&d.status==="meeting").length + consultorias.filter(c=>c.sdr===uid).length;
          const proposals = warDeals.filter(d=>d.sdr===uid&&d.status==="proposal").length + consultorias.filter(c=>c.sdr===uid&&c.status==="proposal").length;
          const closed = warDeals.filter(d=>d.sdr===uid&&d.status==="closed");
          const total = closed.reduce((s,d)=>s+d.value,0);
          const pct = Math.min((allCalls/SDR_CALL_GOAL)*100,100);
          return <div key={uid} style={{padding:"12px 0",borderBottom:"1px solid #1e293b20"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
              <Av i={u.avatar} c="#14b8a6" s={36}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{u.name}</div>
                <div style={{fontSize:10,color:"#64748b"}}>SDR</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <div style={{textAlign:"center",minWidth:50}}><div style={{fontSize:16,fontWeight:800,color:"#39ff14"}}>{allCalls}</div><div style={{fontSize:8,color:"#64748b"}}>calls</div></div>
                <div style={{textAlign:"center",minWidth:50}}><div style={{fontSize:14,fontWeight:700,color:"#f59e0b"}}>{proposals}</div><div style={{fontSize:8,color:"#64748b"}}>propostas</div></div>
                <div style={{textAlign:"center",minWidth:60}}><div style={{fontSize:14,fontWeight:700,color:"#22c55e"}}>R${total.toLocaleString("pt-BR")}</div><div style={{fontSize:8,color:"#64748b"}}>convertido</div></div>
                <button onClick={()=>{
                  const deal = {id:`wd${uid()}`,client:`Call #${allCalls+1}`,value:0,package:"pack1",closer:"",sdr:uid,status:"meeting",notes:"Call registrada via botão rápido",time:new Date().toISOString(),calEventId:null};
                  setWarDeals(p=>[...p,deal]);
                  showToast(`📞 +1 Call para ${u.name} (${allCalls+1}/${SDR_CALL_GOAL})`);
                }} style={{background:"#39ff1420",border:"2px solid #39ff14",borderRadius:10,padding:"6px 12px",color:"#39ff14",fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:"0 0 12px #39ff1440",display:"flex",alignItems:"center",gap:4}}>
                  <Phone size={13}/> +1
                </button>
              </div>
            </div>
            {/* Neon progress bar */}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,background:"#0a1a0a",borderRadius:8,height:14,overflow:"hidden",border:"1px solid #39ff1430",position:"relative"}}>
                <div style={{height:"100%",background:"linear-gradient(90deg,#14b8a6,#39ff14)",borderRadius:8,transition:"width .5s ease",width:`${pct}%`,boxShadow:"0 0 12px #39ff14, 0 0 4px #39ff14 inset"}}/>
              </div>
              <span style={{fontSize:11,fontWeight:800,color:pct>=100?"#39ff14":"#14b8a6",minWidth:50,textAlign:"right"}}>{allCalls}/{SDR_CALL_GOAL}</span>
            </div>
          </div>;
        })}
      </div>
    </div>

    {/* DEALS LOG — registro com fluxo de fechamento */}
    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginTop:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#e2e8f0"}}>Registro do Dia ({warDeals.length})</h3>
        <div style={{display:"flex",gap:6}}>
          <Btn small icon={Phone} onClick={()=>setShowScheduleCall(true)}>Agendar Call</Btn>
          <Btn small icon={Plus} onClick={()=>setShowWarDeal(true)}>Nova Entrada</Btn>
          <Btn small variant="danger" icon={RotateCcw} onClick={()=>{if(confirm("Limpar registros do War Day?")){setWarDeals([]);}}}>Limpar</Btn>
        </div>
      </div>
      {warDeals.length===0&&<div style={{textAlign:"center",padding:24,color:"#475569"}}><Target size={32} color="#334155" style={{marginBottom:8}}/><div style={{fontSize:12}}>Nenhum registro ainda. Agende uma call ou crie uma entrada.</div></div>}
      {[...warDeals].sort((a,b)=>new Date(b.time)-new Date(a.time)).map(d=>{const closer=getUser(d.closer);const sdr=getUser(d.sdr);const isExp=expandedTask===d.id;
        return <div key={d.id} style={{background:d.status==="closed"?"#22c55e08":"#020617",border:`1px solid ${d.status==="closed"?"#22c55e20":d.status==="proposal"?"#f59e0b20":"#1e293b"}`,borderRadius:10,padding:10,marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setExpandedTask(isExp?null:d.id)}>
            <div style={{width:10,height:10,borderRadius:"50%",background:d.status==="closed"?"#22c55e":d.status==="proposal"?"#f59e0b":"#6366f1",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{d.client||"Lead sem nome"} {d.value>0&&<span style={{color:d.status==="closed"?"#22c55e":"#f59e0b"}}>— R${(d.value||0).toLocaleString("pt-BR")}</span>}</div>
              <div style={{fontSize:10,color:"#64748b"}}>{closer?.name||"sem closer"} + {sdr?.name||"sem SDR"} • {d.package==="pack2"?"R$4k":"R$2k"}</div>
            </div>
            <Bg color={d.status==="closed"?"#22c55e":d.status==="proposal"?"#f59e0b":"#6366f1"} small>{d.status==="closed"?"✅ Fechado":d.status==="proposal"?"📋 Proposta":"📞 Call"}</Bg>
            {d.status!=="closed"&&<button onClick={e=>{e.stopPropagation();setExpandedTask(d.id);}} style={{background:"#22c55e20",border:"1px solid #22c55e40",borderRadius:6,padding:"3px 10px",fontSize:10,fontWeight:800,color:"#22c55e",cursor:"pointer"}}>Fechar ✓</button>}
            <span style={{fontSize:9,color:"#475569"}}>{new Date(d.time).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>
            <ChevronRight size={12} color="#475569" style={{transform:isExp?"rotate(90deg)":"none",transition:"transform .2s"}}/>
          </div>
          {/* EXPANDED — editar dados e fechar venda */}
          {isExp&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #1e293b",display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div><label style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontWeight:600}}>Lead / Empresa</label>
                <input type="text" defaultValue={d.client||""} onBlur={e=>setWarDeals(p=>p.map(x=>x.id!==d.id?x:{...x,client:e.target.value}))} style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:11,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:2}}/></div>
              <div><label style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontWeight:600}}>Closer</label>
                <select value={d.closer||""} onChange={e=>setWarDeals(p=>p.map(x=>x.id!==d.id?x:{...x,closer:e.target.value}))} style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:11,fontFamily:"inherit",boxSizing:"border-box",marginTop:2}}>
                  <option value="">Selecione</option>{WAR_CLOSERS.map(id=><option key={id} value={id}>{getUser(id)?.name}</option>)}
                </select></div>
              <div><label style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontWeight:600}}>SDR</label>
                <select value={d.sdr||""} onChange={e=>setWarDeals(p=>p.map(x=>x.id!==d.id?x:{...x,sdr:e.target.value}))} style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:11,fontFamily:"inherit",boxSizing:"border-box",marginTop:2}}>
                  <option value="">Selecione</option>{WAR_SDRS.map(id=><option key={id} value={id}>{getUser(id)?.name}</option>)}
                </select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div><label style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontWeight:600}}>Pacote</label>
                <select value={d.package||"pack1"} onChange={e=>setWarDeals(p=>p.map(x=>x.id!==d.id?x:{...x,package:e.target.value,value:e.target.value==="pack2"?4000:2000}))} style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:11,fontFamily:"inherit",boxSizing:"border-box",marginTop:2}}>
                  <option value="pack1">Pacote 1 — R$2.000/mês</option><option value="pack2">Pacote 2 — R$4.000/mês</option>
                </select></div>
              <div><label style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontWeight:600}}>Status</label>
                <select value={d.status||"meeting"} onChange={e=>setWarDeals(p=>p.map(x=>x.id!==d.id?x:{...x,status:e.target.value}))} style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"5px 8px",color:"#e2e8f0",fontSize:11,fontFamily:"inherit",boxSizing:"border-box",marginTop:2}}>
                  <option value="meeting">📞 Call agendada</option><option value="proposal">📋 Proposta enviada</option><option value="closed">✅ Venda fechada</option><option value="lost">❌ Não fechou</option>
                </select></div>
            </div>
            <div><label style={{fontSize:9,color:"#475569",textTransform:"uppercase",fontWeight:600}}>Briefing / Notas da call</label>
              <textarea defaultValue={d.notes||""} onBlur={e=>setWarDeals(p=>p.map(x=>x.id!==d.id?x:{...x,notes:e.target.value}))} placeholder="Dor do lead, serviços que precisa, objeções, próximos passos..." style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"6px 8px",color:"#e2e8f0",fontSize:11,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:2,minHeight:50,resize:"vertical"}}/></div>
            {/* FECHAR VENDA — cria cliente no Kanban */}
            {d.status!=="closed"&&<button onClick={()=>{
              if(!d.client){showToast("Preencha o nome do lead primeiro");return;}
              // Mark as closed
              setWarDeals(p=>p.map(x=>x.id!==d.id?x:{...x,status:"closed"}));
              // Auto-create client in Kanban
              const newClient = {
                id:`cs${uid()}`, company:d.client, contact:"", phone:"", email:"", segment:"",
                service:d.package==="pack2"?"Pacote R$4k":"Pacote R$2k",
                contractValue:d.value||2000,
                closedDate:new Date().toISOString(), paymentDate:null, status:"venda_fechada",
                priority:"high", csId:"u2", trafficId:d.closer||"u3", socialId:null, designerId:"u20",
                filmmakerId:null, commercialId:d.closer||"u7", soldBy:d.closer||"",
                whatsappGroup:"", formStatus:"not_sent",
                onboardingDate:null, trafficActivationDate:null,
                notes:`War Day | SDR: ${getUser(d.sdr)?.name||"?"} | Closer: ${getUser(d.closer)?.name||"?"}\n${d.notes||""}`.trim(),
                payDay:null, contractEnd:null,
                churning:false, encerrado:false, gcTeam:WAR_SDRS.indexOf(d.sdr)===0?"GC1":"GC2",
                csChecklist:mkChecklist(CS_CK), onboardingChecklist:mkChecklist(OB_CK),
                trafficChecklist:mkChecklist(TR_CK), creationChecklist:mkChecklist(CR_CK), socialBriefing:mkChecklist(SM_BRIEFING),
                timeline:[{date:new Date().toISOString(),event:`Venda fechada no War Day — R$${(d.value||0).toLocaleString("pt-BR")} — Closer: ${getUser(d.closer)?.name||"?"} | SDR: ${getUser(d.sdr)?.name||"?"}`,user:"War Day"}],
                meetings:[], reports:[], fromSheet:false,
              };
              setClients(p=>[...p,newClient]);
              const msg = `🎯 *WAR DAY — VENDA FECHADA!*\n💰 ${d.client} — R$${(d.value||0).toLocaleString("pt-BR")}\n👤 Closer: ${getUser(d.closer)?.name||"?"}\n📞 SDR: ${getUser(d.sdr)?.name||"?"}\n✅ Cliente criado no Kanban automaticamente`;
              sendTelegram(msg);
              showToast(`🎯 VENDA! ${d.client} — R$${(d.value||0).toLocaleString("pt-BR")} — Cliente criado no Kanban!`);
              setExpandedTask(null);
            }} style={{background:"linear-gradient(135deg,#22c55e,#16a34a)",border:"none",borderRadius:10,padding:"10px 20px",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:"0 4px 16px #22c55e40"}}>
              <CheckCircle2 size={16}/> FECHAR VENDA — Criar cliente no Kanban
            </button>}
            {d.status==="closed"&&<div style={{background:"#22c55e15",border:"1px solid #22c55e30",borderRadius:8,padding:8,textAlign:"center",fontSize:11,color:"#22c55e",fontWeight:700}}>✅ Venda fechada — cliente adicionado ao Kanban</div>}
            <button onClick={()=>{if(confirm("Remover este registro?")){setWarDeals(p=>p.filter(x=>x.id!==d.id));setExpandedTask(null);}}} style={{background:"none",border:"none",color:"#ef444460",cursor:"pointer",fontSize:9,textAlign:"right"}}>remover registro</button>
          </div>}
        </div>;
      })}
    </div>

    {/* ═══ PIPELINE CONSULTORIAS ═══ */}
    <div style={{background:"#0f172a",border:"1px solid #6366f130",borderRadius:12,padding:16,marginTop:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h3 style={{margin:0,fontSize:14,fontWeight:700,color:"#6366f1",display:"flex",alignItems:"center",gap:6}}>
          <Phone size={16}/> Pipeline de Consultorias
          <span style={{fontSize:10,color:"#64748b",fontWeight:400}}>— detectadas automaticamente da agenda</span>
        </h3>
        <div style={{display:"flex",gap:6}}>
          <Bg color="#6366f1" small>{consultorias.filter(c=>c.status==="scheduled").length} agendadas</Bg>
          <Bg color="#f59e0b" small>{consultorias.filter(c=>c.status==="proposal").length} propostas</Bg>
          <Bg color="#22c55e" small>{consultorias.filter(c=>c.status==="closed").length} fechadas</Bg>
          <Btn small icon={Plus} onClick={()=>{setConsultorias(prev=>[...prev,{id:`cs${uid()}`,calEventId:null,client:"",date:new Date().toISOString(),time:"",phone:"",briefing:"",proposalValue:"",status:"scheduled",closer:"",sdr:"",notes:"",createdAt:new Date().toISOString()}]);}}>Adicionar Manual</Btn>
        </div>
      </div>
      {consultorias.length===0&&<div style={{textAlign:"center",padding:24,color:"#475569"}}><Phone size={28} color="#334155" style={{marginBottom:6}}/><div style={{fontSize:12}}>Nenhuma consultoria ainda. Crie um evento com "Consultoria" no título da agenda e ela aparece aqui automaticamente.</div></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:10}}>
        {consultorias.map(c => {
          const closer = getUser(c.closer);
          const statusColors = {scheduled:"#6366f1",done:"#3b82f6",proposal:"#f59e0b",closed:"#22c55e",lost:"#ef4444"};
          const statusLabels = {scheduled:"📞 Agendada",done:"✅ Realizada",proposal:"📋 Proposta",closed:"🎯 Fechada",lost:"❌ Perdida"};
          return <div key={c.id} style={{background:"#020617",border:`1px solid ${statusColors[c.status]||"#1e293b"}30`,borderRadius:10,padding:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <input type="text" defaultValue={c.client} onBlur={e=>setConsultorias(p=>p.map(x=>x.id!==c.id?x:{...x,client:e.target.value}))}
                placeholder="Nome do lead..." style={{background:"transparent",border:"none",color:"#e2e8f0",fontSize:14,fontWeight:700,outline:"none",flex:1,fontFamily:"inherit"}}/>
              <select value={c.status} onChange={e=>{
                const newSt=e.target.value;
                setConsultorias(p=>p.map(x=>x.id!==c.id?x:{...x,status:newSt}));
                if(newSt==="closed"&&c.client){sendTelegram(`🎯 Consultoria FECHADA: ${c.client} — R$${c.proposalValue||"?"}`);showToast(`🎯 Fechou! ${c.client}`);}
              }} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"2px 6px",color:statusColors[c.status],fontSize:10,fontWeight:700,fontFamily:"inherit"}}>
                {Object.entries(statusLabels).map(([k,v])=><option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
              <div>
                <label style={{fontSize:8,color:"#475569",textTransform:"uppercase"}}>Telefone</label>
                <input type="text" defaultValue={c.phone||""} onBlur={e=>setConsultorias(p=>p.map(x=>x.id!==c.id?x:{...x,phone:e.target.value}))}
                  placeholder="(11) 99999-9999" style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:5,padding:"4px 6px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:2}}/>
              </div>
              <div>
                <label style={{fontSize:8,color:"#475569",textTransform:"uppercase"}}>Valor Proposta (R$)</label>
                <input type="number" defaultValue={c.proposalValue||""} onBlur={e=>setConsultorias(p=>p.map(x=>x.id!==c.id?x:{...x,proposalValue:e.target.value}))}
                  placeholder="2000" style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:5,padding:"4px 6px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:2}}/>
              </div>
            </div>
            <div style={{marginBottom:6}}>
              <label style={{fontSize:8,color:"#475569",textTransform:"uppercase"}}>Closer</label>
              <select value={c.closer||""} onChange={e=>setConsultorias(p=>p.map(x=>x.id!==c.id?x:{...x,closer:e.target.value}))}
                style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:5,padding:"4px 6px",color:"#e2e8f0",fontSize:10,fontFamily:"inherit",boxSizing:"border-box",marginTop:2}}>
                <option value="">Selecione closer</option>
                {WAR_CLOSERS.map(id=><option key={id} value={id}>{getUser(id)?.name||id}</option>)}
              </select>
            </div>
            <div style={{marginBottom:6}}>
              <label style={{fontSize:8,color:"#475569",textTransform:"uppercase"}}>Briefing / Observações</label>
              <textarea defaultValue={c.briefing||""} onBlur={e=>setConsultorias(p=>p.map(x=>x.id!==c.id?x:{...x,briefing:e.target.value}))}
                placeholder="Dor do lead, como chegou, interesse..." style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:5,padding:"4px 6px",color:"#e2e8f0",fontSize:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:2,minHeight:40,resize:"vertical"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:9,color:"#475569"}}>{c.date?new Date(c.date).toLocaleDateString("pt-BR"):""}  {c.time||""}</span>
              <div style={{display:"flex",gap:4}}>
                {c.client&&<button onClick={()=>{
                  const dt = c.date ? new Date(c.date) : new Date();
                  const dateStr = dt.toISOString().split("T")[0];
                  const timeStr = c.time || "10:00";
                  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consultoria - ${encodeURIComponent(c.client)}&dates=${dateStr.replace(/-/g,"")}T${timeStr.replace(":","")}00/${dateStr.replace(/-/g,"")}T${String(Number(timeStr.split(":")[0])+1).padStart(2,"0")}${timeStr.split(":")[1]}00&details=${encodeURIComponent(`Tel: ${c.phone||""}\nBriefing: ${c.briefing||""}\nProposta: R$${c.proposalValue||"?"}\nCloser: ${getUser(c.closer)?.name||"?"}`)}`;
                  window.open(calUrl,"_blank");
                }} style={{background:"#3b82f620",border:"1px solid #3b82f640",borderRadius:5,padding:"2px 6px",fontSize:8,fontWeight:700,color:"#3b82f6",cursor:"pointer",display:"flex",alignItems:"center",gap:2}}>
                  <CalendarDays size={8}/> Criar na Agenda
                </button>}
                <button onClick={()=>{if(confirm("Remover esta consultoria?")){setConsultorias(p=>p.filter(x=>x.id!==c.id));}}}
                  style={{background:"none",border:"none",color:"#ef444480",cursor:"pointer",fontSize:9}}>remover</button>
              </div>
            </div>
          </div>;
        })}
      </div>
    </div>

    {/* ═══ MÉTRICAS MENSAIS POR CLOSER ═══ */}
    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginTop:16}}>
      <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}>
        <BarChart3 size={16} color="#f59e0b"/> Métricas Mensais por Closer — {new Date().toLocaleDateString("pt-BR",{month:"long",year:"numeric"})}
      </h3>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr style={{borderBottom:"2px solid #1e293b"}}>
          {["Closer","Calls Realizadas","Propostas Enviadas","R$ na Mesa","Vendas Fechadas","R$ Convertido","Taxa Conversão"].map(h=>
            <th key={h} style={{padding:"8px 10px",textAlign:"left",color:"#64748b",fontWeight:700,fontSize:10,textTransform:"uppercase"}}>{h}</th>
          )}
        </tr></thead>
        <tbody>
          {WAR_CLOSERS.map(cid=>{const u=getUser(cid);if(!u)return null;
            const myConsultorias = consultorias.filter(c=>c.closer===cid);
            const callsDone = myConsultorias.filter(c=>c.status!=="scheduled").length;
            const proposals = myConsultorias.filter(c=>c.status==="proposal");
            const proposalValue = proposals.reduce((s,c)=>s+Number(c.proposalValue||0),0);
            const closed = myConsultorias.filter(c=>c.status==="closed");
            const closedValue = closed.reduce((s,c)=>s+Number(c.proposalValue||0),0);
            const convRate = myConsultorias.length > 0 ? Math.round((closed.length / myConsultorias.length)*100) : 0;
            // Also count from warDeals
            const warCl = warClosed.filter(d=>d.closer===cid);
            const warClVal = warCl.reduce((s,d)=>s+d.value,0);
            const warPr = warProposals.filter(d=>d.closer===cid);
            const warPrVal = warPr.reduce((s,d)=>s+d.value,0);
            const totalClosed = closedValue + warClVal;
            const totalMesa = proposalValue + warPrVal;
            return <tr key={cid} style={{borderBottom:"1px solid #1e293b30"}}>
              <td style={{padding:"8px 10px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><Av i={u.avatar} c={ROLES[u.role?.toUpperCase()]?.color||"#6366f1"} s={24}/><span style={{fontWeight:600,color:"#e2e8f0"}}>{u.name}</span></div></td>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#6366f1"}}>{callsDone + warDeals.filter(d=>d.closer===cid&&d.status==="meeting").length}</td>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#f59e0b"}}>{proposals.length + warPr.length}</td>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#f59e0b"}}>R${totalMesa.toLocaleString("pt-BR")}</td>
              <td style={{padding:"8px 10px",fontWeight:700,color:"#22c55e"}}>{closed.length + warCl.length}</td>
              <td style={{padding:"8px 10px",fontWeight:800,color:"#22c55e"}}>R${totalClosed.toLocaleString("pt-BR")}</td>
              <td style={{padding:"8px 10px",fontWeight:700,color:convRate>=50?"#22c55e":convRate>=25?"#f59e0b":"#ef4444"}}>{convRate}%</td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  </div>;
  const WarDayModal = () => {
    const wdRefs = useRef({});
    const collectWarDeal = () => {
      const r = wdRefs.current;
      return {...warDeal, client:r.client?.value||warDeal.client, value:r.value?.value||warDeal.value, notes:r.notes?.value||warDeal.notes};
    };
    return <Modal open={showWarDeal} onClose={()=>setShowWarDeal(false)} title="🎯 War Day — Registrar Negócio">
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em"}}>Cliente / Lead</label>
        <input ref={el=>wdRefs.current.client=el} type="text" defaultValue={warDeal.client} onBlur={e=>setWarDeal(p=>({...p,client:e.target.value}))} placeholder="Nome do lead ou empresa" style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Sel label="Pacote" value={warDeal.package} onChange={v=>setWarDeal(p=>({...p,package:v,value:v==="pack1"?"2000":"4000"}))} options={[{value:"pack1",label:"Pacote 1 — R$2.000/mês"},{value:"pack2",label:"Pacote 2 — R$4.000/mês"}]}/>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em"}}>Valor (R$)</label>
          <input ref={el=>wdRefs.current.value=el} type="number" defaultValue={warDeal.value} onBlur={e=>setWarDeal(p=>({...p,value:e.target.value}))} placeholder="2000" style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Sel label="Closer (quem fecha)" value={warDeal.closer} onChange={v=>setWarDeal(p=>({...p,closer:v}))} options={[{value:"",label:"Selecione"},...WAR_CLOSERS.map(id=>({value:id,label:getUser(id)?.name||id}))]}/>
        <Sel label="SDR (quem prospectou)" value={warDeal.sdr} onChange={v=>setWarDeal(p=>({...p,sdr:v}))} options={[{value:"",label:"Selecione"},...WAR_SDRS.map(id=>({value:id,label:getUser(id)?.name||id}))]}/>
      </div>
      <Sel label="Status" value={warDeal.status} onChange={v=>setWarDeal(p=>({...p,status:v}))} options={[{value:"meeting",label:"📞 Call agendada"},{value:"proposal",label:"📋 Proposta enviada"},{value:"closed",label:"✅ Venda fechada"}]}/>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em"}}>Observações</label>
        <textarea ref={el=>wdRefs.current.notes=el} defaultValue={warDeal.notes} onBlur={e=>setWarDeal(p=>({...p,notes:e.target.value}))} placeholder="Lista origem, detalhes..." style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,resize:"vertical",minHeight:70,outline:"none",fontFamily:"inherit"}}/>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
      <Btn variant="secondary" onClick={()=>setShowWarDeal(false)}>Cancelar</Btn>
      <Btn onClick={()=>{const collected=collectWarDeal();setWarDeal(collected);setTimeout(addWarDeal,50);}} disabled={false} icon={Target}>Registrar</Btn>
    </div>
  </Modal>;
  };

  // Schedule Call Modal — creates in app + Google Calendar
  const scheduleCall = () => {
    if (!newCall.client) return;
    // Save to consultorias
    const consultoria = {
      id: `cs${uid()}`, calEventId: null,
      client: newCall.client, date: newCall.date ? new Date(newCall.date+"T"+newCall.time).toISOString() : new Date().toISOString(),
      time: newCall.time, phone: newCall.phone, briefing: newCall.briefing,
      proposalValue: newCall.proposalValue, status: "scheduled",
      closer: newCall.closer, sdr: newCall.sdr, notes: `Origem: ${newCall.source||"War Day"}`,
      createdAt: new Date().toISOString(),
    };
    setConsultorias(p => [...p, consultoria]);
    // Save to war deals
    setWarDeals(p => [...p, {
      id: `wd${uid()}`, calEventId: null,
      client: newCall.client, value: Number(newCall.proposalValue)||0, package: "pack1",
      closer: newCall.closer, sdr: newCall.sdr, status: "meeting",
      notes: `📞 ${newCall.phone||""} | ${newCall.briefing||""} | Origem: ${newCall.source||""}`,
      time: new Date().toISOString(),
    }]);
    // Notify
    const closerName = getUser(newCall.closer)?.name||"?";
    const sdrName = getUser(newCall.sdr)?.name||"?";
    showToast(`📞 Call agendada: ${newCall.client} — ${closerName} + ${sdrName}`);
    sendTelegram(`📞 *Call agendada*\n${newCall.client}\n📱 ${newCall.phone||"sem tel"}\n👤 Closer: ${closerName} | SDR: ${sdrName}\n📅 ${newCall.date||"hoje"} ${newCall.time}\n📋 ${newCall.briefing||"sem briefing"}`);
    setShowScheduleCall(false);
    setNewCall({client:"",phone:"",date:"",time:"10:00",duration:"60",closer:"",sdr:"",briefing:"",proposalValue:"",source:""});
  };

  const ScheduleCallModal = () => <Modal open={showScheduleCall} onClose={()=>setShowScheduleCall(false)} title="📞 Agendar Call — War Day / Vendas" wide>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Inp label="Nome do Lead / Empresa" value={newCall.client} onChange={v=>setNewCall({...newCall,client:v})} placeholder="Ex: João da Silva — Empresa XYZ"/>
        <Inp label="Telefone" value={newCall.phone} onChange={v=>setNewCall({...newCall,phone:v})} placeholder="(11) 99999-9999"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        <Inp label="Data" value={newCall.date} onChange={v=>setNewCall({...newCall,date:v})} type="date"/>
        <Inp label="Horário" value={newCall.time} onChange={v=>setNewCall({...newCall,time:v})} type="time"/>
        <Inp label="Duração (min)" value={newCall.duration} onChange={v=>setNewCall({...newCall,duration:v})} type="number"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <Sel label="Closer (quem fecha)" value={newCall.closer} onChange={v=>setNewCall({...newCall,closer:v})} options={[{value:"",label:"Selecione"},...WAR_CLOSERS.map(id=>({value:id,label:getUser(id)?.name||id}))]}/>
        <Sel label="SDR (quem prospectou)" value={newCall.sdr} onChange={v=>setNewCall({...newCall,sdr:v})} options={[{value:"",label:"Selecione"},...WAR_SDRS.map(id=>({value:id,label:getUser(id)?.name||id}))]}/>
      </div>
      <Inp label="Valor estimado da proposta (R$)" value={newCall.proposalValue} onChange={v=>setNewCall({...newCall,proposalValue:v})} type="number" placeholder="2000"/>
      <Sel label="Origem do lead" value={newCall.source} onChange={v=>setNewCall({...newCall,source:v})} options={[{value:"",label:"Selecione"},{value:"chinalink_cuiaba",label:"Evento Chinalink Cuiabá"},{value:"followup",label:"Follow-up pendente"},{value:"chinalink_leads",label:"Leads Chinalink recentes"},{value:"indicacao",label:"Indicação"},{value:"inbound",label:"Inbound (site/redes)"},{value:"outro",label:"Outro"}]}/>
      <Inp label="Briefing da call (dor do lead, interesse, observações)" value={newCall.briefing} onChange={v=>setNewCall({...newCall,briefing:v})} textarea placeholder="Ex: Dono de e-commerce, fatura R$50k/mês, quer escalar com tráfego pago..."/>
    </div>
    <div style={{background:"#14b8a610",border:"1px solid #14b8a630",borderRadius:8,padding:10,marginTop:12,fontSize:11,color:"#14b8a6"}}>
      💡 Ao agendar, a call será registrada no app (Pipeline de Consultorias + War Day) e você pode criar o evento na agenda clicando em "Criar na Agenda" depois.
    </div>
    <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
      <Btn variant="secondary" onClick={()=>setShowScheduleCall(false)}>Cancelar</Btn>
      <Btn onClick={scheduleCall} disabled={!newCall.client} icon={Phone}>Agendar Call</Btn>
    </div>
  </Modal>;

  const ReportsPage = () => <div style={{padding:20,maxWidth:1400,margin:"0 auto"}}>
    <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:"0 0 16px"}}>Relatórios</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10,marginBottom:20}}>
      <StatC label="Venda → Pgto" value="2.8d" icon={Clock} color="#6366f1" sub="Tempo médio"/>
      <StatC label="Pgto → Tráfego" value="38h" icon={Zap} color="#22c55e" sub="Tempo médio"/>
      <StatC label="Ativados 48h" value="75%" icon={CheckCircle2} color="#f59e0b"/>
      <StatC label="Novos/mês" value={clients.filter(c=>new Date(c.closedDate)>new Date(now-30*DAY)).length} icon={UserPlus} color="#8b5cf6"/>
      <StatC label="Receita Ativa" value={`R$${active.reduce((s,c)=>s+(c.contractValue||0),0).toLocaleString("pt-BR")}`} icon={DollarSign} color="#22c55e"/>
    </div>
    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
      <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#f1f5f9"}}>Performance por Responsável</h3>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
        <thead><tr style={{borderBottom:"1px solid #1e293b"}}>{["Responsável","Função","Clientes","Tarefas","Atrasadas"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:"#64748b",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
        <tbody>{SEED_USERS.map(u=>{const uT=tasks.filter(t=>t.assigneeId===u.id);const uC=clients.filter(c=>[c.csId,c.trafficId,c.socialId,c.designerId,c.filmmakerId].includes(u.id));const ov=uT.filter(t=>t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date()).length;return(
          <tr key={u.id} style={{borderBottom:"1px solid #1e293b30"}}>
            <td style={{padding:"8px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av i={u.avatar} c={ROLES[u.role.toUpperCase()]?.color} s={26}/><span style={{fontWeight:600,color:"#e2e8f0"}}>{u.name}</span></div></td>
            <td style={{padding:"8px 12px"}}><Bg color={ROLES[u.role.toUpperCase()]?.color} small>{ROLES[u.role.toUpperCase()]?.label}</Bg></td>
            <td style={{padding:"8px 12px",color:"#e2e8f0",fontWeight:600}}>{uC.length}</td>
            <td style={{padding:"8px 12px",color:"#e2e8f0"}}>{uT.length}</td>
            <td style={{padding:"8px 12px",color:ov>0?"#ef4444":"#64748b",fontWeight:ov>0?700:400}}>{ov}</td>
          </tr>
        );})}</tbody>
      </table>
    </div>
  </div>;

  // ═══ GRUPOS DE COMBATE PAGE ═══
  const GCPage = () => {
    const SALES_GOAL = 14000; // meta mensal por vendedor/closer
    const sellers = SEED_USERS.filter(u => ["sdr","commercial","closer"].includes(u.role) && !u.pending);
    
    const gcData = Object.values(GC_TEAMS).map(gc => {
      const members = SEED_USERS.filter(u => (u.gc === gc.id || u.gc === "BOTH") && !u.pending);
      const gcClients = clients.filter(c => {
        const assignedUsers = [c.csId, c.trafficId, c.socialId, c.designerId, c.filmmakerId, c.commercialId].filter(Boolean);
        return assignedUsers.some(uid => members.find(m => m.id === uid)) || c.gcTeam === gc.id;
      });
      const activeClients = gcClients.filter(c => !c.churning && !c.encerrado);
      const churned = gcClients.filter(c => c.churning);
      const faturamento = activeClients.reduce((sum, c) => sum + (c.contractValue || 0), 0);
      const churnValue = churned.reduce((sum, c) => sum + (c.contractValue || 0), 0);
      const gcTasks = tasks.filter(t => members.find(m => m.id === t.assigneeId));
      const overdue = gcTasks.filter(t => t.status !== "done" && t.dueDate && new Date(t.dueDate) < new Date());
      const gcSellers = sellers.filter(s => s.gc === gc.id);
      // Vendas do mês: clientes novos vendidos por SDRs deste GC
      const sellerSales = gcSellers.map(s => {
        const sold = clients.filter(c => c.soldBy === s.id && !c.churning && !c.encerrado);
        const totalSold = sold.reduce((sum, c) => sum + (c.contractValue || 0), 0);
        return { ...s, sold, totalSold, pct: Math.min((totalSold / SALES_GOAL) * 100, 100) };
      });
      const totalGCSales = sellerSales.reduce((sum, s) => sum + s.totalSold, 0);

      return { gc, members, activeClients, churned, faturamento, churnValue, gcTasks, overdue, gcSellers: sellerSales, totalGCSales };
    });

    return <div style={{padding:20,maxWidth:1400,margin:"0 auto"}}>
      <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:"0 0 16px"}}>Grupos de Combate</h1>
      
      {/* GC COMPARISON CARDS */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        {gcData.map(({gc, members, activeClients, churned, faturamento, churnValue, gcTasks, overdue, gcSellers, totalGCSales}) => (
          <div key={gc.id} style={{background:"#0f172a",border:`2px solid ${gc.color}40`,borderRadius:16,overflow:"hidden"}}>
            {/* HEADER */}
            <div style={{background:`linear-gradient(135deg,${gc.color}20,${gc.color}08)`,padding:"16px 20px",borderBottom:`1px solid ${gc.color}30`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:32}}>{gc.icon}</div>
                <div>
                  <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9"}}>{gc.name}</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>{gc.id} • {members.length} membros</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:24,fontWeight:800,color:gc.color}}>R${faturamento.toLocaleString("pt-BR")}</div>
                <div style={{fontSize:10,color:"#64748b"}}>Faturamento mensal ativo</div>
              </div>
            </div>

            {/* METRICS */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"14px 20px"}}>
              <div style={{textAlign:"center",background:"#020617",borderRadius:10,padding:10}}>
                <div style={{fontSize:22,fontWeight:800,color:"#22c55e"}}>{activeClients.length}</div>
                <div style={{fontSize:9,color:"#64748b"}}>Clientes Ativos</div>
              </div>
              <div style={{textAlign:"center",background:"#020617",borderRadius:10,padding:10}}>
                <div style={{fontSize:22,fontWeight:800,color:"#ef4444"}}>{churned.length}</div>
                <div style={{fontSize:9,color:"#64748b"}}>Churn</div>
              </div>
              <div style={{textAlign:"center",background:"#020617",borderRadius:10,padding:10}}>
                <div style={{fontSize:22,fontWeight:800,color:"#f59e0b"}}>{gcTasks.length}</div>
                <div style={{fontSize:9,color:"#64748b"}}>Tarefas</div>
              </div>
              <div style={{textAlign:"center",background:"#020617",borderRadius:10,padding:10}}>
                <div style={{fontSize:22,fontWeight:800,color:overdue.length>0?"#ef4444":"#22c55e"}}>{overdue.length}</div>
                <div style={{fontSize:9,color:"#64748b"}}>Atrasadas</div>
              </div>
            </div>

            {/* CHURN DETAIL */}
            {churned.length>0&&<div style={{padding:"0 20px 12px"}}>
              <div style={{background:"#ef444410",border:"1px solid #ef444420",borderRadius:10,padding:10}}>
                <div style={{fontSize:10,fontWeight:700,color:"#ef4444",marginBottom:4}}>Churn: R${churnValue.toLocaleString("pt-BR")} perdidos</div>
                <div style={{fontSize:10,color:"#fca5a5"}}>{churned.map(c=>c.company).join(", ")}</div>
              </div>
            </div>}

            {/* VENDEDORES / SDRs */}
            <div style={{padding:"0 20px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em",marginBottom:8}}>Vendas — Closers + SDRs — Meta R${(SALES_GOAL/1000).toFixed(0)}k/mês cada</div>
              {gcSellers.length===0&&<div style={{fontSize:11,color:"#475569",padding:8}}>Nenhum vendedor neste GC</div>}
              {gcSellers.map(s => (
                <div key={s.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:"1px solid #1e293b20"}}>
                  <Av i={s.avatar} c={ROLES[s.role?.toUpperCase()]?.color||"#14b8a6"} s={32}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{s.name}</span>
                      <span style={{fontSize:12,fontWeight:800,color:s.pct>=100?"#22c55e":s.pct>=70?"#f59e0b":"#ef4444"}}>
                        R${s.totalSold.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
                      <div style={{flex:1}}><PB v={s.totalSold} m={SALES_GOAL} c={s.pct>=100?"#22c55e":s.pct>=70?"#f59e0b":"#ef4444"} h={5}/></div>
                      <span style={{fontSize:10,fontWeight:700,color:s.pct>=100?"#22c55e":"#94a3b8",whiteSpace:"nowrap"}}>{Math.round(s.pct)}%</span>
                    </div>
                    <div style={{fontSize:9,color:"#64748b",marginTop:2}}>{s.sold.length} venda{s.sold.length!==1?"s":""}{s.sold.length>0?`: ${s.sold.map(c=>c.company).join(", ")}`:""}</div>
                  </div>
                </div>
              ))}
              {gcSellers.length>0&&<div style={{marginTop:6,fontSize:11,fontWeight:700,color:gc.color,display:"flex",justifyContent:"space-between"}}>
                <span>Total vendas {gc.id}:</span>
                <span>R${totalGCSales.toLocaleString("pt-BR")}</span>
              </div>}
            </div>

            {/* MEMBROS */}
            <div style={{padding:"0 20px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em"}}>Membros</div>
                <button onClick={()=>setPage("team")} style={{background:"none",border:"none",color:"#6366f1",cursor:"pointer",fontSize:10,fontWeight:600}}>Editar equipe →</button>
              </div>
              {/* HEAD DE TRÁFEGO */}
              {members.filter(m=>m.role==="head_traffic").map(m=>{const role=ROLES.HEAD_TRAFFIC;return(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,background:`${role.color}10`,border:`1px solid ${role.color}30`,borderRadius:10,padding:"8px 10px",marginBottom:6}}>
                  <Av i={m.avatar} c={role.color} s={28}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:800,color:"#f1f5f9"}}>{m.name}</div>
                    <div style={{fontSize:9,color:role.color,fontWeight:700}}>⭐ {role.label}</div>
                  </div>
                </div>
              );})}
              {/* OUTROS MEMBROS */}
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {members.filter(m=>m.role!=="head_traffic").map(m=>{const role=ROLES[m.role?.toUpperCase()];const isShared=m.gc==="BOTH";return(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:4,background:isShared?"#6366f108":"#020617",padding:"4px 8px 4px 4px",borderRadius:12,border:isShared?"1px solid #6366f120":"none"}}>
                    <Av i={m.avatar} c={role?.color||"#64748b"} s={22}/>
                    <div>
                      <div style={{fontSize:10,fontWeight:600,color:"#e2e8f0"}}>{m.name}{isShared?" 🔗":""}</div>
                      <div style={{fontSize:8,color:isShared?"#6366f1":"#64748b"}}>{role?.label||m.role}{isShared?" (ambos GCs)":""}</div>
                    </div>
                  </div>
                );})}
              </div>
            </div>

            {/* TOP CLIENTES */}
            <div style={{padding:"0 20px 16px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em",marginBottom:6}}>Top 5 Clientes por Valor</div>
              {activeClients.sort((a,b)=>(b.contractValue||0)-(a.contractValue||0)).slice(0,5).map(c=>(
                <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid #1e293b15"}}>
                  <span style={{fontSize:11,color:"#e2e8f0",fontWeight:500}}>{c.company}</span>
                  <span style={{fontSize:11,fontWeight:700,color:gc.color}}>R${(c.contractValue||0).toLocaleString("pt-BR")}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* COMPARATIVO GERAL */}
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,padding:20}}>
        <h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#f1f5f9"}}>Comparativo Geral</h3>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid #1e293b"}}>
            {["Métrica",...gcData.map(g=>g.gc.icon+" "+g.gc.name),"Total"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:"#64748b",fontWeight:700,fontSize:11}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[
              {label:"Clientes Ativos",vals:gcData.map(g=>g.activeClients.length),fmt:v=>v},
              {label:"Faturamento Ativo",vals:gcData.map(g=>g.faturamento),fmt:v=>`R$${v.toLocaleString("pt-BR")}`},
              {label:"Clientes Churn",vals:gcData.map(g=>g.churned.length),fmt:v=>v,warn:true},
              {label:"Valor Churn",vals:gcData.map(g=>g.churnValue),fmt:v=>`R$${v.toLocaleString("pt-BR")}`,warn:true},
              {label:"Tarefas Ativas",vals:gcData.map(g=>g.gcTasks.length),fmt:v=>v},
              {label:"Tarefas Atrasadas",vals:gcData.map(g=>g.overdue.length),fmt:v=>v,warn:true},
              {label:"Vendas (SDRs)",vals:gcData.map(g=>g.totalGCSales),fmt:v=>`R$${v.toLocaleString("pt-BR")}`},
              {label:"Ticket Médio",vals:gcData.map(g=>g.activeClients.length?Math.round(g.faturamento/g.activeClients.length):0),fmt:v=>`R$${v.toLocaleString("pt-BR")}`},
            ].map(row=>(
              <tr key={row.label} style={{borderBottom:"1px solid #1e293b30"}}>
                <td style={{padding:"8px 12px",fontWeight:600,color:"#e2e8f0"}}>{row.label}</td>
                {row.vals.map((v,i)=><td key={i} style={{padding:"8px 12px",fontWeight:700,color:row.warn&&v>0?"#ef4444":gcData[i].gc.color}}>{row.fmt(v)}</td>)}
                <td style={{padding:"8px 12px",fontWeight:800,color:"#f1f5f9"}}>{row.fmt(row.vals.reduce((a,b)=>a+b,0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>;
  };

  const TeamPage = () => <div style={{padding:20,maxWidth:1200,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:0}}>Equipe ({SEED_USERS.filter(u=>!u.pending).length} ativos • {SEED_USERS.filter(u=>u.pending).length} vagas)</h1>
      <Btn onClick={()=>setShowInviteModal(true)} icon={UserPlus} small>Convidar</Btn>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
      {SEED_USERS.map(u=>{const role=ROLES[u.role?.toUpperCase()];const gc=GC_TEAMS[u.gc];const uT=tasks.filter(t=>t.assigneeId===u.id);const uC=clients.filter(c=>[c.csId,c.trafficId,c.socialId,c.designerId,c.filmmakerId,c.commercialId].includes(u.id));const isPending=u.pending;return(
        <div key={u.id} style={{background:"#0f172a",border:`1px solid ${isPending?"#f59e0b30":"#1e293b"}`,borderRadius:12,padding:16,opacity:isPending?.65:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <Av i={u.avatar} c={role?.color||"#64748b"} s={44}/>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:isPending?"#f59e0b":"#f1f5f9"}}>{u.name}{isPending?" ⏳":""}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}>
                  <Bg color={role?.color||"#64748b"} small>{role?.label||u.role}</Bg>
                  {gc&&<Bg color={gc.color} small>{gc.icon}</Bg>}
                </div>
              </div>
            </div>
            <button onClick={()=>{
              const authU = authorizedUsers.find(a => a.email === u.email) || {name:u.name,email:u.email,role:u.role,gc:u.gc,id:u.id};
              setEditingUser(authU);
              setShowEditUser(true);
            }} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#94a3b8",flexShrink:0}}>
              <Edit3 size={13}/>
            </button>
          </div>
          {!isPending&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <div style={{textAlign:"center",padding:6,background:"#020617",borderRadius:8}}><div style={{fontSize:16,fontWeight:800,color:"#e2e8f0"}}>{uC.length}</div><div style={{fontSize:9,color:"#64748b"}}>Clientes</div></div>
            <div style={{textAlign:"center",padding:6,background:"#020617",borderRadius:8}}><div style={{fontSize:16,fontWeight:800,color:"#e2e8f0"}}>{uT.length}</div><div style={{fontSize:9,color:"#64748b"}}>Tarefas</div></div>
            <div style={{textAlign:"center",padding:6,background:"#020617",borderRadius:8}}><div style={{fontSize:16,fontWeight:800,color:uT.filter(t=>t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date()).length>0?"#ef4444":"#e2e8f0"}}>{uT.filter(t=>t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date()).length}</div><div style={{fontSize:9,color:"#64748b"}}>Atrasadas</div></div>
          </div>}
          {isPending&&<div style={{textAlign:"center",padding:12,background:"#f59e0b08",borderRadius:8,border:"1px dashed #f59e0b30"}}>
            <div style={{fontSize:11,color:"#f59e0b",fontWeight:600}}>Vaga aberta</div>
            <div style={{fontSize:10,color:"#64748b",marginTop:2}}>Clique em ✏️ para preencher nome, email e GC</div>
          </div>}
        </div>
      );})}
    </div>

    {/* ═══ DISTRIBUIÇÃO SOCIAL MEDIA — drag & drop + prioridade ═══ */}
    <div style={{marginTop:20}}>
      <h2 style={{fontSize:16,fontWeight:800,color:"#ec4899",margin:"0 0 4px",display:"flex",alignItems:"center",gap:6}}>
        <Image size={18}/> Distribuição Social Media — Clientes por Pessoa
      </h2>
      <div style={{fontSize:11,color:"#64748b",marginBottom:12}}>Arraste os clientes entre os cards para redistribuir. Clique na bolinha de prioridade para alterar.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:12}}>
        {SEED_USERS.filter(u=>u.role==="social"&&!u.pending).map(sm => {
          const smClients = clients.filter(c=>c.socialId===sm.id&&!c.archived&&!c.churning&&!c.encerrado);
          const briefingDone = smClients.filter(c=>c.socialBriefing&&c.socialBriefing.every(b=>b.done)).length;
          const gc = GC_TEAMS[sm.gc];
          return <div key={sm.id}
            onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#ec4899";}}
            onDragLeave={e=>{e.currentTarget.style.borderColor="#ec489930";}}
            onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor="#ec489930";if(draggedId){setClients(p=>p.map(c=>c.id!==draggedId?c:{...c,socialId:sm.id,timeline:[...c.timeline,{date:new Date().toISOString(),event:`Social Media alterada → ${sm.name}`,user:authUser?.name||"Thomas"}]}));showToast(`📱 ${clients.find(c=>c.id===draggedId)?.company} → ${sm.name}`);sendTelegram(`📱 Redistribuição SM: ${clients.find(c=>c.id===draggedId)?.company} → ${sm.name}`);setDraggedId(null);}}}
            style={{background:"#0f172a",border:"2px solid #ec489930",borderRadius:12,overflow:"hidden",transition:"border-color .2s"}}>
            <div style={{background:"linear-gradient(135deg,#ec489915,#ec489908)",padding:"12px 14px",borderBottom:"1px solid #ec489920",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Av i={sm.avatar} c="#ec4899" s={36}/>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9"}}>{sm.name}</div>
                  <div style={{display:"flex",gap:4}}><Bg color="#ec4899" small>Social Media</Bg>{gc&&<Bg color={gc.color} small>{gc.icon} {gc.id}</Bg>}</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:20,fontWeight:800,color:"#ec4899"}}>{smClients.length}</div>
                <div style={{fontSize:9,color:"#64748b"}}>clientes</div>
              </div>
            </div>
            <div style={{padding:"8px 14px",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #1e293b"}}>
              <span style={{fontSize:10,color:"#64748b"}}>Briefings:</span>
              <div style={{flex:1}}><PB v={briefingDone} m={smClients.length||1} c="#ec4899" h={4}/></div>
              <span style={{fontSize:10,fontWeight:700,color:briefingDone===smClients.length&&smClients.length>0?"#22c55e":"#f59e0b"}}>{briefingDone}/{smClients.length}</span>
            </div>
            <div style={{padding:8,minHeight:60,maxHeight:350,overflowY:"auto"}}>
              {smClients.length===0&&<div style={{padding:20,textAlign:"center",color:"#475569",fontSize:11,border:"2px dashed #334155",borderRadius:8}}>Solte clientes aqui para atribuir a {sm.name}</div>}
              {smClients.map(c => {
                const hasBriefing = c.socialBriefing && c.socialBriefing.length > 0;
                const briefingPct = hasBriefing ? Math.round((c.socialBriefing.filter(b=>b.done).length / c.socialBriefing.length)*100) : 0;
                const prio = PRIORITIES[c.priority];
                const prioOrder = ["low","medium","high","urgent"];
                const cyclePrio = () => {
                  const idx = prioOrder.indexOf(c.priority||"medium");
                  const next = prioOrder[(idx+1)%prioOrder.length];
                  setClients(p=>p.map(x=>x.id!==c.id?x:{...x,priority:next}));
                };
                return <div key={c.id} draggable
                  onDragStart={e=>{setDraggedId(c.id);e.dataTransfer.effectAllowed="move";}}
                  onDragEnd={()=>setDraggedId(null)}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",borderRadius:8,marginBottom:3,background:draggedId===c.id?"#1e293b":"#020617",border:`1px solid ${draggedId===c.id?"#ec4899":"#1e293b"}`,cursor:"grab",opacity:draggedId===c.id?.5:1,transition:"opacity .2s"}}>
                  {/* Priority dot — click to cycle */}
                  <button onClick={e=>{e.stopPropagation();cyclePrio();}} title={`Prioridade: ${prio?.label||"Média"} — clique para alterar`}
                    style={{width:14,height:14,borderRadius:"50%",background:prio?.color||"#eab308",border:"2px solid "+((prio?.color||"#eab308")+"80"),cursor:"pointer",flexShrink:0,padding:0}}/>
                  <Av i={(c.company||"??").slice(0,2).toUpperCase()} c={KANBAN_COLUMNS.find(k=>k.id===c.status)?.color||"#64748b"} s={24}/>
                  <div style={{flex:1,minWidth:0}} onClick={()=>openClient(c.id)}>
                    <div style={{fontSize:11,fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}}>{c.company}</div>
                    <div style={{fontSize:8,color:"#64748b"}}>{c.service?.substring(0,35)}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:3}}>
                    <Bg color={prio?.color||"#eab308"} small>{prio?.label||"Média"}</Bg>
                    {briefingPct===100&&<CheckCircle2 size={11} color="#22c55e"/>}
                    {briefingPct>0&&briefingPct<100&&<span style={{fontSize:8,fontWeight:700,color:"#f59e0b"}}>{briefingPct}%</span>}
                    {briefingPct===0&&hasBriefing&&<AlertCircle size={11} color="#ef4444"/>}
                  </div>
                </div>;
              })}
            </div>
          </div>;
        })}

        {/* Sem social media atribuída — also a drop target */}
        {(()=>{
          const unassigned = clients.filter(c=>!c.socialId&&!c.archived&&!c.churning&&!c.encerrado&&(c.service?.toLowerCase().includes("social")||c.service?.toLowerCase().includes("tudo")||c.service?.toLowerCase().includes("naming")));
          return <div
            onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#ef4444";}}
            onDragLeave={e=>{e.currentTarget.style.borderColor="#ef444440";}}
            onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor="#ef444440";if(draggedId){setClients(p=>p.map(c=>c.id!==draggedId?c:{...c,socialId:null}));setDraggedId(null);}}}
            style={{background:"#0f172a",border:"2px dashed #ef444440",borderRadius:12,overflow:"hidden",transition:"border-color .2s"}}>
            <div style={{background:"#ef444410",padding:"12px 14px",borderBottom:"1px solid #ef444420",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚠️</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#ef4444"}}>Sem Social Media</div>
                  <div style={{fontSize:10,color:"#fca5a5"}}>Arraste para cá para desatribuir</div>
                </div>
              </div>
              <div style={{fontSize:20,fontWeight:800,color:"#ef4444"}}>{unassigned.length}</div>
            </div>
            <div style={{padding:8,minHeight:60,maxHeight:350,overflowY:"auto"}}>
              {unassigned.length===0&&<div style={{padding:20,textAlign:"center",color:"#475569",fontSize:11,border:"2px dashed #334155",borderRadius:8}}>Todos atribuídos ✅</div>}
              {unassigned.map(c => {
                const prio = PRIORITIES[c.priority];
                return <div key={c.id} draggable
                  onDragStart={e=>{setDraggedId(c.id);e.dataTransfer.effectAllowed="move";}}
                  onDragEnd={()=>setDraggedId(null)}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",borderRadius:8,marginBottom:3,background:"#020617",border:"1px solid #ef444420",cursor:"grab",opacity:draggedId===c.id?.5:1}}>
                  <button onClick={e=>{e.stopPropagation();const o=["low","medium","high","urgent"];const i=o.indexOf(c.priority||"medium");setClients(p=>p.map(x=>x.id!==c.id?x:{...x,priority:o[(i+1)%o.length]}));}}
                    style={{width:14,height:14,borderRadius:"50%",background:prio?.color||"#eab308",border:"2px solid "+((prio?.color||"#eab308")+"80"),cursor:"pointer",flexShrink:0,padding:0}}/>
                  <Av i={(c.company||"??").slice(0,2).toUpperCase()} c="#ef4444" s={24}/>
                  <div style={{flex:1}} onClick={()=>openClient(c.id)}>
                    <div style={{fontSize:11,fontWeight:600,color:"#fca5a5",cursor:"pointer"}}>{c.company}</div>
                    <div style={{fontSize:8,color:"#64748b"}}>{c.service?.substring(0,35)}</div>
                  </div>
                  <Bg color={prio?.color||"#eab308"} small>{prio?.label||"Média"}</Bg>
                </div>;
              })}
            </div>
          </div>;
        })()}
      </div>
    </div>
  </div>;

  const SettingsPage = () => <div style={{padding:20,maxWidth:900,margin:"0 auto"}}>
    <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:"0 0 16px"}}>Configurações</h1>

    {/* User Management */}
    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h3 style={{margin:0,fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}><Shield size={14} color="#6366f1"/> Usuários e Permissões</h3>
        <Btn onClick={()=>setShowInviteModal(true)} icon={UserPlus} small>Convidar Colaborador</Btn>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"1px solid #1e293b"}}>
            {["Usuário","Email","Função","GC","Status","Ações"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",color:"#64748b",fontWeight:600,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {authorizedUsers.map(u=>{const role=ROLES[u.role?.toUpperCase()];const gc=GC_TEAMS[u.gc];const isPending=u.name?.includes("(nov")||u.avatar==="??";return(
              <tr key={u.email} style={{borderBottom:"1px solid #1e293b30",opacity:isPending?.6:1}}>
                <td style={{padding:"8px 10px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av i={u.avatar||"??"} c={role?.color||"#64748b"} s={28}/><span style={{fontWeight:600,color:isPending?"#f59e0b":"#e2e8f0"}}>{u.name}{isPending?" ⏳":""}</span></div></td>
                <td style={{padding:"8px 10px",color:"#94a3b8"}}>{u.email}</td>
                <td style={{padding:"8px 10px"}}><Bg color={role?.color||"#64748b"} small>{role?.label||u.role}</Bg></td>
                <td style={{padding:"8px 10px"}}>{gc?<Bg color={gc.color} small>{gc.icon} {gc.name}</Bg>:<span style={{color:"#475569",fontSize:11}}>—</span>}</td>
                <td style={{padding:"8px 10px"}}><Bg color={isPending?"#f59e0b":u.status==="active"?"#22c55e":"#3b82f6"} small>{isPending?"Vaga aberta":u.status==="active"?"Ativo":"Convidado"}</Bg></td>
                <td style={{padding:"8px 10px"}}><div style={{display:"flex",gap:4}}>
                  <button onClick={()=>{setEditingUser({...u});setShowEditUser(true);}} style={{background:"none",border:"none",color:"#6366f1",cursor:"pointer",fontSize:11,fontWeight:600}}>Editar</button>
                  {u.email!=="thomas98macedo@gmail.com"&&u.email!=="cltmkt2@gmail.com"&&<button onClick={()=>handleRemoveUser(u.email)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:11,fontWeight:600}}>Remover</button>}
                </div></td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>

    {/* Current Session */}
    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:12}}>
      <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}><Key size={14} color="#22c55e"/> Sessão Atual</h3>
      {authUser&&<div style={{display:"flex",alignItems:"center",gap:12}}>
        <Av i={authUser.avatar||"??"} c="#6366f1" s={40}/>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{authUser.name}</div>
          <div style={{fontSize:11,color:"#94a3b8"}}>{authUser.email} • {ROLES[authUser.role?.toUpperCase()]?.label}</div>
          {authUser.lastLogin&&<div style={{fontSize:10,color:"#64748b"}}>Último login: {fmtTime(authUser.lastLogin)}</div>}
        </div>
        <Btn onClick={handleLogout} variant="danger" small icon={LogOut}>Sair</Btn>
      </div>}
    </div>

    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:12}}>
      <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}><Wifi size={14} color={calSynced?"#22c55e":"#f59e0b"}/> Google Calendar {calSynced?"— Tempo Real":"— Estático"}</h3>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>Calendário pessoal: <strong style={{color:"#e2e8f0"}}>thomas98macedo@gmail.com</strong></div>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>Calendário da agência: <strong style={{color:"#e2e8f0"}}>cltmkt2@gmail.com</strong></div>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:4}}>Sync: <strong style={{color:calSynced?"#22c55e":"#f59e0b"}}>{calSynced?`Live — atualiza a cada 30s — ${calEvents.length} eventos carregados`:"Usando dados offline. Faça login com Google para sincronizar em tempo real."}</strong></div>
      {calLastFetch&&<div style={{fontSize:11,color:"#64748b",marginBottom:8}}>Última busca: {new Date(calLastFetch).toLocaleString("pt-BR")}</div>}
      <div style={{marginTop:12,display:"flex",gap:8}}>
        {googleAccessToken?<Btn icon={CheckCircle2} small variant="success">Conectado ✓</Btn>:<Btn icon={Zap} small onClick={handleGoogleSignIn}>Conectar Google Calendar</Btn>}
        {googleAccessToken&&<Btn icon={RefreshCw} small variant="secondary" onClick={()=>fetchGoogleCalendarEvents(googleAccessToken)}>Forçar Sync</Btn>}
      </div>
    </div>

    {/* TELEGRAM BOT */}
    <div style={{background:"#0f172a",border:`1px solid ${telegramConfig.enabled?"#0ea5e930":"#1e293b"}`,borderRadius:12,padding:16,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h3 style={{margin:0,fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}>
          <SendIcon size={14} color="#0ea5e9"/> Telegram Bot — Notificações no Grupo
        </h3>
        <button onClick={()=>setTelegramConfig(p=>({...p,enabled:!p.enabled}))}
          style={{background:telegramConfig.enabled?"#22c55e":"#334155",border:"none",borderRadius:12,width:44,height:24,cursor:"pointer",position:"relative",transition:"background .2s"}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:telegramConfig.enabled?23:3,transition:"left .2s"}}/>
        </button>
      </div>
      {telegramConfig.enabled ? <>
        <div style={{fontSize:11,color:"#94a3b8",marginBottom:12,lineHeight:1.6}}>
          Toda movimentação do Kanban e nova venda será enviada automaticamente no grupo do Telegram.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:"#64748b",textTransform:"uppercase",display:"block",marginBottom:4}}>Bot Token</label>
            <input type="text" value={telegramConfig.botToken} onChange={e=>setTelegramConfig(p=>({...p,botToken:e.target.value}))}
              placeholder="123456:ABC-DEF..." style={{width:"100%",background:"#020617",border:"1px solid #334155",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:11,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}/>
          </div>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:"#64748b",textTransform:"uppercase",display:"block",marginBottom:4}}>Chat ID do Grupo</label>
            <input type="text" value={telegramConfig.chatId} onChange={e=>setTelegramConfig(p=>({...p,chatId:e.target.value}))}
              placeholder="-100123456789" style={{width:"100%",background:"#020617",border:"1px solid #334155",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:11,outline:"none",fontFamily:"monospace",boxSizing:"border-box"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <Btn small variant="secondary" icon={SendIcon} onClick={()=>sendTelegram("✅ Teste de conexão — AgênciaOS está conectado!")}>Testar Envio</Btn>
          {telegramConfig.botToken&&telegramConfig.chatId&&<Bg color="#22c55e" small>Configurado ✓</Bg>}
        </div>

        {/* RESUMO DIÁRIO */}
        <div style={{background:"#020617",border:"1px solid #1e293b",borderRadius:10,padding:12,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:4}}>
              <Clock size={12} color="#f59e0b"/> Resumo Diário Automático
            </div>
            <Btn small icon={SendIcon} onClick={sendDailySummary}>Enviar Resumo Agora</Btn>
          </div>
          <div style={{fontSize:10,color:"#94a3b8",marginBottom:8}}>
            Todo dia às {telegramConfig.summaryHour||18}:{String(telegramConfig.summaryMin||0).padStart(2,"0")}h o bot envia automaticamente no grupo: tarefas por pessoa, concluídas, atrasadas e resumo geral.
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <label style={{fontSize:10,color:"#64748b"}}>Horário:</label>
            <select value={telegramConfig.summaryHour||18} onChange={e=>setTelegramConfig(p=>({...p,summaryHour:parseInt(e.target.value)}))}
              style={{background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"4px 8px",color:"#e2e8f0",fontSize:11,fontFamily:"inherit"}}>
              {Array.from({length:24},(_,i)=>i).map(h=><option key={h} value={h}>{String(h).padStart(2,"0")}h</option>)}
            </select>
            <span style={{color:"#475569"}}>:</span>
            <select value={telegramConfig.summaryMin||0} onChange={e=>setTelegramConfig(p=>({...p,summaryMin:parseInt(e.target.value)}))}
              style={{background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"4px 8px",color:"#e2e8f0",fontSize:11,fontFamily:"inherit"}}>
              {[0,15,30,45].map(m=><option key={m} value={m}>{String(m).padStart(2,"0")}</option>)}
            </select>
          </div>
        </div>
        <div style={{background:"#020617",border:"1px solid #1e293b",borderRadius:10,padding:12}}>
          <div style={{fontSize:11,fontWeight:700,color:"#f59e0b",marginBottom:6}}>📋 Como configurar (2 minutos):</div>
          <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.8}}>
            <strong style={{color:"#e2e8f0"}}>1.</strong> Abra o Telegram → pesquise <strong style={{color:"#0ea5e9"}}>@BotFather</strong><br/>
            <strong style={{color:"#e2e8f0"}}>2.</strong> Envie <strong style={{color:"#22c55e"}}>/newbot</strong> → dê um nome (ex: "Lince Bot") → dê um username (ex: "lince_agencia_bot")<br/>
            <strong style={{color:"#e2e8f0"}}>3.</strong> O BotFather vai te dar um <strong style={{color:"#f59e0b"}}>Token</strong> — cole acima<br/>
            <strong style={{color:"#e2e8f0"}}>4.</strong> Crie um <strong style={{color:"#e2e8f0"}}>grupo no Telegram</strong> com sua equipe → adicione o bot ao grupo<br/>
            <strong style={{color:"#e2e8f0"}}>5.</strong> Envie qualquer mensagem no grupo, depois acesse:<br/>
            <span style={{fontFamily:"monospace",fontSize:10,color:"#6366f1"}}>https://api.telegram.org/bot[TOKEN]/getUpdates</span><br/>
            <strong style={{color:"#e2e8f0"}}>6.</strong> Procure o <strong style={{color:"#f59e0b"}}>chat.id</strong> (número negativo tipo -100...) — cole acima<br/>
            <strong style={{color:"#e2e8f0"}}>7.</strong> Clique <strong style={{color:"#22c55e"}}>"Testar Envio"</strong> — se chegou no grupo, está pronto!
          </div>
        </div>
      </> : <div style={{fontSize:11,color:"#64748b"}}>Ative para enviar notificações automáticas no Telegram da equipe.</div>}
    </div>

    {/* GOOGLE SHEETS SYNC */}
    <div style={{background:"#0f172a",border:`1px solid ${sheetSyncStatus==="synced"?"#22c55e30":"#1e293b"}`,borderRadius:12,padding:16,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h3 style={{margin:0,fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}>
          <Layers size={14} color="#22c55e"/> Google Sheets — Planilha de Clientes
        </h3>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          {sheetSyncStatus==="synced"&&<Bg color="#22c55e" small>Sincronizado ✓</Bg>}
          {sheetSyncStatus==="syncing"&&<Bg color="#f59e0b" small><Loader2 size={9}/> Sincronizando...</Bg>}
          {sheetSyncStatus==="error"&&<Bg color="#ef4444" small>Erro</Bg>}
        </div>
      </div>
      <div style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>
        Conectado à planilha <strong style={{color:"#e2e8f0"}}>"CONTROLE DE VENDAS / CHURNING"</strong> — sincroniza automaticamente a cada 5 minutos.
      </div>
      <div style={{fontSize:10,color:"#64748b",marginBottom:8}}>
        Se um cliente novo aparecer na planilha → entra no app automaticamente.<br/>
        Se um cliente mudar para CHURNING na planilha → atualiza no app.<br/>
        Valores atualizados na planilha → refletem no app.
      </div>
      {lastSheetSync&&<div style={{fontSize:10,color:"#64748b",marginBottom:8}}>Última sync: {new Date(lastSheetSync).toLocaleString("pt-BR")}</div>}
      <div style={{display:"flex",gap:8}}>
        <Btn small icon={RefreshCw} onClick={syncFromSheet} disabled={sheetSyncStatus==="syncing"}>Sincronizar Agora</Btn>
        <a href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:8,fontSize:11,fontWeight:600,color:"#94a3b8",background:"#1e293b",border:"1px solid #334155",textDecoration:"none"}}><ExternalLink size={10}/> Abrir Planilha</a>
      </div>
    </div>

    {/* FIREBASE REALTIME DATABASE */}
    <div style={{background:"#0f172a",border:`1px solid ${firebaseConnected?"#22c55e30":"#ef444430"}`,borderRadius:12,padding:16,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h3 style={{margin:0,fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}>
          {firebaseConnected?<Wifi size={14} color="#22c55e"/>:<WifiOff size={14} color="#ef4444"/>}
          Firebase — {firebaseConnected?"Conectado":"Desconectado"}
        </h3>
        <Bg color={firebaseConnected?"#22c55e":"#ef4444"} small>{firebaseConnected?"Live ✓":"Offline"}</Bg>
      </div>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>
        <strong style={{color:"#e2e8f0"}}>URL:</strong> {FIREBASE_URL}<br/>
        <strong style={{color:"#e2e8f0"}}>Dados:</strong> clients, tasks, notifications, warDeals, consultorias
      </div>
      {firebaseConnected&&<div style={{fontSize:11,color:"#22c55e",marginBottom:8}}>✅ Sync ativo — mudanças aparecem para todos em tempo real.</div>}
      <div style={{display:"flex",gap:8}}>
        <Btn small icon={RefreshCw} onClick={()=>{firebaseGet("clients").then(d=>{if(d){setFirebaseConnected(true);showToast("✅ Firebase OK");}}).catch(()=>showToast("❌ Offline"));}}>Testar</Btn>
        <Btn small variant="secondary" icon={Upload} onClick={()=>{if(confirm("Enviar dados para Firebase?")){Promise.all([firebasePut("clients",clients),firebasePut("tasks",tasks),firebasePut("notifications",notifications),firebasePut("warDeals",warDeals),firebasePut("consultorias",consultorias),firebasePut("authorizedUsers",authorizedUsers)]).then(()=>{showToast("✅ Upload OK");setFirebaseConnected(true);}).catch(e=>showToast("❌ "+e.message));}}}>Upload para Firebase</Btn>
      </div>
    </div>

    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:12}}>
      <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Armazenamento</h3>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>Firebase (compartilhado) + localStorage (cache).</div>
      <div style={{display:"flex",gap:8}}>
        <Btn onClick={async()=>{if(confirm("Resetar TUDO? Afeta todos os usuários.")){try{["agos-clients","agos-tasks","agos-notifs","agos-warday","agos-consultorias"].forEach(k=>localStorage.removeItem(k));setClients(DEFAULT_CLIENTS);setTasks(DEFAULT_TASKS);setNotifications([]);setWarDeals([]);setConsultorias([]);await firebasePut("clients",DEFAULT_CLIENTS);await firebasePut("tasks",DEFAULT_TASKS);await firebasePut("notifications",[]);await firebasePut("warDeals",[]);await firebasePut("consultorias",[]);showToast("🔄 Resetado");}catch(e){}}}} variant="danger" small icon={RotateCcw}>Resetar Tudo</Btn>
        <Btn onClick={()=>{["agos-clients","agos-tasks","agos-notifs"].forEach(k=>localStorage.removeItem(k));setClients(DEFAULT_CLIENTS);setTasks(DEFAULT_TASKS);setNotifications([]);}} variant="secondary" small icon={RotateCcw}>Só Local</Btn>
      </div>
    </div>

    {/* ARCHIVED CLIENTS */}
    {clients.filter(c=>c.archived).length > 0 && (
    <div style={{background:"#0f172a",border:"1px solid #f59e0b20",borderRadius:12,padding:16,marginBottom:12}}>
      <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}>
        <Download size={14} color="#f59e0b"/> Clientes Arquivados ({clients.filter(c=>c.archived).length})
      </h3>
      <div style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>Clientes que foram arquivados. Clique em "Reativar" para trazer de volta ao Kanban.</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {clients.filter(c=>c.archived).map(c => {
          const col = KANBAN_COLUMNS.find(k=>k.id===c.status);
          return <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#020617",border:"1px solid #1e293b",borderRadius:10}}>
            <Av i={(c.company||"??").slice(0,2).toUpperCase()} c="#64748b" s={32}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{c.company}</div>
              <div style={{fontSize:10,color:"#64748b"}}>{c.service} • R${(c.contractValue||0).toLocaleString("pt-BR")} • {c.churning?"⚠️ Churning":"Arquivado"}</div>
            </div>
            <div style={{display:"flex",gap:4}}>
              <Btn small icon={RefreshCw} onClick={()=>{
                setClients(p=>p.map(x=>x.id!==c.id?x:{...x,archived:false,status:"venda_fechada",churning:false,timeline:[...x.timeline,{date:new Date().toISOString(),event:"Cliente reativado (removido do arquivo)",user:authUser?.name||"Thomas"}]}));
                showToast(`🔄 ${c.company} reativado — voltou para Venda Fechada no Kanban`);
                sendTelegram(`🔄 Cliente reativado: ${c.company} — R$${(c.contractValue||0).toLocaleString("pt-BR")}`);
              }}>Reativar</Btn>
              <Btn small variant="secondary" onClick={()=>openClient(c.id)}>Ver</Btn>
            </div>
          </div>;
        })}
      </div>
    </div>
    )}

    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
      <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>SLA e Automações</h3>
      {[{t:"SLA Tráfego Pago",d:"48 horas após pagamento",v:"48h"},{t:"Auto-criar tarefas",d:"Ao confirmar pagamento",v:"Ativo"},{t:"Reuniões recorrentes",d:"Semanal após ativação",v:"Ativo"},{t:"Alertas de atraso",d:"Responsável + gestor",v:"Ativo"}].map(x=>
        <div key={x.t} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1e293b30"}}>
          <div><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{x.t}</div><div style={{fontSize:10,color:"#64748b"}}>{x.d}</div></div>
          <span style={{fontSize:12,fontWeight:700,color:"#22c55e"}}>{x.v}</span>
        </div>
      )}
    </div>
  </div>;

  const [linceFullscreen, setLinceFullscreen] = useState(false);
  const linceRef = useRef(null);

  const LincePage = () => (
    <div style={{height:"calc(100vh - 56px)",display:"flex",flexDirection:"column"}}>
      {!linceFullscreen&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 16px",borderBottom:"1px solid #1e293b",background:"#0f172a",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center"}}><LineChart size={14} color="#fff"/></div>
          <div>
            <h2 style={{margin:0,fontSize:14,fontWeight:800,color:"#f1f5f9"}}>Lince Dashboard</h2>
            <span style={{fontSize:9,color:"#64748b"}}>Métricas em tempo real • lince-dashboard.vercel.app</span>
          </div>
        </div>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          <Bg color="#06b6d4" small><Wifi size={9}/> Ao Vivo</Bg>
          <button onClick={()=>{if(linceRef.current)linceRef.current.src=linceRef.current.src;}} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"4px 8px",cursor:"pointer",color:"#94a3b8",display:"flex",alignItems:"center",gap:3,fontSize:10}}><RefreshCw size={10}/> Reload</button>
          <button onClick={()=>setLinceFullscreen(true)} style={{background:"#1e293b",border:"1px solid #334155",borderRadius:6,padding:"4px 8px",cursor:"pointer",color:"#94a3b8",display:"flex",alignItems:"center",gap:3,fontSize:10}}><Layers size={10}/> Fullscreen</button>
          <a href="https://lince-dashboard.vercel.app/" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:3,padding:"4px 8px",borderRadius:6,fontSize:10,fontWeight:600,color:"#94a3b8",background:"#1e293b",border:"1px solid #334155",textDecoration:"none",cursor:"pointer"}}><ExternalLink size={10}/> Nova aba</a>
        </div>
      </div>}
      {linceFullscreen&&<button onClick={()=>setLinceFullscreen(false)} style={{position:"fixed",top:8,right:8,zIndex:9999,background:"#0f172a",border:"1px solid #334155",borderRadius:8,padding:"6px 12px",cursor:"pointer",color:"#e2e8f0",display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,.5)"}}><X size={12}/> Sair Fullscreen</button>}
      <div style={{flex:1,position:"relative",background:"#020617"}}>
        <iframe
          ref={linceRef}
          src="https://lince-dashboard.vercel.app/"
          style={{width:"100%",height:"100%",border:"none"}}
          title="Lince Dashboard"
          allow="clipboard-read; clipboard-write; fullscreen"
        />
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // KANBAN MULTIVERSO — iframe
  const MultiversoPage = () => React.createElement("div", {style:{height:"calc(100vh - 56px)"}}, React.createElement("iframe", {src:"/multiverso-v4.html", style:{width:"100%",height:"100%",border:"none"}, title:"Kanban Multiverso", allow:"autoplay"}));

  const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard/>;
      case "kanban": return <KanbanPage/>;
      case "clients": return <ClientsPage/>;
      case "client_detail": return <ClientDetail/>;
      case "tasks": return <TasksPage/>;
      case "calendar": return <CalendarPage/>;
      case "lince": return <LincePage/>;
      case "warday": return <WarDayPage/>;
      case "reports": return <ReportsPage/>;
      case "gc": return <GCPage/>;
      case "team": return <TeamPage/>;
      case "multiverso": return <MultiversoPage/>;
      case "settings": return <SettingsPage/>;
      default: return <Dashboard/>;
    }
  };

  // ═══════════════════════════════════════════
  // LAYOUT
  // ═══════════════════════════════════════════

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
    select{cursor:pointer}select option{background:#1e293b;color:#e2e8f0}body{overflow:hidden}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
    @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  `;

  // ═══════════════════════════ AUTH LOADING
  if (authLoading) {
    return (
      <div style={{display:"flex",minHeight:"100vh",background:"#020617",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
        <style>{globalStyles}</style>
        <div style={{textAlign:"center",animation:"fadeIn .5s ease"}}>
          <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#6366f1,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Zap size={28} color="#fff"/></div>
          <div style={{fontSize:22,fontWeight:800,color:"#f1f5f9",letterSpacing:"-.02em"}}>AgênciaOS</div>
          <div style={{fontSize:12,color:"#6366f1",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",marginTop:4}}>Carregando...</div>
          <Loader2 size={20} color="#6366f1" style={{animation:"spin 1s linear infinite",marginTop:16}}/>
        </div>
      </div>
    );
  }

  // ═══════════════════════════ LOGIN PAGE
  if (!authUser) {
    return (
      <div style={{display:"flex",minHeight:"100vh",background:"#020617",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
        <style>{globalStyles}</style>

        {/* Left - Branding */}
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 60px",background:"linear-gradient(135deg,#020617 0%,#0f172a 50%,#1e1b4b 100%)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-20%",right:"-10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,#6366f120 0%,transparent 70%)"}}/>
          <div style={{position:"absolute",bottom:"-15%",left:"-5%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,#8b5cf620 0%,transparent 70%)"}}/>
          <div style={{position:"relative",zIndex:1,animation:"fadeIn .6s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:40}}>
              <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#6366f1,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 32px rgba(99,102,241,.4)"}}><Zap size={26} color="#fff"/></div>
              <div>
                <div style={{fontSize:28,fontWeight:900,color:"#f1f5f9",letterSpacing:"-.03em"}}>AgênciaOS</div>
                <div style={{fontSize:11,color:"#6366f1",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase"}}>Gestão Operacional</div>
              </div>
            </div>
            <h1 style={{fontSize:36,fontWeight:900,color:"#f1f5f9",lineHeight:1.2,marginBottom:16,letterSpacing:"-.02em"}}>O sistema operacional<br/>da sua agência</h1>
            <p style={{fontSize:15,color:"#94a3b8",lineHeight:1.7,maxWidth:440}}>Kanban, SLA de 48h, checklists, reuniões, Google Calendar, relatórios e toda a operação em um único lugar.</p>
            <div style={{display:"flex",gap:20,marginTop:32}}>
              {[{n:"Clientes Ativos",v:"5",ic:Building2},{n:"Google Calendar",v:"Conectado",ic:CalendarDays},{n:"Lince Dashboard",v:"Integrado",ic:LineChart}].map(x=>
                <div key={x.n} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:"#1e293b40",borderRadius:10,border:"1px solid #334155"}}>
                  <x.ic size={16} color="#6366f1"/>
                  <div><div style={{fontSize:14,fontWeight:800,color:"#e2e8f0"}}>{x.v}</div><div style={{fontSize:10,color:"#64748b"}}>{x.n}</div></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Login Form */}
        <div style={{width:480,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 50px",background:"#0f172a",borderLeft:"1px solid #1e293b"}}>
          <div style={{animation:"slideUp .5s ease"}}>
            <div style={{marginBottom:32}}>
              <h2 style={{fontSize:24,fontWeight:800,color:"#f1f5f9",margin:0}}>Entrar na plataforma</h2>
              <p style={{fontSize:13,color:"#64748b",marginTop:6}}>Use sua conta Google corporativa ou pessoal autorizada</p>
            </div>

            {/* Google Sign In Button */}
            <button onClick={handleGoogleSignIn} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:12,padding:"14px 20px",borderRadius:12,border:"1px solid #334155",background:"#1e293b",cursor:"pointer",fontSize:15,fontWeight:700,color:"#e2e8f0",transition:"all .2s",marginBottom:16}} onMouseEnter={e=>{e.target.style.background="#334155";e.target.style.borderColor="#6366f1"}} onMouseLeave={e=>{e.target.style.background="#1e293b";e.target.style.borderColor="#334155"}}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Entrar com Google
            </button>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0"}}>
              <div style={{flex:1,height:1,background:"#334155"}}/>
              <span style={{fontSize:11,color:"#64748b"}}>ou entre com email autorizado</span>
              <div style={{flex:1,height:1,background:"#334155"}}/>
            </div>

            {/* Manual Email Login (fallback/demo) */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{position:"relative"}}>
                <Mail size={16} color="#64748b" style={{position:"absolute",left:12,top:12}}/>
                <input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  style={{width:"100%",padding:"10px 12px 10px 38px",background:"#020617",border:"1px solid #334155",borderRadius:10,color:"#e2e8f0",fontSize:14,outline:"none",fontFamily:"inherit"}}
                  onKeyDown={e=>{ if(e.key==="Enter") processLogin(e.target.value, "", null); }}
                />
              </div>
              <button onClick={()=>{ const el=document.getElementById("login-email"); if(el?.value) processLogin(el.value,"",null); }}
                style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <LogIn size={16}/> Acessar Plataforma
              </button>
            </div>

            {authError && authError !== "google_fallback" && (
              <div style={{marginTop:14,padding:"10px 14px",background:"#ef444420",border:"1px solid #ef444440",borderRadius:10,display:"flex",alignItems:"center",gap:8}}>
                <AlertCircle size={16} color="#ef4444"/>
                <span style={{fontSize:12,color:"#fca5a5"}}>{authError}</span>
              </div>
            )}

            {/* Authorized accounts hint */}
            <div style={{marginTop:24,padding:"14px 16px",background:"#020617",borderRadius:10,border:"1px solid #1e293b"}}>
              <div style={{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Contas Autorizadas</div>
              {authorizedUsers.slice(0,4).map(u=>(
                <div key={u.email} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",cursor:"pointer"}} onClick={()=>processLogin(u.email,u.name,null)}>
                  <Av i={u.avatar||"??"} c={ROLES[u.role?.toUpperCase()]?.color||"#64748b"} s={22}/>
                  <div style={{flex:1}}>
                    <span style={{fontSize:12,color:"#e2e8f0",fontWeight:600}}>{u.name}</span>
                    <span style={{fontSize:10,color:"#64748b",marginLeft:6}}>{u.email}</span>
                  </div>
                  <Bg color={u.status==="active"?"#22c55e":"#f59e0b"} small>{u.status==="active"?"Ativo":"Convidado"}</Bg>
                </div>
              ))}
              {authorizedUsers.length>4&&<div style={{fontSize:10,color:"#64748b",marginTop:4}}>+{authorizedUsers.length-4} mais</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════ MAIN APP (AUTHENTICATED)
  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#020617",color:"#e2e8f0",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
      <style>{globalStyles}</style>

      {/* Sidebar */}
      <div style={{width:sidebarOpen?220:60,background:"#020617",borderRight:"1px solid #1e293b",display:"flex",flexDirection:"column",transition:"width .3s",flexShrink:0,height:"100vh",position:"sticky",top:0,zIndex:50}}>
        <div style={{padding:sidebarOpen?"14px 16px":"14px 10px",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",gap:8,minHeight:52}}>
          {sidebarOpen?<>
            <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,#6366f1,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center"}}><Zap size={15} color="#fff"/></div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>AgênciaOS</div><div style={{fontSize:9,color:firebaseConnected?"#22c55e":"#6366f1",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase"}}>{firebaseConnected?"Firebase Live ✓":"Offline Mode"}</div></div>
          </>:null}
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",padding:4}}>{sidebarOpen?<ChevronLeft size={16}/>:<ChevronRight size={16}/>}</button>
        </div>
        <nav style={{flex:1,padding:"10px 6px",display:"flex",flexDirection:"column",gap:1}}>
          {navItems.map(item=><button key={item.id} onClick={()=>{setPage(item.id);setSelectedClient(null);}}
            style={{display:"flex",alignItems:"center",gap:8,padding:sidebarOpen?"8px 10px":"8px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:page===item.id?600:500,color:page===item.id?"#e2e8f0":"#94a3b8",background:page===item.id?"#1e293b":"transparent",width:"100%",textAlign:"left",justifyContent:sidebarOpen?"flex-start":"center"}}>
            <item.icon size={16}/>{sidebarOpen&&item.label}
          </button>)}
        </nav>
        {sidebarOpen&&<div style={{padding:"10px 14px",borderTop:"1px solid #1e293b"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Av i={authUser.avatar||"??"} c={ROLES[authUser.role?.toUpperCase()]?.color||"#6366f1"} s={26}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{authUser.name}</div>
              <div style={{fontSize:9,color:"#64748b"}}>{ROLES[authUser.role?.toUpperCase()]?.label||authUser.role}</div>
            </div>
            <button onClick={handleLogout} title="Sair" style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",padding:2}}><LogOut size={14}/></button>
          </div>
        </div>}
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,height:"100vh"}}>
        {/* Topbar */}
        <div style={{height:52,background:"#020617",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",padding:"0 16px",gap:10,position:"sticky",top:0,zIndex:40}}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:6,background:"#0f172a",borderRadius:8,padding:"5px 10px",border:"1px solid #1e293b",maxWidth:360}}>
            <Search size={14} color="#64748b"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar clientes, tarefas..." style={{background:"none",border:"none",color:"#e2e8f0",fontSize:12,outline:"none",width:"100%",fontFamily:"inherit"}}/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {calSynced&&<Bg color="#22c55e" small><Wifi size={9}/> GCal Live</Bg>}
            {sheetSyncStatus==="synced"&&<Bg color="#3b82f6" small><Layers size={9}/> Planilha</Bg>}
            <Btn onClick={()=>setShowNewClient(true)} icon={Plus} small>Cliente</Btn>
            <Btn onClick={()=>setShowNewMeeting(true)} icon={CalendarDays} small variant="secondary">Reunião</Btn>
          </div>
          <div style={{position:"relative"}}>
            <button onClick={()=>setShowNotif(!showNotif)} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#94a3b8",position:"relative"}}>
              <Bell size={16}/>{unread>0&&<span style={{position:"absolute",top:-2,right:-2,width:14,height:14,borderRadius:"50%",background:"#ef4444",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
            </button>
            {showNotif&&<div style={{position:"absolute",right:0,top:40,width:340,background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,boxShadow:"0 20px 50px rgba(0,0,0,.5)",zIndex:100}}>
              <div style={{padding:"10px 14px",borderBottom:"1px solid #1e293b",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>Notificações</span><button onClick={()=>setNotifications(p=>p.map(n=>({...n,read:true})))} style={{background:"none",border:"none",color:"#6366f1",fontSize:11,cursor:"pointer",fontWeight:600}}>Marcar lidas</button></div>
              <div style={{maxHeight:300,overflowY:"auto"}}>{notifications.map(n=><div key={n.id} onClick={()=>{if(n.clientId)openClient(n.clientId);setShowNotif(false);setNotifications(p=>p.map(x=>x.id===n.id?{...x,read:true}:x));}} style={{padding:"8px 14px",borderBottom:"1px solid #1e293b10",cursor:"pointer",background:n.read?"transparent":"#1e293b20",display:"flex",gap:8}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:n.read?"transparent":"#6366f1",marginTop:6,flexShrink:0}}/>
                <div><div style={{fontSize:12,color:"#e2e8f0",lineHeight:1.3}}>{n.message}</div><div style={{fontSize:10,color:"#64748b",marginTop:1}}>{ago(n.time)}</div></div>
              </div>)}</div>
            </div>}
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>{renderPage()}</div>
      </div>

      {/* NEW CLIENT */}
      <Modal open={showNewClient} onClose={()=>setShowNewClient(false)} title="Novo Cliente — Produtos Contratados" wide>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Empresa" value={nC.company} onChange={v=>setNC({...nC,company:v})} placeholder="Nome da empresa"/>
          <Inp label="Contato" value={nC.contact} onChange={v=>setNC({...nC,contact:v})} placeholder="Nome do contato"/>
          <Inp label="Telefone" value={nC.phone} onChange={v=>setNC({...nC,phone:v})} placeholder="(00) 00000-0000"/>
          <Inp label="Email" value={nC.email} onChange={v=>setNC({...nC,email:v})} type="email"/>
          <Inp label="Segmento" value={nC.segment} onChange={v=>setNC({...nC,segment:v})} placeholder="Ex: Saúde, Moda"/>
          <Inp label="Valor do Contrato (R$)" value={nC.contractValue} onChange={v=>setNC({...nC,contractValue:v})} type="number" placeholder="0.00"/>
          <Sel label="Prioridade" value={nC.priority} onChange={v=>setNC({...nC,priority:v})} options={Object.entries(PRIORITIES).map(([k,v])=>({value:k,label:v.label}))}/>

          {/* GC TEAM */}
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em"}}>Grupo de Combate</label>
            <div style={{display:"flex",gap:6}}>
              {Object.values(GC_TEAMS).map(gc=>(
                <button key={gc.id} onClick={()=>setNC({...nC,gcTeam:gc.id})}
                  style={{flex:1,padding:"10px 8px",borderRadius:10,border:`2px solid ${nC.gcTeam===gc.id?gc.color:"#334155"}`,
                    background:nC.gcTeam===gc.id?`${gc.color}15`:"#1e293b",cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:16}}>{gc.icon}</div>
                  <div style={{fontSize:12,fontWeight:700,color:nC.gcTeam===gc.id?gc.color:"#94a3b8"}}>{gc.name}</div>
                  <div style={{fontSize:9,color:"#64748b"}}>{gc.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ PRODUCTS CHECKBOXES ═══ */}
        <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>

          {/* TRÁFEGO PAGO */}
          <div style={{background:"#020617",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Target size={16} color="#f59e0b"/>
              <span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Tráfego Pago</span>
              {nC.trafficPlatforms.length>0&&<Bg color="#f59e0b" small>{nC.trafficPlatforms.length} selecionado{nC.trafficPlatforms.length>1?"s":""}</Bg>}
            </div>
            <div style={{fontSize:10,color:"#64748b",marginBottom:8}}>Selecione as plataformas (pode marcar várias)</div>
            {TRAFFIC_PLATFORMS.map(p=>(
              <div key={p.id} onClick={()=>setNC({...nC,trafficPlatforms:toggleArr(nC.trafficPlatforms,p.id)})}
                style={{display:"flex",alignItems:"center",gap:8,padding:"7px 8px",marginBottom:3,borderRadius:8,cursor:"pointer",
                  background:nC.trafficPlatforms.includes(p.id)?"#f59e0b12":"transparent",
                  border:`1px solid ${nC.trafficPlatforms.includes(p.id)?"#f59e0b40":"transparent"}`}}>
                {nC.trafficPlatforms.includes(p.id)?<CheckSquare size={16} color="#f59e0b"/>:<Square size={16} color="#475569"/>}
                <span style={{fontSize:12,color:nC.trafficPlatforms.includes(p.id)?"#e2e8f0":"#94a3b8",fontWeight:nC.trafficPlatforms.includes(p.id)?600:400}}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* CRIATIVOS */}
          <div style={{background:"#020617",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Palette size={16} color="#8b5cf6"/>
              <span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Criativos para Anúncios</span>
            </div>
            <div style={{fontSize:10,color:"#64748b",marginBottom:8}}>Escolha o pacote de criativos</div>
            {CREATIVE_OPTIONS.map(p=>(
              <div key={p.id} onClick={()=>setNC({...nC,creativeOption:nC.creativeOption===p.id?"":p.id})}
                style={{display:"flex",alignItems:"center",gap:8,padding:"10px 8px",marginBottom:3,borderRadius:8,cursor:"pointer",
                  background:nC.creativeOption===p.id?"#8b5cf612":"transparent",
                  border:`1px solid ${nC.creativeOption===p.id?"#8b5cf640":"transparent"}`}}>
                {nC.creativeOption===p.id?<CheckCircle2 size={16} color="#8b5cf6"/>:<Circle size={16} color="#475569"/>}
                <span style={{fontSize:12,color:nC.creativeOption===p.id?"#e2e8f0":"#94a3b8",fontWeight:nC.creativeOption===p.id?600:400}}>{p.label}</span>
              </div>
            ))}

            {/* SOCIAL MEDIA */}
            <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid #1e293b"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <Image size={16} color="#ec4899"/>
                <span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Social Media</span>
              </div>
              {SOCIAL_OPTIONS.map(p=>(
                <div key={p.id} onClick={()=>setNC({...nC,socialOption:p.id})}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"10px 8px",marginBottom:3,borderRadius:8,cursor:"pointer",
                    background:nC.socialOption===p.id?"#ec489912":"transparent",
                    border:`1px solid ${nC.socialOption===p.id?"#ec489940":"transparent"}`}}>
                  {nC.socialOption===p.id?<CheckCircle2 size={16} color="#ec4899"/>:<Circle size={16} color="#475569"/>}
                  <span style={{fontSize:12,color:nC.socialOption===p.id?"#e2e8f0":"#94a3b8",fontWeight:nC.socialOption===p.id?600:400}}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CRIAÇÃO DE LOJA */}
          <div style={{gridColumn:"1/-1",background:"#020617",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Globe size={16} color="#06b6d4"/>
              <span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Criação de Loja Virtual</span>
              {nC.storePlatforms.length>0&&<Bg color="#06b6d4" small>{nC.storePlatforms.length} plataforma{nC.storePlatforms.length>1?"s":""}</Bg>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {STORE_PLATFORMS.map(p=>(
                <div key={p.id} onClick={()=>setNC({...nC,storePlatforms:toggleArr(nC.storePlatforms,p.id)})}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"10px 8px",borderRadius:8,cursor:"pointer",
                    background:nC.storePlatforms.includes(p.id)?"#06b6d412":"transparent",
                    border:`1px solid ${nC.storePlatforms.includes(p.id)?"#06b6d440":"#1e293b"}`}}>
                  {nC.storePlatforms.includes(p.id)?<CheckSquare size={14} color="#06b6d4"/>:<Square size={14} color="#475569"/>}
                  <span style={{fontSize:11,color:nC.storePlatforms.includes(p.id)?"#e2e8f0":"#94a3b8",fontWeight:nC.storePlatforms.includes(p.id)?600:400}}>{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RESUMO */}
          {(nC.trafficPlatforms.length>0||nC.creativeOption||nC.socialOption==="social_2x"||nC.storePlatforms.length>0) && (
            <div style={{gridColumn:"1/-1",background:"linear-gradient(135deg,#6366f110,#8b5cf610)",border:"1px solid #6366f130",borderRadius:12,padding:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Resumo — Setores atribuídos</div>
              <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0",marginBottom:6}}>{buildServiceDesc(nC)}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <Bg color="#06b6d4" small>CS</Bg>
                {nC.trafficPlatforms.length>0&&<Bg color="#f59e0b" small>Tráfego Pago</Bg>}
                {nC.creativeOption&&<Bg color="#8b5cf6" small>Designer + Filmmaker</Bg>}
                {nC.socialOption==="social_2x"&&<Bg color="#ec4899" small>Social Media</Bg>}
                {nC.storePlatforms.length>0&&<Bg color="#06b6d4" small>Loja Virtual</Bg>}
                <Bg color={GC_TEAMS[nC.gcTeam]?.color} small>{GC_TEAMS[nC.gcTeam]?.icon} {GC_TEAMS[nC.gcTeam]?.name}</Bg>
              </div>
            </div>
          )}

          {/* ═══ EQUIPE DO PROJETO — escolher colaboradores ═══ */}
          <div style={{gridColumn:"1/-1",background:"#020617",border:"1px solid #1e293b",borderRadius:12,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Users size={16} color="#6366f1"/>
              <span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Equipe do Projeto</span>
              <span style={{fontSize:10,color:"#64748b"}}>(deixe vazio para auto-assign pelo GC)</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div style={{gridColumn:"1/-1",marginBottom:4}}>
                <Sel label="🏆 QUEM VENDEU (Comercial/SDR responsável pela venda)" value={nC.soldBy} onChange={v=>setNC({...nC,soldBy:v})} options={[{value:"",label:"— Selecione quem fechou a venda —"},...SEED_USERS.filter(u=>["sdr","commercial","admin","director"].includes(u.role)).map(u=>({value:u.id,label:`${u.name} — ${ROLES[u.role?.toUpperCase()]?.label||u.role}`})),...SEED_USERS.filter(u=>!["sdr","commercial","admin","director"].includes(u.role)).map(u=>({value:u.id,label:`${u.name} — ${ROLES[u.role?.toUpperCase()]?.label||u.role}`}))]}/>
              </div>
              <Sel label="CS (Customer Success)" value={nC.pickCs} onChange={v=>setNC({...nC,pickCs:v})} options={userOptionsForRole("cs")}/>
              <Sel label="Gestor de Tráfego" value={nC.pickTraffic} onChange={v=>setNC({...nC,pickTraffic:v})} options={userOptionsForRole("traffic")}/>
              <Sel label="Social Media" value={nC.pickSocial} onChange={v=>setNC({...nC,pickSocial:v})} options={userOptionsForRole("social")}/>
              <Sel label="Designer" value={nC.pickDesigner} onChange={v=>setNC({...nC,pickDesigner:v})} options={userOptionsForRole("designer")}/>
              <Sel label="Filmmaker" value={nC.pickFilmmaker} onChange={v=>setNC({...nC,pickFilmmaker:v})} options={userOptionsForRole("filmmaker")}/>
              <Sel label="Comercial" value={nC.pickCommercial} onChange={v=>setNC({...nC,pickCommercial:v})} options={userOptionsForRole("commercial")}/>
            </div>
            <div style={{marginTop:8,fontSize:10,color:"#475569",display:"flex",alignItems:"center",gap:4}}>
              <UserPlus size={10}/> Não encontrou o colaborador? Vá em <strong style={{color:"#6366f1",cursor:"pointer"}} onClick={()=>{setShowNewClient(false);setShowInviteModal(true);}}>Config → Convidar</strong> para adicionar por email.
            </div>
          </div>

          <div style={{gridColumn:"1/-1"}}><Inp label="Observações" value={nC.notes} onChange={v=>setNC({...nC,notes:v})} textarea placeholder="Notas sobre o cliente..."/></div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
          <Btn variant="secondary" onClick={()=>setShowNewClient(false)}>Cancelar</Btn>
          <Btn onClick={createClient} disabled={!nC.company||!nC.contact} icon={Check}>Criar Cliente</Btn>
        </div>
      </Modal>

      {/* NEW TASK */}
      <Modal open={showNewTask} onClose={()=>setShowNewTask(false)} title="Nova Tarefa" wide>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp label="Título da tarefa" value={nT.title} onChange={v=>setNT({...nT,title:v})} placeholder="Ex: Criar carrossel para Instagram — Chinalink"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Cliente" value={nT.clientId} onChange={v=>setNT({...nT,clientId:v})} options={[{value:"",label:"Selecione"},...clients.filter(c=>!c.archived).map(c=>({value:c.id,label:c.company}))]}/>
            <Sel label="Responsável (quem faz)" value={nT.assigneeId} onChange={v=>setNT({...nT,assigneeId:v})} options={[{value:"",label:"Selecione"},...SEED_USERS.filter(u=>!u.pending).map(u=>({value:u.id,label:`${u.name} (${ROLES[u.role?.toUpperCase()]?.label||u.role})`}))]}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Sel label="Solicitado por" value={nT.requestedBy} onChange={v=>setNT({...nT,requestedBy:v})} options={[{value:"",label:"Selecione"},...SEED_USERS.filter(u=>!u.pending).map(u=>({value:u.id,label:u.name}))]}/>
            <Sel label="Prioridade" value={nT.priority} onChange={v=>setNT({...nT,priority:v})} options={Object.entries(PRIORITIES).map(([k,v])=>({value:k,label:v.label}))}/>
            <Inp label="Prazo" value={nT.dueDate} onChange={v=>setNT({...nT,dueDate:v})} type="date"/>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em"}}>Descrição / Briefing da demanda</label>
            <textarea value={nT.description} onChange={e=>setNT({...nT,description:e.target.value})}
              placeholder="Descreva o que precisa ser criado:&#10;- Formato (carrossel, reels, stories, post estático)&#10;- Textos e copys&#10;- Referências visuais&#10;- Cores e identidade&#10;- Prazo de aprovação&#10;- Observações para o designer/criador"
              style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",color:"#e2e8f0",fontSize:12,lineHeight:1.5,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginTop:4,minHeight:120,resize:"vertical"}}/>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
          <Btn variant="secondary" onClick={()=>setShowNewTask(false)}>Cancelar</Btn>
          <Btn onClick={createTask} disabled={!nT.title} icon={Check}>Criar Tarefa</Btn>
        </div>
      </Modal>

      {/* NEW MEETING */}
      <Modal open={showNewMeeting} onClose={()=>setShowNewMeeting(false)} title="Agendar Reunião">
        <div style={{background:"#1e293b30",borderRadius:10,padding:12,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
          <CalendarDays size={18} color="#6366f1"/>
          <div><div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>Google Calendar Integrado</div><div style={{fontSize:10,color:"#94a3b8"}}>A reunião será registrada no AgênciaOS. Para criar no Google Calendar, peça ao Claude no chat.</div></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Sel label="Cliente" value={nM.clientId} onChange={v=>setNM({...nM,clientId:v,title:v?`Reunião × ${clients.find(c=>c.id===v)?.company}`:nM.title})} options={[{value:"",label:"Selecione o cliente"},...clients.map(c=>({value:c.id,label:c.company}))]}/>
          <Inp label="Título" value={nM.title} onChange={v=>setNM({...nM,title:v})} placeholder="Reunião semanal"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Inp label="Data" value={nM.date} onChange={v=>setNM({...nM,date:v})} type="date"/>
            <Inp label="Horário" value={nM.time} onChange={v=>setNM({...nM,time:v})} type="time"/>
          </div>
          <Sel label="Duração" value={nM.duration} onChange={v=>setNM({...nM,duration:v})} options={[{value:"30",label:"30 min"},{value:"60",label:"1 hora"},{value:"90",label:"1h30"},{value:"120",label:"2 horas"}]}/>
          <Inp label="Notas / Pauta" value={nM.notes} onChange={v=>setNM({...nM,notes:v})} textarea placeholder="Pauta da reunião..."/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
          <Btn variant="secondary" onClick={()=>setShowNewMeeting(false)}>Cancelar</Btn>
          <Btn onClick={handleCreateMeeting} disabled={!nM.clientId||!nM.date||!nM.time||creatingEvent} icon={creatingEvent?Loader2:CalendarDays}>
            {creatingEvent?"Agendando...":"Agendar Reunião"}
          </Btn>
        </div>
      </Modal>

      {/* WAR DAY MODAL */}
      <WarDayModal/>
      <ScheduleCallModal/>

      {/* EDIT USER MODAL */}
      <Modal open={showEditUser&&editingUser} onClose={()=>{setShowEditUser(false);setEditingUser(null);}} title={`Editar Colaborador — ${editingUser?.name||""}`}>
        {editingUser&&<>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Inp label="Nome completo" value={editingUser.name} onChange={v=>setEditingUser({...editingUser,_origEmail:editingUser._origEmail||editingUser.email,name:v})} placeholder="Nome do colaborador"/>
            <Inp label="Email" value={editingUser.email} onChange={v=>setEditingUser({...editingUser,_origEmail:editingUser._origEmail||editingUser.email,email:v})} type="email" placeholder="email@lince.com"/>
            <Sel label="Função / Cargo" value={editingUser.role} onChange={v=>setEditingUser({...editingUser,role:v})} options={Object.entries(ROLES).map(([k,v])=>({value:v.id,label:v.label}))}/>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em",marginBottom:6,display:"block"}}>Grupo de Combate</label>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditingUser({...editingUser,gc:null})}
                  style={{flex:1,padding:"10px",borderRadius:10,border:`2px solid ${!editingUser.gc?"#64748b":"#334155"}`,background:!editingUser.gc?"#64748b15":"#1e293b",cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:!editingUser.gc?"#e2e8f0":"#64748b"}}>Nenhum</div>
                </button>
                {Object.values(GC_TEAMS).map(gc=>(
                  <button key={gc.id} onClick={()=>setEditingUser({...editingUser,gc:gc.id})}
                    style={{flex:1,padding:"10px",borderRadius:10,border:`2px solid ${editingUser.gc===gc.id?gc.color:"#334155"}`,background:editingUser.gc===gc.id?`${gc.color}15`:"#1e293b",cursor:"pointer",textAlign:"center"}}>
                    <div style={{fontSize:16}}>{gc.icon}</div>
                    <div style={{fontSize:11,fontWeight:700,color:editingUser.gc===gc.id?gc.color:"#94a3b8"}}>{gc.name}</div>
                  </button>
                ))}
                <button onClick={()=>setEditingUser({...editingUser,gc:"BOTH"})}
                  style={{flex:1,padding:"10px",borderRadius:10,border:`2px solid ${editingUser.gc==="BOTH"?"#6366f1":"#334155"}`,background:editingUser.gc==="BOTH"?"#6366f115":"#1e293b",cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:16}}>🔗</div>
                  <div style={{fontSize:11,fontWeight:700,color:editingUser.gc==="BOTH"?"#6366f1":"#94a3b8"}}>Ambos</div>
                </button>
              </div>
            </div>
          </div>
          {/* Preview */}
          <div style={{marginTop:14,background:"#020617",border:"1px solid #1e293b",borderRadius:10,padding:12,display:"flex",alignItems:"center",gap:10}}>
            <Av i={editingUser.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)||"??"} c={ROLES[editingUser.role?.toUpperCase()]?.color||"#64748b"} s={36}/>
            <div>
              <div style={{fontWeight:700,color:"#e2e8f0",fontSize:14}}>{editingUser.name||"—"}</div>
              <div style={{display:"flex",gap:4,marginTop:2}}>
                <Bg color={ROLES[editingUser.role?.toUpperCase()]?.color||"#64748b"} small>{ROLES[editingUser.role?.toUpperCase()]?.label||editingUser.role}</Bg>
                {editingUser.gc&&editingUser.gc!=="BOTH"&&<Bg color={GC_TEAMS[editingUser.gc]?.color} small>{GC_TEAMS[editingUser.gc]?.icon} {GC_TEAMS[editingUser.gc]?.name}</Bg>}
                {editingUser.gc==="BOTH"&&<Bg color="#6366f1" small>🔗 Ambos GCs</Bg>}
              </div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
            <Btn variant="secondary" onClick={()=>{setShowEditUser(false);setEditingUser(null);}}>Cancelar</Btn>
            <Btn onClick={saveEditUser} disabled={!editingUser.name||!editingUser.email} icon={Check}>Salvar</Btn>
          </div>
        </>}
      </Modal>

      {/* EDIT TEAM MODAL */}
      <Modal open={showEditTeam} onClose={()=>setShowEditTeam(false)} title={`Editar Equipe — ${client?.company||""}`} wide>
        <div style={{background:"linear-gradient(135deg,#6366f110,#8b5cf610)",border:"1px solid #6366f130",borderRadius:10,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <Users size={20} color="#6366f1"/>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Gerenciar Colaboradores do Projeto</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>Escolha quem ficará responsável por cada setor deste cliente. As alterações ficam registradas na timeline.</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <Sel label="CS (Customer Success)" value={editTeamData.csId} onChange={v=>setEditTeamData({...editTeamData,csId:v})} options={allUserOptions()}/>
            {editTeamData.csId && getUser(editTeamData.csId) && <div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><Av i={getUser(editTeamData.csId).avatar} c={ROLES.CS.color} s={20}/><span style={{fontSize:11,color:"#e2e8f0"}}>{getUser(editTeamData.csId).name}</span></div>}
          </div>
          <div>
            <Sel label="Gestor de Tráfego" value={editTeamData.trafficId} onChange={v=>setEditTeamData({...editTeamData,trafficId:v})} options={allUserOptions()}/>
            {editTeamData.trafficId && getUser(editTeamData.trafficId) && <div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><Av i={getUser(editTeamData.trafficId).avatar} c={ROLES.TRAFFIC.color} s={20}/><span style={{fontSize:11,color:"#e2e8f0"}}>{getUser(editTeamData.trafficId).name}</span></div>}
          </div>
          <div>
            <Sel label="Social Media" value={editTeamData.socialId} onChange={v=>setEditTeamData({...editTeamData,socialId:v})} options={allUserOptions()}/>
            {editTeamData.socialId && getUser(editTeamData.socialId) && <div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><Av i={getUser(editTeamData.socialId).avatar} c={ROLES.SOCIAL.color} s={20}/><span style={{fontSize:11,color:"#e2e8f0"}}>{getUser(editTeamData.socialId).name}</span></div>}
          </div>
          <div>
            <Sel label="Designer" value={editTeamData.designerId} onChange={v=>setEditTeamData({...editTeamData,designerId:v})} options={allUserOptions()}/>
            {editTeamData.designerId && getUser(editTeamData.designerId) && <div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><Av i={getUser(editTeamData.designerId).avatar} c={ROLES.DESIGNER.color} s={20}/><span style={{fontSize:11,color:"#e2e8f0"}}>{getUser(editTeamData.designerId).name}</span></div>}
          </div>
          <div>
            <Sel label="Filmmaker" value={editTeamData.filmmakerId} onChange={v=>setEditTeamData({...editTeamData,filmmakerId:v})} options={allUserOptions()}/>
            {editTeamData.filmmakerId && getUser(editTeamData.filmmakerId) && <div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><Av i={getUser(editTeamData.filmmakerId).avatar} c={ROLES.FILMMAKER.color} s={20}/><span style={{fontSize:11,color:"#e2e8f0"}}>{getUser(editTeamData.filmmakerId).name}</span></div>}
          </div>
          <div>
            <Sel label="Comercial" value={editTeamData.commercialId} onChange={v=>setEditTeamData({...editTeamData,commercialId:v})} options={allUserOptions()}/>
            {editTeamData.commercialId && getUser(editTeamData.commercialId) && <div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><Av i={getUser(editTeamData.commercialId).avatar} c={ROLES.COMMERCIAL.color} s={20}/><span style={{fontSize:11,color:"#e2e8f0"}}>{getUser(editTeamData.commercialId).name}</span></div>}
          </div>
        </div>
        <div style={{marginTop:12,fontSize:10,color:"#475569",display:"flex",alignItems:"center",gap:4}}>
          <UserPlus size={10}/> Precisa adicionar alguém novo? <strong style={{color:"#6366f1",cursor:"pointer"}} onClick={()=>{setShowEditTeam(false);setShowInviteModal(true);}}>Convidar colaborador</strong>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
          <Btn variant="secondary" onClick={()=>setShowEditTeam(false)}>Cancelar</Btn>
          <Btn onClick={saveEditTeam} icon={Check}>Salvar Equipe</Btn>
        </div>
      </Modal>

      {/* INVITE COLLABORATOR MODAL */}
      <Modal open={showInviteModal} onClose={()=>{setShowInviteModal(false);setAuthError("");}} title="Convidar Colaborador">
        <div style={{background:"linear-gradient(135deg,#6366f120,#8b5cf620)",border:"1px solid #6366f140",borderRadius:10,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <UserPlus size={20} color="#6366f1"/>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Convite por Email + Setor + Grupo de Combate</div>
            <div style={{fontSize:11,color:"#94a3b8"}}>Escolha o setor e o GC do colaborador. Ele receberá acesso e poderá entrar com Google.</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp label="Nome completo" value={inviteName} onChange={setInviteName} placeholder="Ex: Amanda Silva"/>
          <Inp label="Email do colaborador" value={inviteEmail} onChange={setInviteEmail} placeholder="email@colaborador.com" type="email"/>
          <Sel label="Setor / Função" value={inviteRole} onChange={setInviteRole} options={Object.entries(ROLES).map(([k,v])=>({value:k.toLowerCase(),label:v.label}))}/>

          {/* GC SELECTION */}
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".04em",marginBottom:6,display:"block"}}>Grupo de Combate</label>
            <div style={{display:"flex",gap:8}}>
              {Object.values(GC_TEAMS).map(gc=>(
                <button key={gc.id} onClick={()=>setInviteGC(gc.id)}
                  style={{flex:1,padding:"14px 12px",borderRadius:12,border:`2px solid ${inviteGC===gc.id?gc.color:"#334155"}`,
                    background:inviteGC===gc.id?`${gc.color}15`:"#1e293b",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                  <div style={{fontSize:24}}>{gc.icon}</div>
                  <div style={{fontSize:14,fontWeight:800,color:inviteGC===gc.id?gc.color:"#94a3b8",marginTop:4}}>{gc.name}</div>
                  <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{gc.id}</div>
                </button>
              ))}
            </div>
          </div>

          {/* PERMISSION SUMMARY */}
          <div style={{background:"#020617",borderRadius:10,padding:14,border:"1px solid #1e293b"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#64748b",textTransform:"uppercase",marginBottom:6}}>Resumo do convite</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              <Bg color={ROLES[inviteRole.toUpperCase()]?.color||"#64748b"}>{ROLES[inviteRole.toUpperCase()]?.label||inviteRole}</Bg>
              <Bg color={GC_TEAMS[inviteGC]?.color}>{GC_TEAMS[inviteGC]?.icon} {GC_TEAMS[inviteGC]?.name}</Bg>
            </div>
            {inviteRole==="admin"&&<p style={{fontSize:12,color:"#e2e8f0",margin:0}}>Acesso total: vê tudo, cria e edita fluxos, gerencia usuários, dashboards completos.</p>}
            {inviteRole==="cs"&&<p style={{fontSize:12,color:"#e2e8f0",margin:0}}>Cadastra clientes, inicia onboarding, registra pagamentos, agenda reuniões.</p>}
            {inviteRole==="traffic"&&<p style={{fontSize:12,color:"#e2e8f0",margin:0}}>Setup de tráfego, campanhas, relatórios, checklist técnico nos clientes atribuídos.</p>}
            {inviteRole==="social"&&<p style={{fontSize:12,color:"#e2e8f0",margin:0}}>Planeja conteúdo, calendário editorial, pautas, aprovações nos clientes atribuídos.</p>}
            {inviteRole==="designer"&&<p style={{fontSize:12,color:"#e2e8f0",margin:0}}>Cria peças de feed, anúncios, loja virtual, atualiza entregas nos clientes atribuídos.</p>}
            {inviteRole==="filmmaker"&&<p style={{fontSize:12,color:"#e2e8f0",margin:0}}>Organiza vídeos, roteiros, captação, edição, aprovação nos clientes atribuídos.</p>}
            {inviteRole==="commercial"&&<p style={{fontSize:12,color:"#e2e8f0",margin:0}}>Registra vendas, acompanha clientes fechados, informações comerciais.</p>}
          </div>
        </div>
        {authError && <div style={{marginTop:10,padding:"8px 12px",background:"#ef444420",borderRadius:8,fontSize:12,color:"#fca5a5"}}>{authError}</div>}
        {inviteSent && <div style={{marginTop:10,padding:"8px 12px",background:"#22c55e20",borderRadius:8,fontSize:12,color:"#86efac",display:"flex",alignItems:"center",gap:6}}><CheckCircle2 size={14}/> Convite enviado com sucesso!</div>}
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
          <Btn variant="secondary" onClick={()=>{setShowInviteModal(false);setAuthError("");}}>Cancelar</Btn>
          <Btn onClick={()=>{setAuthError("");handleInvite();}} disabled={!inviteEmail||!inviteName} icon={SendIcon}>Enviar Convite</Btn>
        </div>
      </Modal>

      {/* ═══ TOAST POPUP NOTIFICATIONS (top-right corner like macOS) ═══ */}
      <div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none",maxWidth:380}}>
        {toasts.map((t,i) => (
          <div key={t.id} style={{
            background:t.type==="success"?"linear-gradient(135deg,#065f46,#064e3b)":"linear-gradient(135deg,#1e293b,#0f172a)",
            border:`1px solid ${t.type==="success"?"#10b981":"#334155"}`,
            borderRadius:14,padding:"14px 16px",
            boxShadow:"0 8px 32px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.3)",
            backdropFilter:"blur(12px)",
            pointerEvents:"auto",
            animation:"slideInRight .3s ease-out",
            display:"flex",alignItems:"flex-start",gap:10,
          }}>
            <div style={{width:32,height:32,borderRadius:8,background:t.type==="success"?"#10b98130":"#6366f130",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {t.type==="success"?<CheckCircle2 size={16} color="#10b981"/>:<Activity size={16} color="#6366f1"/>}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:2}}>Kanban Atualizado</div>
              <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.4}}>{t.message}</div>
              <div style={{fontSize:9,color:"#475569",marginTop:4}}>{new Date(t.time).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
            </div>
            <button onClick={()=>setToasts(prev=>prev.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:"#475569",cursor:"pointer",padding:2,flexShrink:0}}><X size={14}/></button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}`}</style>
    </div>
  );
}

// ═══ WRAP WITH ERROR BOUNDARY ═══
export default function AgenciaOS() {
  return React.createElement(ErrorBoundary, null, React.createElement(AgenciaOSApp));
}
