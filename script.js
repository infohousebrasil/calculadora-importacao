/**
 * script.js - Calculadora de Importação 2025
 * Versão Blindada para Mobile e Desktop
 */

document.addEventListener('DOMContentLoaded', () => {
    fetchDolar();
});

// Busca cotação atual do dólar via API
async function fetchDolar() {
    const inputCotacao = document.getElementById('cotacao');
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
        if (!response.ok) throw new Error('Falha na API');
        const data = await response.json();
        const bid = parseFloat(data.USDBRL.bid);
        inputCotacao.value = bid.toFixed(2);
    } catch (error) {
        console.error("Erro na API de câmbio:", error);
        inputCotacao.value = "5.50"; // Valor de segurança caso a API falhe
    }
}

function calcular() {
    const valorUSD = parseFloat(document.getElementById('valorUSD').value);
    const cotacao = parseFloat(document.getElementById('cotacao').value);
    const aliquotaICMS = parseFloat(document.getElementById('estado').value);

    if (!valorUSD || isNaN(valorUSD)) {
        alert("Por favor, insira o valor do produto.");
        return;
    }

    const totalBRL = valorUSD * cotacao;
    let impostoII = 0;

    // REGRA FEDERAL 2025: 
    // Até $50 = 20%
    // Acima de $50 = 60% com abatimento de $20 (em dólar convertido)
    if (valorUSD <= 50) {
        impostoII = totalBRL * 0.20;
    } else {
        const impostoBruto = totalBRL * 0.60;
        const abatimentoBRL = 20 * cotacao;
        impostoII = impostoBruto - abatimentoBRL;
    }

    // REGRA ESTADUAL (ICMS por dentro / Gross-up)
    // Base ICMS = (Valor + II) / (1 - Alíquota)
    const baseICMS = (totalBRL + impostoII) / (1 - aliquotaICMS);
    const valorICMS = baseICMS * aliquotaICMS;

    const totalFinal = totalBRL + impostoII + valorICMS;
    const porcentagemEfetiva = ((totalFinal - totalBRL) / totalBRL) * 100;

    // Atualização da Interface com Formatação Brasileira
    document.getElementById('resOriginal').innerText = "R$ " + totalBRL.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('resFederal').innerText = "R$ " + impostoII.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('resEstadual').innerText = "R$ " + valorICMS.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('resTotal').innerText = "R$ " + totalFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    
    document.getElementById('alertaEfetivo').innerText = 
        `Carga tributária final: ${porcentagemEfetiva.toFixed(1)}% sobre o valor do item.`;

    // Exibe o card de resultados
    const resDiv = document.getElementById('resultado');
    resDiv.style.display = 'block';

    // Rola suavemente para o resultado (Importante no mobile)
    setTimeout(() => {
        resDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * CONTROLE DO MODAL - Otimizado para Mobile (iOS/Android)
 */
function abrirModal() {
    const modal = document.getElementById('modalCursos');
    if (modal) {
        // Delay de 150ms para evitar conflito com a rolagem do scrollIntoView
        setTimeout(() => {
            modal.style.setProperty('display', 'flex', 'important');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Trava o fundo
            
            // Força o reflow do navegador (Fix para renderização em browsers mobile antigos)
            modal.offsetHeight; 
        }, 150);
    }
}

function fecharModal() {
    const modal = document.getElementById('modalCursos');
    if (modal) {
        modal.style.setProperty('display', 'none', 'important');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Destrava o fundo
    }
}

// Fecha se clicar no fundo escuro (Trata clique e toque)
const handleOutsideClick = (event) => {
    const modal = document.getElementById('modalCursos');
    if (event.target === modal) {
        fecharModal();
    }
};

window.addEventListener('click', handleOutsideClick);
window.addEventListener('touchstart', handleOutsideClick, { passive: true });
