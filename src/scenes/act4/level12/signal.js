export const COMMAND = "RED";
export const SIGNAL_TEXT = COMMAND;

export const isSignal = (value) => value.trim().toUpperCase() === COMMAND;
