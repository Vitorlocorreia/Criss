# CRIS — protótipo v1

LP completa: abertura, O que nos guia, Como funciona (cinco etapas), No seu bolso (três celulares com telas de carteira, nota e empresas), Para empresas, Pré-lançamento, Perguntas frequentes, versículo e rodapé. A produção em appcris.com.br não foi alterada. Navegação principal e rodapé usam âncoras internas; páginas legais continuam na origem oficial.

Abertura v3: CRIS e Compra com propósito em contorno SVG, cruz e reflexo dourado percorrendo os traços, com saída em máscara vertical. Duração aproximada de 4 segundos, incluindo uma espera limitada pela fonte. Pular abertura e Escape liberam a página. Preferência por movimento reduzido e links diretos a seções pulam a sequência. Proteção de 5,5 segundos libera o conteúdo se algum recurso falhar; a página permanece acessível sem JavaScript. A entrada do título principal é sincronizada com a revelação. Conferidos a sequência automática, o botão de pular e o enquadramento móvel.

Hero v4: composição fotográfica imersiva, nova fotografia gerada (hero-image-v4-prompt.md), título claro sobre verde profundo, cabeçalho sobreposto e arco 3D parcial na lateral. No celular, a cena ocupa a parte superior e o texto fica na parte inferior, sem a antiga imagem circular depois do texto. Revisado em 390 × 844 e 375 × 667: imagem, título e CTA disponíveis na primeira tela, sem excesso de largura. As demais seções e a introdução permanecem integradas.

Como funciona v5: cinco etapas interativas em uma maquete de comércio (CSS e SVG), com sacola, loja, comprovante e projeto social. O trajeto se desenha conforme a etapa; os objetos respondem com mudanças de posição e destaque. Um controle de valor altera comprovante e contribuição ilustrativa de 5%; não representa percentual universal da plataforma e não executa uma compra ou doação. Abas, botão de próxima etapa, reinício e navegação por setas/Home/End. Conferidos o cálculo R$ 300 → R$ 15, a mudança de etapas, teclado e layout móvel sem excesso de largura. Não há avanço automático ou rolagem presa.

Como funciona v6 substitui a interação da v5 por uma narrativa de rolagem: escolha, compra e impacto. Nenhuma aba, botão de avançar, campo, percentual ou cálculo. Os três textos estão no HTML e a maquete acompanha a rolagem nativa, com posição sticky e progressão visual por eventos de scroll; não há captura da rolagem nem avanço por tempo. Movimento reduzido desativa o sticky e apresenta a cena completa. Validados estados inicial e final, retorno ao rolar para cima, ausência de controles e excesso de largura no celular. A versão v5 permanece no histórico Git e nas versões anteriores do Site.

Como funciona v7: no celular, cada bloco de texto dissolve nos 65 pixels anteriores à maquete fixa. A coluna recebe recorte na borda inferior da cena, impedindo letras de reaparecerem acima dela. A rolagem reversa restaura a opacidade; desktop e movimento reduzido preservam texto integral. Conferidos desaparecimento completo, opacidade intermediária, retorno ao primeiro estado e ausência de erros no navegador.

HTML/CSS sem etapa de build. Servir dist/ por HTTP. Three.js 0.185.1, GSAP e ScrollTrigger 3.13.0 armazenados localmente. Fontes Fraunces e Inter via Google Fonts. Logo oficial recuperado da página pública. Fotografia ilustrativa gerada, prompt em image-prompt.md.

A fita é uma geometria procedural fechada com seção retangular, material físico, iluminação e ambiente renderizados em WebGL. Há resposta discreta ao ponteiro, movimento contínuo, pausa manual, pausa fora da área visível e respeito a prefers-reduced-motion. Fallback em CSS quando o 3D não está disponível. O botão de grupo usa o endereço presente no código público da LP original; nenhum ingresso ou envio foi realizado.

Celulares modelados com CSS, volume de moldura, bordas, perspectiva e interfaces em HTML. No desktop, aparecem juntos; no celular, abas alternam a demonstração. As abas aceitam setas, Home e End. A simulação de nota usa apenas dados ilustrativos, sem envio de documentos. O formulário de empresas valida campos e prepara uma conversa no WhatsApp oficial; não há gravação de leads nem backend novo. O visitante confirma o envio no WhatsApp. FAQ preserva perguntas e respostas da LP original.

Validação: sintaxe JavaScript; imagens carregadas; renderização WebGL; layout desktop e celular sem excesso de largura; navegação por âncoras; pausa; alternância de celulares por clique e teclado; simulação de nota; expansão do FAQ e inspeção dos destinos. Não é teste em todos os dispositivos nem medição de desempenho em aparelho físico. Mensagens reais não foram enviadas durante a revisão.

## Executar e publicar

Esta é a versão atual da landing page CRIS, com a introdução, hero, propósito, como funciona, demonstrações do app, empresas, pré-lançamento e FAQ.

O site é estático e não exige instalação ou build. Sirva a pasta `dist/` com um servidor HTTP (por exemplo, `python -m http.server 4173 --directory dist`) e acesse `http://localhost:4173`. Para hospedagem estática, use `dist/` como diretório publicado.

O último ajuste mantém o texto de “Como funciona” totalmente visível até a borda da maquete no celular, com uma dissolução curta e fundo opaco. Os arquivos dessa interação têm versão na URL para atualizar o cache do navegador.
