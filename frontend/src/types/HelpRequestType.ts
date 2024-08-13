export interface HelpRequest {
  id: string;
  message: string;
  learner: {
    id: string;
    firstName: string;
    lastName: string;
  };
  facilitator: string;
  unit: {
    id: string;
    displayIndex: number;
    title: string;
  };
  module: {
    id: string;
    displayIndex: number;
    title: string;
  };
  page: {
    id: string;
    displayIndex: number;
    title: string;
  };
  completed: boolean;
  createdAt: string;
}
