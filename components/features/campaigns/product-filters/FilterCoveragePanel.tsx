import React, { useState, useEffect, useRef } from "react";
import { FilterCoverageStats } from "@/services/ai/filterHandler";
import Card from "@/components/atoms/Card/Card";
import { Badge } from "@/components/atoms/Badge";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Button } from "@/components/atoms/Button";
import {
  InformationCircleIcon,
  MapPinIcon,
  TagIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { generateCoverageImprovement } from "@/services/ai/tools";
import { useSelector } from "react-redux";
import { selectCriteria } from "@/lib/redux/selectors/productFilterSelectors";
import {
  CoverageBarChart,
  CoverageDonutChart,
  CategoryPieChart,
} from "@/components/molecules/charts/coverage-charts";

interface FilterCoveragePanelProps {
  coverageStats: FilterCoverageStats | null;
  isLoading?: boolean;
  onApplySuggestion?: (suggestionValue: string) => void;
}

const FilterCoveragePanel: React.FC<FilterCoveragePanelProps> = ({
  coverageStats,
  isLoading = false,
  onApplySuggestion,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chartView, setChartView] = useState<"donut" | "bar">("donut");
  const [isInsideAccordion, setIsInsideAccordion] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const filterCriteria = useSelector(selectCriteria);

  // Check if the component is inside an accordion by looking at parent elements
  useEffect(() => {
    if (panelRef.current) {
      // Walk up the DOM tree to find if we're inside an AccordionContent
      let parent = panelRef.current.parentElement;
      while (parent) {
        // Check if the parent has a data attribute or class that indicates it's part of an accordion
        if (
          parent.classList.contains("px-4") &&
          parent.parentElement?.getAttribute("data-state") === "open"
        ) {
          setIsInsideAccordion(true);
          break;
        }
        parent = parent.parentElement;
      }
    }
  }, []);

  if (isLoading) {
    return isInsideAccordion ? (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-28 bg-gray-200 rounded"></div>
        </div>
      </div>
    ) : (
      <Card className="p-4 border rounded-md h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-28 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!coverageStats) {
    return (
      <div className="flex flex-col justify-center items-center text-center py-4">
        <BuildingStorefrontIcon className="h-12 w-12 text-gray-300 mb-2" />
        <h3 className="text-lg font-medium text-gray-500">No Coverage Data</h3>
        <p className="text-sm text-gray-400 mt-1">
          Add filter criteria to see offer coverage statistics
        </p>
      </div>
    );
  }

  // Generate AI suggestions if coverage is low
  const suggestions =
    coverageStats.coveragePercentage < 30
      ? generateCoverageImprovement(coverageStats, filterCriteria)
      : [];

  // Return the core content directly - no wrappers or headers
  const chartContent = (
    <div className="space-y-5" ref={panelRef}>
      {/* Overall coverage stats */}
      <div className="bg-gray-50 p-3 rounded-lg border flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Overall Coverage
          </span>
          <Badge
            variant={
              coverageStats.coveragePercentage >= 20 ? "default" : "destructive"
            }
          >
            {coverageStats.coveragePercentage}%
          </Badge>
        </div>

        <div className="flex items-center justify-center w-full">
          <CoverageDonutChart
            percentage={coverageStats.coveragePercentage}
            height={140}
          />
        </div>

        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <div>
            <div className="font-medium">
              {coverageStats.totalOffers.toLocaleString()}
            </div>
            <div>Offers</div>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {coverageStats.totalMerchants.toLocaleString()}
            </div>
            <div>Merchants</div>
          </div>
        </div>
      </div>

      {/* AI Suggestions Section - conditionally rendered */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border border-amber-200 bg-amber-50 rounded-md overflow-hidden"
        >
          <div className="p-3 bg-amber-100 flex items-center">
            <SparklesIcon className="h-4 w-4 text-amber-500 mr-2" />
            <h4 className="text-sm font-medium text-amber-700">
              AI Coverage Suggestions
            </h4>
          </div>
          <div className="p-3 space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-2 rounded border border-gray-100 text-sm"
              >
                <div className="flex-1 text-gray-700">{suggestion.text}</div>
                {onApplySuggestion && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-xs h-7 px-2"
                    onClick={() => onApplySuggestion(suggestion.value)}
                  >
                    Apply
                    <ArrowRightIcon className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Geographic distribution with chart - Enhanced to show geo clearly */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
            <h4 className="text-sm font-medium">
              Geographic Distribution ({coverageStats.geographicCoverage.type})
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() =>
              setChartView(chartView === "donut" ? "bar" : "donut")
            }
            title={`Switch to ${chartView === "donut" ? "bar" : "donut"} chart`}
          >
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        <CoverageBarChart
          data={coverageStats.geographicCoverage.regions}
          height={200}
        />
      </div>

      {/* Category distribution with chart */}
      <div>
        <div className="flex items-center mb-3">
          <TagIcon className="h-4 w-4 text-gray-500 mr-1" />
          <h4 className="text-sm font-medium">Top Categories</h4>
        </div>

        <CategoryPieChart
          data={coverageStats.topCategories}
          height={180}
          showLegend={true}
        />
      </div>

      {/* Warning when coverage is low */}
      {!showSuggestions && coverageStats.coveragePercentage < 20 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800"
        >
          <div className="text-sm font-medium mb-1">Low Coverage Warning</div>
          <div className="text-xs">
            Your current filter criteria are very restrictive, resulting in low
            coverage.
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 mt-1 h-7 px-2 text-xs"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              <LightBulbIcon className="h-3.5 w-3.5 mr-1 text-amber-500" />
              View Suggestions
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );

  // Return the same content for both views
  return chartContent;
};

export default FilterCoveragePanel;
