import React from "react";
import { Card, Table } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DataTable: React.FC<{
  tableHeaderContent: React.ReactNode;
  tableBodyContent: React.ReactNode;
  paginationControls: React.ReactNode;
  className?: string;
}> = ({
  tableHeaderContent,
  tableBodyContent,
  paginationControls,
  className,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      <Card className="overflow-hidden rounded-md">
        <div className="p-0">
          <Table>
            {tableHeaderContent}
            {tableBodyContent}
          </Table>
        </div>
        {paginationControls}
      </Card>
    </div>
  );
};

export default DataTable;
