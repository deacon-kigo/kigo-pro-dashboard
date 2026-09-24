import type { InferType } from "yup";

import * as yup from "yup";

import { FEEDBACK_TYPES } from "../constants";

const FEEDBACK_TYPE_LABELS = FEEDBACK_TYPES.map((type) => type.label);

const FeedbackFormSchema = yup.object({
  description: yup.string().trim().required("Description is required"),
  feedbackType: yup
    .object({
      label: yup
        .string()
        .required("Feedback type label is required")
        .oneOf(
          FEEDBACK_TYPE_LABELS,
          `Feedback type label must be one of the following values: ${FEEDBACK_TYPE_LABELS.join(", ")}`
        ),
      value: yup
        .string()
        .required("Feedback type value is required")
        .oneOf(
          FEEDBACK_TYPE_LABELS,
          `Feedback type value must be one of the following values: ${FEEDBACK_TYPE_LABELS.join(", ")}`
        ),
    })
    .required("Feedback type is required"),
  subject: yup
    .string()
    .trim()
    .required("Subject is required")
    .max(50, "Subject must be less than 50 characters"),
});

type FeedbackFormValues = InferType<typeof FeedbackFormSchema>;

export { FeedbackFormSchema, type FeedbackFormValues };
