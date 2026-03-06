import { stableStubScore, djb2Hash } from "../lib/domain";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getInteractiveModel(model: string) {
  if (model === "qwen2.5:14b") return "gpt-oss:120b-cloud";
  return model;
}

function extractJsonArray(text: string) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  const source = start === -1 ? text : text.slice(start, end >= start ? end + 1 : undefined);

  try {
    const parsed = JSON.parse(source);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const objects = source.match(/\{[\s\S]*?\}/g) ?? [];
    const recovered: Array<Record<string, unknown>> = [];
    for (const candidate of objects) {
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          recovered.push(parsed as Record<string, unknown>);
        }
      } catch {
        // Ignore partial fragments and keep the valid objects we can recover.
      }
    }
    return recovered;
  }
}

export function buildErrorAnalysisPrompt(context: string) {
  return [
    "[IA_ANALYSIS - nivel ITA]",
    `Contexto: ${context}`,
    "Descreva em Markdown com as secoes:",
    "1) DIAGNOSTICO: explique a lacuna e por que e perigosa no ITA.",
    "2) CONCEITO_CORRETO: explicacao tecnica aprofundada.",
    "3) PLANO_DE_CORRECAO: 3 acoes com referencias exatas (bookId, capitulos/exercicios).",
    "4) ALERTA: se for problema de base indique livro e capitulo.",
    "Formato: Markdown com titulos e bullet lists.",
  ].join("\n");
}

export function buildCardsPrompt(textChunk: string) {
  return [
    "[IA_CARDS — gerar flashcards nivel ITA]",
    `Receba: ${textChunk}; gere um JSON array de ate N=8 cards com campos:`, 
    "[{ \"type\": \"conceito|formula|mecanismo|erro_recorrente\", \"front\": \"pergunta curta\",",
    "   \"back\": \"resposta detalhada com condicoes de aplicabilidade e exemplo\",",
    "   \"references\":[{\"bookId,pageRange\"}], \"difficulty\":\"easy|medium|hard\" }]",
    "Output: JSON only.",
  ].join("\n");
}

export function buildFeynmanPrompt(topic: string, explanation: string) {
  return [
    "[IA_FEYNMAN - avaliar explicacao]",
    `Receba: explicacao do aluno sobre ${topic}.`,
    explanation,
    "Retorne em Markdown:",
    "1) ACERTOS",
    "2) ERROS_CONCEITUAIS (corrija)",
    "3) LACUNAS",
    "4) EXPLICACAO_CORRETA completa",
    "5) NOTA: 0-10 com justificativa tecnica.",
  ].join("\n");
}

async function callOllama(
  settings: { ollamaUrl: string; ollamaModel: string },
  prompt: string,
  maxTokens: number,
  temperature: number,
  model?: string,
) {
  const baseUrl = settings.ollamaUrl.replace(/\/$/, "");

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch(`${baseUrl}/v1/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: model ?? settings.ollamaModel,
          prompt,
          max_tokens: maxTokens,
          temperature,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`ERR_IA_HTTP_${response.status}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{ text?: string }>;
        response?: string;
      };

      return data.choices?.[0]?.text ?? data.response ?? "";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("ERR_IA_TIMEOUT");
      }
      if (attempt === 3) {
        throw new Error("ERR_IA_OFFLINE");
      }
      await sleep(2_000 * Math.pow(2, attempt - 1));
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("ERR_IA_OFFLINE");
}

export function fallbackErrorAnalysis(input: { descriptionGap: string; severity: string }) {
  return [
    "## [ERR_IA_OFFLINE] Analise indisponivel",
    `- Lacuna: \"${input.descriptionGap}\"`,
    `- Severidade: ${input.severity}`,
    "- Revisar manualmente.",
  ].join("\n");
}

