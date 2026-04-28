let ioInstance = null;

export const setIo = (io) => {
  ioInstance = io;
};

export const getIo = () => ioInstance;

export const emitSocketEvent = (eventName, payload) => {
  if (!ioInstance) {
    return;
  }

  ioInstance.emit(eventName, payload);
};

