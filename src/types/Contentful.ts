type ContentfulLink<TLinkType extends string> = {
  sys: {
    type: "Link";
    linkType: TLinkType;
    id: string;
  };
};

type LocalizedValue<T> = Record<"en-US", T>;

export interface ContentfulEntryEvent<TFields = Record<string, LocalizedValue<unknown>>> {
  metadata: {
    tags: unknown[];
    concepts: unknown[];
  };
  sys: {
    space: ContentfulLink<"Space">;
    id: string;
    type: "Entry";
    createdAt: string;
    updatedAt: string;
    environment: ContentfulLink<"Environment">;
    createdBy: ContentfulLink<"User">;
    updatedBy: ContentfulLink<"User">;
    publishedCounter: number;
    version: number;
    fieldStatus: Record<string, LocalizedValue<string>>;
    automationTags: unknown[];
    contentType: ContentfulLink<"ContentType">;
    urn: string;
  };
  fields: TFields;
}

export type CourseFields = {
  name: LocalizedValue<string>;
  image: LocalizedValue<ContentfulLink<"Asset">>;
  shortDescription: LocalizedValue<string>;
  description: LocalizedValue<string>;
  videoUrl: LocalizedValue<string>;
  lessons: LocalizedValue<ContentfulLink<"Entry">[]>;
};

export type LessonFields = {
  name: LocalizedValue<string>;
  order: LocalizedValue<number>;
  videoUrl: LocalizedValue<string>;
  content: LocalizedValue<string>;
  videoUrlForTasks: LocalizedValue<string>;
  tasksFile: LocalizedValue<ContentfulLink<"Asset">>;
  quiz: LocalizedValue<ContentfulLink<"Entry">>;
};

export type QuizFields = {
  name: LocalizedValue<string>;
  numberOfQuestions: LocalizedValue<number>;
  questions: LocalizedValue<ContentfulLink<"Entry">[]>;
};

export type QuestionFields = {
  name: LocalizedValue<string>;
  type: LocalizedValue<QuestionType>;
  image: LocalizedValue<ContentfulLink<"Asset">>;
  options: LocalizedValue<ContentfulLink<"Entry">[]>;
};

export type AnswerFields = {
  name: LocalizedValue<string>;
  isCorrect: LocalizedValue<boolean>;
  image: LocalizedValue<ContentfulLink<"Asset">>;
};

export type CourseEntryEvent = ContentfulEntryEvent<CourseFields>;
export type LessonEntryEvent = ContentfulEntryEvent<LessonFields>;
export type QuizEntryEvent = ContentfulEntryEvent<QuizFields>;
export type QuestionEntryEvent = ContentfulEntryEvent<QuestionFields>;
export type AnswerEntryEvent = ContentfulEntryEvent<AnswerFields>;

export enum ContentfulContentType {
  Course = "courses",
  Lesson = "lessons",
  Quiz = "quizes",
  Question = "questions",
  Answer = "answers",
}

export enum QuestionType {
  SingleChoice = "single",
  MultipleChoice = "multiple",
  OpenAnswer = "open",
}