function normalizeCard(card: Record<string, unknown>, fallbackLabel: string) {
  const allowedTypes = new Set(["conceito", "formula", "mecanismo", "erro_recorrente"]);
  const type = typeof card.type === "string" && allowedTypes.has(card.type) ? card.type : "conceito";

  return {
    type,
    front: typeof card.front === "string" && card.front.trim() ? card.front.trim() : `O que revisar em ${fallbackLabel}?`,
    back: typeof card.back === "string" && card.back.trim() ? card.back.trim() : `Reforce o conceito central de ${fallbackLabel}.`,
  };
}

export function stubCards(input: { descriptionGap: string; context: string }) {
  return [
    {
      type: "conceito",
      front: `Qual e a ideia central por tras de ${input.descriptionGap}?`,
      back: `Resumo rapido: ${input.context.slice(0, 180)}. Identifique a definicao correta, as condicoes de uso e um exemplo curto.`,
    },
    {
      type: "erro_recorrente",
      front: `Qual erro devo evitar em ${input.descriptionGap}?`,
      back: `Erro comum: repetir o padrao descrito em \"${input.context.slice(0, 120)}\". Antes de resolver, valide unidade, definicao e restricoes.`,
    },
  ];
}

export async function analyzeErrorWithMode(
  error: { descriptionGap: string; context: string; severity: string },
  settings: { aiMode: string; ollamaUrl: string; ollamaModel: string },
) {
  if (settings.aiMode !== "real") {
    return { iaAnalysis: fallbackErrorAnalysis(error), mode: "stub" as const };
  }

  try {
    const markdown = await callOllama(settings, buildErrorAnalysisPrompt(error.context), 700, 0.1, getInteractiveModel(settings.ollamaModel));
    return { iaAnalysis: markdown || fallbackErrorAnalysis(error), mode: "real" as const };
  } catch {
    return { iaAnalysis: fallbackErrorAnalysis(error), mode: "stub" as const };
  }
}

export async function generateCardsWithMode(
  input: { descriptionGap: string; context: string },
  settings: { aiMode: string; ollamaUrl: string; ollamaModel: string },
) {
  if (settings.aiMode !== "real") {
    return { cards: stubCards(input), mode: "stub" as const };
  }

  try {
    const raw = await callOllama(settings, buildCardsPrompt(`${input.descriptionGap} ${input.context}`), 180, 0.1, "qwen2.5:7b");
    const parsed = extractJsonArray(raw).map((card) => normalizeCard(card, input.descriptionGap));
    return {
      cards: parsed.length ? parsed : stubCards(input),
      mode: parsed.length ? ("real" as const) : ("stub" as const),
    };
  } catch {
    return { cards: stubCards(input), mode: "stub" as const };
  }
}

export function extractFeynmanScore(markdown: string) {
  const match = markdown.match(/NOTA:\s*([0-9]+(?:[.,][0-9]+)?)\s*\/?\s*10/i);
  if (!match) return 5;
  return Number.parseFloat(match[1].replace(",", "."));
}

export function stubFeynmanFeedback(topicName: string, explanation: string, attemptNumber: number) {
  const score = stableStubScore(`${topicName}:${attemptNumber}:${djb2Hash(explanation)}`);
  const feedback = [
    "## ACERTOS",
    `- Estrutura coerente sobre ${topicName}.`,
    "- Houve tentativa de conectar conceito e aplicacao.",
    "",
    "## ERROS_CONCEITUAIS",
    "- Revise as hipoteses do problema antes de aplicar a formula.",
    "",
    "## LACUNAS",
    "- Faltou citar condicoes de validade e um exemplo numerico curto.",
    "",
    "## EXPLICACAO_CORRETA",
    `- Reescreva ${topicName} em linguagem simples, depois detalhe a definicao formal, as condicoes de uso e um contraexemplo.`,
    "",
    `## NOTA: ${score}/10`,
    score >= 8 ? "Boa solidez. Pode avancar um nivel." : "Ainda ha lacunas importantes para o ITA.",
  ].join("\n");

  return {
    iaScore: score,
    approved: score >= 8,
    iaFeedback: feedback,
  };
}

