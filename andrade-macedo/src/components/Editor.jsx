import { useState } from 'react'
import {
  EXCLUSOES_PADRAO, MODALIDADES, PREMISSAS_PADRAO, RESP_AM, RESP_CLIENTE, RESP_MATERIAL, STATUS, numeroProposta, uid,
} from '../lib/defaults.js'
import { moeda, parseMoeda, somarDias } from '../lib/format.js'
import { valorPorExtenso } from '../lib/extenso.js'

function Grupo({ titulo, n, aberto: abertoInicial = false, children, resumo }) {
  const [aberto, setAberto] = useState(abertoInicial)
  return (
    <section className={`grupo${aberto ? ' aberto' : ''}`}>
      <button type="button" className="grupo-h" onClick={() => setAberto(!aberto)}>
        {n != null && <span className="grupo-n">{n}</span>}
        <span className="grupo-t">{titulo}</span>
        {resumo && !aberto && <span className="grupo-r">{resumo}</span>}
        <span className="grupo-seta">{aberto ? '−' : '+'}</span>
      </button>
      {aberto && <div className="grupo-b">{children}</div>}
    </section>
  )
}

function F({ rotulo, dica, children, largo }) {
  return (
    <label className={`f${largo ? ' largo' : ''}`}>
      <span className="f-r">{rotulo}</span>
      {children}
      {dica && <span className="f-d">{dica}</span>}
    </label>
  )
}

