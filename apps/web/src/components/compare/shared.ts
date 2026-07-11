export const COURSE_ASSETS = [
  "/compare/course-learn.svg",
  "/compare/course-test.svg",
  "/compare/course-certificate.svg",
] as const;

export const CODELESS_ASSETS = [
  "/compare/codeless-work.svg",
  "/compare/codeless-fail.svg",
  "/compare/codeless-ship.svg",
] as const;

export type StoryStage = {
  course: string;
  courseCaption: string;
  codeless: string;
  codelessCaption: string;
};
