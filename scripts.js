const botaoAdicionar = document.querySelector("#adicionador");

botaoAdicionar.addEventListener("click", function (event) {
    event.preventDefault();

    const formularios = document.querySelector("#forms");
    const quantidadeDeFormularios = formularios.childElementCount - 1; // div interativa

    const novoFormulario = document.createElement("FORM");
    const formularioAtual = quantidadeDeFormularios + 1;
    novoFormulario.setAttribute("id", `form-${formularioAtual}`);
    novoFormulario.className = "m-3 d-flex flex-column align-items-center p-2";

    const titulo = document.createElement("H3");
    titulo.innerHTML = `Pizza ${formularioAtual}`;
    novoFormulario.appendChild(titulo);

    const formularioComInputs = criaInputs(novoFormulario);

    const remover = document.createElement("BUTTON");
    remover.setAttribute("type", "button");
    remover.setAttribute("onclick", "removePizza(event)");
    remover.className = "remove rounded-circle";
    remover.innerHTML = "<strong>x</strong>";
    formularioComInputs.appendChild(remover);

    const posicao = quantidadeDeFormularios + 2;
    formularios.insertBefore(formularioComInputs, formularios.childNodes[posicao]);
});

function criaInputs(form) {
    const categoria = document.createElement("H4");
    categoria.innerHTML = "Categoria";
    form.appendChild(categoria);

    const categoriaInput = document.createElement("input");
    categoriaInput.className = "form-control";
    categoriaInput.setAttribute("list", "categorias");
    categoriaInput.setAttribute("name", "categoria");
    form.appendChild(categoriaInput);

    const datalist = document.createElement("datalist");
    datalist.setAttribute("id", "categorias");

    const opcoes = [
        ["B", "Broto"],
        ["P", "Pequena"],
        ["M", "Média"],
        ["G", "Grande"],
        ["F", "Família"],
    ];

    opcoes.forEach((opcao) => {
        const option = document.createElement("option");
        option.setAttribute("value", opcao[0]);
        option.innerHTML = opcao[1];
        datalist.appendChild(option);
    });

    form.appendChild(datalist);

    const tamanho = document.createElement("H4");
    tamanho.innerHTML = "Tamanho";
    form.appendChild(tamanho);

    const tamanhoInput = document.createElement("input");
    tamanhoInput.className = "form-control";
    tamanhoInput.setAttribute("type", "number");
    tamanhoInput.setAttribute("name", "tamanho");
    form.appendChild(tamanhoInput);

    const valor = document.createElement("H4");
    valor.innerHTML = "Preço";
    form.appendChild(valor);

    const valorInput = document.createElement("input");
    valorInput.className = "form-control";
    valorInput.setAttribute("type", "number");
    valorInput.setAttribute("name", "preco");
    valorInput.setAttribute("step", "0.01");
    form.appendChild(valorInput);

    return form;
}

const botaoPrecificar = document.querySelector("#precificator");

botaoPrecificar.addEventListener("click", function (event) {
    event.preventDefault();

    const tabela = document.getElementById("pizzaDetail");
    tabela.style.display = "block";

    const quantidadeDeFormularios = document.querySelector("#forms").childElementCount - 1; // div interativa

    const pizzas = [];

    for (let i = 1; i <= quantidadeDeFormularios; i++) {
        const form = document.querySelector(`#form-${i}`);
        const pizza = {
            categoria: form.categoria.value,
            tamanho: form.tamanho.value,
            valor: form.preco.value,
        };

        pizzas.push(pizza);
    }

    const pizzasPrecificadas = precificacao(pizzas);

    organizaTabela(pizzasPrecificadas);
});

function precificacao(pizzas) {
    let pizzasPrecificadas = [];

    let numero = 1;

    pizzas.forEach((pizza) => {
        const raio = pizza.tamanho / 2;
        const area = 3.14 * raio ** 2;
        const relacao = pizza.valor / area;
        let precificacao = `≅ R$ ${relacao.toFixed(2)}`;

        if (isNaN(relacao)) {
            precificacao = " - ";
        }

        pizzasPrecificadas.push({ numero, ...pizza, relacao, precificacao });

        numero++;
    });

    if (pizzasPrecificadas.length === 1) {
        return [{ ...pizzasPrecificadas[0], diferenca: " - " }];
    }

    pizzasPrecificadas.sort((a, b) => {
        return a.relacao - b.relacao;
    });

    const pizzasDiferenciadas = [];

    for (let i = 0; i < pizzasPrecificadas.length; i++) {
        if (i === 0) {
            pizzasDiferenciadas.push({ ...pizzasPrecificadas[i], diferenca: "Melhor custo-benefício" });
        } else {
            const variacaoPercentual = (pizzasPrecificadas[i].relacao * 100) / pizzasPrecificadas[i - 1].relacao - 100;

            let diferenca = `+ ${variacaoPercentual.toFixed(0)}%`;

            if (isNaN(variacaoPercentual)) {
                diferenca = " - ";
            }

            pizzasDiferenciadas.push({
                ...pizzasPrecificadas[i],
                diferenca,
            });
        }
    }

    return pizzasDiferenciadas;
}

function organizaLinha(pizza) {
    const row = document.createElement("DIV");
    row.className = "d-flex py-2 px-1 row justify";

    const values = Object.values(pizza);

    values.splice(4, 1); // exclusão da relação preço/cm²

    if (values[5].includes("Melhor")) {
        row.className = "d-flex py-2 px-1 row justify rounded golden";
    }

    values.forEach((value) => {
        const celula = document.createElement("DIV");
        celula.className = "m-1 text-center align-baseline col rounded";
        celula.innerHTML = value;
        row.appendChild(celula);
    });

    return row;
}

function organizaTabela(pizzas) {
    const tabela = document.getElementById("pizzaDetail");

    pizzas.forEach((pizza) => {
        const linha = organizaLinha(pizza);

        tabela.appendChild(linha);
    });

    const botaoFechar = document.createElement("BUTTON");
    botaoFechar.setAttribute("type", "button");
    botaoFechar.setAttribute("onclick", "fecharTabela(event)");
    botaoFechar.setAttribute("id", "botaoFechar");
    botaoFechar.className = "add rounded-circle";
    botaoFechar.innerHTML = "<strong>x</strong>";

    const div = document.createElement("DIV");
    div.setAttribute("id", "divFechar");
    div.className = "d-flex justify-content-center";
    div.appendChild(botaoFechar);
    tabela.appendChild(div);
}

function fecharTabela(event) {
    event.preventDefault();

    const tabela = document.getElementById("pizzaDetail");
    tabela.style.display = "none";
}

function removePizza(event) {
    event.preventDefault();

    const formularios = document.getElementById("forms");
    const ultimoFormulario = formularios.childElementCount - 1;

    const formularioRemovido = document.getElementById(`form-${ultimoFormulario}`);
    if (formularioRemovido.parentNode) {
        formularioRemovido.parentNode.removeChild(formularioRemovido);
    }
}
