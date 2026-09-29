// Quiz Bank for 4-Day Drone Workshop (6 Hours / Day)
// 12 Topics (3 topics per day), Multiple Choice with explanations

const QUIZ_DATA = {
  day1: [
    {
      topicId: "d1-t1",
      topicTitle: "Day 1 - Topic 1: Drone Types & Aerodynamic Forces",
      questions: [
        {
          id: "q1_1",
          question: "Which of the following describes the primary advantage of a multirotor (quadcopter) over a fixed-wing aircraft?",
          options: [
            "It can fly for many hours without a battery recharge",
            "It can hover in place and take off/land vertically (VTOL) without a runway",
            "It produces zero aerodynamic drag at high speeds",
            "It does not require electronic speed controllers"
          ],
          correct: 1,
          explanation: "Multirotors excel at vertical takeoff and landing (VTOL) and precision hovering without needing runways, making them ideal for aerial filming, inspection, and indoor flight."
        },
        {
          id: "q1_2",
          question: "What are the four primary physical forces acting on any drone during flight?",
          options: [
            "Thrust, Weight (Gravity), Lift, and Drag",
            "Voltage, Amperage, Resistance, and Capacitance",
            "Pitch, Roll, Yaw, and Throttle",
            "Velocity, Momentum, Inertia, and Friction"
          ],
          correct: 0,
          explanation: "The four fundamental aerodynamic forces are Thrust (upward force produced by spinning propellers), Weight/Gravity (downward force of the drone's mass), Lift (aerodynamic force created by prop airfoils), and Drag (air resistance opposing motion)."
        },
        {
          id: "q1_3",
          question: "When a quadcopter is in a steady, stationary hover at a constant altitude, what is the relationship between Thrust and Weight?",
          options: [
            "Thrust is twice as large as Weight",
            "Thrust is exactly equal to Weight",
            "Thrust is zero because the drone is not moving",
            "Weight is greater than Thrust"
          ],
          correct: 1,
          explanation: "According to Newton's First Law, when in a steady hover with no vertical acceleration, total upward thrust produced by the four motors exactly equals the total downward gravitational force (Weight)."
        }
      ]
    },
    {
      topicId: "d1-t2",
      topicTitle: "Day 1 - Topic 2: Quadcopter Movement & Torque Balance",
      questions: [
        {
          id: "q1_4",
          question: "Why do two motors on a quadcopter spin clockwise (CW) while the other two spin counter-clockwise (CCW)?",
          options: [
            "To prevent the motors from overheating",
            "To cancel out reactive rotational torque so the drone does not spin uncontrollably",
            "Because CW motors cannot generate upward lift",
            "To save 50% of battery power during hover"
          ],
          correct: 1,
          explanation: "According to Newton's Third Law, every action has an equal and opposite reaction. As a motor spins a propeller clockwise, it pushes the drone body counter-clockwise. By having two CW and two CCW motors, the opposing rotational torques cancel each other out."
        },
        {
          id: "q1_5",
          question: "How does a quadcopter tilt forward (Pitch down) to fly ahead?",
          options: [
            "It turns off all four motors temporarily",
            "It spins the rear two motors faster than the front two motors",
            "It spins the left two motors faster than the right two motors",
            "It mechanically angles the airframe using servos"
          ],
          correct: 1,
          explanation: "To pitch forward, the flight controller increases the speed (thrust) of the rear motors while decreasing the front motors. This tilts the frame forward, angling part of the total thrust vector horizontally to propel the drone forward."
        },
        {
          id: "q1_6",
          question: "How does a standard quadcopter rotate left or right on its vertical axis (Yaw)?",
          options: [
            "By tilting a rudder located at the back of the drone",
            "By increasing the speed of one diagonal motor pair (e.g. CW) while decreasing the other pair (CCW)",
            "By reversing the battery polarity to two motors",
            "By lowering the center of gravity"
          ],
          correct: 1,
          explanation: "Yaw is controlled by creating an imbalance in reactive torque. By speeding up the two CW motors and slowing down the two CCW motors, the net reactive torque rotates the drone body in the counter-clockwise direction without changing overall altitude."
        }
      ]
    },
    {
      topicId: "d1-t3",
      topicTitle: "Day 1 - Topic 3: Brushless Motors, ESCs & LiPo Batteries",
      questions: [
        {
          id: "q1_7",
          question: "What does the 'KV rating' on a brushless drone motor represent?",
          options: [
            "Kilovolts of maximum electrical insulation",
            "Rotations Per Minute (RPM) the motor spins per 1 Volt applied (with no load)",
            "The weight of the copper stator in grams",
            "The kinetic velocity of the drone in km/h"
          ],
          correct: 1,
          explanation: "KV stands for RPM per Volt. For example, a 2300KV motor powered by a 10V supply will spin at approximately 23,000 RPM under no load. Lower KV motors spin larger propellers with higher torque; higher KV motors spin smaller propellers at high speed."
        },
        {
          id: "q1_8",
          question: "What is the primary role of an Electronic Speed Controller (ESC)?",
          options: [
            "To convert DC battery power into precisely timed 3-phase AC signals to drive the brushless motor",
            "To connect the drone to home Wi-Fi networks",
            "To charge the LiPo battery while in flight",
            "To act as a mechanical brake for the propellers"
          ],
          correct: 0,
          explanation: "Brushless motors have 3 stator phases and cannot run directly on DC battery current. The ESC takes DC power from the battery and throttle signals from the flight controller, rapidly switching MOSFET transistors to create 3-phase alternating signals that spin the motor."
        },
        {
          id: "q1_9",
          question: "What is the nominal and safe storage voltage per cell for a standard Lithium Polymer (LiPo) battery?",
          options: [
            "1.50 Volts per cell",
            "3.80 to 3.85 Volts per cell",
            "4.50 Volts per cell",
            "0.00 Volts per cell"
          ],
          correct: 1,
          explanation: "LiPo cells have a fully charged voltage of 4.20V, a nominal voltage of 3.70V, and a safe storage voltage of 3.80V to 3.85V. Storing LiPo batteries fully charged or below 3.50V leads to chemical degradation, swelling, and fire hazard."
        }
      ]
    }
  ],
  day2: [
    {
      topicId: "d2-t1",
      topicTitle: "Day 2 - Topic 1: Airframes & Thrust-to-Weight Ratio",
      questions: [
        {
          id: "q2_1",
          question: "What is the recommended minimum Thrust-to-Weight Ratio (TWR) for a stable, responsive general-purpose quadcopter?",
          options: [
            "0.5 : 1 (Thrust is half of total weight)",
            "1.0 : 1 (Thrust exactly matches total weight)",
            "2.0 : 1 (Total max thrust is at least double the all-up weight)",
            "10.0 : 1 (Thrust is ten times total weight)"
          ],
          correct: 2,
          explanation: "A TWR of at least 2:1 is recommended. This allows the drone to hover comfortably at around 50% throttle, leaving ample headroom to climb, fight wind gusts, and execute attitude stabilization maneuvers."
        },
        {
          id: "q2_2",
          question: "What do the numbers '5045' indicate when stamped on a drone propeller?",
          options: [
            "50mm length and 45 grams weight",
            "5.0 inches diameter and 4.5 inches pitch (distance advanced per revolution in ideal fluid)",
            "5000 max RPM and 45 degrees blade angle",
            "Manufactured on May 4th, 2015"
          ],
          correct: 1,
          explanation: "Propeller codes follow the format Diameter x Pitch. '5045' means 5.0 inches from tip to tip, with a 4.5-inch pitch (the theoretical forward distance traveled through air during one complete 360-degree rotation)."
        },
        {
          id: "q2_3",
          question: "If a drone has an All-Up Weight (AUW) of 1,200 grams, how much thrust must each of the four motors produce to achieve a 2:1 Thrust-to-Weight Ratio?",
          options: [
            "300 grams per motor",
            "600 grams per motor",
            "1,200 grams per motor",
            "2,400 grams per motor"
          ],
          correct: 1,
          explanation: "Total thrust required for 2:1 TWR = 1,200g * 2 = 2,400 grams. Dividing across 4 motors: 2,400g / 4 = 600 grams of thrust per motor."
        },
        {
          id: "q2_rf1",
          question: "Why does pointing the physical tip of your handheld transmitter dipole antenna directly at your drone frequently cause a sudden signal drop or failsafe?",
          options: [
            "Because dipole antennas radiate in a torus (donut) pattern with near-zero energy (axial null) along the wire axis",
            "Because the signal speed drops below the speed of sound",
            "Because radio waves cannot travel in straight lines",
            "Because the battery voltage sags when the transmitter is tilted"
          ],
          correct: 0,
          explanation: "Dipole and monopole antennas exhibit a toroidal (donut-shaped) radiation pattern perpendicular to the wire element. Directly off the tips of the wire lies the axial null, where radiated energy approaches zero. The strongest signal always emits broadside (perpendicular) to the wire."
        },
        {
          id: "q2_rf2",
          question: "What happens to received signal strength when a vertically polarized transmitter antenna communicates with a drone whose antenna has rotated to horizontal (90° cross-polarization mismatch)?",
          options: [
            "The signal is amplified by 6 dB",
            "The signal suffers a 20 dB to 26 dB attenuation (over 99% received power loss)",
            "The radio automatically switches modulation from LoRa to Wi-Fi",
            "The link frequency doubles from 2.4 GHz to 5.8 GHz"
          ],
          correct: 1,
          explanation: "Cross-polarization attenuation occurs when the electromagnetic E-field vector is orthogonal (90° rotated) relative to the receiving antenna wire. In practice, this mismatch attenuates the signal by 20 dB to 26 dB (99% to 99.7% power loss), which is why aircraft should always utilize dual 90° diversity antennas."
        }
      ]
    },
    {
      topicId: "d2-t2",
      topicTitle: "Day 2 - Topic 2: Soldering & Clean Power Wiring",
      questions: [
        {
          id: "q2_4",
          question: "What is the purpose of 'tinning' wires and solder pads before joining them together?",
          options: [
            "To add extra weight to the drone arm",
            "To coat the bare copper with a thin layer of fresh solder, ensuring rapid heat transfer and a strong, void-free joint",
            "To insulate the wire from electrical current",
            "To cool down the soldering iron tip"
          ],
          correct: 1,
          explanation: "Tinning coats both the wire strands and the PCB pad with fresh solder and flux. When brought together with the iron, they melt instantaneously, preventing prolonged overheating of delicate PCB components."
        },
        {
          id: "q2_5",
          question: "How do you reverse the rotational direction of a 3-phase brushless motor connected to an ESC?",
          options: [
            "Reverse the main positive and negative battery leads into the PDB",
            "Swap any two of the three motor phase wires connecting the ESC to the motor",
            "Mount the motor upside down on the frame",
            "Use a different radio channel"
          ],
          correct: 1,
          explanation: "Swapping any two of the three AC phase wires reverses the order of the rotating magnetic field, changing the motor direction from CW to CCW or vice versa. (This can also be configured digitally in modern BLHeli/Bluejay firmware)."
        },
        {
          id: "q2_6",
          question: "What is a 'cold solder joint' and why is it dangerous in drone builds?",
          options: [
            "A joint soldered while the room temperature is below freezing",
            "A dull, grainy connection caused by insufficient heat or movement while cooling, leading to high resistance and inflight power failure",
            "A solder joint placed near the propeller downdraft",
            "A lead-free solder joint that stays cold to the touch"
          ],
          correct: 1,
          explanation: "A cold joint occurs when either the pad or wire wasn't heated sufficiently, or the joint moved while solidifying. It appears dull grey, forms poor mechanical bonding, and can disconnect under flight vibrations, causing an immediate crash."
        }
      ]
    },
    {
      topicId: "d2-t3",
      topicTitle: "Day 2 - Topic 3: Safe Power-Up & Continuity Testing",
      questions: [
        {
          id: "q2_7",
          question: "What tool should always be used before plugging in a LiPo battery to a freshly soldered drone build?",
          options: [
            "A hair dryer to warm up the circuits",
            "A multimeter continuity check (or a current-limiting Smoke Stopper)",
            "A magnetic compass to check polarity",
            "A magnifying glass to inspect radio frequencies"
          ],
          correct: 1,
          explanation: "A multimeter continuity test between the positive (red) and negative (black) battery pads ensures there is no direct short circuit. A 'Smoke Stopper' (resettable fuse or bulb) will trip immediately if a short exists, protecting expensive components from burning."
        },
        {
          id: "q2_8",
          question: "When bench testing motors and configuring software on your workbench, what is the golden safety rule?",
          options: [
            "Always wear sunglasses",
            "ALWAYS remove all propellers from the drone",
            "Set the transmitter throttle stick to 100%",
            "Keep the battery on charge while testing"
          ],
          correct: 1,
          explanation: "Carbon fiber and polycarbonate propellers can cause severe lacerations. If a configuration error or accidental arming occurs on the workbench, spinning props can inflict serious injury. Props must stay off until field flight testing."
        },
        {
          id: "q2_9",
          question: "What is the function of a low-ESR electrolytic capacitor soldered across the main battery pads?",
          options: [
            "To filter voltage spikes created by active motor braking (damping) and prevent electrical noise from corrupting video and sensors",
            "To provide 10 minutes of backup power if the battery unplugs",
            "To illuminate an LED indicator on the arm",
            "To increase total motor top speed by 25%"
          ],
          correct: 0,
          explanation: "Rapid ESC switching and regenerative motor braking generate dangerous high-voltage inductive spikes on the DC power rail. A low-ESR capacitor absorbs these spikes, protecting the flight controller and keeping video and gyro signals clean."
        }
      ]
    }
  ],
  day3: [
    {
      topicId: "d3-t1",
      topicTitle: "Day 3 - Topic 1: Flight Controller Sensors (IMU, Baro, Compass)",
      questions: [
        {
          id: "q3_1",
          question: "What are the two core sensors inside an Inertial Measurement Unit (IMU)?",
          options: [
            "A Barometer and a GPS antenna",
            "A 3-axis Gyroscope (angular velocity) and a 3-axis Accelerometer (linear acceleration & gravity)",
            "A Camera sensor and an ultrasonic distance sensor",
            "A Voltmeter and an Ammeter"
          ],
          correct: 1,
          explanation: "The IMU combines a 3-axis gyroscope (which measures how fast the drone is rotating in degrees/sec) and a 3-axis accelerometer (which measures linear acceleration and detects the gravity vector to determine which way is down)."
        },
        {
          id: "q3_2",
          question: "Why can a flight controller not rely solely on a gyroscope for long-term attitude stability?",
          options: [
            "Gyroscopes stop working when the drone moves forward",
            "Gyroscopes suffer from integration drift over time, causing estimated tilt angle to drift away from reality",
            "Gyroscopes only work in complete vacuum",
            "Gyroscopes require 240V AC power"
          ],
          correct: 1,
          explanation: "Gyroscopes measure rate of rotation (deg/s). To calculate tilt angle, the flight controller must integrate this rate over time. Small sensor biases accumulate continuously, causing angle drift. The accelerometer is used to correct this drift over time."
        },
        {
          id: "q3_3",
          question: "What sensor enables a drone to maintain steady altitude in 'Altitude Hold' mode?",
          options: [
            "A Barometric pressure sensor (measuring atmospheric pressure drop as altitude rises)",
            "A Magnetometer measuring Earth's magnetic poles",
            "An RF receiver measuring radio signal strength",
            "A temperature probe on the motor casing"
          ],
          correct: 0,
          explanation: "Atmospheric pressure decreases predictably with altitude. A precision barometric pressure sensor detects subtle pressure changes (down to centimeters of elevation), allowing the autopilot to maintain altitude automatically."
        }
      ]
    },
    {
      topicId: "d3-t2",
      topicTitle: "Day 3 - Topic 2: PID Control Loop Principles",
      questions: [
        {
          id: "q3_4",
          question: "In drone control theory, what does 'PID' stand for?",
          options: [
            "Power, Induction, Discharge",
            "Proportional, Integral, Derivative",
            "Position, Inertia, Distance",
            "Pulse, Input, Direction"
          ],
          correct: 1,
          explanation: "PID stands for Proportional, Integral, and Derivative. It is a closed-loop feedback algorithm that continuously calculates an error value between the pilot's desired angle and the drone's actual measured angle."
        },
        {
          id: "q3_5",
          question: "What symptom occurs if the Proportional (P) gain is set too high on a flight axis?",
          options: [
            "The drone becomes very sluggish and slow to respond",
            "The drone develops rapid, violent oscillations (fast shaking)",
            "The drone turns off all motors completely",
            "The battery voltage drops to zero immediately"
          ],
          correct: 1,
          explanation: "P-gain drives motor response proportional to current error. If P is set too high, the drone overshoots its target angle, then over-corrects in the opposite direction, creating rapid, high-frequency oscillations."
        },
        {
          id: "q3_6",
          question: "What is the primary role of the Derivative (D) term in PID tuning?",
          options: [
            "To accelerate the drone to maximum speed",
            "To act as a shock absorber/damper, resisting rapid changes and preventing overshoot from the P-term",
            "To store GPS waypoints in permanent flash memory",
            "To calibrate the compass during power-on"
          ],
          correct: 1,
          explanation: "The D-term calculates the rate of change of error. As the drone rapidly approaches its target angle, the D-term pushes in the opposite direction, acting like an aerodynamic shock absorber to prevent overshoot."
        }
      ]
    },
    {
      topicId: "d3-t3",
      topicTitle: "Day 3 - Topic 3: Firmware Configuration & Radio Setup",
      questions: [
        {
          id: "q3_7",
          question: "What is the standard radio channel acronym 'AETR' referring to?",
          options: [
            "Altitude, Elevation, Thrust, Range",
            "Aileron (Roll), Elevator (Pitch), Throttle, Rudder (Yaw)",
            "Auto, Emergency, Takeoff, Return",
            "Antenna, ESC, Telemetry, Receiver"
          ],
          correct: 1,
          explanation: "AETR defines the order of primary control channels transmitted by the radio: Channel 1 = Aileron/Roll, Channel 2 = Elevator/Pitch, Channel 3 = Throttle, Channel 4 = Rudder/Yaw."
        },
        {
          id: "q3_8",
          question: "What is the difference between 'Angle (Self-Level) Mode' and 'Acro (Rate) Mode'?",
          options: [
            "Angle mode limits maximum tilt and automatically levels the drone when the stick is centered; Acro mode controls rotation rate with no self-leveling",
            "Angle mode uses GPS; Acro mode uses Wi-Fi",
            "Angle mode only works indoors; Acro mode only works outdoors",
            "Angle mode turns off the gyroscopes"
          ],
          correct: 0,
          explanation: "In Angle/Level mode, stick deflection directly commands a tilt angle (e.g. 20 degrees), and releasing the stick returns the drone level. In Acro/Rate mode, stick deflection commands rotation speed (e.g. 200 deg/sec), and the drone stays tilted when sticks are released until countered."
        },
        {
          id: "q3_9",
          question: "Why must you calibrate the accelerometer while the drone is positioned on a dead-flat, level surface?",
          options: [
            "To set the permanent reference for 'zero tilt' in self-leveling flight modes",
            "To determine the north direction of Earth's magnetic field",
            "To set the maximum motor RPM limit",
            "To pair the radio receiver to the transmitter"
          ],
          correct: 0,
          explanation: "The accelerometer calibration records the gravity vector (1G downward) when the airframe is completely level. If calibrated on a tilted desk, the drone will perpetually drift in the direction of the false tilt during self-level flight."
        }
      ]
    }
  ],
  day4: [
    {
      topicId: "d4-t1",
      topicTitle: "Day 4 - Topic 1: Autonomous Missions & Fail-Safe Modes",
      questions: [
        {
          id: "q4_1",
          question: "What does the autonomous flight mode 'RTL' (Return To Launch) or 'RTH' do when activated?",
          options: [
            "Cuts motor power immediately to crash in place",
            "Climbs to a preset safe clearance altitude, flies directly back to the takeoff coordinates, and lands automatically",
            "Loops endlessly around the pilot in a 5-meter circle",
            "Transmits an SOS message over commercial cellular frequencies"
          ],
          correct: 1,
          explanation: "RTL (Return to Launch) uses stored GPS takeoff coordinates and barometer altitude. Upon trigger, the drone climbs above obstacles, navigates back home, hovers over the launch point, and touches down automatically."
        },
        {
          id: "q4_2",
          question: "What is a 'Geofence' in autonomous UAV mission planning?",
          options: [
            "A physical barbed wire barrier around the airfield",
            "A virtual 3D boundary (cylinder or polygon) programmed into the autopilot that prevents the drone from flying outside designated safe airspace",
            "A software tool for calibrating ESC motor endpoints",
            "A wireless charging pad on the ground"
          ],
          correct: 1,
          explanation: "A geofence defines virtual spatial boundaries (maximum distance from home and maximum altitude). If the drone approaches or breaches the fence, the autopilot automatically halts, hovers, or triggers RTL."
        },
        {
          id: "q4_3",
          question: "What happens if a drone experiences a complete radio transmitter signal loss (RC link loss) with a properly configured Failsafe?",
          options: [
            "The drone continues flying in its last direction at full throttle indefinitely",
            "The flight controller detects the loss of signal packets and executes a programmed safety procedure (e.g., immediate RTL or controlled soft descent)",
            "The ESCs catch fire",
            "The drone resets to factory defaults in mid-air"
          ],
          correct: 1,
          explanation: "A properly configured failsafe monitors the receiver link. If pulses stop for more than a fraction of a second, the autopilot takes over and executes RTL or performs a slow descent to prevent dangerous flyaways."
        }
      ]
    },
    {
      topicId: "d4-t2",
      topicTitle: "Day 4 - Topic 2: Systematic Troubleshooting Guide",
      questions: [
        {
          id: "q4_4",
          question: "If a quadcopter flips upside down immediately upon applying throttle on its very first maiden takeoff, what is the most common cause?",
          options: [
            "Dead battery cells",
            "Incorrect propeller direction, incorrect motor spin direction, or incorrect Flight Controller board orientation",
            "The drone is too heavy to fly",
            "Wind turbulence on the ground"
          ],
          correct: 1,
          explanation: "An immediate aggressive flip on takeoff ('flip-of-death') almost always means the PID loop is fighting itself: either a motor is spinning the wrong direction, a prop is installed backward, or the FC board orientation in software does not match the actual physical arrow."
        },
        {
          id: "q4_5",
          question: "If a drone wanders in widening circular spirals during GPS Position Hold ('toilet-bowling'), what is the primary diagnosis?",
          options: [
            "Motor bearings are worn out",
            "Compass (magnetometer) calibration error or electromagnetic interference from high-current power cables near the compass",
            "The propellers are too large",
            "The barometer is covered by foam"
          ],
          correct: 1,
          explanation: "'Toilet-bowling' occurs when the compass heading disagrees with the GPS velocity vector. The autopilot tries to correct its position but heads in the wrong direction, creating a spiral. The compass must be calibrated and physically isolated from battery wiring."
        },
        {
          id: "q4_6",
          question: "What is the primary indicator of excessive physical vibration reaching the flight controller gyro?",
          options: [
            "Extremely hot motors after a short flight and persistent high-frequency mid-throttle oscillations",
            "Radio receiver antenna disconnection",
            "The camera lens fogging up",
            "Faster battery charging times"
          ],
          correct: 0,
          explanation: "Physical vibrations from bent props, unbalanced motors, or loose screws saturate the gyro. The D-term amplifies this high-frequency noise, commanding rapid motor corrections that cause motors to overheat and waste power."
        }
      ]
    },
    {
      topicId: "d4-t3",
      topicTitle: "Day 4 - Topic 3: Field Safety & Flight Regulations",
      questions: [
        {
          id: "q4_7",
          question: "What is the standard legal maximum operating altitude for recreational and commercial small drones (without special airspace waiver) in most aviation jurisdictions (DGCA, FAA, EASA)?",
          options: [
            "1,000 meters Above Ground Level (AGL)",
            "400 feet (approximately 120 meters) Above Ground Level (AGL)",
            "50 feet (15 meters) Above Ground Level",
            "There is no legal height limit"
          ],
          correct: 1,
          explanation: "The global standard maximum legal altitude for small unmanned aircraft is 400 feet (120 meters) Above Ground Level (AGL). This creates a crucial 100-foot safety buffer below the 500-foot minimum cruising floor for manned aircraft."
        },
        {
          id: "q4_8",
          question: "What does 'Visual Line of Sight' (VLOS) mean in safe drone operations?",
          options: [
            "The pilot can see the drone only through the camera goggles",
            "The pilot (or visual observer) maintains continuous, direct unaided visual contact with the drone to monitor its flight path and avoid obstacles",
            "The drone is tracked via radar screens",
            "The drone is flying within line-of-sight of a cellular tower"
          ],
          correct: 1,
          explanation: "Visual Line of Sight (VLOS) requires the pilot to clearly see the unmanned aircraft with their own eyes without binoculars or screens, ensuring they can judge orientation, distance, and avoid manned aircraft or obstacles."
        },
        {
          id: "q4_9",
          question: "What is the very first step in a standard Pre-Flight Safety Checklist before connecting the flight battery in the field?",
          options: [
            "Power on the Radio Transmitter and ensure throttle stick is zeroed / disarmed",
            "Start running towards the launch pad",
            "Spin all four propellers by hand at maximum speed",
            "Unplug the GPS antenna"
          ],
          correct: 0,
          explanation: "Rule #1 of RC safety: ALWAYS turn on the radio transmitter FIRST with throttle down and disarm switch active before powering the aircraft. If the aircraft powers on without an active transmitter signal, unpredicted receiver states could trigger accidental motor arming."
        }
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUIZ_DATA };
}
