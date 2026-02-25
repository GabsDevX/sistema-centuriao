"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase';

// ==========================================
// 1. O CÉREBRO: MAPEAMENTO DO EDITAL (QUESTÕES)
// ==========================================
const MAPA_EDITAL: Record<string, { total: number, assuntos: { nome: string, qts: number }[] }> = {
  "Língua Portuguesa": { total: 20, assuntos: [{ nome: "Interpretação de Texto", qts: 5 }, { nome: "Sintaxe Estrutural", qts: 5 }, { nome: "Morfossintaxe", qts: 4 }, { nome: "Redação Oficial", qts: 3 }, { nome: "Acentuação / Ortografia", qts: 1 }, { nome: "Pontuação", qts: 1 }, { nome: "Semântica", qts: 1 }] },
  "Direito Penal": { total: 20, assuntos: [{ nome: "Teoria do Crime", qts: 6 }, { nome: "Crimes contra a Pessoa", qts: 4 }, { nome: "Crimes contra o Patrimônio", qts: 4 }, { nome: "Crimes contra a Administração Pública", qts: 4 }, { nome: "Aplicação da Lei Penal", qts: 2 }] },
  "Direito Penal Militar": { total: 20, assuntos: [{ nome: "Crimes contra a Autoridade/Disciplina", qts: 8 }, { nome: "Crimes contra o Serviço Militar", qts: 8 }, { nome: "Crimes contra a Administração Militar", qts: 4 }] },
  "Direito Processual Penal": { total: 20, assuntos: [{ nome: "Leis Especiais (ECA, Penha, Drogas)", qts: 6 }, { nome: "Da Prisão (Flagrante, Preventiva)", qts: 6 }, { nome: "Inquérito Policial", qts: 4 }, { nome: "Crimes de Preconceito e Idoso", qts: 4 }] },
  "Direito Constitucional": { total: 20, assuntos: [{ nome: "Direitos e Garantias Fundamentais", qts: 8 }, { nome: "Organização do Estado / Administração", qts: 4 }, { nome: "Defesa do Estado e Segurança", qts: 4 }, { nome: "Constituição da Bahia", qts: 2 }, { nome: "Princípios Fundamentais", qts: 2 }] },
  "Direito Administrativo": { total: 20, assuntos: [{ nome: "Estatuto PMBA (Lei 7.990/01)", qts: 8 }, { nome: "Atos Administrativos", qts: 4 }, { nome: "Poderes Administrativos", qts: 4 }, { nome: "Princípios da Administração", qts: 2 }, { nome: "LGPD", qts: 2 }] },
  "Direitos Humanos": { total: 20, assuntos: [{ nome: "Declaração Universal (DUDH)", qts: 8 }, { nome: "Pacto de São José da Costa Rica", qts: 6 }, { nome: "Estatuto da Igualdade Racial", qts: 4 }, { nome: "Convenção Discriminação Racial", qts: 2 }] },
  "Matemática / RLM": { total: 10, assuntos: [{ nome: "Análise Combinatória e Probabilidade", qts: 3 }, { nome: "Estatística e Porcentagem", qts: 3 }, { nome: "Funções (1º, 2º grau)", qts: 2 }, { nome: "Geometria", qts: 1 }, { nome: "Conjuntos e Álgebra", qts: 1 }] },
  "História do Brasil/Bahia": { total: 20, assuntos: [{ nome: "Independência da Bahia e Revoltas", qts: 8 }, { nome: "Brasil República", qts: 6 }, { nome: "Brasil Colônia e Império", qts: 4 }, { nome: "Globalização", qts: 2 }] },
  "Geografia do Brasil/Bahia": { total: 20, assuntos: [{ nome: "Geopolítica e Espaço Brasileiro", qts: 8 }, { nome: "Geografia da Bahia", qts: 6 }, { nome: "Dinâmica Populacional", qts: 4 }, { nome: "Relação Sociedade-Natureza", qts: 2 }] },
  "Inglês": { total: 5, assuntos: [{ nome: "Compreensão de Textos", qts: 3 }, { nome: "Gramática Aplicada", qts: 1 }, { nome: "Vocabulário", qts: 1 }] },
  "Informática": { total: 5, assuntos: [{ nome: "Sistemas Operacionais", qts: 1 }, { nome: "Pacote Office / LibreOffice", qts: 1 }, { nome: "Nuvem e Internet", qts: 1 }, { nome: "Segurança da Informação", qts: 1 }, { nome: "Hardware", qts: 1 }] }
};

