export interface EmailMessage {
  to: string;
  from: string;
  cc?: string;
  subject: string;
  html: string;
}

export type Template =
  | 'claimRequestApproved.html'
  | 'claimRequestDeclined.html'
  | 'contributorAddedToPitch.html'
  | 'pitchApprovedNoWriter.html'
  | 'pitchApprovedWriter.html'
  | 'pitchDeclined.html'
  | 'userApproved.html'
  | 'userRejected.html';
