# JS com TDD na prática - Willian Justens

Esse repositório foi criado para seguir o curso do Willian na Udemy. Esse readme serve para documentar meus aprendizados e para pontuar algumas mudanças necessárias pra tudo continuar funcionando conforme o curso prega

## Diferenças e Atualizações em relação à 2019

### **Husky**

Comandos do husky no NPM scripts vão ser depreciados em breve. Continua funcionando normalmente, mas o script gera um warning com algumas recomendações. No caso do curso foi só adicionar o seguinte bloco na raiz do `package.json`

```
"husky": {
  "hooks": {
    "pre-commit": "npm run lint"
  }
}
```

### **Webpack**

Eu clonei o [código do curso de es6](https://github.com/willianjusten/es6-curso) pra raiz do projeto original para fins de organização. Como eu já tinha o eslint configurado, ele ficou bravo quando chegamos na aula de [webpack](./es6-curso/15-js-modules/README.md)

<img src="https://media.giphy.com/media/13EjnL7RwHmA2Q/giphy.gif" width="130" height="130" />

Por conta do arquivo `build.js`, o eslint acusou todo tipo de erro. Após uma pesquisa rápida, descobri que [basta criar um arquivo `.eslintignore`](https://eslint.org/docs/user-guide/configuring.html#ignoring-files-and-directories) na raiz do projeto e adicionar os arquivos apropriados - igualzinho ao bom e velho `.gitignore`

A versão do webpack que foi instalada usando o comando `npm i --save-dev webpack` foi a `4.29.0`. Ao usar o comando `node_modules/.bin/webpack`, o pacote `webpack-cli` teve que ser instalado. Ou seja, o comando apropriado passou a ser `npm i --save-dev webpack webpack-cli`

A instalação do NPM pegou uma vulnerabilidade alta e uma crítica, então eu usei o audit. Ao rodar `npm audit fix`, ele acusou um warning de semver por conta do `webpack-dev-server` e parou por ai. A cli sugeriu o comando `npm i -D webpack-dev-server@3.1.14`, alertando sobre os temidos **POTENTIALLY BREAKING CHANGES**

<img src="https://media.giphy.com/media/NIVdosAtzETMQ/giphy.gif" width="130" height="130" />

Instalei, apaguei os arquivos de build e rodei o webpack. Tudo sem problemas 🎊

### **Webpack 4**

O Webpack na versão 4 não necessita de configuração para as opções mais básicas:

-   Entrypoint (arquivo de entrada) ~> Procura por um arquivo `src/index.js`
-   Output (arquivo de saída) ~> Cria um arquivo `dist/main.js`
-   Ambiente (dev, production etc.) ~> Basta passar uma opção `--mode development` ou `--mode production` ao chamar o webpack

Para usar o webpack-dev-server, só adicionar a opção `--mode` 😄

### Tipos de Teste

#### Pirâmide de Testes x Troféu de Testes

Complementando a teoria passada pelo Willian, outra interpretação que está sendo popularizada é a do [Troféu de Testes, popularizada pelo Kent Dodds](https://testingjavascript.com/). Relembrando a pirâmide tradicional:

<img src="https://cdn-images-1.medium.com/max/1200/0*UMzL89XZJ63vRCcc.png" width="400" />

Testes unitários são mais rápidos e menos custosos. Testes de UI (E2E) são mais lentos e mais custosos. Outra métrica que não está presente no desenho mas que é de grande interesse é a _confiabilidade_. A medida que subimos na pirâmide, os testes nos garantem mais confiabilidade. Essa visão é traduzida no Trófeu de Testes:

<img src="https://testingjavascript.com/static/trophyWithLabels@2x-3c2b593913ddfea970b801e67648092d.png" width="400"/>

Um único teste E2E pode cobrir boa parte dos casos que todo um conjunto de testes unitários cobre. No entanto, todo o conjunto de testes unitários pode ser mais caro de manter em comparação com um único teste E2E.

Se o teste E2E nos der a _confiabilidade_ que precisamos, pode ser mais interessante focar os esforços nessa camada. Sob essa ótica, a relação de custo-benefício se torna mais complexa e demanda uma análise caso a caso. Cada projeto é único!

#### Static - A base da pirâmide

O Kent Dodds adiciona a análise estática do código ao trófeu de testes com o argumento de que essa análise estática nos auxilia a lidar com erros **em tempo real**. Erros de escrita ou erros de tipo podem ser identificados pela IDE em tempo de desenvolvimento, evitando a necessidade de cobrir esses casos nos outros tipos de teste. Basta usarmos um linter (ESLint) e um sistema de tipos (Typescript ou Flow). Muita velocidade e pouco custo 🚀 (linters são menos custosos, enquanto que a adoção de um sistema de tipos pode ser mais difícil)

#### Testes de UI (E2E)

O Willian comenta que as ferramentas mais populares para esse tipo de teste são o Selenium e o PhantomJS. Ambos são vistos como ferramentas lentas e de gerenciamento difícil. Recentemente, o CypressJS surgiu para auxiliar no desenvolvimento de testes E2E,aparentemente resolvendo os problemas mais comuns das ferramentas de testes E2E consolidadas no mercado. Vou tentar introduzir o Cypress ao final do curso 😄

## Testes unitários

A brincadeira começou com a criação de testes unitários para uma calculadora fictícia, usando o Mocha como test runner e o Chai para assertivas.

Como eu já tinha visto algumas coisas sobre eles, aproveitei para brincar um pouco e consolidar o conhecimento. Parametrizei os testes, [inspirado pela documentação do Mocha](https://mochajs.org/#dynamically-generating-tests), para evitar a repetição de blocos describe/it similares. [Achei interessante](https://github.com/eaverdeja/js-com-tdd-na-pratica/commit/4e6418ef066ed612943c2fee4e0548da16a9862d), mas senti que feriu a legibilidade dos testes ([o destructuring ajudou!](https://github.com/eaverdeja/js-com-tdd-na-pratica/commit/f13323c27832f32aebd96a88e33b4d59623b6540))

## Sinon - Stubs!

Utilizando o Sinon com os pacotes nas versões abaixo, o método `stub.returnsPromise()` acusou que `returnsPromise()` vindo do `sinon-stub-promise` não é uma função. Usei o método `resolves()` do próprio Sinon e deu tudo certo 👍

```json
"sinon": "^7.2.6",
"sinon-chai": "^3.3.0",
"sinon-stub-promise": "^4.0.0"
```

Ou seja, a biblioteca `sinon-stub-promise` [não é mais necessária](https://github.com/substantial/sinon-stub-promise/issues/30). Tive que criar um pequeno mock para simular o retorno da Promise. O uso do `resolves()` ficou assim:

```js
// index.spec.js

const mockPromise = returns => ({
  // Mockamos o método json(), usado no index.js
  json: res => returns || res,
})

beforeEach(() => {
  // Indicamos para o Sinon como a promise deve ser resolvida.
  // Dessa forma, os demais testes podem usar o método `search()`
  // certos de que o fetch mockado irá retornar
  // um objeto com um método `json()`
  fetchStub = sinon.stub(global, 'fetch')
    .resolves(mockPromise())
})

...

it('Deve retornar os dados em JSON', async () => {
  fetchStub.resolves(mockPromise({ body: 'json' }))
  const artist = await search('King Crimson', 'artist')
  expect(artist).to.eql({ body: 'json' })
})
```

### Tratamento de erros assíncronos

Como exercício, quis atingir 100% de cobertura nos testes, e o nyc estava me avisando de que o bloco `catch` do método `search()` não estava sendo testado. Depois de fuçar um pouco pelo Google consegui montar uma solução que achei legal. Optei pelo uso do `async/await` por três motivos:

- Praticidade: funcionou!
- Legibilidade: Não precisamos de `new Promise((...) => {...})`)
- Não precisei instalar dependências ou plugins adicionais 

A solução final ficou assim:

```js
// index.spec.js
...

// Devemos utilizar uma função assíncrona com a palavra chave `async`
it('Deve delegar possíveis exceções no método search()', async () => {
  // Indicamos para o Sinon que a promise deve ser rejeitada
  fetchStub.rejects({ error: 'Mock! 😈' })
  // Usamos o await para aguardar a resolução da promise
  const result = await search('Kenny G', 'artist')
  // Realizamos a assertiva
  expect(result).to.equal('Algo de errado ocorreu! 💥')
})

// index.js
...

export const search = async (query, type) => {
  ...

  try {
    const res = await fetch(url)
    return await res.json()
  } catch (error) {
    console.log(error)
    return 'Algo de errado ocorreu! 💥'
  }
}
```

## API do Spotify

O Spotify passou a exigir um token de autorização no cabeçalho das requisições à API. A resposta para requisições sem um header `Authorization: Bearer ...` passou a ser: 

```json
{ error: { status: 401, message: 'No token provided' } }
```

Portanto, precisei seguir o passo a passo do Spotify, autenticando com minha conta pessoal e obtendo um token, para na sequência alterar o código do método `search()`. Para guardar o token em uma variável de ambiente, usei o `dotenv`:

```js
const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${process.env.SPOTIFY_API_KEY}`,
  },
})
```

