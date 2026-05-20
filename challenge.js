// Variáveis globais para os slots do HTML lerem os números gerados
let x = 0;
let y = 0;
let conta = 0; 
let operacao = ""; 

/**
 * Função principal que gera o desafio.
 * @param {number} fase - A fase atual enviada pelo HTML ou por outro JS
 */
function desafio(fase) {
    // Converte para garantir que estamos lidando com um número inteiro
    fase = parseInt(fase);

    // Se a fase recebida for 0, o código entende que é para avançar/pular de fase
    if (fase === 0) {
        operacao = "";
        // Dispara uma função global ou evento avisando o outro script para avançar
        if (typeof avancarFaseNoHtml === "function") {
            avancarFaseNoHtml(); 
        }
        return; 
    }

    // FASES 1 a 3: Soma de 1 algarismo (1 a 9)
    if (fase === 1 || fase === 2 || fase === 3) {
        x = Math.floor(Math.random() * 9) + 1;
        y = Math.floor(Math.random() * 9) + 1;
        conta = x + y;
        operacao = "+";
    }

    // FASES 4 a 6: Soma de 2 algarismos (10 a 99)
    else if (fase === 4 || fase === 5 || fase === 6) {
        x = Math.floor(Math.random() * 39) + 10;
        y = Math.floor(Math.random() * 19) + 10;
        conta = x + y;
        operacao = "+";
    }

    // FASES 7 a 9: Subtração de 1 algarismo, garantindo X > Y
    else if (fase === 7 || fase === 8 || fase === 9) {
        x = Math.floor(Math.random() * 8) + 2; // Mínimo 2
        y = Math.floor(Math.random() * (x - 1)) + 1; 
        conta = x - y;
        operacao = "-";
    }   

    // FASES 10 a 12: Subtração de 2 algarismos, garantindo X > Y
    else if (fase === 10 || fase === 11 || fase === 12) {
        x = Math.floor(Math.random() * 39) + 10;
        y = Math.floor(Math.random() * (x - 10)) + 10; 
        conta = x - y;
        operacao = "-";
    } 

    // FASES 13 e 14: Multiplicação de 1 algarismo (1 a 9)
    else if (fase === 13 || fase === 14) {
        x = Math.floor(Math.random() * 9) + 1;
        y = Math.floor(Math.random() * 9) + 1;
        conta = x * y;
        operacao = "*";
    } 

    // FASES 15 e 16: Multiplicação de 2 algarismos (10 a 99)
    else if (fase === 15 || fase === 16) {
        x = Math.floor(Math.random() * 89) + 10;
        y = Math.floor(Math.random() * 89) + 10;
        conta = x * y;
        operacao = "*";
    }

    // Atualiza os slots visuais na tela
    atualizarTelaDoJogo();
}

function atualizarTelaDoJogo() {
    const slotX = document.getElementById("slotX");
    const slotOp = document.getElementById("slotOperacao");
    const slotY = document.getElementById("slotY");

    if(slotX && slotY && slotOp) {
        slotX.innerText = x;
        slotOp.innerText = operacao;
        slotY.innerText = y;
    }
}

/**
 * Verifica se a resposta enviada pelo input do usuário está correta.
 * Não altera a fase aqui dentro, apenas valida o turno atual.
 */
function verificarResposta() {
    let inputResposta = document.getElementById("respostaUsuario");
    let respostaUsuario = parseInt(inputResposta.value);

    if (respostaUsuario === conta) {
        alert("Acertou o turno!");
        inputResposta.value = ""; 
        
        // Retorna true ou executa uma ação de sucesso.
        // Como o controle da fase está fora, o seu outro script decidirá se 
        // chama desafio() novamente na mesma fase ou se muda de fase no HTML.
        return true; 
    } else {
        alert("Errado! Tente novamente.");
        return false;
    }
}