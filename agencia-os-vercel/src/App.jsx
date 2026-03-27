import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  ADMIN: { id: "admin", label: "Administrador", color: "#6366f1" },
  CS: { id: "cs", label: "Customer Success", color: "#06b6d4" },
  TRAFFIC: { id: "traffic", label: "Gestor de Tráfego", color: "#f59e0b" },
  SOCIAL: { id: "social", label: "Social Media", color: "#ec4899" },
  DESIGNER: { id: "designer", label: "Designer", color: "#8b5cf6" },
  FILMMAKER: { id: "filmmaker", label: "Filmmaker", color: "#ef4444" },
  COMMERCIAL: { id: "commercial", label: "Comercial", color: "#10b981" },
};

const KANBAN_COLUMNS = [
  { id: "venda_fechada", label: "Venda Fechada", color: "#6366f1", icon: "💼" },
  { id: "cs_inicial", label: "CS Inicial", color: "#06b6d4", icon: "📋" },
  { id: "cobranca_enviada", label: "Cobrança Enviada", color: "#f59e0b", icon: "💳" },
  { id: "pagamento_confirmado", label: "Pagamento Confirmado", color: "#10b981", icon: "✅" },
  { id: "onboarding_agendado", label: "Onboarding Agendado", color: "#8b5cf6", icon: "📅" },
  { id: "onboarding_concluido", label: "Onboarding Concluído", color: "#3b82f6", icon: "🎯" },
  { id: "alinhamento_visual", label: "Alinhamento Visual", color: "#ec4899", icon: "🎨" },
  { id: "setup_trafego", label: "Setup Tráfego", color: "#f97316", icon: "⚡" },
  { id: "trafego_ativo", label: "Tráfego Ativo", color: "#22c55e", icon: "🚀" },
  { id: "producao_andamento", label: "Produção", color: "#14b8a6", icon: "🔄" },
  { id: "operacao_semanal", label: "Operação Semanal", color: "#64748b", icon: "📊" },
  { id: "aguardando_cliente", label: "Aguardando Cliente", color: "#eab308", icon: "⏳" },
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
];

// ═══ GC SYSTEM (Grupos de Combate) ═══
const GC_TEAMS = {
  GC1: { id: "GC1", name: "Máquina de Guerra", color: "#ef4444", icon: "🔥" },
  GC2: { id: "GC2", name: "Tropa de Elite", color: "#6366f1", icon: "⚡" },
};

const SEED_USERS = [
  { id: "u1", name: "Thomas Macedo", email: "thomas98macedo@gmail.com", role: "admin", avatar: "TM", gc: null },
  { id: "u2", name: "Amanda Silva", email: "amanda@agencia.com", role: "cs", avatar: "AS", gc: "GC1" },
  { id: "u3", name: "Rafael Costa", email: "rafael@agencia.com", role: "traffic", avatar: "RC", gc: "GC1" },
  { id: "u4", name: "Juliana Mendes", email: "juliana@agencia.com", role: "social", avatar: "JM", gc: "GC2" },
  { id: "u5", name: "Lucas Ferreira", email: "lucas@agencia.com", role: "designer", avatar: "LF", gc: "GC1" },
  { id: "u6", name: "Bruno Santos", email: "bruno@agencia.com", role: "filmmaker", avatar: "BS", gc: "GC2" },
  { id: "u7", name: "Mariana Lima", email: "mariana@agencia.com", role: "commercial", avatar: "ML", gc: "GC2" },
];

