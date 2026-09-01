/*
INTEGRANTES:
Felipe Helamã de Andrade Nievola nº12
Matheus Vinícius de Souza nº 32
TURMA: 3ºK
*/
const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?#&+-_';
const botoes = document.querySelectorAll('.parametro-senha-botoes .parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');
const botaoReiniciar = document.querySelector('#reiniciar-senha');
const entropiaElemento = document.querySelector('.entropia');

botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;
botaoReiniciar.onclick = reiniciaSenha;
checkbox.forEach((item) => item.addEventListener('change', geraSenha));

function reiniciaSenha() {
    geraSenha();
}

function diminuiTamanho() {
    if (tamanhoSenha > 6) {
        tamanhoSenha--;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function aumentaTamanho() {
    if (tamanhoSenha < 25) {
        tamanhoSenha++;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

function getTiposSelecionados() {
    const tipos = [];

    if (checkbox[0].checked) {
        tipos.push({ caracteres: letrasMaiusculas });
    }
    if (checkbox[1].checked) {
        tipos.push({ caracteres: letrasMinusculas });
    }
    if (checkbox[2].checked) {
        tipos.push({ caracteres: numeros });
    }
    if (checkbox[3].checked) {
        tipos.push({ caracteres: simbolos });
    }

    return tipos;
}

function geraSenha() {
    const tiposSelecionados = getTiposSelecionados();

    if (tiposSelecionados.length === 0) {
        campoSenha.value = '';
        entropiaElemento.textContent = '';
        forcaSenha.classList.remove('fraca', 'media', 'forte');
        alert('Selecione ao menos um tipo de caractere para gerar a senha.');
        return;
    }

    if (tamanhoSenha < tiposSelecionados.length) {
        tamanhoSenha = tiposSelecionados.length;
        numeroSenha.textContent = tamanhoSenha;
    }

    const alfabeto = tiposSelecionados.map((tipo) => tipo.caracteres).join('');
    const senha = [];

    tiposSelecionados.forEach((tipo) => {
        const indiceAleatorio = Math.floor(Math.random() * tipo.caracteres.length);
        senha.push(tipo.caracteres[indiceAleatorio]);
    });

    while (senha.length < tamanhoSenha) {
        const tipoAleatorio = tiposSelecionados[Math.floor(Math.random() * tiposSelecionados.length)];
        const indiceAleatorio = Math.floor(Math.random() * tipoAleatorio.caracteres.length);
        senha.push(tipoAleatorio.caracteres[indiceAleatorio]);
    }

    for (let i = senha.length - 1; i > 0; i--) {
        const indiceAleatorio = Math.floor(Math.random() * (i + 1));
        [senha[i], senha[indiceAleatorio]] = [senha[indiceAleatorio], senha[i]];
    }

    campoSenha.value = senha.join('');

    const tamanhoAlfabeto = alfabeto.length;
    const entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    const tentativasPorSegundo = 100e6;
    const segundosPorDia = 60 * 60 * 24;
    const dias = Math.floor(Math.pow(2, entropia) / (tentativasPorSegundo * segundosPorDia));

    if (!Number.isFinite(dias) || dias > 1e12) {
        entropiaElemento.textContent = 'Um computador pode levar mais de 1.000.000.000.000 dias';
    } else {
        entropiaElemento.textContent = 'Um computador pode levar até ' + dias + ' dias';
    }

    classificaSenha(entropia);
}

function classificaSenha(entropia) {
    forcaSenha.classList.remove('fraca', 'media', 'forte');

    if (entropia > 57) {
        forcaSenha.classList.add('forte');
    } else if (entropia > 35 && entropia < 57) {
        forcaSenha.classList.add('media');
    } else {
        forcaSenha.classList.add('fraca');
    }
}

geraSenha();
