"use client";

import { useParams } from "next/navigation";

import { registry } from "../registry";
import { StoryFrame } from "../story-frame";

export default function ParityStoryPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const entry = registry[storyId];

  if (!entry) {
    return (
      <div style={{ padding: 16, fontFamily: "monospace" }}>
        <p>Unknown story id: {storyId}</p>
        <ul>
          {Object.keys(registry).map((id) => (
            <li key={id}>
              <a href={`/pro/__parity/${id}`}>{id}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <StoryFrame key={storyId} meta={entry.meta} story={entry.story} />;
}
