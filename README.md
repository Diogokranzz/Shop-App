# EcoWave | E-commerce Pixel Art

Este projeto é um sistema de e-commerce completo, desenvolvido com foco em uma estética pixel art monocromática inspirada no Macintosh clássico. O objetivo foi unir nostalgia visual com tecnologia moderna, criando uma experiência única para o usuário.

## Funcionamento do Projeto

O frontend foi construído em React com TypeScript, utilizando animações retrô, interface altamente interativa e recursos avançados de UX, como atalhos de teclado, modo alto contraste, easter eggs, favoritos, comparador de produtos e sistema de sons. O backend utiliza funções serverless da Vercel, autenticação via Supabase e armazenamento em KV Redis, garantindo escalabilidade e segurança.

O fluxo do usuário começa pela navegação dos produtos, que possuem imagens reais e coloridas, e segue para o carrinho de compras. No checkout, o usuário pode escolher entre Pix, cartão de crédito ou boleto bancário. O sistema de pagamento foi mockado para funcionar tanto localmente quanto em produção, simulando todo o processo de compra, inclusive a geração de QR Code Pix e um boleto bancário visualmente fiel e interativo.

O boleto bancário é gerado diretamente no frontend, preenchido com os dados reais do cliente e do pedido, incluindo nome, endereço, produto, valor, vencimento, linha digitável e código de barras. A identidade visual do projeto é mantida em todos os detalhes, inclusive no ícone pixelado exibido no boleto.

## Principais Dificuldades

Uma das maiores dificuldades foi adaptar o fluxo de pagamento para funcionar em diferentes ambientes. Como o Vite não possui rotas API nativas, foi necessário gerar Pix e boleto diretamente no frontend, sem dependência de backend. Isso exigiu criatividade para simular o funcionamento real e garantir que o usuário tivesse uma experiência completa.

Outro desafio foi criar um boleto bancário interativo e visualmente fiel, preenchendo todos os campos com dados reais e gerando o código de barras de forma funcional. A personalização da identidade visual, incluindo o ícone pixelado, exigiu atenção aos detalhes para manter a estética retrô.

A validação dos dados do cliente, o tratamento de erros e a experiência do usuário durante o checkout foram pontos críticos, pois era necessário garantir que o fluxo fosse intuitivo, seguro e sem bloqueios, mesmo em situações de erro ou ambiente restrito.

Manter a cobertura total de tipos TypeScript e integrar as APIs do Supabase e Vercel KV também demandou cuidado para evitar problemas de tipagem e garantir a robustez do sistema.

## Relato do Processo

O desenvolvimento deste projeto foi uma jornada de aprendizado e superação de desafios técnicos. Desde o início, o objetivo foi criar uma experiência envolvente, misturando nostalgia visual com recursos modernos. Cada etapa, desde a arquitetura do backend até os detalhes da interface, foi pensada para proporcionar uma navegação fluida e diferenciada.

A adaptação do fluxo de pagamento para funcionar em diferentes ambientes foi um dos pontos altos do processo, exigindo domínio das ferramentas e criatividade para simular integrações reais. A construção do boleto bancário interativo trouxe um senso de realização ao ver o sistema funcionando de ponta a ponta.

Ao longo do projeto, a busca pela excelência visual e funcional guiou todas as decisões técnicas, sempre priorizando a experiência do usuário e a escalabilidade da solução. O resultado é um e-commerce robusto, seguro e com personalidade própria, pronto para ser utilizado e expandido conforme as necessidades do negócio.

## Processo de Desenvolvimento e Tecnologias Utilizadas

O desenvolvimento do EcoWave foi realizado de forma iterativa, sempre buscando unir criatividade, eficiência e fidelidade à proposta visual. Desde o início, optei por utilizar React com TypeScript para o frontend, pois essa combinação oferece flexibilidade, segurança de tipos e uma ótima experiência de desenvolvimento. O uso do Vite como bundler permitiu um ambiente de desenvolvimento rápido e moderno, facilitando testes e ajustes visuais em tempo real.

Para as animações e efeitos retrô, utilizei a biblioteca Framer Motion, que trouxe fluidez e personalidade à interface. O TailwindCSS foi fundamental para garantir agilidade na estilização e manter o padrão monocromático pixel art em todos os componentes. A construção dos elementos visuais, como o boleto interativo e o ícone pixelado, foi feita com atenção aos detalhes, utilizando SVG e CSS para garantir a estética desejada.

No backend, a escolha pelas funções serverless da Vercel foi motivada pela necessidade de escalabilidade e facilidade de deploy. A autenticação dos usuários foi implementada com Supabase, que oferece integração simples e segura via JWT. Para armazenamento de dados temporários e cache, utilizei o Vercel KV (Redis), garantindo performance e confiabilidade.

Durante o desenvolvimento, enfrentei desafios como a ausência de rotas API nativas no Vite, o que exigiu a adaptação do fluxo de pagamento para funcionar inteiramente no frontend. A integração das APIs, a validação dos dados e o tratamento de erros foram feitos com TypeScript, aproveitando ao máximo os recursos de tipagem para evitar bugs e garantir robustez.

O processo foi marcado por muita pesquisa, testes e ajustes. Cada funcionalidade foi pensada para proporcionar uma experiência intuitiva e envolvente, desde a navegação dos produtos até a finalização do pedido. O resultado é fruto de dedicação, aprendizado contínuo e paixão por tecnologia e design.
