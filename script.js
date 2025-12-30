/**
 * Logica Blindada - Calculadora de Importação 2025
 */

document.addEventListener('DOMContentLoaded', () => {
    fetchDolar();
});

// Busca cotação atual do dólar via API
async function fetchDolar() {
    const inputCotacao = document.getElementById('cotacao');
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
        const data = await response.json();
        const bid = parseFloat(data.USDBRL.bid);
        inputCotacao.value = bid.toFixed(2);
    } catch (error) {
        console.error("Erro na API de câmbio:", error);
        inputCotacao.value = "5.50"; // Fallback
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
    // Acima de $50 = 60% com abatimento de $20 (no valor em dólar)
    if (valorUSD <= 50) {
        impostoII = totalBRL * 0.20;
    } else {
        const impostoBruto = totalBRL * 0.60;
        const abatimentoBRL = 20 * cotacao;
        impostoII = impostoBruto - abatimentoBRL;
    }

    // REGRA ESTADUAL (ICMS por dentro)
    // Base ICMS = (Valor + II) / (1 - Alíquota)
    const baseICMS = (totalBRL + impostoII) / (1 - aliquotaICMS);
    const valorICMS = baseICMS * aliquotaICMS;

    const totalFinal = totalBRL + impostoII + valorICMS;
    const porcentagemEfetiva = ((totalFinal - totalBRL) / totalBRL) * 100;

    // Preenchimento dos resultados
    document.getElementById('resOriginal').innerText = "R$ " + totalBRL.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('resFederal').innerText = "R$ " + impostoII.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('resEstadual').innerText = "R$ " + valorICMS.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('resTotal').innerText = "R$ " + totalFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    
    document.getElementById('alertaEfetivo').innerText = 
        "Carga tributária final: " + porcentagemEfetiva.toFixed(1) + "% sobre o valor do item.";

    // Exibe o card de resultados
    const resDiv = document.getElementById('resultado');
    resDiv.style.display = 'block';

    // Rola suavemente para o resultado
    resDiv.scrollIntoView({ behavior: 'smooth' });
}

// Controle do Modal (JS Puro para evitar bugs de classe)
function abrirModal() {
    const modal = document.getElementById('modalCursos');
    modal.style.display = 'flex'; 
    document.body.style.overflow = 'hidden'; 
}

function fecharModal() {
    const modal = document.getElementById('modalCursos');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fecha se clicar no fundo escuro
window.onclick = function(event) {
    const modal = document.getElementById('modalCursos');
    if (event.target == modal) {
        fecharModal();
    }
}
