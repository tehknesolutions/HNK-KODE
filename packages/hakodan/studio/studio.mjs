import { createStudioSession } from "../src/studio-session-v1.mjs";
import { projectStudioInspector } from "../src/studio-inspector-v1.mjs";

const seeded = `mundo AbraIsland {
  entidade Alakazam { propriedade vida = 100 }
  evento Despertar { ação despertar("Alakazam") }
}`;

const source = document.getElementById("source");
const profile = document.getElementById("profile");
const validateButton = document.getElementById("validate");
const runButton = document.getElementById("run");
const diagnostic = document.getElementById("diagnostic");
const inspector = document.getElementById("inspector");
const preview = document.getElementById("preview");
const evidence = document.getElementById("evidence");

const session = createStudioSession({ source: seeded, profile: "PT-BR" });
source.value = seeded;

function clearOutput() {
  diagnostic.textContent = "";
  inspector.replaceChildren();
  preview.removeAttribute("srcdoc");
  evidence.textContent = "IDLE";
}

function syncInput() {
  session.setSource(source.value);
  session.setProfile(profile.value);
  clearOutput();
}

function renderInspector(goldenPath) {
  inspector.replaceChildren();
  const view = projectStudioInspector(goldenPath);
  const lines = [
    `WORLD  ${view.world}`,
    ...view.entities.map(value => `ENTITY  ${value}`),
    ...view.properties.map(value => `PROPERTY  ${value.entity}.${value.name} = ${JSON.stringify(value.value)}`),
    ...view.events.map(value => `EVENT  ${value}`),
    ...view.actions.map(value => `ACTION  ${value.event}.${value.name}(${value.args.map(JSON.stringify).join(", ")})`)
  ];
  const pre = document.createElement("pre");
  pre.textContent = lines.join("\n");
  inspector.append(pre);
}

function renderFailure(state) {
  diagnostic.textContent = state.diagnostic || "HAKODAN_STUDIO_INVALID";
  inspector.replaceChildren();
  preview.removeAttribute("srcdoc");
  evidence.textContent = state.status;
}

source.addEventListener("input", syncInput);
profile.addEventListener("change", syncInput);

validateButton.addEventListener("click", () => {
  const state = session.validate();
  if (state.status !== "VALID") return renderFailure(state);
  diagnostic.textContent = "VALID";
  renderInspector(state.goldenPath);
  evidence.textContent = "VALID";
});

runButton.addEventListener("click", () => {
  try {
    const state = session.run();
    diagnostic.textContent = "";
    renderInspector(state.goldenPath);
    preview.srcdoc = state.artifact.content;
    evidence.textContent = `${state.status} · ${state.artifact.executionEvidence}`;
  } catch {
    renderFailure(session.state);
  }
});
