import { useMemo, useRef, useState } from 'react'
import { STATUS, numeroProposta, revisaoTxt } from '../lib/defaults.js'
import { dataBR, moeda, parseMoeda } from '../lib/format.js'

export default function Lista({ propostas, onNova, onAbrir, onDuplicar, onRevisao, onExcluir, onBackup, onImportar }) {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('todas')
  const inputArquivo = useRef(null)

  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return [...propostas]
      .sort((a, b) => (b.atualizadoEm || '').localeCompare(a.atualizadoEm || ''))
      .filter((p) => filtro === 'todas' || p.status === filtro)
      .filter((p) => !q || [numeroProposta(p), p.cliente.nome, p.tituloServico, p.objeto.descricaoPrincipal, p.local.endereco]
        .join(' ').toLowerCase().includes(q))
  }, [propostas, busca, filtro])

  const aprovadas = propostas.filter((p) => p.status === 'aprovada')
  const totalAprovado = aprovadas.reduce((s, p) => s + parseMoeda(p.valorTotal), 0)

  return (
    <div className="pagina-app">
      <div className="lista-topo">
        <div>
          <h1 className="titulo-app">Propostas</h1>
          <p className="sub-app">
            {propostas.length} {propostas.length === 1 ? 'proposta' : 'propostas'}
            {aprovadas.length > 0 && <> · {aprovadas.length} aprovada{aprovadas.length > 1 ? 's' : ''} ({moeda(totalAprovado)})</>}
          </p>
        </div>
        <button type="button" className="btn-pri" onClick={onNova}>+ Nova proposta</button>
      </div>

      <div className="filtros">
        <input className="busca" placeholder="Buscar por cliente, número, serviço…" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <div className="segmentos">
          {[['todas', 'Todas'], ...Object.entries(STATUS).map(([k, v]) => [k, v.label])].map(([k, l]) => (
            <button type="button" key={k} className={filtro === k ? 'ativo' : ''} onClick={() => setFiltro(k)}>{l}</button>
          ))}
        </div>
      </div>

      {propostas.length === 0 ? (
        <div className="vazio">
          <div className="vazio-t">Nenhuma proposta ainda</div>
          <p>Crie a primeira proposta técnico-comercial. O número é gerado automaticamente (AM-PC-001/{new Date().getFullYear()}).</p>
          <button type="button" className="btn-pri" onClick={onNova}>Criar primeira proposta</button>
        </div>
      ) : (
        <div className="cards">
          {visiveis.map((p) => (
            <article className="card" key={p.id} onClick={() => onAbrir(p.id)}>
              <div className="card-top">
                <span className="card-num">{numeroProposta(p)} <small>Rev. {revisaoTxt(p)}</small></span>
                <span className="status" style={{ '--c': STATUS[p.status]?.cor }}>{STATUS[p.status]?.label}</span>
              </div>
              <div className="card-cli">{p.cliente.nome || <span className="mudo">Cliente não informado</span>}</div>
              <div className="card-serv">{p.tituloServico || p.objeto.descricaoPrincipal || <span className="mudo">Serviço não informado</span>}</div>
              <div className="card-base">
                <span className="card-valor">{parseMoeda(p.valorTotal) ? moeda(parseMoeda(p.valorTotal)) : '—'}</span>
                <span className="mudo">Emissão {dataBR(p.dataEmissao)}</span>
              </div>
              <div className="card-acoes" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => onAbrir(p.id)}>Abrir</button>
                <button type="button" onClick={() => onDuplicar(p.id)}>Duplicar</button>
                <button type="button" onClick={() => onRevisao(p.id)}>Nova revisão</button>
                <button type="button" className="perigo" onClick={() => onExcluir(p.id)}>Excluir</button>
              </div>
            </article>
          ))}
          {visiveis.length === 0 && <p className="mudo">Nenhuma proposta encontrada.</p>}
        </div>
      )}

      <div className="backup">
        <span>Os dados ficam salvos neste navegador. Faça backup periodicamente:</span>
        <button type="button" className="btn-link" onClick={onBackup}>Exportar backup (.json)</button>
        <button type="button" className="btn-link" onClick={() => inputArquivo.current?.click()}>Importar backup</button>
        <input ref={inputArquivo} type="file" accept="application/json,.json" hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportar(f); e.target.value = '' }} />
      </div>
    </div>
  )
}