function ListaEditavel({ itens, onChange, padrao, rotuloAdd = 'Adicionar item' }) {
  const set = (i, v) => onChange(itens.map((t, j) => (j === i ? v : t)))
  return (
    <div className="lista-ed">
      {itens.map((t, i) => (
        <div className="lista-ed-i" key={i}>
          <textarea rows={1} value={t} onChange={(e) => set(i, e.target.value)} />
          <button type="button" className="icone-btn" title="Remover" onClick={() => onChange(itens.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <div className="linha-acoes">
        <button type="button" className="btn-sec peq" onClick={() => onChange([...itens, ''])}>+ {rotuloAdd}</button>
        {padrao && (
          <button type="button" className="btn-link" onClick={() => confirm('Restaurar o texto padrão desta lista?') && onChange([...padrao])}>
            Restaurar padrão
          </button>
        )}
      </div>
    </div>
  )
}

export default function Editor({ p, onChange }) {
  const up = (patch) => onChange({ ...p, ...patch })
  const upIn = (chave, patch) => onChange({ ...p, [chave]: { ...p[chave], ...patch } })

  const total = parseMoeda(p.valorTotal)
  const somaParcelas = p.pagamentos.reduce((s, x) => s + parseMoeda(x.valor), 0)
  const diferenca = Math.round((total - somaParcelas) * 100) / 100

  const toggleMod = (id) => {
    const tem = p.objeto.modalidades.includes(id)
    upIn('objeto', { modalidades: tem ? p.objeto.modalidades.filter((m) => m !== id) : [...p.objeto.modalidades, id] })
  }

  const setEscopo = (i, patch) => up({ escopo: p.escopo.map((it, j) => (j === i ? { ...it, ...patch } : it)) })
  const moverEscopo = (i, d) => {
    const arr = [...p.escopo]
    const j = i + d
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    up({ escopo: arr })
  }
  const setPag = (i, patch) => up({ pagamentos: p.pagamentos.map((it, j) => (j === i ? { ...it, ...patch } : it)) })

  return (
    <div className="editor">
      <Grupo titulo="Dados da proposta" aberto resumo={numeroProposta(p)}>
        <div className="grade">
          <F rotulo="Número">
            <div className="num-wrap">
              <span>AM-PC-</span>
              <input type="number" min="1" value={p.seq} onChange={(e) => up({ seq: Math.max(1, Number(e.target.value) || 1) })} />
              <span>/</span>
              <input type="number" value={p.ano} onChange={(e) => up({ ano: Number(e.target.value) || p.ano })} />
            </div>
          </F>
          <F rotulo="Revisão">
            <input type="number" min="0" value={p.revisao} onChange={(e) => up({ revisao: Math.max(0, Number(e.target.value) || 0) })} />
          </F>
          <F rotulo="Data de emissão">
            <input type="date" value={p.dataEmissao} onChange={(e) => up({ dataEmissao: e.target.value })} />
          </F>
          <F rotulo="Validade (dias corridos)">
            <input type="number" min="1" value={p.validadeDias} onChange={(e) => up({ validadeDias: e.target.value })} />
          </F>
          <F rotulo="Status">
            <select value={p.status} onChange={(e) => up({ status: e.target.value })}>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </F>
          <F rotulo="Título do serviço (capa)" largo dica="Ex.: Reforma parcial de apartamento residencial. Se vazio, usa a descrição principal do objeto.">
            <input value={p.tituloServico} onChange={(e) => up({ tituloServico: e.target.value })} />
          </F>
        </div>
      </Grupo>

      <Grupo n="1" titulo="Contratante e local" aberto resumo={p.cliente.nome}>
        <div className="grade">
          <F rotulo="Nome / Razão social" largo>
            <input value={p.cliente.nome} onChange={(e) => upIn('cliente', { nome: e.target.value })} />
          </F>
          <F rotulo="CPF / CNPJ">
            <input value={p.cliente.documento} onChange={(e) => upIn('cliente', { documento: e.target.value })} />
          </F>
          <F rotulo="Telefone">
            <input value={p.cliente.telefone} onChange={(e) => upIn('cliente', { telefone: e.target.value })} />
          </F>
          <F rotulo="E-mail" largo>
            <input type="email" value={p.cliente.email} onChange={(e) => upIn('cliente', { email: e.target.value })} />
          </F>
          <F rotulo="Endereço do local dos serviços" largo>
            <input value={p.local.endereco} onChange={(e) => upIn('local', { endereco: e.target.value })} />
          </F>
          <F rotulo="Condomínio / Empreendimento (opcional)" largo>
            <input value={p.local.condominio} onChange={(e) => upIn('local', { condominio: e.target.value })} />
          </F>
        </div>
        <p className="ajuda">Os dados da contratada (CNPJ, endereço, contatos) ficam em <b>Configurações</b>.</p>
      </Grupo>

      <Grupo n="3" titulo="Objeto da proposta" resumo={p.objeto.descricaoPrincipal}>
        <div className="grade">
          <F rotulo="Descrição principal do serviço" largo dica='Completa a frase: "…tem por objeto a execução de ___, no imóvel…"'>
            <input value={p.objeto.descricaoPrincipal} onChange={(e) => upIn('objeto', { descricaoPrincipal: e.target.value })} />
          </F>
          <F rotulo="Descrição resumida" largo>
            <textarea rows={3} value={p.objeto.resumo} onChange={(e) => upIn('objeto', { resumo: e.target.value })}
              placeholder="Ex.: Reforma parcial de apartamento residencial, contemplando adequações civis, pintura, revestimentos e intervenções nas instalações elétricas e hidráulicas especificadas no escopo." />
          </F>
          <div className="f largo">
            <span className="f-r">Modalidade de contratação</span>
            <div className="checks">
              {MODALIDADES.map((m) => (
                <label key={m.id} className="check">
                  <input type="checkbox" checked={p.objeto.modalidades.includes(m.id)} onChange={() => toggleMod(m.id)} />
                  {m.label}
                </label>
              ))}
              <label className="check">
                <input type="checkbox" checked={p.objeto.modalidades.includes('outro')} onChange={() => toggleMod('outro')} />
                Outro
              </label>
            </div>
            {p.objeto.modalidades.includes('outro') && (
              <input placeholder="Descreva a outra modalidade" value={p.objeto.outraModalidade}
                onChange={(e) => upIn('objeto', { outraModalidade: e.target.value })} style={{ marginTop: 8 }} />
            )}
          </div>
        </div>
      </Grupo>

      <Grupo n="4" titulo="Escopo dos serviços" resumo={`${p.escopo.length} ${p.escopo.length === 1 ? 'item' : 'itens'}`}>
        <div className="escopo-ed">
          {p.escopo.map((it, i) => (
            <div className="escopo-i" key={it.id}>
              <div className="escopo-n">{String(i + 1).padStart(2, '0')}</div>
              <div className="escopo-c">
                <textarea rows={2} placeholder="Descrição do serviço" value={it.descricao} onChange={(e) => setEscopo(i, { descricao: e.target.value })} />
                <select value={it.material} onChange={(e) => setEscopo(i, { material: e.target.value })}>
                  {RESP_MATERIAL.map((r) => <option key={r} value={r}>Material: {r}</option>)}
                </select>
              </div>
              <div className="escopo-a">
                <button type="button" className="icone-btn" title="Subir" onClick={() => moverEscopo(i, -1)}>↑</button>
                <button type="button" className="icone-btn" title="Descer" onClick={() => moverEscopo(i, 1)}>↓</button>
                <button type="button" className="icone-btn" title="Remover" onClick={() => up({ escopo: p.escopo.filter((_, j) => j !== i) })}>×</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn-sec peq" onClick={() => up({ escopo: [...p.escopo, { id: uid(), descricao: '', material: 'Andrade Macedo' }] })}>
            + Adicionar serviço
          </button>
        </div>
        <label className="check" style={{ marginTop: 12 }}>
          <input type="checkbox" checked={!!p.planilhaAnexa} onChange={(e) => up({ planilhaAnexa: e.target.checked })} />
          Esta proposta possui planilha orçamentária anexa
        </label>
        <F rotulo="Observações do escopo (opcional)" largo>
          <textarea rows={2} value={p.observacoes} onChange={(e) => up({ observacoes: e.target.value })} />
        </F>
        <div className="f-r" style={{ marginTop: 14 }}>4.2 Exclusões</div>
        <ListaEditavel itens={p.exclusoes} onChange={(v) => up({ exclusoes: v })} padrao={EXCLUSOES_PADRAO} rotuloAdd="Adicionar exclusão" />
      </Grupo>

      <Grupo n="5" titulo="Premissas" resumo={`${p.premissas.length} premissas`}>
        <ListaEditavel itens={p.premissas} onChange={(v) => up({ premissas: v })} padrao={PREMISSAS_PADRAO} rotuloAdd="Adicionar premissa" />
      </Grupo>

      <Grupo n="6" titulo="Investimento e pagamento" aberto resumo={total ? moeda(total) : ''}>
        <div className="grade">
          <F rotulo="Valor total da proposta (R$)" largo dica={total ? valorPorExtenso(total) : 'O valor por extenso é gerado automaticamente.'}>
            <input inputMode="decimal" placeholder="0,00" value={p.valorTotal} onChange={(e) => up({ valorTotal: e.target.value })} className="input-valor" />
          </F>
        </div>
        <div className="f-r" style={{ marginTop: 10 }}>Condições de pagamento</div>
        <div className="pag-ed">
          {p.pagamentos.map((pg, i) => (
            <div className="pag-i" key={pg.id}>
              <input placeholder="Etapa" value={pg.etapa} onChange={(e) => setPag(i, { etapa: e.target.value })} />
              <input placeholder="Condição / data" value={pg.condicao} onChange={(e) => setPag(i, { condicao: e.target.value })} />
              <input placeholder="Valor" inputMode="decimal" value={pg.valor} onChange={(e) => setPag(i, { valor: e.target.value })} />
              <button type="button" className="icone-btn" title="Remover" onClick={() => up({ pagamentos: p.pagamentos.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          <div className="linha-acoes">
            <button type="button" className="btn-sec peq"
              onClick={() => {
                const n = p.pagamentos.filter((x) => /^parcela/i.test(x.etapa)).length + 1
                const novo = { id: uid(), etapa: `Parcela ${String(n).padStart(2, '0')}`, condicao: '', valor: '' }
                const idxSaldo = p.pagamentos.findIndex((x) => /^saldo/i.test(x.etapa))
                const arr = [...p.pagamentos]
                arr.splice(idxSaldo >= 0 ? idxSaldo : arr.length, 0, novo)
                up({ pagamentos: arr })
              }}>
              + Adicionar parcela
            </button>
          </div>
          {total > 0 && somaParcelas > 0 && (
            <div className={`aviso${diferenca === 0 ? ' ok' : ''}`}>
              Soma das parcelas: <b>{moeda(somaParcelas)}</b>
              {diferenca === 0 ? ' — confere com o total ✓' : ` — diferença de ${moeda(Math.abs(diferenca))} em relação ao total`}
            </div>
          )}
        </div>
        <div className="grade" style={{ marginTop: 12 }}>
          <F rotulo="Forma de pagamento" largo dica="Se vazio, usa o padrão das Configurações.">
            <input value={p.formaPagamento} onChange={(e) => up({ formaPagamento: e.target.value })} />
          </F>
          <F rotulo="Dados bancários / chave PIX" largo dica="Se vazio, usa o padrão das Configurações.">
            <textarea rows={2} value={p.dadosBancarios} onChange={(e) => up({ dadosBancarios: e.target.value })} />
          </F>
        </div>
      </Grupo>

      <Grupo n="7" titulo="Prazo de execução" resumo={p.prazo.quantidade ? `${p.prazo.quantidade} ${p.prazo.unidade}` : ''}>
        <div className="grade">
          <F rotulo="Prazo estimado">
            <input type="number" min="1" value={p.prazo.quantidade} onChange={(e) => upIn('prazo', { quantidade: e.target.value })} />
          </F>
          <F rotulo="Unidade">
            <select value={p.prazo.unidade} onChange={(e) => upIn('prazo', { unidade: e.target.value })}>
              {['dias úteis', 'dias corridos', 'semanas', 'meses'].map((u) => <option key={u}>{u}</option>)}
            </select>
          </F>
          <F rotulo="Início estimado">
            <input type="date" value={p.prazo.inicio} onChange={(e) => upIn('prazo', { inicio: e.target.value })} />
          </F>
          <F rotulo="Conclusão estimada">
            <input type="date" value={p.prazo.conclusao} onChange={(e) => upIn('prazo', { conclusao: e.target.value })} />
          </F>
        </div>
        {p.prazo.inicio && p.prazo.quantidade && !p.prazo.conclusao && /dias corridos|semanas/.test(p.prazo.unidade) && (
          <button type="button" className="btn-link"
            onClick={() => upIn('prazo', { conclusao: somarDias(p.prazo.inicio, Number(p.prazo.quantidade) * (p.prazo.unidade === 'semanas' ? 7 : 1)) })}>
            Calcular conclusão a partir do início
          </button>
        )}
      </Grupo>

      <Grupo n="8" titulo="Responsabilidades das partes">
        <div className="f-r">Compete à Andrade Macedo</div>
        <ListaEditavel itens={p.respAM} onChange={(v) => up({ respAM: v })} padrao={RESP_AM} />
        <div className="f-r" style={{ marginTop: 14 }}>Compete ao Contratante</div>
        <ListaEditavel itens={p.respCliente} onChange={(v) => up({ respCliente: v })} padrao={RESP_CLIENTE} />
      </Grupo>

      <Grupo n="10" titulo="Condições gerais (encargos)">
        <p className="ajuda">Opcional. Se preenchidos, os encargos e a multa rescisória entram automaticamente nos itens 10.1 e 10.2.</p>
        <div className="grade">
          <F rotulo="Multa por atraso (%)">
            <input inputMode="decimal" value={p.condicoes.multa} onChange={(e) => upIn('condicoes', { multa: e.target.value })} />
          </F>
          <F rotulo="Juros ao mês (%)">
            <input inputMode="decimal" value={p.condicoes.juros} onChange={(e) => upIn('condicoes', { juros: e.target.value })} />
          </F>
          <F rotulo="Suspensão após (dias de atraso)">
            <input type="number" value={p.condicoes.diasSuspensao} onChange={(e) => upIn('condicoes', { diasSuspensao: e.target.value })} />
          </F>
          <F rotulo="Multa rescisória (%)">
            <input inputMode="decimal" value={p.condicoes.multaRescisoria} onChange={(e) => upIn('condicoes', { multaRescisoria: e.target.value })} />
          </F>
        </div>
      </Grupo>
    </div>
  )
}
