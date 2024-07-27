export interface HelpRequest extends Document {
  id: string;
  message: string;
  learner: string;
  facilitator: string;
  unit: string;
  module: string;
  page: string;
}
