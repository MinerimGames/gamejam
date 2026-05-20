let playerVida = 100;
let inimigoVida = 100;

const vidaMaximaPlayer = 100;
const vidaMaximaInimigo = 100;

let acaoPendente = "";
let faseDaConta = 1;
let tempoPopupResultado = null;

function numeroAleatorio(minimo, maximo) {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

function limitarVida() {
  playerVida = Math.max(0, Math.min(playerVida, vidaMaximaPlayer));
  inimigoVida = Math.max(0, Math.min(inimigoVida, vidaMaximaInimigo));
}

function atualizarTela(mensagem = "") {
  const hpPlayer = document.getElementById("hpPlayer");
  const hpInimigo = document.getElementById("hpInimigo");
  const barraPlayer = document.getElementById("vidaPlayer");
  const barraInimigo = document.getElementById("vidaInimigo");
  const log = document.getElementById("log-batalha");

  if (hpPlayer) {
    hpPlayer.textContent = playerVida;
  }

  if (hpInimigo) {
    hpInimigo.textContent = inimigoVida;
  }

  if (barraPlayer) {
    barraPlayer.style.width = `${(playerVida / vidaMaximaPlayer) * 100}%`;
  }

  if (barraInimigo) {
    barraInimigo.style.width = `${(inimigoVida / vidaMaximaInimigo) * 100}%`;
  }

  if (log && mensagem !== "") {
    log.textContent = mensagem;
  }
}

function batalhaAcabou() {
  if (playerVida <= 0) {
    atualizarTela("Voce perdeu.");
    mostrarTelaFinal("derrota");
    return true;
  }

  if (inimigoVida <= 0) {
    atualizarTela("Voce venceu.");
    mostrarTelaFinal("vitoria");
    return true;
  }

  return false;
}

function abrirPopupDaConta() {
  const popup = document.querySelector(".popup-overlay");
  const input = document.getElementById("respostaUsuario");

  if (popup) {
    popup.style.display = "flex";
  }

  if (input) {
    input.value = "";
    input.focus();
  }

  // Gera a conta usando o sistema que ja existe no challenge.js.
  if (typeof desafio === "function") {
    desafio(faseDaConta);
  }
}

function fecharPopupDaConta() {
  const popup = document.querySelector(".popup-overlay");

  if (popup) {
    popup.style.display = "none";
  }
}

function mostrarPopupResultado(texto) {
  const popup = document.getElementById("resultadoPopup");
  const textoPopup = document.getElementById("textoResultado");

  if (!popup || !textoPopup) {
    return;
  }

  textoPopup.textContent = texto;
  popup.style.display = "flex";

  clearTimeout(tempoPopupResultado);

  tempoPopupResultado = setTimeout(() => {
    popup.style.display = "none";
  }, 900);
}

function fecharPopupResultado() {
  const popup = document.getElementById("resultadoPopup");

  clearTimeout(tempoPopupResultado);

  if (popup) {
    popup.style.display = "none";
  }
}

function mostrarTelaFinal(tipo) {
  const telaVitoria = document.getElementById("telaVitoria");
  const telaDerrota = document.getElementById("telaDerrota");

  acaoPendente = "";
  fecharPopupDaConta();
  fecharPopupResultado();

  if (telaVitoria) {
    telaVitoria.style.display = "none";
  }

  if (telaDerrota) {
    telaDerrota.style.display = "none";
  }

  if (tipo === "vitoria" && telaVitoria) {
    telaVitoria.style.display = "flex";
  }

  if (tipo === "derrota" && telaDerrota) {
    telaDerrota.style.display = "flex";
  }
}

function fecharTelasFinais() {
  const telaVitoria = document.getElementById("telaVitoria");
  const telaDerrota = document.getElementById("telaDerrota");

  if (telaVitoria) {
    telaVitoria.style.display = "none";
  }

  if (telaDerrota) {
    telaDerrota.style.display = "none";
  }
}

function pedirContaAntesDaAcao(acao) {
  if (batalhaAcabou()) {
    return;
  }

  acaoPendente = acao;
  abrirPopupDaConta();
}

function ataqueInimigo(defendendo = false, tentandoEsquivar = false) {
  let dano = numeroAleatorio(8, 18);
  let mensagem = `O inimigo atacou e deu ${dano} de dano.`;

  if (Math.random() < 0.15) {
    dano = dano * 2;
    mensagem = `O inimigo acertou critico de ${dano} de dano.`;
  }

  if (defendendo) {
    dano = Math.floor(dano / 2);
    mensagem = `Voce defendeu e recebeu ${dano} de dano.`;
  }

  if (tentandoEsquivar) {
    if (Math.random() < 0.5) {
      dano = 0;
      mensagem = "Voce esquivou do ataque inimigo.";
    } else {
      mensagem = `A esquiva falhou e voce recebeu ${dano} de dano.`;
    }
  }

  playerVida = playerVida - dano;
  limitarVida();

  if (playerVida <= 0) {
    return `${mensagem} Voce perdeu.`;
  }

  return mensagem;
}

function executarAtaque() {
  let dano = numeroAleatorio(12, 22);
  let mensagem = `Voce atacou e deu ${dano} de dano.`;

  if (Math.random() < 0.2) {
    dano = dano * 2;
    mensagem = `Voce acertou critico de ${dano} de dano.`;
  }

  inimigoVida = inimigoVida - dano;
  limitarVida();

  if (inimigoVida <= 0) {
    atualizarTela(`${mensagem} Voce venceu.`);
    mostrarTelaFinal("vitoria");
    return;
  }

  atualizarTela(`${mensagem} ${ataqueInimigo()}`);
  batalhaAcabou();
}

function executarDefesa() {
  atualizarTela(`Voce defendeu. ${ataqueInimigo(true, false)}`);
  batalhaAcabou();
}

function executarCura() {
  const vidaAntes = playerVida;
  playerVida = playerVida + 20;
  limitarVida();

  const quantoCurou = playerVida - vidaAntes;
  atualizarTela(`Voce curou ${quantoCurou} de vida. ${ataqueInimigo()}`);
  batalhaAcabou();
}

function executarEsquiva() {
  atualizarTela(`Voce tentou esquivar. ${ataqueInimigo(false, true)}`);
  batalhaAcabou();
}

function executarAcaoPendente() {
  const acao = acaoPendente;
  acaoPendente = "";

  if (acao === "ataque") {
    executarAtaque();
  } else if (acao === "defesa") {
    executarDefesa();
  } else if (acao === "cura") {
    executarCura();
  } else if (acao === "esquiva") {
    executarEsquiva();
  }
}

function aplicarErroDaConta() {
  const mensagem = ataqueInimigo();
  acaoPendente = "";
  fecharPopupDaConta();
  mostrarPopupResultado("ERROU!");
  atualizarTela(`Voce errou a conta. ${mensagem}`);
  batalhaAcabou();
}

function verificarRespostaDaBatalha() {
  const inputResposta = document.getElementById("respostaUsuario");
  const respostaUsuario = parseInt(inputResposta.value);

  // A conta vem do challenge.js. Aqui a gente so olha se a resposta bate.
  const acertou = respostaUsuario === conta;

  if (inputResposta) {
    inputResposta.value = "";
  }

  if (!acaoPendente) {
    return acertou;
  }

  if (acertou) {
    fecharPopupDaConta();
    mostrarPopupResultado("ACERTOU!");

    if (faseDaConta < 16) {
      faseDaConta = faseDaConta + 1;
    }

    executarAcaoPendente();
  } else {
    aplicarErroDaConta();
  }

  return acertou;
}

function ataque() {
  pedirContaAntesDaAcao("ataque");
}

function defesa() {
  pedirContaAntesDaAcao("defesa");
}

function cura() {
  pedirContaAntesDaAcao("cura");
}

function esquiva() {
  pedirContaAntesDaAcao("esquiva");
}

function reiniciarBatalha() {
  playerVida = vidaMaximaPlayer;
  inimigoVida = vidaMaximaInimigo;
  acaoPendente = "";
  faseDaConta = 1;
  fecharPopupDaConta();
  fecharPopupResultado();
  fecharTelasFinais();
  atualizarTela("Batalha reiniciada.");
}

function ligarBotaoUmaVez(botao, funcao) {
  if (!botao || botao.dataset.batalhaLigado === "sim") {
    return;
  }

  botao.addEventListener("click", funcao);
  botao.dataset.batalhaLigado = "sim";
}

function ligarBotoesPorTexto() {
  const botoes = document.querySelectorAll(".botao-acao");

  botoes.forEach((botao) => {
    const texto = botao.textContent.trim().toUpperCase();

    if (texto.includes("ATAQUE")) {
      ligarBotaoUmaVez(botao, ataque);
    } else if (texto.includes("CURA")) {
      ligarBotaoUmaVez(botao, cura);
    } else if (texto.includes("DEFESA")) {
      ligarBotaoUmaVez(botao, defesa);
    } else if (texto.includes("ESQUIVA")) {
      ligarBotaoUmaVez(botao, esquiva);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  ligarBotoesPorTexto();
  ligarBotaoUmaVez(document.getElementById("btnVoltarVitoria"), reiniciarBatalha);
  ligarBotaoUmaVez(document.getElementById("btnVoltarDerrota"), reiniciarBatalha);
  atualizarTela();
});

window.ataque = ataque;
window.defesa = defesa;
window.cura = cura;
window.esquiva = esquiva;
window.reiniciarBatalha = reiniciarBatalha;
window.verificarResposta = verificarRespostaDaBatalha;