export async function evaluateFeynmanWithMode(
  input: {
    topicName: string;
    explanation: string;
    previousAttempts: Array<{ iaScore: number | null }>;
  },
  settings: { aiMode: string; ollamaUrl: string; ollamaModel: string },
) {
  const attemptNumber = input.previousAttempts.length + 1;

  if (settings.aiMode !== "real") {
    return { ...stubFeynmanFeedback(input.topicName, input.explanation, attemptNumber), mode: "stub" as const };
  }

  try {
    const history = input.previousAttempts
      .map((attempt, index) => `Tentativa ${index + 1}: nota ${attempt.iaScore ?? "n/d"}`)
      .join("; ");
    const prompt = [history, buildFeynmanPrompt(input.topicName, input.explanation)].filter(Boolean).join("\n\n");
    const markdown = await callOllama(settings, prompt, 450, 0.1, getInteractiveModel(settings.ollamaModel));
    const iaScore = extractFeynmanScore(markdown);
    return {
      iaScore,
      approved: iaScore >= 8,
      iaFeedback: markdown,
      mode: "real" as const,
    };
  } catch {
    return { ...stubFeynmanFeedback(input.topicName, input.explanation, attemptNumber), mode: "stub" as const };
  }
}

export async function runAiSelfTest(settings: { aiMode: string; ollamaUrl: string; ollamaModel: string }) {
  if (settings.aiMode !== "real") {
    return {
      ok: false,
      mode: "stub" as const,
      provider: "stub" as const,
      detail: "IA em modo stub. Salve em real para validar o Ollama.",
      sample: null,
      responseMs: null,
    };
  }

  const startedAt = Date.now();

  try {
    const raw = await callOllama(
      settings,
      buildErrorAnalysisPrompt("Teste operacional: explique por que uma lei fisica precisa de condicoes de validade."),
      220,
      0.1,
      getInteractiveModel(settings.ollamaModel),
    );
    const sample = raw.replace(/\s+/g, " ").trim().slice(0, 120) || "(vazio)";
    const ok = sample !== "(vazio)" && sample.length >= 40;

    return {
      ok,
      mode: "real" as const,
      provider: "ollama" as const,
      detail: ok
        ? `Modelo ${settings.ollamaModel} respondeu ao teste de inferencia.`
        : `Ollama nao devolveu texto util no teste: ${sample}`,
      sample,
      responseMs: Date.now() - startedAt,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "ERR_IA_OFFLINE";

    return {
      ok: false,
      mode: "real" as const,
      provider: "ollama" as const,
      detail: `Falha no teste de inferencia: ${reason}`,
      sample: null,
      responseMs: Date.now() - startedAt,
    };
  }
}

export function buildChapterSummaryPrompt(chapterText: string) {
  return [
    "[IA_SUMMARY — resumo de capitulo]",
    `Texto: ${chapterText}`,
    "Gere um resumo estruturado em Markdown com:",
    "1) CONCEITOS_PRINCIPAIS: bullet list dos 5-10 conceitos mais importantes",
    "2) FORMULAS: lista com cada formula, variaveis e unidades",
    "3) ARMADILHAS_ITA: erros comuns que o ITA explora neste tema",
    "4) EXERCICIOS_MODELO: 2 exercicios representativos com solucao",
    "Output: Markdown.",
  ].join("\n");
}

export function buildExtractTocPrompt(tocText: string) {
  return [
    "[IA_TOC — extrair indice]",
    `Texto do indice do livro: ${tocText}`,
    "Extraia a estrutura em JSON:",
    "{ \"chapters\": [{ \"number\": 1, \"title\": \"...\",",
    "  \"sections\": [{ \"number\": \"1.1\", \"title\": \"...\" }] }] }",
    "Output: JSON only.",
  ].join("\n");
}
