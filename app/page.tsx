"use client";

import React, { useState } from 'react';

// Algoritmo Estratégico
function calcularIndiceRisco(erros: number, pesoEstrategico: number, totalQuestoes: number) {
  if (totalQuestoes === 0 || isNaN(totalQuestoes)) return { nivel: 'AGUARDANDO DADOS', cor: 'bg-slate-200 text-slate-800' };
  
  const risco = (erros * pesoEstrategico) / totalQuestoes;
  
  if (risco > 0.30) return { nivel: 'RISCO ALTO', cor: 'bg-red-600 text-white' };
  if (risco >= 0.20) return { nivel: 'RISCO MÉDIO', cor: 'bg-amber-500 text-black' };
  return { nivel: 'RISCO BAIXO', cor: 'bg-emerald-600 text-white' };
}

export default function Dashboard() {
  const [disciplina, setDisciplina] = useState("Língua Portuguesa");
  const [assunto, setAssunto] = useState(""); 
  const [peso, setPeso] = useState<number>(1.3);
  const [total, setTotal] = useState<number>(20);
  const [erros, setErros] = useState<number>(0);
  const [historico, setHistorico] = useState<any[]>([]);

  const statusRiscoAtual = calcularIndiceRisco(erros, peso, total);

  const registrarBateria = () => {
    if (total <= 0) return;
    const novoRegistro = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      disciplina,
      assunto: assunto || "Tópico Geral",
      peso,
      total,
      erros,
      risco: calcularIndiceRisco(erros, peso, total)
    };
    setHistorico([novoRegistro, ...historico]);
    setTotal(0);
    setErros(0);
    setAssunto(""); 
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* TÍTULO MITOLÓGICO / ESTRATÉGICO */}
        <div className="mb-8 border-b-2 border-slate-200 pb-4">
          <h1 className="text-4xl font-black text-slate-900 mb-1 uppercase tracking-tighter">
            Sistema Centurião <span className="text-blue-700">| CFO PMBA</span>
          </h1>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
            Guerra Estratégica • Método T.O.P.-20 • G. Almeida
          </h2>
        </div>

        {/* Painel de Inserção de Dados */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
            
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Disciplina</label>
              <select 
                value={disciplina} 
                onChange={(e) => setDisciplina(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:ring-0 outline-none bg-white font-semibold text-slate-700 transition-colors"
              >
                <option value="Língua Portuguesa">Língua Portuguesa</option>
                <option value="Direito Penal">Direito Penal</option>
                <option value="Direito Penal Militar">Direito Penal Militar</option>
                <option value="Direito Constitucional">Dir. Constitucional</option>
                <option value="Direito Administrativo">Dir. Administrativo</option>
                <option value="Direitos Humanos">Direitos Humanos</option>
                <option value="Matemática / RLM">Matemática / RLM</option>
                <option value="História do Brasil/Bahia">História</option>
                <option value="Geografia do Brasil/Bahia">Geografia</option>
                <option value="Inglês">Inglês</option>
                <option value="Informática">Informática</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-blue-600 uppercase mb-1">Tópico do Edital</label>
              <input 
                type="text" 
                value={assunto} 
                onChange={(e) => setAssunto(e.target.value)} 
                placeholder="Ex: Crimes contra a Vida"
                className="w-full border-2 border-blue-100 bg-blue-50/50 rounded-lg p-2.5 focus:border-blue-600 focus:ring-0 outline-none font-medium text-slate-800 transition-colors"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Peso</label>
              <input 
                type="number" step="0.1" value={peso} onChange={(e) => setPeso(Number(e.target.value))}
                className="w-full border-2 border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:ring-0 outline-none font-bold text-slate-700 text-center"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:col-span-1">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total</label>
                <input 
                  type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))}
                  className="w-full border-2 border-slate-200 rounded-lg p-2.5 focus:border-blue-600 focus:ring-0 outline-none font-black text-slate-700 text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-red-500 uppercase mb-1">Erros</label>
                <input 
                  type="number" value={erros} onChange={(e) => setErros(Number(e.target.value))}
                  className="w-full border-2 border-red-200 bg-red-50/50 rounded-lg p-2.5 focus:border-red-600 focus:ring-0 outline-none text-red-600 font-black text-center"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t-2 border-slate-100 pt-5 mt-2">
            <div className="flex items-center gap-3">
               <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Status de Risco:</span>
               <span className={`px-4 py-1.5 rounded-md text-xs font-black shadow-sm tracking-wider ${statusRiscoAtual.cor}`}>
                  {statusRiscoAtual.nivel}
               </span>
            </div>
            <button 
              onClick={registrarBateria}
              className="bg-slate-900 hover:bg-blue-700 text-white font-black py-2.5 px-8 rounded-lg uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Gravar Combate ➔
            </button>
          </div>
        </div>

        {/* Tabela de Histórico */}
        <h2 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-sm inline-block"></span>
          Histórico de Reconhecimento
        </h2>
        
        {historico.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 text-center text-slate-400 font-medium">
            A base de dados está limpa. Inicie a primeira bateria de questões para calibrar o sistema.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-widest border-b-2 border-slate-200">
                  <th className="p-4 font-black">Data</th>
                  <th className="p-4 font-black">Disciplina / Tópico</th>
                  <th className="p-4 font-black text-center">Desempenho</th>
                  <th className="p-4 font-black text-center">Nível de Risco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historico.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-slate-400">{item.data}</td>
                    <td className="p-4">
                      <div className="font-black text-slate-800 text-base">{item.disciplina}</div>
                      <div className="text-sm text-blue-600 font-bold mt-0.5">{item.assunto}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xl font-black text-slate-800">{item.total - item.erros}</span>
                      <span className="text-sm text-slate-300 mx-1 font-bold">/</span>
                      <span className="text-sm font-bold text-slate-500">{item.total}</span>
                      <div className="text-xs text-red-500 font-black mt-1 uppercase tracking-wider">{item.erros} erros</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-md text-[10px] font-black tracking-widest uppercase ${item.risco.cor}`}>
                        {item.risco.nivel}
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