const mkChecklist = (items) => items.map((text, i) => ({ id: `ck${i}`, text, done: false }));
const CS_CK = ["Contato criado","Cobrança gerada","Cobrança enviada","Pagamento confirmado","Grupo WhatsApp criado","Formulário enviado","Formulário respondido","Dados conferidos","Onboarding agendado"];
const OB_CK = ["Chamada agendada","Time apresentado","Pré-estratégia apresentada","Objetivos documentados","Referências visuais","Dores registradas","Diferenciais registrados","Ofertas prioritárias","Metas documentadas"];
const TR_CK = ["Acesso conta anúncios","Acesso página/Instagram","Pagamento validado","Ativos conectados","Estratégia definida","Campanha criada","Campanha publicada","Tráfego ativo"];
const CR_CK = ["Referências visuais","Estilo comunicação","Paleta analisada","Concorrentes analisados","Tipos criativos","Entregáveis mapeados","Calendário planejado"];

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
  return {
    id, company, contact:"", phone:"", email:"", segment:"",
    service, contractValue:value,
    closedDate: entryDate.toISOString(),
    paymentDate: paid ? new Date(entryDate.getTime()+2*DAY).toISOString() : null,
    status: kanban,
    priority: priority || (value >= 3000 ? "high" : "medium"),
    csId:"u2", trafficId:"u3", socialId: service.toLowerCase().includes("social") || service.toLowerCase().includes("tudo") ? "u4" : null,
    designerId:"u5", filmmakerId: service.toLowerCase().includes("video") || service.toLowerCase().includes("v/e") || service.toLowerCase().includes("e/v") || service.toLowerCase().includes("criativo") || service.toLowerCase().includes("tudo") ? "u6" : null,
    commercialId:"u7",
    whatsappGroup:"", formStatus: paid ? "responded" : "not_sent",
    onboardingDate: paid ? new Date(entryDate.getTime()+4*DAY).toISOString() : null,
    trafficActivationDate: paid && !isChurning && service.toLowerCase().includes("tráfego") || service.toLowerCase().includes("trafego") || service.toLowerCase().includes("tudo") ? new Date(entryDate.getTime()+5*DAY).toISOString() : null,
    notes: `${notes||""} ${payDay ? `Dia pgto: ${payDay}` : ""} ${contractEnd ? `Contrato: ${contractEnd}` : ""} ${isChurning ? "⚠️ CHURNING" : ""} ${isEncerrado ? "📦 ENCERRADO" : ""}`.trim(),
    payDay: payDay || null,
    contractEnd: contractEnd || null,
    churning: isChurning,
    encerrado: isEncerrado,
    csChecklist: mkChecklist(CS_CK).map((i,idx)=>({...i,done:paid?true:idx<3})),
    onboardingChecklist: mkChecklist(OB_CK).map(i=>({...i,done:!!paid})),
    trafficChecklist: mkChecklist(TR_CK).map(i=>({...i,done:!!paid && !isChurning})),
    creationChecklist: mkChecklist(CR_CK).map((i,idx)=>({...i,done:!!paid && idx<4})),
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
  { id:"t8", title:"Criar peças - Ótica Evox", clientId:"c22", assigneeId:"u5", sector:"designer", priority:"medium", status:"pending", dueDate:new Date(now+3*DAY).toISOString(), subtasks:[] },
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
// REAL GOOGLE CALENDAR DATA (synced live)
// ═══════════════════════════════════════════
const REAL_PERSONAL_EVENTS = [
  { id:"gp1", summary:"Ale Moby 14:30", start:"2026-03-25T14:20:00-03:00", end:"2026-03-25T15:20:00-03:00", calendar:"pessoal", color:"#22c55e" },
  { id:"gp2", summary:"Thomas - Consultoria Ruanna", start:"2026-03-25T18:00:00-03:00", end:"2026-03-25T19:00:00-03:00", calendar:"pessoal", color:"#22c55e", description:"Ruanna +55 98 8468-6231" },
  { id:"gp3", summary:"UBER CLNE THOMAS", start:"2026-03-26T12:00:00-03:00", end:"2026-03-26T13:00:00-03:00", calendar:"pessoal", color:"#22c55e" },
  { id:"gp4", summary:"Flight to Cuiabá (LA 3030)", start:"2026-03-26T15:00:00-03:00", end:"2026-03-26T17:25:00-03:00", calendar:"pessoal", color:"#3b82f6", location:"São Paulo CGH" },
  { id:"gp5", summary:"Call Kauan Cabral", start:"2026-03-26T21:00:00-03:00", end:"2026-03-26T22:00:00-03:00", calendar:"pessoal", color:"#22c55e" },
  { id:"gp6", summary:"Flight to São Paulo (LA 3033)", start:"2026-03-28T11:05:00-03:00", end:"2026-03-28T13:30:00-03:00", calendar:"pessoal", color:"#3b82f6", location:"Cuiabá CGB" },
];

const REAL_AGENCY_EVENTS = [
  { id:"ga1", summary:"CAPTAÇÕES DEBORA - MORY", start:"2026-03-25T09:30:00-03:00", end:"2026-03-25T13:30:00-03:00", calendar:"agência", color:"#f59e0b", description:"Conteúdo em dobro: Março e Abril" },
  { id:"ga2", summary:"ALINHAMENTO RELIVE - NANDO/THOMAS", start:"2026-03-25T10:00:00-03:00", end:"2026-03-25T11:00:00-03:00", calendar:"agência", color:"#22c55e" },
  { id:"ga3", summary:"Weekly - Auto Peças Fama", start:"2026-03-25T14:00:00-03:00", end:"2026-03-25T15:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga4", summary:"Weekly - Negocios com a China", start:"2026-03-25T16:00:00-03:00", end:"2026-03-25T17:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga5", summary:"Alinhamento geral - Levix", start:"2026-03-25T16:00:00-03:00", end:"2026-03-25T17:00:00-03:00", calendar:"agência", color:"#8b5cf6" },
  { id:"ga6", summary:"China Link - On", start:"2026-03-25T17:00:00-03:00", end:"2026-03-25T18:00:00-03:00", calendar:"agência", color:"#64748b" },
  { id:"ga7", summary:"CHINALINK NA ESTRADA", start:"2026-03-26T00:00:00-03:00", end:"2026-03-29T00:00:00-03:00", calendar:"agência", color:"#22c55e", allDay:true },
  { id:"ga8", summary:"Nathaly Castro - Texas - Thomas", start:"2026-03-26T09:00:00-03:00", end:"2026-03-26T12:00:00-03:00", calendar:"agência", color:"#22c55e" },
  { id:"ga9", summary:"Live sobre vendas online Chinalink", start:"2026-03-26T12:00:00-03:00", end:"2026-03-26T13:00:00-03:00", calendar:"agência", color:"#22c55e" },
  { id:"ga10", summary:"Weekly - Derma House", start:"2026-03-26T14:00:00-03:00", end:"2026-03-26T15:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga11", summary:"Alinhamento ID visual - GURU", start:"2026-03-26T15:00:00-03:00", end:"2026-03-26T16:00:00-03:00", calendar:"agência", color:"#eab308" },
  { id:"ga12", summary:"Weekly - Megatrucks", start:"2026-03-26T15:00:00-03:00", end:"2026-03-26T16:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga13", summary:"Captação Gabrielle - Vincenzo", start:"2026-03-26T18:00:00-03:00", end:"2026-03-26T19:45:00-03:00", calendar:"agência", color:"#ec4899" },
  { id:"ga14", summary:"Weekly - Scarf", start:"2026-03-27T14:00:00-03:00", end:"2026-03-27T15:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga15", summary:"Weekley - Alinhamento Comercial [Chinalink SUL]", start:"2026-03-27T15:00:00-03:00", end:"2026-03-27T16:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga16", summary:"Weekly - João Januário (alinhamento geral)", start:"2026-03-27T16:00:00-03:00", end:"2026-03-27T17:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga17", summary:"Weekly - Parrilo (META ADS)", start:"2026-03-30T14:00:00-03:00", end:"2026-03-30T15:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga18", summary:"Weekly - Mazzi (GOOGLE ADS)", start:"2026-03-30T15:00:00-03:00", end:"2026-03-30T16:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga19", summary:"Weekly - Time Comercial (chinaLink)", start:"2026-03-30T16:00:00-03:00", end:"2026-03-30T17:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga20", summary:"Weekly - Casa Souza Guedes", start:"2026-03-31T10:00:00-03:00", end:"2026-03-31T11:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga21", summary:"Weekly - Gabrielle", start:"2026-03-31T11:00:00-03:00", end:"2026-03-31T12:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga22", summary:"Weekly - Leads Lincoln", start:"2026-03-31T15:00:00-03:00", end:"2026-03-31T16:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga23", summary:"GENE ALINHAMENTO - NANDO", start:"2026-03-31T17:00:00-03:00", end:"2026-03-31T17:30:00-03:00", calendar:"agência", color:"#64748b", recurring:true },
  { id:"ga24", summary:"Weekly - Ferragens Vieira", start:"2026-04-01T10:00:00-03:00", end:"2026-04-01T11:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga25", summary:"Weekly - Bike Cajueiro", start:"2026-04-02T15:00:00-03:00", end:"2026-04-02T16:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga26", summary:"Weekly - Gymee", start:"2026-04-02T16:00:00-03:00", end:"2026-04-02T17:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga27", summary:"Weekly - Mafra", start:"2026-04-02T17:30:00-03:00", end:"2026-04-02T18:30:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga28", summary:"Weekly - Vagner Acessórios", start:"2026-04-03T14:00:00-03:00", end:"2026-04-03T15:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga29", summary:"Weekly - EG Beauty", start:"2026-04-03T15:00:00-03:00", end:"2026-04-03T16:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
  { id:"ga30", summary:"Weekly - Lira Sat", start:"2026-04-07T14:00:00-03:00", end:"2026-04-07T15:00:00-03:00", calendar:"agência", color:"#f97316", recurring:true },
];

const ALL_GCAL_EVENTS = [...REAL_PERSONAL_EVENTS, ...REAL_AGENCY_EVENTS].sort((a,b) => new Date(a.start) - new Date(b.start));

// ═══════════════════════════════════════════
// STORAGE HELPERS (localStorage for web deploy)
// ═══════════════════════════════════════════
async function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
async function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.error("Save error:", e); }
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
// MAIN APP
// ═══════════════════════════════════════════
export default function AgenciaOS() {
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState(DEFAULT_CLIENTS);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
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
  const [calEvents] = useState(ALL_GCAL_EVENTS);
  const calSynced = true;
  const [creatingEvent, setCreatingEvent] = useState(false);

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
    { email: "thomas98macedo@gmail.com", name: "Thomas Macedo", role: "admin", avatar: "TM", status: "active", invitedAt: new Date().toISOString() },
    { email: "cltmkt2@gmail.com", name: "CLT MKT", role: "admin", avatar: "CM", status: "active", invitedAt: new Date().toISOString() },
  ]);
  const [showInviteModal, setShowInviteModal] = useState(false);

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

  // Save authorized users when changed
  useEffect(() => {
    if (!authLoading) saveData("agos-authorized-users", authorizedUsers);
  }, [authorizedUsers, authLoading]);

  // Google Sign-In handler
  const handleGoogleSignIn = useCallback(() => {
    // Use Google Identity Services
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // Fallback: OAuth2 redirect flow
      const clientId = ""; // Will be set via env
      const redirectUri = window.location.origin + window.location.pathname;
      const scope = "email profile";
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&prompt=select_account`;

      // For demo/development: show manual email entry
      setAuthError("google_fallback");
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
    try { localStorage.removeItem("agos-session"); } catch(e) {}
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
    if (email === "thomas98macedo@gmail.com") return; // Can't remove owner
    setAuthorizedUsers(prev => prev.filter(u => u.email !== email));
  }, []);

  // Google Identity Services initialization
  useEffect(() => {
    if (authUser) return; // Already logged in
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
          callback: (response) => {
            try {
              // Decode JWT token
              const payload = JSON.parse(atob(response.credential.split(".")[1]));
              processLogin(payload.email, payload.name, payload.picture);
            } catch (e) {
              setAuthError("google_fallback");
            }
          },
          auto_select: false,
        });
      }
    };
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch(e) {} };
  }, [authUser, processLogin]);

  // New forms
  const emptyNC = {company:"",contact:"",phone:"",email:"",segment:"",contractValue:"",priority:"high",notes:"",
    trafficPlatforms:[],creativeOption:"",socialOption:"social_none",storePlatforms:[],gcTeam:"GC1"};
  const [nC, setNC] = useState({...emptyNC});
  const [nT, setNT] = useState({title:"",clientId:"",assigneeId:"",sector:"cs",priority:"medium",dueDate:""});
  const [nM, setNM] = useState({clientId:"",title:"",date:"",time:"10:00",duration:"60",notes:""});

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

  // Load persistent data
  useEffect(() => {
    (async () => {
      const c = await loadData("agos-clients", null);
      const t = await loadData("agos-tasks", null);
      const n = await loadData("agos-notifs", null);
      if(c) setClients(c);
      if(t) setTasks(t);
      if(n) setNotifications(n);
      setLoaded(true);
    })();
  }, []);

  // Save on changes
  useEffect(() => { if(loaded) saveData("agos-clients", clients); }, [clients, loaded]);
  useEffect(() => { if(loaded) saveData("agos-tasks", tasks); }, [tasks, loaded]);
  useEffect(() => { if(loaded) saveData("agos-notifs", notifications); }, [notifications, loaded]);

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

  const moveClient = (cid,newSt) => {
    setClients(p => p.map(c => {
      if(c.id!==cid) return c;
      const u = {...c, status:newSt, timeline:[...c.timeline,{date:new Date().toISOString(),event:`Movido → ${KANBAN_COLUMNS.find(k=>k.id===newSt)?.label}`,user:"Thomas"}]};
      if(newSt==="pagamento_confirmado"&&!c.paymentDate) { u.paymentDate=new Date().toISOString(); u.timeline.push({date:new Date().toISOString(),event:"Pagamento confirmado — SLA 48h",user:"Sistema"}); }
      if(newSt==="trafego_ativo"&&!c.trafficActivationDate) { u.trafficActivationDate=new Date().toISOString(); u.timeline.push({date:new Date().toISOString(),event:"Tráfego ativado!",user:"Thomas"}); }
      if(newSt==="onboarding_concluido"&&!c.onboardingDate) u.onboardingDate=new Date().toISOString();
      // ═══ ONBOARDING NOTIFICATION — notify all collaborators ═══
      if(newSt==="onboarding_agendado"||newSt==="onboarding_concluido") {
        const products = c.products || {};
        const prodList = c.service || "serviços contratados";
        const gcLabel = c.gcTeam ? GC_TEAMS[c.gcTeam]?.name : "";
        const notifMsg = `🚀 ONBOARDING: ${c.company} entrou em ${KANBAN_COLUMNS.find(k=>k.id===newSt)?.label}! Produtos: ${prodList}${gcLabel ? ` | ${gcLabel}` : ""}`;
        setTimeout(() => {
          setNotifications(prev => [
            { id:`n${uid()}`, type:"alert", message:notifMsg, time:new Date().toISOString(), read:false, clientId:c.id },
            ...prev
          ]);
        }, 100);
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

    // Auto-assign sectors based on products
    const gcUsers = SEED_USERS.filter(u => u.gc === nC.gcTeam);
    const findByRole = (role) => gcUsers.find(u => u.role === role)?.id || SEED_USERS.find(u => u.role === role)?.id || null;

    const c = {
      id:`c${uid()}`, company:nC.company, contact:nC.contact, phone:nC.phone, email:nC.email,
      segment:nC.segment, service:serviceDesc, contractValue:Number(nC.contractValue)||0,
      closedDate:new Date().toISOString(), paymentDate:null, status:"venda_fechada",
      priority:nC.priority,
      // Auto-assigned by sector
      csId: findByRole("cs"),
      trafficId: hasTraffic ? findByRole("traffic") : null,
      socialId: hasSocial ? findByRole("social") : null,
      designerId: hasCreative ? findByRole("designer") : null,
      filmmakerId: hasCreative ? findByRole("filmmaker") : null,
      commercialId: findByRole("commercial"),
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
      trafficChecklist:mkChecklist(TR_CK), creationChecklist:mkChecklist(CR_CK),
      timeline:[{date:new Date().toISOString(),event:`Venda fechada — ${serviceDesc} | ${GC_TEAMS[nC.gcTeam]?.name||""}`,user:"Thomas"}],
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
    setNotifications(p=>[{id:`n${uid()}`,type:"info",message:`🆕 Nova venda: ${c.company} — R$${c.contractValue?.toLocaleString("pt-BR")} | ${prodSummary} | ${GC_TEAMS[nC.gcTeam]?.icon} ${GC_TEAMS[nC.gcTeam]?.name}`,time:new Date().toISOString(),read:false,clientId:c.id},...p]);
    setShowNewClient(false);
    setNC({...emptyNC});
  };

  const createTask = () => {
    setTasks(p=>[{id:`t${uid()}`,...nT,status:"pending",subtasks:[]},...p]);
    setShowNewTask(false);
    setNT({title:"",clientId:"",assigneeId:"",sector:"cs",priority:"medium",dueDate:""});
  };

  // Derived
  const active = clients.filter(c=>c.status!=="concluido");
  const onboarding = clients.filter(c=>["cs_inicial","cobranca_enviada","pagamento_confirmado","onboarding_agendado","onboarding_concluido"].includes(c.status));
  const awaitPay = clients.filter(c=>["cs_inicial","cobranca_enviada"].includes(c.status));
  const trafficOn = clients.filter(c=>c.trafficActivationDate);
  const overdueC = clients.filter(c=>{ const s=getSLA(c.paymentDate,c.trafficActivationDate); return s&&s.status==="critical"; });
  const overdueT = tasks.filter(t=>t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date());
  const filtered = search ? clients.filter(c=>c.company.toLowerCase().includes(search.toLowerCase())||c.contact.toLowerCase().includes(search.toLowerCase())) : clients;

  const navItems = [
    {id:"dashboard",icon:LayoutDashboard,label:"Dashboard"},
    {id:"kanban",icon:Kanban,label:"Kanban"},
    {id:"clients",icon:Building2,label:"Clientes"},
    {id:"tasks",icon:ListTodo,label:"Tarefas"},
    {id:"calendar",icon:CalendarDays,label:"Reuniões"},
    {id:"lince",icon:LineChart,label:"Lince"},
    {id:"reports",icon:BarChart3,label:"Relatórios"},
    {id:"team",icon:Users,label:"Equipe"},
    {id:"settings",icon:Settings,label:"Config"},
  ];

  // ═══════════════════════════════════════════
  // PAGES
  // ═══════════════════════════════════════════

  const Dashboard = () => (
    <div style={{padding:20,maxWidth:1400,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h1 style={{fontSize:22,fontWeight:800,color:"#f1f5f9",margin:0}}>Dashboard</h1><p style={{color:"#64748b",fontSize:12,margin:"2px 0 0"}}>Visão geral • Google Calendar sincronizado</p></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
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
              <Av i={c.company.slice(0,2).toUpperCase()} c={col?.color} s={32}/>
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
              {calSynced&&<Bg color="#22c55e" small><Wifi size={10}/> Conectado</Bg>}
            </h3>
            <Btn variant="ghost" small icon={CheckCircle2}>Conectado</Btn>
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
            <div style={{width:3,height:24,borderRadius:3,background:PRIORITIES[t.priority].color}}/>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{t.title}</div><div style={{fontSize:10,color:"#64748b"}}>{cl?.company} • {u?.name}</div></div>
            <span style={{fontSize:10,color:new Date(t.dueDate)<new Date()?"#ef4444":"#64748b"}}>{fmt(t.dueDate)}</span>
          </div>
        );})}
      </div>
    </div>
  );

  const KanbanPage = () => (
    <div style={{padding:"16px 0 16px 16px",height:"calc(100vh - 56px)",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,paddingRight:16}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:0}}>Kanban</h1>
        <Btn onClick={()=>setShowNewClient(true)} icon={Plus} small>Novo Cliente</Btn>
      </div>
      <div style={{flex:1,display:"flex",gap:10,overflowX:"auto",overflowY:"hidden",paddingBottom:8,paddingRight:16}}>
        {KANBAN_COLUMNS.map(col=>{
          const cc=filtered.filter(c=>c.status===col.id);
          return <div key={col.id} onDragOver={e=>e.preventDefault()} onDrop={()=>{if(draggedId){moveClient(draggedId,col.id);setDraggedId(null);}}}
            style={{minWidth:260,width:260,background:"#0f172a",borderRadius:12,border:"1px solid #1e293b",display:"flex",flexDirection:"column",flexShrink:0,maxHeight:"100%"}}>
            <div style={{padding:"10px 12px",borderBottom:"1px solid #1e293b",display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:13}}>{col.icon}</span>
              <span style={{fontSize:12,fontWeight:700,color:"#e2e8f0",flex:1}}>{col.label}</span>
              <span style={{fontSize:10,fontWeight:700,color:col.color,background:`${col.color}20`,padding:"1px 7px",borderRadius:10}}>{cc.length}</span>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:6,display:"flex",flexDirection:"column",gap:6}}>
              {cc.map(c=>{const sla=getSLA(c.paymentDate,c.trafficActivationDate);return(
                <div key={c.id} draggable onDragStart={()=>setDraggedId(c.id)} onDragEnd={()=>setDraggedId(null)} onClick={()=>openClient(c.id)}
                  style={{background:"#020617",border:`1px solid ${draggedId===c.id?col.color:"#1e293b"}`,borderRadius:10,padding:10,cursor:"grab",opacity:draggedId===c.id?.5:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9"}}>{c.company}</div>
                    <Bg color={PRIORITIES[c.priority].color} small>{PRIORITIES[c.priority].label}</Bg>
                  </div>
                  <div style={{fontSize:10,color:"#94a3b8",marginBottom:6}}>{c.contact} • {c.service}</div>
                  {sla&&sla.status!=="done"&&<div style={{marginBottom:6}}><SLABg sla={sla}/>{sla.pct!==undefined&&<div style={{marginTop:3}}><PB v={sla.pct} m={100} c={sla.color} h={3}/></div>}</div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:2}}>{getUser(c.csId)&&<Av i={getUser(c.csId).avatar} c={ROLES.CS.color} s={20}/>}{getUser(c.trafficId)&&<Av i={getUser(c.trafficId).avatar} c={ROLES.TRAFFIC.color} s={20}/>}</div>
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
  );

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
              {filtered.map(c=>{const col=KANBAN_COLUMNS.find(k=>k.id===c.status);const sla=getSLA(c.paymentDate,c.trafficActivationDate);const cs=getUser(c.csId);return(
                <tr key={c.id} onClick={()=>openClient(c.id)} style={{borderBottom:"1px solid #1e293b30",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#1e293b30"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"8px 12px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av i={c.company.slice(0,2).toUpperCase()} c={col?.color} s={28}/><span style={{fontWeight:600,color:"#f1f5f9"}}>{c.company}</span></div></td>
                  <td style={{padding:"8px 12px",color:"#94a3b8"}}>{c.contact}</td>
                  <td style={{padding:"8px 12px",color:"#94a3b8"}}>{c.service}</td>
                  <td style={{padding:"8px 12px",color:"#e2e8f0",fontWeight:600}}>R${c.contractValue?.toLocaleString("pt-BR")}</td>
                  <td style={{padding:"8px 12px"}}><Bg color={col?.color} small>{col?.icon} {col?.label}</Bg></td>
                  <td style={{padding:"8px 12px"}}>{cs&&<Av i={cs.avatar} c={ROLES.CS.color} s={22}/>}</td>
                  <td style={{padding:"8px 12px"}}><SLABg sla={sla}/></td>
                  <td style={{padding:"8px 12px"}}><Bg color={PRIORITIES[c.priority].color} small>{PRIORITIES[c.priority].label}</Bg></td>
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
                <Bg color={PRIORITIES[client.priority].color}><Flag size={9}/> {PRIORITIES[client.priority].label}</Bg>
                <SLABg sla={sla}/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <Btn onClick={()=>{setNM({...nM,clientId:client.id,title:`Reunião × ${client.company}`});setShowNewMeeting(true);}} icon={CalendarDays} small variant="secondary">Agendar no Google Cal</Btn>
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
          {[{u:getUser(client.csId),r:"CS"},{u:getUser(client.trafficId),r:"Tráfego"},{u:getUser(client.socialId),r:"Social"},{u:getUser(client.designerId),r:"Design"},{u:getUser(client.filmmakerId),r:"Vídeo"}].map(({u,r})=>u&&<div key={r} style={{display:"flex",alignItems:"center",gap:4,background:"#020617",padding:"3px 8px 3px 3px",borderRadius:16}}><Av i={u.avatar} c={ROLES[u.role.toUpperCase()]?.color} s={18}/><span style={{fontSize:10,color:"#94a3b8"}}>{r}: <strong style={{color:"#e2e8f0"}}>{u.name.split(" ")[0]}</strong></span></div>)}
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
            <Bg color={PRIORITIES[t.priority].color} small>{PRIORITIES[t.priority].label}</Bg>
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

  const TasksPage = () => {
    const sectors=["all","cs","traffic","social","designer","filmmaker"];
    const sLabels={all:"Todos",cs:"CS",traffic:"Tráfego",social:"Social",designer:"Design",filmmaker:"Vídeo"};
    const f=taskFilter==="all"?tasks:tasks.filter(t=>t.sector===taskFilter);
    return <div style={{padding:20,maxWidth:1200,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:0}}>Tarefas</h1>
        <Btn onClick={()=>setShowNewTask(true)} icon={Plus} small>Nova</Btn>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:12}}>{sectors.map(s=><Tab key={s} active={taskFilter===s} onClick={()=>setTaskFilter(s)}>{sLabels[s]}</Tab>)}</div>
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12}}>
        {f.map(t=>{const cl=clients.find(c=>c.id===t.clientId);const u=getUser(t.assigneeId);const ov=t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date();return(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:"1px solid #1e293b30"}}>
            <button onClick={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,status:x.status==="done"?"pending":"done"}:x))} style={{background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>{t.status==="done"?<CheckCircle2 size={18} color="#22c55e"/>:t.status==="in_progress"?<PlayCircle size={18} color="#6366f1"/>:<Circle size={18} color="#475569"/>}</button>
            <div style={{width:3,height:28,borderRadius:3,background:PRIORITIES[t.priority]?.color,flexShrink:0}}/>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:t.status==="done"?"#64748b":"#e2e8f0",textDecoration:t.status==="done"?"line-through":"none"}}>{t.title}</div><div style={{fontSize:10,color:"#64748b"}}>{cl?.company}{t.subtasks?.length>0&&` • ${t.subtasks.filter(s=>s.done).length}/${t.subtasks.length}`}</div></div>
            {u&&<Av i={u.avatar} c={ROLES[u.role.toUpperCase()]?.color} s={24}/>}
            <Bg color={PRIORITIES[t.priority]?.color} small>{PRIORITIES[t.priority]?.label}</Bg>
            {t.dueDate&&<span style={{fontSize:10,color:ov?"#ef4444":"#64748b",fontWeight:ov?700:400}}>{fmt(t.dueDate)}</span>}
          </div>
        );})}
      </div>
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

          <Bg color="#22c55e" small><Wifi size={9}/> GCal Conectado</Bg>
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

  const TeamPage = () => <div style={{padding:20,maxWidth:1200,margin:"0 auto"}}>
    <h1 style={{fontSize:20,fontWeight:800,color:"#f1f5f9",margin:"0 0 16px"}}>Equipe</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
      {SEED_USERS.map(u=>{const role=ROLES[u.role.toUpperCase()];const uT=tasks.filter(t=>t.assigneeId===u.id);const uC=clients.filter(c=>[c.csId,c.trafficId,c.socialId,c.designerId,c.filmmakerId].includes(u.id));return(
        <div key={u.id} style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><Av i={u.avatar} c={role?.color} s={44}/><div><div style={{fontSize:15,fontWeight:700,color:"#f1f5f9"}}>{u.name}</div><Bg color={role?.color}>{role?.label}</Bg></div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <div style={{textAlign:"center",padding:6,background:"#020617",borderRadius:8}}><div style={{fontSize:16,fontWeight:800,color:"#e2e8f0"}}>{uC.length}</div><div style={{fontSize:9,color:"#64748b"}}>Clientes</div></div>
            <div style={{textAlign:"center",padding:6,background:"#020617",borderRadius:8}}><div style={{fontSize:16,fontWeight:800,color:"#e2e8f0"}}>{uT.length}</div><div style={{fontSize:9,color:"#64748b"}}>Tarefas</div></div>
            <div style={{textAlign:"center",padding:6,background:"#020617",borderRadius:8}}><div style={{fontSize:16,fontWeight:800,color:uT.filter(t=>t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date()).length>0?"#ef4444":"#e2e8f0"}}>{uT.filter(t=>t.status!=="done"&&t.dueDate&&new Date(t.dueDate)<new Date()).length}</div><div style={{fontSize:9,color:"#64748b"}}>Atrasadas</div></div>
          </div>
        </div>
      );})}
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
            {authorizedUsers.map(u=>{const role=ROLES[u.role?.toUpperCase()];const gc=GC_TEAMS[u.gc];return(
              <tr key={u.email} style={{borderBottom:"1px solid #1e293b30"}}>
                <td style={{padding:"8px 10px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Av i={u.avatar||"??"} c={role?.color||"#64748b"} s={28}/><span style={{fontWeight:600,color:"#e2e8f0"}}>{u.name}</span></div></td>
                <td style={{padding:"8px 10px",color:"#94a3b8"}}>{u.email}</td>
                <td style={{padding:"8px 10px"}}><Bg color={role?.color||"#64748b"} small>{role?.label||u.role}</Bg></td>
                <td style={{padding:"8px 10px"}}>{gc?<Bg color={gc.color} small>{gc.icon} {gc.name}</Bg>:<span style={{color:"#475569",fontSize:11}}>—</span>}</td>
                <td style={{padding:"8px 10px"}}><Bg color={u.status==="active"?"#22c55e":"#f59e0b"} small>{u.status==="active"?"Ativo":"Convidado"}</Bg></td>
                <td style={{padding:"8px 10px"}}>{u.email!=="thomas98macedo@gmail.com"&&<button onClick={()=>handleRemoveUser(u.email)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:11,fontWeight:600}}>Remover</button>}</td>
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
      <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#e2e8f0",display:"flex",alignItems:"center",gap:6}}><Wifi size={14} color="#22c55e"/> Google Calendar Integrado</h3>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>Calendário conectado: <strong style={{color:"#e2e8f0"}}>thomas98macedo@gmail.com</strong></div>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>Calendário da agência: <strong style={{color:"#e2e8f0"}}>cltmkt2@gmail.com</strong></div>
      <div style={{fontSize:12,color:"#94a3b8"}}>Timezone: <strong style={{color:"#e2e8f0"}}>America/Sao_Paulo</strong></div>
      <div style={{marginTop:12}}><Btn icon={CheckCircle2} small variant="success">Conectado ✓</Btn></div>
    </div>
    <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:12}}>
      <h3 style={{margin:"0 0 12px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>Armazenamento Persistente</h3>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>Todos os dados são salvos automaticamente e persistem entre sessões.</div>
      <Btn onClick={async()=>{try{localStorage.removeItem("agos-clients");localStorage.removeItem("agos-tasks");localStorage.removeItem("agos-notifs");setClients(DEFAULT_CLIENTS);setTasks(DEFAULT_TASKS);setNotifications([]);}catch(e){}}} variant="danger" small icon={RotateCcw}>Resetar Dados</Btn>
    </div>
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

  const LincePage = () => (
    <div style={{height:"calc(100vh - 56px)",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",borderBottom:"1px solid #1e293b",background:"#0f172a",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center"}}><LineChart size={16} color="#fff"/></div>
          <div>
            <h2 style={{margin:0,fontSize:16,fontWeight:800,color:"#f1f5f9"}}>Lince Dashboard</h2>
            <span style={{fontSize:10,color:"#64748b"}}>Métricas de performance em tempo real</span>
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <Bg color="#06b6d4" small><Wifi size={9}/> Ao Vivo</Bg>
          <a href="https://lince-dashboard.vercel.app/" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:8,fontSize:11,fontWeight:600,color:"#94a3b8",background:"#1e293b",border:"1px solid #334155",textDecoration:"none",cursor:"pointer"}}><ExternalLink size={12}/> Abrir em nova aba</a>
        </div>
      </div>
      <div style={{flex:1,position:"relative",background:"#020617"}}>
        <iframe
          src="https://lince-dashboard.vercel.app/"
          style={{width:"100%",height:"100%",border:"none",borderRadius:0}}
          title="Lince Dashboard"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );

  const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard/>;
      case "kanban": return <KanbanPage/>;
      case "clients": return <ClientsPage/>;
      case "client_detail": return <ClientDetail/>;
      case "tasks": return <TasksPage/>;
      case "calendar": return <CalendarPage/>;
      case "lince": return <LincePage/>;
      case "reports": return <ReportsPage/>;
      case "team": return <TeamPage/>;
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
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:"#f1f5f9"}}>AgênciaOS</div><div style={{fontSize:9,color:"#6366f1",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase"}}>Live • Google Auth</div></div>
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
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Resumo — Setores atribuídos automaticamente</div>
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

          <div style={{gridColumn:"1/-1"}}><Inp label="Observações" value={nC.notes} onChange={v=>setNC({...nC,notes:v})} textarea placeholder="Notas sobre o cliente..."/></div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
          <Btn variant="secondary" onClick={()=>setShowNewClient(false)}>Cancelar</Btn>
          <Btn onClick={createClient} disabled={!nC.company||!nC.contact} icon={Check}>Criar Cliente</Btn>
        </div>
      </Modal>

      {/* NEW TASK */}
      <Modal open={showNewTask} onClose={()=>setShowNewTask(false)} title="Nova Tarefa">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp label="Título" value={nT.title} onChange={v=>setNT({...nT,title:v})}/>
          <Sel label="Cliente" value={nT.clientId} onChange={v=>setNT({...nT,clientId:v})} options={[{value:"",label:"Selecione"},...clients.map(c=>({value:c.id,label:c.company}))]}/>
          <Sel label="Responsável" value={nT.assigneeId} onChange={v=>setNT({...nT,assigneeId:v})} options={[{value:"",label:"Selecione"},...SEED_USERS.map(u=>({value:u.id,label:u.name}))]}/>
          <Sel label="Prioridade" value={nT.priority} onChange={v=>setNT({...nT,priority:v})} options={Object.entries(PRIORITIES).map(([k,v])=>({value:k,label:v.label}))}/>
          <Inp label="Prazo" value={nT.dueDate} onChange={v=>setNT({...nT,dueDate:v})} type="date"/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
          <Btn variant="secondary" onClick={()=>setShowNewTask(false)}>Cancelar</Btn>
          <Btn onClick={createTask} disabled={!nT.title} icon={Check}>Criar</Btn>
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
    </div>
  );
}
