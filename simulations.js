// Drone Workshop Interactive Simulations Suite
// Plain-English, Zero-Jargon, Canvas-driven, 60 FPS Interactive Visualizers

class DroneSimulations {
  constructor() {
    this.activeSimId = 'sim-flight-physics';
    this.animationFrames = {};
    this.initEventListeners();
  }

  init() {
    this.initFlightPhysicsSim();
    this.initThrustCalcSim();
    this.initLiPoMonitorSim();
    this.initWiringTestSim();
    this.initPidTunerSim();
    this.initSensorFusionSim();
    this.initWaypointMissionSim();
    this.initTroubleshootingSim();
    this.initRfLinkSim();
    this.initRadioBlueprintSim();
  }

  initEventListeners() {
    // Tab switching for simulation lab
    document.querySelectorAll('.sim-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.getAttribute('data-sim-target');
        this.switchSimulation(targetId);
      });
    });
  }

  switchSimulation(simId) {
    this.activeSimId = simId;
    document.querySelectorAll('.sim-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-sim-target') === simId);
    });
    document.querySelectorAll('.sim-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === simId);
    });

    // Resize or redraw active sim canvas
    window.dispatchEvent(new Event('resize'));
  }

  // =========================================================================
  // 1. FLIGHT PHYSICS & 4 MOTORS SIMULATOR
  // =========================================================================
  initFlightPhysicsSim() {
    const canvas = document.getElementById('canvas-flight-physics');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const throttleInput = document.getElementById('fp-throttle');
    const pitchInput = document.getElementById('fp-pitch');
    const rollInput = document.getElementById('fp-roll');
    const yawInput = document.getElementById('fp-yaw');
    const resetBtn = document.getElementById('fp-reset-btn');

    const m1Display = document.getElementById('fp-m1-val');
    const m2Display = document.getElementById('fp-m2-val');
    const m3Display = document.getElementById('fp-m3-val');
    const m4Display = document.getElementById('fp-m4-val');
    const explanationEl = document.getElementById('fp-explanation');

    let currentPitch = 0;
    let currentRoll = 0;
    let currentYaw = 0;
    let propAngle = 0;

    const updateControls = () => {
      const throttle = parseFloat(throttleInput.value); // 0 to 100
      const pitch = parseFloat(pitchInput.value);       // -50 (forward/down) to +50 (backward/up)
      const roll = parseFloat(rollInput.value);         // -50 (left) to +50 (right)
      const yaw = parseFloat(yawInput.value);           // -50 (CCW) to +50 (CW)

      // Drone layout: Quad X
      // Motor 1: Rear Right (CCW)
      // Motor 2: Front Right (CW)
      // Motor 3: Rear Left (CW)
      // Motor 4: Front Left (CCW)
      // Standard mixing logic:
      // M1 (Rear-Right): Throttle + Pitch - Roll - Yaw
      // M2 (Front-Right): Throttle - Pitch - Roll + Yaw
      // M3 (Rear-Left): Throttle + Pitch + Roll + Yaw
      // M4 (Front-Left): Throttle - Pitch + Roll - Yaw

      let m1 = throttle + (pitch * 0.5) - (roll * 0.5) - (yaw * 0.5);
      let m2 = throttle - (pitch * 0.5) - (roll * 0.5) + (yaw * 0.5);
      let m3 = throttle + (pitch * 0.5) + (roll * 0.5) + (yaw * 0.5);
      let m4 = throttle - (pitch * 0.5) + (roll * 0.5) - (yaw * 0.5);

      // Clamp between 0% and 100%
      m1 = Math.max(0, Math.min(100, Math.round(m1)));
      m2 = Math.max(0, Math.min(100, Math.round(m2)));
      m3 = Math.max(0, Math.min(100, Math.round(m3)));
      m4 = Math.max(0, Math.min(100, Math.round(m4)));

      if (m1Display) m1Display.textContent = `${m1}% (CCW)`;
      if (m2Display) m2Display.textContent = `${m2}% (CW)`;
      if (m3Display) m3Display.textContent = `${m3}% (CW)`;
      if (m4Display) m4Display.textContent = `${m4}% (CCW)`;

      // Explain in plain English
      let desc = [];
      if (throttle === 0) {
        desc.push("Motors disarmed (0% throttle). No thrust is produced.");
      } else {
        if (Math.abs(pitch) < 3 && Math.abs(roll) < 3 && Math.abs(yaw) < 3) {
          desc.push(`Steady Vertical Thrust: All 4 motors spinning equally at ${throttle}%. Total thrust pushes directly upward. Net rotational torque is exactly zero.`);
        } else {
          if (pitch < -3) desc.push(`Pitch Forward: Front motors (M2, M4) slow down while rear motors (M1, M3) speed up. The frame tilts nose-down, redirecting thrust backward to push the drone forward.`);
          if (pitch > 3) desc.push(`Pitch Backward: Front motors (M2, M4) speed up while rear motors (M1, M3) slow down, tilting the nose up.`);
          if (roll < -3) desc.push(`Roll Left: Right motors (M1, M2) speed up while left motors (M3, M4) slow down, tilting the frame left.`);
          if (roll > 3) desc.push(`Roll Right: Left motors (M3, M4) speed up while right motors (M1, M2) slow down, tilting the frame right.`);
          if (yaw < -3) desc.push(`Yaw Left (CCW): Clockwise motors (M2, M3) spin faster than CCW motors. The reactive torque imbalance safely turns the drone counter-clockwise.`);
          if (yaw > 3) desc.push(`Yaw Right (CW): Counter-clockwise motors (M1, M4) spin faster than CW motors, rotating the drone clockwise in place.`);
        }
      }
      if (explanationEl) explanationEl.textContent = desc.join(" ");

      return { m1, m2, m3, m4, throttle, pitch, roll, yaw };
    };

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        throttleInput.value = 50;
        pitchInput.value = 0;
        rollInput.value = 0;
        yawInput.value = 0;
        updateControls();
      });
    }

    [throttleInput, pitchInput, rollInput, yawInput].forEach(inp => {
      inp.addEventListener('input', updateControls);
    });

    const render = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 380;

      ctx.clearRect(0, 0, w, h);

      // Clean background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // Border and grid
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, w, h);

      // Grid lines
      ctx.beginPath();
      for (let x = 40; x < w; x += 40) {
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }
      for (let y = 40; y < h; y += 40) {
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }
      ctx.strokeStyle = "#f1f5f9";
      ctx.stroke();

      const { m1, m2, m3, m4, throttle, pitch, roll, yaw } = updateControls();

      // Smooth orientation
      currentPitch += (pitch - currentPitch) * 0.1;
      currentRoll += (roll - currentRoll) * 0.1;
      currentYaw += (yaw - currentYaw) * 0.1;
      propAngle += (throttle > 5 ? (throttle * 0.005 + 0.1) : 0);

      const cx = w / 2;
      const cy = h / 2 - (throttle - 50) * 0.8;

      ctx.save();
      ctx.translate(cx, cy);

      // 3D Perspective tilt
      ctx.rotate((currentRoll * Math.PI) / 180 * 0.4);
      ctx.transform(1, (currentYaw * 0.003), 0, Math.cos((currentPitch * Math.PI) / 180 * 0.5), 0, 0);

      const armSpan = Math.min(w, h) * 0.35;

      // Draw Airframe Arms (Carbon Fiber Tubes)
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#334155";
      ctx.lineCap = "round";

      // Arm 4 (Front-Left) to Arm 1 (Rear-Right)
      ctx.beginPath();
      ctx.moveTo(-armSpan, -armSpan * 0.7);
      ctx.lineTo(armSpan, armSpan * 0.7);
      ctx.stroke();

      // Arm 2 (Front-Right) to Arm 3 (Rear-Left)
      ctx.beginPath();
      ctx.moveTo(armSpan, -armSpan * 0.7);
      ctx.lineTo(-armSpan, armSpan * 0.7);
      ctx.stroke();

      // Center Hub Plate
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-36, -36, 72, 72, 8);
      ctx.fill();

      // Forward direction indicator arrow on Flight Controller
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(12, -4);
      ctx.lineTo(4, -4);
      ctx.lineTo(4, 16);
      ctx.lineTo(-4, 16);
      ctx.lineTo(-4, -4);
      ctx.lineTo(-12, -4);
      ctx.closePath();
      ctx.fill();

      // Motor Positions:
      // M2: Front Right (+armSpan, -armSpan * 0.7) CW
      // M4: Front Left (-armSpan, -armSpan * 0.7) CCW
      // M3: Rear Left (-armSpan, +armSpan * 0.7) CW
      // M1: Rear Right (+armSpan, +armSpan * 0.7) CCW
      const motors = [
        { id: "M4", x: -armSpan, y: -armSpan * 0.7, pwr: m4, isCW: false, label: "Front Left (M4)" },
        { id: "M2", x: armSpan, y: -armSpan * 0.7, pwr: m2, isCW: true, label: "Front Right (M2)" },
        { id: "M3", x: -armSpan, y: armSpan * 0.7, pwr: m3, isCW: true, label: "Rear Left (M3)" },
        { id: "M1", x: armSpan, y: armSpan * 0.7, pwr: m1, isCW: false, label: "Rear Right (M1)" },
      ];

      motors.forEach(m => {
        // Motor Mount
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Stator center
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Spinning Propeller
        const propRadius = armSpan * 0.42;
        const spinSign = m.isCW ? 1 : -1;
        const currentAngle = propAngle * spinSign * (m.pwr / 50 + 0.1);

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(currentAngle);

        // Propeller blades
        ctx.fillStyle = m.pwr > 0 ? "rgba(30, 41, 59, 0.7)" : "#475569";
        ctx.beginPath();
        ctx.ellipse(0, 0, propRadius, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rotation direction arc arrow
        ctx.strokeStyle = m.isCW ? "#2563eb" : "#0d9488";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, propRadius * 0.7, 0, Math.PI * 1.2);
        ctx.stroke();

        ctx.restore();

        // Thrust vector arrow (pointing upward out of motor)
        if (m.pwr > 0) {
          const arrowLen = (m.pwr / 100) * 55;
          ctx.strokeStyle = "#16a34a";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x, m.y - arrowLen);
          ctx.stroke();

          // Arrowhead
          ctx.fillStyle = "#16a34a";
          ctx.beginPath();
          ctx.moveTo(m.x, m.y - arrowLen - 6);
          ctx.lineTo(m.x - 5, m.y - arrowLen);
          ctx.lineTo(m.x + 5, m.y - arrowLen);
          ctx.closePath();
          ctx.fill();
        }

        // Motor text tag
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${m.id}: ${m.pwr}%`, m.x, m.y + 32);
      });

      ctx.restore();

      requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 2. THRUST-TO-WEIGHT RATIO CALCULATOR
  // =========================================================================
  initThrustCalcSim() {
    const weightInput = document.getElementById('calc-weight');
    const motorCountInput = document.getElementById('calc-motors');
    const motorTypeInput = document.getElementById('calc-motor-type');
    const cellCountInput = document.getElementById('calc-cells');
    const propSizeInput = document.getElementById('calc-prop');

    const weightVal = document.getElementById('calc-weight-val');
    const twrVal = document.getElementById('calc-twr-val');
    const hoverVal = document.getElementById('calc-hover-val');
    const totalThrustVal = document.getElementById('calc-thrust-val');
    const verdictEl = document.getElementById('calc-verdict');
    const verdictDesc = document.getElementById('calc-verdict-desc');

    if (!weightInput) return;

    const calculate = () => {
      const weight = parseFloat(weightInput.value); // grams
      const motors = parseInt(motorCountInput.value, 10); // 4, 6, 8
      const motorType = motorTypeInput.value; // '2207-2400', '2306-1750', '1404-3800', '4114-400'
      const cells = parseInt(cellCountInput.value, 10); // 3, 4, 6
      const propInches = parseFloat(propSizeInput.value); // 3, 5, 7, 10, 15

      if (weightVal) weightVal.textContent = `${weight} g`;

      // Base thrust model (grams per motor)
      let baseThrust = 850;
      if (motorType === '1404-3800') baseThrust = 320;
      if (motorType === '2207-2400') baseThrust = 1350;
      if (motorType === '2306-1750') baseThrust = 1550;
      if (motorType === '4114-400') baseThrust = 2600;

      // Voltage scaling
      const voltageFactor = cells / 4.0;
      // Propeller diameter scaling
      const propFactor = propInches / 5.0;

      let singleMotorThrust = Math.round(baseThrust * Math.pow(voltageFactor, 0.7) * Math.pow(propFactor, 0.6));
      let totalThrust = singleMotorThrust * motors;
      let twr = parseFloat((totalThrust / weight).toFixed(2));
      let hoverThrottle = Math.round((weight / totalThrust) * 100);
      hoverThrottle = Math.min(100, Math.max(5, hoverThrottle));

      if (twrVal) twrVal.textContent = `${twr} : 1`;
      if (hoverVal) hoverVal.textContent = `${hoverThrottle}%`;
      if (totalThrustVal) totalThrustVal.textContent = `${totalThrust} g (${singleMotorThrust}g / motor)`;

      // Verdict
      if (verdictEl && verdictDesc) {
        if (twr < 1.6) {
          verdictEl.textContent = "UNDERPOWERED (Dangerous)";
          verdictEl.style.backgroundColor = "#fee2e2";
          verdictEl.style.color = "#991b1b";
          verdictDesc.textContent = `At ${twr}:1 TWR, the drone requires ${hoverThrottle}% throttle just to get off the ground. It will struggle against modest wind gusts and may not recover from rapid descents.`;
        } else if (twr >= 1.6 && twr < 2.0) {
          verdictEl.textContent = "MARGINAL (Cruiser / Slow Endurance)";
          verdictEl.style.backgroundColor = "#fef3c7";
          verdictEl.style.color = "#92400e";
          verdictDesc.textContent = `TWR of ${twr}:1 is acceptable for gentle straight-line flying or heavy battery endurance rigs, but leaves little margin for rapid obstacle avoidance.`;
        } else if (twr >= 2.0 && twr <= 3.2) {
          verdictEl.textContent = "OPTIMAL (Camera / Training / Inspection)";
          verdictEl.style.backgroundColor = "#dcfce7";
          verdictEl.style.color = "#166534";
          verdictDesc.textContent = `Ideal sweet spot! Hover is near 40-50% throttle, leaving a full 50% power headroom for stable altitude holding, windy weather navigation, and safe maneuvers.`;
        } else {
          verdictEl.textContent = "HIGH PERFORMANCE (Agile / Racing / Acro)";
          verdictEl.style.backgroundColor = "#e0e7ff";
          verdictEl.style.color = "#3730a3";
          verdictDesc.textContent = `Very high power-to-weight ratio (${twr}:1). Extremely agile and responsive, but requires fine throttle control or software throttle curve scaling for beginners.`;
        }
      }
    };

    [weightInput, motorCountInput, motorTypeInput, cellCountInput, propSizeInput].forEach(inp => {
      inp.addEventListener('input', calculate);
    });

    calculate();
  }

  // =========================================================================
  // 3. LIPO BATTERY MONITOR & SAFETY SIMULATOR
  // =========================================================================
  initLiPoMonitorSim() {
    const cellsSelect = document.getElementById('lipo-cells');
    const sliderVoltage = document.getElementById('lipo-voltage-slider');
    const btnStorage = document.getElementById('lipo-storage-btn');
    const btnFull = document.getElementById('lipo-full-btn');
    const btnCutoff = document.getElementById('lipo-cutoff-btn');

    const cellVoltEl = document.getElementById('lipo-cell-voltage');
    const packVoltEl = document.getElementById('lipo-pack-voltage');
    const capacityRemainEl = document.getElementById('lipo-capacity-remain');
    const statusBadge = document.getElementById('lipo-status-badge');
    const adviseEl = document.getElementById('lipo-advise');

    const canvas = document.getElementById('canvas-lipo-graph');
    if (!sliderVoltage || !canvas) return;
    const ctx = canvas.getContext('2d');

    const updateBattery = () => {
      const cellVoltage = parseFloat(sliderVoltage.value); // 3.00 to 4.30
      const cells = parseInt(cellsSelect.value, 10);       // 1, 3, 4, 6
      const packVoltage = (cellVoltage * cells).toFixed(2);

      let pct = 0;
      if (cellVoltage >= 4.20) pct = 100;
      else if (cellVoltage <= 3.20) pct = 0;
      else {
        // Approximate LiPo discharge non-linear curve
        pct = Math.round(((cellVoltage - 3.20) / (4.20 - 3.20)) * 100);
      }

      if (cellVoltEl) cellVoltEl.textContent = `${cellVoltage.toFixed(2)} V / cell`;
      if (packVoltEl) packVoltEl.textContent = `${packVoltage} V (${cells}S Pack)`;
      if (capacityRemainEl) capacityRemainEl.textContent = `${pct}%`;

      // Status badge and advice
      if (statusBadge && adviseEl) {
        if (cellVoltage > 4.25) {
          statusBadge.textContent = "OVERCHARGED DANGER";
          statusBadge.style.backgroundColor = "#fee2e2";
          statusBadge.style.color = "#991b1b";
          adviseEl.textContent = "Fire Hazard! Standard LiPo cells should never exceed 4.20V. Overcharging breaks down the electrolyte, generates gas, and risks thermal runaway.";
        } else if (cellVoltage >= 4.15) {
          statusBadge.textContent = "FULLY CHARGED (Ready to Fly)";
          statusBadge.style.backgroundColor = "#dcfce7";
          statusBadge.style.color = "#166534";
          adviseEl.textContent = "Safe to fly. If you do not fly within 48 hours, discharge the battery to storage voltage (3.85V) to prevent cell puffing and internal resistance buildup.";
        } else if (cellVoltage >= 3.75 && cellVoltage <= 3.90) {
          statusBadge.textContent = "SAFE STORAGE RANGE (3.80V - 3.85V)";
          statusBadge.style.backgroundColor = "#e0f2fe";
          statusBadge.style.color = "#0369a1";
          adviseEl.textContent = "Optimal chemical equilibrium. Batteries can be safely stored in this range for months without degradation or dangerous swelling.";
        } else if (cellVoltage >= 3.50 && cellVoltage < 3.75) {
          statusBadge.textContent = "LANDING WARNING (Low Battery)";
          statusBadge.style.backgroundColor = "#fef3c7";
          statusBadge.style.color = "#92400e";
          adviseEl.textContent = "Land immediately! Below 3.5V per cell, the voltage curve drops rapidly under motor load. Voltage sag will trigger flight controller failsafe.";
        } else {
          statusBadge.textContent = "CRITICAL DAMAGE ZONE (< 3.30V)";
          statusBadge.style.backgroundColor = "#fee2e2";
          statusBadge.style.color = "#991b1b";
          adviseEl.textContent = "Irreversible degradation. Discharging below 3.0V causes metallic lithium plating and permanent capacity loss. The pack may no longer accept safe charging.";
        }
      }

      drawGraph(cellVoltage);
    };

    const drawGraph = (currentV) => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 220;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(0, 0, w, h);

      // Plot voltage discharge curve
      const padL = 40, padR = 20, padT = 20, padB = 30;
      const plotW = w - padL - padR;
      const plotH = h - padT - padB;

      // Safe zones background
      // 3.85V storage line
      const vToY = (v) => padT + (4.30 - v) / (4.30 - 3.00) * plotH;
      const pctToX = (p) => padL + (p / 100) * plotW;

      // Danger zone < 3.3V
      const y33 = vToY(3.30);
      ctx.fillStyle = "#fef2f2";
      ctx.fillRect(padL, y33, plotW, padT + plotH - y33);

      // Storage line
      const yStore = vToY(3.85);
      ctx.strokeStyle = "#cbd5e1";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, yStore);
      ctx.lineTo(padL + plotW, yStore);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#64748b";
      ctx.font = "10px sans-serif";
      ctx.fillText("Storage 3.85V", padL + 6, yStore - 4);
      ctx.fillText("Cutoff 3.50V", padL + 6, vToY(3.50) - 4);

      // Curve
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let p = 0; p <= 100; p++) {
        // Curve formula from full to empty
        let v = 3.20 + (p / 100) * 0.90 + Math.pow(p / 100, 4) * 0.10;
        let x = pctToX(p);
        let y = vToY(v);
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current point dot
      let curX = pctToX(Math.max(0, Math.min(100, ((currentV - 3.20) / (4.20 - 3.20)) * 100)));
      let curY = vToY(currentV);

      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Labels
      ctx.fillStyle = "#334155";
      ctx.font = "11px system-ui";
      ctx.textAlign = "right";
      ctx.fillText("4.2V", padL - 5, vToY(4.20) + 4);
      ctx.fillText("3.8V", padL - 5, vToY(3.80) + 4);
      ctx.fillText("3.4V", padL - 5, vToY(3.40) + 4);
      ctx.fillText("3.0V", padL - 5, vToY(3.00) + 4);

      ctx.textAlign = "center";
      ctx.fillText("0% Empty", padL, h - 8);
      ctx.fillText("50% Capacity", padL + plotW / 2, h - 8);
      ctx.fillText("100% Full", padL + plotW, h - 8);
    };

    sliderVoltage.addEventListener('input', updateBattery);
    cellsSelect.addEventListener('change', updateBattery);

    if (btnStorage) btnStorage.addEventListener('click', () => { sliderVoltage.value = 3.85; updateBattery(); });
    if (btnFull) btnFull.addEventListener('click', () => { sliderVoltage.value = 4.20; updateBattery(); });
    if (btnCutoff) btnCutoff.addEventListener('click', () => { sliderVoltage.value = 3.50; updateBattery(); });

    updateBattery();
  }

  // =========================================================================
  // 4. WIRING & SMOKE STOPPER CONTINUITY TESTER
  // =========================================================================
  initWiringTestSim() {
    const btnTest = document.getElementById('wire-test-btn');
    const btnReset = document.getElementById('wire-reset-btn');
    const capPolarityCheck = document.getElementById('wire-cap-polarity');
    const shortSwitch = document.getElementById('wire-short-switch');
    const motorSwapSwitch = document.getElementById('wire-motor-swap');

    const resultBox = document.getElementById('wire-test-result');
    const bulbIndicator = document.getElementById('wire-bulb-indicator');
    const statusText = document.getElementById('wire-status-text');

    if (!btnTest) return;

    btnTest.addEventListener('click', () => {
      const isCapReversed = capPolarityCheck && capPolarityCheck.checked;
      const isShortPresent = shortSwitch && shortSwitch.checked;
      const isMotorSwapped = motorSwapSwitch && motorSwapSwitch.checked;

      if (isShortPresent) {
        // Short circuit tripped
        if (bulbIndicator) {
          bulbIndicator.style.backgroundColor = "#ef4444";
          bulbIndicator.textContent = "SMOKE STOPPER TRIPPED (SHORT DETECTED!)";
          bulbIndicator.style.color = "#ffffff";
        }
        if (statusText) {
          statusText.textContent = "CONTINUITY BEEP: Positive and Negative power rails are bridged together! The Smoke Stopper instantly severed current flow. Without it, the flight controller PCB traces would have burnt in under 0.2 seconds.";
          statusText.style.color = "#991b1b";
        }
      } else if (isCapReversed) {
        if (bulbIndicator) {
          bulbIndicator.style.backgroundColor = "#f59e0b";
          bulbIndicator.textContent = "REVERSE POLARITY WARNING";
          bulbIndicator.style.color = "#ffffff";
        }
        if (statusText) {
          statusText.textContent = "CAPACITOR BACKWARD: Electrolytic capacitor negative stripe is connected to the positive battery pad! Electrolytic capacitors will overheat, vent noxious gas, and burst under reverse polarity. Desolder and orient correctly.";
          statusText.style.color = "#92400e";
        }
      } else if (isMotorSwapped) {
        if (bulbIndicator) {
          bulbIndicator.style.backgroundColor = "#10b981";
          bulbIndicator.textContent = "SAFE POWER-UP (MOTOR ROTATION REVERSED)";
          bulbIndicator.style.color = "#ffffff";
        }
        if (statusText) {
          statusText.textContent = "Zero shorts detected! Safe power on: 3 ESC beeps followed by 2 confirmation beeps. Because two motor phase wires were swapped, Motor 1 now spins CCW instead of CW (safe and fully functional).";
          statusText.style.color = "#065f46";
        }
      } else {
        if (bulbIndicator) {
          bulbIndicator.style.backgroundColor = "#10b981";
          bulbIndicator.textContent = "ALL TESTS PASSED (PERFECT CONTINUITY)";
          bulbIndicator.style.color = "#ffffff";
        }
        if (statusText) {
          statusText.textContent = "Multimeter confirms infinite resistance across positive and negative leads. Current remains under 200mA limit. Flight controller boots up, green status LED blinks, receiver establishes 5V lock.";
          statusText.style.color = "#065f46";
        }
      }
    });

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (capPolarityCheck) capPolarityCheck.checked = false;
        if (shortSwitch) shortSwitch.checked = false;
        if (motorSwapSwitch) motorSwapSwitch.checked = false;
        if (bulbIndicator) {
          bulbIndicator.style.backgroundColor = "#e2e8f0";
          bulbIndicator.textContent = "SMOKE STOPPER READY (STANDBY)";
          bulbIndicator.style.color = "#334155";
        }
        if (statusText) {
          statusText.textContent = "Toggle configuration checks above and press 'Connect Battery & Test' to simulate bench continuity verification.";
          statusText.style.color = "#475569";
        }
      });
    }
  }

  // =========================================================================
  // 5. PID CONTROLLER BALANCE & STABILIZER LAB
  // =========================================================================
  initPidTunerSim() {
    const canvas = document.getElementById('canvas-pid-graph');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const pSlider = document.getElementById('pid-p');
    const iSlider = document.getElementById('pid-i');
    const dSlider = document.getElementById('pid-d');
    const pVal = document.getElementById('pid-p-val');
    const iVal = document.getElementById('pid-i-val');
    const dVal = document.getElementById('pid-d-val');

    const btnGust = document.getElementById('pid-gust-btn');
    const btnPush = document.getElementById('pid-push-btn');
    const btnReset = document.getElementById('pid-reset-btn');
    const diagnosisEl = document.getElementById('pid-diagnosis');

    let droneAngle = 0;     // Current tilt angle in degrees
    let droneVelocity = 0;  // Angular velocity
    let targetAngle = 0;    // Desired angle (level = 0)
    let accumulatedError = 0;
    let windDisturbance = 0;
    let history = [];

    const updateSliderVals = () => {
      if (pVal) pVal.textContent = pSlider.value;
      if (iVal) iVal.textContent = iSlider.value;
      if (dVal) dVal.textContent = dSlider.value;
    };

    [pSlider, iSlider, dSlider].forEach(s => s.addEventListener('input', updateSliderVals));
    updateSliderVals();

    if (btnGust) {
      btnGust.addEventListener('click', () => {
        windDisturbance = 25; // Continuous wind push
      });
    }

    if (btnPush) {
      btnPush.addEventListener('click', () => {
        droneAngle += 35; // Instant mechanical shock
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        pSlider.value = 45;
        iSlider.value = 35;
        dSlider.value = 30;
        droneAngle = 0;
        droneVelocity = 0;
        accumulatedError = 0;
        windDisturbance = 0;
        history = [];
        updateSliderVals();
      });
    }

    // Physics step
    const dt = 0.02; // 50Hz update
    setInterval(() => {
      const P = parseFloat(pSlider.value) * 0.1;
      const I = parseFloat(iSlider.value) * 0.01;
      const D = parseFloat(dSlider.value) * 0.05;

      const error = targetAngle - droneAngle;
      accumulatedError += error * dt;
      // Clamp anti-windup
      accumulatedError = Math.max(-50, Math.min(50, accumulatedError));

      const rateOfChange = -droneVelocity;

      // PID correction torque
      const pCorrection = P * error;
      const iCorrection = I * accumulatedError;
      const dCorrection = D * rateOfChange;
      const totalCorrection = pCorrection + iCorrection + dCorrection;

      // Physics model: Torque = Moment of Inertia * Angular Acceleration
      // Aerodynamic damping + wind disturbance
      const netTorque = totalCorrection - (droneAngle * 0.2) + windDisturbance;
      const angularAccel = netTorque * 0.8;

      droneVelocity += angularAccel * dt;
      droneAngle += droneVelocity * dt;

      // Decay wind disturbance slightly over time if single gust
      if (windDisturbance > 0) windDisturbance -= 0.05;

      // Keep history for plotting
      history.push({
        target: targetAngle,
        actual: droneAngle,
        error: error
      });
      if (history.length > 200) history.shift();

      // Diagnose stability
      if (diagnosisEl) {
        if (P > 8.0) {
          diagnosisEl.textContent = "OSCILLATION WARNING: P-Gain is too high! Fast shaking detected as the PID over-corrects past the setpoint.";
          diagnosisEl.style.color = "#991b1b";
        } else if (D > 4.0) {
          diagnosisEl.textContent = "D-TERM NOISE RISK: High D-gain risks amplifying motor vibrations into high-frequency jitter, overheating motors.";
          diagnosisEl.style.color = "#92400e";
        } else if (I < 0.1 && Math.abs(droneAngle) > 4) {
          diagnosisEl.textContent = "STEADY-STATE DRIFT: Integral gain is too low to defeat wind. The drone remains permanently tilted off target.";
          diagnosisEl.style.color = "#92400e";
        } else if (Math.abs(droneAngle) < 1.5 && Math.abs(droneVelocity) < 2) {
          diagnosisEl.textContent = "LOCKED-IN STABILITY: Balanced tuning. Error is swiftly driven to zero without oscillation or overshoot.";
          diagnosisEl.style.color = "#166534";
        } else {
          diagnosisEl.textContent = "DYNAMIC TRACKING: PID loop actively correcting orientation.";
          diagnosisEl.style.color = "#334155";
        }
      }
    }, 20);

    // Canvas render loop
    const render = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 240;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // Frame
      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(0, 0, w, h);

      const midY = h / 2;

      // Target centerline (0 deg)
      ctx.strokeStyle = "#94a3b8";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Drone Angle Curve
      if (history.length > 1) {
        ctx.strokeStyle = "#0284c7"; // Sky Blue
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        for (let i = 0; i < history.length; i++) {
          const x = (i / 200) * w;
          // Scale angle to pixels: 1 deg = 2px
          const y = midY - (history[i].actual * 2.0);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Legend
      ctx.fillStyle = "#0284c7";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Actual Angle: ${droneAngle.toFixed(1)}°`, 15, 20);

      ctx.fillStyle = "#64748b";
      ctx.fillText(`Target: 0.0° (Level)`, 15, 36);

      requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 6. SENSOR FUSION (GYRO DRIFT VS ACCEL NOISE)
  // =========================================================================
  initSensorFusionSim() {
    const canvas = document.getElementById('canvas-fusion');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const noiseSlider = document.getElementById('fusion-noise');
    const driftSlider = document.getElementById('fusion-drift');
    const alphaSlider = document.getElementById('fusion-alpha');
    const alphaVal = document.getElementById('fusion-alpha-val');

    if (alphaSlider && alphaVal) {
      alphaSlider.addEventListener('input', () => {
        alphaVal.textContent = alphaSlider.value;
      });
    }

    let trueAngle = 0;
    let gyroAngle = 0;
    let accelAngle = 0;
    let fusedAngle = 0;
    let time = 0;

    let gyroHist = [];
    let accelHist = [];
    let fusedHist = [];

    const render = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 260;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(0, 0, w, h);

      const noiseAmp = parseFloat(noiseSlider ? noiseSlider.value : 30);
      const driftRate = parseFloat(driftSlider ? driftSlider.value : 25) * 0.01;
      const alpha = parseFloat(alphaSlider ? alphaSlider.value : 0.98);

      time += 0.04;
      // Real physical tilt oscillates gently
      trueAngle = Math.sin(time * 0.8) * 15;

      // Gyro accumulates drift over time
      const gyroRate = Math.cos(time * 0.8) * 15 * 0.8 + driftRate;
      gyroAngle += gyroRate * 0.04;

      // Accelerometer has no drift, but high vibration noise from motors
      const vibration = (Math.random() - 0.5) * noiseAmp;
      accelAngle = trueAngle + vibration;

      // Sensor Fusion (Complementary Filter):
      // Fused = Alpha * (Fused + GyroRate * dt) + (1 - Alpha) * Accel
      fusedAngle = alpha * (fusedAngle + gyroRate * 0.04) + (1.0 - alpha) * accelAngle;

      gyroHist.push(gyroAngle);
      accelHist.push(accelAngle);
      fusedHist.push(fusedAngle);

      if (gyroHist.length > 200) {
        gyroHist.shift();
        accelHist.shift();
        fusedHist.shift();
      }

      const midY = h / 2;

      // Zero axis
      ctx.strokeStyle = "#cbd5e1";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, midY); ctx.lineTo(w, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      // 1. Draw Raw Accelerometer (Red/Amber, noisy)
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < accelHist.length; i++) {
        let x = (i / 200) * w;
        let y = midY - accelHist[i] * 2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Draw Raw Gyro (Purple, drifting)
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < gyroHist.length; i++) {
        let x = (i / 200) * w;
        let y = midY - gyroHist[i] * 2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Draw Fused Angle (Solid Green/Blue, clean & stable)
      ctx.strokeStyle = "#16a34a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < fusedHist.length; i++) {
        let x = (i / 200) * w;
        let y = midY - fusedHist[i] * 2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Legend
      ctx.font = "bold 11px system-ui";
      ctx.fillStyle = "#f97316";
      ctx.fillText("— Raw Accelerometer (Vibration Noise)", 15, 20);
      ctx.fillStyle = "#a855f7";
      ctx.fillText("— Raw Gyroscope (Accumulating Drift)", 15, 36);
      ctx.fillStyle = "#16a34a";
      ctx.fillText("— Filtered Fused Angle (Accurate & Stable)", 15, 52);

      requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 7. AUTONOMOUS WAYPOINT MISSION SIMULATOR
  // =========================================================================
  initWaypointMissionSim() {
    const canvas = document.getElementById('canvas-waypoints');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const btnStart = document.getElementById('wp-start-btn');
    const btnRtl = document.getElementById('wp-rtl-btn');
    const btnReset = document.getElementById('wp-reset-btn');
    const statusEl = document.getElementById('wp-status');

    let waypoints = [
      { x: 80, y: 220, alt: 10, label: "Home / Takeoff" },
      { x: 160, y: 80, alt: 25, label: "WP 1 (Survey)" },
      { x: 300, y: 70, alt: 25, label: "WP 2 (Tower)" },
      { x: 380, y: 180, alt: 20, label: "WP 3 (Perimeter)" },
      { x: 260, y: 230, alt: 15, label: "WP 4 (Inspection)" }
    ];

    let drone = {
      x: waypoints[0].x,
      y: waypoints[0].y,
      currentWP: 0,
      active: false,
      rtlMode: false,
      speed: 1.5
    };

    const updateStatus = (text) => {
      if (statusEl) statusEl.textContent = text;
    };

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        drone.active = true;
        drone.rtlMode = false;
        drone.currentWP = 1;
        updateStatus("Mission Active: Climbing to 25m cruising altitude and navigating to Waypoint 1.");
      });
    }

    if (btnRtl) {
      btnRtl.addEventListener('click', () => {
        drone.rtlMode = true;
        drone.active = true;
        updateStatus("FAILSAFE TRIGGERED: Radio link lost! Autopilot climbing to safe 30m altitude and executing direct Return to Launch (RTL).");
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        drone.x = waypoints[0].x;
        drone.y = waypoints[0].y;
        drone.currentWP = 0;
        drone.active = false;
        drone.rtlMode = false;
        updateStatus("Ready on Launch Pad. Click 'Start Autonomous Mission' or 'Trigger Failsafe (RTL)' to test autopilot logic.");
      });
    }

    // Add waypoints by clicking
    canvas.addEventListener('click', (e) => {
      if (drone.active) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (waypoints.length < 8) {
        waypoints.push({
          x: clickX,
          y: clickY,
          alt: 20,
          label: `WP ${waypoints.length}`
        });
      }
    });

    const render = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 360;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "#f1f5f9";
      ctx.lineWidth = 1;
      for (let x = 30; x < w; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 30; y < h; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      ctx.strokeStyle = "#e2e8f0";
      ctx.strokeRect(0, 0, w, h);

      // Geofence Circle around Home
      const home = waypoints[0];
      ctx.strokeStyle = "#fca5a5";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(home.x, home.y, 220, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#dc2626";
      ctx.font = "10px sans-serif";
      ctx.fillText("Max Geofence Radius (250m)", home.x + 90, home.y - 200);

      // Draw Mission Flight Path
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(waypoints[0].x, waypoints[0].y);
      for (let i = 1; i < waypoints.length; i++) {
        ctx.lineTo(waypoints[i].x, waypoints[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Waypoints
      waypoints.forEach((wp, idx) => {
        ctx.fillStyle = idx === 0 ? "#16a34a" : "#0284c7";
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(wp.label, wp.x, wp.y - 14);
      });

      // Drone flight mechanics
      if (drone.active) {
        let target = drone.rtlMode ? waypoints[0] : waypoints[drone.currentWP];

        const dx = target.x - drone.x;
        const dy = target.y - drone.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 3) {
          drone.x += (dx / dist) * drone.speed;
          drone.y += (dy / dist) * drone.speed;
        } else {
          // Reached WP
          if (drone.rtlMode) {
            drone.active = false;
            drone.rtlMode = false;
            updateStatus("RTL Complete: Successfully returned to launch coordinates and landed safely.");
          } else {
            if (drone.currentWP < waypoints.length - 1) {
              drone.currentWP++;
              updateStatus(`Navigating to ${waypoints[drone.currentWP].label} (Altitude: ${waypoints[drone.currentWP].alt}m)`);
            } else {
              drone.active = false;
              updateStatus("Autonomous Mission Complete! All waypoints executed. Switched to manual loiter.");
            }
          }
        }
      }

      // Draw Drone Icon
      ctx.save();
      ctx.translate(drone.x, drone.y);

      // Drone shadow
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.beginPath();
      ctx.ellipse(0, 14, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Drone Body
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(-8, -8, 16, 16, 3);
      ctx.fill();

      // Cross arms
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-16, -16); ctx.lineTo(16, 16);
      ctx.moveTo(16, -16); ctx.lineTo(-16, 16);
      ctx.stroke();

      // Mini props
      ctx.fillStyle = "#10b981";
      [-16, 16].forEach(px => {
        [-16, 16].forEach(py => {
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      ctx.restore();

      requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 8. TROUBLESHOOTING & FAULT MATRIX
  // =========================================================================
  initTroubleshootingSim() {
    const symptomSelect = document.getElementById('diag-symptom-select');
    const resultTitle = document.getElementById('diag-result-title');
    const causeEl = document.getElementById('diag-cause');
    const fixList = document.getElementById('diag-fix-list');
    const passIndicator = document.getElementById('diag-pass-indicator');

    if (!symptomSelect) return;

    const issues = {
      "flip": {
        title: "Immediate Violent Flip on Takeoff",
        causes: "1. Propellers mounted on wrong motors (CW prop on CCW motor). 2. Motor spin direction opposite to firmware expectation. 3. Flight Controller orientation rotated 90° or 180° in software without matching physical board arrow.",
        fixes: [
          "Remove propellers immediately for bench inspection.",
          "Connect to configurator software and confirm the 3D model tilts exactly in sync with the physical drone.",
          "Check motor spin direction tab in software and verify individual motors 1 to 4 match standard direction.",
          "Confirm CW props are on CW motors and CCW props on CCW motors with writing facing UP."
        ]
      },
      "wobble": {
        title: "High-Frequency Shaking & Burning Hot Motors",
        causes: "Excessive mechanical vibrations entering gyro, loose arm screws, bent prop blade, or PID D-term gain set too high.",
        fixes: [
          "Check all 16 motor mounting screws and arm bolts for tightness.",
          "Inspect propellers for micro-fractures or blade bends.",
          "Lower Derivative (D) gain by 20% on Pitch and Roll axes.",
          "Verify the flight controller stack is soft-mounted on silicone grommets."
        ]
      },
      "toiletbowl": {
        title: "Widening Spirals in GPS Mode ('Toilet-Bowling')",
        causes: "Compass (Magnetometer) interference from high-current battery leads or improper compass calibration.",
        fixes: [
          "Elevate the GPS/Compass unit onto an anti-magnetic carbon mast away from battery wires.",
          "Recalibrate 3D compass outdoors in an open field away from metallic rebar and vehicles.",
          "Check magnetic declination offset for your geographic coordinates in Mission Planner."
        ]
      },
      "norx": {
        title: "Transmitter Sticks Move But No Response in Software",
        causes: "Receiver not bound, incorrect UART serial port selected, or wrong receiver protocol chosen (e.g. PPM instead of CRSF/SBUS).",
        fixes: [
          "Verify steady green LED on receiver confirming solid RF link with radio.",
          "Ensure Serial RX toggle is enabled ONLY on the correct UART port where the RX pad is soldered.",
          "Select 'Serial-based receiver' and set protocol to CRSF (Crossfire/ELRS) or SBUS in the Configuration tab."
        ]
      },
      "brownout": {
        title: "Flight Controller Resets or Video Cuts Out on Full Throttle",
        causes: "High inductive voltage spike from sudden motor braking, missing low-ESR capacitor, or failing battery cell.",
        fixes: [
          "Solder a 35V 470µF–1000µF Low-ESR capacitor directly across the main XT60 battery pads.",
          "Inspect battery cell internal resistance with a digital charger.",
          "Check for loose XT60 connector pins creating high resistance under heavy current."
        ]
      }
    };

    const updateDiag = () => {
      const val = symptomSelect.value;
      const data = issues[val];
      if (!data) return;

      if (resultTitle) resultTitle.textContent = data.title;
      if (causeEl) causeEl.textContent = data.causes;
      if (fixList) {
        fixList.innerHTML = data.fixes.map(f => `<li>${f}</li>`).join("");
      }
      if (passIndicator) {
        passIndicator.textContent = "DIAGNOSTIC COMPLETE: STEP-BY-STEP CHECKLIST LOADED";
        passIndicator.style.backgroundColor = "#e0f2fe";
        passIndicator.style.color = "#0369a1";
      }
    };

    symptomSelect.addEventListener('change', updateDiag);
    updateDiag();
  }

  // =========================================================================
  // 9. RF LINK BUDGET & ANTENNA RADIATION PATTERN SIMULATOR
  // =========================================================================
  initRfLinkSim() {
    const canvas = document.getElementById('canvas-rf-link');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const protocolSelect = document.getElementById('rf-protocol');
    const rateSelect = document.getElementById('rf-rate');
    const powerSlider = document.getElementById('rf-power');
    const distanceSlider = document.getElementById('rf-distance');
    const angleSlider = document.getElementById('rf-angle');

    const powerValEl = document.getElementById('rf-power-val');
    const distanceValEl = document.getElementById('rf-distance-val');
    const angleValEl = document.getElementById('rf-angle-val');
    const rssiValEl = document.getElementById('rf-rssi-val');
    const sensValEl = document.getElementById('rf-sens-val');
    const marginValEl = document.getElementById('rf-margin-val');
    const lqValEl = document.getElementById('rf-lq-val');
    const diagnosisEl = document.getElementById('rf-diagnosis');

    let packetPulseTime = 0;

    const calculateLink = () => {
      const protocol = protocolSelect ? protocolSelect.value : 'elrs-24';
      const rateHz = parseInt(rateSelect ? rateSelect.value : '150', 10);
      const powerMw = parseFloat(powerSlider ? powerSlider.value : 100);
      const distanceM = parseFloat(distanceSlider ? distanceSlider.value : 500);
      const angleDeg = parseFloat(angleSlider ? angleSlider.value : 0);

      // Frequency in MHz
      let freqMHz = 2450;
      if (protocol === 'elrs-915') freqMHz = 915;

      // Power in dBm: 10 * log10(P_mW)
      const powerDbm = 10 * Math.log10(powerMw);

      // Sensitivity table (dBm)
      let sensitivityDbm = -117; // standard 150Hz ELRS
      if (protocol === 'legacy-fsk') {
        sensitivityDbm = -98; // Traditional FSK has no LoRa processing gain
      } else {
        if (rateHz === 50) sensitivityDbm = -123;
        else if (rateHz === 150) sensitivityDbm = -117;
        else if (rateHz === 250) sensitivityDbm = -114;
        else if (rateHz === 500) sensitivityDbm = -108;
        else if (rateHz === 1000) sensitivityDbm = -105;

        // 915MHz LoRa has even higher sensitivity (+3 to 4 dB advantage)
        if (protocol === 'elrs-915') sensitivityDbm -= 3;
      }

      // Free Space Path Loss (FSPL): 20*log10(d) + 20*log10(f_MHz) - 27.55
      const fspl = 20 * Math.log10(Math.max(1, distanceM)) + 20 * Math.log10(freqMHz) - 27.55;

      // Cross-polarization loss: orthogonal dipoles lose up to 26 dB
      const angleRad = (angleDeg * Math.PI) / 180;
      const cosVal = Math.max(0.05, Math.cos(angleRad)); // 0.05 = ~26 dB isolation floor
      const polLoss = -20 * Math.log10(cosVal);

      // Antenna gains (standard dipoles: +2.15 dBi each)
      const gTx = 2.15;
      const gRx = 2.15;

      // Received RSSI
      const rssiDbm = Math.round(powerDbm + gTx + gRx - fspl - polLoss);
      const marginDb = rssiDbm - sensitivityDbm;

      // Link Quality (LQ %) calculation
      let lqPct = 100;
      if (marginDb >= 15) {
        lqPct = 100;
      } else if (marginDb > 0) {
        lqPct = Math.round(50 + (marginDb / 15) * 50);
      } else if (marginDb > -6) {
        lqPct = Math.max(5, Math.round(50 + (marginDb / 6) * 50));
      } else {
        lqPct = 0; // Complete link drop / failsafe
      }

      // Update UI readouts
      if (powerValEl) powerValEl.textContent = `${powerMw} mW (+${powerDbm.toFixed(1)} dBm)`;
      if (distanceValEl) distanceValEl.textContent = distanceM >= 1000 ? `${(distanceM / 1000).toFixed(2)} km` : `${Math.round(distanceM)} m`;
      if (angleValEl) angleValEl.textContent = angleDeg === 0 ? "0° (Perfectly Parallel)" : angleDeg === 90 ? "90° (Orthogonal Null)" : `${angleDeg}° Mismatched`;

      if (rssiValEl) rssiValEl.textContent = `${rssiDbm} dBm`;
      if (sensValEl) sensValEl.textContent = `${sensitivityDbm} dBm`;
      if (marginValEl) {
        marginValEl.textContent = marginDb >= 0 ? `+${marginDb} dB` : `${marginDb} dB`;
        marginValEl.style.color = marginDb > 10 ? "#15803d" : marginDb > 0 ? "#b45309" : "#b91c1c";
      }

      if (lqValEl) {
        lqValEl.textContent = `${lqPct}%`;
        lqValEl.style.color = lqPct > 80 ? "#15803d" : lqPct > 40 ? "#b45309" : "#b91c1c";
      }

      if (diagnosisEl) {
        if (lqPct === 0) {
          diagnosisEl.textContent = "FAILSAFE ACTIVATED: RSSI dropped below receiver sensitivity! Autopilot initiates automatic Return-to-Launch (RTL).";
          diagnosisEl.style.color = "#991b1b";
        } else if (angleDeg >= 80 && polLoss > 18) {
          diagnosisEl.textContent = `CROSS-POLARIZATION WARNING: 90° antenna mismatch causes -${polLoss.toFixed(1)} dB attenuation! Always maintain dual 90° diversity antennas on aircraft.`;
          diagnosisEl.style.color = "#92400e";
        } else if (marginDb < 10) {
          diagnosisEl.textContent = `LOW LINK MARGIN: Signal is within +${marginDb} dB of sensitivity limit. Increase transmitter power or climb above terrain obstructions.`;
          diagnosisEl.style.color = "#92400e";
        } else {
          diagnosisEl.textContent = `OPTIMAL RF LINK: 100% LQ. Received signal is +${marginDb} dB above sensitivity floor. Safe for autonomous operations.`;
          diagnosisEl.style.color = "#15803d";
        }
      }

      return { freqMHz, powerDbm, sensitivityDbm, fspl, polLoss, rssiDbm, marginDb, lqPct, angleDeg, distanceM };
    };

    [protocolSelect, rateSelect, powerSlider, distanceSlider, angleSlider].forEach(el => {
      if (el) el.addEventListener('input', calculateLink);
    });

    // Canvas render loop
    const render = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 360;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#e4e4e7";
      ctx.strokeRect(0, 0, w, h);

      packetPulseTime += 0.05;
      const data = calculateLink();

      // Transmitter position (Left)
      const txX = 90;
      const txY = h / 2;

      // Drone receiver position (Right)
      const rxX = w - 100;
      const rxY = h / 2;

      // 1. Draw Transmitter Dipole Antenna & Toroidal Pattern (Donut slice)
      ctx.save();
      ctx.translate(txX, txY);

      // Antenna Wire (Vertical)
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, -45);
      ctx.lineTo(0, 45);
      ctx.stroke();

      // Toroidal Donut Radiation Lobes
      ctx.fillStyle = "rgba(2, 132, 199, 0.12)";
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 1.5;

      // Right lobe
      ctx.beginPath();
      ctx.ellipse(35, 0, 40, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Left lobe
      ctx.beginPath();
      ctx.ellipse(-35, 0, 40, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Axial Null indicators (Tip of wire)
      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 10px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("▲ Tip Null", 0, -52);
      ctx.fillText("▼ Tip Null", 0, 60);

      ctx.restore();

      // 2. Draw Radio Transmitter Box Icon
      ctx.fillStyle = "#27272a";
      ctx.beginPath();
      ctx.roundRect(txX - 22, txY - 14, 44, 28, 4);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("TX Radio", txX, txY + 4);

      // 3. Draw Drone & Receiver Antenna (With Polarization Angle)
      ctx.save();
      ctx.translate(rxX, rxY);

      // Mini Drone Body
      ctx.fillStyle = "#09090b";
      ctx.beginPath();
      ctx.roundRect(-16, -16, 32, 32, 6);
      ctx.fill();

      // Mini arms
      ctx.strokeStyle = "#52525b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-24, -24); ctx.lineTo(24, 24);
      ctx.moveTo(24, -24); ctx.lineTo(-24, 24);
      ctx.stroke();

      // Drone Receiver Antenna (Rotated by angleDeg)
      ctx.rotate((data.angleDeg * Math.PI) / 180);
      ctx.strokeStyle = data.angleDeg >= 75 ? "#dc2626" : "#16a34a";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -32);
      ctx.lineTo(0, 32);
      ctx.stroke();

      // Tip markers
      ctx.fillStyle = data.angleDeg >= 75 ? "#dc2626" : "#16a34a";
      ctx.beginPath();
      ctx.arc(0, -32, 3, 0, Math.PI * 2);
      ctx.arc(0, 32, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Drone text tag
      ctx.fillStyle = "#09090b";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`Drone RX (${data.angleDeg}° Tilt)`, rxX, rxY + 42);

      // 4. Draw Radio Frequency Propagation Beam
      const linkColor = data.lqPct > 70 ? "#16a34a" : data.lqPct > 0 ? "#d97706" : "#dc2626";
      ctx.strokeStyle = linkColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(txX + 45, txY);
      ctx.lineTo(rxX - 25, rxY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Traveling RF Packet Pulses
      const pulseCount = 4;
      const rayLen = (rxX - 25) - (txX + 45);
      for (let p = 0; p < pulseCount; p++) {
        let pulseOffset = ((packetPulseTime + (p / pulseCount)) % 1);
        let px = (txX + 45) + (pulseOffset * rayLen);
        ctx.fillStyle = linkColor;
        ctx.beginPath();
        ctx.arc(px, txY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Legend & Math Notes
      ctx.fillStyle = "#27272a";
      ctx.font = "12px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Path Loss (FSPL): -${data.fspl.toFixed(1)} dB • Polarization Loss: -${data.polLoss.toFixed(1)} dB`, 24, 28);
      ctx.fillText(`Link Margin: ${data.marginDb >= 0 ? '+' : ''}${data.marginDb} dB (Floor: ${data.sensitivityDbm} dBm)`, 24, 48);

      requestAnimationFrame(render);
    };

    render();
  }

  // =========================================================================
  // 10. RADIO CONTROLLER BLUEPRINT & SWITCH MATRIX SIMULATOR
  // =========================================================================
  initRadioBlueprintSim() {
    const canvas = document.getElementById('canvas-radio-blueprint');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const statusEl = document.getElementById('radio-blueprint-status');
    const saReadout = document.getElementById('sa-readout');
    const sbReadout = document.getElementById('sb-readout');
    const scReadout = document.getElementById('sc-readout');
    const sdReadout = document.getElementById('sd-readout');

    const sliderThrottle = document.getElementById('ctrl-throttle');
    const sliderYaw = document.getElementById('ctrl-yaw');
    const sliderPitch = document.getElementById('ctrl-pitch');
    const sliderRoll = document.getElementById('ctrl-roll');
    const sliderS1 = document.getElementById('ctrl-s1');

    const valThrottle = document.getElementById('ctrl-throttle-val');
    const valYaw = document.getElementById('ctrl-yaw-val');
    const valPitch = document.getElementById('ctrl-pitch-val');
    const valRoll = document.getElementById('ctrl-roll-val');
    const valS1 = document.getElementById('ctrl-s1-val');

    // Switch state
    let sa = 0; // 0 = Disarm (1000us), 1 = Arm (2000us)
    let sb = 0; // 0 = Angle (1000us), 1 = Horizon (1500us), 2 = Acro (2000us)
    let sc = 0; // 0 = Normal (1000us), 1 = Pos Hold (1500us), 2 = GPS RTH (2000us)
    let sd = 0; // 0 = Silent (1000us), 1 = Beep Alarm (2000us)
    let s1 = 1500; // Analog dial S1
    let throttle = 1000;
    let yaw = 1500;
    let pitch = 1500;
    let roll = 1500;

    let armingBlocked = false;
    let isDraggingLeftStick = false;
    let isDraggingRightStick = false;
    let wavePulse = 0;

    // Geometric coordinates on 800x620 canvas
    const cx = 400;
    const cy = 340;

    const coords = {
      antenna: { x: cx, y: cy - 165, tipY: cy - 275 },
      sa: { x: cx - 165, y: cy - 145, r: 24 },
      sb: { x: cx - 95, y: cy - 130, r: 22 },
      sc: { x: cx + 95, y: cy - 130, r: 22 },
      sd: { x: cx + 165, y: cy - 145, r: 24 },
      s1: { x: cx - 42, y: cy - 150, r: 16 },
      s2: { x: cx + 42, y: cy - 150, r: 16 },
      leftGimbal: { x: cx - 120, y: cy + 30, r: 52 },
      rightGimbal: { x: cx + 120, y: cy + 30, r: 52 },
      screen: { x: cx - 56, y: cy - 15, w: 112, h: 78 }
    };

    // Update Status Readout
    const updateDiagnostics = () => {
      if (!statusEl) return;
      if (sa === 1 && !armingBlocked) {
        statusEl.textContent = `SYSTEM ARMED [MOTORS LIVE] • THROTTLE AT ${Math.round((throttle - 1000) / 10)}% (${throttle}µs) • DANGER: PROPELLERS WILL SPIN`;
        statusEl.style.color = "#dc2626";
      } else if (armingBlocked) {
        statusEl.textContent = `ARMING PREVENTED: THROTTLE IS AT ${throttle}µs (>1050µs SAFETY LIMIT). Pull throttle stick all the way down to 1000µs before arming.`;
        statusEl.style.color = "#b91c1c";
      } else {
        if (throttle === 1000) {
          statusEl.textContent = "STATUS: SAFE [DISARMED] • THROTTLE AT ZERO (1000µs) • READY TO ARM ON SWITCH SA";
          statusEl.style.color = "#166534";
        } else {
          statusEl.textContent = `STATUS: SAFE [DISARMED] • THROTTLE AT ${throttle}µs • MUST LOWER TO ZERO (1000µs) TO ARM SAFELY`;
          statusEl.style.color = "#92400e";
        }
      }
    };

    // Update UI controls and live Channel Monitor
    const updateUI = () => {
      // Channel Values
      const ch1 = roll;
      const ch2 = pitch;
      const ch3 = throttle;
      const ch4 = yaw;
      const ch5 = (sa === 1 && !armingBlocked) ? 2000 : 1000;
      const ch6 = sb === 0 ? 1000 : (sb === 1 ? 1500 : 2000);
      const ch7 = sc === 0 ? 1000 : (sc === 1 ? 1500 : 2000);
      const ch8 = sd === 1 ? 2000 : 1000;

      const channels = [
        { id: 'ch1', val: ch1 },
        { id: 'ch2', val: ch2 },
        { id: 'ch3', val: ch3 },
        { id: 'ch4', val: ch4 },
        { id: 'ch5', val: ch5 },
        { id: 'ch6', val: ch6 },
        { id: 'ch7', val: ch7 },
        { id: 'ch8', val: ch8 }
      ];

      channels.forEach(ch => {
        const bar = document.getElementById(`bar-${ch.id}`);
        const valSpan = document.getElementById(`val-${ch.id}`);
        if (bar) {
          const pct = Math.max(0, Math.min(100, ((ch.val - 1000) / 1000) * 100));
          bar.style.width = `${pct}%`;
          if (ch.id === 'ch5') {
            bar.style.backgroundColor = ch.val === 2000 ? "#dc2626" : "#18181b";
          }
        }
        if (valSpan) {
          valSpan.textContent = `${ch.val} µs`;
        }
      });

      // Switch SA buttons
      document.querySelectorAll('#sa-toggle-row .switch-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-pos'), 10) === sa);
      });
      if (saReadout) {
        saReadout.textContent = sa === 0 ? "DISARM (1000µs)" : (armingBlocked ? "REFUSED (>1050µs)" : "ARM MOTORS (2000µs)");
        saReadout.style.color = (sa === 1 && !armingBlocked) ? "#dc2626" : "var(--text-primary)";
      }

      // Switch SB buttons
      document.querySelectorAll('#sb-toggle-row .switch-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-pos'), 10) === sb);
      });
      if (sbReadout) {
        const modes = ["ANGLE (1000µs)", "HORIZON (1500µs)", "ACRO (2000µs)"];
        sbReadout.textContent = modes[sb];
      }

      // Switch SC buttons
      document.querySelectorAll('#sc-toggle-row .switch-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-pos'), 10) === sc);
      });
      if (scReadout) {
        const rescue = ["NORMAL (1000µs)", "POS HOLD (1500µs)", "GPS RTH (2000µs)"];
        scReadout.textContent = rescue[sc];
      }

      // Switch SD buttons
      document.querySelectorAll('#sd-toggle-row .switch-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-pos'), 10) === sd);
      });
      if (sdReadout) {
        sdReadout.textContent = sd === 0 ? "SILENT (1000µs)" : "BEEP ALARM (2000µs)";
        sdReadout.style.color = sd === 1 ? "#dc2626" : "var(--text-primary)";
      }

      // Sliders & Readouts
      if (sliderThrottle) sliderThrottle.value = throttle;
      if (valThrottle) valThrottle.textContent = `${throttle} µs (${Math.round((throttle - 1000) / 10)}%)`;

      if (sliderYaw) sliderYaw.value = yaw;
      if (valYaw) valYaw.textContent = `${yaw} µs ${yaw === 1500 ? '(Center)' : (yaw < 1500 ? '(Left)' : '(Right)')}`;

      if (sliderPitch) sliderPitch.value = pitch;
      if (valPitch) valPitch.textContent = `${pitch} µs ${pitch === 1500 ? '(Center)' : (pitch < 1500 ? '(Down)' : '(Up)')}`;

      if (sliderRoll) sliderRoll.value = roll;
      if (valRoll) valRoll.textContent = `${roll} µs ${roll === 1500 ? '(Center)' : (roll < 1500 ? '(Left)' : '(Right)')}`;

      if (sliderS1) sliderS1.value = s1;
      if (valS1) valS1.textContent = `${s1} µs (${Math.round((s1 - 1000) / 10)}%)`;

      updateDiagnostics();
    };

    // Toggle switch SA logic with Betaflight safety interlock
    const toggleSA = (targetPos) => {
      if (targetPos === 1) {
        if (throttle > 1050) {
          sa = 0;
          armingBlocked = true;
        } else {
          sa = 1;
          armingBlocked = false;
        }
      } else {
        sa = 0;
        armingBlocked = false;
      }
      updateUI();
    };

    // Switch DOM Button Listeners
    document.querySelectorAll('#sa-toggle-row .switch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        toggleSA(parseInt(e.currentTarget.getAttribute('data-pos'), 10));
      });
    });

    document.querySelectorAll('#sb-toggle-row .switch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sb = parseInt(e.currentTarget.getAttribute('data-pos'), 10);
        updateUI();
      });
    });

    document.querySelectorAll('#sc-toggle-row .switch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sc = parseInt(e.currentTarget.getAttribute('data-pos'), 10);
        updateUI();
      });
    });

    document.querySelectorAll('#sd-toggle-row .switch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sd = parseInt(e.currentTarget.getAttribute('data-pos'), 10);
        updateUI();
      });
    });

    // Slider inputs
    if (sliderThrottle) {
      sliderThrottle.addEventListener('input', (e) => {
        throttle = parseInt(e.target.value, 10);
        if (armingBlocked && throttle <= 1050) {
          armingBlocked = false;
        }
        updateUI();
      });
    }

    if (sliderYaw) {
      sliderYaw.addEventListener('input', (e) => {
        yaw = parseInt(e.target.value, 10);
        updateUI();
      });
    }

    if (sliderPitch) {
      sliderPitch.addEventListener('input', (e) => {
        pitch = parseInt(e.target.value, 10);
        updateUI();
      });
    }

    if (sliderRoll) {
      sliderRoll.addEventListener('input', (e) => {
        roll = parseInt(e.target.value, 10);
        updateUI();
      });
    }

    if (sliderS1) {
      sliderS1.addEventListener('input', (e) => {
        s1 = parseInt(e.target.value, 10);
        updateUI();
      });
    }

    // Direct Canvas Mouse / Drag Interaction
    const getCanvasMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

    canvas.addEventListener('mousemove', (e) => {
      const mouse = getCanvasMousePos(e);

      if (isDraggingLeftStick) {
        // Left Gimbal: Mode 2 Throttle (Y) and Yaw (X)
        const dx = mouse.x - coords.leftGimbal.x;
        const dy = mouse.y - coords.leftGimbal.y;
        const maxRange = 36;

        // Yaw: Left/Right (-36 to +36) -> 1000 to 2000
        const clampedX = Math.max(-maxRange, Math.min(maxRange, dx));
        yaw = Math.round(1500 + (clampedX / maxRange) * 500);

        // Throttle: Bottom (clampedY = +36 -> 1000) to Top (clampedY = -36 -> 2000)
        const clampedY = Math.max(-maxRange, Math.min(maxRange, dy));
        throttle = Math.round(1500 - (clampedY / maxRange) * 500);
        if (armingBlocked && throttle <= 1050) {
          armingBlocked = false;
        }
        updateUI();
        return;
      }

      if (isDraggingRightStick) {
        // Right Gimbal: Mode 2 Pitch (Y) and Roll (X)
        const dx = mouse.x - coords.rightGimbal.x;
        const dy = mouse.y - coords.rightGimbal.y;
        const maxRange = 36;

        const clampedX = Math.max(-maxRange, Math.min(maxRange, dx));
        roll = Math.round(1500 + (clampedX / maxRange) * 500);

        const clampedY = Math.max(-maxRange, Math.min(maxRange, dy));
        pitch = Math.round(1500 - (clampedY / maxRange) * 500);
        updateUI();
        return;
      }

      // Hover cursor checks
      if (
        dist(mouse, coords.sa) <= coords.sa.r ||
        dist(mouse, coords.sb) <= coords.sb.r ||
        dist(mouse, coords.sc) <= coords.sc.r ||
        dist(mouse, coords.sd) <= coords.sd.r ||
        dist(mouse, coords.s1) <= coords.s1.r
      ) {
        canvas.style.cursor = 'pointer';
      } else if (dist(mouse, coords.leftGimbal) <= coords.leftGimbal.r || dist(mouse, coords.rightGimbal) <= coords.rightGimbal.r) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'crosshair';
      }
    });

    canvas.addEventListener('mousedown', (e) => {
      const mouse = getCanvasMousePos(e);

      // Check Left Gimbal Drag
      if (dist(mouse, coords.leftGimbal) <= coords.leftGimbal.r) {
        isDraggingLeftStick = true;
        canvas.style.cursor = 'grabbing';
        const dx = mouse.x - coords.leftGimbal.x;
        const dy = mouse.y - coords.leftGimbal.y;
        yaw = Math.round(1500 + (Math.max(-36, Math.min(36, dx)) / 36) * 500);
        throttle = Math.round(1500 - (Math.max(-36, Math.min(36, dy)) / 36) * 500);
        updateUI();
        return;
      }

      // Check Right Gimbal Drag
      if (dist(mouse, coords.rightGimbal) <= coords.rightGimbal.r) {
        isDraggingRightStick = true;
        canvas.style.cursor = 'grabbing';
        const dx = mouse.x - coords.rightGimbal.x;
        const dy = mouse.y - coords.rightGimbal.y;
        roll = Math.round(1500 + (Math.max(-36, Math.min(36, dx)) / 36) * 500);
        pitch = Math.round(1500 - (Math.max(-36, Math.min(36, dy)) / 36) * 500);
        updateUI();
        return;
      }

      // Click SA (Arm Toggle)
      if (dist(mouse, coords.sa) <= coords.sa.r) {
        toggleSA(sa === 0 ? 1 : 0);
        return;
      }

      // Click SB (Flight Mode: Cycle 0 -> 1 -> 2 -> 0)
      if (dist(mouse, coords.sb) <= coords.sb.r) {
        sb = (sb + 1) % 3;
        updateUI();
        return;
      }

      // Click SC (Rescue: Cycle 0 -> 1 -> 2 -> 0)
      if (dist(mouse, coords.sc) <= coords.sc.r) {
        sc = (sc + 1) % 3;
        updateUI();
        return;
      }

      // Click SD (Beeper: Toggle 0 <-> 1)
      if (dist(mouse, coords.sd) <= coords.sd.r) {
        sd = sd === 0 ? 1 : 0;
        updateUI();
        return;
      }

      // Click S1 (Cycle tilt 1000 -> 1500 -> 2000)
      if (dist(mouse, coords.s1) <= coords.s1.r) {
        s1 = s1 === 1000 ? 1500 : (s1 === 1500 ? 2000 : 1000);
        updateUI();
        return;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingRightStick) {
        // Mode 2 Right stick springs back to center (1500µs Pitch, 1500µs Roll)
        pitch = 1500;
        roll = 1500;
        isDraggingRightStick = false;
        canvas.style.cursor = 'grab';
        updateUI();
      }
      if (isDraggingLeftStick) {
        // Mode 2 Left stick: Yaw springs back to center (1500µs), Throttle stays at current value
        yaw = 1500;
        isDraggingLeftStick = false;
        canvas.style.cursor = 'grab';
        updateUI();
      }
    });

    updateUI();

    // -------------------------------------------------------------------------
    // CANVAS RENDER LOOP: CAD Blueprint Architecture
    // -------------------------------------------------------------------------
    const render = () => {
      if (this.activeSimId !== 'sim-radio-controller') {
        requestAnimationFrame(render);
        return;
      }

      wavePulse = (wavePulse + 0.04) % (Math.PI * 2);

      const w = canvas.width = 800;
      const h = canvas.height = 620;

      // 1. Clean Architectural White Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // 2. Blueprint Engineering Grid
      // Fine Hairlines (20px)
      ctx.strokeStyle = "#f4f4f5";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 20) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Major Grid Lines (100px)
      ctx.strokeStyle = "#e4e4e7";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 100) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += 100) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // 3. Blueprint Border Frame
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 16, w - 32, h - 32);
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 0.75;
      ctx.strokeRect(22, 22, w - 44, h - 44);

      // Corner Datum Alignment Crosshairs
      const drawDatum = (dx, dy) => {
        ctx.strokeStyle = "#18181b";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(dx - 8, dy); ctx.lineTo(dx + 8, dy);
        ctx.moveTo(dx, dy - 8); ctx.lineTo(dx, dy + 8);
        ctx.stroke();
        ctx.strokeRect(dx - 4, dy - 4, 8, 8);
      };
      drawDatum(22, 22);
      drawDatum(w - 22, 22);
      drawDatum(22, h - 22);
      drawDatum(w - 22, h - 22);

      // 4. CAD Technical Title Block (Bottom-Right)
      const tbX = w - 300;
      const tbY = h - 94;
      const tbW = 276;
      const tbH = 70;

      ctx.fillStyle = "#fafafa";
      ctx.fillRect(tbX, tbY, tbW, tbH);
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tbX, tbY, tbW, tbH);

      // Internal dividing lines
      ctx.beginPath();
      ctx.moveTo(tbX, tbY + 24); ctx.lineTo(tbX + tbW, tbY + 24);
      ctx.moveTo(tbX, tbY + 46); ctx.lineTo(tbX + tbW, tbY + 46);
      ctx.moveTo(tbX + 170, tbY + 24); ctx.lineTo(tbX + 170, tbY + tbH);
      ctx.stroke();

      // Title Block Text
      ctx.fillStyle = "#09090b";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "left";
      ctx.fillText("TITLE: RC TRANSMITTER BLUEPRINT (MODE 2)", tbX + 8, tbY + 16);

      ctx.font = "9px monospace";
      ctx.fillStyle = "#27272a";
      ctx.fillText("PROTOCOL: CRSF / ELRS 2.4GHz", tbX + 8, tbY + 38);
      ctx.fillText("STATUS: ACTIVE TELEMETRY", tbX + 8, tbY + 60);

      ctx.fillText("SHEET: TX-01", tbX + 178, tbY + 38);
      ctx.fillText("SCALE: 1:1 [MM]", tbX + 178, tbY + 60);

      // 5. Radio Antenna & Electromagnetic Wavefronts
      const antBaseX = coords.antenna.x;
      const antBaseY = coords.antenna.y;
      const antTipY = coords.antenna.tipY;

      // Concentric Dashed RF Wavefronts
      ctx.save();
      for (let r = 1; r <= 3; r++) {
        const radius = 25 + (r * 22) + ((Math.sin(wavePulse) + 1) * 3);
        ctx.strokeStyle = (sa === 1 && !armingBlocked) ? "#dc2626" : "#71717a";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(antBaseX, (antBaseY + antTipY) / 2, radius, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
      }
      ctx.restore();

      // Antenna Stalk
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(antBaseX - 6, antTipY, 12, antBaseY - antTipY, 4);
      } else {
        ctx.rect(antBaseX - 6, antTipY, 12, antBaseY - antTipY);
      }
      ctx.fill();
      ctx.stroke();

      // Antenna Tip & Knurled Hinge Nut
      ctx.fillStyle = "#18181b";
      ctx.fillRect(antBaseX - 8, antBaseY - 14, 16, 12);
      ctx.strokeRect(antBaseX - 8, antBaseY - 14, 16, 12);

      // Antenna Dimension Bracket
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(antBaseX + 18, antTipY); ctx.lineTo(antBaseX + 28, antTipY);
      ctx.moveTo(antBaseX + 23, antTipY); ctx.lineTo(antBaseX + 23, antBaseY);
      ctx.moveTo(antBaseX + 18, antBaseY); ctx.lineTo(antBaseX + 28, antBaseY);
      ctx.stroke();

      ctx.font = "9px monospace";
      ctx.fillStyle = "#52525b";
      ctx.textAlign = "left";
      ctx.fillText("↕ λ/4 = 30.6mm (2.4GHz)", antBaseX + 32, (antTipY + antBaseY) / 2);
      ctx.fillText("50Ω COAX DIPOLE", antBaseX + 32, ((antTipY + antBaseY) / 2) + 12);

      // 6. Radio Transmitter Ergonomic Body Shell
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 2.5;
      ctx.fillStyle = "#ffffff";

      ctx.beginPath();
      // Ergonomic outer contour
      ctx.moveTo(cx - 190, cy - 165);
      ctx.lineTo(cx - 35, cy - 165);
      ctx.lineTo(cx - 20, cy - 150);
      ctx.lineTo(cx + 20, cy - 150);
      ctx.lineTo(cx + 35, cy - 165);
      ctx.lineTo(cx + 190, cy - 165);
      ctx.arcTo(cx + 225, cy - 165, cx + 225, cy - 120, 24);
      // Right Grip Flare
      ctx.lineTo(cx + 225, cy + 90);
      ctx.arcTo(cx + 230, cy + 165, cx + 180, cy + 165, 20);
      ctx.lineTo(cx + 60, cy + 165);
      // Bottom Center Lanyard Recess
      ctx.lineTo(cx + 40, cy + 150);
      ctx.lineTo(cx - 40, cy + 150);
      ctx.lineTo(cx - 60, cy + 165);
      // Left Grip Flare
      ctx.lineTo(cx - 180, cy + 165);
      ctx.arcTo(cx - 230, cy + 165, cx - 225, cy + 90, 20);
      ctx.lineTo(cx - 225, cy - 120);
      ctx.arcTo(cx - 225, cy - 165, cx - 190, cy - 165, 24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Grip Hatching Textures (Left & Right Sides)
      ctx.strokeStyle = "#d4d4d8";
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const hy = cy - 40 + (i * 18);
        // Left grip hatching
        ctx.beginPath();
        ctx.moveTo(cx - 220, hy);
        ctx.lineTo(cx - 195, hy + 12);
        ctx.stroke();

        // Right grip hatching
        ctx.beginPath();
        ctx.moveTo(cx + 220, hy);
        ctx.lineTo(cx + 195, hy + 12);
        ctx.stroke();
      }

      // Lanyard Neck Strap Eyelet
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 14, cy + 120, 28, 14);
      ctx.beginPath();
      ctx.arc(cx, cy + 127, 4, 0, Math.PI * 2);
      ctx.stroke();

      // Power Button ⏻
      ctx.strokeStyle = "#18181b";
      ctx.fillStyle = (sa === 1 && !armingBlocked) ? "#fef2f2" : "#f4f4f5";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy + 85, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = (sa === 1 && !armingBlocked) ? "#dc2626" : "#18181b";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⏻", cx, cy + 89);

      // 7. Gimbals (Mode 2 Architecture)
      const drawGimbal = (gx, gy, stickX, stickY, label1, label2, isLeft) => {
        // Outer Gimbal Bezel
        ctx.strokeStyle = "#18181b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(gx, gy, 52, 0, Math.PI * 2);
        ctx.stroke();

        // Inner Recessed Ring
        ctx.strokeStyle = "#a1a1aa";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(gx, gy, 44, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.strokeStyle = "#e4e4e7";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(gx - 44, gy); ctx.lineTo(gx + 44, gy);
        ctx.moveTo(gx, gy - 44); ctx.lineTo(gx, gy + 44);
        ctx.stroke();
        ctx.setLineDash([]);

        // Angular Degree Ticks
        ctx.strokeStyle = "#71717a";
        ctx.lineWidth = 1;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
          const x1 = gx + Math.cos(angle) * 44;
          const y1 = gy + Math.sin(angle) * 44;
          const x2 = gx + Math.cos(angle) * 49;
          const y2 = gy + Math.sin(angle) * 49;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Stick Center Post & Knurled Knob
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#18181b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(stickX, stickY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Diamond Milled Knurling on Stick Head
        ctx.strokeStyle = "#52525b";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(stickX, stickY, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(stickX - 8, stickY); ctx.lineTo(stickX + 8, stickY);
        ctx.moveTo(stickX, stickY - 8); ctx.lineTo(stickX, stickY + 8);
        ctx.stroke();

        // Mode 2 Technical Labels & Microsecond Box
        ctx.fillStyle = "#09090b";
        ctx.font = "bold 9.5px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label1, gx, gy + 68);

        ctx.font = "8.5px monospace";
        ctx.fillStyle = "#71717a";
        ctx.fillText(label2, gx, gy + 80);

        // Digital Trim Rockers (T1-T4)
        if (isLeft) {
          // Left: Vertical Trim T3 to the right
          ctx.strokeRect(gx + 56, gy - 16, 7, 32);
          ctx.fillText("T3", gx + 60, gy - 20);
          // Left: Horizontal Trim T4 below
          ctx.strokeRect(gx - 16, gy + 54, 32, 7);
        } else {
          // Right: Vertical Trim T2 to the left
          ctx.strokeRect(gx - 63, gy - 16, 7, 32);
          ctx.fillText("T2", gx - 60, gy - 20);
          // Right: Horizontal Trim T1 below
          ctx.strokeRect(gx - 16, gy + 54, 32, 7);
        }
      };

      // Calculate Left Stick coordinates from Yaw & Throttle
      const leftStickX = coords.leftGimbal.x + ((yaw - 1500) / 500) * 32;
      const leftStickY = coords.leftGimbal.y - ((throttle - 1500) / 500) * 32;
      drawGimbal(coords.leftGimbal.x, coords.leftGimbal.y, leftStickX, leftStickY, "THROTTLE & YAW", "CH3 & CH4 (MODE 2)", true);

      // Calculate Right Stick coordinates from Roll & Pitch
      const rightStickX = coords.rightGimbal.x + ((roll - 1500) / 500) * 32;
      const rightStickY = coords.rightGimbal.y - ((pitch - 1500) / 500) * 32;
      drawGimbal(coords.rightGimbal.x, coords.rightGimbal.y, rightStickX, rightStickY, "PITCH & ROLL", "CH2 & CH1 (SPRING)", false);

      // 8. Toggle Switches (SA, SB, SC, SD)
      const drawSwitch = (swX, swY, pos, maxPos, label, isArm, isMomentary) => {
        // Hex Nut Collar
        ctx.strokeStyle = "#18181b";
        ctx.fillStyle = "#f4f4f5";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(swX, swY, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Switch Pivot Center
        ctx.fillStyle = "#18181b";
        ctx.beginPath();
        ctx.arc(swX, swY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Toggle Bat Lever (Angle based on position)
        let leverAngle = -Math.PI / 4; // UP
        if (maxPos === 2) {
          leverAngle = pos === 0 ? -Math.PI / 4 : (pos === 1 ? 0 : Math.PI / 4);
        } else {
          leverAngle = pos === 0 ? -Math.PI / 4 : Math.PI / 4;
        }

        const leverLen = 18;
        const tipX = swX + Math.sin(leverAngle) * leverLen;
        const tipY = swY + Math.cos(leverAngle) * (pos === 0 ? -leverLen : leverLen);

        ctx.strokeStyle = isArm && pos === 1 ? "#dc2626" : "#18181b";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(swX, swY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Bat Handle Cap
        ctx.fillStyle = isArm && pos === 1 ? "#dc2626" : "#18181b";
        ctx.beginPath();
        ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Switch Badge
        ctx.fillStyle = "#18181b";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, swX, swY - 16);
      };

      // SA (Top-Left Shoulder, 2-Pos Arm)
      drawSwitch(coords.sa.x, coords.sa.y, sa, 1, "SA", true, false);

      // SA Leader Line & Annotation
      ctx.strokeStyle = "#71717a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(coords.sa.x - 14, coords.sa.y);
      ctx.lineTo(cx - 280, coords.sa.y);
      ctx.lineTo(cx - 280, coords.sa.y - 28);
      ctx.stroke();

      ctx.fillStyle = "#09090b";
      ctx.font = "bold 9.5px monospace";
      ctx.textAlign = "left";
      ctx.fillText("[SA] 2-POS SAFETY ARM", 36, coords.sa.y - 32);
      ctx.font = "8.5px monospace";
      ctx.fillStyle = sa === 1 ? "#dc2626" : "#166534";
      ctx.fillText(sa === 1 ? "CH5: 2000µs (ARMED)" : "CH5: 1000µs (SAFE DISARM)", 36, coords.sa.y - 20);

      // SB (Left Face, 3-Pos Mode)
      drawSwitch(coords.sb.x, coords.sb.y, sb, 2, "SB", false, false);

      // SB Leader Line
      ctx.strokeStyle = "#71717a";
      ctx.beginPath();
      ctx.moveTo(coords.sb.x, coords.sb.y - 12);
      ctx.lineTo(coords.sb.x, cy - 195);
      ctx.lineTo(cx - 180, cy - 195);
      ctx.stroke();

      ctx.fillStyle = "#09090b";
      ctx.font = "bold 9.5px monospace";
      ctx.textAlign = "left";
      ctx.fillText("[SB] 3-POS FLIGHT MODE", 36, cy - 198);
      ctx.font = "8.5px monospace";
      ctx.fillStyle = "#71717a";
      const modeStr = sb === 0 ? "ANGLE (1000µs)" : (sb === 1 ? "HORIZON (1500µs)" : "ACRO (2000µs)");
      ctx.fillText(`CH6: ${modeStr}`, 36, cy - 186);

      // SC (Right Face, 3-Pos Rescue)
      drawSwitch(coords.sc.x, coords.sc.y, sc, 2, "SC", false, false);

      // SC Leader Line
      ctx.strokeStyle = "#71717a";
      ctx.beginPath();
      ctx.moveTo(coords.sc.x, coords.sc.y - 12);
      ctx.lineTo(coords.sc.x, cy - 195);
      ctx.lineTo(cx + 180, cy - 195);
      ctx.stroke();

      ctx.fillStyle = "#09090b";
      ctx.font = "bold 9.5px monospace";
      ctx.textAlign = "right";
      ctx.fillText("[SC] 3-POS GPS RESCUE", w - 36, cy - 198);
      ctx.font = "8.5px monospace";
      ctx.fillStyle = "#71717a";
      const scStr = sc === 0 ? "NORMAL (1000µs)" : (sc === 1 ? "POS HOLD (1500µs)" : "GPS RTH (2000µs)");
      ctx.fillText(`CH7: ${scStr}`, w - 36, cy - 186);

      // SD (Top-Right Shoulder, 2-Pos Momentary)
      drawSwitch(coords.sd.x, coords.sd.y, sd, 1, "SD", false, true);

      // SD Leader Line
      ctx.strokeStyle = "#71717a";
      ctx.beginPath();
      ctx.moveTo(coords.sd.x + 14, coords.sd.y);
      ctx.lineTo(cx + 280, coords.sd.y);
      ctx.lineTo(cx + 280, coords.sd.y - 28);
      ctx.stroke();

      ctx.fillStyle = "#09090b";
      ctx.font = "bold 9.5px monospace";
      ctx.textAlign = "right";
      ctx.fillText("[SD] 2-POS MOMENTARY ⟲", w - 36, coords.sd.y - 32);
      ctx.font = "8.5px monospace";
      ctx.fillStyle = sd === 1 ? "#dc2626" : "#71717a";
      ctx.fillText(sd === 1 ? "CH8: 2000µs (BEEP ALARM)" : "CH8: 1000µs (SILENT)", w - 36, coords.sd.y - 20);

      // S1 & S2 Analog Rotary Dials
      const drawPot = (px, py, val, label) => {
        ctx.strokeStyle = "#18181b";
        ctx.fillStyle = "#f4f4f5";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Degree ticks
        for (let a = -Math.PI * 0.75; a <= Math.PI * 0.75; a += Math.PI / 4) {
          const x1 = px + Math.cos(a) * 13;
          const y1 = py + Math.sin(a) * 13;
          const x2 = px + Math.cos(a) * 16;
          const y2 = py + Math.sin(a) * 16;
          ctx.beginPath();
          ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.stroke();
        }

        // Pointer Dot
        const angle = -Math.PI * 0.75 + ((val - 1000) / 1000) * (Math.PI * 1.5);
        ctx.fillStyle = "#18181b";
        ctx.beginPath();
        ctx.arc(px + Math.cos(angle) * 8, py + Math.sin(angle) * 8, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, px, py - 18);
      };

      drawPot(coords.s1.x, coords.s1.y, s1, "S1");
      drawPot(coords.s2.x, coords.s2.y, 1500, "S2");

      // 9. Monochrome CAD LCD Screen
      const scr = coords.screen;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 2;
      ctx.fillRect(scr.x, scr.y, scr.w, scr.h);
      ctx.strokeRect(scr.x, scr.y, scr.w, scr.h);

      // LCD Corner Screws
      ctx.fillStyle = "#71717a";
      ctx.beginPath();
      ctx.arc(scr.x + 4, scr.y + 4, 1.5, 0, Math.PI * 2);
      ctx.arc(scr.x + scr.w - 4, scr.y + 4, 1.5, 0, Math.PI * 2);
      ctx.arc(scr.x + 4, scr.y + scr.h - 4, 1.5, 0, Math.PI * 2);
      ctx.arc(scr.x + scr.w - 4, scr.y + scr.h - 4, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // LCD Content
      ctx.fillStyle = "#18181b";
      ctx.font = "bold 8.5px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CRSF 250Hz  100%LQ", cx, scr.y + 14);

      ctx.font = "8px monospace";
      ctx.fillText("BAT 8.2V  RSSI -68", cx, scr.y + 27);

      const flightModeText = sb === 0 ? "MODE: ANGLE" : (sb === 1 ? "MODE: HORIZON" : "MODE: ACRO");
      ctx.fillText(flightModeText, cx, scr.y + 40);

      // Armed / Disarmed Banner
      if (sa === 1 && !armingBlocked) {
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(scr.x + 6, scr.y + 50, scr.w - 12, 18);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 8.5px monospace";
        ctx.fillText("ARMED [LIVE]", cx, scr.y + 62);
      } else {
        ctx.strokeStyle = "#18181b";
        ctx.strokeRect(scr.x + 6, scr.y + 50, scr.w - 12, 18);
        ctx.fillStyle = "#18181b";
        ctx.font = "bold 8.5px monospace";
        ctx.fillText("DISARM [SAFE]", cx, scr.y + 62);
      }

      requestAnimationFrame(render);
    };

    render();
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.droneSims = new DroneSimulations();
  window.droneSims.init();
});
