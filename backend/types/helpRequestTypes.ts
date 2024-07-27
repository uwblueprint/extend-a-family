export type HelpRequestDTO = {
  id: string;
  message: string;
  learner: string;
  facilitator: string;
  unit: string;
  module: string;
  page: string;
};

export type CreateHelpRequestDTO = Omit<HelpRequestDTO, "id">;

// export type GetHelpRequestDTO = TODO