const DISCIPLINAS_KEYS = Object.keys(MAPA_EDITAL);
const PESO_OFICIAL_UNEB = 1.25; // Item 9.1.5 do Edital

// ==========================================
// 2. ALGORITMO REGRA DO EDITAL (UNEB)
// ==========================================
function calcularIndiceRisco(erros: number, totalResolvido: number) {
  if (totalResolvido === 0 || isNaN(totalResolvido)) return { nivel: 'AGUARDANDO DADOS', cor: 'bg-slate-200 text-slate-500' };
  const taxaErro = erros / totalResolvido;
  if (taxaErro === 1) return { nivel: 'ELIMINAÇÃO DIRETA (ZERO)', cor: 'bg-black text-[#e62020] border border-[#e62020] animate-pulse' };
  if (taxaErro > 0.40) return { nivel: 'ZONA DE CORTE (< 60pts)', cor: 'bg-[#e62020] text-white shadow-inner' };
  if (taxaErro >= 0.20) return { nivel: 'ZONA DE ALERTA (MÉDIO)', cor: 'bg-yellow-500 text-black shadow-inner' };
  return { nivel: 'ZONA DE APROVAÇÃO (SEGURO)', cor: 'bg-[#10b981] text-white shadow-inner' };
}

// ==========================================
export default function Dashboard() {
  const [disciplina, setDisciplina] = useState(DISCIPLINAS_KEYS[0]);
  const [assunto, setAssunto] = useState(MAPA_EDITAL[DISCIPLINAS_KEYS[0]].assuntos[0].nome); 
  const [total, setTotal] = useState<number>(20);
  const [erros, setErros] = useState<number>(0);
  const [historico, setHistorico] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const statusRiscoAtual = calcularIndiceRisco(erros, total);

  useEffect(() => { setAssunto(MAPA_EDITAL[disciplina].assuntos[0].nome); }, [disciplina]);
  useEffect(() => { buscarBaterias(); }, []);

  const buscarBaterias = async () => {
    try {
      const { data, error } = await supabase.from('baterias').select('*').order('id', { ascending: false });
      if (error) throw error;
      if (data) setHistorico(data);
    } catch (error) { console.error(error); } finally { setCarregando(false); }
  };

  const registrarBateria = async () => {
    if (total <= 0) return;
    const riscoCalculado = calcularIndiceRisco(erros, total);
    const novoRegistro = { disciplina, assunto, peso: PESO_OFICIAL_UNEB, total, erros, risco_nivel: riscoCalculado.nivel, risco_cor: riscoCalculado.cor };
    try {
      const { error } = await supabase.from('baterias').insert([novoRegistro]);
      if (error) throw error;
      buscarBaterias();
      setTotal(0); setErros(0);
    } catch (error) { alert("Falha na nuvem."); }
  };

  // MÓDULO DE LIMPEZA GERAL (ZERAR DADOS)
  const limparBaseDeDados = async () => {
    const confirmacao = window.confirm("CÓDIGO VERMELHO: Tem certeza que deseja apagar TODO o histórico de estudos? Esta ação é irreversível e limpará a base na nuvem.");
    if (confirmacao) {
      setCarregando(true);
      try {
        const { error } = await supabase.from('baterias').delete().neq('id', 0); // Apaga tudo
        if (error) throw error;
        setHistorico([]);
      } catch (error) { alert("Erro ao limpar a base."); } finally { setCarregando(false); }
    }
  };

  // MÓDULO DE IMPRESSÃO (AUDITORIA)
  const imprimirRelatorio = () => {
    window.print();
  };

  // ESTATÍSTICAS
  const totalQuestoesGeral = historico.reduce((acc, item) => acc + item.total, 0);
  const totalErrosGeral = historico.reduce((acc, item) => acc + item.erros, 0);
  const totalAcertosGeral = totalQuestoesGeral - totalErrosGeral;
  const aproveitamento = totalQuestoesGeral > 0 ? ((totalAcertosGeral / totalQuestoesGeral) * 100).toFixed(1) : "0.0";
  const pontuacaoAcumulada = (totalAcertosGeral * PESO_OFICIAL_UNEB).toFixed(2);

  const dadosAgrupados = useMemo(() => {
    const mapa: Record<string, any> = {};
    historico.forEach((item) => {
      const acertos = item.total - item.erros;
      if (!mapa[item.disciplina]) mapa[item.disciplina] = { total: 0, acertos: 0, erros: 0, topicos: {} };
      mapa[item.disciplina].total += item.total;
      mapa[item.disciplina].acertos += acertos;
      mapa[item.disciplina].erros += item.erros;

      if (!mapa[item.disciplina].topicos[item.assunto]) mapa[item.disciplina].topicos[item.assunto] = { total: 0, acertos: 0, erros: 0 };
      mapa[item.disciplina].topicos[item.assunto].total += item.total;
      mapa[item.disciplina].topicos[item.assunto].acertos += acertos;
      mapa[item.disciplina].topicos[item.assunto].erros += item.erros;
    });
    return mapa;
  }, [historico]);

  // DADOS PARA O GRÁFICO DE ESFORÇO
  const rankingEsforco = Object.entries(dadosAgrupados)
    .sort((a: any, b: any) => b[1].total - a[1].total)
    .slice(0, 5); // Pega as 5 matérias mais estudadas
  const maxQuestoes = rankingEsforco.length > 0 ? rankingEsforco[0][1].total : 1;

  return (
    <main className="min-h-screen bg-[#f1f3f6] p-4 md:p-8 text-slate-900 font-sans relative z-0">
      <div className="fixed inset-0 -z-10 bg-[url('/bg.jpg')] bg-cover bg-center opacity-5"></div>
      
      <div className="max-w-7xl mx-auto">
        
          {/* BARRA SUPERIOR DE AÇÕES (ESCONDIDA NA IMPRESSÃO) */}
          <div className="flex justify-end gap-3 mb-6 print:hidden">
            <button onClick={limparBaseDeDados} className="bg-white text-red-600 font-bold py-2 px-4 rounded shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,1)] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.1),inset_-4px_-4px_10px_rgba(255,255,255,1)] transition-all text-xs uppercase tracking-widest border border-slate-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Zerar Base
            </button>
            <button onClick={imprimirRelatorio} className="bg-[#1a4bb8] text-white font-bold py-2 px-4 rounded shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,1)] hover:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.3)] transition-all text-xs uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Emitir Relatório
            </button>
          </div>

          {/* CABEÇALHO */}
          <div className="mb-8 border-b-2 border-slate-300 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1a4bb8] mb-1 uppercase tracking-tighter drop-shadow-sm">
                OPERAÇÃO CENTURIÃO
              </h1>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                RELATÓRIO DE AUDITORIA • CFO PMBA 2026
              </h2>
            </div>
            <div className="mt-4 md:mt-0 bg-gradient-to-br from-[#1a4bb8] to-[#11327c] text-white px-6 py-3 rounded-lg shadow-[5px_5px_15px_rgba(0,0,0,0.2),-5px_-5px_15px_rgba(255,255,255,0.8)] border-t border-blue-400">
               <span className="block text-[10px] uppercase tracking-widest text-blue-200 opacity-80">Oficial Auditor</span>
               <span className="font-black tracking-widest uppercase text-sm">G. Almeida</span>
            </div>
          </div>

          {/* DASHBOARD ANALÍTICO (ALTO RELEVO NEUMÓRFICO) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-[#f1f3f6] p-6 rounded-xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] border border-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#1a4bb8]"></div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pontos Auditados</p>
              <p className="text-4xl font-black text-[#1a4bb8] drop-shadow-sm">{pontuacaoAcumulada}</p>
            </div>
            <div className="bg-[#f1f3f6] p-6 rounded-xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] border border-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10b981]"></div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Alvos Abatidos</p>
              <p className="text-4xl font-black text-[#10b981] drop-shadow-sm">{totalAcertosGeral}</p>
            </div>
            <div className="bg-[#f1f3f6] p-6 rounded-xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] border border-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#e62020]"></div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Desvios de Rota</p>
              <p className="text-4xl font-black text-[#e62020] drop-shadow-sm">{totalErrosGeral}</p>
            </div>
            
            <div className="bg-gradient-to-br from-[#0b1b42] to-[#060e24] p-6 rounded-xl shadow-[8px_8px_16px_rgba(0,0,0,0.2),-4px_-4px_-10px_rgba(255,255,255,0.4)] relative overflow-hidden border border-slate-700">
              <p className="text-xs font-black text-blue-200 uppercase tracking-widest mb-1 z-10 relative">Aproveitamento</p>
              <p className="text-4xl font-black text-white z-10 relative drop-shadow-lg">{aproveitamento}%</p>
              <div className="absolute bottom-0 left-0 h-2 bg-black w-full shadow-inner">
                 <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-1000 shadow-[0_0_10px_rgba(234,179,8,0.8)]" style={{ width: `${aproveitamento}%` }}></div>
              </div>
            </div>
          </div>

          {/* NOVO: GRÁFICO TÁTICO DE ESFORÇO */}
          {totalQuestoesGeral > 0 && (
            <div className="mb-10 bg-[#f1f3f6] p-6 md:p-8 rounded-2xl shadow-[inset_6px_6px_12px_rgba(0,0,0,0.05),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] border border-white print:shadow-none print:border-slate-300">
              <h2 className="text-lg font-black text-slate-700 mb-6 uppercase tracking-widest border-b-2 border-slate-200 pb-2 flex items-center gap-2">
                 <svg className="w-5 h-5 text-[#1a4bb8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                 Inteligência: Distribuição de Engajamento (Top 5)
              </h2>
              <div className="space-y-4">
                {rankingEsforco.map(([mat, dados]: any) => {
                  const largura = (dados.total / maxQuestoes) * 100;
                  return (
                    <div key={mat} className="relative">
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                        <span className="uppercase">{mat}</span>
                        <span>{dados.total} resolvidas</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner overflow-hidden">
                        <div className="bg-gradient-to-r from-[#1a4bb8] to-blue-400 h-3 rounded-full shadow-md transition-all duration-1000" style={{ width: `${largura}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PAINEL DE INSERÇÃO (ESCONDIDO NA IMPRESSÃO/AUDITORIA) */}
          <div className="bg-[#f1f3f6] p-6 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] border border-white mb-10 relative print:hidden">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-6 border-b border-slate-200 pb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1a4bb8] rounded-full shadow-[0_0_5px_#1a4bb8]"></div>
              Painel de Alimentação do Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6 items-end">

              <div className="md:col-span-1 relative">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Peso UNEB</label>
                <input 
                  type="number" value={PESO_OFICIAL_UNEB} readOnly
                  className="w-full bg-[#e2e8f0] border border-slate-300 rounded-lg p-3 outline-none font-black text-slate-500 text-center shadow-inner cursor-not-allowed"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:col-span-1">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Total</label>
                  <input 
                    type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))}
                    className="w-full bg-[#f1f3f6] border border-slate-300 rounded-lg p-3 outline-none font-black text-slate-800 text-center shadow-[inset_3px_3px_6px_rgba(0,0,0,0.05),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] focus:border-[#1a4bb8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#e62020] uppercase mb-2">Erros</label>
                  <input 
                    type="number" value={erros} onChange={(e) => setErros(Number(e.target.value))}
                    className="w-full bg-[#fce8e8] border border-red-200 rounded-lg p-3 outline-none text-[#e62020] font-black text-center shadow-[inset_3px_3px_6px_rgba(230,32,32,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 pt-5 mt-2">
              <div className="flex items-center gap-3">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alerta:</span>
                 <span className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase shadow-md ${statusRiscoAtual.cor}`}>
                    {statusRiscoAtual.nivel}
                 </span>
              </div>
              <button 
                onClick={registrarBateria} disabled={total <= 0}
                className="bg-gradient-to-r from-[#1a4bb8] to-blue-600 text-white font-black py-3 px-8 rounded-lg uppercase tracking-widest transition-all shadow-[6px_6px_12px_rgba(26,75,184,0.3),-6px_-6px_-12px_rgba(255,255,255,0.9)] active:shadow-inner disabled:opacity-50 border border-blue-500"
              >
                Registrar Operação ➔
              </button>
            </div>
          </div>

          {/* QUADRO DE ESTUDOS RANKING (MAPA DE VULNERABILIDADES) */}
          <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest flex items-center gap-3 border-b-2 border-slate-300 pb-3">
            <span className="w-3 h-3 bg-[#1a4bb8] rounded-sm inline-block shadow-[0_0_5px_#1a4bb8]"></span>
            Auditoria de Vulnerabilidades
          </h2>

          {Object.keys(dadosAgrupados).length === 0 && !carregando ? (
             <div className="bg-[#f1f3f6] p-8 rounded-xl shadow-[inset_5px_5px_10px_rgba(0,0,0,0.05),inset_-5px_-5px_10px_rgba(255,255,255,1)] text-center text-slate-400 font-bold uppercase tracking-widest mb-10">
               Base de dados vazia.
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {Object.entries(dadosAgrupados).map(([nomeDisciplina, dadosDisciplina]: any) => {
                
                const percMateria = dadosDisciplina.total > 0 ? ((dadosDisciplina.acertos / dadosDisciplina.total) * 100).toFixed(1) : 0;
                const topicosOrdenados = Object.entries(dadosDisciplina.topicos).sort((a: any, b: any) => {
                  const percA = a[1].total > 0 ? (a[1].acertos / a[1].total) : 0;
                  const percB = b[1].total > 0 ? (b[1].acertos / b[1].total) : 0;
                  return percA - percB;
                });

                return (
                  <div key={nomeDisciplina} className="bg-[#f1f3f6] rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] border border-white p-6 flex flex-col relative print:shadow-none print:border-slate-300">
                    
                    <div className="flex justify-between items-center border-b-2 border-slate-200 pb-3 mb-5">
                      <h3 className="font-black text-slate-700 text-lg uppercase tracking-wide">{nomeDisciplina}</h3>
                      <div className="text-right bg-slate-200 px-3 py-1 rounded-lg shadow-inner border border-slate-300">
                        <span className="text-2xl font-black text-[#1a4bb8] drop-shadow-sm">{percMateria}%</span>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-[-2px]">Eficácia</p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-5">
                      {topicosOrdenados.map(([nomeTopico, dadosTopico]: any) => {
                        const percTopico = dadosTopico.total > 0 ? ((dadosTopico.acertos / dadosTopico.total) * 100) : 0;
                        let corBarra = "bg-gradient-to-r from-emerald-500 to-[#10b981]"; 
                        if (percTopico === 0 && dadosTopico.total > 0) corBarra = "bg-black"; 
                        else if (percTopico < 60) corBarra = "bg-gradient-to-r from-red-600 to-[#e62020]"; 
                        else if (percTopico < 80) corBarra = "bg-gradient-to-r from-yellow-500 to-yellow-400"; 

                        return (
                          <div key={nomeTopico}>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-slate-600 truncate pr-2 uppercase" title={nomeTopico}>{nomeTopico}</span>
                              <span className="text-slate-900 font-black">{percTopico.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner border border-slate-300">
                              <div className={`${corBarra} h-2 rounded-full shadow-sm transition-all duration-500`} style={{ width: `${percTopico}%` }}></div>
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold mt-1 text-right uppercase tracking-widest">
                              {dadosTopico.acertos} OK / {dadosTopico.erros} FALHAS
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LOG BRUTO DA MISSÃO (ESCONDIDO NA IMPRESSÃO PARA POUPAR PAPEL) */}
          <h2 className="text-sm font-black text-slate-400 mb-4 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 print:hidden">
            Registros de Banco de Dados
          </h2>
          
          {carregando ? (
            <div className="text-center p-10 text-[#1a4bb8] font-bold uppercase tracking-widest animate-pulse print:hidden">
              Carregando Servidor...
            </div>
          ) : historico.length === 0 ? (
            <div className="bg-[#f1f3f6] p-8 rounded-xl shadow-inner border border-slate-200 text-center text-slate-400 font-bold uppercase tracking-widest print:hidden">
              Log vazio.
            </div>
          ) : (
            <div className="bg-[#f1f3f6] rounded-xl shadow-[inset_4px_4px_10px_rgba(0,0,0,0.05),inset_-4px_-4px_10px_rgba(255,255,255,1)] border border-white overflow-hidden print:hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-200/50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-300">
                    <th className="p-4 font-black">Disciplina / Assunto</th>
                    <th className="p-4 font-black text-center">Desempenho</th>
                    <th className="p-4 font-black text-center">Risco Acusado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50">
                  {historico.map((item) => (
                    <tr key={item.id} className="hover:bg-white/50 transition-colors">
                      <td className="p-4">
                        <div className="font-black text-slate-700 text-sm uppercase">{item.disciplina}</div>
                        <div className="text-xs text-slate-500 font-bold">{item.assunto}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-lg font-black text-slate-800">{item.total - item.erros}</span>
                        <span className="text-xs text-slate-400 mx-1 font-bold">/</span>
                        <span className="text-xs font-bold text-slate-600">{item.total}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-1.5 rounded-md text-[9px] font-black tracking-widest uppercase shadow-sm ${item.risco_cor}`}>
                          {item.risco_nivel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </main>
  );
}
