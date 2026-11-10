:root {
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #f5f8ff;
  background: #060910;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* { box-sizing: border-box; }
html, body, #root {
  margin: 0;
  height: 100%;
  min-height: 100%;
  background: #060910;
}

body {
  overflow: hidden;
}

button, a {
  font: inherit;
}

.app-shell {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #081019 0%, #0a1622 50%, #060910 100%);
}

.scene-wrap {
  position: absolute;
  inset: 0;
}

.hud {
  position: absolute;
  top: 18px;
  left: 22px;
  z-index: 12;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.hud-pill {
  padding: 7px 12px;
  font-size: 11px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 999px;
  background: rgba(7, 12, 18, 0.52);
  backdrop-filter: blur(10px);
}

.hud-pill.alt {
  color: #96ebff;
}

.start-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(7, 10, 15, 0.78), rgba(8, 14, 20, 0.82));
  transition: opacity 0.35s ease;
}

.welcome-panel {
  width: min(560px, calc(100% - 32px));
  padding: 30px 28px;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 28px;
  background: rgba(11, 17, 24, 0.74);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
}

.eyebrow {
  margin: 0 0 14px;
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #95e4ff;
}

.welcome-panel h1 {
  margin: 0;
  font-size: clamp(2.3rem, 5vw, 4.5rem);
  letter-spacing: -0.08em;
  line-height: 0.97;
}

.tagline {
  margin: 14px 0 20px;
  color: #dfe9f8;
  font-size: 0.95rem;
  line-height: 1.7;
}

.primary-btn {
  appearance: none;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #8fe5ff, #cfe8ff);
  color: #07131c;
  font-weight: 800;
  letter-spacing: 0.02em;
  padding: 14px 22px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 14px 26px rgba(143, 229, 255, 0.25);
}

.primary-btn:hover {
  transform: translateY(-1px);
}

.controls-box {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
  margin-top: 20px;
  font-size: 0.84rem;
  color: #dfe9f8;
}

.small-note {
  margin-top: 18px;
  color: #c0ccd8;
  font-size: 0.82rem;
}

.info-panel {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 10;
  width: min(420px, calc(100% - 24px));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 22px;
  background: rgba(10, 16, 24, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  padding: 18px 18px 16px;
}

.panel-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.panel-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8fe5ff;
}

.panel-ghost {
  font-size: 10px;
  color: #a9bbcb;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.info-panel p,
.info-panel li,
.info-panel a {
  color: #dfe8f4;
  font-size: 0.9rem;
  line-height: 1.7;
}

.info-panel ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.info-panel li + li { margin-top: 8px; }

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag-grid span {
  display: inline-flex;
  align-items: center;
  padding: 7px 9px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  font-size: 0.72rem;
}

.stack-list {
  display: grid;
  gap: 12px;
}

.stack-item {
  padding: 12px 12px 10px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  background: rgba(255,255,255,0.02);
}

.stack-item strong {
  display: block;
  margin-bottom: 4px;
  font-size: 0.92rem;
}

.stack-item p {
  margin: 0;
  color: #b9c7d8;
}

.link-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.link-list a {
  display: inline-flex;
  padding: 7px 10px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 999px;
  text-decoration: none;
  color: #dfe8f4;
}

.mini-nav {
  position: absolute;
  left: 22px;
  bottom: 20px;
  z-index: 11;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: min(480px, calc(100% - 180px));
}

.mini-nav button {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(8, 12, 20, 0.52);
  color: #dfe8f4;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-nav button.active,
.mini-nav button:hover {
  background: rgba(143,229,255,0.13);
  border-color: rgba(143,229,255,0.45);
  color: #bfefff;
}

@media (max-width: 768px) {
  body { overflow: auto; }
  .app-shell { min-height: 100vh; height: auto; }
  .scene-wrap {
    position: fixed;
    inset: 0;
    height: 100vh;
  }

  .info-panel {
    bottom: 78px;
    right: 12px;
    left: 12px;
    width: auto;
  }

  .mini-nav {
    left: 12px;
    right: 12px;
    bottom: 12px;
    max-width: none;
  }

  .controls-box {
    grid-template-columns: 1fr;
  }
}
