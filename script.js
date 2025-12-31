/**
 * SISTEMA DE CÁLCULO TRIBUTÁRIO 2025
 */

document.addEventListener('DOMContentLoaded', () => {
    fetchDolar();
});

// Busca cotação atualizada do dólar
async function fetchDolar() {
    const inputCotacao = document.getElementById('cotacao');
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
        const data = await response.json();
        const dolar = parseFloat(data.USDBRL.bid).toFixed(2);
        inputCotacao.value = dolar;
    } catch (error) {
        console.error("Erro na API. Usando valor padrão.");
        inputCotacao.value = "5.60";
    }
}

function calcular() {
    const usd = parseFloat(document.getElementById('valorUSD').value);
    const cotacao = parseFloat(document.getElementById('cotacao').value);
    const aliquotaICMS = parseFloat(document.getElementById('estado').value);

    if (!usd || usd <= 0) {
        alert("Por favor, insira o valor do produto em Dólar.");
        return;
    }

    const valorBRL = usd * cotacao;
    let impostoFederal = 0;

    // REGRA 2025: 
    // Até $50 -> 20%
    // Acima de $50 -> 60% com abatimento fixo de $20
    if (usd <= 50) {
        impostoFederal = valorBRL * 0.20;
    } else {
        const impostoBruto = valorBRL * 0.60;
        const abatimento = 20 * cotacao;
        impostoFederal = impostoBruto - abatimento;
    }

    // Cálculo ICMS "Por Dentro" (Base de Cálculo inclui o próprio imposto)
    // Fórmula: (Valor + Imposto Federal) / (1 - Alíquota ICMS) * Alíquota ICMS
    const baseComFederal = valorBRL + impostoFederal;
    const baseICMS = baseComFederal / (1 - aliquotaICMS);
    const valorICMS = baseICMS * aliquotaICMS;

    const totalFinal = valorBRL + impostoFederal + valorICMS;
    const taxaEfetiva = ((totalFinal - valorBRL) / valorBRL) * 100;

    // Atualização da Interface
    document.getElementById('resOriginal').innerText = `R$ ${valorBRL.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('resFederal').innerText = `R$ ${impostoFederal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('resEstadual').innerText = `R$ ${valorICMS.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('resTotal').innerText = `R$ ${totalFinal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    
    const alerta = document.getElementById('alertaEfetivo');
    alerta.innerText = `Carga Tributária Real: ${taxaEfetiva.toFixed(1)}% do valor original`;

    // Mostra o resultado com scroll suave
    const resDiv = document.getElementById('resultado');
    resDiv.classList.remove('hidden');
    resDiv.scrollIntoView({ behavior: 'smooth' });
}
