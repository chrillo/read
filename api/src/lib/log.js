
export const log = (channel, ...args) => {
    console.log(`[${channel}] `, ...args);
};
  
export const error = (channel, ...args)=> {
    console.error(`[${channel}] `, ...args);
};
  
export const warn = (channel, ...args) => {
    console.warn(`[${channel}] `, ...args);
};
  