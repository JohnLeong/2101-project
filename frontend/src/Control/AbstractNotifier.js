class AbstractNotifier {
  constructor() {
    this.listeners = [];
  }

  Attach(listener) {
    this.listeners.Add(listener);
  }

  Detach(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  Notify(message) {
    this.listeners.forEach((item) => item.Update(message));
  }
}
