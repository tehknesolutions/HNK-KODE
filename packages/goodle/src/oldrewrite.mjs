import { createGoodleIRNode, createGoodleProgram } from "./ir.mjs";
import { resolveGoodleSemantic } from "./semantic-bridge.mjs";

function n(text, line, id, family, parameters = {}) {
  return createGoodleIRNode({
    id: "goodle:line:" + line,
    semanticId: id,
    family,
    parameters,
    metadata: { line, source: "goodle-browser" }
  });
}

function num(value) {
  if (value === undefined || value.trim() === "") return undefined;
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
}

export function parseOldRewrite(source) {
  const lines = source.split(/\r?\n/)
    .map((text, index) => ({ text, line: index + 1, indented: /^\s+/.test(text) }))
    .filter(item => item.text.trim());

  const nodes = [];
  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i];
    if (current.indented) throw new Error("GOODLE_OLDREWRITE_INDENTATION:" + current.line);
    const parts = current.text.trim().replace(/:$/, "").replace(/\s+/g, " ").split(" ");
    const command = parts[0]?.toLowerCase();

    if (command === "criar" || command === "create") {
      const type = parts[1]?.toLowerCase();
      const name = parts.slice(2).join(" ");
      if (!name || !["entidade", "entity", "personagem"].includes(type)) {
        throw new Error("GOODLE_OLDREWRITE_CREATE_INVALID:" + current.line);
      }
      nodes.push(n(current.text, current.line, "ACTION.CREATE", "execucao", { tipo: type, nome: name }));
      continue;
    }

    if (command === "posicionar" || command === "position") {
      const name = parts[1], connector = parts[2]?.toLowerCase();
      const x = num(parts[3]), y = num(parts[4]);
      if (!name || !["em", "at"].includes(connector) || x === undefined || y === undefined || parts.length !== 5) {
        throw new Error("GOODLE_OLDREWRITE_POSITION_INVALID:" + current.line);
      }
      nodes.push(n(current.text, current.line, "SPACE.POSITION", "mundo", { nome: name, x, y }));
      continue;
    }

    if (command === "mover" || command === "move") {
      const name = parts[1], connector = parts[2]?.toLowerCase();
      const x = num(parts[3]), y = num(parts[4]);
      if (!name || !["por", "by"].includes(connector) || x === undefined || y === undefined || parts.length !== 5) {
        throw new Error("GOODLE_OLDREWRITE_MOVE_INVALID:" + current.line);
      }
      nodes.push(n(current.text, current.line, "SPACE.MOVE", "mundo", { nome: name, x, y }));
      continue;
    }

    if (command === "definir" || command === "set") {
      const property = parts[1], entity = parts[3], value = num(parts[5]);
      if (!property || !entity || !["de", "of"].includes(parts[2]?.toLowerCase()) ||
          !["como", "to", "as"].includes(parts[4]?.toLowerCase()) || value === undefined || parts.length !== 6) {
        throw new Error("GOODLE_OLDREWRITE_SET_INVALID:" + current.line);
      }
      nodes.push(n(current.text, current.line, "DATA.SET", "dados", { entidade: entity, propriedade: property, valor: value }));
      continue;
    }

    if (command === "diminuir" || command === "decrease") {
      const property = parts[1], entity = parts[3], value = num(parts[5]);
      if (!property || !entity || !["de", "of"].includes(parts[2]?.toLowerCase()) ||
          !["em", "by"].includes(parts[4]?.toLowerCase()) || value === undefined || parts.length !== 6) {
        throw new Error("GOODLE_OLDREWRITE_DECREASE_INVALID:" + current.line);
      }
      nodes.push(n(current.text, current.line, "DATA.DECREASE", "comportamento", { entidade: entity, propriedade: property, valor: value }));
      continue;
    }

    if (command === "quando" || command === "when") {
      const sourceEntity = parts[1], targetEntity = parts[3], event = parts[2]?.toLowerCase();
      if (!sourceEntity || !targetEntity || !["tocar", "toque", "touch", "touches"].includes(event) || parts.length !== 4) {
        throw new Error("GOODLE_OLDREWRITE_WHEN_INVALID:" + current.line);
      }

      const children = [];
      while (i + 1 < lines.length && lines[i + 1].indented) {
        i += 1;
        const child = lines[i];
        const cp = child.text.trim().replace(/\s+/g, " ").split(" ");
        const value = num(cp[5]);
        if (!["diminuir", "decrease"].includes(cp[0]?.toLowerCase()) ||
            !cp[1] || !cp[3] || !["de", "of"].includes(cp[2]?.toLowerCase()) ||
            !["em", "by"].includes(cp[4]?.toLowerCase()) || value === undefined || cp.length !== 6) {
          throw new Error("GOODLE_OLDREWRITE_EVENT_ACTION_INVALID:" + child.line);
        }
        children.push(n(child.text, child.line, "DATA.DECREASE", "comportamento", {
          entidade: cp[3], propriedade: cp[1], valor: value
        }));
      }

      const node = n(current.text, current.line, "EVENT.WHEN", "comportamento", {
        evento: resolveGoodleSemantic("tocar").semanticId,
        fonte: sourceEntity,
        alvo: targetEntity
      });
      node.filhos = children;
      nodes.push(node);
      continue;
    }

    throw new Error("GOODLE_OLDREWRITE_UNKNOWN_COMMAND:" + current.line);
  }

  return createGoodleProgram(nodes);
}
