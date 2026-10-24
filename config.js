/*
  SCOUT REGIMENT DECODER — EDITABLE GAME DATA
  -------------------------------------------------
  Change codes/headings here without touching app.js.

  Codes still being finalized can remain null. In normal play they cannot be
  submitted until configured. Open index.html?dev=1 for testing controls.
*/
window.GAME_CONFIG = {
  cadetName: "KYLIAN",
  squadName: "KYLIAN & SQUAD",
  finalCode: "SAMEV",

  audio: {
    ambient: "audio/ambient.mp3",
    verified: "audio/verified.mp3",
    rejected: "audio/rejected.mp3",
    birthday: "audio/happy-birthday.mp3"
  },

  mission2RecoveredHeadings: [
    // Replace these four entries once the Mission 4 compass headings are locked.
    "SE 150 DEG",
    "SW 245 DEG",
    "NE 32 DEG",
    "NW 315 DEG"
  ],

  missions: [
    {
      id: 1,
      roman: "I",
      title: "THE ABANDONED BARRACKS",
      subtitle: "Route Recovery",
      image: "assets/images/mission-01.png",
      code: "5831",
      inputType: "numeric",
      transmission: "The route through the abandoned barracks has been recovered. Determine the only safe path to Extraction and transmit the four-digit field code.",
      hints: [
        "Not every road is safe. Use the field orders to eliminate routes that cannot be crossed.",
        "Begin at the marked entry point and follow only continuous, unblocked roads toward Extraction.",
        "Record the numbered checkpoints encountered on the valid route, in order."
      ],
      successTitle: "ROUTE VERIFIED",
      successText: "The safe route has been confirmed. Headquarters has authorized Mission 02.<br>You may proceed downstairs where the windows open to the road on the side and the screen lets you live your dream."
    },
    {
      id: 2,
      roman: "II",
      title: "THE COMPROMISED WAR ROOM",
      subtitle: "Intelligence Verification",
      image: "assets/images/mission-02.png",
      code: 7926,
      inputType: "numeric",
      transmission: "Eight reports were recovered from the War Table. Identify the four genuine transmissions, restore their order, and transmit the code hidden on their reverse sides.",
      hints: [
        "Exactly four reports are genuine. Compare the reports with one another rather than judging each report alone.",
        "The genuine reports form one continuous chain of movement.",
        "Follow the intelligence chain: named Titan → flare confirmation → usable bridge → Extraction status. Then turn over the four genuine reports in chronological order."
      ],
      successTitle: "INTELLIGENCE VERIFIED",
      successText: "The four authentic Scout reports have been confirmed. Headquarters has authorized Mission 03.<br>You may proceed to a place where you will be warmer in the winter"
    },
    {
      id: 3,
      roman: "III",
      title: "THE BROKEN TRANSMISSION",
      subtitle: "Signal Recovery",
      image: "assets/images/mission-03.png",
      code: 2303,
      inputType: "numeric",
      transmission: "Four damaged signal fragments remain. Recover one channel from each fragment and transmit the four channels in fragment order.",
      hints: [
        "The Mikasa piece is more than a collectible.",
        "Each Signal Fragment tells you something different about how the Mikasa piece must be positioned.",
        "Once the placement is correct, trust the blade. Record Signal Fragments 01 through 04 in order."
      ],
      successTitle: "TRANSMISSION RESTORED",
      successText: "All four signal fragments have been restored. Headquarters has authorized Mission 04.",
      specialSuccess: "recoveredHeadings"
    },
    {
      id: 4,
      roman: "IV",
      title: "THE BREACHED DISTRICT",
      subtitle: "Wall Defense",
      image: "assets/images/mission-04.png",
      code: "0324",
      inputType: "numeric",
      transmission: "Reconstruct the damaged district defense map. When the reconstruction is complete, locate the correct numbers on the district map and transmit them in tower order.",
      hints: [
        "The words ‘locate the correct numbers’ were highlighted for a reason.",
        "Something supplied with Mission 04 is designed to determine direction.",
        "Align the center symbol of the transparent compass with the matching symbol at each watchtower. Use the directional readings recovered after Mission 03; the first number on each heading is true."
      ],
      successTitle: "DEFENSE MAP VERIFIED",
      successText: "The four watchtower signals have been confirmed. Headquarters has authorized the final mission."
    },
    {
      id: 5,
      roman: "V",
      title: "FOR THE GLORY OF HUMANITY",
      subtitle: "Final Operations",
      image: "assets/images/mission-05.png",
      code: "SAMEV",
      inputType: "letters",
      transmission: "The previous operations were not isolated. Recover the marked letters from Missions 01–04 and place them in mission order. A fifth mark remains. The Captain carried the final mark himself.",
      hints: [
        "Four marks were left in plain sight.",
        "The marked letter from each of Missions 01–04 belongs with that mission’s token: I, II, III, IV.",
        "The fifth was carried by the Captain. Inspect Levi carefully."
      ],
      successTitle: "FINAL VALIDATION ACCEPTED",
      successText: "All five directives have been verified. The operation is complete.",
      specialSuccess: "finale"
    }
  ]
};
