import { EMPRESA_PADRAO } from '../lib/defaults.js'

const CAMPOS = [
  ['razaoSocial', 'Razão social'],
  ['responsavel', 'Responsável técnico'],
  ['crea', 'CREA-SP nº'],
  ['cnpj', 'CNPJ'],
  ['endereco', 'Endereço'],
  ['telefone', 'Telefone'],
  ['email', 'E-mail'],
  ['instagram', 'Instagram'],
  ['slogan', 'Frase da capa'],
  ['formaPagamento', 'Forma de pagamento padrão'],
]

export default function Configuracoes({ empresa, onChange }) {
  return (
    <div className="pagina-app estreita">
      <h1 className="titulo-app">Configurações</h1>
      <p className="sub-app">Dados da contratada usados em todas as propostas. São salvos neste navegador.</p>
      <div className="cartao">
        <div className="grade">
          {CAMPOS.map(([k, r]) => (
            <label className={`f${['razaoSocial', 'endereco', 'slogan', 'formaPagamento'].includes(k) ? ' largo' : ''}`} key={k}>
              <span className="f-r">{r}</span>
              <input value={empresa[k] || ''} placeholder={k === 'cnpj' || k === 'endereco' ? 'A definir' : ''}
                onChange={(e) => onChange({ ...empresa, [k]: e.target.value })} />
            </label>
          ))}
          <label className="f largo">
            <span className="f-r">Dados bancários / PIX padrão</span>
            <textarea rows={3} value={empresa.dadosBancarios || ''} onChange={(e) => onChange({ ...empresa, dadosBancarios: e.target.value })}
              placeholder={'Banco …  Agência …  Conta …\nPIX (CNPJ): …'} />
          </label>
        </div>
        <div className="linha-acoes" style={{ marginTop: 16 }}>
          <button type="button" className="btn-link" onClick={() => confirm('Restaurar os dados padrão da empresa?') && onChange({ ...EMPRESA_PADRAO })}>
            Restaurar padrão
          </button>
          <span className="ajuda" style={{ margin: 0 }}>Alterações são salvas automaticamente.</span>
        </div>
      </div>
    </div>
  )
}
