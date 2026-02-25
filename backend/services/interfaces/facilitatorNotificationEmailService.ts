interface IFacilitatorNotificationEmailService {
  sendPendingNotificationEmails(facilitatorId: string): Promise<void>;
}

export default IFacilitatorNotificationEmailService;
