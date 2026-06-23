export const witty = {
  loading: [
    "rewinding the tape...",
    "dusting off the floppy disk...",
    "loading from tape drive...",
    "adjusting the rabbit ears...",
    "initializing the CRT...",
    "warming up the vacuum tubes...",
    "calibrating the flux capacitor...",
    "dialing up...",
  ],
  empty: [
    "wow, so empty. like a 90s website.",
    "no tasks. you're either free or failing.",
    "this space intentionally left blank.",
    "error 404: productivity not found.",
    "your todo list is a ghost town.",
    "nothing here. check back in 1985.",
  ],
  weather: [
    "looking outside the window...",
    "consulting the barometer...",
    "asking the weather rock...",
    "reading the entrails...",
  ],
  random: <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
};
