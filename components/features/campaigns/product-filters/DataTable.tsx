import React from "react";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
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
      <Card className="overflow-hidden rounded-lg">
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
