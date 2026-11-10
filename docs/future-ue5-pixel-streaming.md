# Future Unreal Engine 5 + Pixel Streaming Plan

**Status: documentation only.** This repository currently runs a React/Vite/Three.js browser scene. No Unreal Engine project, cloud GPU deployment, Pixel Streaming service, session broker, or production infrastructure has been implemented.

## Proposed architecture

1. **UE5 experience**: Unreal project owns the world, lighting, mansion, player controller, interaction actors, UI and authoritative per-visitor game state.
2. **World Partition**: use for a substantially larger authored landscape only after profiling; the initial portfolio scene can remain a compact level.
3. **Nanite and Lumen**: evaluate Nanite for suitable high-detail static meshes and Lumen for dynamic indirect lighting/reflections. Validate target GPU, memory, streaming behavior, and Pixel Streaming encoder budget; feature support varies by UE version and hardware.
4. **Chaos Physics**: use collision channels and simple collision primitives for walking and interaction, not expensive per-frame complex mesh collision.
5. **Enhanced Input**: map movement, look, interact, pause, and accessibility controls; provide controller/touch alternatives where appropriate.
6. **Pixel Streaming 2**: package the UE application with the version-matched Pixel Streaming infrastructure. A signaling/web server brokers browser WebRTC connections; it does not render the scene.
7. **React frontend**: keep portfolio/accessible navigation and provide a session launcher. Embed the stream only after a short-lived session is provisioned; include a no-stream content fallback.
8. **Node.js session broker**: authenticate and rate-limit launch requests, allocate an isolated UE process/container, issue a short-lived stream/session token, return connection metadata, and terminate idle sessions.
9. **WebRTC networking**: use HTTPS for the website and WSS for signaling. Configure STUN for discovery and TURN relays when direct connectivity fails. TURN requires capacity planning and abuse controls.
10. **Assets/CDN**: keep versioned, licensed source assets in controlled object storage; publish only optimized public web assets through a CDN. Do not expose credentials or private source files.

## Deployment sequence

1. Pin and record UE version, Pixel Streaming infrastructure version, container/OS image, and supported GPU driver.
2. Build and test a standalone packaged UE application and Pixel Streaming connection locally.
3. Create a private GPU worker image and immutable asset/build artifact; provision a signaling service and HTTPS/WSS ingress.
4. Implement session allocation, readiness/health checks, TTL cleanup, limits per user/IP, and crash recovery in the broker.
5. Configure certificates, origins, firewall/security groups, TURN credentials with short TTL, and restrictive signaling access.
6. Deploy a small staging pool; test browser connectivity, input latency, audio policy, reconnect, cleanup, and mobile fallback.
7. Add metrics for GPU utilization, encoder sessions, startup time, active streams, errors, network egress, and cost per session.
8. Roll out gradually, with quotas, autoscaling limits, abuse monitoring, and a documented shutdown procedure.

## Independent visitor sessions and security

Each visitor must receive an isolated process or otherwise isolated game state. Never trust client-supplied identity, room access, or broker allocation parameters. Use short-lived signed session tokens, strict CORS/origin allowlists, authenticated control-plane APIs, request throttling, input validation, and no secret values in frontend bundles. Isolate worker networking and filesystem access; patch base images and UE/Pixel Streaming dependencies. Avoid collecting personal data unless required and documented. Define retention and consent for analytics/recording.

## Scaling and cost factors

Expected cost depends on GPU instance family/region, concurrent sessions, session duration, standby capacity, autoscaling latency, GPU memory per UE process, encoding resolution/frame rate, network egress, TURN relay traffic, signaling/control-plane compute, storage/CDN requests, observability, and support. Benchmark the actual packaged scene and codec on target hardware before estimating price. Use queueing or a wait page when capacity is exhausted; do not promise unlimited concurrent visitors.

## Validation plan

- UE functional tests for movement boundaries, collisions, interactions, and session reset.
- Browser tests across Chromium, Firefox, and Safari for signaling/WebRTC, permissions, resize, reconnect, and fallback navigation.
- Load test broker allocation and cleanup with realistic session duration and ramp-up; do not load test public endpoints without authorization.
- Security test authentication, origin checks, token expiry, allocation limits, and worker isolation.
- Measure startup time, frame pacing, input latency, GPU/VRAM, encode utilization, bandwidth, and CDN/TURN costs.
- Verify documented UE features against the selected engine and Pixel Streaming versions before implementation.

This is an architectural proposal only; implementation requires a separate UE project, licensed/approved assets, GPU hosting, and operational credentials.
