class GradeNotificationService extends NotificationListener {
  constructor(notificationUI) {
    this.notificationUI = notificationUI;
  }

  Update(message) {
    this.notificationUI.DisplayMessage(message);
  }
}
