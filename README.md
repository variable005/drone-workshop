# 4-Day Drone Workshop Masterclass

An interactive, minimalist, zero-gradient web application for a comprehensive 24-hour drone engineering workshop (4 Days × 6 Hours/Day).

Built with semantic HTML5, Vanilla CSS, Canvas-based physics simulations, projector-ready slide decks, and topic-by-topic knowledge checks.

---

## Workshop Curriculum (24 Hours)

### Day 1: Flight Principles, Forces & Core Electronics (Hours 1–6)
* **Hour 1:** Introduction to UAVs, multirotor geometry, and airframe center of gravity (CoG).
* **Hour 2–3:** Aerodynamics of flight: The 4 forces (Thrust, Weight, Lift, Drag) and airfoil theory.
* **Hour 4:** How quadcopters move: Torque balance, why 2 motors spin CW and 2 spin CCW, Pitch, Roll, Yaw, and Throttle dynamics.
* **Hour 5–6:** Brushless DC (BLDC) motors (stator sizes, KV ratings), Electronic Speed Controllers (ESCs, MOSFET switching), and LiPo battery chemistry and safety.

### Day 2: Frame Assembly, Sizing & Safe Wiring (Hours 7–12)
* **Hour 7–8:** Carbon fiber airframes and Thrust-to-Weight Ratio (TWR) calculations.
* **Hour 9–10:** Radio control systems (Transmitters, Receivers, CRSF / SBUS protocols, AETR channel mapping) and workbench preparation.
* **Hour 11–12:** Precision soldering techniques, motor phase wire direction swap rule, low-ESR filtering capacitors, and pre-power Smoke Stopper continuity testing.

### Day 3: Sensors, Autopilot & PID Control (Hours 13–18)
* **Hour 13–14:** Flight Controller (FC) architecture and Inertial Measurement Units (3-axis Gyroscopes and Accelerometers).
* **Hour 15–16:** Sensor fusion (Complementary & Kalman filters) and closed-loop PID control loops (Proportional, Integral, Derivative).
* **Hour 17–18:** Firmware configuration (Betaflight/ArduPilot), accelerometer calibration, flight modes (Angle vs Acro), and motor direction checks (props off).

### Day 4: Autonomous Missions, Troubleshooting & Field Safety (Hours 19–24)
* **Hour 19–20:** Ground Control Stations (Mission Planner, QGroundControl), autonomous waypoint navigation, photogrammetry grids, geofencing, and Return-to-Launch (RTL).
* **Hour 21–22:** Systematic diagnostic matrix for flips on takeoff, motor overheating, gyro noise, and GPS "toilet-bowling".
* **Hour 23–24:** Professional pre-flight checklist, field emergency disarming, and aviation airspace laws (400ft/120m AGL ceiling, VLOS).

---

## Interactive Simulations Suite (14 Tools)

1. **3D Flight Physics & Motor Torque**: Real-time control of Throttle, Pitch, Roll, and Yaw showing individual motor RPMs, thrust arrows, and reactive torque cancellation.
2. **Thrust-to-Weight Ratio Calculator**: Input frame weight, motor type, and battery cells to calculate hover throttle % and flight suitability.
3. **LiPo Battery Curve & Safety**: Interactive discharge curve with 3.85V storage charge and critical damage warning zones.
4. **Circuit Wiring & Smoke Stopper**: Test for short circuits, backward capacitor polarity, and motor wire swaps before applying power.
5. **PID Attitude Balance Lab**: Pivot beam with real-time plotting against wind gusts and push disturbances to demonstrate P oscillation and D damping.
6. **Sensor Fusion Visualizer**: Side-by-side comparison of raw noisy Accelerometer, drifting Gyroscope, and rock-solid filtered angle.
7. **Autonomous Waypoint Mission Simulator**: Clickable waypoint map with autonomous drone flight and radio loss RTL failsafe triggers.
8. **Diagnostic Fault Matrix**: Step-by-step interactive resolution checklist for the 5 most common drone build problems.
9. **RF Link Budget & Antennas**: Link margin, Friis path loss, dipole donut radiation pattern, and ExpressLRS LoRa sensitivity.
10. **Radio Controller Blueprint & Switches**: Mode 2 gimbals, AETR channel mapping, and safety switches.
11. **Gravity, Thrust & Altitude Dynamics**: Dynamic vertical climb vs gravity physics simulator.
12. **Propeller Aerodynamics & Ground Effect**: Rotor wash cushion and pitch angle airflow.
13. **ESC & 3-Phase BLDC Commutation**: 6-MOSFET H-bridge inverter, 6-step trapezoidal sequence, and sensorless Back-EMF zero-crossing detection.
14. **Hardware Assembly & Wiring Blueprint (Pixhawk & APM 2.8)**: Complete step-by-step physical drone assembly guide with dual controller toggle, PDB soldering, motor direction rules, jumper settings, and pre-power safety checks.

---

## Slide Deck Mode

Includes 40 projector-ready presentation slides across all 4 days with keyboard navigation (`←`, `→`, `Space`), day picker, key takeaways, and direct simulation shortcuts.

---

## Topic Questionnaires

12 interactive quizzes (3 per day, 36 total questions) providing instant feedback, explanations, and workshop score tracking.

---

## Getting Started

Serve locally with any static web server:

```bash
# Python
python3 -m http.server 8080

# Or Node.js
npx serve .
```

Open `http://localhost:8080` in your web browser.

a project by -  Hariom Sharnam