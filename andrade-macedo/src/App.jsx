import { useEffect, useMemo, useRef, useState } from 'react'
import Lista from './components/Lista.jsx'
import Editor from './components/Editor.jsx'
import Configuracoes from './components/Configuracoes.jsx'
import Visualizacao from './components/Visualizacao.jsx'
import { LogoMark } from './components/Logo.jsx'
import { carregarEmpresa, carregarPropostas, exportarBackup, proximoSeq, salvarEmpresa, salvarPropostas } from './lib/storage.js'
import { novaProposta, numeroProposta, revisaoTxt, uid } from './lib/defaults.js'

function rotaAtual() {
  const h = window.location.hash.replace(/^#\/?/, '')
  const [tela, id] = h.split('/')
  return { tela: tela || 'lista', id }
}

function nomeArquivo(p) {
  const cli = (p.cliente.nome || 'cliente')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)
  return `Proposta-${numeroProposta(p).replace('/', '-')}-Rev${revisaoTxt(p)}-${cli}`
}

export default function App() {
  const [propostas, setPropostas] = useState(carregarPropostas)
  const [empresa, setEmpresa] = useState(carregarEmpresa)
  const [rota, setRota] = useState(rotaAtual)
  const [aba, setAba] = useState('editar') // mobile
  const [exportando, setExportando] = useState('')
  const [salvo, setSalvo] = useState(true)
  const raizRef = useRef(null)

  useEffect(() => {
    const f = () => setRota(rotaAtual())
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])

  useEffect(() => {
    setSalvo(false)
    const t = setTimeout(() => setSalvo(salvarPropostas(propostas)), 400)
    return () => clearTimeout(t)
  }, [propostas])
  useEffect(() => { salvarEmpresa(empresa) }, [empresa])

  const ir = (h) => { window.location.hash = h }
  const atual = useMemo(() => propostas.find((p) => p.id === rota.id), [propostas, rota.id])

  const atualizar = (p) => setPropostas((l) => l.map((x) => (x.id === p.id ? { ...p, atualizadoEm: new Date().toISOString() } : x)))

  const nova = () => {
    const ano = new Date().getFullYear()
    const p = novaProposta(proximoSeq(propostas, ano), ano)
    setPropostas((l) => [...l, p])
    setAba('editar')
    ir(`/proposta/${p.id}`)
  }
  const copiar = (id, comoRevisao) => {
    const orig = propostas.find((p) => p.id === id)
    if (!orig) return
    const ano = new Date().getFullYear()
    const agora = new Date().toISOString()
    const c = JSON.parse(JSON.stringify(orig))
    Object.assign(c, { id: uid(), criadoEm: agora, atualizadoEm: agora, status: 'rascunho' })
    if (comoRevisao) {
      const revs = propostas.filter((p) => p.seq === orig.seq && p.ano === orig.ano).map((p) => p.revisao)
      c.revisao = Math.max(...revs) + 1
    } else {
      c.ano = ano
      c.seq = proximoSeq(propostas, ano)
      c.revisao = 0
      c.cliente = { nome: '', documento: '', telefone: '', email: '' }
      c.local = { endereco: '', condominio: '' }
    }
    c.dataEmissao = agora.slice(0, 10)
    setPropostas((l) => [...l, c])
    ir(`/proposta/${c.id}`)
  }
  const excluir = (id) => {
    const p = propostas.find((x) => x.id === id)
    if (p && confirm(`Excluir a proposta ${numeroProposta(p)} (Rev. ${revisaoTxt(p)})? Esta ação não pode ser desfeita.`)) {
      setPropostas((l) => l.filter((x) => x.id !== id))
      if (rota.id === id) ir('/')
    }
  }
  const importar = async (arquivo) => {
    try {
      const dados = JSON.parse(await arquivo.text())
      const lista = Array.isArray(dados) ? dados : dados.propostas
      if (!Array.isArray(lista)) throw new Error()
      const ids = new Set(propostas.map((p) => p.id))
      const novas = lista.filter((p) => p && p.id && !ids.has(p.id))
      if (!confirm(`Importar ${novas.length} proposta(s) nova(s)${dados.empresa ? ' e os dados da empresa' : ''}?`)) return
      setPropostas((l) => [...l, ...novas])
      if (dados.empresa) setEmpresa((e) => ({ ...e, ...dados.empresa }))
    } catch {
      alert('Arquivo de backup inválido.')
    }
  }

  const exportar = async (tipo) => {
    if (!raizRef.current || exportando) return
    const nome = nomeArquivo(atual)
    const prog = (i, n) => setExportando(`Gerando página ${i} de ${n}…`)
    try {
      setExportando('Preparando…')
      const { exportarPDF, exportarPNGs, exportarPNGUnico } = await import('./lib/exportar.js')
      if (tipo === 'pdf') await exportarPDF(raizRef.current, nome, prog)
      else if (tipo === 'png-zip') await exportarPNGs(raizRef.current, nome, prog)
      else await exportarPNGUnico(raizRef.current, nome, prog)
    } catch (err) {
      console.error(err)
      alert('Não foi possível gerar o arquivo. Tente novamente.')
    } finally {
      setExportando('')
    }
  }

  return (
    <div className="app">
      <header className="topo">
        <a className="marca" href="#/">
          <LogoMark width={40} />
          <span>
            <b>ANDRADE MACEDO</b>
            <small>Propostas Técnico-Comerciais</small>
          </span>
        </a>
        <nav>
          <a href="#/" className={rota.tela === 'lista' || rota.tela === 'proposta' ? 'ativo' : ''}>Propostas</a>
          <a href="#/configuracoes" className={rota.tela === 'configuracoes' ? 'ativo' : ''}>Configurações</a>
        </nav>
      </header>

      {rota.tela === 'configuracoes' && <Configuracoes empresa={empresa} onChange={setEmpresa} />}

      {rota.tela === 'proposta' && atual && (
        <div className="area-editor">
          <div className="barra">
            <button type="button" className="btn-link" onClick={() => ir('/')}>← Propostas</button>
            <div className="barra-titulo">
              <b>{numeroProposta(atual)}</b> <span>Rev. {revisaoTxt(atual)}</span>
              <span className={`salvo${salvo ? '' : ' pend'}`}>{salvo ? 'Salvo' : 'Salvando…'}</span>
            </div>
            <div className="barra-acoes">
              <button type="button" className="btn-pri" disabled={!!exportando} onClick={() => exportar('pdf')}>Baixar PDF</button>
              <button type="button" className="btn-sec" disabled={!!exportando} onClick={() => exportar('png-zip')} title="Uma imagem PNG por página, em um arquivo .zip">PNG por página</button>
              <button type="button" className="btn-sec" disabled={!!exportando} onClick={() => exportar('png')} title="Todas as páginas em uma única imagem PNG">PNG único</button>
            </div>
          </div>
          <div className="abas-mobile">
            <button type="button" className={aba === 'editar' ? 'ativo' : ''} onClick={() => setAba('editar')}>Editar</button>
            <button type="button" className={aba === 'ver' ? 'ativo' : ''} onClick={() => setAba('ver')}>Visualizar</button>
          </div>
          <div className={`paineis aba-${aba}`}>
            <div className="painel-editor">
              <Editor p={atual} onChange={atualizar} />
            </div>
            <div className="painel-preview">
              <Visualizacao proposta={atual} empresa={empresa} raizRef={raizRef} />
            </div>
          </div>
          {exportando && <div className="toast">{exportando}</div>}
        </div>
      )}

      {rota.tela === 'proposta' && !atual && (
        <div className="pagina-app"><p>Proposta não encontrada. <a href="#/">Voltar</a></p></div>
      )}

      {rota.tela === 'lista' && (
        <Lista
          propostas={propostas}
          onNova={nova}
          onAbrir={(id) => ir(`/proposta/${id}`)}
          onDuplicar={(id) => copiar(id, false)}
          onRevisao={(id) => copiar(id, true)}
          onExcluir={excluir}
          onBackup={() => exportarBackup(propostas, empresa)}
          onImportar={importar}
        />
      )}
    </div>
  )
}
