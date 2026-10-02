import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { LogoFull, LogoMark } from './Logo.jsx'
import { Icon } from './Icons.jsx'
import { DIFERENCIAIS, MODALIDADES, numeroProposta, revisaoTxt } from '../lib/defaults.js'
import { dataBR, moeda, NUM_EXTENSO, parseMoeda } from '../lib/format.js'
import { valorPorExtenso } from '../lib/extenso.js'

// A4 a 96 dpi
export const PAGE_W = 794
export const PAGE_H = 1123
const PAD_X = 64
const CONTENT_TOP = 104
const CONTENT_BOTTOM = 84
const CONTENT_W = PAGE_W - PAD_X * 2
const CONTENT_H = PAGE_H - CONTENT_TOP - CONTENT_BOTTOM

const Ph = ({ v, ph }) => (v && String(v).trim() ? v : <span className="ph">{ph}</span>)

function Secao({ n, titulo }) {
  return (
    <h2 className="sec">
      <span className="sec-n">{String(n).padStart(2, '0')}</span>
      <span>{titulo}</span>
    </h2>
  )
}

function Lista({ itens }) {
  return (
    <ul className="lista">
      {itens.filter((t) => t && t.trim()).map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  )
}

function Campo({ rotulo, children }) {
  return (
    <div className="campo">
      <span className="campo-r">{rotulo}</span>
      <span className="campo-v">{children}</span>
    </div>
  )
}

function construirBlocos(p, e) {
  const B = []
  const add = (key, el, opts = {}) => B.push({ key, el, ...opts })
  const num = numeroProposta(p)

  // 1. IDENTIFICAÇÃO
  add('s1', <Secao n={1} titulo="Identificação" />, { keepWithNext: true })
  add(
    's1-quadros',
    <div className="quadros">
      <div className="quadro">
        <div className="quadro-t">Contratada</div>
        <div className="quadro-nome">{e.razaoSocial}</div>
        <Campo rotulo="Resp. técnico">{e.responsavel}</Campo>
        <Campo rotulo="CREA-SP nº">{e.crea}</Campo>
        <Campo rotulo="CNPJ"><Ph v={e.cnpj} ph="[A DEFINIR]" /></Campo>
        <Campo rotulo="Endereço"><Ph v={e.endereco} ph="[A DEFINIR]" /></Campo>
        <Campo rotulo="Telefone">{e.telefone}</Campo>
        <Campo rotulo="E-mail">{e.email}</Campo>
        <Campo rotulo="Instagram">{e.instagram}</Campo>
      </div>
      <div className="quadros-col">
        <div className="quadro">
          <div className="quadro-t">Contratante</div>
          <div className="quadro-nome"><Ph v={p.cliente.nome} ph="[NOME DO CLIENTE]" /></div>
          <Campo rotulo="CPF/CNPJ"><Ph v={p.cliente.documento} ph="[●]" /></Campo>
          <Campo rotulo="Telefone"><Ph v={p.cliente.telefone} ph="[●]" /></Campo>
          <Campo rotulo="E-mail"><Ph v={p.cliente.email} ph="[●]" /></Campo>
        </div>
        <div className="quadro">
          <div className="quadro-t">Local dos serviços</div>
          <Campo rotulo="Endereço"><Ph v={p.local.endereco} ph="[●]" /></Campo>
          {p.local.condominio && <Campo rotulo="Condomínio">{p.local.condominio}</Campo>}
        </div>
      </div>
    </div>,
  )

  // 2. SOBRE
  add('s2', <Secao n={2} titulo="Sobre a Andrade Macedo" />, { keepWithNext: true, breakBefore: false })
  add(
    's2-txt',
    <div className="sobre">
      <p>
        A Andrade Macedo Serviços de Engenharia atua na execução e gerenciamento de reformas, manutenção e serviços de
        engenharia, oferecendo soluções pautadas em planejamento, qualidade técnica, organização e transparência.
      </p>
      <p>
        A empresa foi estruturada para proporcionar ao cliente maior previsibilidade durante todo o serviço, desde a
        definição do escopo e orçamento até a execução e entrega, mantendo comunicação próxima e acompanhamento técnico
        em todas as etapas contratadas.
      </p>
      <p>
        Nosso trabalho busca unir a experiência prática em obras à aplicação de boas práticas de gestão, garantindo
        soluções tecnicamente adequadas, eficientes e compatíveis com as necessidades de cada cliente.
      </p>
    </div>,
  )
  add(
    's2-dif',
    <div className="difs">
      <div className="difs-t">Nossos diferenciais</div>
      <div className="difs-grid">
        {DIFERENCIAIS.map((d) => (
          <div className="dif" key={d.titulo}>
            <div className="dif-ic"><Icon name={d.icone} size={18} color="#0A3F73" /></div>
            <div>
              <div className="dif-t">{d.titulo}</div>
              <div className="dif-x">{d.texto}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,
  )

  // 3. OBJETO
  const mods = MODALIDADES.filter((m) => p.objeto.modalidades.includes(m.id)).map((m) => m.label)
  if (p.objeto.modalidades.includes('outro') && p.objeto.outraModalidade) mods.push(p.objeto.outraModalidade)
  add('s3', <Secao n={3} titulo="Objeto da proposta" />, { keepWithNext: true })
  add(
    's3-txt',
    <p>
      A presente proposta tem por objeto a execução de{' '}
      <strong><Ph v={p.objeto.descricaoPrincipal} ph="[DESCRIÇÃO PRINCIPAL DO SERVIÇO]" /></strong>, no imóvel
      localizado em <Ph v={p.local.endereco} ph="[ENDEREÇO]" />, conforme escopo, condições técnicas e comerciais
      apresentados neste documento.
    </p>,
    { keepWithNext: true },
  )
  add(
    's3-quadro',
    <div className="resumo">
      <div className="resumo-l">
        <div className="rot">Descrição resumida</div>
        <div><Ph v={p.objeto.resumo} ph="[Descrição resumida do serviço]" /></div>
      </div>
      <div className="resumo-r">
        <div className="rot">Modalidade de contratação</div>
        {mods.length ? (
          <div className="chips">{mods.map((m) => <span className="chip" key={m}>✓ {m}</span>)}</div>
        ) : (
          <span className="ph">[Selecionar modalidade]</span>
        )}
      </div>
    </div>,
  )

  // 4. ESCOPO
  add('s4', <Secao n={4} titulo="Escopo dos serviços" />, { keepWithNext: true })
  add(
    's4-intro',
    <p>
      Estão contemplados nesta proposta exclusivamente os serviços relacionados abaixo, considerando as quantidades,
      condições e especificações apresentadas.
    </p>,
    { keepWithNext: true },
  )
  add('s41', <h3 className="sub">4.1 Serviços inclusos</h3>, { keepWithNext: true })
  add(
    's41-head',
    <div className="tab tab-head tab-escopo">
      <div>Item</div>
      <div>Descrição do serviço</div>
      <div>Responsável pelo material</div>
    </div>,
    { keepWithNext: true },
  )
  p.escopo.forEach((it, i) => {
    add(
      `s41-${it.id}`,
      <div className={`tab tab-row tab-escopo${i % 2 ? ' zebra' : ''}${i === p.escopo.length - 1 ? ' last' : ''}`}>
        <div className="tab-item">{String(i + 1).padStart(2, '0')}</div>
        <div className="pre"><Ph v={it.descricao} ph="[Descrição]" /></div>
        <div>{it.material}</div>
      </div>,
    )
  })
  add(
    's41-nota',
    <p className="nota">
      {p.planilhaAnexa
        ? 'Especificações, quantitativos e valores estão apresentados em planilha orçamentária anexa, que passa a integrar esta proposta.'
        : 'Quando necessário, especificações, quantitativos e valores poderão ser apresentados em planilha orçamentária anexa, que passará a integrar esta proposta.'}
    </p>,
  )
  if (p.observacoes?.trim()) {
    add('s41-obs', <p className="pre"><strong>Observações: </strong>{p.observacoes}</p>)
  }
  add('s42', <h3 className="sub">4.2 Exclusões</h3>, { keepWithNext: true })
  add(
    's42-l',
    <div>
      <p>Salvo quando expressamente indicado no escopo ou orçamento, não estão incluídos:</p>
      <Lista itens={p.exclusoes} />
    </div>,
  )
  add(
    's42-obs',
    <p className="nota">
      <strong>Observação:</strong> qualquer item não previsto no escopo será tratado conforme o item 9 – Alterações e
      Serviços Adicionais.
    </p>,
  )

  // 5. PREMISSAS
  add('s5', <Secao n={5} titulo="Premissas e condições para execução" />, { keepWithNext: true })
  add(
    's5-a',
    <p>
      O orçamento e o prazo desta proposta foram elaborados considerando as condições observadas e informações
      disponibilizadas até a data de sua emissão.
    </p>,
    { keepWithNext: true },
  )
  add(
    's5-box',
    <div className="box">
      <div className="box-t">Premissas consideradas</div>
      <Lista itens={p.premissas} />
    </div>,
  )
  add(
    's5-b',
    <div>
      <p>
        Condições não identificáveis durante a vistoria ou existentes no interior de paredes, pisos, forros, instalações
        ou elementos construtivos poderão demandar revisão de escopo, custo ou prazo.
      </p>
      <p>
        Sempre que possível, a Andrade Macedo comunicará a condição identificada ao contratante antes da execução da
        solução correspondente.
      </p>
    </div>,
  )

  // 6. INVESTIMENTO
  const total = parseMoeda(p.valorTotal)
  const forma = p.formaPagamento || e.formaPagamento
  const banco = p.dadosBancarios || e.dadosBancarios
  add('s6', <Secao n={6} titulo="Investimento e condições de pagamento" />, { keepWithNext: true })
  add(
    's6-inv',
    <div className="invest">
      <div className="invest-top">
        <div className="invest-r">Valor total da proposta</div>
        <div className="invest-v">{total ? moeda(total) : 'R$ [XX.XXX,XX]'}</div>
        <div className="invest-e">({total ? valorPorExtenso(total) : 'valor por extenso'})</div>
      </div>
      <div className="invest-body">
        <div className="tab tab-head tab-pag">
          <div>Etapa</div>
          <div>Condição</div>
          <div className="dir">Valor</div>
        </div>
        {p.pagamentos.map((pg, i) => (
          <div className={`tab tab-row tab-pag${i % 2 ? ' zebra' : ''}`} key={pg.id}>
            <div className="b">{pg.etapa || '—'}</div>
            <div><Ph v={pg.condicao} ph="[Condição/data]" /></div>
            <div className="dir b">{parseMoeda(pg.valor) ? moeda(parseMoeda(pg.valor)) : 'R$ [●]'}</div>
          </div>
        ))}
        <div className="invest-pg">
          <div><span className="rot">Forma de pagamento</span><span>{forma}</span></div>
          <div><span className="rot">Dados bancários</span><span className="pre"><Ph v={banco} ph="[INSERIR]" /></span></div>
        </div>
      </div>
    </div>,
  )
  add(
    's6-nota',
    <div>
      <p className="nota">
        O valor acima corresponde exclusivamente ao escopo descrito nesta proposta e respectivos anexos. Quando a
        natureza do serviço justificar, as parcelas poderão ser vinculadas à conclusão de determinadas etapas em vez de
        datas fixas.
      </p>
    </div>,
  )

  // 7. PRAZO
  const qtd = p.prazo.quantidade
  add('s7', <Secao n={7} titulo="Prazo de execução" />, { keepWithNext: true })
  add(
    's7-a',
    <p>
      O prazo estimado para execução dos serviços é de{' '}
      <strong>{qtd ? `${qtd} ${p.prazo.unidade}` : <span className="ph">[XX dias úteis / semanas]</span>}</strong>,
      contado a partir da liberação para início dos trabalhos.
    </p>,
  )
  add(
    's7-b',
    <div>
      <p>A mobilização e início estarão condicionados, quando aplicável, a:</p>
      <div className="fluxo">
        {['Aprovação desta proposta', 'Pagamento da entrada', 'Disponibilidade do local', 'Liberações necessárias'].map(
          (t, i, arr) => (
            <Fragment key={t}>
              <span className="fluxo-i">{t}</span>
              {i < arr.length - 1 && <span className="fluxo-s">+</span>}
            </Fragment>
          ),
        )}
      </div>
    </div>,
  )
  add(
    's7-c',
    <p>
      O prazo poderá ser revisto quando ocorrerem situações alheias ao planejamento original, incluindo alterações
      solicitadas pelo contratante, serviços adicionais, condições ocultas, indisponibilidade do local, atraso no
      fornecimento de materiais sob responsabilidade do cliente ou outras ocorrências que impactem diretamente a
      execução. Eventuais alterações serão comunicadas ao contratante.
    </p>,
  )
  add(
    's7-prev',
    <div className="previsao">
      <div className="previsao-t">Previsão</div>
      <div><span className="rot">Início estimado</span><strong>{p.prazo.inicio ? dataBR(p.prazo.inicio) : '[DD/MM/AAAA]'}</strong></div>
      <div><span className="rot">Conclusão estimada</span><strong>{p.prazo.conclusao ? dataBR(p.prazo.conclusao) : '[DD/MM/AAAA]'}</strong></div>
    </div>,
  )

  // 8. RESPONSABILIDADES
  add('s8', <Secao n={8} titulo="Responsabilidades das partes" />, { keepWithNext: true })
  add(
    's8-c',
    <div className="resp">
      <div className="resp-col">
        <div className="resp-t">Compete à Andrade Macedo</div>
        <Lista itens={p.respAM || []} />
      </div>
      <div className="resp-col">
        <div className="resp-t">Compete ao Contratante</div>
        <Lista itens={p.respCliente || []} />
      </div>
    </div>,
  )

  // 9. ALTERAÇÕES
  add('s9', <Secao n={9} titulo="Alterações e serviços adicionais" />, { keepWithNext: true })
  add(
    's9-a',
    <div>
      <p>Qualquer serviço, fornecimento ou alteração não contemplado no escopo original será considerado serviço adicional.</p>
      <p>
        Sempre que uma alteração gerar impacto financeiro ou de prazo, a Andrade Macedo apresentará ao contratante as
        respectivas condições para aprovação antes da execução.
      </p>
      <p>
        A aprovação poderá ocorrer por meio de orçamento complementar, termo aditivo ou outro registro escrito acordado
        entre as partes.
      </p>
      <p>Serviços adicionais poderão resultar em acréscimo de valor e/ou extensão do prazo originalmente previsto.</p>
    </div>,
  )
  add(
    's9-dest',
    <div className="destaque">
      Solicitações feitas diretamente à equipe de execução somente serão consideradas autorizadas após validação do
      responsável pela Andrade Macedo.
    </div>,
  )

  // 10. CONDIÇÕES GERAIS
  const c = p.condicoes || {}
  const encargos = []
  if (c.multa) encargos.push(`multa de ${c.multa}% sobre o valor em atraso`)
  if (c.juros) encargos.push(`juros de ${c.juros}% ao mês, calculados pro rata die`)
  add('s10', <Secao n={10} titulo="Condições gerais" />, { keepWithNext: true })
  add(
    's101',
    <div>
      <h3 className="sub">10.1 Inadimplência</h3>
      {encargos.length > 0 ? (
        <p>
          O atraso no pagamento implicará a incidência de {encargos.join(' e ')} e, após comunicação ao contratante,
          poderá resultar na suspensão dos serviços enquanto permanecer a pendência financeira
          {c.diasSuspensao ? `, caso o atraso supere ${c.diasSuspensao} dias corridos` : ''}.
        </p>
      ) : (
        <p>
          O atraso no pagamento poderá resultar, após comunicação ao contratante, na suspensão dos serviços enquanto
          permanecer a pendência financeira{c.diasSuspensao ? `, caso o atraso supere ${c.diasSuspensao} dias corridos` : ''}.
        </p>
      )}
      <p>
        Durante eventual suspensão motivada por inadimplemento do contratante, os prazos originalmente estabelecidos
        poderão ser revistos conforme os impactos causados à programação da obra.
      </p>
    </div>,
  )
  add(
    's102',
    <div>
      <h3 className="sub">10.2 Cancelamento ou rescisão</h3>
      <p>
        Em caso de encerramento antecipado da contratação, serão apurados os serviços efetivamente executados, materiais
        adquiridos especificamente para o serviço, compromissos já assumidos e demais valores aplicáveis até a data da
        interrupção.
        {c.multaRescisoria
          ? ` Sobre o saldo remanescente do contrato incidirá multa rescisória de ${c.multaRescisoria}%, devida pela parte que der causa à rescisão.`
          : ''}
      </p>
    </div>,
  )
  add(
    's103',
    <div>
      <h3 className="sub">10.3 Condições preexistentes</h3>
      <p>
        A Andrade Macedo não responderá por patologias, defeitos, instalações ou condições preexistentes que não estejam
        relacionadas aos serviços executados ou que não fossem identificáveis antes da intervenção.
      </p>
      <p>
        Caso uma condição existente interfira na execução contratada, o contratante será comunicado para definição da
        solução técnica e de eventual impacto financeiro.
      </p>
    </div>,
  )
  add(
    's104',
    <div>
      <h3 className="sub">10.4 Garantia e entrega</h3>
      <p>
        Ao término dos serviços, será realizada a verificação das atividades previstas no escopo. Eventuais pendências
        relacionadas diretamente aos serviços executados serão registradas e programadas para correção.
      </p>
      <p>
        As garantias aplicáveis serão observadas conforme a natureza dos serviços executados e a legislação e normas
        pertinentes.
      </p>
    </div>,
  )
  add(
    's105',
    <div>
      <h3 className="sub">10.5 Responsabilidade técnica</h3>
      <p>
        A responsabilidade da Andrade Macedo estará limitada aos serviços e atividades técnicas efetivamente
        contratados e sob sua responsabilidade.
      </p>
      <p>
        Projetos, especificações ou serviços elaborados ou executados por terceiros permanecerão sob responsabilidade de
        seus respectivos autores ou executores, salvo contratação expressa em sentido contrário.
      </p>
    </div>,
  )

  // 11. VALIDADE E ACEITE
  const vd = Number(p.validadeDias) || 15
  add('s11', <Secao n={11} titulo="Validade e aceite" />, { keepWithNext: true })
  add(
    's11-txt',
    <div>
      <p>
        Esta proposta possui validade de <strong>{vd} ({NUM_EXTENSO[vd] || vd}) dias corridos</strong>, contados a
        partir da data de sua emissão.
      </p>
      <p>
        A aprovação representa a concordância do contratante com o objeto, escopo, exclusões, valores, condições de
        pagamento, prazos e demais condições estabelecidas neste documento e em seus eventuais anexos.
      </p>
      <p>
        Após o aceite e cumprimento das condições comerciais iniciais, a Andrade Macedo realizará a programação dos
        serviços conforme disponibilidade previamente acordada entre as partes.
      </p>
    </div>,
    { keepWithNext: true },
  )
  add(
    's11-aceite',
    <div className="aceite">
      <div className="aceite-t">Aceite da proposta</div>
      <p className="aceite-d">
        Declaro ter analisado e estar de acordo com as condições apresentadas na Proposta Técnico-Comercial nº {num},
        incluindo seu escopo, exclusões, valores e condições de execução.
      </p>
      <div className="ass">
        <div className="ass-col">
          <div className="ass-h">Contratante</div>
          <div className="ass-l"><span>Nome</span><i>{p.cliente.nome}</i></div>
          <div className="ass-l"><span>CPF/CNPJ</span><i>{p.cliente.documento}</i></div>
          <div className="ass-l"><span>Data</span><i className="ass-data">____ / ____ / ________</i></div>
          <div className="ass-sig">Assinatura</div>
        </div>
        <div className="ass-col">
          <div className="ass-h">Andrade Macedo Serviços de Engenharia</div>
          <div className="ass-l"><span>Resp. técnico</span><i>{e.responsavel}</i></div>
          <div className="ass-l"><span>CREA-SP nº</span><i>{e.crea}</i></div>
          <div className="ass-l"><span>Data</span><i className="ass-data">____ / ____ / ________</i></div>
          <div className="ass-sig">Assinatura</div>
        </div>
      </div>
    </div>,
  )

  return B
}

function paginar(blocos, alturas, H) {
  const paginas = [[]]
  let usado = 0
  for (let i = 0; i < blocos.length; i++) {
    const h = alturas[i] ?? 0
    // Um título "preso" ao próximo bloco só cabe se o conjunto couber
    let precisa = h
    for (let j = i; blocos[j]?.keepWithNext && j + 1 < blocos.length; j++) precisa += alturas[j + 1] ?? 0
    const atual = paginas[paginas.length - 1]
    if (atual.length && (blocos[i].breakBefore || usado + precisa > H)) {
      paginas.push([])
      usado = 0
    }
    paginas[paginas.length - 1].push(i)
    usado += h
  }
  return paginas
}

function Rodape({ p, e, n, total }) {
  return (
    <div className="rodape">
      <span>
        <b>ANDRADE MACEDO</b> | SERVIÇOS DE ENGENHARIA • CREA-SP {e.crea} • Proposta {numeroProposta(p)} • Rev.{' '}
        {revisaoTxt(p)}
      </span>
      <span className="rodape-pg">{n} / {total}</span>
    </div>
  )
}

function Capa({ p, e, total }) {
  const validade = `${Number(p.validadeDias) || 15} dias corridos`
  return (
    <div className="pagina capa" data-pagina>
      <div className="capa-faixa" />
      <div className="capa-logo">
        <LogoFull width={300} subtitulo="Serviços de Engenharia" />
      </div>
      <div className="capa-titulo">
        <div className="capa-kicker">Proposta</div>
        <h1>Técnico-Comercial</h1>
        <div className="capa-serv">
          <Ph v={p.tituloServico || p.objeto.descricaoPrincipal} ph="[Serviço a ser executado]" />
        </div>
      </div>
      <div className="capa-cliente">
        <div className="rot">Preparada para</div>
        <div className="capa-cli-nome"><Ph v={p.cliente.nome} ph="[NOME DO CLIENTE]" /></div>
        <div className="capa-cli-end">
          <Ph v={p.local.endereco} ph="[Endereço do local dos serviços]" />
          {p.local.condominio ? ` — ${p.local.condominio}` : ''}
        </div>
      </div>
      <div className="capa-meta">
        <div><span className="rot">Proposta nº</span><b>{numeroProposta(p)}</b></div>
        <div><span className="rot">Revisão</span><b>{revisaoTxt(p)}</b></div>
        <div><span className="rot">Data de emissão</span><b>{dataBR(p.dataEmissao)}</b></div>
        <div><span className="rot">Validade</span><b>{validade}</b></div>
      </div>
      <div className="capa-resp">
        <div className="capa-resp-n">{e.responsavel}</div>
        <div>CREA-SP nº {e.crea}</div>
        <div className="capa-slogan">{e.slogan}</div>
      </div>
      <Rodape p={p} e={e} n={1} total={total} />
    </div>
  )
}

function Cabecalho({ p }) {
  return (
    <div className="cabecalho">
      <div className="cab-l">
        <LogoMark width={46} />
        <div>
          <div className="cab-nome">ANDRADE MACEDO</div>
          <div className="cab-sub">Serviços de Engenharia</div>
        </div>
      </div>
      <div className="cab-r">
        <div>Proposta Técnico-Comercial</div>
        <b>{numeroProposta(p)} · Rev. {revisaoTxt(p)}</b>
      </div>
    </div>
  )
}

export default function Documento({ proposta: p, empresa: e }) {
  const blocos = useMemo(() => construirBlocos(p, e), [p, e])
  const medidorRef = useRef(null)
  const [alturas, setAlturas] = useState([])
  const [, setFontesProntas] = useState(0)

  useEffect(() => {
    document.fonts?.ready.then(() => setFontesProntas((t) => t + 1))
  }, [])

  useLayoutEffect(() => {
    const el = medidorRef.current
    if (!el) return
    const hs = Array.from(el.children).map((c) => c.offsetHeight)
    if (hs.length !== alturas.length || hs.some((h, i) => h !== alturas[i])) setAlturas(hs)
  })

  const paginas = useMemo(() => paginar(blocos, alturas, CONTENT_H), [blocos, alturas])
  const total = paginas.length + 1

  return (
    <div className="documento">
      <div className="medidor" ref={medidorRef} style={{ width: CONTENT_W }} aria-hidden>
        {blocos.map((b) => (
          <div className="blk" key={b.key}>{b.el}</div>
        ))}
      </div>
      <Capa p={p} e={e} total={total} />
      {paginas.map((idx, n) => (
        <div className="pagina" data-pagina key={n}>
          <Cabecalho p={p} />
          <div className="conteudo" style={{ top: CONTENT_TOP, left: PAD_X, width: CONTENT_W, height: CONTENT_H }}>
            {idx.map((i) => (
              <div className="blk" key={blocos[i].key}>{blocos[i].el}</div>
            ))}
          </div>
          <Rodape p={p} e={e} n={n + 2} total={total} />
        </div>
      ))}
    </div>
  )
}
