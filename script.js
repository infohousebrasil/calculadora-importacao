/**
 * Lógica de Impostos de Importação 2025
 * Mantendo o foco em simplicidade e precisão.
 */

document.addEventListener('DOMContentLoaded', () => {
    fetchDolar();
});

async function fetchDolar() {
    const inputCotacao = document.getElementById('cotacao');
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
        const data = await response.json();
        const dolar = parseFloat(data.USDBRL.bid).toFixed(2);
        inputCotacao.value = dolar;
    } catch (error) {
        console.error("Falha ao buscar cotação. Usando valor padrão.");
        inputCotacao.value = "5.50";
    }
}

function calcular() {
    const usd = parseFloat(document.getElementById('valorUSD').value);
    const cotacao = parseFloat(document.getElementById('cotacao').value);
    const aliquotaICMS = parseFloat(document.getElementById('estado').value);

    if (!usd || !cotacao) {
        alert("Por favor, insira o valor do produto.");
        return;
    }

    const totalBRL = usd * cotacao;
    let impostoFederal = 0;

    // Regra Federal Progressiva 2025
    if (usd <= 50) {
        impostoFederal = totalBRL * 0.20;
    } else {
        const abatimentoBRL = 20 * cotacao;
        impostoFederal = (totalBRL * 0.60) - abatimentoBRL;
    }

    // Cálculo ICMS "Por Dentro"
    // Base de Cálculo = (Valor do Produto + Imposto Federal) / (1 - Alíquota ICMS)
    const baseCalculoICMS = (totalBRL + impostoFederal) / (1 - aliquotaICMS);
    const valorICMS = baseCalculoICMS * aliquotaICMS;

    const custoFinal = totalBRL + impostoFederal + valorICMS;
    const porcentagemEfetiva = ((custoFinal - totalBRL) / totalBRL) * 100;

    // Exibição nos campos do HTML
    document.getElementById('resOriginal').innerText = `R$ ${totalBRL.toFixed(2)}`;
    document.getElementById('resFederal').innerText = `R$ ${impostoFederal.toFixed(2)}`;
    document.getElementById('resEstadual').innerText = `R$ ${valorICMS.toFixed(2)}`;
    document.getElementById('resTotal').innerText = `R$ ${custoFinal.toFixed(2)}`;
    
    const alerta = document.getElementById('alertaEfetivo');
    alerta.innerText = `⚠️ Custo Tributário Real: ${porcentagemEfetiva.toFixed(1)}% sobre o valor original.`;

    document.getElementById('resultado').style.display = 'block';
    
    // Smooth scroll para o resultado
    window.scrollTo({
        top: document.getElementById('resultado').offsetTop - 20,
        behavior: 'smooth'
    });
}