import React, { useState, useEffect, useRef, useMemo } from "react";
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
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { generateCoverageImprovement } from "@/services/ai/tools";
import { useSelector } from "react-redux";
import { selectCriteria } from "@/lib/redux/selectors/productFilterSelectors";
import {
  CoverageBarChart,
  CoverageDonutChart,
  CategoryPieChart,
  CoverageMapChart,
} from "@/components/molecules/charts/coverage-charts";

interface FilterCoveragePanelProps {
  coverageStats: FilterCoverageStats | null;
  isLoading?: boolean;
  onApplySuggestion?: (suggestionValue: string) => void;
}

// Loading skeleton component extracted for reuse and cleaner code
const CoverageLoadingSkeleton: React.FC<{ isCard?: boolean }> = ({
  isCard = false,
}) => {
  const content = (
    <div className="animate-pulse space-y-5">
      {/* Overall coverage skeleton */}
      <div className="bg-gray-50/50 p-3 rounded-lg border">
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="flex justify-center items-center">
          <div className="h-28 w-28 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex justify-between mt-3">
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>

      {/* Geographic distribution skeleton */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>

      {/* Categories skeleton */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="h-36 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (isCard) {
    return <Card className="p-4 border rounded-md h-full">{content}</Card>;
  }

  return content;
};

// Empty state component
const EmptyCoverageState: React.FC = () => (
  <div className="flex flex-col justify-center items-center text-center py-4">
    <BuildingStorefrontIcon className="h-12 w-12 text-gray-300 mb-2" />
    <h3 className="text-lg font-medium text-gray-500">No Coverage Data</h3>
    <p className="text-sm text-gray-400 mt-1">
      Add filter criteria to see offer coverage statistics
    </p>
  </div>
);

const FilterCoveragePanel: React.FC<FilterCoveragePanelProps> = ({
  coverageStats,
  isLoading = false,
  onApplySuggestion,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInsideAccordion, setIsInsideAccordion] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const filterCriteria = useSelector(selectCriteria);

  // Memoize expensive calculations to prevent recalculation on re-renders
  // IMPORTANT: Move all useMemo hooks before any conditional returns
  const suggestions = useMemo(() => {
    if (!coverageStats) return [];

    return coverageStats.coveragePercentage < 30
      ? generateCoverageImprovement(coverageStats, filterCriteria)
      : [];
  }, [coverageStats, filterCriteria]);

  // Estimate total system offers based on coverage percentage
  const estimatedTotalSystemOffers = useMemo(() => {
    if (!coverageStats || coverageStats.coveragePercentage <= 0) return 0;

    return Math.round(
      (coverageStats.totalOffers / coverageStats.coveragePercentage) * 100
    );
  }, [coverageStats]);

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

  // Handle loading state
  if (isLoading) {
    return isInsideAccordion ? (
      <CoverageLoadingSkeleton isCard={false} />
    ) : (
      <CoverageLoadingSkeleton isCard={true} />
    );
  }

  // Handle empty state
  if (!coverageStats) {
    return <EmptyCoverageState />;
  }

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

        <div className="flex items-center justify-center w-full h-36">
          <CoverageDonutChart
            percentage={coverageStats.coveragePercentage}
            height={140}
            className="w-36 h-36"
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

        <div className="mt-2 pt-2 border-t text-xs text-center text-gray-500">
          {coverageStats.totalOffers.toLocaleString()} of{" "}
          {estimatedTotalSystemOffers.toLocaleString()} offers match your
          criteria
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
          <div className="p-3 bg-amber-100 flex items-center justify-between">
            <div className="flex items-center">
              <SparklesIcon className="h-4 w-4 text-amber-500 mr-2" />
              <h4 className="text-sm font-medium text-amber-700">
                AI Coverage Suggestions
              </h4>
              <Badge
                variant="outline"
                className="ml-2 bg-amber-200/50 border-amber-300 text-amber-800 text-[10px]"
              >
                {suggestions.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setShowSuggestions(false)}
            >
              <XMarkIcon className="h-4 w-4 text-amber-700" />
            </Button>
          </div>
          <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
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
                    className="ml-2 text-xs h-7 px-2 whitespace-nowrap flex-shrink-0"
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
        <div className="flex items-center mb-3">
          <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
          <h4 className="text-sm font-medium">
            Geographic Distribution ({coverageStats.geographicCoverage.type})
          </h4>
        </div>

        {/* Always show the map visualization */}
        <CoverageMapChart
          data={coverageStats.geographicCoverage.regions}
          type={coverageStats.geographicCoverage.type}
          height={250} // Make it slightly taller since it's the only visualization
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
          className="p-3 rounded-md bg-red-50 border border-red-200 flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="text-sm font-medium mb-1 text-red-800">
              Low Coverage Warning
            </div>
            <div className="text-xs text-red-700">
              Your current filter criteria are very restrictive, resulting in
              low coverage.
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs bg-red-100 hover:bg-red-200 text-red-800 flex-shrink-0 ml-2"
            onClick={() => setShowSuggestions(true)}
          >
            <LightBulbIcon className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
            View Suggestions
            {suggestions.length > 0 && (
              <Badge
                variant="outline"
                className="ml-1.5 h-4 min-w-4 px-1 text-[10px] bg-amber-100 border-amber-300"
              >
                {suggestions.length}
              </Badge>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );

  // Return the same content for both views
  return chartContent;
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(FilterCoveragePanel);
