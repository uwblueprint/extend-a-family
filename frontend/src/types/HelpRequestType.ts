export interface HelpRequest {
  _id: string;
  message: string;
  learner: {
    firstName: string;
    lastName: string;
  };
  facilitator: string;
  unit: string;
  module: string;
  page: string;
  createdAt: string;
}
