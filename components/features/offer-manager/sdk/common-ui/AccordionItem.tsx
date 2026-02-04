"use client";

/**
 * AccordionItem - Collapsible section component
 *
 * Ported from: kigo-web-sdks/packages/common-ui/src/lib/components/accordionItem/AccordionItem.tsx
 */

import { ArrowDropDown } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";

type AccordionItemProps = {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  detailsSx?: SxProps<Theme>;
};

export function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
  detailsSx,
}: AccordionItemProps) {
  return (
    <Accordion
      disableGutters
      expanded={isOpen}
      onChange={onToggle}
      data-testid="accordion-item"
      sx={{ background: "transparent" }}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDown />}
        sx={{
          justifyContent: "flex-start",
          "& .MuiAccordionSummary-content": {
            flexGrow: 0,
          },
        }}
        data-testid="accordion-item-summary"
      >
        <Typography
          variant="bodyMdBold"
          color="kigo.charcoal"
          data-testid="accordion-item-title"
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ padding: 0, ...detailsSx }}
        data-testid="accordion-item-details"
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
